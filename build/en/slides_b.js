require("./lang");
const { C, FONT, LOCALE, txt, rich, pill, textW, rrect, rect, labelBox, iconCircle, arrow, lightFrame, darkFooter } = require("../lib");
const { lcard } = require("./slides_a");
const M = require("./metrics");
const { mmss, thousands } = require("./fmt");
const { FOUNDRY: F } = require("./content");

const E = F.eval;

function bulletRuns(lines, o = {}) {
  const runs = [];
  lines.forEach((ln, i) => {
    const parts = rich(ln, { fontSize: o.size ?? 13.5, color: o.color ?? C.BODY, fontFace: FONT }, o.bold ?? C.INK);
    parts.forEach((p, j) => runs.push({ text: p.text, options: { ...p.options, bullet: j === 0 ? { indent: 14 } : undefined, breakLine: j === parts.length - 1 && i < lines.length - 1, paraSpaceAfter: o.gap ?? 7 } }));
  });
  return runs;
}

// 10. Copilot overview + scenario pipeline
async function copilotOverview(pres, page, total) {
  const slide = pres.addSlide({ masterName: "M_LIGHT" });
  lightFrame(slide, pres, { sec: "copilot", kicker: "PART 2  ·  GITHUB COPILOT", title: "Copilot — this time, we hand off the work", page, total });
  const modes = [
    ["FaLightbulb", "Suggest", "Real-time code and test suggestions in your editor", false],
    ["FaComments", "Collaborate", "Work together in Chat, Agent mode and Copilot CLI", false],
    ["FaTasks", "Delegate", "Assign a task; an agent does it and submits the result (cloud agent)", true],
  ];
  const mw = 3.93, mg = (12.13 - 3 * mw) / 2, my = 1.62, mh = 1.15;
  for (let i = 0; i < 3; i++) {
    const [icon, title, desc, hot] = modes[i];
    const x = 0.6 + i * (mw + mg);
    rect(slide, pres, x, my, mw, mh, hot ? C.PURPLE_TINT : C.WHITE, { line: hot ? C.PURPLE : C.LINE, lw: hot ? 1.5 : 0.75 });
    await iconCircle(slide, pres, icon, x + 0.2, my + 0.33, 0.5, hot ? C.PURPLE : "8A97AB", "FFFFFF", 0.27);
    txt(slide, title, { x: x + 0.88, y: my + 0.14, w: 1.6, h: 0.36, fontSize: 17, bold: true, color: C.INK, valign: "middle" });
    txt(slide, desc, { x: x + 0.88, y: my + 0.5, w: mw - 1.05, h: 0.6, fontSize: 12.5, color: C.BODY, lineSpacingMultiple: 1.05 });
    if (hot) {
      const tw = textW("Today's topic", 10, 0.36);
      pill(slide, pres, "Today's topic", x + mw - tw - 0.15, my + 0.14, 0.26, { fill: C.PURPLE, size: 10, pad: 0.36 });
    }
  }
  // Scenario pipeline
  txt(slide, rich("Scenario · ShopFlow **refund policy change request** (CR-2026-014)", { fontSize: 16, color: C.INK, bold: false, fontFace: FONT }, C.PURPLE_DK), { x: 0.6, y: 3.0, w: 7.4, h: 0.32, valign: "middle" });
  txt(slide, "Custom agents work stage by stage; people approve in 3 places", { x: 7.3, y: 3.0, w: 5.43, h: 0.32, fontSize: 12.5, color: C.MUTED, align: "right", valign: "middle" });
  const steps = [["Analyze", "change-analyst"], ["Design", "solution-architect"], ["Build", "app-developer"], ["Test", "qa-engineer"], ["Review", "code-reviewer"], ["Deploy", "release-manager"]];
  const cols = ["4D2A9E", "5B34B8", "6A3FCB", "7647D6", "8352E0", "8F5DEA"];
  const sw = 2.15, sp = (12.13 - sw) / 5, sy = 3.62, sh = 0.8;
  steps.forEach(([name, agent], i) => {
    const x = 0.6 + i * sp;
    slide.addText(name, { shape: i === 0 ? pres.shapes.PENTAGON : pres.shapes.CHEVRON, x, y: sy, w: sw, h: sh, fill: { color: cols[i] }, line: { type: "none" }, color: "FFFFFF", fontFace: FONT, fontSize: 17, bold: true, align: "center", valign: "middle", margin: 0, lang: LOCALE });
    txt(slide, agent, { x: x + 0.15, y: sy + sh + 0.07, w: sw - 0.3, h: 0.26, fontSize: 10.5, color: C.MUTED, align: "center", valign: "middle" });
  });
  // Demo tags
  const tagY = sy + sh + 0.4;
  const tag = (label, i0, i1) => {
    const cx = 0.6 + ((i0 + i1) / 2) * sp + sw / 2;
    const w = i1 > i0 ? 1.4 : 0.98;
    pill(slide, pres, label, cx - w / 2, tagY, 0.26, { fill: C.PURPLE_TINT, color: C.PURPLE_DK, size: 10, w, charSpacing: 0.8 });
  };
  tag("DEMO 6", 0, 0); tag("DEMO 7", 1, 1); tag("DEMO 8", 2, 3); tag("DEMO 9", 4, 4); tag("DEMO 10", 5, 5);
  // Approval gates 1 2 3
  const gate = (n, cx) => {
    slide.addText(String(n), { shape: pres.shapes.OVAL, x: cx - 0.21, y: sy - 0.27, w: 0.42, h: 0.42, fill: { color: C.AMBER }, line: { color: "FFFFFF", width: 1.5 }, color: C.INK, fontFace: FONT, fontSize: 13, bold: true, align: "center", valign: "middle", margin: 0 });
  };
  gate(1, 0.6 + 2 * sp + 0.1); gate(2, 0.6 + 5 * sp + 0.1); gate(3, 0.6 + 5 * sp + sw - 0.3);
  // Two bars at the bottom
  const by = 5.3, bh = 1.0, bw = 5.95;
  rrect(slide, pres, 0.6, by, bw, bh, { r: 0.1, fill: C.AMBER_TINT, line: C.AMBER_LINE, lw: 1 });
  await iconCircle(slide, pres, "FaUserCheck", 0.8, by + 0.27, 0.46, C.AMBER, C.INK, 0.26);
  txt(slide, [
    { text: `${M.approvals} places where people approve`, options: { fontSize: 15, bold: true, color: C.AMBER_DK, breakLine: true } },
    { text: `① Design  ② Code  ③ Production deploy  (+ ${M.decisions} decisions)`, options: { fontSize: 13, color: C.INK } },
  ], { x: 1.45, y: by, w: bw - 1.6, h: bh, valign: "middle", paraSpaceAfter: 3 });
  rrect(slide, pres, 0.6 + bw + 0.23, by, bw, bh, { r: 0.1, fill: C.RED_TINT, line: "F2B8B2", lw: 1 });
  await iconCircle(slide, pres, "FaShieldAlt", 0.6 + bw + 0.43, by + 0.27, 0.46, C.RED_DK, "FFFFFF", 0.27);
  txt(slide, [
    { text: "Hook safeguards (DEMO 11)", options: { fontSize: 15, bold: true, color: C.RED_DK, breakLine: true } },
    { text: "Hooks block unapproved code edits and risky commands", options: { fontSize: 13, color: C.INK } },
  ], { x: 0.6 + bw + 1.08, y: by, w: bw - 1.25, h: bh, valign: "middle", paraSpaceAfter: 3 });
  txt(slide, "Note: ShopFlow (a fictional store) data and approvers are all fictional. Custom agents and Hooks are built with Copilot CLI's custom agent and hook features.", { x: 0.6, y: 6.5, w: 12.13, h: 0.3, fontSize: 11, color: C.MUTED, valign: "middle" });
  slide.addNotes([
    "[Start of Part 2 — 1 min]  Copilot started as code autocomplete. Today you work with it in conversation (Chat, Agent mode, Copilot CLI) and hand work over to it (cloud agent and more). In this part we show the 'handing over', using Copilot CLI in the terminal.",
    "Scenario: the ShopFlow (fictional store) business team asked for a refund policy change — VIP refund window from 30 to 60 days, admin approval for refunds above KRW 1,000,000, a required refund reason, and updated wording (CR-2026-014). This one request goes through 6 stages, and a specialist agent (change-analyst and others) does the work at each stage.",
    `The yellow circles ①②③ are the human approval points (design · code · production deploy). Add the ${M.decisions} policy decisions in the design stage and people step in ${M.interventions} times in total.`,
    "The custom agents and Hooks are built with Copilot CLI's custom agent and hook features (demo kit 'GHCP_CLI_Demo_Kit'). If a customer asks how to set them up, you can share the kit.",
    "Each demo (6–11) has '3 lines on what to watch + 1 line of customer value'. The videos are silent, so narrate along with the captions on the recorded screen.",
    "Caution: product names and features such as the cloud agent change often. Check the latest names right before you present.",
  ].join("\n"));
}

