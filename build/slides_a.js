const { A, b64, C, SEC, txt, rich, pill, textW, rrect, rect, oval, labelBox, numBadge, iconCircle, iconOnly, arrow, lightFrame, darkFooter } = require("./lib");

function lcard(slide, pres, x, y, w, h, accent, o = {}) {
  rect(slide, pres, x, y, w, h, o.fill ?? C.WHITE, { line: o.line ?? C.LINE, lw: 0.75, shadow: o.noShadow ? undefined : { color: "0A1A33", blur: 10, offset: 2, opacity: 0.08 } });
  if (accent) rect(slide, pres, x, y, w, 0.07, accent);
}

// 1. 표지
async function cover(pres, total) {
  const slide = pres.addSlide({ masterName: "M_COVER" });
  pill(slide, pres, "CUSTOMER BRIEFING  ·  2026.10", 0.8, 0.85, 0.34, { fill: "1B2646", color: C.F_BLUE_L, size: 11, charSpacing: 1.5, pad: 0.55, line: C.D_LINE });
  txt(slide, [
    { text: "Microsoft Foundry", options: { color: "FFFFFF", breakLine: true } },
    { text: "× ", options: { color: C.AMBER } },
    { text: "GitHub Copilot", options: { color: "FFFFFF" } },
  ], { x: 0.8, y: 1.55, w: 6.1, h: 1.9, fontSize: 44, bold: true, lineSpacingMultiple: 1.02, valign: "top" });
  txt(slide, "데모로 보는 AI 앱 개발", { x: 0.8, y: 3.6, w: 6.0, h: 0.5, fontSize: 26, bold: true, color: "FFFFFF", valign: "middle" });
  txt(slide, "만들고, 안전하게 운영하고, 평가하는 전 과정을\n슬라이드가 아닌 실제 화면 녹화로 보여드립니다", { x: 0.8, y: 4.2, w: 5.9, h: 0.9, fontSize: 16, color: C.D_MUTED, valign: "top", lineSpacingMultiple: 1.15 });
  let x = 0.8;
  x += pill(slide, pres, "Foundry 데모 5", x, 5.75, 0.36, { fill: C.F_BLUE, size: 12, pad: 0.5 }) + 0.12;
  pill(slide, pres, "Copilot 데모 6", x, 5.75, 0.36, { fill: C.C_PURPLE, size: 12, pad: 0.5 });

  // 오른쪽: 실제 화면 두 장
  slide.addImage({ path: A("slide", "cover_foundry.png"), altText: "Microsoft Foundry 포털 화면(에이전트 플레이그라운드) 미리보기", x: 7.23, y: 0.95, w: 5.5, h: 5.5 * 1080 / 1920, shadow: { type: "outer", color: "000000", blur: 22, offset: 6, angle: 90, opacity: 0.5 } });
  slide.addImage({ path: A("slide", "cover_copilot.png"), altText: "GitHub Copilot CLI 터미널 화면 미리보기", x: 6.35, y: 3.62, w: 5.5, h: 5.5 * 968 / 1880, shadow: { type: "outer", color: "000000", blur: 22, offset: 6, angle: 90, opacity: 0.55 } });
  pill(slide, pres, "MICROSOFT FOUNDRY", 7.23, 0.6, 0.3, { fill: C.F_BLUE, size: 10.5, charSpacing: 1, pad: 0.45 });
  pill(slide, pres, "GITHUB COPILOT", 6.35, 6.62, 0.3, { fill: C.C_PURPLE, size: 10.5, charSpacing: 1, pad: 0.45 });
  slide.addNotes([
    "[표지]  인사 후 한 줄로 시작합니다.",
    "오프닝: '오늘은 설명보다 화면을 많이 보여드리겠습니다. 모두 실제로 녹화한 화면이고, 대기 시간만 잘라냈습니다.'",
    "구성: Foundry 데모 5개(모델 선택 → 배포 → 에이전트 → 가드레일 → 평가) + Copilot 데모 6개(분석 → 설계 → 구현·테스트 → 리뷰 → 배포 → 안전장치). 영상은 슬라이드를 클릭(또는 재생 버튼)하면 재생됩니다. 총 영상 분량은 약 6분 30초.",
    "사전 점검: ① 각 영상 슬라이드에서 재생이 되는지(PowerPoint 데스크톱 권장), ② 발표 PC 에서 슬라이드쇼 모드 테스트, ③ 영상은 무음이므로 설명은 말로 진행.",
    "표지 오른쪽 이미지는 데모 3(Foundry 에이전트)과 데모 11(Copilot 안전장치) 화면입니다.",
  ].join("\n"));
}

