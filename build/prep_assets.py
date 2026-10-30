#!/usr/bin/env python3
"""슬라이드용 이미지 자산 생성: 어두운 배경(글로우), 1280px 포스터, 둥근 모서리 표지 이미지, 데모 맵 썸네일."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageOps, ImageChops

ROOT = Path(__file__).resolve().parent.parent
CLIPS = ROOT / "assets" / "clips"
OUT = ROOT / "assets" / "slide"
OUT.mkdir(parents=True, exist_ok=True)

W, H = 1280, 720


def glow_bg(name, base, glows):
    """base RGB 위에 부드러운 색 글로우를 겹친 1280x720 PNG (PIL만 사용)."""
    img = Image.new("RGB", (W, H), base)
    for (cx, cy, rx, ry, color, alpha) in glows:
        gw, gh = int(rx * W * 2), int(ry * H * 2)
        g = ImageOps.invert(Image.radial_gradient("L")).resize((gw, gh), Image.BICUBIC)
        g = g.point(lambda v, a=alpha: int(255 * (max(0.0, (v - 76) / 179.0) ** 1.5) * a))  # radial_gradient 값은 모서리에서 255 → 변 중앙(≈180)에서 0이 되도록 보정
        img.paste(Image.new("RGB", (gw, gh), color), (int(cx * W - gw / 2), int(cy * H - gh / 2)), g)
    noise = Image.effect_noise((W, H), 5).convert("RGB")  # 밴딩 방지
    img = ImageChops.add(img, noise, scale=1, offset=-128)
    img.save(OUT / name, optimize=True)


BASE = (11, 16, 32)
BLUE = (47, 124, 246)
PURPLE = (139, 92, 246)
glow_bg("bg_dark_foundry.png", BASE, [(0.05, 0.0, 0.55, 0.65, BLUE, 0.30), (1.0, 1.0, 0.45, 0.5, PURPLE, 0.10)])
glow_bg("bg_dark_copilot.png", (13, 11, 30), [(0.05, 0.0, 0.55, 0.65, PURPLE, 0.30), (1.0, 1.0, 0.45, 0.5, BLUE, 0.10)])
glow_bg("bg_dark_cover.png", (9, 13, 28), [(0.0, 0.05, 0.6, 0.75, BLUE, 0.34), (1.0, 0.95, 0.6, 0.75, PURPLE, 0.34)])
glow_bg("bg_dark_close.png", (9, 13, 28), [(0.5, 0.0, 0.8, 0.6, BLUE, 0.22), (0.5, 1.0, 0.8, 0.6, PURPLE, 0.22)])

POSTERS = {
    "f1": "f1_catalog", "f2": "f2_deploy", "f3": "f3_agent", "f4": "f4_guardrails", "f5": "f5_eval",
    "c1": "cp1_analyze", "c2": "cp2_design", "c3": "cp3_build_test", "c4": "cp4_review", "c5": "cp5_deploy", "c7": "cp7_guardrail",
}
for key, base in POSTERS.items():
    im = Image.open(CLIPS / f"{base}_poster.png").convert("RGB")
    im.resize((1280, round(1280 * im.height / im.width)), Image.LANCZOS).save(OUT / f"poster_{key}.png", optimize=True)
    t = im.resize((640, round(640 * im.height / im.width)), Image.LANCZOS)
    t.save(OUT / f"thumb_{key}.png", optimize=True)


def rounded(src, dst, width, radius):
    im = Image.open(src).convert("RGB")
    im = im.resize((width, round(width * im.height / im.width)), Image.LANCZOS)
    s = 3
    mask = Image.new("L", (im.width * s, im.height * s), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, im.width * s - 1, im.height * s - 1), radius=radius * s, fill=255)
    mask = mask.resize(im.size, Image.LANCZOS)
    out = Image.new("RGBA", im.size, (0, 0, 0, 0))
    out.paste(im, (0, 0), mask)
    out.save(dst, optimize=True)


rounded(CLIPS / "f3_agent_poster.png", OUT / "cover_foundry.png", 1400, 26)
rounded(CLIPS / "cp7_guardrail_poster.png", OUT / "cover_copilot.png", 1400, 26)

# 포털 왼쪽 메뉴(Create/Optimize 영역) 잘라내기 — 개요 슬라이드용
nav = Image.open(CLIPS / "f1_catalog_poster.png").convert("RGB").crop((0, 86, 364, 1010))
nav.save(OUT / "foundry_nav.png", optimize=True)
print("assets:", sorted(p.name for p in OUT.iterdir()))