// 17. Results (dark background)
async function results(pres, page, total) {
  const slide = pres.addSlide({ masterName: "M_COPILOT" });
  const w1 = pill(slide, pres, "RESULT", 0.6, 0.36, 0.3, { fill: C.C_PURPLE, size: 12, charSpacing: 1, pad: 0.4 });
  txt(slide, "GITHUB COPILOT  ·  MEASURED", { x: 0.6 + w1 + 0.16, y: 0.36, w: 5, h: 0.3, fontSize: 11, bold: true, color: C.C_PURPLE_L, charSpacing: 1.5, valign: "middle" });
  txt(slide, `One change request: ${M.totalMin} min, ${M.interventions} human interventions`, { x: 0.6, y: 0.8, w: 12.13, h: 0.62, fontSize: 32, bold: true, color: "FFFFFF", valign: "middle" });
  txt(slide, `${M.stages.length} stages from analysis to operations in one run — all measured in the same recorded session`, { x: 0.6, y: 1.43, w: 12.13, h: 0.36, fontSize: 15, color: C.D_MUTED, valign: "middle" });

  const tiles = [
    [[[M.totalMin, 46], [" min", 24]], [`Total time, ${M.stages.length} stages`, "Analyze → Operate"], C.C_PURPLE_L],
    [[[`${M.tests.baseline}→${M.tests.total}`, 42]], ["Tests (baseline → final)", `Coverage ${M.tests.coverage}%`], C.C_PURPLE_L],
    [[[String(M.interventions), 46]], ["Human interventions", `${M.approvals} approvals + ${M.decisions} decisions`], C.AMBER],
    [[[`$${M.usdText}`, 42]], ["AI usage", `${M.aicRounded} AI Credits`], C.C_PURPLE_L],
  ];
  const tw = 2.9, tg = (12.13 - 4 * tw) / 3, ty = 2.05, th = 1.75;
  tiles.forEach(([runs, label, col], i) => {
    const x = 0.6 + i * (tw + tg);
    rrect(slide, pres, x, ty, tw, th, { r: 0.12, fill: C.D_CARD, line: C.D_LINE, lw: 0.75 });
    rect(slide, pres, x, ty + 0.18, 0.07, th - 0.36, col);
    txt(slide, runs.map(([t, s]) => ({ text: t, options: { fontSize: s, bold: true, color: col === C.AMBER ? C.AMBER : "FFFFFF" } })), { x: x + 0.3, y: ty + 0.2, w: tw - 0.45, h: 0.95, valign: "middle" });
    txt(slide, [
      { text: label[0], options: { fontSize: 13.5, bold: true, color: "FFFFFF", breakLine: true } },
      { text: label[1], options: { fontSize: 12.5, color: C.D_MUTED } },
    ], { x: x + 0.3, y: ty + 1.17, w: tw - 0.45, h: 0.5, valign: "top", paraSpaceAfter: 2 });
  });

  // Per-stage timeline
  const stages = M.stages.map((s) => [s.label, s.sec]);
  const sum = M.stageSum;
  const cols = ["4D2A9E", "5B34B8", "6A3FCB", "7B4FDD", "8B5CF6", "A07BFA", "BDA6FF"];
  txt(slide, "Time per stage (min:sec)", { x: 0.6, y: 4.1, w: 4, h: 0.3, fontSize: 14, bold: true, color: "FFFFFF", valign: "middle" });
  const bx = 0.6, bw = 12.13, byy = 4.95, bhh = 0.8;
  let cum = 0;
  stages.forEach(([name, s], i) => {
    const x = bx + (cum / sum) * bw, w = (s / sum) * bw;
    slide.addText([{ text: name, options: { fontSize: w < 1.0 ? 12 : 14, bold: true, breakLine: true } }, { text: mmss(s), options: { fontSize: 11 } }], {
      x, y: byy, w, h: bhh, fill: { color: cols[i] }, line: { color: C.D_BG, width: 1.5 }, color: i >= 6 ? C.D_BG : "FFFFFF", fontFace: FONT, align: "center", valign: "middle", margin: 0, lang: LOCALE,
    });
    cum += s;
  });
  const gx = (c) => bx + (c / sum) * bw;
  // [number, seconds since the start of stage 1, label, label side]: gates 2 and 3 are close together, so label 2 goes to the left
  const gates = [[1, M.gates.design, "Design approval", "right"], [2, M.gates.code, "Code approval", "left"], [3, M.gates.production, "Production deploy approval", "right"]];
  gates.forEach(([n, c, label, side]) => {
    slide.addShape(pres.shapes.LINE, { x: gx(c), y: 4.62, w: 0, h: byy - 4.62, line: { color: C.AMBER, width: 1.25 } });
    slide.addText(String(n), { shape: pres.shapes.OVAL, x: gx(c) - 0.17, y: 4.42, w: 0.34, h: 0.34, fill: { color: C.AMBER }, line: { type: "none" }, color: C.D_BG, fontFace: FONT, fontSize: 11, bold: true, align: "center", valign: "middle", margin: 0 });
    if (side === "right") txt(slide, label, { x: gx(c) + 0.22, y: 4.42, w: 2.6, h: 0.34, fontSize: 11.5, bold: true, color: C.AMBER, valign: "middle" });
    else txt(slide, label, { x: gx(c) - 0.22 - 2.0, y: 4.42, w: 2.0, h: 0.34, fontSize: 11.5, bold: true, color: C.AMBER, align: "right", valign: "middle" });
  });
  txt(slide, `${M.decisions} decisions (design stage)`, { x: gx(M.stages[0].sec) + 0.15, y: 5.82, w: 3.5, h: 0.26, fontSize: 11, color: C.AMBER, valign: "middle" });

  // Three summary columns
  const g = M.git, rv = M.review, a = M.audit;
  const facts = [
    ["CHANGE SIZE", `${g.files} files · +${thousands(g.insertions)} / −${g.deletions} lines · ${g.commits} commits`],
    ["REVIEW RESULT", `${rv.blocker} Blocker · ${rv.major} Major · ${rv.minor} Minor`],
    ["AUDIT LOG · TOOL CALLS", `${a.calls} calls · ${a.allowed} allowed\n${a.ask} approval requests · ${a.deny} denied`],
  ];
  const fw = 12.13 / 3;
  facts.forEach(([lead, val], i) => {
    const x = 0.6 + i * fw;
    txt(slide, lead, { x, y: 6.15, w: fw - 0.2, h: 0.26, fontSize: 11, bold: true, color: C.C_PURPLE_L, charSpacing: 1, valign: "middle" });
    txt(slide, val, { x, y: 6.42, w: fw - 0.2, h: 0.5, fontSize: 13, color: "FFFFFF", valign: "top" });
  });
  darkFooter(slide, pres, { page, total, note: "● Measured in the English-language recorded session of the ShopFlow demo kit (single run)  ·  Fictional scenario and data; no guarantee for your environment" });
  const st = M.stage;
  slide.addNotes([
    "[Measured results — 1 min]  These numbers aggregate the original session behind demos 6–10 (the ShopFlow refund policy change, CR-2026-014), from the English-language recording. Demo 11 was recorded in a separate session.",
    `Total ${M.totalMin} min (${thousands(M.totalSec)} s): analyze ${st.analyze.sec} s · design ${st.design.sec} · build ${st.build.sec} · test ${st.test.sec} · review ${st.review.sec} · deploy ${st.deploy.sec} · operate ${st.operate.sec}. (The stage times add up to ${thousands(M.stageSum)} s; the other ${Math.round(M.totalSec - M.stageSum)} s is the start of the session, before the first stage.)`,
    `Tests: baseline ${M.tests.baseline} → ${M.tests.total} (+${M.tests.added}), coverage ${M.tests.coverage}%. Change: ${g.files} files, +${thousands(g.insertions)}/−${g.deletions} lines, ${g.commits} commits (${g.code_files} code files +${thousands(g.code_insertions)}/−${g.code_deletions}). Review: ${rv.blocker} Blocker · ${rv.major} Major · ${rv.minor} Minor.`,
    `Human interventions, ${M.interventions}: ${M.approvals} approvals (design · code · production deploy) + ${M.decisions} decisions in the design stage. One decision (how to treat legacy apps) was typed in by a person and differed from the AI's recommendation. Approval records are bound to the SHA-256 hash of the design document and of the code, so they can be audited (approvals/*.json).`,
    `The yellow ①②③ on the timeline mark where the approval records were written — design approval about ${M.gateMin.design} min, code approval about ${M.gateMin.code} min and production deploy approval about ${M.gateMin.production} min into the run (counted from the start of the run).`,
    `Audit log: all ${a.calls} tool calls were recorded — ${a.allowed} allowed, ${a.ask} sent to a person for approval (ask), ${a.deny} denied. The two denials were real guardrail hits in the main run: the reviewer (read-only) tried to commit its report, and the ops analyst ran a DB query that was not clearly read-only. Demo 11 shows the blocking itself, recorded in a separate session.`,
    `AI usage: ${M.aicText} AI Credits ≈ $${M.usdText} is the tally and conversion at recording time. Pricing can change, so don't use the number as a quote — suggest 'we measure it in the PoC'.`,
    `Caution: this is a single run of a fictional scenario. Results depend on your code base, its complexity and the model. '${Math.round(M.totalSec / 60)} min' is not a promise of how much people's work shrinks; it is an example of how a change request of this size flows. Your current lead time differs by organization, so measure it with the same metrics in the pilot.`,
  ].join("\n"));
}