// 2. 왜 — 속도 × 신뢰
async function why(pres, page, total) {
  const slide = pres.addSlide({ masterName: "M_LIGHT" });
  lightFrame(slide, pres, { kicker: "WHY", title: "속도와 신뢰, 둘 다 있어야 AI 앱이 운영까지 갑니다", page, total });
  const y = 1.75, h = 3.95, w = 5.75;
  // 왼쪽: Copilot
  lcard(slide, pres, 0.6, y, w, h, C.PURPLE);
  pill(slide, pres, "GITHUB COPILOT  ·  만드는 속도", 0.9, y + 0.3, 0.32, { fill: C.PURPLE_TINT, color: C.PURPLE_DK, size: 11, pad: 0.4 });
  txt(slide, [{ text: "37.6", options: { fontSize: 88, bold: true, color: C.PURPLE } }, { text: "분", options: { fontSize: 36, bold: true, color: C.PURPLE } }], { x: 0.9, y: y + 0.75, w: 5.2, h: 1.5, valign: "middle" });
  txt(slide, [
    { text: "변경 요청 1건을 7단계로 처리", options: { fontSize: 18, bold: true, color: C.INK, breakLine: true } },
    { text: "분석 · 설계 · 구현 · 테스트 · 리뷰 · 배포 · 운영 분석", options: { fontSize: 13, color: C.BODY } },
  ], { x: 0.9, y: y + 2.3, w: 5.2, h: 0.8, paraSpaceAfter: 4 });
  txt(slide, "ShopFlow 데모 녹화 세션 실측  ·  사람 개입 6번", { x: 0.9, y: y + 3.3, w: 5.2, h: 0.4, fontSize: 12, color: C.MUTED, valign: "middle" });
  // 가운데 ×
  oval(slide, pres, 6.415, y + h / 2 - 0.25, 0.5, { fill: C.INK });
  txt(slide, "×", { x: 6.415, y: y + h / 2 - 0.25, w: 0.5, h: 0.5, fontSize: 22, bold: true, color: "FFFFFF", align: "center", valign: "middle" });
  // 오른쪽: Foundry
  lcard(slide, pres, 6.98, y, w, h, C.BLUE);
  pill(slide, pres, "MICROSOFT FOUNDRY  ·  믿고 쓰는 품질·안전", 7.28, y + 0.3, 0.32, { fill: C.BLUE_TINT, color: C.BLUE_DK, size: 11, pad: 0.4 });
  txt(slide, [{ text: "약 ", options: { fontSize: 30, bold: true, color: C.BLUE } }, { text: "5", options: { fontSize: 88, bold: true, color: C.BLUE } }, { text: "분", options: { fontSize: 36, bold: true, color: C.BLUE } }], { x: 7.28, y: y + 0.75, w: 5.2, h: 1.5, valign: "middle" });
  txt(slide, [
    { text: "에이전트 품질·안전 평가 1회", options: { fontSize: 18, bold: true, color: C.INK, breakLine: true } },
    { text: "질문 15개 자동 생성 + 평가기 6종 채점", options: { fontSize: 13, color: C.BODY } },
  ], { x: 7.28, y: y + 2.3, w: 5.2, h: 0.8, paraSpaceAfter: 4 });
  txt(slide, "Foundry 평가 실행 1회 실측  ·  질문 생성 포함 5분 11초", { x: 7.28, y: y + 3.3, w: 5.2, h: 0.4, fontSize: 12, color: C.MUTED, valign: "middle" });
  // 하단 바
  rrect(slide, pres, 0.6, 5.98, 12.13, 0.78, { r: 0.12, fill: C.INK });
  await iconCircle(slide, pres, "FaPlay", 0.85, 6.1, 0.54, C.AMBER, C.INK, 0.3);
  txt(slide, rich("오늘은 슬라이드 대신 **실제 화면 녹화**로 보여드립니다 — 데모 **11개**, 영상 약 **6분 30초**", { fontSize: 17, color: "FFFFFF", fontFace: "Malgun Gothic" }, C.AMBER), { x: 1.6, y: 5.98, w: 10.9, h: 0.78, valign: "middle" });
  slide.addNotes([
    "[왜 이 두 가지인가 — 1분]",
    "메시지: AI 앱은 '빨리 만드는 것'과 '믿고 운영하는 것'이 따로 놀면 프로덕션에 못 갑니다. 왼쪽은 만드는 속도(GitHub Copilot), 오른쪽은 믿고 쓰는 품질·안전(Microsoft Foundry).",
    "왼쪽 숫자 37.6분: ShopFlow(가상 쇼핑몰) 환불 정책 변경 요청 1건을 Copilot CLI 의 맞춤 에이전트 7개가 분석 → 설계 → 구현 → 테스트 → 리뷰 → 배포 → 운영 분석까지 처리한 실제 녹화 세션의 총 소요(2,258초). 사람 개입은 승인 3 + 결정 3 = 6번. (세부는 17번 슬라이드)",
    "오른쪽 숫자 약 5분: Foundry Evaluations 에서 에이전트 하나에 대해 합성 질문 15개를 만들고 평가기 6종으로 채점한 실행 1회의 전체 소요(질문 자동 생성 포함 5분 11초, 실행 기록의 duration 값). 결과 화면 상단의 'Elapsed time 2분 50초'는 채점 구간만의 시간이라 숫자가 다르게 보일 수 있습니다. (세부는 데모 5)",
    "주의: 두 숫자는 서로 다른 작업의 실측값이라 직접 비교용이 아닙니다. '각각 이 정도 규모의 일을 이 시간에 끝낸다'는 감을 주는 용도입니다. 고객 환경의 결과를 보장하지 않습니다.",
    "전환: '그럼 실제 화면부터 보겠습니다. 구성은 다음 장에서.'",
  ].join("\n"));
}

