const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const A = (...p) => path.join(ROOT, "assets", ...p);
const b64 = (p, mime = "image/png") => `${mime};base64,` + fs.readFileSync(p).toString("base64");

// 어두운(데모) 슬라이드와 밝은(설명) 슬라이드를 오가는 샌드위치 구성
const C = {
  D_BG: "0B1020", D_CARD: "131B33", D_CARD2: "1A2442", D_LINE: "2A3760", D_MUTED: "A9B4CC", D_DIM: "6F7B96",
  F_BLUE: "2F7CF6", F_BLUE_L: "8DBBFF", F_TINT: "152B57",
  C_PURPLE: "8B5CF6", C_PURPLE_L: "BDA6FF", C_TINT: "271C54",
  AMBER: "F0B429", RED: "EF4444", GREEN: "22C55E", TEAL: "2DD4BF",
  BG: "F5F7FB", WHITE: "FFFFFF", INK: "14233A", BODY: "33465A", MUTED: "5F7185", LINE: "D7E2EE", GRAY_TINT: "EEF2F7",
  BLUE: "0F6CBD", BLUE_DK: "0A4F8F", BLUE_TINT: "E7F1FB", BLUE_LINE: "BCD6F0",
  PURPLE: "6E40C9", PURPLE_DK: "4D2A9E", PURPLE_TINT: "F0EBFB", PURPLE_LINE: "D5C8F2",
  TEAL_DK: "066468", TEAL_TINT: "E1F4F4", TEAL_LINE: "B3DEDF",
  AMBER_DK: "8A6100", AMBER_TINT: "FFF4CC", AMBER_LINE: "F3D98A",
  GREEN_DK: "1E8E4E", GREEN_TINT: "E3F4EA", RED_DK: "B42318", RED_TINT: "FDECEA",
};
const FONT = "Malgun Gothic";

// 섹션별 색 (밝은 배경용 / 어두운 배경용)
const SEC = {
  foundry: { name: "MICROSOFT FOUNDRY", light: C.BLUE, lightDk: C.BLUE_DK, tint: C.BLUE_TINT, line: C.BLUE_LINE, dark: C.F_BLUE, darkL: C.F_BLUE_L, darkTint: C.F_TINT, master: "M_FOUNDRY" },
  copilot: { name: "GITHUB COPILOT", light: C.PURPLE, lightDk: C.PURPLE_DK, tint: C.PURPLE_TINT, line: C.PURPLE_LINE, dark: C.C_PURPLE, darkL: C.C_PURPLE_L, darkTint: C.C_TINT, master: "M_COPILOT" },
  together: { name: "TOGETHER", light: C.TEAL_DK, lightDk: C.TEAL_DK, tint: C.TEAL_TINT, line: C.TEAL_LINE, dark: C.TEAL, darkL: C.TEAL, darkTint: "0F3A3C", master: "M_LIGHT" },
  intro: { name: "INTRO", light: C.BLUE_DK, lightDk: C.BLUE_DK, tint: C.GRAY_TINT, line: C.LINE, dark: C.F_BLUE, darkL: C.F_BLUE_L, darkTint: C.F_TINT, master: "M_LIGHT" },
};

const iconCache = new Map();
async function getIcon(name, color) {
  const key = name + color;
  if (iconCache.has(key)) return iconCache.get(key);
  const Cmp = fa[name];
  if (!Cmp) throw new Error("icon missing: " + name);
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Cmp, { color: "#" + color, size: "256" }));
  const png = await sharp(Buffer.from(svg)).resize(256, 256).png().toBuffer();
  const data = "image/png;base64," + png.toString("base64");
  iconCache.set(key, data);
  return data;
}

// 핵심 용어는 줄바꿈에서 쪼개지지 않게 NBSP로 묶는다
const NB_PHRASES = [
  "Microsoft Foundry", "GitHub Copilot", "Copilot CLI", "Entra ID", "File search", "Guardrails", "AI Credits", "VS Code", "Pull Request",
  "Agent mode", "cloud agent", "git push",
].sort((a, b) => b.length - a.length);
function nb(str) {
  let out = str;
  for (const ph of NB_PHRASES) out = out.split(ph).join(ph.replace(/ /g, "\u00A0"));
  return out;
}
function nbAll(text) {
  if (typeof text === "string") return nb(text);
  if (Array.isArray(text)) return text.map((r) => (r && typeof r.text === "string" ? { ...r, text: nb(r.text) } : r));
  return text;
}