// 18. Together
async function together(pres, page, total) {
  const slide = pres.addSlide({ masterName: "M_LIGHT" });
  lightFrame(slide, pres, { sec: "together", kicker: "TOGETHER", title: "Together — operational trust on top of building speed", page, total });
  const cards = [
    ["GITHUB COPILOT", C.PURPLE, C.PURPLE_TINT, C.PURPLE_DK, "Build", "Agents do analysis through deployment; people approve", "DEMO 6–11", "FaCodeBranch"],
    ["MICROSOFT FOUNDRY", C.BLUE, C.BLUE_TINT, C.BLUE_DK, "Operate", "Deploy models, connect agents to your documents and code", "DEMO 1–3", "FaCloud"],
    ["MICROSOFT FOUNDRY", C.BLUE, C.BLUE_TINT, C.BLUE_DK, "Guard & verify", "Guardrails block at input; Evaluations score quality & safety", "DEMO 4–5", "FaShieldAlt"],
  ];
  const w = 3.65, g = (12.13 - 3 * w) / 2, y = 1.75, h = 2.55;
  for (let i = 0; i < 3; i++) {
    const [lab, col, tint, dk, big, desc, demo, icon] = cards[i];
    const x = 0.6 + i * (w + g);
    lcard(slide, pres, x, y, w, h, col);
    pill(slide, pres, lab, x + 0.25, y + 0.28, 0.28, { fill: tint, color: dk, size: 10, charSpacing: 1, pad: 0.4 });
    await iconCircle(slide, pres, icon, x + w - 0.85, y + 0.25, 0.55, col, "FFFFFF", 0.27);
    txt(slide, big, { x: x + 0.25, y: y + 0.75, w: w - 0.5, h: 0.6, fontSize: 26, bold: true, color: C.INK, valign: "middle" });
    txt(slide, desc, { x: x + 0.25, y: y + 1.4, w: w - 0.5, h: 0.7, fontSize: 13.5, color: C.BODY, lineSpacingMultiple: 1.08 });
    pill(slide, pres, demo, x + 0.25, y + h - 0.46, 0.28, { fill: C.GRAY_TINT, color: C.MUTED, size: 10, charSpacing: 0.8, pad: 0.4 });
    if (i < 2) arrow(slide, pres, x + w + 0.07, y + 1.2, x + w + g - 0.07, y + 1.2, { color: C.INK, width: 2.25 });
  }
  // Feedback loop arrow
  const loopY = 4.78;
  const x1 = 0.6 + 0.5 * w, x3 = 0.6 + 2 * (w + g) + 0.5 * w;
  slide.addShape(pres.shapes.LINE, { x: x3, y: y + h, w: 0, h: loopY - (y + h), line: { color: C.TEAL_DK, width: 1.75 } });
  slide.addShape(pres.shapes.LINE, { x: x1, y: loopY, w: x3 - x1, h: 0, line: { color: C.TEAL_DK, width: 1.75 } });
  arrow(slide, pres, x1, loopY, x1, y + h + 0.02, { color: C.TEAL_DK, width: 1.75 });
  labelBox(slide, pres, "Low-scoring answers → ask Copilot to fix instructions, docs or code → evaluate again", 2.2, loopY - 0.19, 8.9, 0.38, { r: 0.19, fill: C.WHITE, line: C.TEAL_DK, lw: 1.25, color: C.TEAL_DK, size: 12.5, bold: true, margin: 0 });
  // Today's connection
  const cy = 5.3, ch = 1.38;
  lcard(slide, pres, 0.6, cy, 12.13, ch, C.TEAL_DK);
  txt(slide, "Today's connection — the ShopFlow refund policy", { x: 0.9, y: cy + 0.2, w: 7, h: 0.3, fontSize: 13, bold: true, color: C.TEAL_DK, valign: "middle" });
  const flow = [
    ["FaFileAlt", "Policy designed by Copilot", "CR-2026-014 design document", C.PURPLE],
    ["FaDatabase", "Foundry agent's knowledge", "Connected with File search", C.BLUE],
    ["FaClipboardCheck", "Checked by Evaluations", `${E.rows} auto-generated questions`, C.BLUE],
  ];
  const fw = 3.55, fg = (11.5 - 3 * fw) / 2;
  for (let i = 0; i < 3; i++) {
    const [icon, t, s, col] = flow[i];
    const x = 0.9 + i * (fw + fg);
    await iconCircle(slide, pres, icon, x, cy + 0.66, 0.5, col, "FFFFFF", 0.27);
    txt(slide, t, { x: x + 0.62, y: cy + 0.6, w: fw - 0.65, h: 0.34, fontSize: 14, bold: true, color: C.INK, valign: "middle" });
    txt(slide, s, { x: x + 0.62, y: cy + 0.93, w: fw - 0.65, h: 0.3, fontSize: 12, color: C.MUTED, valign: "middle" });
    if (i < 2) arrow(slide, pres, x + fw + 0.02, cy + 0.91, x + fw + fg - 0.02, cy + 0.91, { color: C.TEAL_DK, width: 1.75 });
  }
  slide.addNotes([
    "[Together — 1 min]  The two products are the front and back of one flow. Copilot provides the speed of the people who build; Foundry provides the trust needed to operate what they built.",
    "Read from the left: Build (Copilot: demos 6–11) → Operate (Foundry: demos 1–3) → Guard & verify (Foundry: demos 4–5). The arrow underneath is the improvement loop: take the answers that scored low in evaluation, fix the instructions, documents or code (by asking Copilot), and evaluate again.",
    "Today's connection: the refund policy document in demos 3–5 is a fictional document based on the design document (CR-2026-014) from the Copilot demos. So the same ShopFlow policy flowed from design → knowledge → evaluation.",
    "Caution: this slide shows a conceptual flow. It does not mean the two products integrate automatically; the only link in today's demos is the document (the policy) that a person carried over. Integration automation (for example, evaluation results → automatic issue creation) is an extension we can design together in the PoC.",
  ].join("\n"));
}

