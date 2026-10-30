# foundry-ghcp-demo-deck — Microsoft Foundry × GitHub Copilot, 데모로 보는 AI 앱 개발

고객 소개용 **데모 중심 슬라이드(20장)** 입니다. 슬라이드마다 **실제 화면 녹화 영상**이 들어 있고(11개, 합계 6분 36초), 한국어 발표 노트가 달려 있습니다.

- **Microsoft Foundry 데모 5개** — 모델 카탈로그·비교 → 배포·Playground → 에이전트 + 우리 문서 → Guardrails → Evaluations
- **GitHub Copilot 데모 6개** — 분석 → 설계 → 구현·테스트 → 리뷰 → 배포, 그리고 안전장치(Hook)

## 웹에서 바로 보기 — 다운로드 없이

| | |
| --- | --- |
| **슬라이드** (20장, 영상 11개 내장) | [📑 브라우저에서 열기](https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fjunwoojeong100.github.io%2Ffoundry-ghcp-demo-deck%2Fko%2FMicrosoft_Foundry_GitHub_Copilot_Demo_Deck_KO.pptx) |
| **영상 11개** (한 개씩 재생) | [▶ 영상 모아보기](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/) |
| **PPTX** | [⬇ Microsoft_Foundry_GitHub_Copilot_Demo_Deck_KO.pptx](https://github.com/junwoojeong100/foundry-ghcp-demo-deck/raw/main/ko/Microsoft_Foundry_GitHub_Copilot_Demo_Deck_KO.pptx) (약 39 MB) |

슬라이드는 Microsoft의 PowerPoint for the web 으로 열립니다. 영상 위 ▶ 를 누르면 재생되고, 오른쪽 아래 **Notes** 에서 발표 노트를 볼 수 있습니다. 웹 뷰어는 자체 글꼴을 쓰므로 줄바꿈이 데스크톱 PowerPoint 와 조금 다를 수 있습니다. 정확한 모양은 PPTX 를 내려받아 보세요.

## 슬라이드 구성 (20장)

| 장 | 내용 |
| --- | --- |
| 1–4 | 표지 · 왜 이 두 가지인가(만드는 속도 × 믿고 쓰는 품질·안전) · 데모 지도 · Foundry 개요 |
| 5–9 | **Foundry 데모 1–5** (영상) |
| 10 | Copilot 개요 + 시나리오(ShopFlow 환불 정책 변경, 사람이 승인하는 3곳) |
| 11–16 | **Copilot 데모 6–11** (영상) |
| 17 | 실측 결과 (37.6분 · 테스트 26→117 · 사람 개입 6번 · 단계별 시간) |
| 18–20 | 함께 쓰면 · 다음 단계(2주 PoC 제안) · 마무리 |

## 데모 영상 (11개)

영상은 `assets/clips/` 에 있고, 슬라이드에 내장된 것과 같은 파일입니다. 모두 무음(H.264)입니다.

| 데모 | 슬라이드 | 영상 | 길이 |
| --- | --- | --- | --- |
| 1 모델 카탈로그·비교 | 5 | [f1_catalog.mp4](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/assets/clips/f1_catalog.mp4) | 0:40 |
| 2 배포 → 바로 테스트 | 6 | [f2_deploy.mp4](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/assets/clips/f2_deploy.mp4) | 0:27 |
| 3 에이전트 + 우리 문서 | 7 | [f3_agent.mp4](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/assets/clips/f3_agent.mp4) | 0:50 |
| 4 Guardrails | 8 | [f4_guardrails.mp4](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/assets/clips/f4_guardrails.mp4) | 0:25 |
| 5 Evaluations | 9 | [f5_eval.mp4](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/assets/clips/f5_eval.mp4) | 0:43 |
| 6 분석 | 11 | [cp1_analyze.mp4](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/assets/clips/cp1_analyze.mp4) | 0:30 |
| 7 설계 | 12 | [cp2_design.mp4](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/assets/clips/cp2_design.mp4) | 0:39 |
| 8 구현·테스트 | 13 | [cp3_build_test.mp4](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/assets/clips/cp3_build_test.mp4) | 0:37 |
| 9 리뷰 | 14 | [cp4_review.mp4](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/assets/clips/cp4_review.mp4) | 0:30 |
| 10 배포 | 15 | [cp5_deploy.mp4](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/assets/clips/cp5_deploy.mp4) | 0:35 |
| 11 안전장치 | 16 | [cp7_guardrail.mp4](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/assets/clips/cp7_guardrail.mp4) | 0:41 |

## 숫자의 출처와 주의

- **Copilot 수치**(37.6분, 테스트 26→117개, 커버리지 99%, 사람 개입 6번 = 승인 3 + 결정 3, 454 AI Credits ≈ $4.54 등)는 [ghcp_cli_workflow_demo_kit](https://github.com/junwoojeong100/ghcp_cli_workflow_demo_kit) 한국어판 녹화 세션의 실측값(`ko/sample-output/run-metrics.json`)입니다. 1회 실행값이며 고객 환경의 결과를 보장하지 않습니다. 데모 11(안전장치)은 차단 동작만 보여주려고 별도 세션에서 녹화한 영상입니다.
- **Foundry 평가 "약 5분"** 은 실행 1회의 전체 소요(질문 자동 생성 포함 5분 11초)입니다. 점수는 LLM 판정이라 실행마다 달라질 수 있습니다.
- Foundry 화면은 **2026-10-30** 에 녹화했습니다. 표시되는 모델·기능은 구독·리전·시점에 따라 다릅니다(예: Anthropic 모델은 구독 유형·리전에 따라 배포가 제한될 수 있습니다).
- ShopFlow(가상 쇼핑몰)의 이름·데이터·승인자는 모두 가상입니다. 대기 구간은 컷·배속 처리했습니다.
- 2주 PoC 슬라이드(19장)의 일정·규모·인원은 제안 초안입니다.

## 발표 팁

- 영상은 슬라이드쇼에서 **클릭하면 재생**됩니다(PowerPoint 데스크톱 권장). 소리가 없으니 설명은 말로 하고, 슬라이드 노트의 ▶ 표시에 맞춰 진행하세요.
- 발표 전에 발표 PC 에서 슬라이드쇼로 각 영상이 재생되는지 한 번 확인하세요.
- 데모 3(에이전트)에 쓴 정책 문서는 [`assets/ShopFlow_환불정책_v1.1.0.md`](assets/ShopFlow_%ED%99%98%EB%B6%88%EC%A0%95%EC%B1%85_v1.1.0.md) 입니다. 직접 따라 하려면 이 파일을 에이전트의 지식(File search)으로 올리세요.

## 저장소 구성

```
ko/Microsoft_Foundry_GitHub_Copilot_Demo_Deck_KO.pptx   완성된 슬라이드 (영상·발표 노트 포함)
assets/clips/                       데모 영상 11개(mp4) + 포스터(png)
assets/thumbs/                      웹 페이지용 썸네일(jpg)
assets/ShopFlow_환불정책_v1.1.0.md   데모 3 에서 쓴 가상 정책 문서
build/                              슬라이드를 만드는 소스 (pptxgenjs)
index.html                          GitHub Pages 첫 화면 (영상 모아보기)
```

## 다시 만들기 (macOS 기준)

```bash
git clone https://github.com/junwoojeong100/foundry-ghcp-demo-deck.git
cd foundry-ghcp-demo-deck
python3 build/prep_assets.py                 # 슬라이드용 이미지 생성 (Pillow 필요)
cd build && npm install                      # pptxgenjs 등
node build.js out/deck.pptx && node fix_pptx.js out/deck.pptx
```

- `content.js` 에 데모별 제목·설명·발표 노트가 모여 있습니다. 문구를 고치고 다시 빌드하면 됩니다.
- `fix_pptx.js` 는 pptxgenjs 출력을 보정합니다. PowerPoint 가 "복구" 메시지를 띄울 수 있는 부분(중복 서식, 겹치는 도형 id, 요소 순서)과, **PowerPoint for the web 이 파일을 열지 못하게 하는 구조 문제(슬라이드 마스터와 노트 마스터가 같은 theme 를 공유)** 를 고치고, 그림 대체 텍스트에 남는 로컬 경로를 지웁니다. 이 과정을 거친 파일은 Open XML SDK 검증 오류가 0건이고 웹 뷰어에서 열립니다. 그래서 pptxgenjs 출력을 `fix_pptx.js` 없이 그대로 올리면 웹 뷰어가 "Sorry, we can't open this presentation" 을 낼 수 있습니다.
- `render.sh` 는 LibreOffice 로 PNG 미리보기까지 만듭니다(macOS 와 PowerPoint 글꼴 경로를 가정). LibreOffice 는 영상 대신 포스터 이미지만 그립니다.
- 영상 편집 스크립트(`segcat.py`, `mkclip.py`)는 화면 녹화(webm)를 PowerPoint 에서 잘 재생되는 H.264 mp4 로 바꿉니다. 원본 녹화는 이 저장소에 포함하지 않았습니다.
