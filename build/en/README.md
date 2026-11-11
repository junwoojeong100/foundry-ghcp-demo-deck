# English edition — build notes

The English deck is built from translated copies of the Korean sources in this folder. The Korean build (`../build.js` and friends) is untouched; `../lib.js` and `../prep_assets.py` switch language with the `DEMO_LANG` environment variable (default `ko`).

## Build

```bash
cd build
npm install                 # once
npm run prep:en             # DEMO_LANG=en python3 prep_assets.py  -> assets/en/slide/*   (needs Pillow)
npm run build:en            # en/build.js + fix_pptx.js            -> out/deck_en.pptx
python3 en/check_en.py out/deck_en.pptx          # QA: no Hangul/CJK anywhere, structure, notes, alt text
python3 en/fitcheck.py out/deck_en.pptx          # text-fit check with the real Aptos metrics (--margin 1.06 for a safety margin)
nice -n 10 en/render.sh                          # LibreOffice preview PNGs in out/en/  (PREVIEW=1 for a fast poster-only build)
```

`en/render.sh` copies Aptos from the PowerPoint app bundle into the git-ignored `lo_profile/` (without it LibreOffice substitutes a serif font and the preview says nothing about PowerPoint).

## Assets

| What | English edition reads | If it is missing |
| --- | --- | --- |
| Clips (11) | `assets/en/clips/<name>.mp4` | Korean clip + loud WARNING at the end of the build |
| Posters | `assets/en/clips/<name>_poster.png` → `prep:en` → `assets/en/slide/poster_*.png`, `thumb_*.png`, `cover_*.png` | Korean poster + WARNING (both in `prep:en` and in the build) |
| Copilot numbers | `assets/en/run-metrics.json` | build fails |

`STRICT_EN=1` turns every fallback into an error (use it for the final build: `STRICT_EN=1 npm run prep:en && STRICT_EN=1 npm run build:en`).

Clip lengths ("0:40", lane totals, "about 6 min 30 s") and the video aspect ratio are read from the clip files with `ffprobe` at build time.

## Where the content lives

| File | Content |
| --- | --- |
| `content.js` | **`FOUNDRY`** (everything specific to the Foundry recordings) and the 11 demo slides with their speaker notes |
| `slides_a.js` | slides 1–4 (cover, why, demo map, Foundry overview) |
| `slides_b.js` | slides 10, 17–20 (Copilot overview, results, together, next steps, closing) |
| `demo.js` | layout of the demo video slides |
| `metrics.js` | numbers derived from `run-metrics.json` (stage times, approval gates, tests, audit counts) |
| `assets.js`, `fmt.js`, `lang.js` | asset resolution with fallbacks, number/time formatting, forces `DEMO_LANG=en` |

### If a Foundry clip is re-recorded

Edit only the `FOUNDRY` object at the top of `content.js`. It holds the actual values of the English recording of 2026-11-11 (clips f1-f5): recording date, models, agent name and instructions, prompts, sample questions and answers, guardrail details, and the evaluation run (rows, evaluators, durations, per-evaluator scores, latency, tokens, how to read the 0% Output quality). Slide text and speaker notes read these fields through template strings, so a change there updates the whole deck (slides 2, 3, 4, 5-9 and 18). Then run `prep:en` and `build:en` again.

## Notes on the numbers

- Total 38.0 min is `total.real_s`; the seven stage times add up to 2,277 s (the first 5 s of the session come before stage 1).
- Approval gates on the timeline are computed from `approvals[*].at` against `stages[0].wall_start`.
- Audit log: `run-metrics.json` counts 166 "allow", but two of those calls were denied afterwards by a role hook (the reviewer's commit and the ops analyst's DB query). The slides show 169 calls = 164 allowed + 3 approval requests + 2 denied so that the numbers add up.
- The package must contain no Hangul: `build.js` drops the native-script font entries (Korean, Chinese, Japanese names) from the pptxgenjs default theme before writing the file.