// 19. Next steps
async function nextSteps(pres, page, total) {
  const slide = pres.addSlide({ masterName: "M_LIGHT" });
  lightFrame(slide, pres, { sec: "intro", kicker: "NEXT STEPS", title: "Next steps — a 2-week PoC on your own work", page, total });
  const cols = [
    ["Preparation", "D-7 ~ D-1", C.BLUE_DK, C.BLUE_TINT, C.BLUE, [
      "**1–2 target tasks** (candidate agents · repositories)",
      "Prepare **de-identified samples** of documents and repositories",
      "Check **Azure subscription & Foundry project**, **Copilot licenses**, roles",
    ]],
    ["Set up & connect", "Week 1", C.PURPLE_DK, C.PURPLE_TINT, C.PURPLE, [
      "Foundry: connect **guardrails · agent · company documents**",
      "Copilot: pilot with **5–10 people**; set up custom agents and Hooks",
      "Collect **20–50 real questions** for evaluation",
    ]],
    ["Measure & decide", "Week 2", C.TEAL_DK, C.TEAL_TINT, C.TEAL_DK, [
      "Measure evaluation scores → improve → **re-evaluate**",
      "**Before/after comparison** of lead time, testing and review effort",
      "Review the results and agree on an **expansion roadmap**",
    ]],
  ];
  const w = 3.9, g = (12.13 - 3 * w) / 2, y = 1.75, h = 3.45;
  cols.forEach(([title, tag, dk, tint, col, bl], i) => {
    const x = 0.6 + i * (w + g);
    lcard(slide, pres, x, y, w, h, col);
    pill(slide, pres, tag, x + 0.25, y + 0.3, 0.28, { fill: tint, color: dk, size: 10.5, charSpacing: 1, pad: 0.4 });
    txt(slide, title, { x: x + 0.25, y: y + 0.68, w: w - 0.5, h: 0.45, fontSize: 19, bold: true, color: C.INK, valign: "middle" });
    txt(slide, bulletRuns(bl, { size: 13, gap: 6, bold: dk }), { x: x + 0.25, y: y + 1.3, w: w - 0.5, h: h - 1.4, valign: "top", lineSpacingMultiple: 1.08 });
  });
  // Deliverables
  const oy = 5.5, oh = 0.95;
  rrect(slide, pres, 0.6, oy, 12.13, oh, { r: 0.12, fill: C.INK });
  txt(slide, "Deliverables", { x: 0.9, y: oy, w: 1.5, h: oh, fontSize: 14, bold: true, color: C.AMBER, valign: "middle" });
  const outs = ["Quality & safety report", "Productivity comparison", "Approval & control guide", "Expansion roadmap"];
  const avail = 12.55 - 2.4, gap = 0.12;
  const base = outs.map((o) => textW(o, 12.5, 0));
  const pad = Math.min(0.5, (avail - gap * (outs.length - 1) - base.reduce((a, b) => a + b, 0)) / outs.length);
  let ox = 2.4;
  outs.forEach((o, i) => {
    const ow = base[i] + pad;
    labelBox(slide, pres, o, ox, oy + 0.27, ow, 0.4, { r: 0.2, fill: "24304F", color: "FFFFFF", size: 12.5, bold: true, margin: 0 });
    ox += ow + gap;
  });
  txt(slide, "Note: Schedule, scope and staffing are proposals; we adjust them to your environment and timeline.", { x: 0.6, y: 6.55, w: 12.13, h: 0.3, fontSize: 11, color: C.MUTED, valign: "middle" });
  slide.addNotes([
    "[Next steps — 1 min]  Proposal: a '2-week PoC' that measures what you saw today on your own work. (The schedule, scope and staffing below are a draft proposal; adjust them to the customer.)",
    "Preparation: 1–2 target tasks · de-identified sample documents/repositories · Azure subscription and Foundry project · Copilot licenses · the required roles (including Foundry data-plane access).",
    "Week 1: on the Foundry side, connect guardrails, an agent and company documents; on the Copilot side, a pilot with 5–10 people and custom agents and Hooks. Collect 20–50 real questions for evaluation.",
    "Week 2: a loop of measuring evaluation scores → improving → re-evaluating, a before/after comparison of lead time, testing and review effort, and a results review.",
    "Deliverables: an evaluation report, a productivity comparison, an approval and control guide, and an expansion roadmap.",
    "Example closing questions: 'Which task would you most like to apply AI to first?', 'How long does one change request take to reach deployment today?', 'Which control worries your security team most?'",
  ].join("\n"));
}

