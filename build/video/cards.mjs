// Renders the title / chapter / summary cards of the English demo video as 1920x1080 PNGs.
//   node build/video/cards.mjs <cards.json> <out-dir>
// cards.json is written by build_video.py (texts live in script_en.py). Needs `playwright` (build/record/node_modules) and Microsoft Edge.
import { chromium } from "../record/node_modules/playwright/index.mjs";
import fs from "node:fs";
import path from "node:path";

const [, , specPath, outDir] = process.argv;
const cards = JSON.parse(fs.readFileSync(specPath, "utf8"));
fs.mkdirSync(outDir, { recursive: true });

const C = { blue: "#2F7CF6", blueL: "#8DBBFF", purple: "#8B5CF6", purpleL: "#BDA6FF", amber: "#F0B429", red: "#EF4444", green: "#22C55E", muted: "#A9B4CC", dim: "#6F7B96", card: "#131B33", line: "#2A3760" };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const css = `
*{box-sizing:border-box;margin:0;padding:0}
body{width:1920px;height:1080px;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Helvetica Neue",Arial,sans-serif;color:#fff;
  background:radial-gradient(1100px 760px at 6% 0%,rgba(47,124,246,.34),transparent 62%),radial-gradient(1100px 760px at 100% 100%,rgba(139,92,246,.34),transparent 62%),#090D1C;}
.wrap{position:absolute;inset:0;padding:96px 120px;display:flex;flex-direction:column;justify-content:center}
.pill{display:inline-flex;align-items:center;gap:10px;font-weight:800;letter-spacing:.14em;font-size:24px;padding:11px 26px;border-radius:999px;color:#fff}
.kicker{font-weight:800;letter-spacing:.16em;font-size:26px;margin-bottom:22px}
h1{font-size:104px;line-height:1.03;font-weight:800;letter-spacing:-.02em}
h2{font-size:84px;line-height:1.06;font-weight:800;letter-spacing:-.015em}
.sub{font-size:40px;line-height:1.32;color:${C.muted};margin-top:34px;max-width:1500px}
.row{display:flex;gap:18px;margin-top:46px;flex-wrap:wrap}
.foot{position:absolute;left:120px;right:120px;bottom:54px;display:flex;justify-content:space-between;color:${C.dim};font-size:24px}
.chips{display:flex;gap:22px;margin-top:56px}
.chip{flex:1;border-radius:20px;background:${C.card};border:2px solid ${C.line};padding:26px 28px;font-size:30px;font-weight:700;line-height:1.2}
.chip small{display:block;font-weight:600;font-size:22px;color:${C.muted};margin-top:10px}
.chip.on{border-color:var(--c);box-shadow:0 0 0 4px color-mix(in srgb,var(--c) 28%,transparent)}
.num{display:inline-grid;place-items:center;width:46px;height:46px;border-radius:50%;background:var(--c);font-size:26px;margin-bottom:14px}
.tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:26px;margin-top:50px}
.tile{border-radius:24px;background:${C.card};border:2px solid ${C.line};padding:34px 34px 30px;position:relative}
.tile:before{content:"";position:absolute;left:0;top:30px;bottom:30px;width:8px;border-radius:4px;background:var(--c)}
.tile .big{font-size:82px;font-weight:800;line-height:1;letter-spacing:-.02em}
.tile .big span{font-size:38px}
.tile .l1{font-size:28px;font-weight:700;margin-top:18px}
.tile .l2{font-size:24px;color:${C.muted};margin-top:6px}
.flow{display:flex;margin-top:84px}
.step{flex:1;height:112px;display:grid;place-items:center;font-size:32px;font-weight:800;clip-path:polygon(0 0,calc(100% - 34px) 0,100% 50%,calc(100% - 34px) 100%,0 100%,34px 50%);margin-left:-18px}
.step:first-child{clip-path:polygon(0 0,calc(100% - 34px) 0,100% 50%,calc(100% - 34px) 100%,0 100%);margin-left:0}
.agents{display:flex;margin-top:14px}
.agents div{flex:1;text-align:center;font-size:21px;color:${C.muted}}
.gate{position:absolute;width:56px;height:56px;border-radius:50%;background:${C.amber};color:#14233A;font-weight:800;font-size:30px;display:grid;place-items:center;border:4px solid #fff}
.bars{display:grid;grid-template-columns:1fr 1fr;gap:26px;margin-top:40px}
.bar{border-radius:22px;padding:28px 32px;font-size:30px;line-height:1.3}
.bar b{display:block;font-size:34px;margin-bottom:8px}
ul.next{list-style:none;margin-top:46px;display:grid;gap:22px}
ul.next li{display:flex;gap:22px;align-items:flex-start;font-size:38px;line-height:1.28}
ul.next li i{flex:none;display:grid;place-items:center;width:58px;height:58px;border-radius:50%;background:var(--c);font-style:normal;font-weight:800;font-size:30px}
`;

