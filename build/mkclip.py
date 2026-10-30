#!/usr/bin/env python3
"""Post-process a Playwright screencast (webm) into a PowerPoint-friendly H.264 mp4.

usage: mkclip.py SRC.webm DST.mp4 --skips "[[a,b],...]" [--lead 0.6 --tail 0.1] [--tail-trim 0] [--poster 12.3] [--speed "[[a,b,x],...]"]
 - skips: windows (seconds on the *source* timeline) to cut out (spinners / waits). `lead` keeps the click ripple
   after the window start; `tail` trims the end. Windows are kept only if still >0.3 s long after margins.
 - speed: windows to play faster (e.g. streaming text). x is the speed-up factor.
 - poster: time (seconds on the *output* timeline) for the poster PNG; default = last 1.6 s.
"""
import argparse, json, subprocess, sys
from pathlib import Path

FFMPEG = "/opt/homebrew/bin/ffmpeg"
FFPROBE = "/opt/homebrew/bin/ffprobe"


def dur(p):
    r = subprocess.run([FFPROBE, "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(p)], capture_output=True, text=True, check=True)
    return float(r.stdout.strip())



def autocut_windows(src, thr=0.012, min_run=0.4, fps=10, region=(0.20, 0.14, 1.0, 0.88)):
    """Return [(start,end)] windows (seconds, source timeline) where the main content area is (almost) empty:
    loading spinners / blank pages. Detected from the video itself, so it is independent of any script clock."""
    W, H = 480, 270
    p = subprocess.run([FFMPEG, "-v", "error", "-i", str(src), "-vf", f"fps={fps},scale={W}:{H}", "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True, check=True)
    buf = p.stdout
    n = len(buf) // (W * H)
    x0, y0, x1, y1 = int(region[0] * W), int(region[1] * H), int(region[2] * W), int(region[3] * H)
    low = []
    for i in range(n):
        fr = buf[i * W * H:(i + 1) * W * H]
        cnt = 0
        for y in range(y0, y1):
            row = fr[y * W + x0: y * W + x1]
            cnt += sum(1 for v in row if v < 238)
        ratio = cnt / ((x1 - x0) * (y1 - y0))
        low.append(ratio < thr)
    wins, i = [], 0
    while i < n:
        if low[i]:
            j = i
            while j < n and low[j]:
                j += 1
            if (j - i) / fps >= min_run:
                wins.append((i / fps, j / fps))
            i = j
        else:
            i += 1
    return wins

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src"); ap.add_argument("dst")
    ap.add_argument("--skips", default="[]")
    ap.add_argument("--speed", default="[]")
    ap.add_argument("--lead", type=float, default=0.6)
    ap.add_argument("--tail", type=float, default=0.1)
    ap.add_argument("--start", type=float, default=0.0, help="trim this many seconds from the start of the source")
    ap.add_argument("--end", type=float, default=None, help="end time on the source timeline")
    ap.add_argument("--poster", type=float, default=None)
    ap.add_argument("--crf", type=int, default=21)
    ap.add_argument("--scale", default="1920:1080")
    ap.add_argument("--autocut", action="store_true", help="cut loading/blank frames detected from the video itself")
    ap.add_argument("--thr", type=float, default=0.012)
    ap.add_argument("--min-run", type=float, default=0.4)
    a = ap.parse_args()

    total = dur(a.src)
    end = min(a.end if a.end else total, total)
    # normalise skip windows with margins
    cuts = []
    raw_skips = [tuple(x) for x in json.loads(a.skips)]
    if a.autocut:
        auto = autocut_windows(a.src, thr=a.thr, min_run=a.min_run)
        print("autocut windows:", [(round(x,2), round(y,2)) for x, y in auto], file=sys.stderr)
        # automatic windows are exact: no margins
        for s, e in auto:
            cuts.append((s, e))
    for s, e in raw_skips:
        s2, e2 = s + a.lead, e - a.tail
        if e2 - s2 > 0.3:
            cuts.append((s2, e2))
    cuts.sort()
    # keep segments
    keeps, cur = [], a.start
    for s, e in cuts:
        if s > cur:
            keeps.append((cur, s))
        cur = max(cur, e)
    if cur < end:
        keeps.append((cur, end))
    speeds = [tuple(x) for x in json.loads(a.speed)]

    parts, labels = [], []
    k = 0
    for (s, e) in keeps:
        # split keep segment further by speed windows
        pts = [s]
        for (ss, se, x) in speeds:
            if se > s and ss < e:
                pts += [max(ss, s), min(se, e)]
        pts.append(e)
        pts = sorted(set(round(p, 3) for p in pts))
        for i in range(len(pts) - 1):
            p0, p1 = pts[i], pts[i + 1]
            if p1 - p0 < 0.04:
                continue
            fac = 1.0
            for (ss, se, x) in speeds:
                if p0 >= ss - 1e-6 and p1 <= se + 1e-6:
                    fac = x
            lab = f"v{k}"
            parts.append(f"[0:v]trim=start={p0}:end={p1},setpts=(PTS-STARTPTS)/{fac}[{lab}]")
            labels.append(f"[{lab}]")
            k += 1
    fc = ";".join(parts) + ";" + "".join(labels) + f"concat=n={len(labels)}:v=1:a=0,fps=30,scale={a.scale}:flags=lanczos,fade=t=in:st=0:d=0.25,format=yuv420p[out]"
    # fade-out needs the final duration -> compute after a first pass; use a simple second step
    tmp = Path(a.dst).with_suffix(".tmp.mp4")
    cmd = [FFMPEG, "-v", "error", "-y", "-i", a.src, "-filter_complex", fc, "-map", "[out]", "-an",
           "-c:v", "libx264", "-preset", "slow", "-crf", str(a.crf), "-profile:v", "high", "-level", "4.1",
           "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(tmp)]
    subprocess.run(cmd, check=True)
    d = dur(tmp)
    # fade out the last 0.35 s
    cmd2 = [FFMPEG, "-v", "error", "-y", "-i", str(tmp), "-vf", f"fade=t=out:st={max(0, d-0.35):.3f}:d=0.35", "-an",
            "-c:v", "libx264", "-preset", "slow", "-crf", str(a.crf), "-profile:v", "high", "-level", "4.1",
            "-pix_fmt", "yuv420p", "-movflags", "+faststart", a.dst]
    subprocess.run(cmd2, check=True)
    tmp.unlink()
    d = dur(a.dst)
    pt = a.poster if a.poster is not None else max(0.0, d - 1.6)
    poster = str(Path(a.dst).with_name(Path(a.dst).stem + "_poster.png"))
    subprocess.run([FFMPEG, "-v", "error", "-y", "-ss", f"{pt:.3f}", "-i", str(Path(a.dst)), "-frames:v", "1", poster], check=True)
    print(json.dumps({"dst": a.dst, "dur": round(d, 2), "keeps": [(round(s, 2), round(e, 2)) for s, e in keeps], "poster": poster}))


if __name__ == "__main__":
    main()
