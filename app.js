(() => {
  "use strict";

  const SETTINGS_KEY = "number-dictation-settings-v2";
  const WRONG_KEY = "number-dictation-wrong-v2";
  const CUSTOM_KEY = "number-dictation-custom-v1";
  const HEARING_WRONG_KEY = "number-dictation-hearing-wrong-v1";
  const SYNC_KEY = "izzy-ielts-sync-v1";
  const EBBINGHAUS_INTERVALS = [
    5 * 60 * 1000,
    30 * 60 * 1000,
    12 * 60 * 60 * 1000,
    24 * 60 * 60 * 1000,
    2 * 24 * 60 * 60 * 1000,
    4 * 24 * 60 * 60 * 1000,
    7 * 24 * 60 * 60 * 1000,
    15 * 24 * 60 * 60 * 1000,
    30 * 24 * 60 * 60 * 1000
  ];
  const DEFAULT_SETTINGS = {
    speed: 1,
    submitMode: "manual",
    repeat: 2,
    order: "sequence",
    dateOrder: "sequence",
    mode: "english",
    voice: "sonia"
  };
  const RANGE_CONFIG = {
    basic: { min: 1, max: 100, count: 100, shuffled: false },
    hundreds: { min: 100, max: 1000, count: 100, shuffled: true },
    thousands: { min: 1000, max: 10000, count: 100, shuffled: true },
    large: { min: 1, max: 90000000000, count: 100, shuffled: true }
  };

  const ONES = [
    "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
    "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"
  ];
  const TENS = {
    20: "twenty", 30: "thirty", 40: "forty", 50: "fifty",
    60: "sixty", 70: "seventy", 80: "eighty", 90: "ninety"
  };
  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const WEEKDAYS = [
    { en: "Monday", zh: "星期一" },
    { en: "Tuesday", zh: "星期二" },
    { en: "Wednesday", zh: "星期三" },
    { en: "Thursday", zh: "星期四" },
    { en: "Friday", zh: "星期五" },
    { en: "Saturday", zh: "星期六" },
    { en: "Sunday", zh: "星期日" }
  ];

  const $ = (id) => document.getElementById(id);
  const dom = {
    tabs: Array.from(document.querySelectorAll("[data-tab]")),
    dateModeButtons: Array.from(document.querySelectorAll("[data-date-mode]")),
    dateOrderOptions: $("dateOrderOptions"),
    panels: Array.from(document.querySelectorAll("[data-panel]")),
    settingsButton: $("settingsButton"),
    settingsDrawer: $("drawerBackdrop"),
    closeSettingsButton: $("closeSettingsButton"),
    rangeButtons: Array.from(document.querySelectorAll("[data-range]")),
    speedOptions: $("speedOptions"),
    voiceOptions: $("voiceOptions"),
    submitOptions: $("submitOptions"),
    repeatOptions: $("repeatOptions"),
    orderOptions: $("orderOptions"),
    modeButtons: Array.from(document.querySelectorAll("[data-mode]")),
    sessionLabel: $("sessionLabel"),
    modeLabel: $("modeLabel"),
    progressBar: $("progressBar"),
    restartButton: $("restartButton"),
    stopButton: $("stopButton"),
    startScreen: $("startScreen"),
    startTitle: $("startTitle"),
    startDescription: $("startDescription"),
    startButton: $("startButton"),
    questionScreen: $("questionScreen"),
    completeScreen: $("completeScreen"),
    questionIndex: $("questionIndex"),
    questionTotal: $("questionTotal"),
    answerTag: $("answerTag"),
    orderTag: $("orderTag"),
    listenTitle: $("listenTitle"),
    listenHint: $("listenHint"),
    playButton: $("playButton"),
    playStatus: $("playStatus"),
    repeatLabel: $("repeatLabel"),
    replayButton: $("replayButton"),
    answerInput: $("answerInput"),
    submitModeHint: $("submitModeHint"),
    submitButton: $("submitButton"),
    nextButton: $("nextButton"),
    result: $("result"),
    resultMark: $("resultMark"),
    resultNote: $("resultNote"),
    correctAnswer: $("correctAnswer"),
    userAnswerRow: $("userAnswerRow"),
    userAnswer: $("userAnswer"),
    completeSummary: $("completeSummary"),
    againButton: $("againButton"),
    reviewWrongButton: $("reviewWrongButton"),
    asideVoice: $("asideVoice"),
    asideCorrect: $("asideCorrect"),
    asideWrong: $("asideWrong"),
    asideRepeat: $("asideRepeat"),
    asideSpeed: $("asideSpeed"),
    asideOrder: $("asideOrder"),
    navWrongCount: $("navWrongCount"),
    wordSearch: $("wordSearch"),
    wordGrid: $("wordGrid"),
    directorySwitch: $("directorySwitch"),
    startWrongRoundButton: $("startWrongRoundButton"),
    startWrongDateRoundButton: $("startWrongDateRoundButton"),
    clearWrongBookButton: $("clearWrongBookButton"),
    wrongBookList: $("wrongBookList"),
    dateProgressLabel: $("dateProgressLabel"),
    dateProgressBar: $("dateProgressBar"),
    dateModeLabel: $("dateModeLabel"),
    restartDateButton: $("restartDateButton"),
    stopDateButton: $("stopDateButton"),
    dateStartScreen: $("dateStartScreen"),
    dateStartTitle: $("dateStartTitle"),
    dateStartDescription: $("dateStartDescription"),
    startDateButton: $("startDateButton"),
    dateQuestionScreen: $("dateQuestionScreen"),
    dateCompleteScreen: $("dateCompleteScreen"),
    dateQuestionIndex: $("dateQuestionIndex"),
    dateQuestionTotal: $("dateQuestionTotal"),
    dateAnswerTag: $("dateAnswerTag"),
    dateListenTitle: $("dateListenTitle"),
    dateListenHint: $("dateListenHint"),
    datePlayButton: $("datePlayButton"),
    datePlayStatus: $("datePlayStatus"),
    dateRepeatLabel: $("dateRepeatLabel"),
    dateReplayButton: $("dateReplayButton"),
    dateAnswerLabel: $("dateAnswerLabel"),
    dateSubmitModeHint: $("dateSubmitModeHint"),
    dateAnswerInput: $("dateAnswerInput"),
    submitDateButton: $("submitDateButton"),
    nextDateButton: $("nextDateButton"),
    dateResult: $("dateResult"),
    dateResultMark: $("dateResultMark"),
    dateResultNote: $("dateResultNote"),
    dateCorrectAnswer: $("dateCorrectAnswer"),
    dateEnglishRow: $("dateEnglishRow"),
    dateEnglishAnswer: $("dateEnglishAnswer"),
    dateUserAnswerRow: $("dateUserAnswerRow"),
    dateUserAnswer: $("dateUserAnswer"),
    dateCompleteSummary: $("dateCompleteSummary"),
    againDateButton: $("againDateButton"),
    weekdayList: $("weekdayList"),
    newCustomButton: $("newCustomButton"),
    customEditor: $("customEditor"),
    customEditorTitle: $("customEditorTitle"),
    closeCustomEditorButton: $("closeCustomEditorButton"),
    customEnglishInput: $("customEnglishInput"),
    customPhoneticInput: $("customPhoneticInput"),
    customChineseInput: $("customChineseInput"),
    customExampleInput: $("customExampleInput"),
    customExampleTranslationInput: $("customExampleTranslationInput"),
    customNoteInput: $("customNoteInput"),
    translateCustomButton: $("translateCustomButton"),
    translateExampleButton: $("translateExampleButton"),
    customSaveStatus: $("customSaveStatus"),
    saveCustomButton: $("saveCustomButton"),
    cancelCustomEditButton: $("cancelCustomEditButton"),
    customProgressLabel: $("customProgressLabel"),
    customModeLabel: $("customModeLabel"),
    restartCustomButton: $("restartCustomButton"),
    stopCustomButton: $("stopCustomButton"),
    customProgressBar: $("customProgressBar"),
    customStartScreen: $("customStartScreen"),
    customStartTitle: $("customStartTitle"),
    customStartDescription: $("customStartDescription"),
    startCustomPracticeButton: $("startCustomPracticeButton"),
    customQuestionScreen: $("customQuestionScreen"),
    customQuestionIndex: $("customQuestionIndex"),
    customQuestionTotal: $("customQuestionTotal"),
    customListenHint: $("customListenHint"),
    customPlayButton: $("customPlayButton"),
    customPlayStatus: $("customPlayStatus"),
    customReplayButton: $("customReplayButton"),
    customSubmitHint: $("customSubmitHint"),
    customAnswerInput: $("customAnswerInput"),
    submitCustomButton: $("submitCustomButton"),
    nextCustomButton: $("nextCustomButton"),
    customResult: $("customResult"),
    customResultMark: $("customResultMark"),
    customResultNote: $("customResultNote"),
    customCorrectAnswer: $("customCorrectAnswer"),
    customCorrectPhonetic: $("customCorrectPhonetic"),
    customCorrectTranslation: $("customCorrectTranslation"),
    customCorrectExample: $("customCorrectExample"),
    customCorrectExampleTranslation: $("customCorrectExampleTranslation"),
    customCorrectNote: $("customCorrectNote"),
    customUserAnswerRow: $("customUserAnswerRow"),
    customUserAnswer: $("customUserAnswer"),
    customCompleteScreen: $("customCompleteScreen"),
    customCompleteSummary: $("customCompleteSummary"),
    againCustomButton: $("againCustomButton"),
    customItemCount: $("customItemCount"),
    customList: $("customList"),
    navHearingWrongCount: $("navHearingWrongCount"),
    reviewDueWordsButton: $("reviewDueWordsButton"),
    reviewAllWordsButton: $("reviewAllWordsButton"),
    hearingWrongSummary: $("hearingWrongSummary"),
    hearingWrongList: $("hearingWrongList"),
    startListeningButton: $("startListeningButton"),
    listeningProgress: $("listeningProgress"),
    listeningSleepStatus: $("listeningSleepStatus"),
    listeningEnglish: $("listeningEnglish"),
    listeningChinese: $("listeningChinese"),
    listeningPreviousButton: $("listeningPreviousButton"),
    listeningPlayButton: $("listeningPlayButton"),
    listeningNextButton: $("listeningNextButton"),
    listeningProgressBar: $("listeningProgressBar"),
    listeningCategories: $("listeningCategories"),
    listeningMode: $("listeningMode"),
    listeningRepeat: $("listeningRepeat"),
    listeningSpeed: $("listeningSpeed"),
    listeningInterval: $("listeningInterval"),
    listeningSleep: $("listeningSleep"),
    githubTokenInput: $("githubTokenInput"),
    syncCodeInput: $("syncCodeInput"),
    createSyncSpaceButton: $("createSyncSpaceButton"),
    connectSyncSpaceButton: $("connectSyncSpaceButton"),
    syncNowButton: $("syncNowButton"),
    copySyncCodeButton: $("copySyncCodeButton"),
    syncAutoToggle: $("syncAutoToggle"),
    syncStatus: $("syncStatus")
  };

  const settings = loadSettings();
  const loadedWrongData = loadWrongData();
  const loadedCustomItems = loadCustomItems();
  const loadedHearingWrong = loadHearingWrong();
  const loadedSyncConfig = loadSyncConfig();
  const state = {
    activeTab: "dictation",
    range: "basic",
    wrongNumbers: loadedWrongData.numbers,
    wrongDates: loadedWrongData.dates,
    customItems: loadedCustomItems,
    customEditorId: null,
    customSession: createEmptyCustomSession(),
    hearingWrong: loadedHearingWrong,
    sync: {
      ...loadedSyncConfig,
      inFlight: false,
      timer: null,
      applyingRemote: false
    },
    session: createEmptySession(),
    dateMode: "phrase",
    dateSession: createEmptyDateSession(),
    directoryMode: "numbers",
    playing: false,
    playingWord: null,
    playingWeekday: null,
    token: 0,
    audio: new Audio(),
    voicePackIndex: {},
    voicePackLoaded: false,
    ipaMap: new Map(),
    ipaLoadPromise: null,
    customAutoTranslation: true,
    customExampleAutoTranslation: true,
    listening: {
      started: false,
      playing: false,
      playlist: [],
      index: 0,
      token: 0,
      audio: null,
      sleepDeadline: 0,
      sleepTimer: null
    },
    autoSubmitTimer: null,
    preloaded: ""
  };

  init();

  function init() {
    state.audio.preload = "auto";
    state.audio.setAttribute("playsinline", "");
    state.listening.audio = new Audio();
    state.listening.audio.preload = "auto";
    state.listening.audio.setAttribute("playsinline", "");
    bindEvents();
    loadVoicePackIndex();
    state.ipaLoadPromise = loadIpaDictionary();
    renderAll();
    if (state.sync.autoSync && state.sync.token && state.sync.gistId) {
      window.setTimeout(() => syncCloudData(false), 1200);
    }
    window.setInterval(() => {
      if (state.sync.autoSync && state.sync.token && state.sync.gistId && !document.hidden) {
        syncCloudData(false);
      }
    }, 120000);
    window.addEventListener("pagehide", () => {
      if (state.sync.autoSync && state.sync.token && state.sync.gistId) syncCloudData(false);
    });
  }

  async function loadIpaDictionary() {
    try {
      const response = await fetch("data/en_UK_ipa.txt", { cache: "force-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const text = await response.text();
      const map = new Map();
      text.split(/\r?\n/).forEach((line) => {
        const [word, phonetic] = line.split("\t");
        if (word && phonetic) map.set(word.trim().toLowerCase(), phonetic.trim());
      });
      state.ipaMap = map;
    } catch (error) {
      console.warn("Could not load IPA dictionary.", error);
    }
  }

  async function loadVoicePackIndex() {
    try {
      const response = await fetch("audio/voice-pack/index.json", { cache: "force-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      state.voicePackIndex = await response.json();
      state.voicePackLoaded = true;
    } catch (error) {
      state.voicePackIndex = {};
      state.voicePackLoaded = false;
    }
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      const loaded = { ...DEFAULT_SETTINGS, ...(raw ? JSON.parse(raw) : {}) };
      if (!["sonia", "ryan", "libby", "mix"].includes(loaded.voice)) loaded.voice = "sonia";
      return loaded;
    } catch (error) {
      console.warn("Could not load settings.", error);
      return { ...DEFAULT_SETTINGS };
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn("Could not save settings.", error);
    }
    scheduleCloudSync();
  }

  function loadWrongData() {
    try {
      const raw = localStorage.getItem(WRONG_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      const numbers = Array.isArray(parsed)
        ? parsed.map(Number)
        : Array.isArray(parsed.numbers)
          ? parsed.numbers.map(Number)
          : [];
      const dates = !Array.isArray(parsed) && Array.isArray(parsed.dates) ? parsed.dates : [];
      return {
        numbers: Array.from(new Set(numbers.filter((number) => number >= 1 && number <= 90000000000))).sort((a, b) => a - b),
        dates: dates.filter((entry) => entry && entry.day && entry.month)
      };
    } catch (error) {
      console.warn("Could not load wrong book.", error);
      return { numbers: [], dates: [] };
    }
  }

  function saveWrongData() {
    try {
      localStorage.setItem(WRONG_KEY, JSON.stringify({
        numbers: state.wrongNumbers,
        dates: state.wrongDates
      }));
    } catch (error) {
      console.warn("Could not save wrong book.", error);
    }
    scheduleCloudSync();
  }

  function loadCustomItems() {
    try {
      const raw = localStorage.getItem(CUSTOM_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter((item) => item && item.text) : [];
    } catch (error) {
      console.warn("Could not load custom vocabulary.", error);
      return [];
    }
  }

  function loadHearingWrong() {
    try {
      const raw = localStorage.getItem(HEARING_WRONG_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter((item) => item && item.text) : [];
    } catch (error) {
      console.warn("Could not load hearing wrong book.", error);
      return [];
    }
  }

  function saveCustomItems() {
    try {
      localStorage.setItem(CUSTOM_KEY, JSON.stringify(state.customItems));
    } catch (error) {
      console.warn("Could not save custom vocabulary.", error);
    }
    scheduleCloudSync();
  }

  function saveHearingWrong() {
    try {
      localStorage.setItem(HEARING_WRONG_KEY, JSON.stringify(state.hearingWrong));
    } catch (error) {
      console.warn("Could not save hearing wrong book.", error);
    }
    scheduleCloudSync();
  }

  function loadSyncConfig() {
    try {
      const raw = localStorage.getItem(SYNC_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return {
        token: String(parsed.token || ""),
        gistId: String(parsed.gistId || ""),
        autoSync: parsed.autoSync !== false,
        lastSyncAt: parsed.lastSyncAt ? Number(parsed.lastSyncAt) : null
      };
    } catch (error) {
      return { token: "", gistId: "", autoSync: true, lastSyncAt: null };
    }
  }

  function saveSyncConfig() {
    try {
      localStorage.setItem(SYNC_KEY, JSON.stringify({
        token: state.sync.token,
        gistId: state.sync.gistId,
        autoSync: state.sync.autoSync,
        lastSyncAt: state.sync.lastSyncAt
      }));
    } catch (error) {
      console.warn("Could not save sync config.", error);
    }
  }

  function scheduleCloudSync() {
    if (!state.sync.autoSync || state.sync.applyingRemote || !state.sync.token || !state.sync.gistId) return;
    if (state.sync.timer) window.clearTimeout(state.sync.timer);
    state.sync.timer = window.setTimeout(() => syncCloudData(false), 1800);
  }

  function syncHeaders() {
    return {
      "Accept": "application/vnd.github+json",
      "Authorization": `Bearer ${state.sync.token}`,
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28"
    };
  }

  function buildSyncSnapshot() {
    return {
      version: 1,
      app: "IZZY IELTS-DICTATION",
      updatedAt: Date.now(),
      settings: { ...settings },
      customItems: state.customItems,
      wrongNumbers: state.wrongNumbers,
      wrongDates: state.wrongDates,
      hearingWrong: state.hearingWrong
    };
  }

  async function oneClickSync() {
    const token = dom.githubTokenInput.value.trim();
    if (!token) {
      dom.githubTokenInput.focus();
      updateSyncStatus("请先填写 GitHub Token，然后点击一键同步。", true);
      return;
    }
    state.sync.token = token;
    state.sync.gistId = dom.syncCodeInput.value.trim();
    saveSyncConfig();
    if (!state.sync.gistId) {
      updateSyncStatus("首次使用，正在创建 PC / 手机同步空间…");
      await createSyncSpace();
      if (!state.sync.gistId) return;
    }
    await syncCloudData(true);
  }

  async function createSyncSpace() {
    const token = dom.githubTokenInput.value.trim();
    if (!token) {
      dom.githubTokenInput.focus();
      updateSyncStatus("请先填写 GitHub Token", true);
      return;
    }
    state.sync.token = token;
    state.sync.gistId = "";
    updateSyncStatus("正在创建同步空间…");
    try {
      const response = await fetch("https://api.github.com/gists", {
        method: "POST",
        headers: syncHeaders(),
        body: JSON.stringify({
          description: "IZZY IELTS-DICTATION Sync",
          public: false,
          files: {
            "izzy-sync.json": {
              content: JSON.stringify(buildSyncSnapshot(), null, 2)
            }
          }
        })
      });
      if (!response.ok) throw new Error(await response.text());
      const gist = await response.json();
      state.sync.gistId = gist.id;
      saveSyncConfig();
      dom.syncCodeInput.value = gist.id;
      state.sync.lastSyncAt = Date.now();
      updateSyncStatus("同步空间已创建，可在另一台设备输入同步码连接。");
    } catch (error) {
      updateSyncStatus(`创建失败：${String(error.message || error).slice(0, 120)}`, true);
    }
  }

  async function connectSyncSpace() {
    const token = dom.githubTokenInput.value.trim();
    const gistId = dom.syncCodeInput.value.trim();
    if (!token || !gistId) {
      updateSyncStatus("Token 和同步码都不能为空", true);
      return;
    }
    state.sync.token = token;
    state.sync.gistId = gistId;
    saveSyncConfig();
    await syncCloudData(true);
  }

  async function syncCloudData(manual = true) {
    if (state.sync.inFlight) return;
    if (!state.sync.token || !state.sync.gistId) {
      if (manual) updateSyncStatus("请先创建同步空间，或输入另一台设备的同步码连接。", true);
      return;
    }
    state.sync.inFlight = true;
    updateSyncStatus("正在同步数据…");
    try {
      const response = await fetch(`https://api.github.com/gists/${state.sync.gistId}`, {
        headers: syncHeaders(),
        cache: "no-store"
      });
      if (!response.ok) throw new Error(await response.text());
      const gist = await response.json();
      const file = gist.files?.["izzy-sync.json"] || Object.values(gist.files || {})[0];
      const remote = file?.content ? JSON.parse(file.content) : null;
      const merged = mergeSyncSnapshots(buildSyncSnapshot(), remote);
      applySyncSnapshot(merged);
      await writeSyncSnapshot(merged);
      state.sync.lastSyncAt = Date.now();
      saveSyncConfig();
      updateSyncStatus(`同步完成 · ${new Date().toLocaleTimeString("zh-CN")}`);
    } catch (error) {
      updateSyncStatus(`同步失败：${String(error.message || error).slice(0, 120)}`, true);
    } finally {
      state.sync.inFlight = false;
    }
  }

  async function writeSyncSnapshot(snapshot) {
    const response = await fetch(`https://api.github.com/gists/${state.sync.gistId}`, {
      method: "PATCH",
      headers: syncHeaders(),
      body: JSON.stringify({
        files: { "izzy-sync.json": { content: JSON.stringify(snapshot, null, 2) } }
      })
    });
    if (!response.ok) throw new Error(await response.text());
  }

  function mergeSyncSnapshots(local, remote) {
    if (!remote) return local;
    const newer = Number(remote.updatedAt || 0) > Number(local.updatedAt || 0);
    const mergeById = (a = [], b = [], dateField = "updatedAt") => {
      const map = new Map();
      [...a, ...b].forEach((item) => {
        if (!item?.id) return;
        const current = map.get(item.id);
        const currentTime = Number(current?.[dateField] || current?.createdAt || 0);
        const nextTime = Number(item?.[dateField] || item?.createdAt || 0);
        if (!current || nextTime >= currentTime) map.set(item.id, item);
      });
      return Array.from(map.values());
    };
    const mergeDateWrong = (a = [], b = []) => {
      const map = new Map();
      [...a, ...b].forEach((item) => {
        if (!item?.key) return;
        const old = map.get(item.key);
        if (!old || Number(item.createdAt || 0) >= Number(old.createdAt || 0)) map.set(item.key, item);
      });
      return Array.from(map.values());
    };
    return {
      version: 1,
      updatedAt: Date.now(),
      settings: newer ? { ...local.settings, ...remote.settings } : local.settings,
      customItems: mergeById(local.customItems, remote.customItems),
      hearingWrong: mergeById(local.hearingWrong, remote.hearingWrong, "lastReviewedAt"),
      wrongNumbers: Array.from(new Set([...(local.wrongNumbers || []), ...(remote.wrongNumbers || [])])).sort((a, b) => a - b),
      wrongDates: mergeDateWrong(local.wrongDates, remote.wrongDates)
    };
  }

  function applySyncSnapshot(snapshot) {
    if (!snapshot) return;
    state.sync.applyingRemote = true;
    Object.assign(settings, snapshot.settings || {});
    state.customItems = snapshot.customItems || [];
    state.hearingWrong = snapshot.hearingWrong || [];
    state.wrongNumbers = snapshot.wrongNumbers || [];
    state.wrongDates = snapshot.wrongDates || [];
    saveSettings();
    saveCustomItems();
    saveHearingWrong();
    saveWrongData();
    state.sync.applyingRemote = false;
    renderAll();
  }

  function updateSyncStatus(message, isError = false) {
    if (!dom.syncStatus) return;
    dom.syncStatus.textContent = message;
    dom.syncStatus.style.color = isError ? "var(--signal)" : "var(--muted)";
  }

  function renderSyncStatus() {
    if (!dom.githubTokenInput) return;
    dom.githubTokenInput.value = state.sync.token || "";
    dom.syncCodeInput.value = state.sync.gistId || "";
    dom.syncAutoToggle.checked = state.sync.autoSync !== false;
    updateSyncStatus(
      state.sync.gistId
        ? `已连接同步码 ${state.sync.gistId.slice(0, 10)}…${state.sync.lastSyncAt ? ` · 上次同步 ${new Date(state.sync.lastSyncAt).toLocaleTimeString("zh-CN")}` : ""}`
        : "尚未连接同步空间"
    );
  }

  function createEmptyCustomSession() {
    return {
      started: false,
      complete: false,
      checked: false,
      source: "all",
      items: [],
      index: 0,
      answered: 0,
      correct: 0
    };
  }

  function createEmptySession() {
    return {
      started: false,
      complete: false,
      checked: false,
      source: "normal",
      numbers: [],
      index: 0,
      answered: 0,
      correct: 0
    };
  }

  function createEmptyDateSession() {
    return {
      started: false,
      complete: false,
      checked: false,
      items: [],
      index: 0,
      answered: 0,
      correct: 0
    };
  }

  function bindEvents() {
    dom.tabs.forEach((button) => {
      button.addEventListener("click", () => switchTab(button.dataset.tab));
    });
    dom.modeButtons.forEach((button) => {
      button.addEventListener("click", () => selectMode(button.dataset.mode));
    });
    dom.settingsButton.addEventListener("click", openSettings);
    dom.closeSettingsButton.addEventListener("click", closeSettings);
    dom.settingsDrawer.addEventListener("click", (event) => {
      if (event.target === dom.settingsDrawer) closeSettings();
    });

    dom.rangeButtons.forEach((button) => {
      button.addEventListener("click", () => selectRange(button.dataset.range));
    });
    dom.dateModeButtons.forEach((button) => {
      button.addEventListener("click", () => selectDateMode(button.dataset.dateMode));
    });
    document.querySelectorAll("[data-subtab]").forEach((button) => {
      button.addEventListener("click", () => switchTab(button.dataset.subtab));
    });
    bindOptionGroup(dom.speedOptions, "speed", (value) => {
      settings.speed = value;
      saveSettings();
      applyPlaybackRate();
      renderSettings();
      renderSessionCopy();
    });
    bindOptionGroup(dom.dateOrderOptions, "dateOrder", (value) => {
      settings.dateOrder = value;
      saveSettings();
      renderSettings();
      renderDateSession();
    });
    bindOptionGroup(dom.voiceOptions, "voice", (value) => {
      settings.voice = value;
      saveSettings();
      renderSettings();
      state.preloaded = "";
      renderSessionCopy();
    });
    bindOptionGroup(dom.submitOptions, "submit", (value) => {
      settings.submitMode = value;
      saveSettings();
      renderSettings();
      renderSessionCopy();
    });
    bindOptionGroup(dom.repeatOptions, "repeat", (value) => {
      settings.repeat = value;
      saveSettings();
      renderSettings();
      renderSessionCopy();
    });
    bindOptionGroup(dom.orderOptions, "order", (value) => {
      settings.order = value;
      saveSettings();
      renderSettings();
      renderSessionCopy();
    });

    dom.startButton.addEventListener("click", () => startRound());
    dom.restartButton.addEventListener("click", () => startRound());
    dom.againButton.addEventListener("click", () => startRound());
    dom.reviewWrongButton.addEventListener("click", () => switchTab("wrong"));
    dom.playButton.addEventListener("click", () => {
      if (state.playing) stopPlayback();
      else playCurrent();
    });
    dom.replayButton.addEventListener("click", playCurrent);
    dom.stopButton.addEventListener("click", stopPlayback);
    dom.submitButton.addEventListener("click", () => submitAnswer(false));
    dom.nextButton.addEventListener("click", () => goNext(true));
    dom.answerInput.addEventListener("input", handleAnswerInput);
    dom.answerInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      if (state.session.checked) goNext(true);
      else submitAnswer(false);
    });

    dom.wordSearch.addEventListener("input", renderWordDirectory);
    dom.directorySwitch.addEventListener("click", (event) => {
      const button = event.target.closest("[data-directory]");
      if (!button) return;
      state.directoryMode = button.dataset.directory;
      renderWordDirectory();
    });
    dom.wordGrid.addEventListener("click", (event) => {
      const card = event.target.closest("[data-directory-item]");
      if (!card) return;
      if (card.dataset.number) playDirectoryNumber(Number(card.dataset.number));
      else playDirectoryText(card.dataset.audioText, card.dataset.audioKey);
    });
    dom.startDateButton.addEventListener("click", () => startDateRound());
    dom.restartDateButton.addEventListener("click", () => startDateRound());
    dom.againDateButton.addEventListener("click", () => startDateRound());
    dom.datePlayButton.addEventListener("click", () => {
      if (state.playing) stopPlayback();
      else playCurrentDate();
    });
    dom.dateReplayButton.addEventListener("click", playCurrentDate);
    dom.stopDateButton.addEventListener("click", stopPlayback);
    dom.submitDateButton.addEventListener("click", () => submitDateAnswer(false));
    dom.nextDateButton.addEventListener("click", () => goNextDate(true));
    dom.dateAnswerInput.addEventListener("input", handleDateInput);
    dom.dateAnswerInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      if (state.dateSession.checked) goNextDate(true);
      else submitDateAnswer(false);
    });
    dom.weekdayList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-weekday]");
      if (button) playWeekday(button.dataset.weekday);
    });
    dom.newCustomButton.addEventListener("click", () => openCustomEditor());
    dom.closeCustomEditorButton.addEventListener("click", closeCustomEditor);
    dom.cancelCustomEditButton.addEventListener("click", closeCustomEditor);
    dom.translateCustomButton.addEventListener("click", translateCustomText);
    dom.translateExampleButton.addEventListener("click", translateExampleText);
    dom.saveCustomButton.addEventListener("click", saveCustomItem);
    dom.customEnglishInput.addEventListener("input", () => {
      state.customAutoTranslation = true;
      scheduleCustomAutoFill();
    });
    dom.customChineseInput.addEventListener("input", () => {
      state.customAutoTranslation = false;
    });
    dom.customExampleInput.addEventListener("input", () => {
      state.customExampleAutoTranslation = true;
      scheduleCustomAutoFill();
    });
    dom.customExampleTranslationInput.addEventListener("input", () => {
      state.customExampleAutoTranslation = false;
    });
    dom.startCustomPracticeButton.addEventListener("click", () => startCustomPractice());
    dom.restartCustomButton.addEventListener("click", () => startCustomPractice());
    dom.againCustomButton.addEventListener("click", () => startCustomPractice());
    dom.customPlayButton.addEventListener("click", () => {
      if (state.playing) stopPlayback();
      else playCurrentCustom();
    });
    dom.customReplayButton.addEventListener("click", playCurrentCustom);
    dom.stopCustomButton.addEventListener("click", stopPlayback);
    dom.submitCustomButton.addEventListener("click", () => submitCustomAnswer(false));
    dom.nextCustomButton.addEventListener("click", () => goNextCustom(true));
    dom.customAnswerInput.addEventListener("input", handleCustomInput);
    dom.customAnswerInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      if (state.customSession.checked) goNextCustom(true);
      else submitCustomAnswer(false);
    });
    dom.customEnglishInput.addEventListener("input", () => {
      if (dom.customChineseInput.value.trim()) return;
    });
    dom.reviewDueWordsButton.addEventListener("click", () => startHearingReview("due"));
    dom.reviewAllWordsButton.addEventListener("click", () => startHearingReview("all"));
    dom.customList.addEventListener("click", handleCustomListClick);
    dom.hearingWrongList.addEventListener("click", handleHearingWrongClick);

    dom.createSyncSpaceButton.addEventListener("click", createSyncSpace);
    dom.connectSyncSpaceButton.addEventListener("click", connectSyncSpace);
    dom.syncNowButton.addEventListener("click", oneClickSync);
    dom.copySyncCodeButton.addEventListener("click", async () => {
      const code = dom.syncCodeInput.value.trim();
      if (!code) return;
      try {
        await navigator.clipboard.writeText(code);
        updateSyncStatus("同步码已复制，可发送到另一台设备输入。");
      } catch (error) {
        updateSyncStatus(`同步码：${code}`);
      }
    });
    dom.syncAutoToggle.addEventListener("change", () => {
      state.sync.autoSync = dom.syncAutoToggle.checked;
      saveSyncConfig();
      if (state.sync.autoSync) scheduleCloudSync();
    });

    dom.startListeningButton.addEventListener("click", startListening);
    dom.listeningPlayButton.addEventListener("click", toggleListeningPlayback);
    dom.listeningPreviousButton.addEventListener("click", () => changeListeningIndex(-1));
    dom.listeningNextButton.addEventListener("click", () => changeListeningIndex(1));
    dom.listeningSleep.addEventListener("change", configureSleepTimer);
    dom.listeningSpeed.addEventListener("change", () => {
      if (state.listening.audio) state.listening.audio.playbackRate = Number(dom.listeningSpeed.value) || 1;
    });

    dom.startWrongRoundButton.addEventListener("click", startWrongRound);
    dom.startWrongDateRoundButton.addEventListener("click", startWrongDateRound);
    dom.clearWrongBookButton.addEventListener("click", clearWrongBook);
    dom.wrongBookList.addEventListener("click", handleWrongBookClick);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !dom.settingsDrawer.hidden) {
        closeSettings();
        return;
      }
      if (
        event.key === "Tab"
        && dom.settingsDrawer.hidden
        && !event.metaKey
        && !event.ctrlKey
        && !event.altKey
      ) {
        if (state.activeTab === "dictation" && state.session.started && !state.session.complete) {
          event.preventDefault();
          playCurrent();
          return;
        }
        if (state.activeTab === "dates" && state.dateSession.started && !state.dateSession.complete) {
          event.preventDefault();
          playCurrentDate();
        }
      }
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopPlayback();
      if (!document.hidden && state.sync.autoSync && state.sync.token && state.sync.gistId) {
        syncCloudData(false);
      }
    });
  }

  function bindOptionGroup(container, attribute, handler) {
    const selectorAttribute = attribute.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
    container.addEventListener("click", (event) => {
      const button = event.target.closest(`[data-${selectorAttribute}]`);
      if (!button) return;
      const raw = button.getAttribute(`data-${selectorAttribute}`);
      const value = attribute === "speed" || attribute === "repeat" ? Number(raw) : raw;
      handler(value);
    });
  }

  function renderAll() {
    renderTabs();
    renderRangeButtons();
    renderModeButtons();
    renderSettings();
    renderSession();
    renderDateSession();
    renderWeekdays();
    renderListening();
    renderCustom();
    renderWordDirectory();
    renderWrongBook();
    renderHearingWrong();
  }

  function switchTab(tab) {
    if (!["dictation", "dates", "listening", "custom", "words", "wrong", "hearingwrong"].includes(tab)) return;
    if (["dictation", "dates"].includes(state.activeTab) && tab !== state.activeTab) stopPlayback();
    state.activeTab = tab;
    renderTabs();
    if (tab === "dates") renderDateSession();
    if (tab === "listening") renderListening();
    if (tab === "custom") renderCustom();
    if (tab === "words") renderWordDirectory();
    if (tab === "wrong") renderWrongBook();
    if (tab === "hearingwrong") renderHearingWrong();
  }

  function renderTabs() {
    dom.tabs.forEach((button) => button.classList.toggle("is-active", button.dataset.tab === state.activeTab));
    dom.panels.forEach((panel) => panel.classList.toggle("is-active", panel.dataset.panel === state.activeTab));
  }

  function selectRange(range) {
    if (!RANGE_CONFIG[range] || state.range === range) return;
    state.range = range;
    state.session = createEmptySession();
    stopPlayback();
    renderRangeButtons();
    renderSessionCopy();
    renderSession();
  }

  function renderRangeButtons() {
    dom.rangeButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.range === state.range));
  }

  function rangeLabel(range) {
    return {
      basic: "1–100",
      hundreds: "100–1,000",
      thousands: "1,000–10,000",
      large: "1–90 billion"
    }[range] || "1–100";
  }

  function selectMode(mode) {
    if (!["english", "digits"].includes(mode)) return;
    if (settings.mode === mode) return;
    settings.mode = mode;
    saveSettings();
    state.session = createEmptySession();
    stopPlayback();
    renderModeButtons();
    renderSessionCopy();
    renderSession();
  }

  function renderModeButtons() {
    dom.modeButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.mode === settings.mode));
  }

  function renderSettings() {
    setActiveOption(dom.speedOptions, "speed", String(settings.speed));
    setActiveOption(dom.voiceOptions, "voice", settings.voice);
    setActiveOption(dom.submitOptions, "submit", settings.submitMode);
    setActiveOption(dom.repeatOptions, "repeat", String(settings.repeat));
    setActiveOption(dom.orderOptions, "order", settings.order);
    setActiveOption(dom.dateOrderOptions, "dateOrder", settings.dateOrder || "sequence");
  }

  function setActiveOption(container, attribute, value) {
    const selectorAttribute = attribute.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
    container.querySelectorAll(`[data-${selectorAttribute}]`).forEach((button) => {
      button.classList.toggle("is-active", button.getAttribute(`data-${selectorAttribute}`) === value);
    });
  }

  function openSettings() {
    dom.settingsDrawer.hidden = false;
  }

  function closeSettings() {
    dom.settingsDrawer.hidden = true;
  }

  function renderSessionCopy() {
    const isWrong = state.session.source === "wrong";
    const answerMode = isWrong ? "digits" : settings.mode;
    const isEnglish = answerMode === "english";
    const range = RANGE_CONFIG[state.range] || RANGE_CONFIG.basic;
    const randomRange = state.range !== "basic";
    const isShuffle = randomRange || (answerMode === "digits" && settings.order === "shuffle" && !isWrong);
    const voiceName = {
      sonia: "Sonia 神经女声",
      ryan: "Ryan 神经男声",
      libby: "Libby 神经女声",
      mix: "男女混播"
    }[settings.voice] || "Sonia 神经女声";

    dom.submitModeHint.textContent = settings.submitMode === "auto" ? "自动提交 · 停笔约 1 秒" : "手动提交";
    dom.repeatLabel.textContent = `播放 ${settings.repeat} 遍 · ${formatSpeed(settings.speed)}`;
    dom.asideRepeat.textContent = `${settings.repeat} 遍`;
    dom.asideSpeed.textContent = formatSpeed(settings.speed);
    dom.asideOrder.textContent = isShuffle ? "随机" : "顺序";

    if (isWrong) {
      dom.modeLabel.textContent = "错题重练 · 阿拉伯数字";
      dom.answerTag.textContent = "阿拉伯数字";
      dom.orderTag.textContent = "错题重练";
      dom.listenTitle.textContent = "听音后填写阿拉伯数字";
      dom.listenHint.textContent = "错题本只练阿拉伯数字。大数字可输入纯数字，不要求逗号。按 Tab 可重播。";
      dom.answerInput.placeholder = "填写数字";
      dom.answerInput.inputMode = "numeric";
      dom.startTitle.textContent = "错题重练";
      dom.startDescription.textContent = "错题重练固定填写阿拉伯数字。答对后会自动移出错题本。";
    } else if (isEnglish) {
      dom.modeLabel.textContent = `${rangeLabel(state.range)} · 英文拼写`;
      dom.answerTag.textContent = "英文拼写";
      dom.orderTag.textContent = randomRange ? "每次随机 100 题" : "顺序播报";
      dom.listenTitle.textContent = "听音后填写英文";
      dom.listenHint.textContent = randomRange
        ? "英文读法不使用 and 连接词，hundred、thousand、million、billion 按英语数位分组。按 Tab 可重播。"
        : "例如听到 thirteen，请填写 thirteen。按 Tab 可重播。";
      dom.answerInput.placeholder = "填写英文";
      dom.answerInput.inputMode = "text";
      dom.startTitle.textContent = randomRange
        ? `从 ${rangeLabel(state.range)} 随机抽取 100 个数字拼英文`
        : "从 1 到 100，按顺序拼写英文";
      dom.startDescription.textContent = randomRange
        ? "每次打开或重新开始都会重新抽取不同数字。重点训练 hundred、thousand、million 和 billion 的数位边界。"
        : "点击开始后使用英式语音播报。提交后光标会留在输入框，按 Enter 进入下一题。";
    } else {
      dom.modeLabel.textContent = `${rangeLabel(state.range)} · 阿拉伯数字`;
      dom.answerTag.textContent = "阿拉伯数字";
      dom.orderTag.textContent = randomRange ? "每次随机 100 题" : (isShuffle ? "乱序播报" : "顺序播报");
      dom.listenTitle.textContent = "听音后填写阿拉伯数字";
      dom.listenHint.textContent = "只需要输入纯数字，逗号可以省略。按 Tab 可重播。";
      dom.answerInput.placeholder = "填写数字";
      dom.answerInput.inputMode = "numeric";
      dom.startTitle.textContent = randomRange
        ? `从 ${rangeLabel(state.range)} 随机的 100 个数字`
        : (isShuffle ? "打乱 1 到 100，拼写阿拉伯数字" : "从 1 到 100，按顺序拼写阿拉伯数字");
      dom.startDescription.textContent = randomRange
        ? "每次打开或重新开始都会重新抽取不同数字。这一范围不按顺序播报。"
        : "顺序可以在右上角设置中切换。提交后光标会留在输入框，下一题仍由你手动进入。";
    }
    dom.asideVoice.textContent = voiceName;
  }

  function formatSpeed(value) {
    return Number(value).toFixed(2).replace(/0$/, "") + "×";
  }

  function renderSession() {
    renderSessionCopy();
    const session = state.session;
    const total = session.numbers.length;
    const current = currentNumber();

    dom.progressBar.style.width = total
      ? `${session.checked ? ((session.index + 1) / total) * 100 : (session.index / total) * 100}%`
      : "0%";
    dom.restartButton.disabled = !session.started;
    dom.stopButton.disabled = !state.playing;
    dom.asideCorrect.textContent = String(session.correct);
    dom.asideWrong.textContent = String(session.answered - session.correct);
    dom.playButton.classList.toggle("is-playing", state.playing);

    if (!session.started) {
      dom.startScreen.hidden = false;
      dom.questionScreen.hidden = true;
      dom.completeScreen.hidden = true;
      dom.sessionLabel.textContent = "本轮 0 / 100";
      return;
    }

    if (session.complete) {
      dom.startScreen.hidden = true;
      dom.questionScreen.hidden = true;
      dom.completeScreen.hidden = false;
      dom.completeSummary.textContent = `共 ${session.answered} 题，正确 ${session.correct} 题。`;
      dom.sessionLabel.textContent = `本轮 ${total} / ${total}`;
      dom.progressBar.style.width = "100%";
      return;
    }

    if (current === null) {
      finishRound();
      return;
    }

    dom.startScreen.hidden = true;
    dom.completeScreen.hidden = true;
    dom.questionScreen.hidden = false;
    dom.questionIndex.textContent = String(session.index + 1).padStart(2, "0");
    dom.questionTotal.textContent = `/ ${String(total).padStart(3, "0")}`;
    dom.sessionLabel.textContent = `本轮 ${session.index + 1} / ${total}`;
    dom.answerInput.disabled = false;
    dom.answerInput.readOnly = session.checked;
    dom.submitButton.hidden = session.checked;
    dom.nextButton.hidden = !session.checked;
    dom.nextButton.textContent = session.index === total - 1 ? "完成本轮" : "下一题";
    if (!state.playing) dom.playStatus.textContent = session.checked ? "本题已提交" : "按播放键开始";
    if (!session.checked) preloadCurrent();
  }

  function selectDateMode(mode) {
    if (!["phrase", "day-number"].includes(mode) || state.dateMode === mode) return;
    state.dateMode = mode;
    state.dateSession = createEmptyDateSession();
    stopPlayback();
    renderDateSession();
  }

  function renderDateSession() {
    const session = state.dateSession;
    const mode = state.dateMode;
    const total = session.items.length;
    const item = currentDateItem();

    dom.dateModeButtons.forEach((button) => button.classList.toggle("is-active", button.dataset.dateMode === mode));
    dom.dateModeLabel.textContent = mode === "phrase" ? "月日英文" : `日期数字 · ${settings.dateOrder === "shuffle" ? "乱序" : "顺序"}`;
    dom.dateAnswerTag.textContent = mode === "phrase" ? "英文 + 数字" : "阿拉伯数字";
    dom.dateAnswerLabel.textContent = mode === "phrase" ? "星期 + 日号 + 月份" : "日号";
    dom.dateSubmitModeHint.textContent = settings.submitMode === "auto" ? "自动提交 · 停笔约 1 秒" : "手动提交";
    dom.dateRepeatLabel.textContent = `播放 ${settings.repeat} 遍 · ${formatSpeed(settings.speed)}`;
    dom.restartDateButton.disabled = !session.started;
    dom.stopDateButton.disabled = !state.playing;
    dom.datePlayButton.classList.toggle("is-playing", state.playing && state.playingWeekday === null);
    dom.dateProgressBar.style.width = total
      ? `${session.checked ? ((session.index + 1) / total) * 100 : (session.index / total) * 100}%`
      : "0%";

    if (mode === "phrase") {
      dom.dateStartTitle.textContent = "听完整日期，填写星期、阿拉伯日号和月份";
      dom.dateStartDescription.textContent = "例如听到 “Saturday, the fourth of February”，填写 “Saturday, 4 February”。星期和月份用英文，只有日号写阿拉伯数字。";
      dom.dateListenTitle.textContent = "听音后填写混合日期";
      dom.dateListenHint.textContent = "格式：Saturday, 4 February。星期和月份用英文，日号用阿拉伯数字。按 Tab 可重播。";
      dom.dateAnswerInput.placeholder = "例如 Saturday, 4 February";
      dom.dateAnswerInput.inputMode = "text";
    } else {
      dom.dateStartTitle.textContent = "听英文序数，填写阿拉伯数字";
      dom.dateStartDescription.textContent = "从 1 号到 31 号播报，比如 “the twenty-seventh”，填写 27。";
      dom.dateListenTitle.textContent = "听音后填写阿拉伯数字";
      dom.dateListenHint.textContent = "只需要填写 1–31 的数字，不要求填写月份。按 Tab 可重播。";
      dom.dateAnswerInput.placeholder = "填写数字，例如 27";
      dom.dateAnswerInput.inputMode = "numeric";
    }

    if (!session.started) {
      dom.dateStartScreen.hidden = false;
      dom.dateQuestionScreen.hidden = true;
      dom.dateCompleteScreen.hidden = true;
      dom.dateProgressLabel.textContent = mode === "phrase" ? "日期听写 0 / 100" : "日期听写 0 / 31";
      return;
    }

    if (session.complete || !total) {
      dom.dateStartScreen.hidden = true;
      dom.dateQuestionScreen.hidden = true;
      dom.dateCompleteScreen.hidden = false;
      dom.dateCompleteSummary.textContent = `共 ${session.answered} 题，正确 ${session.correct} 题。`;
      dom.dateProgressLabel.textContent = `日期听写 ${total} / ${total}`;
      dom.dateProgressBar.style.width = "100%";
      return;
    }

    if (!item) {
      finishDateRound();
      return;
    }

    dom.dateStartScreen.hidden = true;
    dom.dateCompleteScreen.hidden = true;
    dom.dateQuestionScreen.hidden = false;
    dom.dateQuestionIndex.textContent = String(session.index + 1).padStart(2, "0");
    dom.dateQuestionTotal.textContent = `/ ${String(total).padStart(3, "0")}`;
    dom.dateProgressLabel.textContent = `日期听写 ${session.index + 1} / ${total}`;
    dom.dateAnswerInput.disabled = false;
    dom.dateAnswerInput.readOnly = session.checked;
    dom.submitDateButton.hidden = session.checked;
    dom.nextDateButton.hidden = !session.checked;
    dom.nextDateButton.textContent = session.index === total - 1 ? "完成本轮" : "下一题";
    if (!state.playing || state.playingWeekday !== null) dom.datePlayStatus.textContent = session.checked ? "本题已提交" : "按播放键开始";
    if (!session.checked) preloadCurrentDate();
  }

  function buildDateExamples() {
    const examples = [];
    const seen = new Set();
    const daysPool = [1, 2, 3, 4, 5, 10, 11, 12, 13, 14, 15, 20, 21, 22, 23, 24, 25, 30, 31];
    let cursor = 0;
    while (examples.length < 100) {
      const monthIndex = cursor % 12;
      const round = Math.floor(cursor / 12);
      const monthDays = new Date(Date.UTC(2026, monthIndex + 1, 0)).getUTCDate();
      let day = Math.min(daysPool[(round * 3 + monthIndex) % daysPool.length], monthDays);
      while (seen.has(`${monthIndex}-${day}`) && day > 1) day -= 1;
      const key = `${monthIndex}-${day}`;
      if (!seen.has(key)) {
        seen.add(key);
        const date = new Date(Date.UTC(2026, monthIndex, day));
        const weekday = WEEKDAYS[(date.getUTCDay() + 6) % 7].en;
        const month = MONTHS[monthIndex];
        examples.push({
          weekday,
          day,
          month,
          monthIndex,
          audioText: `${weekday}, the ${ordinalEnglish(day)} of ${month}`,
          answer: `${weekday}, ${day} ${month}`,
          englishAnswer: `${weekday}, the ${ordinalEnglish(day)} of ${month}`
        });
      }
      cursor += 1;
    }
    return examples;
  }

  function ordinalEnglish(day) {
    const ones = ["", "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth",
      "eleventh", "twelfth", "thirteenth", "fourteenth", "fifteenth", "sixteenth", "seventeenth", "eighteenth", "nineteenth"];
    if (day <= 19) return ones[day];
    if (day === 20) return "twentieth";
    if (day === 30) return "thirtieth";
    return `${day < 30 ? "twenty" : "thirty"}-${ones[day % 10]}`;
  }

  function startDateRound(customItems = null, source = "normal", modeOverride = null) {
    stopListening();
    stopPlayback();
    if (modeOverride) state.dateMode = modeOverride;
    const wrongRetry = source === "wrong" && Array.isArray(customItems) && customItems.length > 0;
    let items;
    if (wrongRetry) {
      items = customItems.map((entry) => ({ ...entry }));
    } else if (state.dateMode === "phrase") {
      items = shuffle(buildDateExamples());
    } else {
      let days = Array.from({ length: 31 }, (_, index) => index + 1);
      if (settings.dateOrder === "shuffle") days = shuffle(days);
      items = days.map((day) => {
        return {
          day,
          audioText: `the ${ordinalEnglish(day)}`,
          answer: String(day),
          englishAnswer: `the ${ordinalEnglish(day)}`
        };
      });
    }
    state.dateSession = {
      started: true,
      complete: false,
      checked: false,
      source: wrongRetry ? "wrong" : "normal",
      items,
      index: 0,
      answered: 0,
      correct: 0
    };
    dom.dateAnswerInput.value = "";
    dom.dateResult.hidden = true;
    dom.dateResult.classList.remove("is-wrong");
    dom.dateUserAnswerRow.hidden = true;
    dom.dateEnglishRow.hidden = true;
    renderDateSession();
    window.setTimeout(() => {
      dom.dateAnswerInput.focus();
      playCurrentDate();
    }, 120);
  }

  function currentDateItem() {
    return state.dateSession.items[state.dateSession.index] || null;
  }

  function handleDateInput() {
    clearAutoSubmit();
    if (state.dateSession.checked || settings.submitMode !== "auto") return;
    const answer = dom.dateAnswerInput.value.trim();
    if (!answer) return;
    if (isExactDateAnswer(answer)) {
      submitDateAnswer(true);
      return;
    }
    state.autoSubmitTimer = window.setTimeout(() => submitDateAnswer(true), 1200);
  }

  function isExactDateAnswer(answer) {
    const item = currentDateItem();
    if (!item) return false;
    if (state.dateMode === "phrase") {
      return normalizeMixedDate(answer) === normalizeMixedDate(item.answer)
        || normalizeMixedDate(answer) === normalizeMixedDate(item.englishAnswer);
    }
    return isDayAnswerCorrect(answer, item);
  }

  function isDayAnswerCorrect(answer, item) {
    const numbers = String(answer || "").match(/\d+/g)?.map(Number) || [];
    if (!numbers.length) return false;
    if (numbers.length === 1) return numbers[0] === Number(item.day);
    return numbers[0] === Number(item.day) || numbers[numbers.length - 1] === Number(item.day);
  }

  function submitDateAnswer(automatic) {
    const item = currentDateItem();
    if (!item || state.dateSession.checked) return;
    const answer = dom.dateAnswerInput.value.trim();
    if (!answer) {
      if (!automatic) {
        dom.datePlayStatus.textContent = "请先填写答案";
        dom.dateAnswerInput.focus();
      }
      return;
    }

    clearAutoSubmit();
    stopPlayback();
    const result = compareDateAnswer(answer, item);
    state.dateSession.checked = true;
    state.dateSession.answered += 1;
    if (result.correct) {
      state.dateSession.correct += 1;
      removeWrongDate(item);
    } else {
      addWrongDate(item);
    }
    dom.dateResult.hidden = false;
    dom.dateResult.classList.toggle("is-wrong", !result.correct);
    dom.dateResultMark.textContent = result.correct ? "正确" : "需要再练";
    dom.dateResultNote.textContent = result.note;
    dom.dateCorrectAnswer.textContent = item.answer;
    dom.dateEnglishAnswer.textContent = item.englishAnswer;
    dom.dateEnglishRow.hidden = false;
    dom.dateUserAnswer.textContent = answer;
    dom.dateUserAnswerRow.hidden = result.correct;
    renderDateSession();
    window.setTimeout(() => dom.dateAnswerInput.focus(), 30);
  }

  function compareDateAnswer(answer, item) {
    if (state.dateMode === "phrase") {
      const correct = normalizeMixedDate(answer) === normalizeMixedDate(item.answer)
        || normalizeMixedDate(answer) === normalizeMixedDate(item.englishAnswer);
      return {
        correct,
        note: correct ? "星期、日号和月份正确" : `正确格式是 ${item.answer}`
      };
    }
    const correct = isDayAnswerCorrect(answer, item);
    return {
      correct,
      note: correct ? "阿拉伯日号正确" : `正确日号是 ${item.day}`
    };
  }

  function normalizeMixedDate(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[-–—,，.]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function normalizeDatePhrase(value) {
    let text = String(value || "")
      .toLowerCase()
      .replace(/[-–—]/g, " ")
      .replace(/[^a-z\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    WEEKDAYS.forEach((weekday) => {
      text = text.replace(new RegExp(`\b${weekday.en.toLowerCase()}\b`, "g"), " ");
    });
    return text.replace(/\bthe\b/g, " ").replace(/\s+/g, " ").trim();
  }

  function goNextDate(autoPlay) {
    if (!state.dateSession.started || state.dateSession.complete) return;
    if (state.dateSession.index >= state.dateSession.items.length - 1) {
      finishDateRound();
      return;
    }
    stopPlayback();
    state.dateSession.index += 1;
    state.dateSession.checked = false;
    dom.dateAnswerInput.value = "";
    dom.dateResult.hidden = true;
    dom.dateResult.classList.remove("is-wrong");
    dom.dateUserAnswerRow.hidden = true;
    dom.dateEnglishRow.hidden = true;
    renderDateSession();
    dom.dateAnswerInput.focus();
    if (autoPlay) window.setTimeout(playCurrentDate, 150);
  }

  function finishDateRound() {
    stopPlayback();
    state.dateSession.complete = true;
    renderDateSession();
  }

  function preloadCurrentDate() {
    const item = currentDateItem();
    if (!item || state.playing) return;
    const source = getTextAudioSource(item.audioText);
    if (state.preloaded === source) return;
    state.preloaded = source;
    state.audio.src = source;
    state.audio.load();
  }

  async function playCurrentDate() {
    stopListening();
    const item = currentDateItem();
    if (!item) return;
    stopPlayback();
    const token = ++state.token;
    setPlaying(true);
    await wait(50);
    try {
      for (let index = 0; index < settings.repeat; index += 1) {
        if (token !== state.token) return;
        dom.datePlayStatus.textContent = `正在播放第 ${index + 1} / ${settings.repeat} 遍`;
        await playAudio(getTextAudioSource(item.audioText), token);
        if (token !== state.token) return;
        if (index < settings.repeat - 1) await wait(850);
      }
      if (token === state.token) {
        setPlaying(false);
        dom.datePlayStatus.textContent = "播放完成，请填写答案";
        dom.dateAnswerInput.focus();
      }
    } catch (error) {
      setPlaying(false);
      dom.datePlayStatus.textContent = "日期语音暂时不可用";
      console.error(error);
    }
  }

  function renderWeekdays() {
    dom.weekdayList.replaceChildren();
    WEEKDAYS.forEach((weekday) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "weekday-button";
      button.dataset.weekday = weekday.en;
      button.classList.toggle("is-playing", state.playingWeekday === weekday.en);
      const english = document.createElement("strong");
      english.textContent = weekday.en;
      const chinese = document.createElement("span");
      chinese.textContent = weekday.zh;
      button.append(english, chinese);
      dom.weekdayList.appendChild(button);
    });
  }

  async function playWeekday(weekday) {
    stopListening();
    if (state.playingWeekday === weekday && state.playing) {
      stopPlayback();
      return;
    }
    stopPlayback();
    const token = ++state.token;
    state.playingWeekday = weekday;
    setPlaying(true);
    renderWeekdays();
    try {
      await playSmartText(weekday, token);
    } catch (error) {
      await speakEnglishFallback(weekday, token);
    } finally {
      if (token === state.token) {
        setPlaying(false);
        state.playingWeekday = null;
        renderWeekdays();
      }
    }
  }

  function getTextAudioSource(text) {
    const voiceEntry = state.voicePackIndex[text];
    if (voiceEntry?.file) return `audio/voice-pack/${voiceEntry.file}`;
    const params = new URLSearchParams({ text, voice: settings.voice });
    return `/api/text-speech?${params.toString()}`;
  }

  function currentNumber() {
    return state.session.numbers[state.session.index] || null;
  }

  function startRound(customNumbers = null, source = "normal") {
    stopListening();
    stopPlayback();
    const wrongRetry = source === "wrong" || (Array.isArray(customNumbers) && customNumbers.length > 0);
    let numbers;
    if (wrongRetry) {
      numbers = Array.from(new Set(customNumbers.map(Number).filter((number) => number >= 1 && number <= 90000000000))).sort((a, b) => a - b);
    } else {
      numbers = generateRangeNumbers(state.range);
    }

    state.session = {
      started: numbers.length > 0,
      complete: false,
      checked: false,
      source: wrongRetry ? "wrong" : "normal",
      range: wrongRetry ? "wrong" : state.range,
      numbers,
      index: 0,
      answered: 0,
      correct: 0
    };
    dom.answerInput.value = "";
    dom.result.hidden = true;
    dom.result.classList.remove("is-wrong");
    dom.userAnswerRow.hidden = true;
    renderSession();
    window.setTimeout(() => {
      dom.answerInput.focus();
      playCurrent();
    }, 120);
  }

  function generateRangeNumbers(range) {
    const config = RANGE_CONFIG[range] || RANGE_CONFIG.basic;
    if (range === "basic") {
      const values = Array.from({ length: 100 }, (_, index) => index + 1);
      return settings.mode === "digits" && settings.order === "shuffle" ? shuffle(values) : values;
    }
    if (range === "hundreds") return pickHundreds();
    if (range === "thousands") return pickThousands();
    return pickLargeNumbers();
  }

  function pickHundreds() {
    const pool = new Set([100, 1000]);
    const offsets = [0, 1, 2, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 30, 40, 50, 60, 70, 80, 90, 99];
    for (let base = 100; base <= 900; base += 100) {
      offsets.forEach((offset) => {
        const value = base + offset;
        if (value >= 100 && value <= 1000) pool.add(value);
      });
    }
    return shuffle(Array.from(pool)).slice(0, 100);
  }

  function pickThousands() {
    const pool = new Set([1000, 10000]);
    const offsets = [0, 1, 10, 11, 12, 13, 14, 15, 19, 20, 30, 40, 50, 60, 70, 80, 90, 99, 100, 101, 110, 113, 130, 199, 999];
    for (let base = 1000; base <= 9000; base += 1000) {
      offsets.forEach((offset) => {
        const value = base + offset;
        if (value >= 1000 && value <= 10000) pool.add(value);
      });
    }
    return shuffle(Array.from(pool)).slice(0, 100);
  }

  function pickLargeNumbers() {
    const pool = new Set([
      13, 30, 14, 40, 15, 50, 16, 60, 17, 70, 18, 80, 19, 90,
      100, 1000, 10000, 100000, 1000000, 10000000, 100000000,
      1000000000, 10000000000, 30000000000, 90000000000,
      130, 300, 1300, 3000, 13000, 30000, 130000, 300000,
      1300000, 3000000, 13000000, 30000000,
      130000000, 300000000, 1300000000, 3000000000,
      13000000000, 30000000000
    ]);
    const scales = [1000, 10000, 100000, 1000000, 10000000, 100000000, 1000000000, 10000000000];
    scales.forEach((scale) => {
      for (let unit = 1; unit <= 9; unit += 1) {
        const base = unit * scale;
        if (base > 90000000000) continue;
        [0, 13, 30, 100, 130, 300, 1000, 1300, 3000, 13000, 30000].forEach((offset) => {
          const value = base + offset;
          if (value >= 1 && value <= 90000000000) pool.add(value);
        });
      }
    });

    const buckets = {
      small: [13, 30, 14, 40, 15, 50, 16, 60, 17, 70, 18, 80, 19, 90, 99],
      hundred: [],
      thousand: [],
      upperThousand: [],
      million: [],
      billion: []
    };
    pool.forEach((value) => {
      if (value >= 1 && value < 100) buckets.small.push(value);
      else if (value >= 100 && value < 1000) buckets.hundred.push(value);
      else if (value >= 1000 && value < 10000) buckets.thousand.push(value);
      else if (value >= 10000 && value < 1000000) buckets.upperThousand.push(value);
      else if (value >= 1000000 && value < 1000000000) buckets.million.push(value);
      else if (value >= 1000000000 && value <= 90000000000) buckets.billion.push(value);
    });

    fillBucket(buckets.small, 1, 99, 20);
    fillBucket(buckets.hundred, 100, 999, 30);
    fillBucket(buckets.thousand, 1000, 9999, 30);
    fillBucket(buckets.upperThousand, 10000, 999999, 30);
    fillBucket(buckets.million, 1000000, 999999999, 30);
    fillBucket(buckets.billion, 1000000000, 90000000000, 30);

    const quotas = [
      [buckets.small, 10],
      [buckets.hundred, 15],
      [buckets.thousand, 15],
      [buckets.upperThousand, 15],
      [buckets.million, 20],
      [buckets.billion, 25]
    ];
    const selected = [];
    quotas.forEach(([bucket, quota]) => {
      shuffle(bucket).slice(0, quota).forEach((value) => selected.push(value));
    });
    return shuffle(Array.from(new Set(selected))).slice(0, 100);
  }

  function fillBucket(bucket, minimum, maximum, minimumSize) {
    const set = new Set(bucket);
    let attempts = 0;
    while (set.size < minimumSize && attempts < minimumSize * 20) {
      attempts += 1;
      let value = randomInt(minimum, maximum);
      if (minimum <= 1000 && Math.random() < 0.7) {
        const pattern = [13, 30, 113, 130, 300][Math.floor(Math.random() * 5)];
        value = Math.max(minimum, Math.min(maximum, value - (value % 1000) + pattern));
      } else if (maximum >= 1000000) {
        const scale = maximum >= 1000000000 ? 1000000 : 1000;
        const base = Math.floor(value / scale) * scale;
        const suffix = [0, 13, 30, 130, 300, 1000, 1300, 3000][Math.floor(Math.random() * 8)];
        value = Math.max(minimum, Math.min(maximum, base + suffix));
      }
      set.add(value);
    }
    bucket.length = 0;
    bucket.push(...set);
  }

  function randomInt(minimum, maximum) {
    return Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
  }

  function startWrongRound() {
    if (!state.wrongNumbers.length) return;
    switchTab("dictation");
    startRound(state.wrongNumbers, "wrong");
  }

  function startWrongDateRound() {
    if (!state.wrongDates.length) return;
    const matching = state.wrongDates.filter((entry) => entry.mode === state.dateMode);
    const mode = matching.length ? state.dateMode : state.wrongDates[0].mode;
    const entries = state.wrongDates.filter((entry) => entry.mode === mode);
    state.dateMode = mode;
    switchTab("dates");
    startDateRound(entries.map((entry) => entry.data), "wrong", mode);
  }

  function handleAnswerInput() {
    clearAutoSubmit();
    if (state.session.checked || settings.submitMode !== "auto") return;
    const answer = dom.answerInput.value.trim();
    if (!answer) return;
    if (isExactAnswer(answer)) {
      submitAnswer(true);
      return;
    }
    state.autoSubmitTimer = window.setTimeout(() => submitAnswer(true), 1200);
  }

  function clearAutoSubmit() {
    if (state.autoSubmitTimer) window.clearTimeout(state.autoSubmitTimer);
    state.autoSubmitTimer = null;
  }

  function isExactAnswer(answer) {
    const number = currentNumber();
    if (number === null) return false;
    if (answerMode() === "english") {
      return normalizeEnglish(answer) === normalizeEnglish(numberToEnglish(number));
    }
    const digits = answer.replace(/[\s,，]/g, "");
    return /^\d+$/.test(digits) && String(Number(digits)) === String(number);
  }

  function answerMode() {
    return state.session.source === "wrong" ? "digits" : settings.mode;
  }

  function submitAnswer(automatic) {
    const number = currentNumber();
    if (number === null || state.session.checked) return;
    const answer = dom.answerInput.value.trim();
    if (!answer) {
      if (!automatic) {
        dom.playStatus.textContent = "请先填写答案";
        dom.answerInput.focus();
      }
      return;
    }

    clearAutoSubmit();
    stopPlayback();
    const result = compareAnswer(answer, number);
    state.session.checked = true;
    state.session.answered += 1;
    if (result.correct) {
      state.session.correct += 1;
      removeWrongNumber(number);
    } else {
      addWrongNumber(number);
    }

    dom.result.hidden = false;
    dom.result.classList.toggle("is-wrong", !result.correct);
    dom.resultMark.textContent = result.correct ? "正确" : "需要再练";
    dom.resultNote.textContent = result.note;
    dom.correctAnswer.textContent = answerMode() === "english" ? numberToEnglish(number) : formatNumber(number);
    dom.userAnswer.textContent = answer;
    dom.userAnswerRow.hidden = result.correct;
    renderSession();
    renderWrongBook();
    window.setTimeout(() => dom.answerInput.focus(), 30);
  }

  function compareAnswer(answer, number) {
    if (answerMode() === "english") {
      const expected = numberToEnglish(number);
      const normalized = normalizeEnglish(answer);
      const correct = normalized === normalizeEnglish(expected)
        || (number === 100 && ["onehundred", "ahundred", "hundred"].includes(normalized));
      return {
        correct,
        note: correct ? "英文拼写正确" : `正确拼写是 ${expected}`
      };
    }
    const digits = answer.replace(/[\s,，]/g, "");
    const correct = /^\d+$/.test(digits) && String(Number(digits)) === String(number);
    return {
      correct,
      note: correct ? "阿拉伯数字正确" : `正确数字是 ${formatNumber(number)}`
    };
  }

  function normalizeEnglish(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/-/g, "")
      .replace(/[^a-z]/g, "");
  }

  function goNext(autoPlay) {
    if (!state.session.started || state.session.complete) return;
    if (state.session.index >= state.session.numbers.length - 1) {
      finishRound();
      return;
    }
    stopPlayback();
    state.session.index += 1;
    state.session.checked = false;
    dom.answerInput.value = "";
    dom.result.hidden = true;
    dom.result.classList.remove("is-wrong");
    dom.userAnswerRow.hidden = true;
    renderSession();
    dom.answerInput.focus();
    if (autoPlay) window.setTimeout(playCurrent, 150);
  }

  function finishRound() {
    stopPlayback();
    state.session.complete = true;
    renderSession();
  }

  function preloadCurrent() {
    const number = currentNumber();
    if (number === null || state.playing) return;
    const source = getAudioSource(number);
    if (state.preloaded === source) return;
    state.preloaded = source;
    state.audio.src = source;
    state.audio.load();
  }

  function getAudioSource(number) {
    const value = Number(number);
    const voiceEntry = state.voicePackIndex[numberToEnglish(value)];
    if (voiceEntry?.file) return `audio/voice-pack/${voiceEntry.file}`;
    const params = new URLSearchParams({
      number: String(value),
      voice: settings.voice
    });
    return `/api/speech?${params.toString()}`;
  }

  async function playCurrent() {
    stopListening();
    const number = currentNumber();
    if (number === null) return;
    stopPlayback();
    const token = ++state.token;
    setPlaying(true);
    await wait(50);

    try {
      for (let index = 0; index < settings.repeat; index += 1) {
        if (token !== state.token) return;
        dom.playStatus.textContent = `正在播放第 ${index + 1} / ${settings.repeat} 遍`;
        await playNumberAudio(number, token);
        if (token !== state.token) return;
        if (index < settings.repeat - 1) {
          dom.playStatus.textContent = "准备重播";
          await wait(850);
        }
      }
      if (token === state.token) {
        setPlaying(false);
        dom.playStatus.textContent = "播放完成，请填写答案";
        dom.answerInput.focus();
      }
    } catch (error) {
      setPlaying(false);
      dom.playStatus.textContent = "音频播放失败";
      console.error(error);
    }
  }

  async function playDirectoryNumber(number) {
    stopListening();
    const key = `number:${number}`;
    if (state.playingWord === key && state.playing) {
      stopPlayback();
      return;
    }
    stopPlayback();
    const token = ++state.token;
    state.playingWord = key;
    setPlaying(true);
    renderWordDirectory();
    try {
      await playNumberAudio(number, token);
    } catch (error) {
      console.error(error);
    } finally {
      if (token === state.token) {
        setPlaying(false);
        state.playingWord = null;
        renderWordDirectory();
      }
    }
  }

  async function playDirectoryText(text, key) {
    stopListening();
    if (state.playingWord === key && state.playing) {
      stopPlayback();
      return;
    }
    stopPlayback();
    const token = ++state.token;
    state.playingWord = key;
    setPlaying(true);
    renderWordDirectory();
    try {
      await playSmartText(text, token);
    } catch (error) {
      await speakEnglishFallback(text, token);
    } finally {
      if (token === state.token) {
        setPlaying(false);
        state.playingWord = null;
        renderWordDirectory();
      }
    }
  }

  function getYoudaoAudioUrl(text) {
    const params = new URLSearchParams({ audio: text, type: "2" });
    return `https://dict.youdao.com/dictvoice?${params.toString()}`;
  }

  function splitNumberIntoSpeechChunks(number) {
    const value = Number(number);
    if (value < 100) return [numberToEnglish(value)];
    const chunks = [];
    let remaining = value;
    const scales = [[1000000000, "billion"], [1000000, "million"], [1000, "thousand"]];
    scales.forEach(([scale, label]) => {
      if (remaining < scale) return;
      const count = Math.floor(remaining / scale);
      const parts = splitUnderHundredForSpeech(count);
      parts[parts.length - 1] = `${parts[parts.length - 1]} ${label}`;
      chunks.push(...parts);
      remaining %= scale;
    });
    if (remaining > 0) chunks.push(...splitUnderHundredForSpeech(remaining));
    return chunks.filter(Boolean);
  }

  function splitUnderHundredForSpeech(number) {
    const value = Number(number);
    if (value < 100) return [numberToEnglish(value)];
    const hundreds = Math.floor(value / 100);
    const remainder = value % 100;
    if (!remainder) return [`${numberToEnglish(hundreds)} hundred`];
    return [`${numberToEnglish(hundreds)} hundred`, numberToEnglish(remainder)];
  }

  async function playNumberAudio(number, token) {
    try {
      await playAudio(getAudioSource(number), token);
      return;
    } catch (error) {
      // The static GitHub Pages build has no local speech API.
    }
    const chunks = splitNumberIntoSpeechChunks(number);
    for (const chunk of chunks) {
      if (token !== state.token) return;
      try {
        await playAudio(getYoudaoAudioUrl(chunk), token);
      } catch (error) {
        await speakEnglishFallback(chunk, token);
      }
    }
  }

  async function playSmartListeningText(text, token) {
    try {
      await playListeningAudio(getTextAudioSource(text), token);
      return;
    } catch (error) {
      const words = String(text).trim().split(/\s+/).filter(Boolean);
      if (words.length <= 3) {
        try {
          await playListeningAudio(getYoudaoAudioUrl(text), token);
          return;
        } catch (error) {
          // Continue to browser speech.
        }
      }
      await speakEnglishFallback(text, token, {
        rate: Number(dom.listeningSpeed.value) || 1,
        tokenScope: "listening"
      });
    }
  }

  async function playSmartText(text, token) {
    try {
      await playAudio(getTextAudioSource(text), token);
      return;
    } catch (error) {
      // Fall through to the online dictionary voice.
    }
    const words = String(text).trim().split(/\s+/).filter(Boolean);
    if (words.length <= 3) {
      try {
        await playAudio(getYoudaoAudioUrl(text), token);
        return;
      } catch (error) {
        // Final fallback is the browser voice.
      }
    }
    await speakEnglishFallback(text, token);
  }

  function speakEnglishFallback(text, token, options = {}) {
    return new Promise((resolve) => {
      const currentToken = options.tokenScope === "listening" ? state.listening.token : state.token;
      if (!window.speechSynthesis || token !== currentToken) {
        resolve();
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find((item) => /en-GB/i.test(item.lang))
        || voices.find((item) => /^en/i.test(item.lang));
      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang || "en-GB";
      utterance.rate = Number(options.rate ?? settings.speed) || 1;
      utterance.onend = resolve;
      utterance.onerror = resolve;
      window.speechSynthesis.speak(utterance);
    });
  }

  function playAudio(source, token) {
    return new Promise((resolve, reject) => {
      if (token !== state.token) {
        resolve();
        return;
      }
      const audio = state.audio;
      let settled = false;
      const finish = (error = null) => {
        if (settled) return;
        settled = true;
        audio.onended = null;
        audio.onerror = null;
        if (error) reject(error);
        else resolve();
      };
      audio.onended = () => finish();
      audio.onerror = () => finish(new Error(`Cannot play ${source}`));
      audio.playbackRate = settings.speed;
      audio.preservesPitch = true;
      const resolved = new URL(source, window.location.href).href;
      if (audio.src !== resolved) {
        audio.src = source;
        audio.load();
      } else if (audio.currentTime > 0) {
        audio.currentTime = 0;
      }
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch((error) => {
          if (error?.name === "AbortError") finish();
          else finish(error);
        });
      }
    });
  }

  function applyPlaybackRate() {
    if (state.audio) {
      state.audio.playbackRate = settings.speed;
      state.audio.preservesPitch = true;
    }
  }

  function stopPlayback() {
    clearAutoSubmit();
    state.token += 1;
    try {
      state.audio.pause();
    } catch (error) {
      console.debug(error);
    }
    state.playingWord = null;
    setPlaying(false);
    if (state.session.started) dom.playStatus.textContent = "已停止播报";
    if (state.dateSession.started) dom.datePlayStatus.textContent = "已停止播报";
    if (state.customSession.started) dom.customPlayStatus.textContent = "已停止播报";
    state.playingWeekday = null;
    renderWeekdays();
  }

  function setPlaying(value) {
    state.playing = Boolean(value);
    dom.playButton.classList.toggle("is-playing", state.playing);
    dom.datePlayButton.classList.toggle("is-playing", state.playing && state.playingWeekday === null);
    dom.stopButton.disabled = !state.playing;
    dom.stopDateButton.disabled = !state.playing;
    dom.stopCustomButton.disabled = !state.playing;
    dom.customPlayButton.classList.toggle("is-playing", state.playing);
  }

  function buildListeningPlaylist() {
    const selected = new Set(
      Array.from(dom.listeningCategories.querySelectorAll("input:checked")).map((input) => input.dataset.listeningCategory)
    );
    const entries = [];
    if (selected.has("numbers")) {
      for (let number = 1; number <= 100; number += 1) {
        entries.push({ kind: "number", number, english: numberToEnglish(number), chinese: formatNumber(number), key: `number:${number}` });
      }
    }
    if (selected.has("hundreds")) {
      pickHundreds().forEach((number) => {
        entries.push({ kind: "number", number, english: numberToEnglish(number), chinese: formatNumber(number), key: `hundred:${number}` });
      });
    }
    if (selected.has("thousands")) {
      pickThousands().forEach((number) => {
        entries.push({ kind: "number", number, english: numberToEnglish(number), chinese: formatNumber(number), key: `thousand:${number}` });
      });
    }
    if (selected.has("large")) {
      pickLargeNumbers().forEach((number) => {
        entries.push({ kind: "number", number, english: numberToEnglish(number), chinese: formatNumber(number), key: `large:${number}` });
      });
    }
    if (selected.has("months")) {
      MONTHS.forEach((month, index) => {
        entries.push({ kind: "text", english: month, chinese: `${index + 1}月`, audioText: month, key: `month:${month}` });
      });
    }
    if (selected.has("ordinals")) {
      for (let day = 1; day <= 31; day += 1) {
        entries.push({
          kind: "text",
          english: `the ${ordinalEnglish(day)}`,
          chinese: `第${day}号`,
          audioText: `the ${ordinalEnglish(day)}`,
          key: `ordinal:${day}`
        });
      }
    }
    if (selected.has("dates")) {
      buildDateExamples().forEach((item) => {
        const weekdayZh = WEEKDAYS.find((weekday) => weekday.en === item.weekday)?.zh || item.weekday;
        entries.push({
          kind: "text",
          english: item.audioText,
          chinese: `${weekdayZh}，${item.monthIndex + 1}月${item.day}日`,
          audioText: item.audioText,
          key: `date:${item.weekday}:${item.day}:${item.month}`
        });
      });
    }
    if (selected.has("custom")) {
      state.customItems.forEach((item) => {
        entries.push({
          kind: "text",
          english: item.text,
          chinese: item.translation || item.text,
          audioText: item.text,
          key: `custom:${item.id}`
        });
      });
    }
    if (selected.has("examples")) {
      state.customItems.filter((item) => item.example).forEach((item) => {
        entries.push({
          kind: "text",
          english: item.example,
          chinese: item.exampleTranslation || item.example,
          audioText: item.example,
          key: `example:${item.id}`
        });
      });
    }
    if (selected.has("hearing")) {
      state.hearingWrong.forEach((item) => {
        entries.push({
          kind: "text",
          english: item.text,
          chinese: item.translation || item.text,
          audioText: item.text,
          key: `hearing:${item.id}`
        });
      });
    }
    if (selected.has("wrong")) {
      state.wrongNumbers.forEach((number) => {
        entries.push({ kind: "number", number, english: numberToEnglish(number), chinese: formatNumber(number), key: `wrong-number:${number}` });
      });
      state.wrongDates.forEach((entry) => {
        entries.push({
          kind: "text",
          english: entry.data.englishAnswer,
          chinese: entry.mode === "phrase"
            ? `${WEEKDAYS.find((weekday) => weekday.en === entry.data.weekday)?.zh || entry.data.weekday}，${entry.data.monthIndex + 1}月${entry.data.day}日`
            : `第${entry.data.day}号`,
          audioText: entry.data.audioText,
          key: `wrong-date:${entry.key}`
        });
      });
    }
    const unique = new Map(entries.map((entry) => [entry.key, entry]));
    return shuffle(Array.from(unique.values()));
  }

  function startListening() {
    const playlist = buildListeningPlaylist();
    if (!playlist.length) {
      dom.listeningEnglish.textContent = "还没有选择播放内容";
      dom.listeningChinese.textContent = "至少勾选一个分类。";
      return;
    }
    stopListening();
    state.listening.started = true;
    state.listening.playlist = playlist;
    state.listening.index = 0;
    state.listening.playing = true;
    configureSleepTimer();
    renderListening();
    playListeningIndex();
  }

  function toggleListeningPlayback() {
    if (!state.listening.started) {
      startListening();
      return;
    }
    if (state.listening.playing) {
      stopListeningAudio();
      state.listening.playing = false;
      renderListening();
      return;
    }
    state.listening.playing = true;
    renderListening();
    playListeningIndex();
  }

  function changeListeningIndex(offset) {
    if (!state.listening.playlist.length) return;
    const total = state.listening.playlist.length;
    state.listening.index = (state.listening.index + offset + total) % total;
    renderListening();
    if (state.listening.playing) playListeningIndex();
  }

  async function playListeningIndex() {
    if (!state.listening.playing) return;
    const entry = state.listening.playlist[state.listening.index];
    if (!entry) {
      state.listening.index = 0;
      return playListeningIndex();
    }
    stopListeningAudio();
    const token = ++state.listening.token;
    renderListening();
    try {
      const repeat = Number(dom.listeningRepeat.value) || 1;
      for (let count = 0; count < repeat; count += 1) {
        if (token !== state.listening.token || !state.listening.playing || sleepExpired()) return;
        if (entry.kind === "number") {
          try {
            await playListeningAudio(getAudioSource(entry.number), token);
          } catch (error) {
            const chunks = splitNumberIntoSpeechChunks(entry.number);
            for (const chunk of chunks) {
              if (token !== state.listening.token) return;
              try {
                await playListeningAudio(getYoudaoAudioUrl(chunk), token);
              } catch (chunkError) {
                await speakEnglishFallback(chunk, token, {
                  rate: Number(dom.listeningSpeed.value) || 1,
                  tokenScope: "listening"
                });
              }
            }
          }
        } else {
          await playSmartListeningText(entry.audioText, token);
        }
      }
      if (dom.listeningMode.value === "bilingual" && token === state.listening.token && state.listening.playing) {
        await speakChinese(entry.chinese, token);
      }
      if (token !== state.listening.token || !state.listening.playing || sleepExpired()) return;
      await wait((Number(dom.listeningInterval.value) || 1) * 1000);
      if (token !== state.listening.token || !state.listening.playing || sleepExpired()) return;
      state.listening.index = (state.listening.index + 1) % state.listening.playlist.length;
      playListeningIndex();
    } catch (error) {
      console.error(error);
      if (token === state.listening.token && state.listening.playing) {
        await wait(800);
        state.listening.index = (state.listening.index + 1) % state.listening.playlist.length;
        playListeningIndex();
      }
    }
  }

  function playListeningAudio(source, token) {
    return new Promise((resolve, reject) => {
      if (token !== state.listening.token) {
        resolve();
        return;
      }
      const audio = state.listening.audio;
      let settled = false;
      const finish = (error = null) => {
        if (settled) return;
        settled = true;
        audio.onended = null;
        audio.onerror = null;
        if (error) reject(error);
        else resolve();
      };
      audio.onended = () => finish();
      audio.onerror = () => finish(new Error("Listening audio failed"));
      audio.playbackRate = Number(dom.listeningSpeed.value) || 1;
      audio.preservesPitch = true;
      const resolved = new URL(source, window.location.href).href;
      if (audio.src !== resolved) {
        audio.src = source;
        audio.load();
      } else if (audio.currentTime > 0) {
        audio.currentTime = 0;
      }
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch((error) => finish(error));
      }
    });
  }

  function speakChinese(text, token) {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || token !== state.listening.token) {
        resolve();
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      const voice = window.speechSynthesis.getVoices().find((item) => /^zh/i.test(item.lang));
      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang || "zh-CN";
      utterance.rate = Number(dom.listeningSpeed.value) || 1;
      utterance.onend = resolve;
      utterance.onerror = resolve;
      window.speechSynthesis.speak(utterance);
    });
  }

  function stopListeningAudio() {
    state.listening.token += 1;
    if (state.listening.audio) {
      try {
        state.listening.audio.pause();
      } catch (error) {
        console.debug(error);
      }
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  function stopListening() {
    stopListeningAudio();
    state.listening.playing = false;
    state.listening.started = false;
    if (state.listening.sleepTimer) window.clearInterval(state.listening.sleepTimer);
    state.listening.sleepTimer = null;
    state.listening.sleepDeadline = 0;
    renderListening();
  }

  function configureSleepTimer() {
    if (state.listening.sleepTimer) window.clearInterval(state.listening.sleepTimer);
    state.listening.sleepTimer = null;
    const minutes = Number(dom.listeningSleep.value) || 0;
    state.listening.sleepDeadline = minutes ? Date.now() + minutes * 60000 : 0;
    if (!minutes) {
      dom.listeningSleepStatus.textContent = "睡眠模式关闭";
      return;
    }
    const tick = () => {
      if (!state.listening.sleepDeadline) return;
      const remaining = Math.max(0, state.listening.sleepDeadline - Date.now());
      dom.listeningSleepStatus.textContent = `睡眠剩余 ${formatClock(remaining)}`;
      if (remaining <= 0) {
        stopListening();
        dom.listeningSleepStatus.textContent = "睡眠模式已结束";
      }
    };
    tick();
    state.listening.sleepTimer = window.setInterval(tick, 1000);
  }

  function sleepExpired() {
    return state.listening.sleepDeadline > 0 && Date.now() >= state.listening.sleepDeadline;
  }

  function formatClock(milliseconds) {
    const total = Math.ceil(milliseconds / 1000);
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  function renderListening() {
    const total = state.listening.playlist.length;
    const index = total ? state.listening.index + 1 : 0;
    const current = state.listening.playlist[state.listening.index];
    dom.listeningProgress.textContent = `${index} / ${total}`;
    dom.listeningEnglish.textContent = current?.english || "准备开始";
    dom.listeningChinese.textContent = current?.chinese || "选择内容后点击开始";
    dom.listeningPlayButton.textContent = state.listening.playing ? "暂停" : (state.listening.started ? "继续" : "播放");
    dom.listeningProgressBar.style.width = total ? `${(index / total) * 100}%` : "0%";
    if (!state.listening.sleepDeadline) dom.listeningSleepStatus.textContent = "睡眠模式关闭";
  }

  function openCustomEditor(itemId = null) {
    const item = state.customItems.find((entry) => entry.id === itemId);
    state.customEditorId = item?.id || null;
    state.customAutoTranslation = !item;
    state.customExampleAutoTranslation = !item;
    dom.customEditorTitle.textContent = item ? "编辑英文内容" : "连续添加英文内容";
    dom.customEnglishInput.value = item?.text || "";
    dom.customPhoneticInput.value = item?.phonetic || "";
    dom.customChineseInput.value = item?.translation || "";
    dom.customExampleInput.value = item?.example || "";
    dom.customExampleTranslationInput.value = item?.exampleTranslation || "";
    dom.customNoteInput.value = item?.note || "";
    dom.customSaveStatus.textContent = item
      ? "修改后点击保存。"
      : "输入英文后会自动获取音标和中文翻译；保存后会清空输入框，可继续添加下一条。";
    dom.customEditor.hidden = false;
    dom.customEnglishInput.focus();
  }

  function closeCustomEditor() {
    state.customEditorId = null;
    dom.customEditor.hidden = true;
    dom.customEnglishInput.value = "";
    dom.customPhoneticInput.value = "";
    dom.customChineseInput.value = "";
    dom.customExampleInput.value = "";
    dom.customExampleTranslationInput.value = "";
    dom.customNoteInput.value = "";
  }

  function lookupPhonetic(text) {
    const tokens = String(text || "")
      .toLowerCase()
      .match(/[a-z]+(?:['-][a-z]+)?/g) || [];
    if (!tokens.length || tokens.length > 12 || !state.ipaMap.size) return "";
    const found = [];
    tokens.forEach((token) => {
      const ipa = state.ipaMap.get(token);
      if (ipa) found.push(`${token} ${ipa}`);
    });
    return found.join(" · ");
  }

  async function fetchTranslation(text) {
    const params = new URLSearchParams({ text });
    try {
      const response = await fetch(`/api/translate?${params.toString()}`, { cache: "no-store" });
      const payload = await response.json();
      if (response.ok && payload.translation) return payload.translation;
    } catch (error) {
      console.debug("Local translation unavailable.", error);
    }
    const fallback = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|zh-CN`,
      { cache: "no-store" }
    );
    const payload = await fallback.json();
    return payload?.responseData?.translatedText || "";
  }

  async function translateCustomText() {
    const text = dom.customEnglishInput.value.trim();
    if (!text) {
      dom.customChineseInput.placeholder = "请先填写英文内容";
      dom.customEnglishInput.focus();
      return;
    }
    const original = dom.translateCustomButton.textContent;
    dom.translateCustomButton.disabled = true;
    dom.translateCustomButton.textContent = "翻译中";
    try {
      dom.customChineseInput.value = await fetchTranslation(text);
    } catch (error) {
      dom.customChineseInput.placeholder = "自动翻译失败，请手动填写";
    } finally {
      dom.translateCustomButton.disabled = false;
      dom.translateCustomButton.textContent = original;
    }
  }

  async function translateExampleText() {
    const text = dom.customExampleInput.value.trim();
    if (!text) {
      dom.customExampleTranslationInput.placeholder = "请先填写例句";
      dom.customExampleInput.focus();
      return;
    }
    const original = dom.translateExampleButton.textContent;
    dom.translateExampleButton.disabled = true;
    dom.translateExampleButton.textContent = "翻译中";
    try {
      dom.customExampleTranslationInput.value = await fetchTranslation(text);
    } catch (error) {
      dom.customExampleTranslationInput.placeholder = "自动翻译失败，请手动填写";
    } finally {
      dom.translateExampleButton.disabled = false;
      dom.translateExampleButton.textContent = original;
    }
  }

  let customAutoTimer = null;
  function scheduleCustomAutoFill() {
    if (customAutoTimer) window.clearTimeout(customAutoTimer);
    customAutoTimer = window.setTimeout(async () => {
      const text = dom.customEnglishInput.value.trim();
      if (!text) return;
      if (state.ipaLoadPromise) await state.ipaLoadPromise;
      if (!dom.customPhoneticInput.value.trim() || state.customAutoTranslation) {
        dom.customPhoneticInput.value = lookupPhonetic(text);
      }
      if (state.customAutoTranslation) {
        try {
          const translated = await fetchTranslation(text);
          if (translated) dom.customChineseInput.value = translated;
        } catch (error) {
          console.debug(error);
        }
      }
      if (state.customExampleAutoTranslation && dom.customExampleInput.value.trim()) {
        try {
          const translated = await fetchTranslation(dom.customExampleInput.value.trim());
          if (translated) dom.customExampleTranslationInput.value = translated;
        } catch (error) {
          console.debug(error);
        }
      }
    }, 650);
  }

  async function saveCustomItem() {
    const text = dom.customEnglishInput.value.trim();
    if (!text) {
      dom.customEnglishInput.focus();
      return;
    }
    if (state.ipaLoadPromise) await state.ipaLoadPromise;
    if (!dom.customChineseInput.value.trim()) {
      try {
        dom.customChineseInput.value = await fetchTranslation(text);
      } catch (error) {
        console.debug(error);
      }
    }
    if (!dom.customPhoneticInput.value.trim()) {
      dom.customPhoneticInput.value = lookupPhonetic(text);
    }
    if (dom.customExampleInput.value.trim() && !dom.customExampleTranslationInput.value.trim()) {
      try {
        dom.customExampleTranslationInput.value = await fetchTranslation(dom.customExampleInput.value.trim());
      } catch (error) {
        console.debug(error);
      }
    }
    const entry = {
      text,
      phonetic: dom.customPhoneticInput.value.trim() || lookupPhonetic(text),
      translation: dom.customChineseInput.value.trim(),
      example: dom.customExampleInput.value.trim(),
      exampleTranslation: dom.customExampleTranslationInput.value.trim(),
      note: dom.customNoteInput.value.trim(),
      updatedAt: Date.now()
    };
    const editingId = state.customEditorId;
    if (editingId) {
      const index = state.customItems.findIndex((item) => item.id === editingId);
      if (index !== -1) {
        state.customItems[index] = { ...state.customItems[index], ...entry };
        const wrong = state.hearingWrong.find((item) => item.id === editingId);
        if (wrong) Object.assign(wrong, entry);
      }
    } else {
      state.customItems.unshift({
        id: `custom-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        createdAt: Date.now(),
        ...entry
      });
    }
    saveCustomItems();
    saveHearingWrong();
    renderCustom();
    renderHearingWrong();
    renderListening();
    if (editingId) {
      closeCustomEditor();
    } else {
      const savedText = text;
      dom.customEnglishInput.value = "";
      dom.customPhoneticInput.value = "";
      dom.customChineseInput.value = "";
      dom.customExampleInput.value = "";
      dom.customExampleTranslationInput.value = "";
      dom.customNoteInput.value = "";
      state.customAutoTranslation = true;
      state.customExampleAutoTranslation = true;
      dom.customSaveStatus.textContent = `已保存“${savedText}”，可以继续输入下一条。`;
      dom.customEnglishInput.focus();
    }
  }

  function renderCustom() {
    dom.customItemCount.textContent = String(state.customItems.length);
    renderCustomList();
    renderCustomSession();
  }

  function renderCustomList() {
    dom.customList.replaceChildren();
    if (!state.customItems.length) {
      const empty = document.createElement("div");
      empty.className = "custom-empty";
      empty.textContent = "还没有自定义词句，点击“添加词句”开始。";
      dom.customList.appendChild(empty);
      return;
    }
    state.customItems.forEach((item) => {
      const card = document.createElement("article");
      card.className = "custom-list-item";
      const english = document.createElement("div");
      english.className = "custom-list-english";
      english.textContent = item.text;
      const phonetic = document.createElement("div");
      phonetic.className = "custom-list-phonetic";
      phonetic.textContent = item.phonetic || lookupPhonetic(item.text) || "暂无英式音标";
      const chinese = document.createElement("div");
      chinese.className = "custom-list-chinese";
      chinese.textContent = item.translation || "暂无中文翻译";
      const example = document.createElement("div");
      example.className = "custom-list-example";
      example.textContent = item.example
        ? `${item.example}${item.exampleTranslation ? ` — ${item.exampleTranslation}` : ""}`
        : "";
      const note = document.createElement("div");
      note.className = "custom-list-note";
      note.textContent = item.note || "";
      const actions = document.createElement("div");
      actions.className = "custom-list-actions";
      const play = document.createElement("button");
      play.type = "button";
      play.dataset.action = "play";
      play.dataset.id = item.id;
      play.textContent = "播放";
      const edit = document.createElement("button");
      edit.type = "button";
      edit.dataset.action = "edit";
      edit.dataset.id = item.id;
      edit.textContent = "编辑";
      const remove = document.createElement("button");
      remove.type = "button";
      remove.dataset.action = "delete";
      remove.dataset.id = item.id;
      remove.textContent = "删除";
      actions.append(play, edit, remove);
      card.append(english, phonetic, chinese, example, note, actions);
      dom.customList.appendChild(card);
    });
  }

  function renderCustomSession() {
    const session = state.customSession;
    const total = session.items.length;
    const current = currentCustomItem();
    dom.customProgressLabel.textContent = `我的词句 ${Math.min(session.index + 1, total)} / ${total}`;
    dom.customModeLabel.textContent = session.source === "hearing" ? "听力错词复习" : "我的词句拼写";
    dom.customSubmitHint.textContent = settings.submitMode === "auto" ? "自动提交" : "手动提交";
    dom.restartCustomButton.disabled = !session.started;
    dom.stopCustomButton.disabled = !state.playing;
    dom.customProgressBar.style.width = total
      ? `${session.checked ? ((session.index + 1) / total) * 100 : (session.index / total) * 100}%`
      : "0%";

    if (!session.started) {
      dom.customStartScreen.hidden = false;
      dom.customQuestionScreen.hidden = true;
      dom.customCompleteScreen.hidden = true;
      dom.customStartTitle.textContent = state.customItems.length ? "准备练习你的词句" : "先添加你要拼写的英文";
      dom.customStartDescription.textContent = state.customItems.length
        ? "听英文，填写完整拼写；提交后显示中文翻译和个人笔记。"
        : "保存词句后，可以听英文、填写拼写，并查看中文翻译和笔记。";
      return;
    }

    if (session.complete || !total) {
      dom.customStartScreen.hidden = true;
      dom.customQuestionScreen.hidden = true;
      dom.customCompleteScreen.hidden = false;
      dom.customCompleteSummary.textContent = `共 ${session.answered} 题，正确 ${session.correct} 题。`;
      return;
    }

    if (!current) {
      finishCustomRound();
      return;
    }

    dom.customStartScreen.hidden = true;
    dom.customCompleteScreen.hidden = true;
    dom.customQuestionScreen.hidden = false;
    dom.customQuestionIndex.textContent = String(session.index + 1).padStart(2, "0");
    dom.customQuestionTotal.textContent = `/ ${String(total).padStart(3, "0")}`;
    dom.customAnswerInput.disabled = false;
    dom.customAnswerInput.readOnly = session.checked;
    dom.submitCustomButton.hidden = session.checked;
    dom.nextCustomButton.hidden = !session.checked;
    dom.nextCustomButton.textContent = session.index === total - 1 ? "完成本轮" : "下一题";
    if (!state.playing) dom.customPlayStatus.textContent = session.checked ? "本题已提交" : "按播放键开始";
  }

  function currentCustomItem() {
    return state.customSession.items[state.customSession.index] || null;
  }

  function startCustomPractice(items = null, source = "all") {
    const sourceItems = Array.isArray(items) ? items : state.customItems;
    if (!sourceItems.length) {
      if (source !== "hearing") switchTab("custom");
      renderCustom();
      return;
    }
    stopListening();
    stopPlayback();
    state.customSession = {
      started: true,
      complete: false,
      checked: false,
      source,
      items: sourceItems.map((item) => ({ ...item })),
      index: 0,
      answered: 0,
      correct: 0
    };
    switchTab("custom");
    dom.customAnswerInput.value = "";
    dom.customResult.hidden = true;
    renderCustomSession();
    window.setTimeout(() => {
      dom.customAnswerInput.focus();
      playCurrentCustom();
    }, 120);
  }

  async function playCurrentCustom() {
    const item = currentCustomItem();
    if (!item) return;
    stopListening();
    stopPlayback();
    const token = ++state.token;
    setPlaying(true);
    await wait(50);
    try {
      for (let index = 0; index < settings.repeat; index += 1) {
        if (token !== state.token) return;
        dom.customPlayStatus.textContent = `正在播放第 ${index + 1} / ${settings.repeat} 遍`;
        await playSmartText(item.text, token);
        if (index < settings.repeat - 1) await wait(850);
      }
      if (token === state.token) {
        setPlaying(false);
        dom.customPlayStatus.textContent = "播放完成，请填写答案";
        dom.customAnswerInput.focus();
      }
    } catch (error) {
      await speakEnglishFallback(item.text, token);
      if (token === state.token) {
        setPlaying(false);
        dom.customPlayStatus.textContent = "播放完成，请填写答案";
      }
    }
  }

  function handleCustomInput() {
    clearAutoSubmit();
    if (state.customSession.checked || settings.submitMode !== "auto") return;
    const item = currentCustomItem();
    if (!item) return;
    const answer = dom.customAnswerInput.value.trim();
    if (answer && normalizeEnglish(answer) === normalizeEnglish(item.text)) {
      submitCustomAnswer(true);
      return;
    }
    if (answer) state.autoSubmitTimer = window.setTimeout(() => submitCustomAnswer(true), 1200);
  }

  function submitCustomAnswer(automatic) {
    const item = currentCustomItem();
    if (!item || state.customSession.checked) return;
    const answer = dom.customAnswerInput.value.trim();
    if (!answer) {
      if (!automatic) dom.customAnswerInput.focus();
      return;
    }
    const correct = normalizeEnglish(answer) === normalizeEnglish(item.text);
    state.customSession.checked = true;
    state.customSession.answered += 1;
    if (correct) {
      state.customSession.correct += 1;
      advanceHearingWrong(item);
    } else {
      addOrResetHearingWrong(item);
    }
    dom.customResult.hidden = false;
    dom.customResult.classList.toggle("is-wrong", !correct);
    dom.customResultMark.textContent = correct ? "正确" : "需要再练";
    dom.customResultNote.textContent = correct ? "拼写正确" : "已自动加入听力错词本";
    dom.customCorrectAnswer.textContent = item.text;
    dom.customCorrectPhonetic.textContent = item.phonetic || lookupPhonetic(item.text) || "暂无英式音标";
    dom.customCorrectTranslation.textContent = item.translation || "未填写";
    dom.customCorrectExample.textContent = item.example || "未添加例句";
    dom.customCorrectExampleTranslation.textContent = item.exampleTranslation || "未添加例句翻译";
    dom.customCorrectNote.textContent = item.note || "未填写";
    dom.customUserAnswer.textContent = answer;
    dom.customUserAnswerRow.hidden = correct;
    saveHearingWrong();
    renderCustomSession();
    renderHearingWrong();
    dom.customAnswerInput.focus();
  }

  function goNextCustom(autoPlay) {
    if (!state.customSession.started || state.customSession.complete) return;
    if (state.customSession.index >= state.customSession.items.length - 1) {
      finishCustomRound();
      return;
    }
    stopPlayback();
    state.customSession.index += 1;
    state.customSession.checked = false;
    dom.customAnswerInput.value = "";
    dom.customResult.hidden = true;
    dom.customUserAnswerRow.hidden = true;
    renderCustomSession();
    dom.customAnswerInput.focus();
    if (autoPlay) window.setTimeout(playCurrentCustom, 150);
  }

  function finishCustomRound() {
    stopPlayback();
    state.customSession.complete = true;
    renderCustomSession();
  }

  function addOrResetHearingWrong(item) {
    const existing = state.hearingWrong.find((entry) => entry.id === item.id);
    const now = Date.now();
    if (existing) {
      Object.assign(existing, {
        text: item.text,
        phonetic: item.phonetic || lookupPhonetic(item.text),
        translation: item.translation || "",
        example: item.example || "",
        exampleTranslation: item.exampleTranslation || "",
        note: item.note || "",
        stage: 0,
        nextReviewAt: now + EBBINGHAUS_INTERVALS[0],
        wrongCount: (existing.wrongCount || 0) + 1,
        lastReviewedAt: now
      });
    } else {
      state.hearingWrong.unshift({
        id: item.id,
        text: item.text,
        phonetic: item.phonetic || lookupPhonetic(item.text),
        translation: item.translation || "",
        example: item.example || "",
        exampleTranslation: item.exampleTranslation || "",
        note: item.note || "",
        stage: 0,
        nextReviewAt: now + EBBINGHAUS_INTERVALS[0],
        wrongCount: 1,
        createdAt: now,
        lastReviewedAt: now
      });
    }
    saveHearingWrong();
  }

  function advanceHearingWrong(item) {
    const existing = state.hearingWrong.find((entry) => entry.id === item.id);
    if (!existing) return;
    existing.stage = Math.min((existing.stage || 0) + 1, EBBINGHAUS_INTERVALS.length - 1);
    existing.nextReviewAt = Date.now() + EBBINGHAUS_INTERVALS[existing.stage];
    existing.lastReviewedAt = Date.now();
    saveHearingWrong();
  }

  function startHearingReview(scope = "due") {
    const now = Date.now();
    const due = state.hearingWrong.filter((item) => !item.nextReviewAt || item.nextReviewAt <= now);
    const entries = scope === "due" ? due : state.hearingWrong;
    if (!entries.length) {
      renderHearingWrong();
      return;
    }
    startCustomPractice(entries.map((entry) => ({
      id: entry.id,
      text: entry.text,
      phonetic: entry.phonetic || "",
      translation: entry.translation,
      example: entry.example || "",
      exampleTranslation: entry.exampleTranslation || "",
      note: entry.note
    })), "hearing");
  }

  function renderHearingWrong() {
    const now = Date.now();
    const dueCount = state.hearingWrong.filter((item) => !item.nextReviewAt || item.nextReviewAt <= now).length;
    dom.navHearingWrongCount.textContent = String(state.hearingWrong.length);
    dom.reviewDueWordsButton.disabled = dueCount === 0;
    dom.reviewAllWordsButton.disabled = state.hearingWrong.length === 0;
    dom.hearingWrongSummary.textContent = state.hearingWrong.length
      ? `共 ${state.hearingWrong.length} 个错词，${dueCount} 个到期；复习间隔按艾宾浩斯曲线执行。`
      : "暂无错词，自定义词句拼错后会自动进入这里。";
    dom.hearingWrongList.replaceChildren();

    if (!state.hearingWrong.length) {
      const empty = document.createElement("div");
      empty.className = "wrongbook-empty";
      empty.innerHTML = '<div><h3>听力错词本为空</h3><p>在“我的词句”中拼错的单词、词组和句子会自动加入。</p></div>';
      dom.hearingWrongList.appendChild(empty);
      return;
    }

    state.hearingWrong.forEach((item) => {
      const card = document.createElement("article");
      card.className = "hearing-wrong-item";
      const main = document.createElement("div");
      main.className = "hearing-wrong-main";
      const english = document.createElement("div");
      english.className = "hearing-wrong-english";
      english.textContent = item.text;
      const chinese = document.createElement("div");
      chinese.className = "hearing-wrong-chinese";
      chinese.textContent = item.translation || "暂无中文翻译";
      const stage = document.createElement("div");
      stage.className = "hearing-wrong-stage";
      stage.textContent = `复习阶段 ${Math.min((item.stage || 0) + 1, EBBINGHAUS_INTERVALS.length)}/9 · 下次 ${formatReviewTime(item.nextReviewAt)}`;
      main.append(english, chinese, stage);
      const actions = document.createElement("div");
      actions.className = "hearing-wrong-actions";
      const play = document.createElement("button");
      play.type = "button";
      play.className = "small-action";
      play.dataset.action = "play";
      play.dataset.id = item.id;
      play.innerHTML = '<svg viewBox="0 0 24 24"><path d="m9 6 9 6-9 6V6Z"/></svg>';
      const retry = document.createElement("button");
      retry.type = "button";
      retry.className = "small-action primary";
      retry.dataset.action = "retry";
      retry.dataset.id = item.id;
      retry.innerHTML = '<svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v6h-6"/></svg>';
      actions.append(play, retry);
      card.append(main, actions);
      dom.hearingWrongList.appendChild(card);
    });
  }

  function formatReviewTime(timestamp) {
    if (!timestamp) return "现在";
    const diff = timestamp - Date.now();
    if (diff <= 0) return "现在";
    if (diff < 60 * 60 * 1000) return `${Math.ceil(diff / 60000)} 分钟后`;
    if (diff < 24 * 60 * 60 * 1000) return `${Math.ceil(diff / 3600000)} 小时后`;
    return `${Math.ceil(diff / 86400000)} 天后`;
  }

  function handleCustomListClick(event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const item = state.customItems.find((entry) => entry.id === button.dataset.id);
    if (!item) return;
    if (button.dataset.action === "play") {
      stopPlayback();
      const token = ++state.token;
      setPlaying(true);
      playAudio(getTextAudioSource(item.text), token).finally(() => setPlaying(false));
    }
    if (button.dataset.action === "edit") openCustomEditor(item.id);
    if (button.dataset.action === "delete") {
      state.customItems = state.customItems.filter((entry) => entry.id !== item.id);
      saveCustomItems();
      renderCustom();
    }
  }

  function handleHearingWrongClick(event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const item = state.hearingWrong.find((entry) => entry.id === button.dataset.id);
    if (!item) return;
    if (button.dataset.action === "play") {
      stopPlayback();
      const token = ++state.token;
      setPlaying(true);
      playAudio(getTextAudioSource(item.text), token).finally(() => setPlaying(false));
    }
    if (button.dataset.action === "retry") {
      startCustomPractice([{ id: item.id, text: item.text, translation: item.translation, note: item.note }], "hearing");
    }
  }

  function renderWordDirectory() {
    const query = dom.wordSearch.value.trim().toLowerCase();
    dom.directorySwitch.querySelectorAll("[data-directory]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.directory === state.directoryMode);
    });
    dom.wordGrid.replaceChildren();

    if (state.directoryMode === "numbers") {
      dom.wordSearch.placeholder = "搜索 13 或 thirteen";
      for (let number = 1; number <= 100; number += 1) {
        const english = numberToEnglish(number);
        if (query && !String(number).includes(query) && !english.includes(query)) continue;
        dom.wordGrid.appendChild(createDirectoryCard({
          number,
          index: String(number).padStart(3, "0"),
          text: english,
          hint: "点击播报"
        }));
      }
      return;
    }

    if (state.directoryMode === "months") {
      dom.wordSearch.placeholder = "搜索月份，例如 June";
      MONTHS.forEach((month, index) => {
        if (query && !month.toLowerCase().includes(query)) return;
        dom.wordGrid.appendChild(createDirectoryCard({
          index: String(index + 1).padStart(2, "0"),
          text: month,
          hint: "月份 · 点击播报",
          audioText: month,
          audioKey: `month:${month}`
        }));
      });
      return;
    }

    dom.wordSearch.placeholder = "搜索 1–31 或 twenty-seventh";
    for (let day = 1; day <= 31; day += 1) {
      const text = `the ${ordinalEnglish(day)}`;
      const index = String(day).padStart(2, "0");
      if (query && !index.includes(query) && !text.toLowerCase().includes(query)) continue;
      dom.wordGrid.appendChild(createDirectoryCard({
        index,
        text,
        hint: `${day} 号 · 点击播报`,
        audioText: text,
        audioKey: `ordinal:${day}`
      }));
    }
  }

  function createDirectoryCard({ number, index, text, hint, audioText, audioKey }) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "word-card";
    card.dataset.directoryItem = "true";
    if (number) card.dataset.number = String(number);
    if (audioText) card.dataset.audioText = audioText;
    if (audioKey) card.dataset.audioKey = audioKey;
    const key = number ? `number:${number}` : audioKey;
    card.classList.toggle("is-playing", state.playing && state.playingWord === key);

    const indexLabel = document.createElement("span");
    indexLabel.className = "word-number";
    indexLabel.textContent = index;
    const word = document.createElement("span");
    word.className = "word-text";
    word.textContent = text;
    const hintLabel = document.createElement("span");
    hintLabel.className = "word-hint";
    hintLabel.textContent = hint;
    card.append(indexLabel, word, hintLabel);
    return card;
  }

  function renderWrongBook() {
    const total = state.wrongNumbers.length + state.wrongDates.length;
    dom.navWrongCount.textContent = String(total);
    dom.startWrongRoundButton.disabled = state.wrongNumbers.length === 0;
    dom.startWrongDateRoundButton.disabled = state.wrongDates.length === 0;
    dom.clearWrongBookButton.disabled = total === 0;
    dom.wrongBookList.replaceChildren();

    if (!total) {
      const empty = document.createElement("div");
      empty.className = "wrongbook-empty";
      const inner = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = "错题本还是空的";
      const copy = document.createElement("p");
      copy.textContent = "数字或日期答错后会自动记录在这里，可以播放发音或直接重练。";
      inner.append(title, copy);
      empty.appendChild(inner);
      dom.wrongBookList.appendChild(empty);
      return;
    }

    state.wrongNumbers.forEach((number, index) => {
      dom.wrongBookList.appendChild(createWrongBookItem({
        type: "number",
        index,
        value: formatNumber(number),
        word: numberToEnglish(number),
        note: "数字错题 · 重练时填写阿拉伯数字",
        key: `number:${number}`
      }));
    });

    state.wrongDates.forEach((entry, index) => {
      dom.wrongBookList.appendChild(createWrongBookItem({
        type: "date",
        index,
        value: entry.mode === "phrase" ? entry.data.answer : String(entry.data.day),
        word: entry.data.englishAnswer,
        note: entry.mode === "phrase" ? "日期错题 · 星期 + 日号 + 月份" : "日期数字错题 · 填写阿拉伯数字",
        key: entry.key
      }));
    });
  }

  function createWrongBookItem({ type, index, value, word, note, key }) {
    const item = document.createElement("article");
    item.className = "wrongbook-item";

    const main = document.createElement("div");
    main.className = "wrongbook-item-main";
    const valueLabel = document.createElement("span");
    valueLabel.className = "wrongbook-item-number";
    valueLabel.textContent = value;
    const wordLabel = document.createElement("span");
    wordLabel.className = "wrongbook-item-word";
    wordLabel.textContent = word;
    const noteLabel = document.createElement("span");
    noteLabel.className = "wrongbook-item-note";
    noteLabel.textContent = note;
    main.append(valueLabel, wordLabel, noteLabel);

    const actions = document.createElement("div");
    actions.className = "wrongbook-item-actions";
    const play = document.createElement("button");
    play.type = "button";
    play.className = "small-action";
    play.dataset.action = "play";
    play.dataset.type = type;
    play.dataset.index = String(index);
    play.title = "播放发音";
    play.setAttribute("aria-label", "播放发音");
    play.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 9 6-9 6V6Z"/></svg>';
    const retry = document.createElement("button");
    retry.type = "button";
    retry.className = "small-action primary";
    retry.dataset.action = "retry";
    retry.dataset.type = type;
    retry.dataset.index = String(index);
    retry.title = "单独重练";
    retry.setAttribute("aria-label", "单独重练");
    retry.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v6h-6"/></svg>';
    actions.append(play, retry);
    item.dataset.key = key;
    item.classList.toggle("is-playing", state.playing && state.playingWord === key);
    item.append(main, actions);
    return item;
  }

  async function playWrongBookEntry(type, index) {
    const entry = type === "number"
      ? { key: `number:${state.wrongNumbers[index]}`, number: state.wrongNumbers[index] }
      : state.wrongDates[index];
    if (!entry) return;
    if (state.playingWord === entry.key && state.playing) {
      stopPlayback();
      return;
    }
    stopPlayback();
    const token = ++state.token;
    state.playingWord = entry.key;
    setPlaying(true);
    renderWrongBook();
    try {
      if (type === "number") {
        await playNumberAudio(entry.number, token);
      } else {
        await playAudio(getTextAudioSource(entry.data.audioText), token);
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (token === state.token) {
        setPlaying(false);
        state.playingWord = null;
        renderWrongBook();
      }
    }
  }

  function handleWrongBookClick(event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const type = button.dataset.type;
    const index = Number(button.dataset.index);
    if (button.dataset.action === "play") {
      playWrongBookEntry(type, index);
      return;
    }
    if (button.dataset.action !== "retry") return;
    if (type === "number") {
      switchTab("dictation");
      startRound([state.wrongNumbers[index]], "wrong");
      return;
    }
    const entry = state.wrongDates[index];
    if (!entry) return;
    state.dateMode = entry.mode;
    switchTab("dates");
    startDateRound([entry.data], "wrong", entry.mode);
  }

  function dateWrongKey(item, mode) {
    return `${mode}:${item.weekday || ""}:${item.day}:${item.month || ""}`;
  }

  function addWrongDate(item) {
    const mode = state.dateMode;
    const key = dateWrongKey(item, mode);
    if (!state.wrongDates.some((entry) => entry.key === key)) {
      state.wrongDates.push({
        key,
        mode,
        createdAt: Date.now(),
        data: { ...item }
      });
      saveWrongData();
    }
    renderWrongBook();
  }

  function removeWrongDate(item) {
    const key = dateWrongKey(item, state.dateMode);
    const next = state.wrongDates.filter((entry) => entry.key !== key);
    if (next.length !== state.wrongDates.length) {
      state.wrongDates = next;
      saveWrongData();
    }
    renderWrongBook();
  }

  function addWrongNumber(number) {
    const value = Number(number);
    if (!state.wrongNumbers.includes(value)) {
      state.wrongNumbers.push(value);
      state.wrongNumbers.sort((a, b) => a - b);
      saveWrongData();
    }
  }

  function removeWrongNumber(number) {
    const value = Number(number);
    state.wrongNumbers = state.wrongNumbers.filter((entry) => entry !== value);
    saveWrongData();
  }

  function clearWrongBook() {
    if (!state.wrongNumbers.length && !state.wrongDates.length) return;
    state.wrongNumbers = [];
    state.wrongDates = [];
    saveWrongData();
    renderWrongBook();
  }

  function numberToEnglish(number) {
    const value = Number(number);
    if (!Number.isFinite(value) || value < 0) return String(number);
    if (value === 0) return "zero";

    const parts = [];
    const scales = [
      [1000000000, "billion"],
      [1000000, "million"],
      [1000, "thousand"]
    ];
    let remaining = value;

    scales.forEach(([scale, label]) => {
      if (remaining >= scale) {
        const count = Math.floor(remaining / scale);
        parts.push(`${underOneThousand(count)} ${label}`);
        remaining %= scale;
      }
    });
    if (remaining > 0) parts.push(underOneThousand(remaining));
    return parts.join(" ");
  }

  function underOneThousand(number) {
    const value = Number(number);
    const parts = [];
    if (value >= 100) {
      parts.push(`${ONES[Math.floor(value / 100)]} hundred`);
    }
    let remainder = value % 100;
    if (remainder >= 20) {
      const tens = Math.floor(remainder / 10) * 10;
      parts.push(TENS[tens]);
      remainder %= 10;
    }
    if (remainder > 0) parts.push(ONES[remainder]);
    return parts.join(" ");
  }

  function formatNumber(number) {
    return new Intl.NumberFormat("en-US").format(Number(number));
  }

  function shuffle(values) {
    const result = values.slice();
    for (let index = result.length - 1; index > 0; index -= 1) {
      const swap = Math.floor(Math.random() * (index + 1));
      [result[index], result[swap]] = [result[swap], result[index]];
    }
    return result;
  }

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }
})();