function page(c) {
  const col = c.color === "purple" ? C.purple : c.color === "teal" ? "#2DD4BF" : C.blue;
  const colL = c.color === "purple" ? C.purpleL : C.blueL;
  const footL = "Microsoft Foundry × GitHub Copilot  ·  AI app development, shown in demos";
  let body = "";
  if (c.type === "title") {
    body = `<div class="wrap"><div><span class="pill" style="background:#1B2646;color:${C.blueL};border:2px solid ${C.line}">CUSTOMER BRIEFING  ·  2026.11</span></div>
      <h1 style="margin-top:44px">Microsoft Foundry<br><span style="color:${C.amber}">×</span> GitHub Copilot</h1>
      <div style="font-size:56px;font-weight:700;margin-top:34px">${esc(c.title)}</div>
      <div class="sub">${esc(c.sub)}</div>
      <div class="row"><span class="pill" style="background:${C.blue}">${esc(c.pill1)}</span><span class="pill" style="background:${C.purple}">${esc(c.pill2)}</span></div></div>`;
  } else if (c.type === "part") {
    const chips = c.chips.map((x, i) => `<div class="chip ${i === c.on ? "on" : ""}" style="--c:${col}"><div class="num" style="--c:${col}">${x.n}</div><div>${esc(x.t)}</div><small>${esc(x.s)}</small></div>`).join("");
    body = `<div class="wrap"><div class="kicker" style="color:${colL}">${esc(c.kicker)}</div><h2>${esc(c.title)}</h2><div class="sub">${esc(c.sub)}</div><div class="chips">${chips}</div></div>`;
  } else if (c.type === "demo") {
    body = `<div class="wrap"><div><span class="pill" style="background:${col}">DEMO ${c.n}</span><span class="pill" style="color:${colL};letter-spacing:.14em">${esc(c.section)}</span></div>
      <h2 style="margin-top:40px;max-width:1560px">${esc(c.title)}</h2><div class="sub">${esc(c.sub)}</div></div>`;
  } else if (c.type === "pipeline") {
    const cols = ["#4D2A9E", "#5B34B8", "#6A3FCB", "#7647D6", "#8352E0", "#8F5DEA"];
    const steps = c.steps.map(([n], i) => `<div class="step" style="background:${cols[i]}">${esc(n)}</div>`).join("");
    const agents = c.steps.map(([, a]) => `<div>${esc(a)}</div>`).join("");
    const gates = c.gates.map(([n, x]) => `<div class="gate" style="left:${x}px;top:56px">${n}</div>`).join("");
    body = `<div class="wrap"><div class="kicker" style="color:${C.purpleL}">${esc(c.kicker)}</div><h2>${esc(c.title)}</h2><div class="sub" style="margin-top:22px">${esc(c.sub)}</div>
      <div style="position:relative"><div class="flow">${steps}</div>${gates}</div><div class="agents">${agents}</div>
      <div class="bars"><div class="bar" style="background:#3A2F0B;border:2px solid #6B5514"><b style="color:${C.amber}">${esc(c.bar1[0])}</b>${esc(c.bar1[1])}</div>
      <div class="bar" style="background:#3A1414;border:2px solid #7A2A2A"><b style="color:#FF8A80">${esc(c.bar2[0])}</b>${esc(c.bar2[1])}</div></div></div>`;
  } else if (c.type === "results") {
    const tiles = c.tiles.map((t) => `<div class="tile" style="--c:${t.c || C.purpleL}"><div class="big">${t.v}</div><div class="l1">${esc(t.l1)}</div><div class="l2">${esc(t.l2)}</div></div>`).join("");
    body = `<div class="wrap"><div class="kicker" style="color:${C.purpleL}">${esc(c.kicker)}</div><h2>${esc(c.title)}</h2><div class="sub" style="margin-top:22px">${esc(c.sub)}</div><div class="tiles">${tiles}</div>
      <div class="sub" style="font-size:28px;margin-top:40px;color:${C.dim}">${esc(c.note)}</div></div>`;
  } else if (c.type === "next") {
    const items = c.items.map((t, i) => `<li><i style="--c:${[C.blue, C.purple, "#2DD4BF"][i % 3]}">${i + 1}</i><div>${esc(t)}</div></li>`).join("");
    body = `<div class="wrap"><div class="kicker" style="color:${C.blueL}">${esc(c.kicker)}</div><h2>${esc(c.title)}</h2><div class="sub" style="margin-top:22px">${esc(c.sub)}</div><ul class="next">${items}</ul></div>`;
  }
  return `<!doctype html><meta charset="utf-8"><style>${css}</style><body>${body}<div class="foot"><span>${esc(footL)}</span><span>${esc(c.foot || "")}</span></div></body>`;
}

const browser = await chromium.launch({ channel: "msedge", headless: true });
const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
for (const c of cards) {
  await p.setContent(page(c), { waitUntil: "load" });
  await p.screenshot({ path: path.join(outDir, `${c.id}.png`) });
  console.log("card", c.id);
}
await browser.close();
