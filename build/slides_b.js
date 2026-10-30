const { A, b64, C, SEC, txt, rich, pill, textW, rrect, rect, oval, labelBox, numBadge, iconCircle, iconOnly, arrow, lightFrame, darkFooter } = require("./lib");
const { lcard } = require("./slides_a");

function bulletRuns(lines, o = {}) {
  const runs = [];
  lines.forEach((ln, i) => {
    const parts = require("./lib").rich(ln, { fontSize: o.size ?? 13.5, color: o.color ?? C.BODY, fontFace: "Malgun Gothic" }, o.bold ?? C.INK);
    parts.forEach((p, j) => runs.push({ text: p.text, options: { ...p.options, bullet: j === 0 ? { indent: 14 } : undefined, breakLine: j === parts.length - 1 && i < lines.length - 1, paraSpaceAfter: o.gap ?? 7 } }));
  });
  return runs;
}

// 10. Copilot 개요 + 시나리오 파이프라인
async function copilotOverview(pres, page, total) {
  const slide = pres.addSlide({ masterName: "M_LIGHT" });
  lightFrame(slide, pres, { sec: "copilot", kicker: "PART 2  ·  GITHUB COPILOT", title: "Copilot — 이번에는 '일을 맡기는' 모습을 봅니다", page, total });
  const modes = [
    ["FaLightbulb", "제안", "에디터에서 코드·테스트를 실시간으로 제안", false],
    ["FaComments", "협업", "Chat · Agent mode · Copilot CLI 로 대화하며 함께 작업", false],
    ["FaTasks", "위임", "작업을 맡기면 에이전트가 수행하고 결과를 제출 (cloud agent 등)", true],
  ];
  const mw = 3.93, mg = (12.13 - 3 * mw) / 2, my = 1.62, mh = 1.15;
  for (let i = 0; i < 3; i++) {
    const [icon, title, desc, hot] = modes[i];
    const x = 0.6 + i * (mw + mg);
    rect(slide, pres, x, my, mw, mh, hot ? C.PURPLE_TINT : C.WHITE, { line: hot ? C.PURPLE : C.LINE, lw: hot ? 1.5 : 0.75 });
    await iconCircle(slide, pres, icon, x + 0.2, my + 0.33, 0.5, hot ? C.PURPLE : "8A97AB", "FFFFFF", 0.27);
    txt(slide, title, { x: x + 0.88, y: my + 0.14, w: 1.6, h: 0.36, fontSize: 17, bold: true, color: C.INK, valign: "middle" });
    txt(slide, desc, { x: x + 0.88, y: my + 0.5, w: mw - 1.05, h: 0.6, fontSize: 12.5, color: C.BODY, lineSpacingMultiple: 1.05 });
    if (hot) pill(slide, pres, "오늘의 주제", x + mw - 1.25, my + 0.14, 0.26, { fill: C.PURPLE, size: 10, pad: 0.36 });
  }
  // 시나리오 파이프라인
  txt(slide, rich("시나리오 · ShopFlow **환불 정책 변경 요청** (CR-2026-014)", { fontSize: 16, color: C.INK, bold: false, fontFace: "Malgun Gothic" }, C.PURPLE_DK), { x: 0.6, y: 3.0, w: 7.4, h: 0.32, valign: "middle" });
  txt(slide, "맞춤 에이전트가 단계별로 일하고, 사람은 3곳에서 승인합니다", { x: 7.3, y: 3.0, w: 5.43, h: 0.32, fontSize: 12.5, color: C.MUTED, align: "right", valign: "middle" });
  const steps = [["분석", "change-analyst"], ["설계", "solution-architect"], ["구현", "app-developer"], ["테스트", "qa-engineer"], ["리뷰", "code-reviewer"], ["배포", "release-manager"]];
  const cols = ["4D2A9E", "5B34B8", "6A3FCB", "7647D6", "8352E0", "8F5DEA"];
  const sw = 2.15, sp = (12.13 - sw) / 5, sy = 3.62, sh = 0.8;
  steps.forEach(([name, agent], i) => {
    const x = 0.6 + i * sp;
    slide.addText(name, { shape: i === 0 ? pres.shapes.PENTAGON : pres.shapes.CHEVRON, x, y: sy, w: sw, h: sh, fill: { color: cols[i] }, line: { type: "none" }, color: "FFFFFF", fontFace: "Malgun Gothic", fontSize: 17, bold: true, align: "center", valign: "middle", margin: 0, lang: "ko-KR" });
    txt(slide, agent, { x: x + 0.15, y: sy + sh + 0.07, w: sw - 0.3, h: 0.26, fontSize: 10.5, color: C.MUTED, align: "center", valign: "middle" });
  });
  // 데모 태그
  const tagY = sy + sh + 0.4;
  const tag = (label, i0, i1) => {
    const cx = 0.6 + ((i0 + i1) / 2) * sp + sw / 2;
    const w = i1 > i0 ? 1.4 : 0.98;
    pill(slide, pres, label, cx - w / 2, tagY, 0.26, { fill: C.PURPLE_TINT, color: C.PURPLE_DK, size: 10, w, charSpacing: 0.8 });
  };
  tag("DEMO 6", 0, 0); tag("DEMO 7", 1, 1); tag("DEMO 8", 2, 3); tag("DEMO 9", 4, 4); tag("DEMO 10", 5, 5);
  // 승인 게이트 ①②③
  const gate = (n, cx) => {
    slide.addText(String(n), { shape: pres.shapes.OVAL, x: cx - 0.21, y: sy - 0.27, w: 0.42, h: 0.42, fill: { color: C.AMBER }, line: { color: "FFFFFF", width: 1.5 }, color: C.INK, fontFace: "Malgun Gothic", fontSize: 13, bold: true, align: "center", valign: "middle", margin: 0 });
  };
  gate(1, 0.6 + 2 * sp + 0.1); gate(2, 0.6 + 5 * sp + 0.1); gate(3, 0.6 + 5 * sp + sw - 0.3);
  // 하단 두 개 바
  const by = 5.3, bh = 1.0, bw = 5.95;
  rrect(slide, pres, 0.6, by, bw, bh, { r: 0.1, fill: C.AMBER_TINT, line: C.AMBER_LINE, lw: 1 });
  await iconCircle(slide, pres, "FaUserCheck", 0.8, by + 0.27, 0.46, C.AMBER, C.INK, 0.26);
  txt(slide, [
    { text: "사람이 승인하는 곳 3개", options: { fontSize: 15, bold: true, color: C.AMBER_DK, breakLine: true } },
    { text: "① 설계  ② 코드  ③ 운영 배포  (+ 결정 3건)", options: { fontSize: 13, color: C.INK } },
  ], { x: 1.45, y: by, w: bw - 1.6, h: bh, valign: "middle", paraSpaceAfter: 3 });
  rrect(slide, pres, 0.6 + bw + 0.23, by, bw, bh, { r: 0.1, fill: C.RED_TINT, line: "F2B8B2", lw: 1 });
  await iconCircle(slide, pres, "FaShieldAlt", 0.6 + bw + 0.43, by + 0.27, 0.46, C.RED_DK, "FFFFFF", 0.27);
  txt(slide, [
    { text: "Hook 안전장치 (DEMO 11)", options: { fontSize: 15, bold: true, color: C.RED_DK, breakLine: true } },
    { text: "승인 전 코드 수정·위험 명령은 시스템이 차단합니다", options: { fontSize: 13, color: C.INK } },
  ], { x: 0.6 + bw + 1.08, y: by, w: bw - 1.25, h: bh, valign: "middle", paraSpaceAfter: 3 });
  txt(slide, "※ ShopFlow(가상 쇼핑몰)의 데이터·승인자는 모두 가상입니다. 맞춤 에이전트 · Hook 은 Copilot CLI 의 사용자 정의 에이전트/훅 기능으로 구성했습니다.", { x: 0.6, y: 6.5, w: 12.13, h: 0.3, fontSize: 11, color: C.MUTED, valign: "middle" });
  slide.addNotes([
    "[Part 2 시작 — 1분]  Copilot 은 '코드 자동완성'에서 출발해 지금은 대화로 함께 일하고(Chat, Agent mode, Copilot CLI), 일을 맡기는(cloud agent 등) 단계까지 확장되어 있습니다. 오늘은 이 중 '맡기는' 모습을 터미널 Copilot CLI 로 보여드립니다.",
    "시나리오: ShopFlow(가상 쇼핑몰) 현업이 '환불 정책 변경(VIP 환불 기간 확대, 100만 원 초과 환불 승인, 환불 사유 필수 등)'을 요청했습니다(CR-2026-014). 이 요청 하나가 6개 단계를 거칩니다 — 단계마다 전문 에이전트(change-analyst 등)가 일합니다.",
    "노란 원 ①②③ 은 사람 승인 지점(설계 · 코드 · 운영 배포)입니다. 여기에 설계 단계의 정책 결정 3건이 더해져 사람 개입은 총 6번입니다.",
    "맞춤 에이전트와 Hook 은 Copilot CLI 의 사용자 정의 에이전트·훅 기능으로 구성한 것입니다(데모 키트 'GHCP_CLI_Demo_Kit'). 설정 방법이 궁금한 고객에게는 키트를 공유할 수 있습니다.",
    "각 데모(6~11)는 '무엇을 볼지 3줄 + 고객 가치 1줄'로 구성했습니다. 영상은 소리가 없으니 화면 아래 자막과 함께 설명해 주세요.",
    "주의: cloud agent 등 제품 이름·기능은 변경이 잦으니 발표 직전에 최신 명칭을 확인하세요.",
  ].join("\n"));
}

