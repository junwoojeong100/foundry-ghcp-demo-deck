# foundry-ghcp-demo-deck — Microsoft Foundry × GitHub Copilot, AI app development shown in demos

A **demo-first customer deck (20 slides)**. Every demo slide has a **real screen recording** embedded (11 clips, 7 min 1 s in total), and every slide has English speaker notes. A **narrated video** (8 min 25 s, English captions) plays the same eleven demos back to back.

- **5 Microsoft Foundry demos** — model catalog and compare → deploy and Playground → an agent on our own document → Guardrails → Evaluations
- **6 GitHub Copilot demos** — analyze → design → build and test → review → deploy, and the safeguards (hooks)

> This is the English edition; every character on its slides and in its videos is English. The Korean edition sits next to it: [README.md](README.md) · [Korean page](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/).

## Watch online — no download

| | |
| --- | --- |
| **Slides** (20 slides, 11 videos embedded) | [📑 Open in the browser](https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fjunwoojeong100.github.io%2Ffoundry-ghcp-demo-deck%2Fen%2FMicrosoft_Foundry_GitHub_Copilot_Demo_Deck_EN.pptx) |
| **Narrated video** (8 min 25 s, 1080p, captions) | [▶ Watch on the page](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/en/) · [MP4](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/en/video/Microsoft_Foundry_GitHub_Copilot_Demo_EN.mp4) |
| **11 demo clips** (one at a time, silent) | [▶ Clip page](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/en/) |
| **PPTX** | [⬇ Microsoft_Foundry_GitHub_Copilot_Demo_Deck_EN.pptx](https://github.com/junwoojeong100/foundry-ghcp-demo-deck/raw/main/en/Microsoft_Foundry_GitHub_Copilot_Demo_Deck_EN.pptx) (about 36 MB) |

The slides open in Microsoft PowerPoint for the web. Press ▶ on a video to play it, and open **Notes** (bottom right) for the speaker notes. The web viewer uses its own fonts, so line breaks can differ a little from desktop PowerPoint; download the PPTX for the exact layout.

## Slide structure (20 slides)

| Slides | Content |
| --- | --- |
| 1–4 | Cover · Why these two (speed of building × quality and safety you can trust) · Demo map · Foundry overview |
| 5–9 | **Foundry demos 1–5** (video) |
| 10 | Copilot overview and the scenario (a ShopFlow refund-policy change, three places where a human approves) |
| 11–16 | **Copilot demos 6–11** (video) |
| 17 | Measured results (38.0 min · tests 26 → 100 · 6 human interventions · time per stage) |
| 18–20 | Together · Next steps (2-week PoC proposal) · Wrap-up |

## Demo clips (11)

The clips are in `assets/en/clips/` and are the same files that are embedded in the slides. They are silent H.264 videos.

| Demo | Slide | Clip | Length |
| --- | --- | --- | --- |
| 1 Model catalog and compare | 5 | [f1_catalog.mp4](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/assets/en/clips/f1_catalog.mp4) | 0:42 |
| 2 Deploy, then test right away | 6 | [f2_deploy.mp4](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/assets/en/clips/f2_deploy.mp4) | 0:33 |
| 3 An agent on our own document | 7 | [f3_agent.mp4](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/assets/en/clips/f3_agent.mp4) | 0:56 |
| 4 Guardrails | 8 | [f4_guardrails.mp4](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/assets/en/clips/f4_guardrails.mp4) | 0:27 |
| 5 Evaluations | 9 | [f5_eval.mp4](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/assets/en/clips/f5_eval.mp4) | 0:48 |
| 6 Analyze | 11 | [cp1_analyze.mp4](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/assets/en/clips/cp1_analyze.mp4) | 0:30 |
| 7 Design | 12 | [cp2_design.mp4](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/assets/en/clips/cp2_design.mp4) | 0:42 |
| 8 Build and test | 13 | [cp3_build_test.mp4](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/assets/en/clips/cp3_build_test.mp4) | 0:37 |
| 9 Review | 14 | [cp4_review.mp4](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/assets/en/clips/cp4_review.mp4) | 0:30 |
| 10 Deploy | 15 | [cp5_deploy.mp4](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/assets/en/clips/cp5_deploy.mp4) | 0:34 |
| 11 Safeguards | 16 | [cp7_guardrail.mp4](https://junwoojeong100.github.io/foundry-ghcp-demo-deck/assets/en/clips/cp7_guardrail.mp4) | 0:42 |

## Narrated video

`en/video/Microsoft_Foundry_GitHub_Copilot_Demo_EN.mp4` is the same eleven clips with title cards, an English voice-over and captions: 8 min 25 s, 1080p, H.264 + AAC, about 32 MB, loudness-normalized (about −17 LUFS integrated).

| File | What it is |
| --- | --- |
| `Microsoft_Foundry_GitHub_Copilot_Demo_EN.mp4` | The video (16 chapters are embedded) |
| `….srt` · `….vtt` | English captions (SRT for YouTube and most players, WebVTT for the web page) |
| `….chapters.txt` | Chapter list in the YouTube description format |
| `….poster.jpg` | Poster frame |

- The narration is **AI-generated with Azure AI Speech** (voice `en-US-Andrew:DragonHDLatestNeural`). Say so when you publish the video.
- The narration is timed to what happens on screen. Its text, the title cards and the chapter names are in `build/video/script_en.py`.

## Where the numbers come from, and cautions

- **Copilot numbers** (38.0 min, tests 26 → 100 with 74 added and 99% coverage, 6 human interventions = 3 approvals + 3 decisions, 339.66 AI Credits ≈ $3.40, 19 files changed with +1,280 / −36 lines in 6 commits, review findings 0 / 0 / 0) are measured values of the **English-language recorded session** of [ghcp_cli_workflow_demo_kit](https://github.com/junwoojeong100/ghcp_cli_workflow_demo_kit) (`assets/en/run-metrics.json`). That is a different run from the one behind the Korean deck, so the two editions show different numbers on purpose. It is a single run and does not guarantee results in your environment. Demo 11 (safeguards) was recorded in a separate session just to show the blocking.
- **Foundry screens** were recorded on **2026-11-11** in the English portal. The models and features on screen depend on your subscription, region and the time you look (for example, the agent in demo 3 uses `gpt-5.4-mini` because the portal said File search was temporarily unavailable for the gpt-6 model family at that moment). The model comparison in demo 1 does not claim that any model wins.
- **Foundry evaluation** (demo 5): the whole run took 4 min 38 s ("about 4.5 min" on the slides) for 15 synthetic questions and 6 evaluators. Tool use quality scored 93% (14/15), the four safety evaluators 100%, and **Output quality 0% (0/15)** — the agent answers "I do not know" to questions that are deliberately outside the policy, which the task-completion evaluator counts as a failure. Slide 9 shows this result, and its speaker notes explain how to read it, instead of hiding it. Scores come from an LLM judge and vary from run to run (another run of the same setup scored 7%).
- **Guardrails** (demo 4): the strong jailbreak prompt is blocked at the input and the risk type is shown. A milder prompt may get through in some runs, so do not present a guardrail as a guarantee.
- ShopFlow (the fictional online store) — its names, data and approvers are fictional. Waiting time in the recordings is cut or sped up.
- The 2-week PoC slide (19) is a draft proposal; adjust the schedule, scope and staffing to your customer.

## Presenting tips

- Videos play **on click** in the slide show (desktop PowerPoint recommended). The clips are silent, so explain aloud and follow the `[Clip 0:42]  ▶ Play, then explain` cues in the speaker notes.
- Before the talk, run the slide show once on the presenting PC and check that every video plays.
- The policy document used in demo 3 is [`assets/en/ShopFlow_RefundPolicy_v1.1.0.md`](assets/en/ShopFlow_RefundPolicy_v1.1.0.md). To follow along, upload it as the agent's knowledge (File search).

## Repository layout (English edition)

```
en/Microsoft_Foundry_GitHub_Copilot_Demo_Deck_EN.pptx   finished deck (videos and speaker notes included)
en/video/                           narrated video, captions (srt, vtt), chapters, poster
en/index.html                       English page on GitHub Pages (generated by build/en/make_index.py)
assets/en/clips/                    11 demo clips (mp4) + posters (png) + cp_clips_manifest.json (how the Copilot clips were cut)
assets/en/thumbs/                   thumbnails for the web page
assets/en/ShopFlow_RefundPolicy_v1.1.0.md   fictional policy document used in demo 3
assets/en/run-metrics.json          measured values of the Copilot session shown on slide 17
build/en/                           deck sources and checks (see build/en/README.md)
build/record/                       recorder for the Foundry clips (Playwright)
build/video/                        narrated video builder (Azure AI Speech, ffmpeg)
build/qa/                           Hangul scan of videos (OCR)
```

The Korean edition (`ko/`, `assets/clips/`, `index.html`, `build/build.js` and friends) is not touched by anything in the English build.

## Rebuild (macOS)

```bash
git clone https://github.com/junwoojeong100/foundry-ghcp-demo-deck.git
cd foundry-ghcp-demo-deck/build && npm install

# 1. The deck  ->  build/out/deck_en.pptx  (STRICT_EN=1 fails the build if any English asset is missing)
STRICT_EN=1 npm run prep:en && STRICT_EN=1 npm run build:en
python3 en/check_en.py out/deck_en.pptx          # no Hangul/CJK anywhere, structure, notes, alt text
python3 en/fitcheck.py out/deck_en.pptx          # text-fit check with the real font metrics
```

- Slide text and speaker notes are in `build/en/content.js`, `slides_a.js` and `slides_b.js`. Everything that is specific to the Foundry recordings (models, prompts, scores) is in the `FOUNDRY` object at the top of `content.js`; see [build/en/README.md](build/en/README.md).
- **Foundry clips** are recorded with `build/record/foundry_en.mjs` (see the header of that file for the environment variables). It writes H.264 `yuv420p` clips in limited-range BT.709, like the Copilot clips; if you add a clip by hand, check it with `ffprobe` (a `yuvj420p` clip is full range and will not match the others). The scenes create resources in the Foundry project (a model deployment, an agent, evaluation runs), so use a project you can clean up afterwards.
- **Narrated video**: `SPEECH_ENDPOINT=https://<resource>.cognitiveservices.azure.com SPEECH_SUBSCRIPTION=<subscription> python3 build/video/build_video.py` (needs ffmpeg, Node with Playwright for the cards, and an Azure AI Speech resource that your Entra ID account can call; see `build/video/tts.py`). Then run `python3 build/en/make_index.py` to refresh `en/index.html`.
- **Hangul scan of a video** (macOS Vision OCR): `python3 build/qa/scan_video.py <video.mp4>`; it lists frames that contain two or more Hangul characters.
