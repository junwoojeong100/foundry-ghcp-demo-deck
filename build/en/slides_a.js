require("./lang");
const { C, FONT, txt, rich, pill, rrect, rect, oval, labelBox, numBadge, iconCircle, iconOnly, lightFrame } = require("../lib");
const assets = require("./assets");
const M = require("./metrics");
const { mmss, minSec } = require("./fmt");
const { FOUNDRY: F, evalMinutes } = require("./content");

const E = F.eval;
const L = () => assets.lengths();
const approxTotal = () => `about ${minSec(L().approx)}`; // "about 6 min 30 s"

function lcard(slide, pres, x, y, w, h, accent, o = {}) {
  rect(slide, pres, x, y, w, h, o.fill ?? C.WHITE, { line: o.line ?? C.LINE, lw: 0.75, shadow: o.noShadow ? undefined : { color: "0A1A33", blur: 10, offset: 2, opacity: 0.08 } });
  if (accent) rect(slide, pres, x, y, w, 0.07, accent);
}

// 1. Cover
async function cover(pres, total) {
  const slide = pres.addSlide({ masterName: "M_COVER" });
  pill(slide, pres, "CUSTOMER BRIEFING  ·  2026.11", 0.8, 0.85, 0.34, { fill: "1B2646", color: C.F_BLUE_L, size: 11, charSpacing: 1.5, pad: 0.55, line: C.D_LINE });
  txt(slide, [
    { text: "Microsoft Foundry", options: { color: "FFFFFF", breakLine: true } },
    { text: "× ", options: { color: C.AMBER } },
    { text: "GitHub Copilot", options: { color: "FFFFFF" } },
  ], { x: 0.8, y: 1.55, w: 6.1, h: 1.9, fontSize: 44, bold: true, lineSpacingMultiple: 1.02, valign: "top" });
  txt(slide, "AI app development, shown in demos", { x: 0.8, y: 3.6, w: 5.5, h: 0.5, fontSize: 21, bold: true, color: "FFFFFF", valign: "middle" });
  txt(slide, "The whole journey — build, run safely, evaluate —\nshown in real screen recordings, not slides", { x: 0.8, y: 4.2, w: 5.9, h: 0.9, fontSize: 16, color: C.D_MUTED, valign: "top", lineSpacingMultiple: 1.15 });
  let x = 0.8;
  x += pill(slide, pres, `${assets.FOUNDRY_KEYS.length} Foundry demos`, x, 5.75, 0.36, { fill: C.F_BLUE, size: 12, pad: 0.5 }) + 0.12;
  pill(slide, pres, `${assets.COPILOT_KEYS.length} Copilot demos`, x, 5.75, 0.36, { fill: C.C_PURPLE, size: 12, pad: 0.5 });

  // Right: two real screens
  const fh = 5.5 / assets.aspect("f3"), ch = 5.5 / assets.aspect("c7");
  slide.addImage({ path: assets.coverFile("foundry"), altText: "Microsoft Foundry portal screen (agent playground) preview", x: 7.23, y: 0.95, w: 5.5, h: fh, shadow: { type: "outer", color: "000000", blur: 22, offset: 6, angle: 90, opacity: 0.5 } });
  slide.addImage({ path: assets.coverFile("copilot"), altText: "GitHub Copilot CLI terminal screen preview", x: 6.35, y: 3.62, w: 5.5, h: ch, shadow: { type: "outer", color: "000000", blur: 22, offset: 6, angle: 90, opacity: 0.55 } });
  pill(slide, pres, "MICROSOFT FOUNDRY", 7.23, 0.6, 0.3, { fill: C.F_BLUE, size: 10.5, charSpacing: 1, pad: 0.45 });
  pill(slide, pres, "GITHUB COPILOT", 6.35, 3.62 + ch + 0.168, 0.3, { fill: C.C_PURPLE, size: 10.5, charSpacing: 1, pad: 0.45 });
  slide.addNotes([
    "[Cover]  Greet the audience, then start with one line.",
    "Opening: 'Today I'll show you more screens than slides. Everything is a real recording; we only cut the waiting time.'",
    `Structure: ${assets.FOUNDRY_KEYS.length} Foundry demos (pick a model → deploy → agent → guardrails → evaluation) + ${assets.COPILOT_KEYS.length} Copilot demos (analyze → design → build & test → review → deploy → safety guard). Click the video on a slide (or its play button) to play it. Total video length: ${approxTotal()}.`,
    "Pre-flight checks: ① each video plays on its slide (PowerPoint desktop recommended), ② test in slideshow mode on the presenting PC, ③ the videos are silent, so narrate them yourself.",
    "The two images on the right of the cover are from demo 3 (Foundry agent) and demo 11 (Copilot safety guard).",
  ].join("\n"));
}

