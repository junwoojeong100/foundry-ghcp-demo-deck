const pptxgen = require("pptxgenjs");
const fs = require("fs");
const { A, b64, C } = require("./lib");
const { DEMOS } = require("./content");
const { demoSlide } = require("./demo");
const S = require("./slides_a");
const B = require("./slides_b");

(async () => {
  const out = process.argv[2] || "out/deck.pptx";
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 in
  pres.title = "Microsoft Foundry × GitHub Copilot — 데모로 보는 AI 앱 개발";
  pres.subject = "고객 소개용 데모 중심 덱 (영상 11개 내장)";
  pres.author = "Microsoft";
  pres.company = "Microsoft";
  pres.lang = "ko-KR";

  pres.defineSlideMaster({ title: "M_LIGHT", background: { color: C.BG } });
  pres.defineSlideMaster({ title: "M_COVER", background: { data: b64(A("slide", "bg_dark_cover.png")) } });
  pres.defineSlideMaster({ title: "M_FOUNDRY", background: { data: b64(A("slide", "bg_dark_foundry.png")) } });
  pres.defineSlideMaster({ title: "M_COPILOT", background: { data: b64(A("slide", "bg_dark_copilot.png")) } });
  pres.defineSlideMaster({ title: "M_CLOSE", background: { data: b64(A("slide", "bg_dark_close.png")) } });

  const total = 20;
  const only = process.env.ONLY ? new Set(process.env.ONLY.split(",").map(Number)) : null;
  const want = (n) => !only || only.has(n);
  let n = 0;
  const next = () => ++n;

  // 1~4 인트로
  next(); await S.cover(pres, total);
  next(); await S.why(pres, n, total);
  next(); await S.demoMap(pres, n, total);
  next(); await S.foundryOverview(pres, n, total);
  // 5~9 Foundry 데모 1~5
  for (const d of DEMOS.filter((d) => d.sec === "foundry")) { next(); await demoSlide(pres, d, n, total); }
  // 10 Copilot 개요
  next(); await B.copilotOverview(pres, n, total);
  // 11~16 Copilot 데모 6~11
  for (const d of DEMOS.filter((d) => d.sec === "copilot")) { next(); await demoSlide(pres, d, n, total); }
  // 17~20
  next(); await B.results(pres, n, total);
  next(); await B.together(pres, n, total);
  next(); await B.nextSteps(pres, n, total);
  next(); await B.closing(pres, n, total);
  if (n !== total) throw new Error(`slide count ${n} != ${total}`);

  fs.mkdirSync(require("path").dirname(out), { recursive: true });
  await pres.writeFile({ fileName: out });
  console.log("written", out, n, "slides");
})().catch((e) => { console.error(e); process.exit(1); });
