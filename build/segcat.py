#!/usr/bin/env python3
"""Concatenate screencast segments (webm) into one PowerPoint-friendly H.264 mp4.
usage: segcat.py OUT.mp4 SEG1.webm SEG2.webm ... [--autocut] [--trim-head 0.25] [--poster T] [--hold-last 1.2]
 - every segment is re-scaled to 1920x1080 @30 fps; --trim-head drops the first N s of every segment except the first
   (the recorder repeats the previous static frame there)
 - --autocut removes blank/spinner windows detected from the pixels
 - fade-in on the first frame, fade-out on the last frame, last frame held for --hold-last seconds
"""
import argparse, json, subprocess, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from mkclip import autocut_windows, dur, FFMPEG

ap = argparse.ArgumentParser()
ap.add_argument("out"); ap.add_argument("segs", nargs="+")
ap.add_argument("--autocut", action="store_true")
ap.add_argument("--trim-head", type=float, default=0.3)
ap.add_argument("--poster", type=float, default=None)
ap.add_argument("--hold-last", type=float, default=1.0)
ap.add_argument("--crf", type=int, default=21)
ap.add_argument("--thr", type=float, default=0.012)
ap.add_argument("--min-run", type=float, default=0.4)
ap.add_argument("--speed", default="[]", help="[[seg_index,start,end,factor],...] on the SOURCE timeline of a segment")
a = ap.parse_args()
speeds = json.loads(a.speed)

parts, labels, k = [], [], 0
inputs = []
for si, seg in enumerate(a.segs):
    inputs += ["-i", seg]
    d = dur(seg)
    head = 0.0 if si == 0 else a.trim_head
    keeps, cur = [], head
    if a.autocut:
        for s, e in autocut_windows(seg, thr=a.thr, min_run=a.min_run):
            if s > cur: keeps.append((cur, s))
            cur = max(cur, e)
    if cur < d - 0.05: keeps.append((cur, d))
    for (s, e) in keeps:
        pts = [s, e]
        for (sj, ss, se, x) in speeds:
            if sj == si and se > s and ss < e:
                pts += [max(ss, s), min(se, e)]
        pts = sorted(set(round(p, 3) for p in pts))
        for i in range(len(pts) - 1):
            p0, p1 = pts[i], pts[i + 1]
            if p1 - p0 < 0.04: continue
            fac = 1.0
            for (sj, ss, se, x) in speeds:
                if sj == si and p0 >= ss - 1e-6 and p1 <= se + 1e-6: fac = x
            lab = f"v{k}"; k += 1
            parts.append(f"[{si}:v]trim=start={p0}:end={p1},setpts=(PTS-STARTPTS)/{fac},fps=30,scale=1920:1080:flags=lanczos,setsar=1[{lab}]")
            labels.append(f"[{lab}]")
fc = ";".join(parts) + ";" + "".join(labels) + f"concat=n={len(labels)}:v=1:a=0,tpad=stop_mode=clone:stop_duration={a.hold_last},fade=t=in:st=0:d=0.25,format=yuv420p[out]"
tmp = Path(a.out).with_suffix(".tmp.mp4")
subprocess.run([FFMPEG, "-v", "error", "-y", *inputs, "-filter_complex", fc, "-map", "[out]", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", str(a.crf),
                "-profile:v", "high", "-level", "4.1", "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(tmp)], check=True)
d = dur(tmp)
subprocess.run([FFMPEG, "-v", "error", "-y", "-i", str(tmp), "-vf", f"fade=t=out:st={max(0, d-0.35):.3f}:d=0.35", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", str(a.crf),
                "-profile:v", "high", "-level", "4.1", "-pix_fmt", "yuv420p", "-movflags", "+faststart", a.out], check=True)
tmp.unlink()
d = dur(a.out)
pt = a.poster if a.poster is not None else max(0.0, d - 1.8)
poster = str(Path(a.out).with_name(Path(a.out).stem + "_poster.png"))
subprocess.run([FFMPEG, "-v", "error", "-y", "-ss", f"{pt:.3f}", "-i", a.out, "-frames:v", "1", poster], check=True)
print(json.dumps({"out": a.out, "dur": round(d, 2), "poster": poster}))
