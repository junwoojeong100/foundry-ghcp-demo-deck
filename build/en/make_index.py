#!/usr/bin/env python3
"""Generates en/index.html (the English GitHub Pages landing page) from the clip files in assets/en/clips and the narrated video in en/video.

  python3 build/en/make_index.py
Durations are read with ffprobe, so the page always matches the files. The Korean page is the hand-written ../index.html.
"""
import html
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
CLIPS = ROOT / "assets" / "en" / "clips"
VIDEO_DIR = ROOT / "en" / "video"
VIDEO_NAME = "Microsoft_Foundry_GitHub_Copilot_Demo_EN"
PAGES = "https://junwoojeong100.github.io/foundry-ghcp-demo-deck"
PPTX = "Microsoft_Foundry_GitHub_Copilot_Demo_Deck_EN.pptx"

DEMOS = [  # n, section, clip, slide, aspect, title, text
    (1, "f", "f1_catalog", 5, "16 / 9", "Model catalog and compare", "Find models from many providers in one place, then compare three of them side by side."),
    (2, "f", "f2_deploy", 6, "16 / 9", "Deploy, then test right away", "Deploy in a few clicks, chat in the Playground, and connect from code with Entra ID (no API key)."),
    (3, "f", "f3_agent", 7, "16 / 9", "An agent on our own document", "Write the role and rules as instructions, upload a policy document, and get an agent that answers with its sources."),
    (4, "f", "f4_guardrails", 8, "16 / 9", "Guardrails", "A jailbreak attempt is blocked at the input, and the risk type is shown."),
    (5, "f", "f5_eval", 9, "16 / 9", "Evaluations", "Generate 15 test questions from the agent's instructions and score quality and safety with six evaluators."),
    (6, "p", "cp1_analyze", 11, "1880 / 968", "Analyze", "A Change Analyst agent reads code, documents and data and summarizes the impact of a change request."),
    (7, "p", "cp2_design", 12, "1880 / 968", "Design", "The Solution Architect asks a human about key decisions; code edits are allowed only after design approval."),
    (8, "p", "cp3_build_test", 13, "1880 / 968", "Build and test", "A Developer agent implements the approved design; a separate Tester agent adds 74 tests (26 to 100, 99% coverage)."),
    (9, "p", "cp4_review", 14, "1880 / 968", "Review", "The Reviewer checks the change against the design and the security checklist; a human approves the code."),
    (10, "p", "cp5_deploy", 15, "1880 / 968", "Deploy", "Staging and a smoke test first; a human approves the production deploy."),
    (11, "p", "cp7_guardrail", 16, "1880 / 968", "Safeguards", "A hook blocks unapproved code edits and dangerous commands at the system level."),
]


def dur(path: Path) -> float:
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)], capture_output=True, text=True, check=True).stdout
    return float(out.strip())


def mmss(s: float) -> str:
    s = round(s)
    return f"{s // 60}:{s % 60:02d}"


def words(s: float) -> str:
    m, r = divmod(round(s), 60)
    if not m:
        return f"{r} s"
    return f"{m} min {r} s" if r else f"{m} min"


def main():
    d = {c: dur(CLIPS / f"{c}.mp4") for _, _, c, *_ in DEMOS}
    # lane totals add up the rounded per-clip lengths, so they match the "0:42"-style labels and the totals on the slides
    tot_f = sum(round(d[c]) for _, sec, c, *_ in DEMOS if sec == "f")
    tot_p = sum(round(d[c]) for _, sec, c, *_ in DEMOS if sec == "p")
    video = VIDEO_DIR / f"{VIDEO_NAME}.mp4"
    has_video = video.exists()
    vdur = dur(video) if has_video else 0

    def card(n, sec, clip, slide, aspect, title, text):
        cls = "f" if sec == "f" else "p"
        return f"""      <article class="card {cls}">
        <video controls preload="none" playsinline poster="../assets/en/thumbs/{clip}.jpg" style="aspect-ratio:{aspect}">
          <source src="../assets/en/clips/{clip}.mp4" type="video/mp4">
        </video>
        <div class="meta"><span class="badge">DEMO {n}</span><span class="dur">{mmss(d[clip])}</span><span class="slide">Slide {slide}</span></div>
        <h3>{html.escape(title)}</h3>
        <p>{html.escape(text)}</p>
      </article>"""

    cards_f = "\n".join(card(*x) for x in DEMOS if x[1] == "f")
    cards_p = "\n".join(card(*x) for x in DEMOS if x[1] == "p")
    video_block = ""
    if has_video:
        video_block = f"""    <section class="sec">
      <div class="sec-h"><span class="pill f">FULL VIDEO</span><h2>All eleven demos, narrated</h2><span class="tot f">{words(vdur)} &middot; 1080p &middot; English captions</span></div>
      <article class="card f wide">
        <video controls preload="none" playsinline poster="video/{VIDEO_NAME}.poster.jpg" style="aspect-ratio:16 / 9">
          <source src="video/{VIDEO_NAME}.mp4" type="video/mp4">
          <track kind="captions" srclang="en" label="English" src="video/{VIDEO_NAME}.vtt" default>
        </video>
        <div class="meta"><span class="badge">NARRATED</span><span class="dur">{mmss(vdur)}</span></div>
        <p>The same screen recordings as the slides, with English narration and captions. The narration is AI-generated with Azure AI Speech.
        Download: <a href="video/{VIDEO_NAME}.mp4">MP4</a> &middot; <a href="video/{VIDEO_NAME}.srt">SRT</a> &middot; <a href="video/{VIDEO_NAME}.chapters.txt">chapters</a></p>
      </article>
    </section>
"""
    page = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Microsoft Foundry × GitHub Copilot — AI app development, shown in demos</title>
