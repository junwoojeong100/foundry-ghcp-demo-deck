#!/usr/bin/env python3
"""Builds the narrated English demo video from the English clips, cards and Azure AI Speech narration.

  SPEECH_SUBSCRIPTION=<authorized subscription> python3 build/video/build_video.py [--out en/video] [--no-render]

Texts (cards + narration) live in script_en.py. Steps: render cards (cards.mjs) -> synthesize narration (tts.py, cached) ->
build one video+audio piece per segment (ffmpeg) -> concatenate, master loudness (-16 LUFS) -> mp4 + srt + chapters + poster.
Keep rendering light on a shared machine: ffmpeg runs with 2 threads.
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import textwrap
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent
sys.path.insert(0, str(HERE))
import tts  # noqa: E402
from script_en import CARDS, SEGMENTS, CLIP_DIR, NAME  # noqa: E402

FFMPEG, FFPROBE = tts.FFMPEG, tts.FFPROBE
WORK = Path("/tmp/video_work")
BG = "0x090D1C"
GAP = 0.32          # silence between narration sentences (s)
TITLE = "Microsoft Foundry × GitHub Copilot — AI app development, shown in demos"
COMMENT = "English edition. The narration is AI-generated with Azure AI Speech."
# Every segment is tagged limited-range BT.709 so players decode cards and clips with the same colors.
# (ffmpeg 8 does not apply -color_primaries/-color_trc to libx264, so the tags are passed as x264 parameters.)
TAG_709 = ["-color_range", "tv", "-colorspace", "bt709", "-x264-params", "colorprim=bt709:transfer=bt709:colormatrix=bt709:range=tv"]
RGB_TO_709 = "scale=out_color_matrix=bt709:out_range=tv:flags=accurate_rnd+full_chroma_int,format=yuv420p"
LEAD = 0.45         # narration starts this long after a card / clip starts
TAIL = 0.7          # card/clip stays this long after the last narration ends
CARD_MIN = 3.0


def run(cmd, **kw):
    kw.setdefault("check", True)
    return subprocess.run([str(c) for c in cmd], **kw)


def probe(path: Path) -> dict:
    out = run([FFPROBE, "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height:format=duration", "-of", "json", path], capture_output=True, text=True).stdout
    j = json.loads(out)
    return {"w": j["streams"][0]["width"], "h": j["streams"][0]["height"], "dur": float(j["format"]["duration"])}


def render_cards():
    WORK.mkdir(parents=True, exist_ok=True)
    spec = WORK / "cards.json"
    spec.write_text(json.dumps(CARDS, ensure_ascii=False))
    run(["node", HERE / "cards.mjs", spec, WORK / "cards"])


def place(pieces, first_at):
    """pieces: list of dict(text, wav, dur, at?) -> list of (start, piece); sentences never overlap."""
    t = first_at
    out = []
    for p in pieces:
        start = max(p.get("at", 0) if p.get("at") is not None else 0, t)
        out.append((start, p))
        t = start + p["dur"] + GAP
    return out


def synth_pieces(lines):
    res = []
    for ln in lines:
        item = {"t": ln} if isinstance(ln, str) else dict(ln)
        wav = tts.synth(item["t"], WORK / "tts")
        res.append({"text": item["t"], "cap": item.get("c", item["t"]), "wav": wav, "dur": tts.duration(wav), "at": item.get("at")})
    return res


def make_audio(placed, total, out_wav):
    cmd = [FFMPEG, "-y", "-v", "error", "-f", "lavfi", "-t", f"{total:.3f}", "-i", "anullsrc=r=48000:cl=mono"]
    for _, p in placed:
        cmd += ["-i", p["wav"]]
    if placed:
        parts = [f"[{i + 1}:a]adelay={int(s * 1000)}:all=1[a{i}]" for i, (s, _) in enumerate(placed)]
        mix = "[0:a]" + "".join(f"[a{i}]" for i in range(len(placed))) + f"amix=inputs={len(placed) + 1}:normalize=0:duration=first[m]"
        cmd += ["-filter_complex", ";".join(parts + [mix]), "-map", "[m]"]
    cmd += ["-ar", "48000", "-ac", "1", "-t", f"{total:.3f}", out_wav]
    run(cmd)


def make_card_video(card_id, total, out_mp4):
    png = WORK / "cards" / f"{card_id}.png"
    vf = f"fade=t=in:st=0:d=0.25,fade=t=out:st={max(0, total - 0.3):.3f}:d=0.3,{RGB_TO_709}"
    run([FFMPEG, "-y", "-v", "error", "-loop", "1", "-framerate", "30", "-t", f"{total:.3f}", "-i", png, "-vf", vf, "-r", "30",
         "-c:v", "libx264", "-preset", "veryfast", "-crf", "17", "-threads", "2", *TAG_709, "-an", out_mp4])


def make_clip_video(clip, total, out_mp4):
    src = CLIP_DIR / f"{clip}.mp4"
    info = probe(src)
    pre = "" if (info["w"], info["h"]) == (1920, 1080) else f"scale=1920:{round(1920 * info['h'] / info['w'] / 2) * 2},pad=1920:1080:0:(oh-ih)/2:color={BG},"
    hold = max(0.0, total - info["dur"])
    vf = f"{pre}fps=30,tpad=stop_mode=clone:stop_duration={hold:.3f},fade=t=in:st=0:d=0.2,fade=t=out:st={max(0, total - 0.25):.3f}:d=0.25,format=yuv420p"
    run([FFMPEG, "-y", "-v", "error", "-i", src, "-vf", vf, "-t", f"{total:.3f}", "-r", "30", "-c:v", "libx264", "-preset", "veryfast", "-crf", "17", "-threads", "2", *TAG_709, "-an", out_mp4])
    return info["dur"]


def srt_time(t: float) -> str:
    ms = int(round(t * 1000))
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def write_captions(out_dir: Path, srt, chapters):
    """.srt for YouTube and most players, .vtt for the <track> element on the web page (browsers do not read SRT), chapters as a YouTube-style list."""
    (out_dir / f"{NAME}.srt").write_text("\n\n".join(f"{i + 1}\n{srt_time(a0)} --> {srt_time(a1)}\n{txt}" for i, (a0, a1, txt) in enumerate(srt)) + "\n", encoding="utf-8")
    (out_dir / f"{NAME}.vtt").write_text("WEBVTT\n\n" + "\n\n".join(f"{srt_time(a0).replace(',', '.')} --> {srt_time(a1).replace(',', '.')}\n{txt}" for a0, a1, txt in srt) + "\n", encoding="utf-8")
    (out_dir / f"{NAME}.chapters.txt").write_text("\n".join(f"{int(t0) // 60:02d}:{int(t0) % 60:02d} {title}" for t0, title in chapters) + "\n", encoding="utf-8")


def _break_points(text: str):
    return [i for i, ch in enumerate(text) if ch == " "]


def _cue_chunks(text: str, max_line: int = 42):
    """Recursively split text into chunks that fit two lines of at most max_line characters (balanced, preferring breaks after punctuation)."""
    if len(text) <= max_line:
        return [text]
    cand = _break_points(text)
    if not cand:
        return [text]
    best = min(cand, key=lambda i: max(i, len(text) - i - 1))
    if max(best, len(text) - best - 1) <= max_line:
        return [text]          # fits on two lines
    mid = len(text) / 2
    sp = min(cand, key=lambda i: abs(i - mid) - (12 if text[i - 1] in ",;:." else 0))
    return _cue_chunks(text[:sp], max_line) + _cue_chunks(text[sp + 1:], max_line)


def cues_for(text: str, start: float, dur: float):
    chunks = _cue_chunks(text)
    total = sum(len(c) for c in chunks) or 1
    t, out = start, []
    for c in chunks:
        d = dur * len(c) / total
        if len(c) <= 42:
            lines = [c]
        else:
            cand = _break_points(c)
            sp = min(cand, key=lambda i: max(i, len(c) - i - 1))
            lines = [c[:sp], c[sp + 1:]]
        out.append((t, t + d, "\n".join(lines)))
        t += d
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=str(ROOT / "en" / "video"))
    ap.add_argument("--crf", type=int, default=22)
    ap.add_argument("--no-render", action="store_true", help="only synthesize narration and print the timeline")
    ap.add_argument("--srt-only", action="store_true", help="like --no-render, but also (re)write the .srt and .chapters.txt next to the video")
    a = ap.parse_args()
    out_dir = Path(a.out)
    out_dir.mkdir(parents=True, exist_ok=True)
    (WORK / "seg").mkdir(parents=True, exist_ok=True)
    if not (a.no_render or a.srt_only):
        render_cards()

    timeline, vlist, alist, srt, chapters = [], [], [], [], []
    t_abs = 0.0
    idx = 0
    for seg in SEGMENTS:
        parts = []  # (kind, id, video builder, duration, placed pieces)
        if seg.get("card"):
            pieces = synth_pieces(seg.get("intro", []))
            placed = place(pieces, LEAD)
            end = (placed[-1][0] + placed[-1][1]["dur"]) if placed else 0
            total = max(CARD_MIN, end + TAIL)
            parts.append(("card", seg["card"], total, placed))
        if seg.get("clip"):
            pieces = synth_pieces(seg.get("say", []))
            placed = place(pieces, LEAD)
            end = (placed[-1][0] + placed[-1][1]["dur"]) if placed else 0
            vdur = probe(CLIP_DIR / f"{seg['clip']}.mp4")["dur"]
            total = max(vdur, end + TAIL)
            parts.append(("clip", seg["clip"], total, placed))
        if seg.get("chapter"):
            chapters.append((t_abs, seg["chapter"]))
        for kind, ref, total, placed in parts:
            idx += 1
            vfile, afile = WORK / "seg" / f"{idx:02d}_{kind}.mp4", WORK / "seg" / f"{idx:02d}_{kind}.wav"
            if not (a.no_render or a.srt_only):
                (make_card_video if kind == "card" else make_clip_video)(ref, total, vfile)
                make_audio(placed, total, afile)
            vlist.append(vfile); alist.append(afile)
            for s, p in placed:
                for c0, c1, txt in cues_for(p["cap"], t_abs + s, p["dur"]):
                    srt.append((c0, c1, txt))
            timeline.append((round(t_abs, 2), round(total, 2), kind, ref))
            if a.no_render or a.srt_only:
                for s0, p in placed:
                    want = p.get("at")
                    late = "" if want is None else f"  (late by {s0 - want:+.1f}s)" if abs(s0 - want) > 0.05 else ""
                    print(f"    {ref:15s} {s0:6.1f} -> {s0 + p['dur']:6.1f}  {p['dur']:4.1f}s{late}  {p['text'][:60]}")
            t_abs += total
    print(f"total {t_abs:.1f}s ({t_abs / 60:.1f} min), {len(timeline)} pieces, {len(srt)} cues")
    if a.no_render or a.srt_only:
        for r in timeline:
            print(r)
        if a.srt_only:
            write_captions(out_dir, srt, chapters)
            print("srt + vtt + chapters written to", out_dir)
        return

    (WORK / "v.txt").write_text("".join(f"file '{p}'\n" for p in vlist))
    (WORK / "a.txt").write_text("".join(f"file '{p}'\n" for p in alist))
    # chapters (ffmetadata) + youtube-style list
    meta = [";FFMETADATA1"]
    for i, (t0, title) in enumerate(chapters):
        t1 = chapters[i + 1][0] if i + 1 < len(chapters) else t_abs
        meta += ["[CHAPTER]", "TIMEBASE=1/1000", f"START={int(t0 * 1000)}", f"END={int(t1 * 1000) - 1}", f"title={title}"]
    (WORK / "meta.txt").write_text("\n".join(meta) + "\n")
    mp4 = out_dir / f"{NAME}.mp4"
    run([FFMPEG, "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", WORK / "v.txt", "-f", "concat", "-safe", "0", "-i", WORK / "a.txt", "-i", WORK / "meta.txt",
         "-map", "0:v", "-map", "1:a", "-map_metadata", "2", "-c:v", "libx264", "-preset", "medium", "-crf", str(a.crf), "-profile:v", "high", "-pix_fmt", "yuv420p", *TAG_709, "-r", "30",
         "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", "-ac", "2", "-c:a", "aac", "-b:a", "192k", "-threads", "2", "-movflags", "+faststart",
         "-metadata", f"title={TITLE}", "-metadata", f"comment={COMMENT}", "-metadata:s:a:0", "language=eng", mp4])
    write_captions(out_dir, srt, chapters)
    run([FFMPEG, "-y", "-v", "error", "-ss", "1.2", "-i", mp4, "-frames:v", "1", "-q:v", "3", out_dir / f"{NAME}.poster.jpg"])
    print("written", mp4)


if __name__ == "__main__":
    main()
