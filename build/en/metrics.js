require("./lang");
const fs = require("fs");
const path = require("path");
const { ROOT } = require("../lib");
const { minSec } = require("./fmt");

// Copilot numbers of the English edition come from the English recorded session:
// assets/en/run-metrics.json (a copy of the demo kit's sample-output/run-metrics.json).
const raw = JSON.parse(fs.readFileSync(path.join(ROOT, "assets", "en", "run-metrics.json"), "utf8"));

const r1 = (x) => Math.round(x * 10) / 10;

const stages = raw.stages.map((s) => ({ id: s.id, label: s.label, agent: s.agent, sec: s.real_s, aic: s.aic, toolCalls: s.tool_calls }));
const stage = Object.fromEntries(stages.map((s) => [s.label.toLowerCase(), s]));
for (const k of ["analyze", "design", "build", "test", "review", "deploy", "operate"]) if (!stage[k]) throw new Error(`run-metrics.json: stage "${k}" missing`);

const stageSum = stages.reduce((a, s) => a + s.sec, 0);

// Approval gates: seconds since the start of stage 1 (approvals[*].at vs stages[0].wall_start)
const t0 = raw.stages[0].wall_start;
const gateAt = (k) => r1(Date.parse(raw.approvals[k].at) / 1000 - t0);
const gates = { design: gateAt("design"), code: gateAt("code"), production: gateAt("production") };

const humanApprovals = Object.values(raw.approvals).filter((a) => a.approver && a.approver !== "system").length;
const DECISIONS = 3; // human decisions in the design stage (design document, section 1)

const aic = raw.total.aic;
const audit = {
  calls: raw.audit.calls, ask: raw.audit.ask, deny: raw.audit.deny,
  // run-metrics "allow" (166) also counts the two calls that a role hook denied afterwards; net allowed adds up to calls
  allowed: raw.audit.calls - raw.audit.ask - raw.audit.deny,
  denials: raw.audit.denials,
};

const M = {
  stages, stage, stageSum,
  totalSec: raw.total.real_s,
  totalMin: (raw.total.real_s / 60).toFixed(1), // "38.0"
  gates,
  gateMin: { design: Math.round(gates.design / 60), code: Math.round(gates.code / 60), production: Math.round(gates.production / 60) },
  approvals: humanApprovals,
  decisions: DECISIONS,
  interventions: humanApprovals + DECISIONS,
  aic, aicText: aic.toFixed(2), aicRounded: Math.round(aic), usd: raw.total.usd, usdText: raw.total.usd.toFixed(2),
  tests: raw.tests,
  git: raw.git,
  review: raw.review,
  audit,
  // Facts from the English run's documents (sample-output/docs-cr-CR-2026-014): 01-impact-analysis.md §3, §4, §6
  facts: { impactAreas: 10, dataAnomalies: 3, decisionsFlagged: 2, smoke: "6/6", buildCommitFiles: 14 }, // buildCommitFiles: dde25f9 incl. the CR documents (git-log-stat.txt, also on screen)
  version: raw.version, // "1.1.0"
  sec: (label) => minSec(stage[label].sec), // "2 min 42 s"
  s1: (label) => stage[label].sec.toFixed(1), // "161.8"
};

if (M.interventions !== 6) throw new Error(`expected 6 human interventions, got ${M.interventions}`);

module.exports = M;