// 20. Closing
async function closing(pres, page, total) {
  const slide = pres.addSlide({ masterName: "M_CLOSE" });
  txt(slide, "3 things to take home", { x: 0.8, y: 0.7, w: 9, h: 0.8, fontSize: 38, bold: true, color: "FFFFFF", valign: "middle" });
  const rows = [
    ["01", "One portal", "Pick a model → deploy → agent → guardrails → evaluate, all in one project", C.F_BLUE_L],
    ["02", "Even when agents do the work", "People approve, the system blocks — speed and control together", C.C_PURPLE_L],
    ["03", "Together", "Building speed plus operational trust — take AI apps all the way to production", C.AMBER],
  ];
  rows.forEach(([n, head, sub, col], i) => {
    const y = 1.95 + i * 1.35;
    rrect(slide, pres, 0.8, y, 11.73, 1.15, { r: 0.14, fill: C.D_CARD, line: C.D_LINE, lw: 0.75, transparency: 12 });
    rect(slide, pres, 0.8, y + 0.2, 0.08, 0.75, col);
    txt(slide, n, { x: 1.15, y, w: 1.1, h: 1.15, fontSize: 40, bold: true, color: col, valign: "middle" });
    txt(slide, head, { x: 2.3, y: y + 0.14, w: 9.9, h: 0.5, fontSize: 25, bold: true, color: "FFFFFF", valign: "middle" });
    txt(slide, sub, { x: 2.3, y: y + 0.64, w: 9.9, h: 0.4, fontSize: 15, color: C.D_MUTED, valign: "middle" });
  });
  txt(slide, "Q&A", { x: 0.8, y: 6.05, w: 3.2, h: 0.85, fontSize: 44, bold: true, color: "FFFFFF", valign: "middle" });
  pill(slide, pres, "Next step · 2-week PoC proposal", 4.0, 6.27, 0.4, { fill: C.AMBER, color: C.D_BG, size: 14, pad: 0.7 });
  darkFooter(slide, pres, { page, total });
  slide.addNotes([
    "[Closing — 30 s]  Sum up in three lines and take questions.",
    "01 One portal (Foundry) · 02 Even when agents do the work, people approve and the system blocks (Copilot + Hook) · 03 Together: speed + trust.",
    "Likely questions and the direction of the answers: ① 'Where does the data go?' → check subscription, region and guardrail settings in the PoC pre-check (this deck does not cover security certification details). ② 'What does it cost?' → the demo numbers are for reference; we measure usage in the PoC, then quote. ③ 'Which model is best?' → compare in demo 1 and evaluate in demo 5 on your own work. ④ 'Can we use Foundry without Copilot, or the reverse?' → each can be adopted on its own; together they close the improvement loop.",
    "Closing: 'As a next step we propose a 2-week PoC. Tell us the one or two tasks where you would most like to apply AI first, and we will scope it.'",
  ].join("\n"));
}

module.exports = { copilotOverview, results, together, nextSteps, closing };
