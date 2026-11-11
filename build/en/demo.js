require("./lang");
const { b64, C, SEC, FONT, txt, pill, textW, rrect, rect, oval, labelBox, darkFooter } = require("../lib");
const assets = require("./assets");
const { mmss } = require("./fmt");

// Demo order used by the tracker (global numbers 1-11)
const ORDER = ["foundry", "foundry", "foundry", "foundry", "foundry", "copilot", "copilot", "copilot", "copilot", "copilot", "copilot"];

// slide number -> alt text of the video on that slide
const VIDEO_ALT = new Map();

function tracker(slide, pres, n) {
  const d = 0.15, gap = 0.1, cur = 0.27;
  const total = ORDER.length * d + (ORDER.length - 1) * gap + (cur - d);
  let x = 12.73 - total;
  const y = 0.36 + 0.15;
  ORDER.forEach((sec, i) => {
    const S = SEC[sec];
    const k = i + 1;
    if (k === n) {
      slide.addText(String(k), { shape: pres.shapes.OVAL, x, y: y - cur / 2, w: cur, h: cur, fill: { color: "FFFFFF" }, line: { type: "none" }, color: C.D_BG, fontFace: FONT, fontSize: 9, bold: true, align: "center", valign: "middle", margin: 0 });
      x += cur + gap;
    } else {
      oval(slide, pres, x, y - d / 2, d, { fill: S.dark, transparency: k < n ? 0 : 72 });
      x += d + gap;
    }
  });
}

// English titles are longer than the Korean ones: the largest size (pt) at which the title still fits on one line
const fitTitle = (title, maxW = 12.0) => [32, 30, 28, 26, 24].find((s) => textW(title, s) <= maxW) ?? 24;

/**
 * Demo video slide (dark background): title + large video + 3-4 "WATCH FOR" items + customer value.
 * cfg: { n, sec, key, title, sub, watch:[[badge, text, color?]], value, note, notes }
 * The clip, its poster and its aspect ratio come from the English asset folders (assets.js); PREVIEW=1 puts the poster
 * image instead of the video, which makes LibreOffice previews much faster (never use it for the deliverable).
 */
async function demoSlide(pres, cfg, page, total) {
  const S = SEC[cfg.sec];
  const slide = pres.addSlide({ masterName: S.master });

  const w1 = pill(slide, pres, `DEMO ${cfg.n}`, 0.6, 0.36, 0.3, { fill: S.dark, size: 12, charSpacing: 1, pad: 0.4 });
  txt(slide, S.name, { x: 0.6 + w1 + 0.16, y: 0.36, w: 4, h: 0.3, fontSize: 11, bold: true, color: S.darkL, charSpacing: 1.5, valign: "middle" });
  tracker(slide, pres, cfg.n);

  txt(slide, cfg.title, { x: 0.6, y: 0.8, w: 12.13, h: 0.62, fontSize: fitTitle(cfg.title), bold: true, color: "FFFFFF", valign: "middle" });
  txt(slide, cfg.sub, { x: 0.6, y: 1.43, w: 12.13, h: 0.36, fontSize: 15, color: C.D_MUTED, valign: "middle" });

  // Video card
  const cx = 0.6, cy = 2.0, cw = 8.6, ch = 4.9;
  rrect(slide, pres, cx, cy, cw, ch, { r: 0.12, fill: "060A14", line: S.dark, lw: 1.25, shadow: { color: S.dark, blur: 18, offset: 0, opacity: 0.35 } });
  const vw = cw - 0.2, vh = vw / assets.aspect(cfg.key);
  const vx = cx + 0.1, vy = cy + (ch - vh) / 2;
  const poster = assets.posterFile(cfg.key);
  if (process.env.PREVIEW === "1") slide.addImage({ path: poster, x: vx, y: vy, w: vw, h: vh });
  else slide.addMedia({ type: "video", path: assets.clipFile(cfg.key), x: vx, y: vy, w: vw, h: vh, cover: b64(poster) });
  // pptxgenjs cannot set alt text on a video; en/build.js adds it to the package afterwards (plain ASCII, no file names)
  VIDEO_ALT.set(page, `Silent screen recording, ${mmss(assets.seconds(cfg.key))}: ${cfg.title.replace(/\s*[—–]\s*/g, ": ").replace(/\s*→\s*/g, " to ")}`);

  // Right: what to watch
  const px = 9.5, pw = 3.23;
  txt(slide, "WATCH FOR", { x: px, y: 2.0, w: pw, h: 0.28, fontSize: 11, bold: true, color: S.darkL, charSpacing: 1.5, valign: "middle" });
  const items = cfg.watch;
  const pitch = items.length >= 4 ? 0.8 : 0.95;
  items.forEach(([badge, text, col], i) => {
    const y = 2.4 + i * pitch;
    const bw = Math.max(0.4, textW(String(badge), 14, 0.22));
    labelBox(slide, pres, String(badge), px, y + 0.02, bw, 0.4, { r: 0.2, fill: col || S.dark, color: "FFFFFF", size: 14, bold: true, margin: 0 });
    txt(slide, text, { x: px + bw + 0.14, y, w: pw - bw - 0.14, h: pitch - 0.06, fontSize: 14.5, bold: true, color: "FFFFFF", valign: "top", lineSpacingMultiple: 0.98 });
  });

  // Customer value card
  const vh2 = 1.2, vy2 = 6.9 - vh2;
  rrect(slide, pres, px, vy2, pw, vh2, { r: 0.1, fill: C.D_CARD, line: C.D_LINE, lw: 0.75 });
  rect(slide, pres, px, vy2 + 0.14, 0.06, vh2 - 0.28, S.dark);
  txt(slide, "CUSTOMER VALUE", { x: px + 0.2, y: vy2 + 0.1, w: pw - 0.3, h: 0.26, fontSize: 11, bold: true, color: S.darkL, charSpacing: 1, valign: "middle" });
  txt(slide, cfg.value, { x: px + 0.2, y: vy2 + 0.38, w: pw - 0.32, h: vh2 - 0.44, fontSize: 13.5, color: "FFFFFF", valign: "top", lineSpacingMultiple: 1.0 });

  darkFooter(slide, pres, { page, total, note: cfg.note });
  slide.addNotes(cfg.notes);
  return slide;
}

module.exports = { demoSlide, ORDER, VIDEO_ALT };
