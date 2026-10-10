(() => {
  "use strict";

  const TRUSTED_CLIENT_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4";
  const CHROMIUM_FULL_VERSION = "143.0.3650.75";
  const SEC_MS_GEC_VERSION = `1-${CHROMIUM_FULL_VERSION}`;
  const WSS_BASE = "wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1";
  const CACHE_NAME = "izzy-neural-voice-v1";
  const MEMORY_CACHE_LIMIT = 80;
  const SILENCE_FRAME_MS = 24;
  const SILENCE_FRAME_BYTES = 144;
  const SILENCE_FRAME_HEX = "fff364c40000000348000000004c414d455555554c414d45332e31303055555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555555";
  const memoryCache = new Map();
  let silenceBytes = null;

  function normalizeText(value) {
    return String(value || "")
      .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function escapeXml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function containsChinese(value) {
    return /[\u3400-\u9fff]/.test(value);
  }

  function chooseVoice(text, requested) {
    if (requested) return requested;
    if (containsChinese(text)) return "zh-CN-XiaoxiaoNeural";
    return "en-GB-SoniaNeural";
  }

  function createRequestId() {
    if (globalThis.crypto?.randomUUID) return crypto.randomUUID().replace(/-/g, "");
    return `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;
  }

  function edgeTimestamp(date = new Date()) {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const pad = (value) => String(value).padStart(2, "0");
    return `${days[date.getUTCDay()]} ${months[date.getUTCMonth()]} ${pad(date.getUTCDate())} ${date.getUTCFullYear()} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())} GMT+0000 (Coordinated Universal Time)`;
  }

  async function sha256Hex(value) {
    const bytes = new TextEncoder().encode(value);
    if (globalThis.crypto?.subtle) {
      const digest = await crypto.subtle.digest("SHA-256", bytes);
      return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
    }
    let hash = 2166136261;
    for (const byte of bytes) {
      hash ^= byte;
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16).padStart(8, "0");
  }

  async function generateSecMsGec(clockSkewSeconds = 0) {
    const unixSeconds = BigInt(Math.floor(Date.now() / 1000) + clockSkewSeconds + 11644473600);
    const rounded = unixSeconds - (unixSeconds % 300n);
    const windowsTicks = rounded * 10000000n;
    return (await sha256Hex(`${windowsTicks.toString()}${TRUSTED_CLIENT_TOKEN}`)).toUpperCase();
  }

  function parseBinaryAudio(buffer) {
    if (!(buffer instanceof ArrayBuffer) || buffer.byteLength < 4) return null;
    const bytes = new Uint8Array(buffer);
    const headerLength = (bytes[0] << 8) | bytes[1];
    const audioStart = 2 + headerLength + 2;
    if (audioStart > bytes.length) return null;
    return bytes.slice(audioStart);
  }

  function createSession() {
    let socket = null;
    let currentRequest = null;
    let queue = Promise.resolve();
    let closed = false;

    function closeSocket() {
      if (!socket) return;
      const oldSocket = socket;
      socket = null;
      try { oldSocket.close(); } catch (error) { console.debug(error); }
      if (currentRequest) {
        const request = currentRequest;
        currentRequest = null;
        window.clearTimeout(request.timeout);
        request.reject(new Error("Neural voice connection closed"));
      }
    }

    async function openSocket(clockSkewSeconds) {
      if (socket?.readyState === WebSocket.OPEN) return socket;
      closeSocket();
      const connectionId = createRequestId();
      const timestamp = edgeTimestamp();
      const gec = await generateSecMsGec(clockSkewSeconds);
      const url = `${WSS_BASE}?TrustedClientToken=${TRUSTED_CLIENT_TOKEN}&ConnectionId=${connectionId}&Sec-MS-GEC=${gec}&Sec-MS-GEC-Version=${SEC_MS_GEC_VERSION}`;
      return new Promise((resolve, reject) => {
        let opened = false;
        try {
          socket = new WebSocket(url);
        } catch (error) {
          reject(error);
          return;
        }
        socket.binaryType = "arraybuffer";
        socket.onopen = () => {
          opened = true;
          const config = {
            context: {
              synthesis: {
                audio: {
                  metadataoptions: {
                    sentenceBoundaryEnabled: "false",
                    wordBoundaryEnabled: "false"
                  },
                  outputFormat: "audio-24khz-48kbitrate-mono-mp3"
                }
              }
            }
          };
          socket.send(
            `X-Timestamp:${timestamp}\r\n`
            + "Content-Type:application/json; charset=utf-8\r\n"
            + "Path:speech.config\r\n\r\n"
            + JSON.stringify(config)
          );
          resolve(socket);
        };
        socket.onmessage = (event) => {
          if (!currentRequest) return;
          if (typeof event.data === "string") {
            if (event.data.includes("Path:turn.end")) {
              const request = currentRequest;
              currentRequest = null;
              window.clearTimeout(request.timeout);
              if (request.audioChunks.length) {
                request.resolve(new Blob(request.audioChunks, { type: "audio/mpeg" }));
              } else {
                request.reject(new Error("Neural voice returned no audio"));
              }
            }
            return;
          }
          const audio = parseBinaryAudio(event.data);
          if (audio?.length) {
            currentRequest.audioChunks.push(audio);
            currentRequest.audioBytes += audio.length;
          }
        };
        socket.onerror = () => {
          if (!opened) reject(new Error("Neural voice connection failed"));
          else closeSocket();
        };
        socket.onclose = (event) => {
          if (!opened) {
            reject(new Error(`Neural voice closed with code ${event.code || "unknown"}`));
          } else if (currentRequest) {
            closeSocket();
          }
          socket = null;
        };
      });
    }

    function requestOnSocket(text, voice) {
      const requestId = createRequestId();
      const timestamp = edgeTimestamp();
      return new Promise((resolve, reject) => {
        const request = {
          requestId,
          audioChunks: [],
          audioBytes: 0,
          resolve,
          reject,
          timeout: window.setTimeout(() => {
            if (currentRequest === request) {
              currentRequest = null;
              closeSocket();
              reject(new Error("Neural voice timed out"));
            }
          }, 30000)
        };
        currentRequest = request;
        const lang = voice.startsWith("zh-") ? "zh-CN" : "en-GB";
        const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='${lang}'><voice name='${voice}'><prosody pitch='+0Hz' rate='+0%' volume='+0%'>${escapeXml(text)}</prosody></voice></speak>`;
        socket.send(
          `X-RequestId:${requestId}\r\n`
          + "Content-Type:application/ssml+xml\r\n"
          + `X-Timestamp:${timestamp}Z\r\n`
          + "Path:ssml\r\n\r\n"
          + ssml
        );
      });
    }

    async function synthesizeOne(text, options = {}) {
      const clean = normalizeText(text);
      if (!clean) throw new Error("No text to synthesize");
      const voice = chooseVoice(clean, options.voice);
      const cacheKey = await sha256Hex(`${voice}\u0000${clean}`);
      const cached = await readCache(cacheKey);
      if (cached) return cached;

      let lastError = null;
      for (const skew of [0, 300]) {
        if (closed) throw new Error("Neural voice session closed");
        try {
          await openSocket(skew);
          const blob = await requestOnSocket(clean, voice);
          await writeCache(cacheKey, blob);
          return blob;
        } catch (error) {
          lastError = error;
          closeSocket();
          await new Promise((resolve) => window.setTimeout(resolve, 160 + Math.random() * 180));
        }
      }
      throw lastError || new Error("Neural voice unavailable");
    }

    return {
      synthesize(text, options = {}) {
        const task = queue.then(() => synthesizeOne(text, options));
        queue = task.catch(() => {});
        return task;
      },
      close() {
        closed = true;
        closeSocket();
      }
    };
  }

  async function openAudioCache() {
    if (!globalThis.caches) return null;
    try { return await caches.open(CACHE_NAME); } catch (error) { console.debug(error); return null; }
  }

  function cacheUrl(key) {
    const base = globalThis.location?.href || "https://izzyzhi777-star.github.io/izzy-ielts-dictation/";
    return new URL(`__neural_voice_cache__/${key}.mp3`, base).href;
  }

  async function readCache(key) {
    if (memoryCache.has(key)) return memoryCache.get(key);
    const cache = await openAudioCache();
    if (!cache) return null;
    const response = await cache.match(cacheUrl(key));
    if (!response) return null;
    const blob = await response.blob();
    rememberMemory(key, blob);
    return blob;
  }

  async function writeCache(key, blob) {
    rememberMemory(key, blob);
    const cache = await openAudioCache();
    if (!cache) return;
    try {
      await cache.put(cacheUrl(key), new Response(blob, { headers: { "Content-Type": "audio/mpeg" } }));
    } catch (error) {
      console.debug(error);
    }
  }

  function rememberMemory(key, blob) {
    memoryCache.delete(key);
    memoryCache.set(key, blob);
    while (memoryCache.size > MEMORY_CACHE_LIMIT) {
      memoryCache.delete(memoryCache.keys().next().value);
    }
  }

  async function synthesize(text, options = {}) {
    const clean = normalizeText(text);
    if (!clean) throw new Error("No text to synthesize");
    const voice = chooseVoice(clean, options.voice);
    const cacheKey = await sha256Hex(`${voice}\u0000${clean}`);
    const cached = await readCache(cacheKey);
    if (cached) return cached;

    const session = createSession();
    try {
      return await session.synthesize(clean, { voice });
    } finally {
      session.close();
    }
  }

  function getSilenceBytes() {
    if (silenceBytes) return silenceBytes;
    silenceBytes = Uint8Array.from(SILENCE_FRAME_HEX.match(/.{2}/g), (byte) => Number.parseInt(byte, 16));
    return silenceBytes;
  }

  function silence(seconds = 0.3) {
    const frames = Math.max(0, Math.round((Number(seconds) || 0) * 1000 / SILENCE_FRAME_MS));
    if (!frames) return new Blob([], { type: "audio/mpeg" });
    const source = getSilenceBytes();
    const bytes = new Uint8Array(frames * SILENCE_FRAME_BYTES);
    for (let index = 0; index < frames; index += 1) {
      bytes.set(source, index * SILENCE_FRAME_BYTES);
    }
    return new Blob([bytes], { type: "audio/mpeg" });
  }

  function compose(parts) {
    return new Blob(parts.filter(Boolean), { type: "audio/mpeg" });
  }

  function estimateDuration(blob) {
    return blob?.size ? blob.size / 6000 : 0;
  }

  async function fetchAudioBlob(source) {
    if (!source) throw new Error("Missing audio source");
    const response = await fetch(source, { cache: "force-cache" });
    if (!response.ok) throw new Error(`Audio request failed: ${response.status}`);
    const blob = await response.blob();
    if (!blob.size) throw new Error("Audio response was empty");
    return blob;
  }

  globalThis.IzzyNeuralVoice = {
    synthesize,
    createSession,
    fetchAudioBlob,
    compose,
    silence,
    estimateDuration,
    containsChinese,
    chooseVoice,
    normalizeText
  };
})();
