require("./lang");
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { ROOT } = require("../lib");

// Asset resolution for the English edition.
//   clips   : assets/en/clips/<name>.mp4 (+ <name>_poster.png)
//   images  : assets/en/slide/*  (written by `DEMO_LANG=en python3 prep_assets.py`)
// A missing English file falls back to the Korean one with a loud WARNING; STRICT_EN=1 throws instead.
const STRICT = process.env.STRICT_EN === "1";
const dir = (...p) => path.join(ROOT, "assets", ...p);
const EN_CLIPS = dir("en", "clips"), KO_CLIPS = dir("clips"), EN_SLIDE = dir("en", "slide"), KO_SLIDE = dir("slide");
const rel = (f) => path.relative(ROOT, f);

// demo key -> clip base name (same keys as prep_assets.py)
const CLIPS = {
  f1: "f1_catalog", f2: "f2_deploy", f3: "f3_agent", f4: "f4_guardrails", f5: "f5_eval",
  c1: "cp1_analyze", c2: "cp2_design", c3: "cp3_build_test", c4: "cp4_review", c5: "cp5_deploy", c7: "cp7_guardrail",
};
const FOUNDRY_KEYS = ["f1", "f2", "f3", "f4", "f5"];
const COPILOT_KEYS = ["c1", "c2", "c3", "c4", "c5", "c7"];

const fallbacks = [];
// Records a fallback (build.js prints a loud summary at the end) or, with STRICT_EN=1, throws. `file` is the English file at fault; `ko` the Korean file used instead.
function warn(what, file, ko, hint) {
  if (STRICT) throw new Error(`STRICT_EN=1: ${what}: ${rel(file)}`);
  if (fallbacks.some((f) => f.file === file)) return;
  fallbacks.push({ what, file, ko, hint });
}

function pick(enFile, koFile, what) {
  if (fs.existsSync(enFile)) return enFile;
  warn(`English ${what} missing`, enFile, koFile);
  return koFile;
}

const clipFile = (key) => pick(path.join(EN_CLIPS, `${CLIPS[key]}.mp4`), path.join(KO_CLIPS, `${CLIPS[key]}.mp4`), "clip");

// Generated image (assets/en/slide). `sources` are the English poster sources it was made from: a missing source means
// prep_assets.py used the Korean poster; a source newer than the image means the image is stale.
function slideAsset(name, sources = []) {
  for (const s of sources) {
    const src = path.join(EN_CLIPS, `${s}_poster.png`);
    if (!fs.existsSync(src)) warn("English poster missing", src, path.join(KO_CLIPS, `${s}_poster.png`));
  }
  const file = pick(path.join(EN_SLIDE, name), path.join(KO_SLIDE, name), "slide image");
  if (file.startsWith(EN_SLIDE)) {
    for (const s of sources) {
      const src = path.join(EN_CLIPS, `${s}_poster.png`);
      if (fs.existsSync(src) && fs.statSync(src).mtimeMs > fs.statSync(file).mtimeMs + 1000) warn("Generated image is older than its English poster", file, null, "run `npm run prep:en` to regenerate it");
    }
  }
  return file;
}

const posterFile = (key) => slideAsset(`poster_${key}.png`, [CLIPS[key]]);
const thumbFile = (key) => slideAsset(`thumb_${key}.png`, [CLIPS[key]]);
const coverFile = (which) => (which === "foundry" ? slideAsset("cover_foundry.png", [CLIPS.f3]) : slideAsset("cover_copilot.png", [CLIPS.c7]));
const backgroundFile = (name) => slideAsset(name);

// ffprobe: duration and frame size of a clip. A clip that is still being written (another process cutting it) cannot be
// probed yet, so retry a few times before giving up.
const probes = new Map();
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
function ffprobe(file) {
  const bins = [process.env.FFPROBE, "ffprobe", "/opt/homebrew/bin/ffprobe", "/usr/local/bin/ffprobe"].filter(Boolean);
  let last;
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt) sleep(2000);
    for (const bin of bins) {
      try {
        return JSON.parse(execFileSync(bin, ["-v", "error", "-show_entries", "stream=codec_type,codec_name,pix_fmt,width,height:format=duration", "-of", "json", file], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }));
      } catch (e) { last = e; if (e.code !== "ENOENT") break; }
    }
  }
  const why = last && last.stderr ? String(last.stderr).trim().split("\n").slice(-1)[0] : last && last.message;
  throw new Error(`ffprobe failed for ${rel(file)} (is ffmpeg installed? is the clip complete?): ${why}`);
}
function probe(file) {
  if (!probes.has(file)) {
    const j = ffprobe(file);
    const v = j.streams.find((s) => s.codec_type === "video");
    if (!v) throw new Error(`${rel(file)} has no video stream`);
    probes.set(file, { sec: parseFloat(j.format.duration), w: v.width, h: v.height, codec: v.codec_name, pix: v.pix_fmt, audio: j.streams.some((s) => s.codec_type === "audio") });
  }
  return probes.get(file);
}
const seconds = (key) => probe(clipFile(key)).sec;
const aspect = (key) => { const p = probe(clipFile(key)); return p.w / p.h; };

// Clip lengths in whole seconds (as printed on the slides) and their sums, so that printed numbers add up.
let cached;
function lengths() {
  if (cached) return cached;
  const per = {};
  for (const k of Object.keys(CLIPS)) per[k] = Math.round(seconds(k));
  const sum = (keys) => keys.reduce((a, k) => a + per[k], 0);
  const total = sum(FOUNDRY_KEYS) + sum(COPILOT_KEYS);
  const approx = Math.round(total / 30) * 30; // nearest 30 s, for "about 6 min 30 s"
  cached = { per, foundry: sum(FOUNDRY_KEYS), copilot: sum(COPILOT_KEYS), total, approx, approxMin: approx / 60, count: Object.keys(CLIPS).length };
  return cached;
}

// Format problems that may keep a clip from playing everywhere in PowerPoint (the Korean clips are silent H.264 / yuv420p)
function formatNotes() {
  const out = [];
  for (const k of Object.keys(CLIPS)) {
    const file = clipFile(k);
    if (!file.startsWith(EN_CLIPS)) continue;
    const p = probe(file);
    const name = path.basename(file);
    if (p.codec !== "h264") out.push(`${name}: codec ${p.codec} (expected h264)`);
    if (p.pix !== "yuv420p") out.push(`${name}: pixel format ${p.pix} (expected yuv420p; yuvj420p is full-range and may look wrong in some players)`);
    if (p.audio) out.push(`${name}: has an audio track (the clips are meant to be silent)`);
  }
  return out;
}

const report = () => fallbacks.map((f) => ({ what: f.what, file: rel(f.file), ko: f.ko ? rel(f.ko) : null, hint: f.hint }));

module.exports = { CLIPS, FOUNDRY_KEYS, COPILOT_KEYS, STRICT, clipFile, posterFile, thumbFile, coverFile, backgroundFile, seconds, aspect, lengths, formatNotes, report };