<meta name="description" content="A demo-first customer deck: 20 slides, 11 real screen recordings, and a narrated video. Open it in the browser or download the PPTX.">
<meta property="og:type" content="website">
<meta property="og:title" content="Microsoft Foundry × GitHub Copilot — AI app development, shown in demos">
<meta property="og:description" content="20 slides + 11 real screen recordings (Foundry 5 · Copilot 6), English edition">
<meta property="og:image" content="{PAGES}/assets/en/thumbs/f3_agent.jpg">
<link rel="icon" href="data:,">
<style>
  :root {{ --ink:#14233a; --body:#33465a; --muted:#5f7185; --line:#d7e2ee; --bg:#f5f7fb; --blue:#0f6cbd; --blue-dk:#0a4f8f; --blue-tint:#e7f1fb; --purple:#6e40c9; --purple-dk:#4d2a9e; --purple-tint:#f0ebfb; --amber:#f0b429; }}
  * {{ box-sizing:border-box; }}
  body {{ margin:0; font-family:system-ui,-apple-system,"Segoe UI",Arial,sans-serif; color:var(--body); background:var(--bg); line-height:1.55; }}
  a {{ color:inherit; }}
  .hero {{ background:radial-gradient(900px 420px at 0% 0%,rgba(47,124,246,.40),transparent 60%),radial-gradient(900px 420px at 100% 100%,rgba(139,92,246,.40),transparent 60%),#0b1020; color:#fff; padding:56px 20px 48px; }}
  .wrap {{ max-width:1160px; margin:0 auto; }}
  .kicker {{ display:inline-block; font-size:12px; letter-spacing:.14em; font-weight:700; color:#8dbbff; border:1px solid #2a3760; background:#1b2646; border-radius:999px; padding:6px 14px; }}
  .lang {{ float:right; font-size:14px; }}
  .lang a {{ color:#c9d3e6; }}
  h1 {{ font-size:clamp(28px,5vw,48px); line-height:1.15; margin:18px 0 10px; }}
  h1 .x {{ color:var(--amber); }}
  .sub {{ font-size:clamp(16px,2.2vw,20px); color:#c9d3e6; margin:0 0 26px; max-width:760px; }}
  .cta {{ display:flex; flex-wrap:wrap; gap:12px; }}
  .btn {{ display:inline-flex; align-items:center; gap:8px; padding:13px 22px; border-radius:12px; font-weight:700; text-decoration:none; font-size:16px; }}
  .btn.primary {{ background:var(--amber); color:#14233a; }}
  .btn.ghost {{ border:1px solid #3a4a78; color:#fff; background:rgba(255,255,255,.06); }}
  .btn:hover {{ filter:brightness(1.08); }}
  .facts {{ display:flex; flex-wrap:wrap; gap:10px 22px; margin-top:26px; font-size:14px; color:#aab6cf; }}
  .facts b {{ color:#fff; }}
  main {{ padding:34px 20px 20px; }}
  .sec {{ margin:10px 0 38px; }}
  .sec-h {{ display:flex; align-items:baseline; gap:14px; flex-wrap:wrap; margin-bottom:16px; }}
  .pill {{ font-size:12px; font-weight:800; letter-spacing:.12em; color:#fff; border-radius:999px; padding:6px 14px; }}
  .pill.f {{ background:var(--blue); }} .pill.p {{ background:var(--purple); }}
  .sec-h h2 {{ margin:0; font-size:20px; color:var(--ink); }}
  .sec-h .tot {{ margin-left:auto; font-weight:700; font-size:14px; }}
  .sec-h .tot.f {{ color:var(--blue-dk); }} .sec-h .tot.p {{ color:var(--purple-dk); }}
  .grid {{ display:grid; grid-template-columns:repeat(auto-fill,minmax(330px,1fr)); gap:20px; }}
  .card {{ background:#fff; border:1px solid var(--line); border-radius:14px; padding:12px 12px 16px; box-shadow:0 2px 10px rgba(10,26,51,.06); border-top:4px solid var(--blue); }}
  .card.p {{ border-top-color:var(--purple); }}
  .card.wide {{ max-width:860px; }}
  video {{ width:100%; display:block; border-radius:8px; background:#060a14; }}
  .meta {{ display:flex; align-items:center; gap:10px; margin:12px 4px 2px; font-size:12px; color:var(--muted); }}
  .badge {{ font-weight:800; letter-spacing:.08em; border-radius:999px; padding:3px 10px; }}
  .card.f .badge {{ background:var(--blue-tint); color:var(--blue-dk); }} .card.p .badge {{ background:var(--purple-tint); color:var(--purple-dk); }}
  .slide {{ margin-left:auto; }}
  h3 {{ margin:4px 4px 4px; font-size:18px; color:var(--ink); }}
  .card p {{ margin:0 4px; font-size:14px; }}
  .note {{ background:#fff; border:1px solid var(--line); border-left:4px solid var(--amber); border-radius:10px; padding:16px 18px; font-size:14px; margin:6px 0 26px; }}
  .note ul {{ margin:6px 0 0; padding-left:20px; }}
  footer {{ padding:10px 20px 44px; font-size:13px; color:var(--muted); }}
  footer a {{ color:var(--blue-dk); }}
</style>
</head>
<body>
<header class="hero">
  <div class="wrap">
    <span class="lang"><a href="../">Korean edition</a></span>
    <span class="kicker">CUSTOMER BRIEFING · 2026.11</span>
    <h1>Microsoft Foundry <span class="x">×</span> GitHub Copilot<br>AI app development, shown in demos</h1>
    <p class="sub">Build, protect and evaluate an AI app, shown in <b>real screen recordings</b> instead of slides.</p>
    <div class="cta">
      <a class="btn primary" href="https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Fjunwoojeong100.github.io%2Ffoundry-ghcp-demo-deck%2Fen%2F{PPTX}">📑 Open the slides in your browser</a>
      <a class="btn ghost" href="https://github.com/junwoojeong100/foundry-ghcp-demo-deck/raw/main/en/{PPTX}">⬇ Download the PPTX</a>
      <a class="btn ghost" href="https://github.com/junwoojeong100/foundry-ghcp-demo-deck">GitHub repository</a>
    </div>
    <div class="facts"><span><b>20</b> slides with speaker notes</span><span><b>11</b> demo videos (Foundry 5 · Copilot 6)</span><span>Total <b>{words(tot_f + tot_p)}</b> of recordings</span>{f'<span>Narrated video <b>{words(vdur)}</b></span>' if has_video else ''}</div>
  </div>
</header>
<main>
  <div class="wrap">
    <div class="note">
      <b>How to watch</b>
      <ul>
        <li>The <b>slides</b> open in Microsoft PowerPoint for the web. Press ▶ on a video to play it, and open <b>Notes</b> (bottom right) for the speaker notes. The web viewer uses its own fonts, so line breaks can differ a little; download the PPTX for the exact layout.</li>
        <li>The <b>videos</b> below play one at a time. The clips are silent (the narrated video above them has a voice-over and captions).</li>
      </ul>
    </div>
{video_block}
    <section class="sec">
      <div class="sec-h"><span class="pill f">MICROSOFT FOUNDRY</span><h2>Choose a model, deploy, build an agent, protect, evaluate</h2><span class="tot f">5 clips · {words(tot_f)}</span></div>
      <div class="grid">
{cards_f}
      </div>
    </section>

    <section class="sec">
      <div class="sec-h"><span class="pill p">GITHUB COPILOT</span><h2>Analyze, design, build and test, review, deploy, and the safeguards</h2><span class="tot p">6 clips · {words(tot_p)}</span></div>
      <div class="grid">
{cards_p}
      </div>
    </section>

    <div class="note">
      <b>Good to know</b>
      <ul>
        <li>ShopFlow is a fictional online store; its names, data and approvers are fictional. Waiting time is cut or sped up.</li>
        <li>The Foundry screens were recorded on 2026-11-11 in the English portal. Models and features on screen depend on your subscription, region and the time you look, and evaluation scores come from an LLM judge, so they vary from run to run.</li>
        <li>The Copilot screens come from the English recorded session of <a href="https://github.com/junwoojeong100/ghcp_cli_workflow_demo_kit">ghcp_cli_workflow_demo_kit</a> (ShopFlow). The numbers are from one run and do not guarantee results in your environment.</li>
      </ul>
    </div>
  </div>
</main>
<footer><div class="wrap">© junwoojeong100 · <a href="https://github.com/junwoojeong100/foundry-ghcp-demo-deck">Source and build instructions: see the repository README</a></div></footer>
<script>
  // Play one video at a time
  document.addEventListener('play', function (e) {{
    document.querySelectorAll('video').forEach(function (v) {{ if (v !== e.target) v.pause(); }});
  }}, true);
</script>
</body>
</html>
"""
    out = ROOT / "en" / "index.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(page, encoding="utf-8")
    print("written", out, f"(clips {words(tot_f + tot_p)}, video {words(vdur) if has_video else 'none yet'})")


if __name__ == "__main__":
    main()