// 2. Why - speed x trust
async function why(pres, page, total) {
  const slide = pres.addSlide({ masterName: "M_LIGHT" });
  lightFrame(slide, pres, { kicker: "WHY", title: "AI apps need both speed and trust to reach production", page, total });
  const y = 1.75, h = 3.95, w = 5.75;
  // Left: Copilot
  lcard(slide, pres, 0.6, y, w, h, C.PURPLE);
  pill(slide, pres, "GITHUB COPILOT  ·  Speed of building", 0.9, y + 0.3, 0.32, { fill: C.PURPLE_TINT, color: C.PURPLE_DK, size: 11, pad: 0.4 });
  txt(slide, [{ text: M.totalMin, options: { fontSize: 88, bold: true, color: C.PURPLE } }, { text: " min", options: { fontSize: 36, bold: true, color: C.PURPLE } }], { x: 0.9, y: y + 0.7, w: 5.2, h: 1.6, valign: "middle" });
  txt(slide, [
    { text: `One change request, handled in ${M.stages.length} stages`, options: { fontSize: 18, bold: true, color: C.INK, breakLine: true } },
    { text: "Analyze · Design · Build · Test · Review · Deploy · Operate", options: { fontSize: 13, color: C.BODY } },
  ], { x: 0.9, y: y + 2.3, w: 5.2, h: 0.8, paraSpaceAfter: 4 });
  txt(slide, `Measured in the ShopFlow demo run  ·  ${M.interventions} human interventions`, { x: 0.9, y: y + 3.3, w: 5.2, h: 0.4, fontSize: 12, color: C.MUTED, valign: "middle" });
  // Center ×
  oval(slide, pres, 6.415, y + h / 2 - 0.25, 0.5, { fill: C.INK });
  txt(slide, "×", { x: 6.415, y: y + h / 2 - 0.25, w: 0.5, h: 0.5, fontSize: 22, bold: true, color: "FFFFFF", align: "center", valign: "middle" });
  // Right: Foundry
  lcard(slide, pres, 6.98, y, w, h, C.BLUE);
  pill(slide, pres, "MICROSOFT FOUNDRY  ·  Quality and safety you can trust", 7.28, y + 0.3, 0.32, { fill: C.BLUE_TINT, color: C.BLUE_DK, size: 11, pad: 0.4 });
  txt(slide, [{ text: "about ", options: { fontSize: 30, bold: true, color: C.BLUE } }, { text: evalMinutes, options: { fontSize: 88, bold: true, color: C.BLUE } }, { text: " min", options: { fontSize: 36, bold: true, color: C.BLUE } }], { x: 7.28, y: y + 0.7, w: 5.2, h: 1.6, valign: "middle" });
  txt(slide, [
    { text: "One agent quality-and-safety evaluation", options: { fontSize: 18, bold: true, color: C.INK, breakLine: true } },
    { text: `${E.rows} questions auto-generated + scored by ${E.evaluators} evaluators`, options: { fontSize: 13, color: C.BODY } },
  ], { x: 7.28, y: y + 2.3, w: 5.2, h: 0.8, paraSpaceAfter: 4 });
  txt(slide, `One measured Foundry run  ·  ${E.totalDetail} including question generation`, { x: 7.28, y: y + 3.3, w: 5.2, h: 0.4, fontSize: 12, color: C.MUTED, valign: "middle" });
  // Bottom bar
  rrect(slide, pres, 0.6, 5.98, 12.13, 0.78, { r: 0.12, fill: C.INK });
  await iconCircle(slide, pres, "FaPlay", 0.85, 6.1, 0.54, C.AMBER, C.INK, 0.3);
  txt(slide, rich(`Today: **real screen recordings**, not slides — **${L().count} demos**, ${approxTotal().replace(/about (.*)/, "about **$1**")} of video`, { fontSize: 17, color: "FFFFFF", fontFace: FONT }, C.AMBER), { x: 1.6, y: 5.98, w: 10.9, h: 0.78, valign: "middle" });
  slide.addNotes([
    "[Why these two? — 1 min]",
    "Message: an AI app doesn't reach production if 'building fast' and 'running it with confidence' are separate efforts. Left: the speed of building (GitHub Copilot). Right: quality and safety you can trust (Microsoft Foundry).",
    `Left number, ${M.totalMin} min: the total time of a real recorded session in which ${M.stages.length} custom agents in Copilot CLI handled one ShopFlow (fictional store) refund-policy change request — analyze → design → build → test → review → deploy → ops analysis (${Math.round(M.totalSec).toLocaleString("en-US")} s). Human interventions: ${M.approvals} approvals + ${M.decisions} decisions = ${M.interventions}. (Details on slide 17.)`,
    `Right number, about ${evalMinutes} min: one Foundry Evaluations run for one agent — ${E.rows} synthetic questions generated, then scored by ${E.evaluators} evaluators (${E.totalDetail} including question generation — the 'Duration' in the run details). 'Elapsed time ${E.elapsedScoring}' at the top of the result page covers scoring only, so the numbers can look different. (Details in demo 5.)`,
    "Caution: the two numbers measure different jobs, so they are not a like-for-like comparison. They give a feel for 'a job of this size finishes in about this time'. They do not guarantee results in your environment.",
    "Transition: 'Let's go to the real screens. The agenda is on the next slide.'",
  ].join("\n"));
}