// 3. 데모 지도
async function demoMap(pres, page, total) {
  const slide = pres.addSlide({ masterName: "M_LIGHT" });
  lightFrame(slide, pres, { kicker: "AGENDA", title: "오늘의 데모 11개 — 두 개의 흐름", page, total });
  const F = [
    ["f1", "카탈로그·비교", "0:40 · 모델 탐색 → 비교"], ["f2", "배포·Playground", "0:27 · 클릭 → 대화 → 코드"], ["f3", "에이전트 + 지식", "0:50 · 문서 근거로 답변"],
    ["f4", "Guardrails", "0:25 · 탈옥 시도 차단"], ["f5", "Evaluations", "0:43 · 자동 채점"],
  ];
  const P = [
    ["c1", "분석", "0:30 · 영향 범위 탐색"], ["c2", "설계", "0:39 · 사람 결정·승인"], ["c3", "구현·테스트", "0:37 · 26 → 117 테스트"],
    ["c4", "리뷰", "0:30 · 코드 승인"], ["c5", "배포", "0:35 · 운영 승인"], ["c7", "안전장치", "0:41 · Hook 차단"],
  ];
  // Foundry 레인
  const fl = pill(slide, pres, "MICROSOFT FOUNDRY", 0.6, 1.62, 0.3, { fill: C.BLUE, size: 10.5, charSpacing: 1, pad: 0.45 });
  txt(slide, "모델 선택 → 배포 → 에이전트 → 안전 → 평가", { x: 0.6 + fl + 0.2, y: 1.62, w: 6.5, h: 0.3, fontSize: 13, color: C.BODY, valign: "middle" });
  txt(slide, "5개  ·  3분 5초", { x: 10.2, y: 1.62, w: 2.53, h: 0.3, fontSize: 12, bold: true, color: C.BLUE_DK, align: "right", valign: "middle" });
  const fw = 2.3, fg = (12.13 - 5 * fw) / 4;
  F.forEach(([k, label, sub], i) => {
    const x = 0.6 + i * (fw + fg), y = 2.05;
    slide.addImage({ path: A("slide", `thumb_${k}.png`), altText: `데모 ${i + 1} ${label} 화면 미리보기`, x, y, w: fw, h: fw * 9 / 16, shadow: { type: "outer", color: "0A1A33", blur: 8, offset: 2, angle: 90, opacity: 0.18 } });
    rect(slide, pres, x, y, fw, fw * 9 / 16, "FFFFFF", { transparency: 100, line: C.BLUE_LINE, lw: 0.75 });
    numBadge(slide, pres, i + 1, x - 0.1, y - 0.12, 0.36, C.BLUE, "FFFFFF", 13);
    txt(slide, label, { x, y: y + fw * 9 / 16 + 0.1, w: fw, h: 0.3, fontSize: 14, bold: true, color: C.INK, valign: "middle" });
    txt(slide, sub, { x, y: y + fw * 9 / 16 + 0.4, w: fw, h: 0.26, fontSize: 11, color: C.MUTED, valign: "middle" });
  });
  // Copilot 레인
  const cl = pill(slide, pres, "GITHUB COPILOT", 0.6, 4.2, 0.3, { fill: C.PURPLE, size: 10.5, charSpacing: 1, pad: 0.45 });
  txt(slide, "분석 → 설계 → 구현·테스트 → 리뷰 → 배포, 그리고 안전장치", { x: 0.6 + cl + 0.2, y: 4.2, w: 7.5, h: 0.3, fontSize: 13, color: C.BODY, valign: "middle" });
  txt(slide, "6개  ·  3분 32초", { x: 10.2, y: 4.2, w: 2.53, h: 0.3, fontSize: 12, bold: true, color: C.PURPLE_DK, align: "right", valign: "middle" });
  const pw = 1.9, pg = (12.13 - 6 * pw) / 5, ph = pw * 968 / 1880;
  P.forEach(([k, label, sub], i) => {
    const x = 0.6 + i * (pw + pg), y = 4.65;
    slide.addImage({ path: A("slide", `thumb_${k}.png`), altText: `데모 ${i + 6} ${label} 화면 미리보기`, x, y, w: pw, h: ph, shadow: { type: "outer", color: "0A1A33", blur: 8, offset: 2, angle: 90, opacity: 0.18 } });
    rect(slide, pres, x, y, pw, ph, "FFFFFF", { transparency: 100, line: C.PURPLE_LINE, lw: 0.75 });
    numBadge(slide, pres, i + 6, x - 0.1, y - 0.12, 0.36, C.PURPLE, "FFFFFF", 13);
    txt(slide, label, { x, y: y + ph + 0.1, w: pw, h: 0.3, fontSize: 14, bold: true, color: C.INK, valign: "middle" });
    txt(slide, sub, { x, y: y + ph + 0.4, w: pw, h: 0.26, fontSize: 11, color: C.MUTED, valign: "middle" });
  });
  txt(slide, "※ Foundry 화면은 2026-10-30 녹화, Copilot 화면은 ShopFlow 변경 요청 1건의 실행 녹화입니다. 대기 구간은 컷·배속 처리했고 모든 이름·데이터는 가상입니다.", { x: 0.6, y: 6.55, w: 12.13, h: 0.3, fontSize: 11, color: C.MUTED, valign: "middle" });
  slide.addNotes([
    "[데모 지도 — 30초]",
    "오늘의 데모는 11개, 영상 합계 약 6분 30초입니다. 위쪽은 Foundry(5개), 아래쪽은 Copilot(6개).",
    "Foundry: ① 모델 카탈로그·비교 ② 배포·Playground ③ 에이전트 + 사내 문서 ④ Guardrails ⑤ Evaluations.",
    "Copilot: ⑥ 분석 ⑦ 설계 ⑧ 구현·테스트 ⑨ 리뷰 ⑩ 배포 ⑪ 안전장치. 하나의 변경 요청(ShopFlow 환불 정책, CR-2026-014)이 단계를 따라 흘러갑니다.",
    "연결고리: Foundry 데모 3~5 의 환불 정책 문서는 Copilot 이 설계한 CR-2026-014 설계서를 바탕으로 만든 가상 문서입니다 — 두 흐름이 같은 ShopFlow 이야기로 이어집니다.",
    "시간 배분(참고): 영상 약 6.5분 + 설명 1~2분/데모 = 약 20~25분. 시간이 부족하면 데모 1(카탈로그), 데모 8(구현·테스트), 데모 10(배포)은 건너뛰고 슬라이드의 한 줄 요약만 말해도 흐름이 유지됩니다.",
  ].join("\n"));
}