// 17. 실측 결과 (어두운 배경)
async function results(pres, page, total) {
  const slide = pres.addSlide({ masterName: "M_COPILOT" });
  const w1 = pill(slide, pres, "RESULT", 0.6, 0.36, 0.3, { fill: C.C_PURPLE, size: 12, charSpacing: 1, pad: 0.4 });
  txt(slide, "GITHUB COPILOT  ·  실측", { x: 0.6 + w1 + 0.16, y: 0.36, w: 5, h: 0.3, fontSize: 11, bold: true, color: C.C_PURPLE_L, charSpacing: 1.5, valign: "middle" });
  txt(slide, "변경 요청 1건, 37.6분 — 사람의 개입은 6번", { x: 0.6, y: 0.8, w: 12.13, h: 0.62, fontSize: 32, bold: true, color: "FFFFFF", valign: "middle" });
  txt(slide, "분석부터 운영 분석까지 7단계를 한 번에 — 같은 녹화 세션에서 집계한 실측값입니다", { x: 0.6, y: 1.43, w: 12.13, h: 0.36, fontSize: 15, color: C.D_MUTED, valign: "middle" });

  const tiles = [
    [[["37.6", 46], ["분", 24]], ["7단계 총 소요", "분석 → 운영 분석"], C.C_PURPLE_L],
    [[["26→117", 42]], ["테스트 수 (기준 → 완료)", "커버리지 99%"], C.C_PURPLE_L],
    [[["6", 46], ["번", 24]], ["사람 개입", "승인 3 + 결정 3"], C.AMBER],
    [[["$4.54", 42]], ["AI 사용량", "454 AI Credits"], C.C_PURPLE_L],
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

  // 단계별 타임라인
  const stages = [["분석", 147.7], ["설계", 225.9], ["구현", 368.4], ["테스트", 307.2], ["리뷰", 245.7], ["배포", 406.1], ["운영 분석", 554.6]];
  const sum = stages.reduce((a, [, s]) => a + s, 0);
  const cols = ["4D2A9E", "5B34B8", "6A3FCB", "7B4FDD", "8B5CF6", "A07BFA", "BDA6FF"];
  txt(slide, "단계별 소요 시간", { x: 0.6, y: 4.1, w: 4, h: 0.3, fontSize: 14, bold: true, color: "FFFFFF", valign: "middle" });
  const bx = 0.6, bw = 12.13, byy = 4.95, bhh = 0.8;
  let cum = 0;
  stages.forEach(([name, s], i) => {
    const x = bx + (cum / sum) * bw, w = (s / sum) * bw;
    const mm = Math.floor(s / 60), ss = Math.round(s % 60);
    slide.addText([{ text: name, options: { fontSize: 14, bold: true, breakLine: true } }, { text: `${mm}분 ${String(ss).padStart(2, "0")}초`, options: { fontSize: 11 } }], {
      x, y: byy, w, h: bhh, fill: { color: cols[i] }, line: { color: C.D_BG, width: 1.5 }, color: i >= 6 ? C.D_BG : "FFFFFF", fontFace: "Malgun Gothic", align: "center", valign: "middle", margin: 0, lang: "ko-KR",
    });
    cum += s;
  });
  const gx = (c) => bx + (c / sum) * bw;
  const gates = [[1, 358.2, "설계 승인"], [2, 1274.2, "코드 승인"], [3, 1621.2, "운영 배포 승인"]];
  gates.forEach(([n, c, label]) => {
    slide.addShape(pres.shapes.LINE, { x: gx(c), y: 4.62, w: 0, h: byy - 4.62, line: { color: C.AMBER, width: 1.25 } });
    slide.addText(String(n), { shape: pres.shapes.OVAL, x: gx(c) - 0.17, y: 4.42, w: 0.34, h: 0.34, fill: { color: C.AMBER }, line: { type: "none" }, color: C.D_BG, fontFace: "Malgun Gothic", fontSize: 11, bold: true, align: "center", valign: "middle", margin: 0 });
    txt(slide, label, { x: gx(c) + 0.22, y: 4.42, w: 1.5, h: 0.34, fontSize: 11.5, bold: true, color: C.AMBER, valign: "middle" });
  });
  txt(slide, "결정 3건 (설계 단계)", { x: gx(147.7) + 0.15, y: 5.82, w: 3, h: 0.26, fontSize: 11, color: C.AMBER, valign: "middle" });

  // 요약 3열
  const facts = [
    ["변경 규모", "파일 19개 · +1,058 / −45줄 · 커밋 7개"],
    ["리뷰 결과", "치명 0 · 중대 0 · 경미 1"],
    ["감사 로그 · 도구 호출", "231건 · 허용 228 · 승인 요청 3 · 차단 0"],
  ];
  const fw = 12.13 / 3;
  facts.forEach(([lead, val], i) => {
    const x = 0.6 + i * fw;
    txt(slide, lead, { x, y: 6.15, w: fw - 0.2, h: 0.26, fontSize: 11, bold: true, color: C.C_PURPLE_L, charSpacing: 1, valign: "middle" });
    txt(slide, val, { x, y: 6.42, w: fw - 0.2, h: 0.42, fontSize: 13, color: "FFFFFF", valign: "top" });
  });
  darkFooter(slide, pres, { page, total, note: "● 데모 키트(ShopFlow) 한국어판 녹화 세션 실측  ·  시나리오·데이터는 가상이며 고객 환경의 결과를 보장하지 않습니다" });
  slide.addNotes([
    "[실측 결과 — 1분]  앞서 본 데모 6~11 의 원본 세션(ShopFlow 환불 정책 변경, CR-2026-014)을 집계한 숫자입니다.",
    "총 소요 37.6분(2,258초): 분석 147.7초 · 설계 225.9 · 구현 368.4 · 테스트 307.2 · 리뷰 245.7 · 배포 406.1 · 운영 분석 554.6.",
    "테스트: 기준 26개 → 117개(+91개), 커버리지 99%. 변경: 파일 19개, +1,058/−45줄, 커밋 7개(코드 파일 11개 +654/−43). 리뷰: 치명 0 · 중대 0 · 경미 1.",
    "사람 개입 6번: 승인 3(설계 · 코드 · 운영 배포) + 설계 단계의 결정 3건. 이 중 결정 1건(구버전 앱 처리)은 AI 추천과 다른 내용을 사람이 직접 입력했습니다. 승인 기록은 설계서·코드의 SHA-256 해시와 묶여 감사 가능합니다(approvals/*.json).",
    "타임라인의 노란 ①②③ 은 승인 기록(approvals/*.json)에 남은 실제 시각 위치입니다 — 설계 승인 약 6분, 코드 승인 약 21분, 운영 배포 승인 약 27분 시점(실행 시작 기준).",
    "감사 로그: 모든 도구 호출 231건이 기록됨 — 허용 228, 사람 승인 요청 3, 차단 0. (규칙을 지키는 에이전트는 막힐 일이 없습니다. 데모 11 은 차단 동작만 별도 세션에서 보여준 것.)",
    "AI 사용량 454 AI Credits ≈ $4.54 는 녹화 시점의 집계/환산값입니다. 요금 체계는 바뀔 수 있으니 숫자를 그대로 견적으로 쓰지 말고 'PoC 에서 직접 측정'하자고 안내하세요.",
    "주의: 가상 시나리오의 1회 실행값입니다. 고객 코드베이스·복잡도·모델에 따라 달라집니다. '37.6분 = 사람이 하던 일이 이만큼 줄어든다'는 약속이 아니라, 이 정도 규모의 변경 요청이 이렇게 흘러간다는 사례입니다.",
  ].join("\n"));
}

// 18. 함께 쓰면
async function together(pres, page, total) {
  const slide = pres.addSlide({ masterName: "M_LIGHT" });
  lightFrame(slide, pres, { sec: "together", kicker: "TOGETHER", title: "함께 쓰면 — 만드는 속도에 운영의 신뢰를 더합니다", page, total });
  const cards = [
    ["GITHUB COPILOT", C.PURPLE, C.PURPLE_TINT, C.PURPLE_DK, "만든다", "분석 · 설계 · 구현 · 테스트 · 리뷰 · 배포를 에이전트가, 승인은 사람이", "DEMO 6–11", "FaCodeBranch"],
    ["MICROSOFT FOUNDRY", C.BLUE, C.BLUE_TINT, C.BLUE_DK, "운영한다", "모델 배포 · 에이전트 + 사내 문서 연결 · Entra ID 로 코드 연결", "DEMO 1–3", "FaCloud"],
    ["MICROSOFT FOUNDRY", C.BLUE, C.BLUE_TINT, C.BLUE_DK, "지키고 검증한다", "Guardrails 로 입구에서 차단, Evaluations 로 품질·안전을 채점", "DEMO 4–5", "FaShieldAlt"],
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
  // 피드백 루프 화살표
  const loopY = 4.78;
  const x1 = 0.6 + 0.5 * w, x3 = 0.6 + 2 * (w + g) + 0.5 * w;
  slide.addShape(pres.shapes.LINE, { x: x3, y: y + h, w: 0, h: loopY - (y + h), line: { color: C.TEAL_DK, width: 1.75 } });
  slide.addShape(pres.shapes.LINE, { x: x1, y: loopY, w: x3 - x1, h: 0, line: { color: C.TEAL_DK, width: 1.75 } });
  arrow(slide, pres, x1, loopY, x1, y + h + 0.02, { color: C.TEAL_DK, width: 1.75 });
  labelBox(slide, pres, "점수가 낮은 질문 → 지침·문서·코드 개선을 Copilot 에 요청 → 다시 평가", 3.0, loopY - 0.19, 7.3, 0.38, { r: 0.19, fill: C.WHITE, line: C.TEAL_DK, lw: 1.25, color: C.TEAL_DK, size: 12.5, bold: true, margin: 0 });
  // 오늘의 연결고리
  const cy = 5.3, ch = 1.38;
  lcard(slide, pres, 0.6, cy, 12.13, ch, C.TEAL_DK);
  txt(slide, "오늘의 연결고리 — ShopFlow 환불 정책", { x: 0.9, y: cy + 0.2, w: 6, h: 0.3, fontSize: 13, bold: true, color: C.TEAL_DK, valign: "middle" });
  const flow = [
    ["FaFileAlt", "Copilot 이 설계한 환불 정책", "CR-2026-014 설계서", C.PURPLE],
    ["FaDatabase", "Foundry 에이전트의 지식 문서", "File search 로 연결", C.BLUE],
    ["FaClipboardCheck", "Evaluations 가 점검", "정책 질문 15개 자동 생성", C.BLUE],
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
    "[함께 쓰면 — 1분]  두 제품은 같은 흐름의 앞뒤입니다. Copilot 은 '만드는 사람'의 속도를, Foundry 는 '만든 AI 를 운영하는' 신뢰를 담당합니다.",
    "왼쪽부터 읽습니다: 만든다(Copilot: 데모 6~11) → 운영한다(Foundry: 데모 1~3) → 지키고 검증한다(Foundry: 데모 4~5). 아래 화살표는 평가에서 낮게 나온 질문을 근거로 지침·문서·코드를 고치고(Copilot 에 요청) 다시 평가하는 개선 루프입니다.",
    "오늘의 연결고리: 데모 3~5 의 환불 정책 문서는 Copilot 데모에서 만든 설계서(CR-2026-014)를 바탕으로 만든 가상 문서입니다. 즉 같은 ShopFlow 정책이 '설계 → 지식 → 평가'로 이어졌습니다.",
    "주의: 이 슬라이드는 개념적 흐름입니다. 두 제품이 자동으로 연동된다는 뜻이 아니며, 오늘 데모에서 연동한 것은 '문서(정책)'를 사람이 가져가 쓴 부분뿐입니다. 통합 자동화(예: 평가 결과 → 이슈 자동 생성)는 PoC 에서 함께 설계할 수 있는 확장 과제로 말씀하세요.",
  ].join("\n"));
}

// 19. 다음 단계
async function nextSteps(pres, page, total) {
  const slide = pres.addSlide({ masterName: "M_LIGHT" });
  lightFrame(slide, pres, { sec: "intro", kicker: "NEXT STEPS", title: "다음 단계 — 2주 PoC 로 우리 업무에서 확인합니다", page, total });
  const cols = [
    ["사전 준비", "D-7 ~ D-1", C.BLUE_DK, C.BLUE_TINT, C.BLUE, [
      "**대상 업무 1~2개** 선정 (에이전트 후보 · 적용 저장소)",
      "**비식별 샘플** 문서·저장소 준비",
      "**Azure 구독·Foundry 프로젝트**, **Copilot 라이선스**, 필요한 역할 확인",
    ]],
    ["1주차 — 세팅·연결", "Week 1", C.PURPLE_DK, C.PURPLE_TINT, C.PURPLE, [
      "Foundry: **가드레일 · 에이전트 · 사내 문서** 연결",
      "Copilot: 파일럿 **5~10명**, 맞춤 에이전트·Hook 설정",
      "평가용 **실제 질문 20~50개** 수집",
    ]],
    ["2주차 — 측정·판단", "Week 2", C.TEAL_DK, C.TEAL_TINT, C.TEAL_DK, [
      "평가 점수 측정 → 개선 → **재평가**",
      "리드타임·테스트·리뷰 소요 **전후 비교**",
      "결과 리뷰와 **확장 로드맵** 합의",
    ]],
  ];
  const w = 3.9, g = (12.13 - 3 * w) / 2, y = 1.75, h = 3.45;
  cols.forEach(([title, tag, dk, tint, col, bl], i) => {
    const x = 0.6 + i * (w + g);
    lcard(slide, pres, x, y, w, h, col);
    pill(slide, pres, tag, x + 0.25, y + 0.3, 0.28, { fill: tint, color: dk, size: 10.5, charSpacing: 1, pad: 0.4 });
    txt(slide, title, { x: x + 0.25, y: y + 0.68, w: w - 0.5, h: 0.45, fontSize: 19, bold: true, color: C.INK, valign: "middle" });
    txt(slide, bulletRuns(bl, { size: 13.5, bold: dk }), { x: x + 0.25, y: y + 1.3, w: w - 0.5, h: h - 1.45, valign: "top", lineSpacingMultiple: 1.08 });
  });
  // 산출물
  const oy = 5.5, oh = 0.95;
  rrect(slide, pres, 0.6, oy, 12.13, oh, { r: 0.12, fill: C.INK });
  txt(slide, "PoC 산출물", { x: 0.9, y: oy, w: 1.6, h: oh, fontSize: 14, bold: true, color: C.AMBER, valign: "middle" });
  const outs = ["품질·안전 평가 리포트", "생산성 비교표 (리드타임·테스트)", "승인·통제 운영 가이드", "확장 로드맵"];
  const avail = 12.55 - 2.5, gap = 0.12;
  const base = outs.map((o) => textW(o, 12.5, 0));
  const pad = Math.min(0.5, (avail - gap * (outs.length - 1) - base.reduce((a, b) => a + b, 0)) / outs.length);
  let ox = 2.5;
  outs.forEach((o, i) => {
    const ow = base[i] + pad;
    labelBox(slide, pres, o, ox, oy + 0.27, ow, 0.4, { r: 0.2, fill: "24304F", color: "FFFFFF", size: 12.5, bold: true, margin: 0 });
    ox += ow + gap;
  });
  txt(slide, "※ 일정·규모·인원은 제안이며, 고객 환경과 일정에 맞춰 조정합니다.", { x: 0.6, y: 6.55, w: 12.13, h: 0.3, fontSize: 11, color: C.MUTED, valign: "middle" });
  slide.addNotes([
    "[다음 단계 — 1분]  제안: '2주 PoC' 로 오늘 본 것을 고객 업무에서 직접 측정합니다. (아래 일정·규모·인원은 제안 초안이며 고객 상황에 맞게 조정)",
    "사전 준비: 대상 업무 1~2개 · 비식별 샘플 문서/저장소 · Azure 구독·Foundry 프로젝트 · Copilot 라이선스 · 필요한 역할(Foundry 데이터 플레인 사용 권한 포함).",
    "1주차: Foundry 쪽은 가드레일·에이전트·사내 문서 연결, Copilot 쪽은 파일럿 5~10명과 맞춤 에이전트·Hook 구성. 평가용 실제 질문 20~50개 수집.",
    "2주차: 평가 점수 측정 → 개선 → 재평가 루프, 리드타임·테스트·리뷰 소요 전후 비교, 결과 리뷰.",
    "산출물: 평가 리포트, 생산성 비교표, 승인·통제 운영 가이드, 확장 로드맵.",
    "마무리 질문 예시: '가장 먼저 AI 를 붙이고 싶은 업무가 무엇인가요?', '현재 변경 요청 1건이 배포까지 걸리는 시간은?', '보안 팀이 가장 걱정하는 통제는 무엇인가요?'",
  ].join("\n"));
}

// 20. 마무리
async function closing(pres, page, total) {
  const slide = pres.addSlide({ masterName: "M_CLOSE" });
  txt(slide, "오늘 가져가실 3가지", { x: 0.8, y: 0.7, w: 9, h: 0.8, fontSize: 38, bold: true, color: "FFFFFF", valign: "middle" });
  const rows = [
    ["01", "한 포털에서", "모델 선택 → 배포 → 에이전트 → 가드레일 → 평가를 한 프로젝트에서", C.F_BLUE_L],
    ["02", "에이전트가 일해도", "승인은 사람이, 차단은 시스템이 — 속도와 통제를 함께", C.C_PURPLE_L],
    ["03", "함께 쓰면", "만드는 속도에 운영의 신뢰를 더해 AI 앱을 프로덕션까지", C.AMBER],
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
  pill(slide, pres, "다음 단계 · 2주 PoC 제안", 4.0, 6.27, 0.4, { fill: C.AMBER, color: C.D_BG, size: 14, pad: 0.7 });
  darkFooter(slide, pres, { page, total });
  slide.addNotes([
    "[마무리 — 30초]  세 줄로 정리하고 질문을 받습니다.",
    "01 한 포털에서(Foundry) · 02 에이전트가 일해도 승인은 사람이·차단은 시스템이(Copilot + Hook) · 03 함께 쓰면 속도 + 신뢰.",
    "자주 나올 질문과 답변 방향: ① '데이터는 어디로 가나요?' → 구독·리전·가드레일 설정 기준으로 PoC 사전 점검에서 확인(이 덱은 보안 인증 상세를 다루지 않음). ② '비용은?' → 데모 수치는 참고용, PoC 에서 사용량 측정 후 견적. ③ '어느 모델이 좋은가요?' → 데모 1 의 비교 + 데모 5 의 평가로 우리 업무 기준 선택. ④ 'Copilot 없이 Foundry 만, 혹은 반대도 되나요?' → 각각 독립적으로 도입 가능, 함께 쓰면 개선 루프가 닫힘.",
    "클로징: '다음 단계로 2주 PoC 를 제안드립니다. 가장 먼저 AI 를 붙이고 싶은 업무 한두 가지를 알려주시면 범위를 잡겠습니다.'",
  ].join("\n"));
}

module.exports = { copilotOverview, results, together, nextSteps, closing };