// 3. Demo map
async function demoMap(pres, page, total) {
  const slide = pres.addSlide({ masterName: "M_LIGHT" });
  lightFrame(slide, pres, { kicker: "AGENDA", title: `Today's ${L().count} demos — two tracks`, page, total });
  const len = (k) => mmss(L().per[k]);
  const Fd = [
    ["f1", "Catalog & compare", `${len("f1")} · Explore → compare`], ["f2", "Deploy & Playground", `${len("f2")} · Click → chat → code`], ["f3", "Agent + knowledge", `${len("f3")} · Cites your document`],
    ["f4", "Guardrails", `${len("f4")} · Jailbreak blocked`], ["f5", "Evaluations", `${len("f5")} · Automatic scoring`],
  ];
  const P = [
    ["c1", "Analyze", `${len("c1")} · Impact analysis`], ["c2", "Design", `${len("c2")} · Human decisions`], ["c3", "Build & test", `${len("c3")} · ${M.tests.baseline} → ${M.tests.total} tests`],
    ["c4", "Review", `${len("c4")} · Code approval`], ["c5", "Deploy", `${len("c5")} · Production approval`], ["c7", "Safety guard", `${len("c7")} · Hook blocks`],
  ];
  // Foundry lane
  const fl = pill(slide, pres, "MICROSOFT FOUNDRY", 0.6, 1.62, 0.3, { fill: C.BLUE, size: 10.5, charSpacing: 1, pad: 0.45 });
  txt(slide, "Pick a model → deploy → agent → safety → evaluate", { x: 0.6 + fl + 0.2, y: 1.62, w: 6.5, h: 0.3, fontSize: 13, color: C.BODY, valign: "middle" });
  txt(slide, `${Fd.length} demos  ·  ${minSec(L().foundry)}`, { x: 9.2, y: 1.62, w: 3.53, h: 0.3, fontSize: 12, bold: true, color: C.BLUE_DK, align: "right", valign: "middle" });
  const fw = 2.3, fg = (12.13 - 5 * fw) / 4;
  Fd.forEach(([k, label, sub], i) => {
    const x = 0.6 + i * (fw + fg), y = 2.05, fh = fw / assets.aspect(k);
    slide.addImage({ path: assets.thumbFile(k), altText: `Demo ${i + 1} ${label} screen preview`, x, y, w: fw, h: fh, shadow: { type: "outer", color: "0A1A33", blur: 8, offset: 2, angle: 90, opacity: 0.18 } });
    rect(slide, pres, x, y, fw, fh, "FFFFFF", { transparency: 100, line: C.BLUE_LINE, lw: 0.75 });
    numBadge(slide, pres, i + 1, x - 0.1, y - 0.12, 0.36, C.BLUE, "FFFFFF", 13);
    txt(slide, label, { x, y: y + fh + 0.1, w: fw, h: 0.3, fontSize: 14, bold: true, color: C.INK, valign: "middle" });
    txt(slide, sub, { x, y: y + fh + 0.4, w: fw + fg - 0.03, h: 0.26, fontSize: 11, color: C.MUTED, valign: "middle" });
  });
  // Copilot lane
  const cl = pill(slide, pres, "GITHUB COPILOT", 0.6, 4.2, 0.3, { fill: C.PURPLE, size: 10.5, charSpacing: 1, pad: 0.45 });
  txt(slide, "Analyze → design → build & test → review → deploy, plus the safety guard", { x: 0.6 + cl + 0.2, y: 4.2, w: 7.5, h: 0.3, fontSize: 13, color: C.BODY, valign: "middle" });
  txt(slide, `${P.length} demos  ·  ${minSec(L().copilot)}`, { x: 9.2, y: 4.2, w: 3.53, h: 0.3, fontSize: 12, bold: true, color: C.PURPLE_DK, align: "right", valign: "middle" });
  const pw = 1.9, pg = (12.13 - 6 * pw) / 5, ph = Math.max(...P.map(([k]) => pw / assets.aspect(k)));
  P.forEach(([k, label, sub], i) => {
    const x = 0.6 + i * (pw + pg), y = 4.65, h = pw / assets.aspect(k);
    slide.addImage({ path: assets.thumbFile(k), altText: `Demo ${i + 6} ${label} screen preview`, x, y, w: pw, h, shadow: { type: "outer", color: "0A1A33", blur: 8, offset: 2, angle: 90, opacity: 0.18 } });
    rect(slide, pres, x, y, pw, h, "FFFFFF", { transparency: 100, line: C.PURPLE_LINE, lw: 0.75 });
    numBadge(slide, pres, i + 6, x - 0.1, y - 0.12, 0.36, C.PURPLE, "FFFFFF", 13);
    txt(slide, label, { x, y: y + ph + 0.1, w: pw, h: 0.3, fontSize: 14, bold: true, color: C.INK, valign: "middle" });
    txt(slide, sub, { x, y: y + ph + 0.4, w: pw + pg - 0.03, h: 0.26, fontSize: 11, color: C.MUTED, valign: "middle" });
  });
  txt(slide, `Note: Foundry screens recorded ${F.recordedOn}; Copilot screens come from one ShopFlow change request. Wait times are cut or sped up; all names and data are fictional.`, { x: 0.6, y: 6.55, w: 12.13, h: 0.3, fontSize: 11, color: C.MUTED, valign: "middle" });
  slide.addNotes([
    "[Demo map — 30 s]",
    `Today: ${L().count} demos, ${approxTotal()} of video in total. Top: Foundry (${Fd.length}). Bottom: Copilot (${P.length}).`,
    "Foundry: ① model catalog & comparison ② deploy & Playground ③ agent + company documents ④ Guardrails ⑤ Evaluations.",
    "Copilot: ⑥ analyze ⑦ design ⑧ build & test ⑨ review ⑩ deploy ⑪ safety guard. One change request (the ShopFlow refund policy, CR-2026-014) flows through the stages.",
    "Connection: the refund policy document in Foundry demos 3–5 is a fictional document based on the CR-2026-014 design document that Copilot produced — the two tracks tell one ShopFlow story.",
    `Timing (guide): about ${L().approxMin} min of video + 1–2 min of talking per demo = about 20–25 min. If you are short on time, skip demo 1 (catalog), demo 8 (build & test) and demo 10 (deploy) and just say the one-line summary on the slide — the flow still holds.`,
  ].join("\n"));
}

