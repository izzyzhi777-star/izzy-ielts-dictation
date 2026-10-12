#!/usr/bin/env python3
"""Build an offline Sonia voice pack from an exported IZZY vocabulary JSON."""

from __future__ import annotations

import asyncio
import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / "vendor"))

import edge_tts  # noqa: E402

VOICE = "en-GB-SoniaNeural"
RATE = "-5%"
CACHE_DIR = ROOT / "audio" / "voice-pack"
INDEX_PATH = CACHE_DIR / "index.json"


def load_items(path: Path) -> list[dict]:
    payload = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(payload, list):
        return payload
    if isinstance(payload, dict):
        return payload.get("customItems") or []
    return []


async def synthesize(text: str, destination: Path, semaphore: asyncio.Semaphore) -> bool:
    for attempt in range(6):
        async with semaphore:
            try:
                await asyncio.wait_for(
                    edge_tts.Communicate(text, VOICE, rate=RATE).save(str(destination)),
                    timeout=18,
                )
                return destination.exists() and destination.stat().st_size > 0
            except Exception:
                destination.unlink(missing_ok=True)
                if attempt < 5:
                    await asyncio.sleep(0.8 + attempt * 0.5)
    return False


async def build(source: Path) -> int:
    items = load_items(source)
    texts = []
    for item in items:
        for key in ("text", "example"):
            value = str(item.get(key) or "").strip()
            if value:
                texts.append(value)
    texts = list(dict.fromkeys(texts))
    if not texts:
        print(f"No vocabulary text found in {source}")
        return 1

    index = json.loads(INDEX_PATH.read_text(encoding="utf-8")) if INDEX_PATH.exists() else {}
    pending = []
    for text in texts:
        if text in index and (CACHE_DIR / index[text].get("file", "")).exists():
            continue
        digest = hashlib.sha256(f"{text}\0{VOICE}\0{RATE}".encode("utf-8")).hexdigest()
        filename = f"{digest}.mp3"
        destination = CACHE_DIR / filename
        if not destination.exists() or destination.stat().st_size == 0:
            pending.append((text, destination, filename))
        else:
            index[text] = {"file": filename, "voice": VOICE, "locale": "en-GB", "rate": RATE}

    semaphore = asyncio.Semaphore(4)

    async def run_one(text: str, destination: Path, filename: str):
        ok = await synthesize(text, destination, semaphore)
        return text, ok, filename

    completed = 0
    for coroutine in asyncio.as_completed([run_one(*task) for task in pending]):
        text, ok, filename = await coroutine
        completed += 1
        if ok:
            index[text] = {"file": filename, "voice": VOICE, "locale": "en-GB", "rate": RATE}
        print(f"[{completed:04d}/{len(pending):04d}] {'OK' if ok else 'FAILED'} {text}")
        if completed % 20 == 0:
            INDEX_PATH.write_text(json.dumps(index, ensure_ascii=False, indent=2), encoding="utf-8")

    INDEX_PATH.write_text(json.dumps(index, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Voice pack ready: {len(texts)} requested, {len(index)} indexed.")
    return 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 build_custom_voice_pack.py izzy-vocabulary-918.json")
        raise SystemExit(2)
    raise SystemExit(asyncio.run(build(Path(sys.argv[1]).expanduser())))
