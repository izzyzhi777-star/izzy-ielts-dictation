#!/usr/bin/env python3
"""Sequentially repair missing vocabulary audio with Youdao/Baidu fallbacks."""

from __future__ import annotations

import hashlib
import json
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent
INDEX_PATH = ROOT / "audio" / "voice-pack" / "index.json"
CACHE_DIR = INDEX_PATH.parent
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15",
    "Referer": "https://dict.youdao.com/",
}
BAIDU_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/18.0 Safari/605.1.15",
    "Referer": "https://www.baidu.com/",
}


def fetch(url: str, headers: dict | None = None) -> bytes:
    request = urllib.request.Request(url, headers=headers or HEADERS)
    with urllib.request.urlopen(request, timeout=25) as response:
        if response.status != 200:
            raise RuntimeError(f"HTTP {response.status}")
        data = response.read()
        if len(data) < 64:
            raise RuntimeError("empty audio")
        return data


def download(text: str) -> tuple[bytes, str]:
    youdao = "https://dict.youdao.com/dictvoice?" + urllib.parse.urlencode({"audio": text, "type": 1})
    try:
        return fetch(youdao), "youdao"
    except Exception:
        pass
    baidu = "https://fanyi.baidu.com/gettts?" + urllib.parse.urlencode({"lan": "en", "text": text, "spd": 2, "source": "web"})
    return fetch(baidu, BAIDU_HEADERS), "baidu"


def main(source: Path) -> int:
    payload = json.loads(source.read_text(encoding="utf-8"))
    texts = []
    for item in payload.get("customItems", []):
        texts.extend(str(item.get(key) or "").strip() for key in ("text", "example"))
    texts.extend(str(item.get("text") or "").strip() for item in payload.get("hearingWrong", []))
    texts = [text for text in dict.fromkeys(texts) if text]
    index = json.loads(INDEX_PATH.read_text(encoding="utf-8")) if INDEX_PATH.exists() else {}
    missing = [text for text in texts if text not in index or not (CACHE_DIR / index[text].get("file", "")).exists()]
    print(f"Missing {len(missing)} entries", flush=True)
    failed = 0
    for position, text in enumerate(missing, 1):
        last_error = None
        for attempt in range(5):
            try:
                data, provider = download(text)
                extension = "wav" if data.startswith(b"RIFF") else "mp3"
                digest = hashlib.sha256(f"{text}\0{provider}\0{extension}".encode("utf-8")).hexdigest()
                filename = f"{digest}.{extension}"
                (CACHE_DIR / filename).write_bytes(data)
                index[text] = {
                    "file": filename,
                    "voice": "Youdao UK English" if provider == "youdao" else "Baidu UK English",
                    "locale": "en-GB",
                    "provider": provider,
                }
                print(f"[{position:03d}/{len(missing):03d}] OK {provider} {text}", flush=True)
                break
            except Exception as error:
                last_error = error
                time.sleep(0.8 + attempt)
        else:
            failed += 1
            print(f"[{position:03d}/{len(missing):03d}] FAILED {text} :: {last_error}", flush=True)
        if position % 10 == 0:
            INDEX_PATH.write_text(json.dumps(index, ensure_ascii=False, indent=2), encoding="utf-8")
    INDEX_PATH.write_text(json.dumps(index, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Repair done. failed={failed} indexed={len(index)}")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main(Path(sys.argv[1]).expanduser()))
