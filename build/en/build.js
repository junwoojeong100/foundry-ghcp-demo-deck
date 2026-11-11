require("./lang");
const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");
const JSZip = require("jszip");
const { C, b64 } = require("../lib");
const assets = require("./assets");
const { DEMOS } = require("./content");
const { demoSlide, VIDEO_ALT } = require("./demo");
const S = require("./slides_a");
const B = require("./slides_b");
const { minSec } = require("./fmt");

// pptxgenjs ships a default theme whose script-font list carries native font names (Korean, Chinese, Japanese).
// The English edition must contain no Hangul (or other CJK) anywhere, so those entries are dropped; PowerPoint then uses its own
// defaults for those scripts, which does not matter for an English deck.
const NATIVE_SCRIPT_FONT = /<a:font script="[^"]*" typeface="[^"]*[^\x00-\x7F][^"]*"\/>/g;
const xmlAttr = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// Post-processes the package written by pptxgenjs: no native script fonts in the theme, alt text on the videos
async function englishPackage(buf) {
  const zip = await JSZip.loadAsync(buf);
  for (const name of Object.keys(zip.files).filter((n) => /^ppt\/theme\/theme\d+\.xml$/.test(n))) {
    const xml = await zip.file(name).async("string");
    zip.file(name, xml.replace(NATIVE_SCRIPT_FONT, ""));
  }
  for (const [page, alt] of VIDEO_ALT) {
    const name = `ppt/slides/slide${page}.xml`;
    const xml = await zip.file(name).async("string");
    const patched = xml.replace(/(<p:cNvPr id="\d+" name="Media \d+")(>)/, `$1 descr="${xmlAttr(alt)}"$2`);
    if (patched === xml && process.env.PREVIEW !== "1") throw new Error(`${name}: video element not found for alt text`);
    zip.file(name, patched);
  }
  return zip.generateAsync({ type: "nodebuffer", platform: "UNIX" });
}

(async () => {
  const out = process.argv[2] || "out/deck_en.pptx";
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 in
  pres.title = "Microsoft Foundry × GitHub Copilot — AI app development, shown in demos";
  pres.subject = "Customer briefing deck built around demos (11 videos embedded)";
  pres.author = "Microsoft";
  pres.company = "Microsoft";
  pres.lang = "en-US";

  pres.defineSlideMaster({ title: "M_LIGHT", background: { color: C.BG } });
  pres.defineSlideMaster({ title: "M_COVER", background: { data: b64(assets.backgroundFile("bg_dark_cover.png")) } });
  pres.defineSlideMaster({ title: "M_FOUNDRY", background: { data: b64(assets.backgroundFile("bg_dark_foundry.png")) } });
  pres.defineSlideMaster({ title: "M_COPILOT", background: { data: b64(assets.backgroundFile("bg_dark_copilot.png")) } });
  pres.defineSlideMaster({ title: "M_CLOSE", background: { data: b64(assets.backgroundFile("bg_dark_close.png")) } });

  const total = 20;
  let n = 0;
  const next = () => ++n;

  // 1-4 intro
  next(); await S.cover(pres, total);
  next(); await S.why(pres, n, total);
  next(); await S.demoMap(pres, n, total);
  next(); await S.foundryOverview(pres, n, total);
  // 5-9 Foundry demos 1-5
  for (const d of DEMOS.filter((d) => d.sec === "foundry")) { next(); await demoSlide(pres, d, n, total); }
  // 10 Copilot overview
  next(); await B.copilotOverview(pres, n, total);
  // 11-16 Copilot demos 6-11
  for (const d of DEMOS.filter((d) => d.sec === "copilot")) { next(); await demoSlide(pres, d, n, total); }
  // 17-20
  next(); await B.results(pres, n, total);
  next(); await B.together(pres, n, total);
  next(); await B.nextSteps(pres, n, total);
  next(); await B.closing(pres, n, total);
  if (n !== total) throw new Error(`slide count ${n} != ${total}`);

  const buf = await englishPackage(await pres.write({ outputType: "nodebuffer" }));
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, buf);

  const L = assets.lengths();
  console.log("written", out, n, "slides");
  console.log(`clips: ${L.count} | video total ${minSec(L.total)} (Foundry ${minSec(L.foundry)}, Copilot ${minSec(L.copilot)})`);
  const formatNotes = assets.formatNotes();
  if (formatNotes.length) {
    console.warn("\n!!!!! clip format notes (English clips):");
    for (const n of formatNotes) console.warn(`!!!!!   ${n}`);
  }
  const missing = assets.report();
  if (missing.length) {
    console.warn("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
    console.warn(`!!!!! ${missing.length} English file(s) missing - KOREAN placeholders were used. This deck is NOT shippable.`);
    for (const m of missing) console.warn(`!!!!!   ${m.what}: ${m.file}${m.ko ? `  ->  ${m.ko}` : m.hint ? `  (${m.hint})` : ""}`);
    console.warn("!!!!! Set STRICT_EN=1 to fail the build instead.");
    console.warn("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n");
  }
})().catch((e) => { console.error(e); process.exit(1); });
