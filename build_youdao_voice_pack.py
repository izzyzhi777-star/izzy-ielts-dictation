#!/usr/bin/env python3
"""Download Youdao/Baidu UK English audio for an exported IZZY vocabulary."""

from __future__ import annotations

import asyncio
import hashlib
import json
import sys
from pathlib import Path
from urllib.parse import urlencode

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT / "vendor"))

import aiohttp  # noqa: E402

CACHE_DIR = ROOT / "audio" / "voice-pack"
INDEX_PATH = CACHE_DIR / "index.json"
CONCURRENCY = 4
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15",
    "Referer": "https://dict.youdao.com/",
}
BAIDU_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15",
    "Referer": "https://www.baidu.com/",
}


def gather_texts(payload: dict) -> list[str]:
    texts: list[str] = []
    for item in payload.get("customItems", []):
        for key in ("text", "example"):
            value = str(item.get(key) or "").strip()
            if value:
                texts.append(value)
    for item in payload.get("hearingWrong", []):
        value = str(item.get("text") or "").strip()
        if value:
            texts.append(value)
    return list(dict.fromkeys(texts))


def extension_for(data: bytes) -> str:
    if data.startswith(b"RIFF"):
        return "wav"
    return "mp3"


async def fetch(session: aiohttp.ClientSession, url: str, headers: dict | None = None) -> bytes:
    async with session.get(url, headers=headers or HEADERS, timeout=aiohttp.ClientTimeout(total=30)) as response:
        if response.status != 200:
            raise RuntimeError(f"HTTP {response.status}")
        data = await response.read()
        if len(data) < 64:
            raise RuntimeError("empty audio")
        return data


async def download_one(session: aiohttp.ClientSession, text: str) -> tuple[bytes, str]:
    youdao = "https://dict.youdao.com/dictvoice?" + urlencode({"audio": text, "type": 1})
    try:
        return await fetch(session, youdao), "youdao"
    except Exception:
        pass
    baidu = "https://fanyi.baidu.com/gettts?" + urlencode({"lan": "en", "text": text, "spd": 2, "source": "web"})
    return await fetch(session, baidu, BAIDU_HEADERS), "baidu"


async def build(source: Path) -> int:
    payload = json.loads(source.read_text(encoding="utf-8"))
    texts = gather_texts(payload)
    index = json.loads(INDEX_PATH.read_text(encoding="utf-8")) if INDEX_PATH.exists() else {}
    pending = [text for text in texts if text not in index or not (CACHE_DIR / index[text].get("file", "")).exists()]
    semaphore = asyncio.Semaphore(CONCURRENCY)
    completed = 0
    failed = 0
    connector = aiohttp.TCPConnector(limit=CONCURRENCY, ssl=False)

    async with aiohttp.ClientSession(connector=connector) as session:
        async def worker(text: str):
            nonlocal completed, failed
            async with semaphore:
                last_error = None
                for attempt in range(4):
                    try:
                        data, provider = await download_one(session, text)
                        extension = extension_for(data)
                        digest = hashlib.sha256(f"{text}\0{provider}\0{extension}".encode("utf-8")).hexdigest()
                        filename = f"{digest}.{extension}"
                        (CACHE_DIR / filename).write_bytes(data)
                        index[text] = {
                            "file": filename,
                            "voice": "Youdao UK English" if provider == "youdao" else "Baidu UK English",
                            "locale": "en-GB",
                            "provider": provider,
                        }
                        completed += 1
                        print(f"[{completed:04d}/{len(pending):04d}] OK {provider:6s} {text}", flush=True)
                        if completed % 20 == 0:
                            INDEX_PATH.write_text(json.dumps(index, ensure_ascii=False, indent=2), encoding="utf-8")
                        return
                    except Exception as error:
                        last_error = error
                        await asyncio.sleep(0.5 + attempt * 0.6)
                failed += 1
                print(f"[{completed + failed:04d}/{len(pending):04d}] FAILED {text} :: {last_error}", flush=True)

        await asyncio.gather(*(worker(text) for text in pending))
    INDEX_PATH.write_text(json.dumps(index, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Done. requested={len(texts)} new={len(pending)} failed={failed} indexed={len(index)}")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    if len(sys.argv) < 2:
        raise SystemExit("Usage: python3 build_youdao_voice_pack.py data/izzy-vocabulary-918.json")
    raise SystemExit(asyncio.run(build(Path(sys.argv[1]).expanduser())))