const shadow = (o = {}) => ({ type: "outer", color: o.color || "000000", blur: o.blur ?? 10, offset: o.offset ?? 3, angle: 90, opacity: o.opacity ?? 0.18 });

function txt(slide, text, o = {}) {
  slide.addText(nbAll(text), { fontFace: FONT, fontSize: 14, color: C.INK, margin: 0, valign: "top", align: "left", lang: "ko-KR", ...o });
}

// "**강조**" 마커 → 런
function rich(str, base = {}, boldColor) {
  const lines = str.split("\n");
  const out = [];
  lines.forEach((ln, li) => {
    const parts = ln.split(/(\*\*[^*]+\*\*)/).filter((p) => p.length);
    parts.forEach((p, pi) => {
      const isBold = p.startsWith("**");
      const o = isBold ? { ...base, bold: true, ...(boldColor ? { color: boldColor } : {}) } : { ...base };
      if (pi === parts.length - 1 && li < lines.length - 1) o.breakLine = true;
      out.push({ text: isBold ? p.slice(2, -2) : p, options: o });
    });
  });
  return out;
}

async function iconCircle(slide, pres, name, x, y, d, bg, fg = "FFFFFF", pad = 0.27) {
  slide.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: bg }, line: { type: "none" } });
  const p = d * pad;
  slide.addImage({ data: await getIcon(name, fg), x: x + p, y: y + p, w: d - 2 * p, h: d - 2 * p });
}
async function iconOnly(slide, name, x, y, d, color) {
  slide.addImage({ data: await getIcon(name, color), x, y, w: d, h: d });
}

function rrect(slide, pres, x, y, w, h, o = {}) {
  slide.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: o.r ?? 0.12,
    fill: o.fill === null ? { type: "none" } : { color: o.fill ?? C.WHITE, transparency: o.transparency },
    line: o.line === null || o.line === undefined ? { type: "none" } : { color: o.line, width: o.lw ?? 0.75, dashType: o.dash },
    shadow: o.shadow ? shadow(o.shadow === true ? {} : o.shadow) : undefined,
  });
}
function rect(slide, pres, x, y, w, h, fill, o = {}) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h, fill: { color: fill, transparency: o.transparency },
    line: o.line ? { color: o.line, width: o.lw ?? 0.75, dashType: o.dash } : { type: "none" },
    shadow: o.shadow ? shadow(o.shadow === true ? {} : o.shadow) : undefined,
  });
}
function oval(slide, pres, x, y, d, o = {}) {
  slide.addShape(pres.shapes.OVAL, {
    x, y, w: d, h: o.h ?? d,
    fill: o.fill ? { color: o.fill, transparency: o.transparency ?? 0 } : { type: "none" },
    line: o.line ? { color: o.line, width: o.lw ?? 1 } : { type: "none" },
  });
}

// 라운드 사각형 안의 텍스트
function labelBox(slide, pres, text, x, y, w, h, o = {}) {
  slide.addText(nbAll(text), {
    shape: pres.shapes.ROUNDED_RECTANGLE, rectRadius: o.r ?? 0.1, x, y, w, h,
    fill: o.fill === null ? { type: "none" } : { color: o.fill ?? C.WHITE, transparency: o.transparency },
    line: o.line === null || o.line === undefined ? { type: "none" } : { color: o.line, width: o.lw ?? 0.75 },
    color: o.color ?? C.INK, fontFace: FONT, fontSize: o.size ?? 12, bold: o.bold ?? false,
    align: o.align ?? "center", valign: o.valign ?? "middle", margin: o.margin ?? 4, lang: "ko-KR",
    charSpacing: o.charSpacing, lineSpacingMultiple: o.ls, shadow: o.shadow ? shadow() : undefined,
  });
}

