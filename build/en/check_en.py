#!/usr/bin/env python3
"""QA for the English edition of the deck.

Usage: python3 en/check_en.py out/deck_en.pptx [out/ko_before.pptx]

Checks (exit code 1 if any fails):
  - no Hangul (U+3131-U+D79D, U+AC00-U+D7A3) in any package part or file name; also no other CJK/kana/full-width characters
  - every XML part is well-formed, every relationship target exists, every part has a content type
  - 20 slides, 20 notes (all non-empty), 11 embedded videos, unique shape ids per slide
  - alt text (descr) has no local paths or file names and is plain English
  - no template leftovers in visible text or notes (undefined, NaN, [object, ${)
  - slide fonts are Aptos only
  - optional: same part list as a Korean build
"""
import re
import sys
import zipfile
import posixpath
import xml.etree.ElementTree as ET

LEFTOVER = re.compile(r"\bundefined\b|\bNaN\b|\[object|\$\{|\bnull\b")  # template/JS leftovers
HANGUL = re.compile(r"[\u3131-\uD79D\uAC00-\uD7A3]")
OTHER_CJK = re.compile(r"[\u3040-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF]")
NS = {
    "a": "http://schemas.openxmlformats.org/drawingml/2006/main",
    "p": "http://schemas.openxmlformats.org/presentationml/2006/main",
    "r": "http://schemas.openxmlformats.org/package/2006/relationships",
    "ct": "http://schemas.openxmlformats.org/package/2006/content-types",
}

path = sys.argv[1]
ko_path = sys.argv[2] if len(sys.argv) > 2 else None
z = zipfile.ZipFile(path)
names = [n for n in z.namelist() if not n.endswith("/")]
problems = []
notes = []


def bad(msg):
    problems.append(msg)
    print("FAIL:", msg)


def ok(msg):
    print("ok  :", msg)


# 1. Hangul / CJK in file names and contents
for n in names:
    if HANGUL.search(n) or OTHER_CJK.search(n):
        bad(f"non-English character in file name: {n}")
text_parts = [n for n in names if n.endswith((".xml", ".rels"))]
hangul_hits = cjk_hits = 0
for n in text_parts:
    t = z.read(n).decode("utf-8")
    h, c = HANGUL.findall(t), OTHER_CJK.findall(t)
    if h:
        hangul_hits += len(h)
        bad(f"Hangul in {n}: {''.join(sorted(set(h)))[:30]}")
    if c:
        cjk_hits += len(c)
        bad(f"other CJK in {n}: {''.join(sorted(set(c)))[:30]}")
if not hangul_hits and not cjk_hits:
    ok(f"no Hangul/CJK in {len(text_parts)} XML/rels parts and {len(names)} file names (docProps, slides, notes, alt text included)")

# 2. XML well-formedness
trees = {}
for n in text_parts:
    try:
        trees[n] = ET.fromstring(z.read(n))
    except ET.ParseError as e:
        bad(f"XML not well-formed: {n}: {e}")
ok(f"{len(trees)} XML parts well-formed") if len(trees) == len(text_parts) else None

# 3. Relationships and content types
missing = 0
for n in [n for n in text_parts if n.endswith(".rels")]:
    base = posixpath.dirname(posixpath.dirname(n))
    for rel in trees[n].findall("r:Relationship", NS):
        if rel.get("TargetMode") == "External":
            continue
        tgt = rel.get("Target")
        full = tgt.lstrip("/") if tgt.startswith("/") else posixpath.normpath(posixpath.join(base, tgt))
        if full not in names:
            missing += 1
            bad(f"{n}: target missing: {tgt}")
if not missing:
    ok("all relationship targets exist")
ct = trees["[Content_Types].xml"]
defaults = {d.get("Extension").lower() for d in ct.findall("ct:Default", NS)}
overrides = {o.get("PartName").lstrip("/") for o in ct.findall("ct:Override", NS)}
for n in names:
    if n == "[Content_Types].xml":
        continue
    if n not in overrides and n.rsplit(".", 1)[-1].lower() not in defaults:
        bad(f"no content type for {n}")
for o in overrides:
    if o not in names:
        bad(f"content-type override for missing part: {o}")
ok("content types cover every part")

# 4. Slides, notes, videos
slides = sorted([n for n in names if re.fullmatch(r"ppt/slides/slide\d+\.xml", n)], key=lambda s: int(re.findall(r"\d+", s)[-1]))
notes_parts = sorted([n for n in names if re.fullmatch(r"ppt/notesSlides/notesSlide\d+\.xml", n)], key=lambda s: int(re.findall(r"\d+", s)[-1]))
videos = [n for n in names if n.startswith("ppt/media/") and n.endswith(".mp4")]
(ok if len(slides) == 20 else bad)(f"{len(slides)} slides")
(ok if len(notes_parts) == 20 else bad)(f"{len(notes_parts)} notes slides")
(ok if len(videos) == 11 else bad)(f"{len(videos)} embedded videos")
fonts = set()
for i, s in enumerate(slides, 1):
    root = trees[s]
    ids = [e.get("id") for e in root.iter("{%s}cNvPr" % NS["p"])]
    if len(ids) != len(set(ids)):
        bad(f"slide {i}: duplicate shape ids")
    vis = " ".join(t.text or "" for t in root.iter("{%s}t" % NS["a"]))
    m = LEFTOVER.search(vis)
    if m:
        bad(f"slide {i}: template leftover '{m.group(0)}' in visible text")
    for e in root.iter("{%s}latin" % NS["a"]):
        fonts.add(e.get("typeface"))
    for e in root.iter("{%s}cNvPr" % NS["p"]):
        d = e.get("descr") or ""
        if d and (re.search(r"(/Users/|[A-Za-z]:\\|\\|assets/|\.png|\.mp4|\.jpg)", d) or re.search(r"[^\x20-\x7E]", d)):
            bad(f"slide {i}: suspicious alt text: {d!r}")
if fonts != {"Aptos"}:
    bad(f"slide fonts are not Aptos only: {sorted(fonts)}")
else:
    ok("slide text uses Aptos only")
for i, n in enumerate(notes_parts, 1):
    t = " ".join(x.text or "" for x in trees[n].iter("{%s}t" % NS["a"]))
    body = re.sub(r"\s+", " ", t).strip()
    notes.append(body)
    if len(body) < 40:
        bad(f"notes {i}: empty or too short")
    m = LEFTOVER.search(body)
    if m:
        bad(f"notes {i}: template leftover '{m.group(0)}'")
ok("notes present on all slides, no template leftovers") if not [p for p in problems if p.startswith(("notes", "slide"))] else None

# 5. Document properties
core = z.read("docProps/core.xml").decode("utf-8")
print("      title  :", re.search(r"<dc:title>(.*?)</dc:title>", core).group(1))
print("      subject:", re.search(r"<dc:subject>(.*?)</dc:subject>", core).group(1))

# 6. Parity with the Korean build
if ko_path:
    kz = zipfile.ZipFile(ko_path)
    kn = {n for n in kz.namelist() if not n.endswith("/")}
    only_en, only_ko = sorted(set(names) - kn), sorted(kn - set(names))
    if only_en or only_ko:
        bad(f"part list differs from the Korean build: only EN {only_en[:8]} | only KO {only_ko[:8]}")
    else:
        ok(f"same {len(names)} part names as the Korean build")

print()
print("RESULT:", "PASS" if not problems else f"FAIL ({len(problems)} problems)")
sys.exit(1 if problems else 0)
