"""Azure AI Speech text-to-speech for the English demo video (Entra ID auth, no keys).

The Speech resource has local key auth disabled, so a bearer token is taken from the Azure CLI for the subscription named in
SPEECH_SUBSCRIPTION. `az account get-access-token --subscription ...` does not change the CLI's default login.

  export SPEECH_SUBSCRIPTION="<subscription that is authorized for the Speech resource>"
  export SPEECH_ENDPOINT="https://<speech resource>.cognitiveservices.azure.com"     # required to synthesize; cached wavs need no network

Voice: en-US-Andrew:DragonHDLatestNeural (HD neural voice). Narration text is hashed, so only changed sentences are synthesized again.
"""
from __future__ import annotations

import hashlib
import html
import os
import re
import shutil
import subprocess
import time
from pathlib import Path

import requests

ENDPOINT = os.environ.get("SPEECH_ENDPOINT", "").rstrip("/")
VOICE = os.environ.get("VOICE", "en-US-Andrew:DragonHDLatestNeural")
VOICE_PARAMS = os.environ.get("VOICE_PARAMS", "temperature=0.4;enhancePronunciation=true")
FFMPEG = shutil.which("ffmpeg") or "/opt/homebrew/bin/ffmpeg"
FFPROBE = shutil.which("ffprobe") or "/opt/homebrew/bin/ffprobe"

_tok = {"v": None, "t": 0.0}


def token(force: bool = False) -> str:
    if force or not _tok["v"] or time.time() - _tok["t"] > 20 * 60:
        cmd = ["az", "account", "get-access-token", "--resource", "https://cognitiveservices.azure.com", "--query", "accessToken", "-o", "tsv"]
        sub = os.environ.get("SPEECH_SUBSCRIPTION")
        if sub:
            cmd[3:3] = ["--subscription", sub]
        _tok["v"] = subprocess.run(cmd, capture_output=True, text=True, check=True).stdout.strip()
        _tok["t"] = time.time()
    return _tok["v"]


def _ssml(text: str) -> str:
    body = html.escape(text, quote=False)
    body = re.sub(r"\{pause:(\d+)\}", r'<break time="\1ms"/>', body)
    return (f"<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='https://www.w3.org/2001/mstts' xml:lang='en-US'>"
            f"<voice name='{VOICE}' parameters='{VOICE_PARAMS}'>{body}</voice></speak>")


def duration(path: Path) -> float:
    out = subprocess.run([FFPROBE, "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(path)], capture_output=True, text=True, check=True).stdout
    return float(out.strip())


def synth(text: str, cache_dir: Path, retries: int = 4) -> Path:
    """Synthesize one piece of narration to a trimmed 48 kHz mono wav; cached by text/voice hash."""
    cache_dir.mkdir(parents=True, exist_ok=True)
    key = hashlib.sha256(f"{VOICE}|{VOICE_PARAMS}|{text}".encode()).hexdigest()[:16]
    out = cache_dir / f"{key}.wav"
    if out.exists():
        return out
    raw = cache_dir / f"{key}.raw.wav"
    if not ENDPOINT:
        raise RuntimeError("SPEECH_ENDPOINT is not set (needed to synthesize new narration)")
    force = False
    for attempt in range(retries):
        r = requests.post(
            ENDPOINT + "/tts/cognitiveservices/v1",
            headers={"Authorization": "Bearer " + token(force), "Content-Type": "application/ssml+xml",
                     "X-Microsoft-OutputFormat": "riff-48khz-16bit-mono-pcm", "User-Agent": "foundry-ghcp-demo-deck"},
            data=_ssml(text).encode("utf-8"), timeout=180)
        if r.status_code == 200 and len(r.content) > 2000:
            raw.write_bytes(r.content)
            # trim leading/trailing silence, keep a short natural tail
            subprocess.run([FFMPEG, "-y", "-v", "error", "-i", str(raw), "-af",
                            "silenceremove=start_periods=1:start_duration=0.01:start_threshold=-60dB:start_silence=0.04,areverse,"
                            "silenceremove=start_periods=1:start_duration=0.02:start_threshold=-55dB:start_silence=0.12,areverse",
                            "-ar", "48000", "-ac", "1", str(out)], check=True)
            raw.unlink(missing_ok=True)
            return out
        force = r.status_code == 401
        print(f"  TTS attempt {attempt + 1} failed: HTTP {r.status_code} {r.text[:160]}")
        time.sleep(2 + attempt * 3)
    raise RuntimeError(f"TTS failed for: {text[:60]}")


if __name__ == "__main__":
    import sys
    p = synth(" ".join(sys.argv[1:]) or "Microsoft Foundry and GitHub Copilot, shown in real screen recordings.", Path("/tmp/tts_cache"))
    print(p, round(duration(p), 2), "s")