// 한글/영문 혼합 라벨의 대략적인 폭
function textW(label, size = 11, pad = 0) {
  let w = 0;
  for (const ch of label) w += /[\u3131-\uD79D]/.test(ch) ? 0.0150 * size : /[A-Z0-9]/.test(ch) ? 0.0105 * size : /\s/.test(ch) ? 0.0062 * size : 0.0092 * size;
  return w + pad;
}

function pill(slide, pres, label, x, y, h, o = {}) {
  const size = o.size ?? 11;
  const w = o.w ?? textW(label, size, o.pad ?? 0.36);
  labelBox(slide, pres, label, x, y, w, h, { r: h / 2, fill: o.fill ?? C.BLUE, color: o.color ?? "FFFFFF", size, bold: o.bold ?? true, margin: 0, line: o.line, lw: o.lw, charSpacing: o.charSpacing });
  return w;
}

function numBadge(slide, pres, n, x, y, d, fill, color = "FFFFFF", size = 13) {
  slide.addText(String(n), { shape: pres.shapes.OVAL, x, y, w: d, h: d, fill: { color: fill }, line: { type: "none" }, color, fontFace: FONT, fontSize: size, bold: true, align: "center", valign: "middle", margin: 0 });
}

function arrow(slide, pres, x1, y1, x2, y2, o = {}) {
  slide.addShape(pres.shapes.LINE, {
    x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipH: x2 < x1, flipV: y2 < y1,
    line: { color: o.color ?? C.BLUE, width: o.width ?? 1.75, dashType: o.dash, endArrowType: o.noHead ? undefined : "triangle" },
  });
}

function msLogo(slide, pres, x, y, d) {
  const g = d * 0.06, s = (d - g) / 2;
  for (const [col, cx, cy] of [["F25022", 0, 0], ["7FBA00", 1, 0], ["00A4EF", 0, 1], ["FFB900", 1, 1]]) {
    slide.addShape(pres.shapes.RECTANGLE, { x: x + cx * (s + g), y: y + cy * (s + g), w: s, h: s, fill: { color: col }, line: { type: "none" } });
  }
}

const FOOT = "Microsoft Foundry × GitHub Copilot  ·  데모로 보는 AI 앱 개발";

// 밝은 슬라이드 프레임: 키커 + 제목 + 푸터
function lightFrame(slide, pres, { sec = "intro", kicker, title, page, total, titleSize = 28, foot }) {
  const S = SEC[sec];
  txt(slide, kicker || S.name, { x: 0.6, y: 0.36, w: 8, h: 0.28, fontSize: 11, bold: true, color: S.light, charSpacing: 1.5, valign: "middle" });
  txt(slide, title, { x: 0.6, y: 0.68, w: 12.13, h: 0.85, fontSize: titleSize, bold: true, color: C.INK, valign: "top", lineSpacingMultiple: 1.0 });
  msLogo(slide, pres, 0.6, 7.1, 0.16);
  txt(slide, foot || FOOT, { x: 0.9, y: 7.03, w: 9.5, h: 0.3, fontSize: 9.5, color: C.MUTED, valign: "middle" });
  txt(slide, `${page} / ${total}`, { x: 11.9, y: 7.03, w: 0.83, h: 0.3, fontSize: 10, color: C.MUTED, align: "right", valign: "middle" });
}

// 어두운 슬라이드의 푸터
function darkFooter(slide, pres, { page, total, note }) {
  msLogo(slide, pres, 0.6, 7.1, 0.16);
  txt(slide, note || FOOT, { x: 0.9, y: 7.03, w: 10.6, h: 0.3, fontSize: 9.5, color: C.D_DIM, valign: "middle" });
  txt(slide, `${page} / ${total}`, { x: 11.9, y: 7.03, w: 0.83, h: 0.3, fontSize: 10, color: C.D_DIM, align: "right", valign: "middle" });
}

module.exports = {
  ROOT, A, b64, C, FONT, SEC, FOOT, getIcon, shadow, txt, rich, nb, nbAll, iconCircle, iconOnly, rrect, rect, oval, labelBox, textW, pill,
  numBadge, arrow, msLogo, lightFrame, darkFooter,
};