// 4. Foundry overview
async function foundryOverview(pres, page, total) {
  const slide = pres.addSlide({ masterName: "M_LIGHT" });
  lightFrame(slide, pres, { sec: "foundry", kicker: "PART 1  ·  MICROSOFT FOUNDRY", title: "Foundry — from picking a model to evaluating it, in one portal", page, total });
  const cards = [
    ["FaSearch", "Compare models", "Find and compare models from many providers", "Catalog"],
    ["FaRocket", "Deploy & test", "Deploy in a few clicks, then chat with the model right away", "Models"],
    ["FaRobot", "Agent + knowledge", "Add rules and your documents; answers cite their sources", "Agents"],
    ["FaShieldAlt", "Guardrails", "Default policies block jailbreaks and harmful content at input", "Guardrails"],
    ["FaClipboardCheck", "Evaluations", "Auto-generate test questions; score quality and safety", "Evaluations"],
  ];
  const w = 2.3, g = (12.13 - 5 * w) / 4, y = 1.8, h = 3.25;
  for (let i = 0; i < cards.length; i++) {
    const [icon, title, desc, menu] = cards[i];
    const x = 0.6 + i * (w + g);
    lcard(slide, pres, x, y, w, h, C.BLUE);
    pill(slide, pres, `DEMO ${i + 1}`, x + 0.2, y + 0.27, 0.26, { fill: C.BLUE_TINT, color: C.BLUE_DK, size: 10, pad: 0.36, charSpacing: 0.8 });
    await iconCircle(slide, pres, icon, x + 0.2, y + 0.72, 0.62, C.BLUE, "FFFFFF", 0.27);
    txt(slide, title, { x: x + 0.2, y: y + 1.5, w: w - 0.4, h: 0.4, fontSize: 14.5, bold: true, color: C.INK, valign: "middle" });
    txt(slide, desc, { x: x + 0.2, y: y + 1.95, w: w - 0.4, h: 0.85, fontSize: 12.5, color: C.BODY, lineSpacingMultiple: 1.05 });
    labelBox(slide, pres, `Menu · ${menu}`, x + 0.2, y + h - 0.46, w - 0.4, 0.28, { r: 0.14, fill: C.GRAY_TINT, color: C.MUTED, size: 10, bold: true, margin: 0 });
  }
  // Connecting arrows are drawn on top of the cards (last, so the cards do not hide them)
  for (let i = 0; i < cards.length - 1; i++) {
    const x = 0.6 + i * (w + g);
    slide.addShape(pres.shapes.OVAL, { x: x + w + g / 2 - 0.16, y: y + 0.99, w: 0.32, h: 0.32, fill: { color: C.BLUE }, line: { color: "FFFFFF", width: 1.5 } });
    await iconOnly(slide, "FaChevronRight", x + w + g / 2 - 0.07, y + 1.075, 0.14, "FFFFFF");
  }
  const items = [
    ["FaKey", "Keyless authentication", "Entra ID + role-based access (RBAC)"],
    ["FaLayerGroup", "Stay in one project", "Deploy → agent → evaluate, same project"],
    ["FaCode", "From screen to code", "Connect what you built to SDK code"],
  ];
  const iw = 12.13 / 3;
  for (let i = 0; i < items.length; i++) {
    const [icon, t, s] = items[i];
    const x = 0.6 + i * iw;
    await iconCircle(slide, pres, icon, x, 5.42, 0.52, C.BLUE_TINT, C.BLUE, 0.28);
    txt(slide, t, { x: x + 0.68, y: 5.38, w: iw - 0.8, h: 0.32, fontSize: 14.5, bold: true, color: C.INK, valign: "middle" });
    txt(slide, s, { x: x + 0.68, y: 5.7, w: iw - 0.8, h: 0.3, fontSize: 12, color: C.MUTED, valign: "middle" });
  }
  txt(slide, "Note: Models and features shown depend on subscription, region and timing. Menu names on this slide follow the portal (New Foundry).", { x: 0.6, y: 6.5, w: 12.13, h: 0.3, fontSize: 11, color: C.MUTED, valign: "middle" });
  slide.addNotes([
    "[Start of Part 1 — 1 min]  Foundry in one sentence: 'You pick a model, deploy it, build an agent, protect it and evaluate it — all in one portal, in one project.'",
    "The 5 cards are demos 1–5, which you'll see next. The 'Menu' label under each card is the real left-menu name in the portal, so it's easy to find when you follow along yourself.",
    "The three items below run through all the demos: ① keyless authentication (Entra ID) and RBAC, ② staying in the same project from deployment to evaluation, ③ taking what you built on screen into code.",
    `RBAC tip: even a subscription Owner may need a separate role to call a model (data plane). Give the project user the '${F.rbacRole.name}' role (formerly named ${F.rbacRole.formerName}) and add this to your PoC preparation.`,
    "Caution: the models and features on screen depend on subscription, region and timing. Pricing and SLAs are outside the scope of this deck.",
  ].join("\n"));
}

module.exports = { cover, why, demoMap, foundryOverview, lcard };