// 4. Foundry 개요
async function foundryOverview(pres, page, total) {
  const slide = pres.addSlide({ masterName: "M_LIGHT" });
  lightFrame(slide, pres, { sec: "foundry", kicker: "PART 1  ·  MICROSOFT FOUNDRY", title: "Foundry — 모델 선택부터 평가까지, 하나의 포털에서", page, total });
  const cards = [
    ["FaSearch", "모델 선택·비교", "여러 제공사 모델을 한곳에서 찾고 나란히 비교", "Catalog"],
    ["FaRocket", "배포·Playground", "클릭 몇 번으로 배포하고 한국어로 바로 테스트", "Models"],
    ["FaRobot", "에이전트 + 지식", "지침과 우리 문서를 연결해 근거를 표시하며 답변", "Agents"],
    ["FaShieldAlt", "Guardrails", "탈옥·유해 콘텐츠를 기본 정책으로 입구에서 차단", "Guardrails"],
    ["FaClipboardCheck", "Evaluations", "질문을 자동 생성하고 평가기로 품질·안전을 점수화", "Evaluations"],
  ];
  const w = 2.3, g = (12.13 - 5 * w) / 4, y = 1.8, h = 3.25;
  for (let i = 0; i < cards.length; i++) {
    const [icon, title, desc, menu] = cards[i];
    const x = 0.6 + i * (w + g);
    lcard(slide, pres, x, y, w, h, C.BLUE);
    pill(slide, pres, `DEMO ${i + 1}`, x + 0.2, y + 0.27, 0.26, { fill: C.BLUE_TINT, color: C.BLUE_DK, size: 10, pad: 0.36, charSpacing: 0.8 });
    await iconCircle(slide, pres, icon, x + 0.2, y + 0.72, 0.62, C.BLUE, "FFFFFF", 0.27);
    txt(slide, title, { x: x + 0.2, y: y + 1.5, w: w - 0.4, h: 0.4, fontSize: 17, bold: true, color: C.INK, valign: "middle" });
    txt(slide, desc, { x: x + 0.2, y: y + 1.95, w: w - 0.4, h: 0.85, fontSize: 12.5, color: C.BODY, lineSpacingMultiple: 1.05 });
    labelBox(slide, pres, `포털 메뉴 · ${menu}`, x + 0.2, y + h - 0.46, w - 0.4, 0.28, { r: 0.14, fill: C.GRAY_TINT, color: C.MUTED, size: 10, bold: true, margin: 0 });
  }
  // 연결 화살표는 카드 위에 겹쳐 그린다 (카드 뒤에 가려지지 않게 마지막에)
  for (let i = 0; i < cards.length - 1; i++) {
    const x = 0.6 + i * (w + g);
    slide.addShape(pres.shapes.OVAL, { x: x + w + g / 2 - 0.16, y: y + 0.99, w: 0.32, h: 0.32, fill: { color: C.BLUE }, line: { color: "FFFFFF", width: 1.5 } });
    await iconOnly(slide, "FaChevronRight", x + w + g / 2 - 0.07, y + 1.075, 0.14, "FFFFFF");
  }
  const items = [
    ["FaKey", "키 없는 인증", "Entra ID + 역할 기반 권한(RBAC)"],
    ["FaLayerGroup", "같은 프로젝트에서 이어서", "배포 → 에이전트 → 평가가 한 프로젝트"],
    ["FaCode", "화면에서 코드로", "만든 모델·에이전트를 SDK 코드로 연결"],
  ];
  const iw = 12.13 / 3;
  for (let i = 0; i < items.length; i++) {
    const [icon, t, s] = items[i];
    const x = 0.6 + i * iw;
    await iconCircle(slide, pres, icon, x, 5.42, 0.52, C.BLUE_TINT, C.BLUE, 0.28);
    txt(slide, t, { x: x + 0.68, y: 5.38, w: iw - 0.8, h: 0.32, fontSize: 14.5, bold: true, color: C.INK, valign: "middle" });
    txt(slide, s, { x: x + 0.68, y: 5.7, w: iw - 0.8, h: 0.3, fontSize: 12, color: C.MUTED, valign: "middle" });
  }
  txt(slide, "※ 표시되는 모델·기능은 구독·리전·시점에 따라 다릅니다. 이 장의 메뉴 이름은 포털(New Foundry) 화면 기준입니다.", { x: 0.6, y: 6.5, w: 12.13, h: 0.3, fontSize: 11, color: C.MUTED, valign: "middle" });
  slide.addNotes([
    "[Part 1 시작 — 1분]  Foundry 를 한 문장으로: '모델을 고르고, 배포하고, 에이전트를 만들고, 지키고, 평가하는 일을 하나의 포털·하나의 프로젝트에서 합니다.'",
    "5개 카드는 곧 보게 될 데모 1~5 입니다. 카드 아래 '포털 메뉴'는 실제 왼쪽 메뉴 이름이라 직접 따라 하실 때 찾기 쉽습니다.",
    "아래 3가지는 데모 전반에 깔려 있는 공통점입니다 — ① 키 없는 인증(Entra ID)과 RBAC, ② 한 프로젝트에서 이어서 작업, ③ 화면에서 만든 것을 코드로 이어가기.",
    "RBAC 팁(실제로 겪은 점): 구독 Owner 여도 모델 호출(데이터 플레인)에는 별도 역할이 필요할 수 있습니다. 녹화 환경에서는 프로젝트 사용자에게 'Foundry User'(과거 Azure AI User 이름) 역할을 부여해야 Playground 가 동작했습니다. PoC 사전 준비에 넣어 두세요.",
    "주의: 화면의 모델·기능은 구독·리전·시점에 따라 다릅니다. 가격·SLA 이야기는 이 덱의 범위가 아닙니다.",
  ].join("\n"));
}

module.exports = { cover, why, demoMap, foundryOverview, lcard };
