#!/usr/bin/env python3
"""Text-fit check for the English deck, independent of any renderer.

Usage: python3 en/fitcheck.py out/deck_en.pptx [--margin 1.04] [--lh 1.053] [--all]

For every text box on every slide it wraps the text with the real Aptos advance widths (read from the PowerPoint app
bundle) and compares the wrapped height with the box height. Word wrapping breaks at spaces only (a no-break space never
breaks), which is slightly pessimistic. --margin widens all glyphs (1.04 = 4 % safety for renderer differences), --lh
scales the line height. Prints only the boxes that need more height than they have (or all boxes with --all).
"""
import re
import sys
import zipfile
import xml.etree.ElementTree as ET
from fontTools.ttLib import TTFont

DFONTS = "/Applications/Microsoft PowerPoint.app/Contents/Resources/DFonts/"
A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
P = "{http://schemas.openxmlformats.org/presentationml/2006/main}"
EMU = 914400.0
LINE = 2500 / 2048  # Aptos ascent+descent in em: single line spacing

args = [a for a in sys.argv[1:] if not a.startswith("--")]
margin = float(sys.argv[sys.argv.index("--margin") + 1]) if "--margin" in sys.argv else 1.0
if "--margin" in sys.argv:
    args.remove(sys.argv[sys.argv.index("--margin") + 1])
# --lh 1.053 simulates renderers that use the font's Windows ascent+descent (1.285 em) instead of hhea (1.221 em) for line height
lh = float(sys.argv[sys.argv.index("--lh") + 1]) if "--lh" in sys.argv else 1.0
if "--lh" in sys.argv:
    args.remove(sys.argv[sys.argv.index("--lh") + 1])
LINE *= lh
show_all = "--all" in sys.argv

fonts = {}
for bold, fn in ((False, "Aptos.ttf"), (True, "Aptos-Bold.ttf")):
    f = TTFont(DFONTS + fn)
    fonts[bold] = (f.getBestCmap(), f["hmtx"], f["head"].unitsPerEm)


def adv(ch, size, bold, spc):
    cmap, hmtx, upm = fonts[bold]
    g = cmap.get(ord(ch)) or cmap.get(ord("?"))
    return hmtx[g][0] / upm * size / 72 * margin + spc / 100 / 72


def tokens(runs):
    """[(char, size, bold, spc)] per character, split into words at plain spaces."""
    words, cur = [], []
    for text, size, bold, spc in runs:
        for ch in text:
            if ch == " ":
                if cur:
                    words.append(cur)
                    cur = []
                words.append([(" ", size, bold, spc)])
            else:
                cur.append((ch, size, bold, spc))
    if cur:
        words.append(cur)
    return words


def wrap_lines(runs, width):
    """Number of lines and the largest font size used per line."""
    lines, cur_w, cur_sz, any_text = [], 0.0, 0.0, False
    for word in tokens(runs):
        w = sum(adv(c, s, b, sp) for c, s, b, sp in word)
        sz = max(s for _, s, _, _ in word)
        is_space = word[0][0] == " "
        if not is_space and cur_w + w > width + 1e-6 and cur_w > 0:
            lines.append(cur_sz)
            cur_w, cur_sz = 0.0, 0.0
        if is_space and cur_w == 0:
            continue  # no leading spaces on a wrapped line
        cur_w += w
        cur_sz = max(cur_sz, sz)
        any_text = True
    if any_text or not lines:
        lines.append(cur_sz or 12)
    return lines


z = zipfile.ZipFile(args[0])
slides = sorted([n for n in z.namelist() if re.fullmatch(r"ppt/slides/slide\d+\.xml", n)], key=lambda s: int(re.findall(r"\d+", s)[-1]))
flagged = 0
for si, name in enumerate(slides, 1):
    root = ET.fromstring(z.read(name))
    for sp in root.iter(P + "sp"):
        tx = sp.find(P + "txBody")
        xf = sp.find(P + "spPr/" + A + "xfrm")
        if tx is None or xf is None:
            continue
        paras = tx.findall(A + "p")
        if not any("".join(t.text or "" for t in p.iter(A + "t")).strip() for p in paras):
            continue
        ext, off = xf.find(A + "ext"), xf.find(A + "off")
        bw, bh = int(ext.get("cx")) / EMU, int(ext.get("cy")) / EMU
        bp = tx.find(A + "bodyPr")
        li, ri, ti, bi = (int(bp.get(k, d)) / EMU for k, d in (("lIns", 91440), ("rIns", 91440), ("tIns", 45720), ("bIns", 45720)))
        # shapes (chevron, pentagon, ellipse) have a smaller text area; only check rectangles and rounded rectangles
        geom = sp.find(P + "spPr/" + A + "prstGeom")
        prst = geom.get("prst") if geom is not None else "rect"
        inner_w = bw - li - ri
        if prst in ("chevron", "homePlate", "ellipse"):
            inner_w *= 0.7
        total_h, nlines, shown = 0.0, 0, []
        for p in paras:
            ppr = p.find(A + "pPr")
            marl = int(ppr.get("marL", 0)) / EMU if ppr is not None else 0
            lnspc = 1.0
            spc_aft = 0.0
            if ppr is not None:
                ls = ppr.find(A + "lnSpc/" + A + "spcPct")
                if ls is not None:
                    lnspc = int(ls.get("val")) / 100000
                sa = ppr.find(A + "spcAft/" + A + "spcPts")
                if sa is not None:
                    spc_aft = int(sa.get("val")) / 100 / 72
            runs = []
            for r in p.findall(A + "r"):
                rp = r.find(A + "rPr")
                sz = int(rp.get("sz", 1800)) / 100 if rp is not None else 18
                bold = rp is not None and rp.get("b") == "1"
                spc = int(rp.get("spc", 0)) if rp is not None else 0
                runs.append(((r.find(A + "t").text or ""), sz, bold, spc))
            if not runs:
                sz = 12
                epr = p.find(A + "endParaRPr")
                if epr is not None and epr.get("sz"):
                    sz = int(epr.get("sz")) / 100
                total_h += sz * LINE * lnspc / 72
                continue
            shown.append("".join(t for t, *_ in runs))
            for sz in wrap_lines(runs, inner_w - marl):
                total_h += sz * LINE * lnspc / 72
                nlines += 1
            total_h += spc_aft
        avail = bh - ti - bi
        over = total_h - avail
        txt = " | ".join(shown)[:70]
        if over > 0.03 or show_all:
            flagged += over > 0.03
            print(f"slide {si:2d}  {'OVER ' if over > 0.03 else 'ok   '} box {bw:5.2f}x{bh:4.2f}  need {total_h:4.2f}  lines {nlines}  {txt!r}")
print(f"\n{flagged} box(es) predicted to overflow (margin {margin})")
sys.exit(1 if flagged else 0)
