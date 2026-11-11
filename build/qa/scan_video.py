#!/usr/bin/env python3
"""Scans videos for Hangul on screen: extracts a frame every N seconds, OCRs it (Korean + English, macOS Vision) and reports any Hangul.

  python3 build/qa/scan_video.py assets/en/clips/*.mp4 en/video/*.mp4 [--every 2]

Exit code 1 if any frame contains Hangul. OCR is a safety net, not a proof: also look at the contact sheets.
"""
import argparse
import json
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
FFMPEG, FFPROBE = "/opt/homebrew/bin/ffmpeg", "/opt/homebrew/bin/ffprobe"
BIN = Path(tempfile.gettempdir()) / "ocr_hangul"


def build_tool():
    if not BIN.exists() or BIN.stat().st_mtime < (HERE / "ocr_hangul.swift").stat().st_mtime:
        subprocess.run(["swiftc", "-O", str(HERE / "ocr_hangul.swift"), "-o", str(BIN)], check=True)


def scan(video: Path, every: float):
    d = float(subprocess.run([FFPROBE, "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(video)], capture_output=True, text=True, check=True).stdout)
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run([FFMPEG, "-v", "error", "-i", str(video), "-vf", f"fps=1/{every}", "-q:v", "2", f"{tmp}/f_%05d.png"], check=True)
        files = sorted(Path(tmp).glob("f_*.png"))
        hits = []
        for i in range(0, len(files), 24):
            out = subprocess.run([str(BIN), *map(str, files[i:i + 24])], capture_output=True, text=True, check=True).stdout
            for ln in out.splitlines():
                o = json.loads(ln)
                if o.get("hangul"):
                    idx = int(Path(o["file"]).stem.split("_")[1]) - 1
                    hits.append((round(idx * every, 1), o["hangul"]))
    return hits, len(files), d


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("videos", nargs="+")
    ap.add_argument("--every", type=float, default=2.0)
    a = ap.parse_args()
    build_tool()
    bad = 0
    for v in a.videos:
        hits, n, d = scan(Path(v), a.every)
        print(f"{Path(v).name}: {n} frames ({d:.0f}s) -> {'OK, no Hangul' if not hits else str(len(hits)) + ' frame(s) with Hangul'}")
        for t, lines in hits:
            bad += 1
            print(f"   t={t}s  {lines[:4]}")
    sys.exit(1 if bad else 0)


if __name__ == "__main__":
    main()
