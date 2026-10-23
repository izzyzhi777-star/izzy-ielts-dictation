(() => {
  "use strict";

  const SETTINGS_KEY = "number-dictation-settings-v2";
  const WRONG_KEY = "number-dictation-wrong-v2";
  const CUSTOM_KEY = "number-dictation-custom-v1";
  const PREDICTION_KEY = "number-prediction-items-v1";
  const DELETED_CUSTOM_KEY = "number-dictation-deleted-custom-v1";
  const DELETED_PREDICTION_KEY = "number-prediction-deleted-v1";
  const HEARING_WRONG_KEY = "number-dictation-hearing-wrong-v1";
  const SYNC_KEY = "izzy-ielts-sync-v1";
  const PREPARED_LISTENING_CHUNK_SIZE = 60;
  const LISTENING_PROGRESS_KEY = "number-dictation-listening-progress-v1";
  const CUSTOM_PRACTICE_POSITION_KEY = "number-dictation-custom-practice-position-v1";
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
  const neuralVoice = window.IzzyNeuralVoice;
  const RANGE_CONFIG = {
    basic: { min: 1, max: 100, count: 100, shuffled: false },
    hundreds: { min: 100, max: 1000, count: 100, shuffled: true },
    thousands: { min: 1000, max: 10000, count: 100, shuffled: true },
    large: { min: 1, max: 90000000000, count: 100, shuffled: true },
    phone: { count: 50, shuffled: true },
    years: { min: 1000, max: 1999, count: 30, shuffled: true }
  };

  const ONES = [
    "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
    "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"
  ];
  const TENS = {
    20: "twenty", 30: "thirty", 40: "forty", 50: "fifty",
    60: "sixty", 70: "seventy", 80: "eighty", 90: "ninety"
  };
  const PHONE_POOL = ["09651311", "9947578991", "4769933091", "02099778", "01138820", "9094065988", "3536008887", "02873666", "7441702699", "09534430", "07884764", "3683822695", "9564118651", "04275582", "9202366656", "08101191", "3278753300", "4737366682", "7778109877", "01348991", "9901200008", "7753202885", "09881224", "8299377053", "9277523466", "01122277", "4345335409", "04153360", "2267602006", "04288244", "06322445", "08666767", "2622019021", "5187444061", "02798255", "06472228", "3008539955", "05577756", "09933270", "05862258", "04424185", "6066687285", "07278661", "05082218", "06668501", "3001706333", "7197877081", "8826319777", "4486552324", "9005004449", "9605030071", "03349349", "05386666", "7993339953", "01117950", "04400145", "5255611181", "00096488", "3644448973", "8932784555", "03511579", "6594297790", "08202755", "01241225", "7345031555", "01142266", "08258838", "05529232", "2111066227", "3982011776", "8336446965", "3264644800", "04483711", "0991108991", "01632252", "3797669765", "09951562", "6777944426", "6497781870", "08899378", "8561224663", "8354417584", "5491123192", "03241994", "8581881411", "07249944", "0010105288", "8081527888", "9200763972", "03390335", "02244507", "7322521175", "4969770564", "7290018329", "07417737", "08703155", "04470561", "8677469916", "2413625576", "7226650286", "02889993", "7508688260", "05475666", "2998144474", "06672247", "4002934739", "7442607513", "8098852334", "06722679", "2133616715", "01205587", "02113138", "2878001138", "03321030", "08897969", "6118322407", "01634800", "6675850886", "06047777", "08456612", "6925222686", "9927790002", "7941144281", "06976888", "09033611", "2455085149", "09634992", "5506622831", "02839666", "4402778705", "4921123888", "4115907434", "08288502", "04112292", "5659059992", "06666652", "03146899", "04477716", "4454777281", "3354559069", "06770998", "09332111", "03733779", "9334536444", "07007876", "03354344", "02502633", "07329926", "04847727", "09533500", "5917936686", "01987633", "3361208007", "02822432", "8179547777", "7730302647", "07499072", "8176557838", "4005442304", "8442116927", "2881352226", "5577269669", "03890772", "5552898581", "9909991309", "06651025", "06703009", "3888567622", "08744955", "9390006999", "07060003", "3327436553", "9233889622", "07898225", "6544260186", "08889754", "07842444", "03770549", "2255138036", "9185655569", "3563381147", "5002029384", "01633639", "03877343", "7751194271", "6755331455", "04527750", "07984399", "07294733", "2260484451", "07503222", "06854448", "06735663", "3618808843", "06942992", "01366437", "3911193953", "02811283", "4405564468", "08898857", "06772359", "02114441", "02081833", "4991150759", "6660806584", "4339364412", "4133130777", "08677157", "02211047", "04732599", "0029444179", "3771472380", "02339371", "9145380117", "0039708609", "08890026", "05053345", "4355999960", "4848827926", "6244267731", "05777785", "02999813", "2437999104", "6007250522", "5572101699", "7114844056", "02116169", "09989006", "5805705555", "08166444", "02552395", "08127767", "2271132990", "06997731", "6555550688", "05301170", "02114822", "8357092233", "03444366", "01166647", "01511085", "8211894096", "03776112", "06655388", "9664765629", "9993362748", "8511188742", "5665318688", "2722700672", "6307934166", "4447437649", "09937981", "07700341", "06767799", "4425179008", "08806225", "01008734", "02284570", "7749222752", "8830377480", "3441934550", "5528777509", "2902815574", "02007732", "8000111801", "08588030", "07122995", "8724553478", "06647771", "06220224", "4382337346", "09111118", "2255713887", "8445737044", "1104567347", "3362019564", "06199378", "06566756", "4815798991", "01191033", "03918466", "03050038", "08893094", "5512256362", "06603851", "03439993", "9670433948", "01728009", "8999685877", "4955466164", "00055928", "05222242", "05300648", "02330678", "2883932235", "03006336", "9566654402", "05388894", "8114311717", "4077115628"];

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
    mobileSettingsButton: $("mobileSettingsButton"),
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
    customPracticeStartSelect: $("customPracticeStartSelect"),
    customQuestionScreen: $("customQuestionScreen"),
    customQuestionIndex: $("customQuestionIndex"),
    customQuestionTotal: $("customQuestionTotal"),
    customListenHint: $("customListenHint"),
    customPlayButton: $("customPlayButton"),
    customPlayStatus: $("customPlayStatus"),
    customReplayButton: $("customReplayButton"),
    customReminderButton: $("customReminderButton"),
    customSubmitHint: $("customSubmitHint"),
    customAnswerInput: $("customAnswerInput"),
    customAnswerLabel: $("customAnswerLabel"),
    practiceReminder: $("practiceReminder"),
    submitCustomButton: $("submitCustomButton"),
    nextCustomButton: $("nextCustomButton"),
    customResult: $("customResult"),
    customResultMark: $("customResultMark"),
    customResultNote: $("customResultNote"),
    customCorrectAnswer: $("customCorrectAnswer"),
    customCorrectAnswerLabel: $("customCorrectAnswerLabel"),
    customCorrectPhoneticLabel: $("customCorrectPhoneticLabel"),
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
    newPredictionButton: $("newPredictionButton"),
    startPredictionPracticeButton: $("startPredictionPracticeButton"),
    predictionPracticeStartSelect: $("predictionPracticeStartSelect"),
    predictionEditor: $("predictionEditor"),
    predictionEditorTitle: $("predictionEditorTitle"),
    predictionValueInput: $("predictionValueInput"),
    predictionTypeInput: $("predictionTypeInput"),
    predictionSpokenInput: $("predictionSpokenInput"),
    predictionChineseInput: $("predictionChineseInput"),
    predictionNoteInput: $("predictionNoteInput"),
    savePredictionButton: $("savePredictionButton"),
    cancelPredictionEditButton: $("cancelPredictionEditButton"),
    closePredictionEditorButton: $("closePredictionEditorButton"),
    predictionSaveStatus: $("predictionSaveStatus"),
    predictionItemCount: $("predictionItemCount"),
    predictionList: $("predictionList"),
    customList: $("customList"),
    navHearingWrongCount: $("navHearingWrongCount"),
    reviewDueWordsButton: $("reviewDueWordsButton"),
    reviewAllWordsButton: $("reviewAllWordsButton"),
    hearingPracticeStartSelect: $("hearingPracticeStartSelect"),
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
    listeningNowPanel: $("listeningNowPanel"),
    listeningStartSelect: $("listeningStartSelect"),
    listeningStartFromButton: $("listeningStartFromButton"),
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
    copySyncPackageButton: $("copySyncPackageButton"),
    connectFromClipboardButton: $("connectFromClipboardButton"),
    copyVocabularyButton: $("copyVocabularyButton"),
    importVocabularyButton: $("importVocabularyButton"),
    exportVocabularyButton: $("exportVocabularyButton"),
    createSyncLinkButton: $("createSyncLinkButton"),
    syncAutoToggle: $("syncAutoToggle"),
    syncStatus: $("syncStatus")
  };

  const settings = loadSettings();
  const loadedWrongData = loadWrongData();
  const loadedDeletedCustomIds = loadDeletedCustomIds();
  const loadedDeletedPredictionIds = loadDeletedPredictionIds();
  const loadedCustomItems = loadCustomItems().filter((item) => !loadedDeletedCustomIds.includes(item.id));
  const loadedHearingWrong = loadHearingWrong();
  const loadedSyncConfig = loadSyncConfig();
  const state = {
    activeTab: "dictation",
    range: "basic",
    wrongNumbers: loadedWrongData.numbers,
    wrongDates: loadedWrongData.dates,
    customItems: loadedCustomItems,
    deletedCustomIds: loadedDeletedCustomIds,
    deletedPredictionIds: loadedDeletedPredictionIds,
    predictionItems: loadPredictionItems().filter((item) => !loadedDeletedPredictionIds.includes(item.id)),
    predictionEditorId: null,
    customEditorId: null,
    customSession: createEmptyCustomSession(),
    hearingWrong: loadedHearingWrong,
    sync: {
      ...loadedSyncConfig,
      inFlight: false,
      queued: false,
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
    voicePackPromise: null,
    audioBlobCache: new Map(),
    continuousManifest: null,
    singleWordManifest: null,
    singleBilingualManifest: null,
    continuousManifestPromise: null,
    continuousAudioPrefetched: false,
    singleWordAudioPrefetched: false,
    singleBilingualAudioPrefetched: false,
    previewPlaylist: [],
    previewKey: "",
    pendingStartIndex: null,
    listeningStartOptionsKey: "",
    neuralCooldownUntil: 0,
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
      audioUrl: "",
      timeline: [],
      totalDuration: 0,
      preparing: false,
      prepareToken: 0,
      consumedSeconds: 0,
      lastTime: 0,
      currentTrack: -1,
      sleepDeadline: 0,
      sleepAudioDeadline: 0,
      sleepTimer: null,
      mediaHandlersReady: false,
      directFallback: false,
      continuous: false,
      internalOperation: false,
      internalOperationTimer: null,
      interruptionPaused: false,
      resumeAfterInterruption: false,
      interruptionResumeTimer: null,
      watchdogTimer: null,
      lastActivityAt: 0,
      lastRecoveryAt: 0,
      preparedCache: new Map(),
      preparedQueueActive: false
    },
    autoSubmitTimer: null,
    lastThreeHintAt: 0,
    preloaded: ""
  };

  init();

  function init() {
    state.audio.preload = "auto";
    state.audio.setAttribute("playsinline", "");
    state.audio.setAttribute("webkit-playsinline", "");
    state.listening.audio = new Audio();
    state.listening.audio.preload = "auto";
    state.listening.audio.setAttribute("playsinline", "");
    state.listening.audio.setAttribute("webkit-playsinline", "");
    state.listening.audio.volume = 1;
    bindEvents();
    applySyncHash();
    state.voicePackPromise = loadVoicePackIndex();
    state.continuousManifestPromise = loadContinuousManifest();
    loadBundledVocabulary();
    setupListeningAudio();
    setupMediaSession();
    state.ipaLoadPromise = loadIpaDictionary();
    renderAll();
    if (state.sync.autoSync && state.sync.token && state.sync.gistId) {
      window.setTimeout(() => syncCloudData(false), 1200);
    }
    window.setInterval(() => {
      if (state.sync.autoSync && state.sync.token && state.sync.gistId && !document.hidden) {
        syncCloudData(false);
      }
    }, 60000);
    const syncWhenAvailable = () => {
      if (state.sync.autoSync && state.sync.token && state.sync.gistId) syncCloudData(false);
    };
    const resumeListeningWhenAvailable = () => {
      if (state.listening.interruptionPaused) scheduleListeningResumeAfterInterruption();
    };
    window.addEventListener("focus", () => {
      syncWhenAvailable();
      resumeListeningWhenAvailable();
    });
    window.addEventListener("online", syncWhenAvailable);
    window.addEventListener("pageshow", () => {
      syncWhenAvailable();
      resumeListeningWhenAvailable();
    });
    window.addEventListener("pagehide", () => {
      if (state.sync.autoSync && state.sync.token && state.sync.gistId) syncCloudData(false);
    });
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js", { updateViaCache: "none" }).catch((error) => console.debug("Service worker unavailable.", error));
    }
  }

  function beginListeningInternalOperation(timeout = 1800) {
    state.listening.internalOperation = true;
    if (state.listening.internalOperationTimer) window.clearTimeout(state.listening.internalOperationTimer);
    state.listening.internalOperationTimer = window.setTimeout(() => {
      state.listening.internalOperation = false;
      state.listening.internalOperationTimer = null;
    }, timeout);
  }

  function endListeningInternalOperation() {
    if (state.listening.internalOperationTimer) window.clearTimeout(state.listening.internalOperationTimer);
    state.listening.internalOperationTimer = null;
    state.listening.internalOperation = false;
  }

  function stopListeningWatchdog() {
    if (state.listening.watchdogTimer) window.clearInterval(state.listening.watchdogTimer);
    state.listening.watchdogTimer = null;
    state.listening.lastActivityAt = 0;
    state.listening.lastRecoveryAt = 0;
  }

  function recoverListeningPlayback() {
    if (!state.listening.started || !state.listening.playing || state.listening.interruptionPaused || state.listening.internalOperation) return;
    const audio = state.listening.audio;
    if (!audio?.src) return;
    const now = Date.now();
    if (now - state.listening.lastRecoveryAt < 3000) return;
    state.listening.lastRecoveryAt = now;
    if (state.listening.continuous) {
      if (state.listening.preparedQueueActive) {
        if (audio.paused && !audio.ended) {
          audio.play().catch((error) => console.debug("Prepared playback resume failed.", error));
        }
        return;
      }
      if (audio.ended && state.listening.timeline.length) {
        seekListeningToIndex(state.listening.index);
      } else if (audio.paused) {
        audio.play().catch((error) => console.debug("Continuous playback resume failed.", error));
      }
      return;
    }
    if (state.listening.timeline.length) {
      seekListeningToIndex(state.listening.index);
      return;
    }
    const token = ++state.listening.token;
    playListeningSequentially(state.listening.playlist, token, state.listening.index).catch((error) => {
      if (token !== state.listening.token) return;
      console.warn("Listening recovery failed.", error);
    });
  }

  function startListeningWatchdog() {
    stopListeningWatchdog();
    state.listening.lastActivityAt = Date.now();
    state.listening.watchdogTimer = window.setInterval(() => {
      if (document.hidden || !state.listening.started || !state.listening.playing || state.listening.interruptionPaused || state.listening.internalOperation) return;
      const audio = state.listening.audio;
      if (!audio?.src) return;
      if (audio.paused) {
        recoverListeningPlayback();
        return;
      }
      if (Date.now() - state.listening.lastActivityAt > 12000) {
        state.listening.lastActivityAt = Date.now();
        recoverListeningPlayback();
      }
    }, 2200);
  }

  function pauseForListeningInterruption() {
    if (!state.listening.started || !state.listening.playing) return;
    state.listening.interruptionPaused = true;
    state.listening.resumeAfterInterruption = true;
    state.listening.playing = false;
    try { state.listening.audio.pause(); } catch (error) { console.debug(error); }
    updateMediaSessionState("paused");
    renderListening();
  }

  function scheduleListeningResumeAfterInterruption() {
    if (!state.listening.started || !state.listening.interruptionPaused || !state.listening.resumeAfterInterruption) return;
    if (state.listening.interruptionResumeTimer) window.clearTimeout(state.listening.interruptionResumeTimer);
    state.listening.interruptionResumeTimer = window.setTimeout(async () => {
      if (!state.listening.started || !state.listening.interruptionPaused || state.listening.playing) return;
      const audio = state.listening.audio;
      if (!audio?.src) return;
      try {
        if (typeof audio.setSinkId === "function" && state.listening.resumeSinkId) {
          await audio.setSinkId(state.listening.resumeSinkId).catch((error) => console.debug("Could not restore audio route.", error));
        }
        audio.volume = 0;
        await audio.play();
        window.setTimeout(() => {
          if (!state.listening.started || !state.listening.playing || audio.paused) return;
          audio.volume = 1;
          state.listening.interruptionPaused = false;
          state.listening.resumeAfterInterruption = false;
          updateMediaSessionState("playing");
          renderListening();
        }, 1200);
      } catch (error) {
        console.debug("Listening resume after interruption skipped.", error);
      }
    }, 1600);
  }

  function setupListeningAudio() {
    const audio = state.listening.audio;
    audio.addEventListener("loadedmetadata", () => {
      endListeningInternalOperation();
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        state.listening.totalDuration = audio.duration;
      }
      updateMediaSessionPosition();
    });
    audio.addEventListener("canplay", endListeningInternalOperation);
    audio.addEventListener("loadeddata", endListeningInternalOperation);
    audio.addEventListener("play", () => {
      if (!state.listening.started) return;
      state.listening.playing = true;
      state.listening.interruptionPaused = false;
      state.listening.lastTime = audio.currentTime;
      state.listening.lastActivityAt = Date.now();
      updateMediaSessionState("playing");
      renderListening();
    });
    audio.addEventListener("pause", () => {
      if (!state.listening.started || state.listening.internalOperation) return;
      if (state.listening.playing) {
        state.listening.interruptionPaused = true;
        state.listening.resumeAfterInterruption = true;
        state.listening.playing = false;
        scheduleListeningResumeAfterInterruption();
        updateMediaSessionState("paused");
        renderListening();
      }
    });
    audio.addEventListener("interruptstart", pauseForListeningInterruption);
    audio.addEventListener("interruptend", () => {
      if (!state.listening.started) return;
      state.listening.playing = false;
      scheduleListeningResumeAfterInterruption();
      updateMediaSessionState("paused");
      renderListening();
    });
    audio.addEventListener("timeupdate", updateListeningProgress);
    audio.addEventListener("error", () => {
      endListeningInternalOperation();
      if (!state.listening.started) return;
      dom.listeningEnglish.textContent = "音频暂时不可用";
      dom.listeningChinese.textContent = "请重新点击播放，已生成的语音会继续保留。";
      state.listening.playing = false;
      renderListening();
    });
  }

  function setupMediaSession() {
    if (!("mediaSession" in navigator) || state.listening.mediaHandlersReady) return;
    state.listening.mediaHandlersReady = true;
    const handlers = {
      play: () => resumeListeningAudio(),
      pause: () => pauseListeningAudio(),
      nexttrack: () => changeListeningIndex(1),
      previoustrack: () => changeListeningIndex(-1),
      seekbackward: (details) => seekListeningBy(-(details.seekOffset || 15)),
      seekforward: (details) => seekListeningBy(details.seekOffset || 15),
      stop: () => stopListening()
    };
    Object.entries(handlers).forEach(([action, handler]) => {
      try { navigator.mediaSession.setActionHandler(action, handler); } catch (error) { console.debug(error); }
    });
  }

  function updateMediaSessionMetadata(entry, index = state.listening.index) {
    if (!("mediaSession" in navigator) || !window.MediaMetadata || !entry) return;
    const title = String(entry.english || entry.audioText || "IELTS Dictation").slice(0, 120);
    const subtitle = String(entry.chinese || "").slice(0, 120);
    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist: subtitle || "IZZY IELTS-DICTATION",
      album: `Sonia 英式神经女声 · ${index + 1} / ${state.listening.playlist.length}`
    });
  }

  function updateMediaSessionState(mediaState) {
    if (!("mediaSession" in navigator)) return;
    try { navigator.mediaSession.playbackState = mediaState; } catch (error) { console.debug(error); }
  }

  function updateMediaSessionPosition() {
    const audio = state.listening.audio;
    if (!("mediaSession" in navigator) || !navigator.mediaSession.setPositionState) return;
    if (!Number.isFinite(audio.duration) || audio.duration <= 0) return;
    try {
      navigator.mediaSession.setPositionState({
        duration: audio.duration,
        playbackRate: audio.playbackRate || 1,
        position: Math.min(audio.currentTime, Math.max(0, audio.duration - 0.01))
      });
    } catch (error) {
      console.debug(error);
    }
  }

  function updateListeningProgress() {
    if (!state.listening.started) return;
    const audio = state.listening.audio;
    const delta = audio.currentTime - state.listening.lastTime;
    if (Number.isFinite(delta) && delta > 0 && delta < 10) {
      state.listening.consumedSeconds += delta * (Number(audio.playbackRate) || 1);
    }
    state.listening.lastTime = audio.currentTime;
    state.listening.lastActivityAt = Date.now();
    const duration = Number.isFinite(audio.duration) && audio.duration > 0
      ? audio.duration
      : state.listening.totalDuration;
    if (duration > 0 && state.listening.timeline.length) {
      const scaledTime = (audio.currentTime / duration) * state.listening.totalDuration;
      const index = state.listening.timeline.findIndex((segment) => scaledTime < segment.end);
      const segment = state.listening.timeline[index < 0 ? state.listening.timeline.length - 1 : index];
      setListeningTrack(segment?.entryIndex ?? (index < 0 ? state.listening.timeline.length - 1 : index));
    }
    updateMediaSessionPosition();
    if (state.listening.sleepAudioDeadline > 0 && state.listening.consumedSeconds >= state.listening.sleepAudioDeadline) {
      stopListening();
      dom.listeningSleepStatus.textContent = "睡眠模式已结束";
    }
  }

  function setListeningTrack(index) {
    if (index < 0 || index >= state.listening.playlist.length) return;
    if (state.listening.currentTrack === index) return;
    state.listening.currentTrack = index;
    state.listening.index = index;
    saveListeningProgress(index);
    const current = state.listening.playlist[index];
    updateMediaSessionMetadata(current, index);
    renderListening();
  }

  function resumeListeningAudio() {
    if (!state.listening.audio?.src) return;
    state.listening.playing = true;
    state.listening.interruptionPaused = false;
    state.listening.resumeAfterInterruption = false;
    state.listening.audio.volume = 1;
    state.listening.audio.play().catch((error) => {
      console.debug(error);
      state.listening.playing = false;
      renderListening();
    });
  }

  function pauseListeningAudio() {
    state.listening.playing = false;
    try { state.listening.audio.pause(); } catch (error) { console.debug(error); }
    renderListening();
  }

  function seekListeningBy(seconds) {
    const audio = state.listening.audio;
    if (!state.listening.started || !audio?.src || !Number.isFinite(audio.duration)) return;
    const target = Math.max(0, Math.min(audio.duration - 0.05, audio.currentTime + seconds));
    audio.currentTime = target;
    state.listening.lastTime = target;
    updateListeningProgress();
  }

  function applySyncHash() {
    try {
      const match = location.hash.match(/^#sync=([^&]+)$/);
      if (!match) return;
      const payload = JSON.parse(atob(match[1]));
      if (!payload?.t || !payload?.g) return;
      state.sync.token = payload.t;
      state.sync.gistId = payload.g;
      state.sync.autoSync = true;
      saveSyncConfig();
      history.replaceState(null, "", `${location.pathname}${location.search}`);
      window.setTimeout(() => syncCloudData(false), 900);
    } catch (error) {
      console.warn("Could not apply automatic sync link.", error);
    }
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

  function prefetchContinuousAudio(mode = "all") {
    const sources = {
      all: ["continuousAudioPrefetched", "audio/continuous/custom-uk-us.mp3"],
      single: ["singleWordAudioPrefetched", "audio/continuous/custom-single-words-uk-us.mp3"],
      "single-bilingual": ["singleBilingualAudioPrefetched", "audio/continuous/custom-single-words-uk-us-cn-note.mp3"]
    };
    const selected = sources[mode] || sources.all;
    const flag = selected[0];
    const source = selected[1];
    if (state[flag]) return;
    state[flag] = true;
    fetch(source, { cache: "force-cache" }).catch((error) => {
      state[flag] = false;
      console.debug("Continuous audio preload skipped.", error);
    });
  }

  async function loadContinuousManifest() {
    try {
      const responses = await Promise.all([
        fetch("audio/continuous/custom-uk-us.json?v=20261013", { cache: "no-cache" }),
        fetch("audio/continuous/custom-single-words-uk-us.json?v=20261013", { cache: "no-cache" }),
        fetch("audio/continuous/custom-single-words-uk-us-cn-note.json?v=20261013", { cache: "no-cache" })
      ]);
      state.continuousManifest = responses[0].ok ? await responses[0].json() : null;
      state.singleWordManifest = responses[1].ok ? await responses[1].json() : null;
      state.singleBilingualManifest = responses[2].ok ? await responses[2].json() : null;
    } catch (error) {
      console.debug("Continuous manifest unavailable.", error);
    }
    return state.continuousManifest;
  }

  async function loadVoicePackIndex() {
    try {
      const response = await fetch("audio/voice-pack/index.json?v=20261013", { cache: "no-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      state.voicePackIndex = await response.json();
      state.voicePackLoaded = true;
    } catch (error) {
      state.voicePackIndex = {};
      state.voicePackLoaded = false;
    }
    return state.voicePackIndex;
  }

  function loadListeningProgress() {
    try {
      const value = Number(localStorage.getItem(LISTENING_PROGRESS_KEY));
      return Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
    } catch (error) {
      return 0;
    }
  }

  function saveListeningProgress(index) {
    try {
      localStorage.setItem(LISTENING_PROGRESS_KEY, String(Math.max(0, Math.floor(Number(index) || 0))));
    } catch (error) {
      // Private browsing may block storage; playback still works without it.
    }
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      const loaded = { ...DEFAULT_SETTINGS, ...(raw ? JSON.parse(raw) : {}) };
      loaded.voice = "sonia";
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
      const rawNumbers = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed.numbers)
          ? parsed.numbers
          : [];
      const numbers = rawNumbers.map((entry) => {
        if (typeof entry === "string" && entry.startsWith("phone:") && /^\d{8,10}$/.test(entry.slice(6))) return entry;
        if (typeof entry === "string" && entry.startsWith("year:") && Number(entry.slice(5)) >= 1000 && Number(entry.slice(5)) < 2000) return entry;
        const value = Number(entry);
        return Number.isFinite(value) && value >= 1 && value <= 90000000000 ? value : null;
      }).filter((entry) => entry !== null);
      const dates = !Array.isArray(parsed) && Array.isArray(parsed.dates) ? parsed.dates : [];
      return {
        numbers: Array.from(new Set(numbers)).sort(compareWrongEntries),
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

  function loadCustomPracticePositionId() {
    try {
      const parsed = JSON.parse(localStorage.getItem(CUSTOM_PRACTICE_POSITION_KEY) || "{}");
      return String(parsed.itemId || "");
    } catch (error) {
      return "";
    }
  }

  function saveCustomPracticePositionId(itemId) {
    try {
      if (!itemId) return;
      localStorage.setItem(CUSTOM_PRACTICE_POSITION_KEY, JSON.stringify({ itemId: String(itemId), savedAt: Date.now() }));
    } catch (error) {
      // Private browsing may block storage; the picker still works in this session.
    }
  }

  function loadDeletedCustomIds() {
    try {
      const raw = localStorage.getItem(DELETED_CUSTOM_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch (error) {
      return [];
    }
  }

  function saveDeletedCustomIds() {
    try {
      localStorage.setItem(DELETED_CUSTOM_KEY, JSON.stringify(state.deletedCustomIds));
    } catch (error) {
      console.warn("Could not save deleted vocabulary ids.", error);
    }
    scheduleCloudSync();
  }

  function loadDeletedPredictionIds() {
    try {
      const raw = localStorage.getItem(DELETED_PREDICTION_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
    } catch (error) {
      return [];
    }
  }

  function saveDeletedPredictionIds() {
    try {
      localStorage.setItem(DELETED_PREDICTION_KEY, JSON.stringify(state.deletedPredictionIds));
    } catch (error) {
      console.warn("Could not save deleted prediction ids.", error);
    }
    scheduleCloudSync();
  }

  function loadPredictionItems() {
    try {
      const raw = localStorage.getItem(PREDICTION_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.filter((item) => item && item.value) : [];
    } catch (error) {
      console.warn("Could not load prediction items.", error);
      return [];
    }
  }

  function savePredictionItems() {
    try {
      localStorage.setItem(PREDICTION_KEY, JSON.stringify(state.predictionItems));
    } catch (error) {
      console.warn("Could not save prediction items.", error);
    }
    scheduleCloudSync();
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
    if (state.sync.inFlight) {
      state.sync.queued = true;
      return;
    }
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
      deletedCustomIds: state.deletedCustomIds,
      deletedPredictionIds: state.deletedPredictionIds,
      predictionItems: state.predictionItems,
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
    state.sync.autoSync = true;
    dom.syncAutoToggle.checked = true;
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
    state.sync.autoSync = true;
    dom.syncAutoToggle.checked = true;
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
      updateSyncStatus("同步空间已创建。点击“复制手机自动同步链接”，在手机 Safari 打开一次即可。");
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
    state.sync.autoSync = true;
    dom.syncAutoToggle.checked = true;
    saveSyncConfig();
    await syncCloudData(true);
    updateSyncStatus("连接成功，自动同步已开启。");
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
      if (state.sync.queued) {
        state.sync.queued = false;
        window.setTimeout(() => syncCloudData(false), 1200);
      }
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
      deletedCustomIds: Array.from(new Set([...(local.deletedCustomIds || []), ...(remote.deletedCustomIds || [])])),
      deletedPredictionIds: Array.from(new Set([...(local.deletedPredictionIds || []), ...(remote.deletedPredictionIds || [])])),
      customItems: mergeById(local.customItems, remote.customItems)
        .filter((item) => !new Set([...(local.deletedCustomIds || []), ...(remote.deletedCustomIds || [])]).has(item.id)),
      predictionItems: mergeById(local.predictionItems, remote.predictionItems)
        .filter((item) => !new Set([...(local.deletedPredictionIds || []), ...(remote.deletedPredictionIds || [])]).has(item.id)),
      hearingWrong: mergeById(local.hearingWrong, remote.hearingWrong, "lastReviewedAt"),
      wrongNumbers: Array.from(new Set([...(local.wrongNumbers || []), ...(remote.wrongNumbers || [])])).sort(compareWrongEntries),
      wrongDates: mergeDateWrong(local.wrongDates, remote.wrongDates)
    };
  }

  function applySyncSnapshot(snapshot) {
    if (!snapshot) return;
    state.sync.applyingRemote = true;
    Object.assign(settings, snapshot.settings || {});
    settings.voice = "sonia";
    state.deletedCustomIds = snapshot.deletedCustomIds || [];
    state.deletedPredictionIds = snapshot.deletedPredictionIds || [];
    state.customItems = (snapshot.customItems || []).filter((item) => !state.deletedCustomIds.includes(item.id));
    state.predictionItems = (snapshot.predictionItems || []).filter((item) => !state.deletedPredictionIds.includes(item.id));
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
        ? `自动同步已开启 · ${state.sync.gistId.slice(0, 10)}…${state.sync.lastSyncAt ? ` · 上次同步 ${new Date(state.sync.lastSyncAt).toLocaleTimeString("zh-CN")}` : ""}`
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
      range: "basic",
      types: [],
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
    dom.mobileSettingsButton?.addEventListener("click", openSettings);
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
    dom.answerInput.addEventListener("input", (event) => {
      handleAnswerInput();
      handleThreeInputEvent(event);
    });
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
    dom.dateAnswerInput.addEventListener("input", (event) => {
      handleDateInput();
      handleThreeInputEvent(event);
    });
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
    dom.customPracticeStartSelect.addEventListener("change", () => {
      saveCustomPracticePositionId(dom.customPracticeStartSelect.value);
    });
    dom.startCustomPracticeButton.addEventListener("click", () => startCustomPractice());
    dom.restartCustomButton.addEventListener("click", () => startCustomPractice());
    dom.againCustomButton.addEventListener("click", () => startCustomPractice());
    dom.customPlayButton.addEventListener("click", () => {
      if (state.playing) stopPlayback();
      else playCurrentCustom();
    });
    dom.customReplayButton.addEventListener("click", playCurrentCustom);
    dom.customReminderButton.addEventListener("click", togglePracticeReminder);
    document.querySelector("#customQuestionScreen .listen-panel")?.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      playCurrentCustom();
    });
    dom.stopCustomButton.addEventListener("click", stopPlayback);
    dom.submitCustomButton.addEventListener("click", () => submitCustomAnswer(false));
    dom.nextCustomButton.addEventListener("click", () => goNextCustom(true));
    dom.customAnswerInput.addEventListener("input", (event) => {
      handleCustomInput();
      handleThreeInputEvent(event);
    });
    let lastCustomEnterHandled = 0;
    const handleCustomEnter = (event) => {
      if (event.isComposing || (event.key !== "Enter" && event.keyCode !== 13)) return;
      const now = Date.now();
      if (now - lastCustomEnterHandled < 180) return;
      lastCustomEnterHandled = now;
      event.preventDefault();
      if (state.customSession.checked) goNextCustom(true);
      else submitCustomAnswer(false);
    };
    dom.customAnswerInput.addEventListener("keydown", handleCustomEnter);
    dom.customAnswerInput.addEventListener("keyup", handleCustomEnter);
    dom.customEnglishInput.addEventListener("input", () => {
      if (dom.customChineseInput.value.trim()) return;
    });
    dom.reviewDueWordsButton.addEventListener("click", () => startHearingReview("due"));
    dom.reviewAllWordsButton.addEventListener("click", () => startHearingReview("all"));
    dom.customList.addEventListener("click", handleCustomListClick);
    dom.newPredictionButton.addEventListener("click", () => openPredictionEditor());
    dom.startPredictionPracticeButton.addEventListener("click", startPredictionPractice);
    dom.closePredictionEditorButton.addEventListener("click", closePredictionEditor);
    dom.cancelPredictionEditButton.addEventListener("click", closePredictionEditor);
    dom.savePredictionButton.addEventListener("click", savePredictionItem);
    dom.predictionList.addEventListener("click", handlePredictionListClick);
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
    dom.copySyncPackageButton.addEventListener("click", async () => {
      if (!state.sync.token || !state.sync.gistId) {
        updateSyncStatus("请先在已有词汇的设备点击一键同步，再复制连接信息。", true);
        return;
      }
      const pack = `IZZY-IELTS-SYNC|${state.sync.token}|${state.sync.gistId}`;
      try {
        await navigator.clipboard.writeText(pack);
        updateSyncStatus("连接信息已复制。请在 Safari 的设置中点击“从剪贴板连接”。");
      } catch (error) {
        updateSyncStatus("浏览器未允许复制，请先点“复制同步码”，再手动填写 Token。", true);
      }
    });
    dom.connectFromClipboardButton.addEventListener("click", async () => {
      try {
        const text = (await navigator.clipboard.readText()).trim();
        if (!text.startsWith("IZZY-IELTS-SYNC|")) throw new Error("剪贴板中没有有效的连接信息");
        const [, token, gistId] = text.split("|");
        if (!token || !gistId) throw new Error("连接信息不完整");
        dom.githubTokenInput.value = token;
        dom.syncCodeInput.value = gistId;
        state.sync.token = token;
        state.sync.gistId = gistId;
        state.sync.autoSync = true;
        dom.syncAutoToggle.checked = true;
        saveSyncConfig();
        await syncCloudData(true);
      } catch (error) {
        updateSyncStatus(`无法从剪贴板连接：${String(error.message || error).slice(0, 100)}`, true);
      }
    });
    dom.copyVocabularyButton.addEventListener("click", async () => {
      try {
        const pack = `IZZY-IELTS-DATA|${JSON.stringify(buildSyncSnapshot())}`;
        await navigator.clipboard.writeText(pack);
        updateSyncStatus("全部词库已复制。请在 Safari 设置中点击“从剪贴板导入词库”。");
      } catch (error) {
        updateSyncStatus(`复制词库失败：${String(error.message || error).slice(0, 100)}`, true);
      }
    });
    dom.exportVocabularyButton.addEventListener("click", () => {
      try {
        const payload = JSON.stringify(buildSyncSnapshot(), null, 2);
        const blob = new Blob([payload], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `izzy-vocabulary-${state.customItems.length}.json`;
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        updateSyncStatus(`已导出 ${state.customItems.length} 条词汇及错词数据。`);
      } catch (error) {
        updateSyncStatus(`导出失败：${String(error.message || error).slice(0, 100)}`, true);
      }
    });
    dom.createSyncLinkButton.addEventListener("click", async () => {
      if (!state.sync.token || !state.sync.gistId) {
        updateSyncStatus("请先在已有词汇的设备点击一键同步，再生成自动同步链接。", true);
        return;
      }
      try {
        state.sync.autoSync = true;
        dom.syncAutoToggle.checked = true;
        saveSyncConfig();
        const payload = btoa(JSON.stringify({ t: state.sync.token, g: state.sync.gistId }));
        const link = `${location.origin}${location.pathname}?v=autosync&auto=1#sync=${payload}`;
        await navigator.clipboard.writeText(link);
        updateSyncStatus("手机自动同步链接已复制。请在手机 Safari 打开一次，之后会自动同步。");
      } catch (error) {
        updateSyncStatus(`生成失败：${String(error.message || error).slice(0, 100)}`, true);
      }
    });
    dom.importVocabularyButton.addEventListener("click", async () => {
      try {
        const text = (await navigator.clipboard.readText()).trim();
        if (!text.startsWith("IZZY-IELTS-DATA|")) throw new Error("剪贴板中没有有效的词库数据");
        const remote = JSON.parse(text.slice("IZZY-IELTS-DATA|".length));
        const merged = mergeSyncSnapshots(buildSyncSnapshot(), remote);
        applySyncSnapshot(merged);
        updateSyncStatus(`词库导入完成 · 共 ${state.customItems.length} 条词汇`);
      } catch (error) {
        updateSyncStatus(`导入失败：${String(error.message || error).slice(0, 100)}`, true);
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
    dom.listeningStartFromButton.addEventListener("click", jumpToSelectedListening);
    dom.listeningStartSelect.addEventListener("change", () => {
      const selected = Number(dom.listeningStartSelect.value);
      if (!Number.isFinite(selected) || selected < 1 || !state.listening.playlist.length) return;
      const nextIndex = Math.min(selected - 1, state.listening.playlist.length - 1);
      state.listening.pendingStartIndex = nextIndex;
      if (state.listening.started) {
        seekListeningToIndex(nextIndex);
        state.listening.pendingStartIndex = null;
      }
    });
    dom.listeningNowPanel.addEventListener("click", () => {
      if (!state.listening.playlist.length) return;
      seekListeningToIndex(state.listening.index);
    });
    dom.listeningSleep.addEventListener("change", configureSleepTimer);
    const restartListeningIfActive = () => {
      if (state.listening.started && !state.listening.preparing) startListening();
    };
    dom.listeningMode.addEventListener("change", restartListeningIfActive);
    dom.listeningRepeat.addEventListener("change", restartListeningIfActive);
    dom.listeningInterval.addEventListener("change", restartListeningIfActive);
    dom.listeningCategories.addEventListener("change", () => {
      state.listening.previewKey = "";
      state.listening.previewPlaylist = [];
      if (state.listening.started) restartListeningIfActive();
      else {
        refreshListeningPreview();
        renderListening();
      }
    });
    dom.listeningSpeed.addEventListener("change", () => {
      if (state.listening.audio) {
        state.listening.audio.playbackRate = Number(dom.listeningSpeed.value) || 1;
        state.listening.audio.preservesPitch = true;
        state.listening.audio.webkitPreservesPitch = true;
        updateMediaSessionPosition();
      }
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
        event.key === "Enter"
        && !event.defaultPrevented
        && dom.settingsDrawer.hidden
        && dom.customEditor.hidden
        && dom.predictionEditor.hidden
        && state.activeTab === "custom"
        && state.customSession.started
        && !state.customSession.complete
        && !event.metaKey
        && !event.ctrlKey
        && !event.altKey
      ) {
        event.preventDefault();
        if (state.customSession.checked) goNextCustom(true);
        else submitCustomAnswer(false);
        return;
      }
      if (
        (event.key === "3" || event.keyCode === 51)
        && dom.settingsDrawer.hidden
        && !event.metaKey
        && !event.ctrlKey
        && !event.altKey
      ) {
        handleThreeShortcut(event);
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
          return;
        }
        if (state.activeTab === "custom" && state.customSession.started && !state.customSession.complete) {
          event.preventDefault();
          playCurrentCustom();
        }
      }
    });
    document.addEventListener("keyup", (event) => {
      if ((event.key === "3" || event.keyCode === 51) && dom.settingsDrawer.hidden && !event.metaKey && !event.ctrlKey && !event.altKey) {
        handleThreeShortcut(event);
      }
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) return;
      if (state.sync.autoSync && state.sync.token && state.sync.gistId) syncCloudData(false);
      if (state.listening.interruptionPaused) scheduleListeningResumeAfterInterruption();
    });
    window.addEventListener("pagehide", () => {
      if (state.sync.autoSync && state.sync.token && state.sync.gistId) syncCloudData(false);
    });
  }

  function isCustomHintAvailable() {
    return dom.settingsDrawer.hidden
      && state.activeTab === "custom"
      && state.customSession.started
      && !state.customSession.complete;
  }

  function activeInputAcceptsThreeAsDigit() {
    if (document.activeElement === dom.customAnswerInput && state.activeTab === "custom") {
      const item = currentCustomItem();
      return state.customSession.source === "prediction" || /\d/.test(item?.text || "");
    }
    return false;
  }

  function handleThreeShortcut(event) {
    if (!isCustomHintAvailable()) return;
    const acceptsDigit = activeInputAcceptsThreeAsDigit();
    if (!acceptsDigit) event.preventDefault();
    const now = Date.now();
    if (now - state.lastThreeHintAt < 350) return;
    state.lastThreeHintAt = now;
    if (acceptsDigit) window.setTimeout(togglePracticeReminder, 0);
    else togglePracticeReminder();
  }

  function handleThreeInputEvent(event) {
    if (!event || event.isComposing || !isCustomHintAvailable()) return;
    const input = event.target;
    if (!input || !("value" in input)) return;
    const current = String(input.value || "");
    const previous = String(input.dataset.threeLastValue || "");
    input.dataset.threeLastValue = current;
    const insertedThree = event.data === "3"
      || (current.endsWith("3") && current !== previous && (current.length > previous.length || !previous));
    if (!insertedThree) return;
    const acceptsDigit = activeInputAcceptsThreeAsDigit();
    if (!acceptsDigit) {
      input.value = previous;
      input.dataset.threeLastValue = previous;
      try { input.setSelectionRange(previous.length, previous.length); } catch (error) { console.debug(error); }
    }
    const now = Date.now();
    if (now - state.lastThreeHintAt < 350) return;
    state.lastThreeHintAt = now;
    togglePracticeReminder();
  }

  function resetThreeInputTracking() {
    [dom.answerInput, dom.dateAnswerInput, dom.customAnswerInput].forEach((input) => {
      if (input) input.dataset.threeLastValue = "";
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
    renderPrediction();
    renderWordDirectory();
    renderWrongBook();
    renderHearingWrong();
  }

  function switchTab(tab) {
    if (!["dictation", "dates", "listening", "custom", "prediction", "words", "wrong", "hearingwrong"].includes(tab)) return;
    if (["dictation", "dates"].includes(state.activeTab) && tab !== state.activeTab) stopPlayback();
    state.activeTab = tab;
    renderTabs();
    if (tab === "dates") renderDateSession();
    if (tab === "listening") {
      refreshListeningPreview();
      renderListening();
      prefetchContinuousAudio("all");
      prefetchContinuousAudio("single");
      prefetchContinuousAudio("single-bilingual");
    }
    if (tab === "custom") renderCustom();
    if (tab === "prediction") renderPrediction();
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
    renderModeButtons();
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
      large: "1–90 billion",
      phone: "Phone Number",
      years: "1000–1999"
    }[range] || "1–100";
  }

  function selectMode(mode) {
    if (!["english", "digits"].includes(mode)) return;
    if (isDigitsRange(state.range) && mode === "english") return;
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
    const effectiveMode = isDigitsRange(state.range) ? "digits" : settings.mode;
    dom.modeButtons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.mode === effectiveMode);
      button.disabled = isDigitsRange(state.range) && button.dataset.mode === "english";
    });
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
    const specialDigits = isDigitsRange(state.session.range);
    const answerMode = isWrong || specialDigits ? "digits" : settings.mode;
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
      dom.orderTag.textContent = randomRange
        ? (state.range === "phone" ? "每次随机 50 题" : state.range === "years" ? "每次随机 30 题" : "每次随机 100 题")
        : "顺序播报";
      dom.listenTitle.textContent = "听音后填写英文";
      dom.listenHint.textContent = randomRange
        ? "英文读法不使用 and 连接词，hundred、thousand、million、billion 按英语数位分组。按 Tab 可重播。"
        : "例如听到 thirteen，请填写 thirteen。按 Tab 可重播。";
      dom.startTitle.textContent = randomRange
        ? `从 ${rangeLabel(state.range)} 随机抽取 100 个数字拼英文`
        : "从 1 到 100，按顺序拼写英文";
      dom.answerInput.placeholder = "填写英文";
      dom.answerInput.inputMode = "text";
      dom.startDescription.textContent = randomRange
        ? "每次打开或重新开始都会重新抽取不同数字。重点训练 hundred、thousand、million 和 billion 的数位边界。"
        : "点击开始后使用英式语音播报。提交后光标会留在输入框，按 Enter 进入下一题。";
    } else {
      dom.modeLabel.textContent = `${rangeLabel(state.range)} · 阿拉伯数字`;
      dom.answerTag.textContent = "阿拉伯数字";
      dom.orderTag.textContent = randomRange
        ? (state.range === "phone" ? "每次随机 50 题" : state.range === "years" ? "每次随机 30 题" : "每次随机 100 题")
        : (isShuffle ? "乱序播报" : "顺序播报");
      dom.listenTitle.textContent = "听音后填写阿拉伯数字";
      dom.listenHint.textContent = state.range === "phone"
        ? "0 读作 oh，22 读作 double two，333 读作 triple three。只填写阿拉伯数字，保留开头的 0。"
        : state.range === "years"
          ? "1901 读作 nineteen oh one，1881 读作 eighteen eighty-one。只填写阿拉伯数字。"
          : "只需要输入纯数字，逗号可以省略。按 Tab 可重播。";
      dom.answerInput.placeholder = "填写数字";
      dom.answerInput.inputMode = "numeric";
      dom.startTitle.textContent = state.range === "phone"
        ? "每次随机 50 个雅思机考高频电话号码"
        : state.range === "years"
          ? "每次随机 30 个 1000–1999 年历史年份"
          : randomRange
            ? `从 ${rangeLabel(state.range)} 随机的 100 个数字`
            : (isShuffle ? "打乱 1 到 100，拼写阿拉伯数字" : "从 1 到 100，按顺序拼写阿拉伯数字");
      dom.startDescription.textContent = state.range === "phone"
        ? "每次打开或重开都会重新生成 50 个电话号码。播报较慢并按组停顿；0 读作 oh，多数只出现 double，少量出现 triple。"
        : state.range === "years"
          ? "每次打开或重开都会重新生成 30 个年份。2000 年以前按 nineteen oh one、eighteen eighty-one 的形式播报。"
          : randomRange
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
      dom.sessionLabel.textContent = `本轮 0 / ${RANGE_CONFIG[state.range]?.count || 100}`;
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
    resetThreeInputTracking();
    dom.dateResult.hidden = true;
    dom.dateResult.classList.remove("is-wrong");
    dom.dateUserAnswerRow.hidden = true;
    dom.dateEnglishRow.hidden = true;
    renderDateSession();
    dom.dateAnswerInput.focus();
    playCurrentDate();
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
    resetThreeInputTracking();
    dom.dateResult.hidden = true;
    dom.dateResult.classList.remove("is-wrong");
    dom.dateUserAnswerRow.hidden = true;
    dom.dateEnglishRow.hidden = true;
    renderDateSession();
    dom.dateAnswerInput.focus();
    if (autoPlay) playCurrentDate();
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
    if (!source || state.preloaded === source) return;
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
    try {
      dom.datePlayStatus.textContent = "正在生成流畅英式语音";
      await playRepeatedSpeech(item.audioText, settings.repeat, token);
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
    if (!["localhost", "127.0.0.1"].includes(window.location.hostname)) return "";
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
    let types;
    if (wrongRetry) {
      const decoded = customNumbers.map(decodeWrongValue);
      numbers = decoded.map((entry) => entry.value);
      types = decoded.map((entry) => entry.type);
    } else {
      numbers = generateRangeNumbers(state.range);
      const type = typeForRange(state.range);
      types = numbers.map(() => type);
    }

    const uniqueTypes = Array.from(new Set(types));
    const sessionRange = wrongRetry
      ? (uniqueTypes.length === 1
          ? (uniqueTypes[0] === "phone" ? "phone" : uniqueTypes[0] === "year" ? "years" : "wrong")
          : "mixed")
      : state.range;

    state.session = {
      started: numbers.length > 0,
      complete: false,
      checked: false,
      source: wrongRetry ? "wrong" : "normal",
      range: sessionRange,
      types,
      numbers,
      index: 0,
      answered: 0,
      correct: 0
    };
    dom.answerInput.value = "";
    resetThreeInputTracking();
    dom.result.hidden = true;
    dom.result.classList.remove("is-wrong");
    dom.userAnswerRow.hidden = true;
    renderSession();
    dom.answerInput.focus();
    playCurrent();
  }

  function generateRangeNumbers(range) {
    const config = RANGE_CONFIG[range] || RANGE_CONFIG.basic;
    if (range === "basic") {
      const values = Array.from({ length: 100 }, (_, index) => index + 1);
      return settings.mode === "digits" && settings.order === "shuffle" ? shuffle(values) : values;
    }
    if (range === "hundreds") return pickHundreds();
    if (range === "thousands") return pickThousands();
    if (range === "phone") return generatePhoneNumbers(config.count || 50);
    if (range === "years") return generateYears(config.count || 30);
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

  function generatePhoneNumbers(count = 50) {
    if (PHONE_POOL.length >= count) return shuffle(PHONE_POOL).slice(0, count);
    const values = new Set();
    const doublePatterns = ["00", "11", "22", "33", "44", "55", "66", "77", "88", "99"];
    const triplePatterns = ["000", "111", "222", "333", "444", "555", "666", "777", "888", "999"];
    const tripleLimit = Math.max(4, Math.round(count * 0.12));
    let attempts = 0;
    while (values.size < count && attempts < count * 120) {
      attempts += 1;
      const length = values.size % 2 === 0 ? 10 : 8;
      let digits = "";
      if (length === 8) {
        digits = `0${randomInt(1, 9)}`;
        while (digits.length < length) digits += String(randomInt(0, 9));
      } else {
        digits = String(randomInt(2, 9));
        while (digits.length < length) digits += String(randomInt(0, 9));
      }

      const patternPool = values.size < tripleLimit ? triplePatterns : doublePatterns;
      const pattern = patternPool[Math.floor(Math.random() * patternPool.length)];
      const start = randomInt(length === 8 ? 1 : 0, length - pattern.length);
      digits = digits.slice(0, start) + pattern + digits.slice(start + pattern.length);

      if (Math.random() < 0.18) {
        const extra = doublePatterns[Math.floor(Math.random() * doublePatterns.length)];
        const extraStart = randomInt(length === 8 ? 1 : 0, length - extra.length);
        digits = digits.slice(0, extraStart) + extra + digits.slice(extraStart + extra.length);
      }
      values.add(digits);
    }
    return shuffle(Array.from(values)).slice(0, count);
  }

  function generateYears(count = 30) {
    const known = [1001, 1066, 1215, 1348, 1450, 1492, 1588, 1603, 1666, 1776, 1815, 1840, 1865, 1881, 1901, 1912, 1918, 1929, 1939, 1945, 1957, 1969, 1972, 1984, 1991, 1998];
    const values = new Set(known);
    while (values.size < count) {
      const year = randomInt(1000, 1999);
      const ending = year % 100;
      if (ending === 0 && Math.random() < 0.8) continue;
      values.add(year);
    }
    return shuffle(Array.from(values)).slice(0, count);
  }

  function phoneToEnglish(value) {
    const digits = String(value || "").replace(/\D/g, "");
    const digitWords = ["oh", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const parts = [];
    let index = 0;
    while (index < digits.length) {
      let runLength = 1;
      while (index + runLength < digits.length && digits[index + runLength] === digits[index]) {
        runLength += 1;
      }
      let remaining = runLength;
      while (remaining > 0) {
        if (remaining >= 3) {
          parts.push(`triple ${digitWords[Number(digits[index])]}`);
          remaining -= 3;
        } else if (remaining === 2) {
          parts.push(`double ${digitWords[Number(digits[index])]}`);
          remaining -= 2;
        } else {
          parts.push(digitWords[Number(digits[index])]);
          remaining -= 1;
        }
      }
      index += runLength;
    }
    const groups = [];
    for (let cursor = 0; cursor < parts.length; cursor += 4) {
      groups.push(parts.slice(cursor, cursor + 4).join(" "));
    }
    return groups.join(", ");
  }

  function yearToEnglish(value) {
    const year = Number(value);
    if (!Number.isFinite(year) || year < 1000 || year >= 2000) return String(value);
    if (year === 1000) return "one thousand";
    const century = Math.floor(year / 100);
    const ending = year % 100;
    const centuryText = numberToEnglish(century);
    if (ending === 0) return `${centuryText} hundred`;
    if (ending < 10) return `${centuryText} oh ${numberToEnglish(ending)}`;
    return `${centuryText} ${numberToEnglish(ending)}`;
  }

  function compareWrongEntries(a, b) {
    const typeOrder = { number: 0, year: 1, phone: 2 };
    const left = decodeWrongValue(a);
    const right = decodeWrongValue(b);
    const typeDifference = (typeOrder[left.type] || 0) - (typeOrder[right.type] || 0);
    if (typeDifference) return typeDifference;
    if (left.type === "number") return Number(left.value) - Number(right.value);
    return String(left.value).localeCompare(String(right.value));
  }

  function encodeWrongValue(value, type = currentValueType()) {
    if (type === "phone") return `phone:${String(value)}`;
    if (type === "year") return `year:${String(value)}`;
    return Number(value);
  }

  function decodeWrongValue(entry) {
    if (typeof entry === "string" && entry.startsWith("phone:")) {
      return { value: entry.slice(6), type: "phone" };
    }
    if (typeof entry === "string" && entry.startsWith("year:")) {
      return { value: Number(entry.slice(5)), type: "year" };
    }
    return { value: Number(entry), type: "number" };
  }

  function typeForRange(range) {
    if (range === "phone") return "phone";
    if (range === "years") return "year";
    return "number";
  }

  function isDigitsRange(range) {
    return range === "phone" || range === "years";
  }

  function playbackRateForType(type) {
    if (type === "phone") return 0.7;
    if (type === "year") return 0.85;
    return Number(settings.speed) || 1;
  }

  function currentValueType() {
    return state.session.types?.[state.session.index] || typeForRange(state.session.range);
  }

  function spokenTextForValue(value, type = "number") {
    if (type === "phone") return phoneToEnglish(value);
    if (type === "year") return yearToEnglish(value);
    return numberToEnglish(Number(value));
  }

  function answerTextForValue(value, type = "number") {
    if (type === "phone" || type === "year") return String(value);
    return formatNumber(Number(value));
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
      return normalizeEnglish(answer) === normalizeEnglish(spokenTextForValue(number, currentValueType()));
    }
    const digits = answer.replace(/[\s,，]/g, "");
    return /^\d+$/.test(digits) && digits === String(number);
  }

  function answerMode() {
    if (state.session.source === "wrong") return "digits";
    return isDigitsRange(state.session.range) ? "digits" : settings.mode;
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
      addWrongNumber(number, currentValueType());
    }

    dom.result.hidden = false;
    dom.result.classList.toggle("is-wrong", !result.correct);
    dom.resultMark.textContent = result.correct ? "正确" : "需要再练";
    dom.resultNote.textContent = result.note;
    dom.correctAnswer.textContent = answerMode() === "english"
      ? spokenTextForValue(number, currentValueType())
      : answerTextForValue(number, currentValueType());
    dom.userAnswer.textContent = answer;
    dom.userAnswerRow.hidden = result.correct;
    renderSession();
    renderWrongBook();
    window.setTimeout(() => dom.answerInput.focus(), 30);
  }

  function compareAnswer(answer, number) {
    const type = currentValueType();
    if (answerMode() === "english") {
      const expected = spokenTextForValue(number, type);
      const normalized = normalizeEnglish(answer);
      const correct = normalized === normalizeEnglish(expected)
        || (number === 100 && ["onehundred", "ahundred", "hundred"].includes(normalized));
      return {
        correct,
        note: correct ? "英文拼写正确" : `正确拼写是 ${expected}`
      };
    }
    const digits = answer.replace(/[\s,，]/g, "");
    const correct = /^\d+$/.test(digits) && digits === String(number);
    return {
      correct,
      note: correct ? "阿拉伯数字正确" : `正确数字是 ${answerTextForValue(number, type)}`
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
    resetThreeInputTracking();
    dom.result.hidden = true;
    dom.result.classList.remove("is-wrong");
    dom.userAnswerRow.hidden = true;
    renderSession();
    dom.answerInput.focus();
    if (autoPlay) playCurrent();
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
    if (!source || state.preloaded === source) return;
    state.preloaded = source;
    state.audio.src = source;
    state.audio.load();
  }

  function getAudioSource(number) {
    const type = currentValueType();
    const spoken = spokenTextForValue(number, type);
    if (type !== "number") return "";
    const voiceEntry = state.voicePackIndex[spoken];
    if (voiceEntry?.file) return `audio/voice-pack/${voiceEntry.file}`;
    if (!["localhost", "127.0.0.1"].includes(window.location.hostname)) return "";
    const params = new URLSearchParams({
      number: String(number),
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

    try {
      dom.playStatus.textContent = "正在生成流畅英式语音";
      await playRepeatedSpeech(spokenTextForValue(number, currentValueType()), settings.repeat, token, {
        number,
        type: currentValueType(),
        preferImmediate: true
      });
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

  function getBaiduTtsUrl(text, language = "en") {
    const params = new URLSearchParams({
      lan: language,
      text,
      spd: "2",
      source: "web"
    });
    return `https://fanyi.baidu.com/gettts?${params.toString()}`;
  }

  function getYoudaoAudioUrl(text, accent = "1") {
    const params = new URLSearchParams({ audio: text, type: accent });
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

  async function playNumberAudio(number, token, type = "number") {
    const text = spokenTextForValue(number, type);
    await playRepeatedSpeech(text, 1, token, { number, type, preferImmediate: true });
  }

  async function playListeningSequentially(playlist, token, startIndex = 0) {
    const repeat = Math.max(1, Number(dom.listeningRepeat.value) || 1);
    const bilingual = dom.listeningMode.value === "bilingual";
    const intervalMs = Math.max(0, Number(dom.listeningInterval.value) || 1) * 1000;
    let index = startIndex;

    while (token === state.listening.token && state.listening.started && !sleepExpired()) {
      if (!state.listening.playing) {
        await wait(300);
        continue;
      }
      const entry = playlist[index];
      if (!entry) break;
      setListeningTrack(index);
      renderListening();
      let failedPart = false;
      const parts = entry.kind === "group" ? entry.parts : [entry];
      for (const part of parts) {
        if (token !== state.listening.token || !state.listening.started || sleepExpired()) return;
        for (let count = 0; count < repeat; count += 1) {
          if (token !== state.listening.token || !state.listening.started || sleepExpired()) return;
          const text = part.kind === "number" ? numberToEnglish(part.number) : (part.audioText || part.english);
          try {
            await playSmartListeningText(text, token, part.valueType || "number");
          } catch (error) {
            failedPart = true;
            console.warn("Listening segment failed.", text, error);
            break;
          }
          if (count < repeat - 1) await wait(320);
        }
        if (failedPart) break;
        if (bilingual && !part.skipTranslation && part.chinese && part.chinese !== part.english && part.chinese !== part.audioText) {
          await wait(280);
          await playFallbackSpeech(part.chinese, token);
        }
        await wait(340);
      }
      if (token !== state.listening.token || !state.listening.started || sleepExpired()) return;
      await wait(intervalMs);
      index = (index + 1) % playlist.length;
    }
  }

  async function playSmartListeningText(text, token, type = "number") {
    const immediate = getSyncSpeechSources(text, type);
    if (immediate) {
      try {
        for (const source of immediate.sources) {
          if (token !== state.listening.token) return;
          try {
            await playListeningAudio(source, token);
          } catch (error) {
            if (!immediate.external) throw error;
            console.debug("External listening audio unavailable; using browser speech.", error);
            await speakBrowserText(text, Number(dom.listeningSpeed.value) || 1, token, "listening");
            return;
          }
          if (immediate.sources.length > 1) await wait(260);
        }
      } finally {
        if (immediate.revoke) immediate.sources.forEach((source) => URL.revokeObjectURL(source));
      }
      return;
    }
    const warmup = warmNeuralSpeech(text);
    try {
      await speakBrowserText(text, Number(dom.listeningSpeed.value) || 1, token, "listening");
      return;
    } catch (error) {
      console.debug("Browser listening voice unavailable.", error);
    }
    const blob = await warmup;
    if (blob) {
      await playListeningAudioBlob(blob, token);
      return;
    }
    await playFallbackSpeech(text, token);
  }

  async function playFallbackSpeech(text, token) {
    if (token !== state.listening.token) return;
    const value = String(text || "").trim();
    if (!value) return;
    const warmup = warmNeuralSpeech(value);
    try {
      await speakBrowserText(value, Number(dom.listeningSpeed.value) || 1, token, "listening");
      return;
    } catch (error) {
      console.debug("Browser listening fallback unavailable.", error);
    }
    const blob = await warmup;
    if (blob) {
      await playListeningAudioBlob(blob, token);
      return;
    }
    const language = neuralVoice.containsChinese(value) ? "zh" : "en";
    const sources = language === "en"
      ? [getBaiduTtsUrl(value, language), getYoudaoAudioUrl(value)]
      : [getBaiduTtsUrl(value, language)];
    for (const source of sources) {
      if (token !== state.listening.token) return;
      try {
        await playListeningAudio(source, token);
        return;
      } catch (error) {
        console.debug("Direct online voice unavailable.", error);
      }
    }
  }

  function getSyncSpeechSources(text, type = "number") {
    const normalized = neuralVoice.normalizeText(text);
    if (!normalized) return null;
    const voiceEntry = state.voicePackIndex[normalized];
    if (voiceEntry?.file) {
      const sources = [`audio/voice-pack/${voiceEntry.file}`];
      if (voiceEntry.usFile) sources.push(`audio/voice-pack/${voiceEntry.usFile}`);
      return { sources, revoke: false, external: false };
    }
    const blob = state.audioBlobCache.get(`text:${normalized}`);
    if (blob?.size) {
      return { sources: [URL.createObjectURL(blob)], revoke: true, external: false };
    }
    if (neuralVoice.containsChinese(normalized)) {
      return {
        sources: [getBaiduTtsUrl(normalized, "zh")],
        revoke: false,
        external: true
      };
    }
    if (type === "phone") {
      const groups = normalized.split(/,\s*/).map((group) => group.trim()).filter(Boolean);
      const sources = groups.map((group) => {
        const count = group.split(/\s+/).filter(Boolean).length;
        return count <= 3 ? getYoudaoAudioUrl(group, "1") : getBaiduTtsUrl(group, "en");
      });
      return { sources: sources.length ? sources : [getBaiduTtsUrl(normalized, "en")], revoke: false, external: true };
    }
    const wordCount = normalized.split(/\s+/).filter(Boolean).length;
    if (wordCount <= 3) {
      return {
        sources: [getYoudaoAudioUrl(normalized, "1"), getYoudaoAudioUrl(normalized, "2")],
        revoke: false,
        external: true
      };
    }
    const groups = predictionSpeechGroups(normalized);
    return {
      sources: groups.map((group) => getYoudaoAudioUrl(group, "1")),
      revoke: false,
      external: true
    };
  }

  async function getImmediateSpeechBlob(text, options = {}) {
    const normalized = neuralVoice.normalizeText(text);
    if (!normalized) return null;
    await state.voicePackPromise;
    const voiceEntry = state.voicePackIndex[normalized];
    const cacheKey = voiceEntry?.file ? `pack:${voiceEntry.file}` : `text:${normalized}`;
    if (voiceEntry?.file || state.audioBlobCache.has(cacheKey)) {
      return getSpeechBlob(normalized, options);
    }
    return null;
  }

  function warmNeuralSpeech(text, options = {}) {
    return getSpeechBlob(text, options).catch((error) => {
      console.debug("Sonia voice will be cached later.", error);
      return null;
    });
  }

  function speakBrowserText(text, rate, token, tokenScope = "main") {
    const value = String(text || "").trim();
    const currentToken = tokenScope === "listening" ? state.listening.token : state.token;
    if (!value || !window.speechSynthesis || token !== currentToken) {
      return Promise.reject(new Error("Browser speech unavailable"));
    }
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(value);
      const language = neuralVoice.containsChinese(value) ? "zh" : "en";
      const voice = pickBrowserVoice(language);
      if (voice) utterance.voice = voice;
      utterance.lang = voice?.lang || (language === "zh" ? "zh-CN" : "en-GB");
      utterance.rate = Number(rate) || 1;
      utterance.pitch = 1;
      utterance.onend = resolve;
      utterance.onerror = (event) => reject(new Error(event.error || "Browser speech failed"));
      try { window.speechSynthesis.cancel(); window.speechSynthesis.resume(); } catch (error) { console.debug(error); }
      window.speechSynthesis.speak(utterance);
    });
  }

  async function playSmartText(text, token) {
    const immediate = getSyncSpeechSources(text);
    if (immediate) {
      try {
        for (const source of immediate.sources) {
          if (token !== state.token) return;
          try {
            await playAudio(source, token);
          } catch (error) {
            if (!immediate.external) throw error;
            console.debug("External audio unavailable; using browser speech.", error);
            await speakBrowserText(text, settings.speed, token);
            return;
          }
          if (immediate.sources.length > 1) await wait(260);
        }
      } finally {
        if (immediate.revoke) immediate.sources.forEach((source) => URL.revokeObjectURL(source));
      }
      return;
    }
    const warmup = warmNeuralSpeech(text);
    try {
      await speakBrowserText(text, settings.speed, token);
      return;
    } catch (error) {
      console.debug("Browser speech unavailable; using cached neural voice.", error);
    }
    const blob = await warmup;
    if (!blob) throw new Error("No speech audio available");
    await playAudioBlob(blob, token);
  }

  async function speakEnglishFallback(text, token, options = {}) {
    const tokenScope = options.tokenScope === "listening" ? "listening" : "main";
    const currentToken = tokenScope === "listening" ? state.listening.token : state.token;
    if (token !== currentToken) return;
    const warmup = warmNeuralSpeech(text);
    try {
      await speakBrowserText(text, options.rate ?? settings.speed, token, tokenScope);
      return;
    } catch (error) {
      console.debug("Browser speech fallback unavailable.", error);
    }
    const blob = await warmup;
    if (blob) {
      if (tokenScope === "listening") await playListeningAudioBlob(blob, token);
      else await playAudioBlob(blob, token);
      return;
    }
    const fallback = neuralVoice.containsChinese(text) ? getBaiduTtsUrl(text, "zh") : getYoudaoAudioUrl(text);
    if (tokenScope === "listening") await playListeningAudio(fallback, token);
    else await playAudio(fallback, token);
  }

  function pickBrowserVoice(language) {
    if (!window.speechSynthesis) return null;
    const voices = window.speechSynthesis.getVoices();
    if (language === "zh") {
      return voices.find((item) => /^zh/i.test(item.lang)) || null;
    }
    const preferred = voices.find((item) => /samantha|serena|sonia|libby|google uk english female|microsoft.*(aria|jenny|sonia|libby)/i.test(item.name));
    if (preferred && /^en/i.test(preferred.lang)) return preferred;
    return voices.find((item) => /^en-GB/i.test(item.lang) && !/daniel|karen/i.test(item.name))
      || voices.find((item) => /^en/i.test(item.lang) && !/daniel|karen/i.test(item.name))
      || null;
  }

  async function playAudioBlob(blob, token, options = {}) {
    const url = URL.createObjectURL(blob);
    try {
      await playAudio(url, token, options);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async function playListeningAudioBlob(blob, token) {
    const url = URL.createObjectURL(blob);
    try {
      await playListeningAudio(url, token);
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  function primeAudioElement(audio) {
    if (!audio || audio.__izzyPrimed) return;
    try {
      const url = URL.createObjectURL(neuralVoice.silence(0.024));
      audio.loop = false;
      audio.volume = 1;
      audio.src = url;
      const promise = audio.play();
      const finish = () => {
        audio.__izzyPrimed = true;
        try { audio.pause(); } catch (error) { console.debug(error); }
        URL.revokeObjectURL(url);
      };
      if (promise?.then) promise.then(finish).catch(() => URL.revokeObjectURL(url));
      else finish();
    } catch (error) {
      console.debug("Audio unlock unavailable.", error);
    }
  }

  function playAudio(source, token, options = {}) {
    return new Promise((resolve, reject) => {
      if (token !== state.token) {
        resolve();
        return;
      }
      const audio = state.audio;
      let settled = false;
      let loadTimer = null;
      const finish = (error = null) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(loadTimer);
        audio.onended = null;
        audio.onerror = null;
        audio.onplaying = null;
        if (error) reject(error);
        else resolve();
      };
      audio.onended = () => finish();
      audio.onerror = () => finish(new Error(`Cannot play ${source}`));
      audio.onplaying = () => window.clearTimeout(loadTimer);
      loadTimer = window.setTimeout(() => finish(new Error("Audio start timed out")), 8000);
      audio.playbackRate = Number(options.rate ?? settings.speed) || 1;
      audio.preservesPitch = true;
      audio.webkitPreservesPitch = true;
      const resolved = new URL(source, window.location.href).href;
      if (audio.src !== resolved) {
        beginListeningInternalOperation();
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
      state.audio.webkitPreservesPitch = true;
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
    if (selected.has("custom") || selected.has("examples") || selected.has("notes")) {
      state.customItems.forEach((item) => {
        const parts = [];
        if (selected.has("custom")) {
          parts.push({
            kind: "text",
            english: item.text,
            chinese: item.translation || item.text,
            note: item.note || "",
            audioText: item.text,
            partType: "word"
          });
        }
        if (selected.has("examples") && item.example) {
          parts.push({
            kind: "text",
            english: item.example,
            chinese: item.exampleTranslation || item.example,
            audioText: item.example,
            partType: "example"
          });
        }
        if (selected.has("notes") && item.note) {
          parts.push({
            kind: "text",
            english: item.note,
            chinese: item.note,
            audioText: item.note,
            partType: "note",
            skipTranslation: true
          });
        }
        if (!parts.length) return;
        if (parts.length === 1) {
          entries.push({ ...parts[0], key: `custom:${item.id}`, customOrder: Number(item.createdAt || item.updatedAt || 0) });
        } else {
          entries.push({
            kind: "group",
            parts,
            english: parts.map((part) => part.english).join(" / "),
            chinese: parts.map((part) => part.chinese).join(" / "),
            key: `custom-group:${item.id}`,
            customOrder: Number(item.createdAt || item.updatedAt || 0)
          });
        }
      });
    }
    if (selected.has("singlewords")) {
      state.customItems
        .filter((item) => /^[A-Za-z]+(?:[-'][A-Za-z]+)*$/.test(String(item.text || "").trim()))
        .forEach((item) => {
          entries.push({
            kind: "text",
            english: item.text,
            chinese: item.translation || item.text,
            audioText: item.text,
            key: `singleword:${item.id}`,
            customOrder: Number(item.createdAt || item.updatedAt || 0)
          });
        });
    }
    if (selected.has("prediction")) {
      state.predictionItems.forEach((item) => {
        entries.push({
          kind: "text",
          english: item.value,
          chinese: item.chinese || predictionSpokenText(item.value, item.type),
          audioText: item.spokenText || predictionSpokenText(item.value, item.type),
          key: `prediction:${item.id}`
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
      state.wrongNumbers.forEach((entry) => {
        const decoded = decodeWrongValue(entry);
        const english = spokenTextForValue(decoded.value, decoded.type);
        entries.push({
          kind: decoded.type === "number" ? "number" : "text",
          number: decoded.type === "number" ? decoded.value : undefined,
          english,
          chinese: answerTextForValue(decoded.value, decoded.type),
          audioText: english,
          key: `wrong-number:${String(entry)}`
        });
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
    const unique = Array.from(new Map(entries.map((entry) => [entry.key, entry])).values());
    const customEntries = unique
      .filter((entry) => Number.isFinite(entry.customOrder))
      .sort((a, b) => b.customOrder - a.customOrder);
    const otherEntries = unique.filter((entry) => !Number.isFinite(entry.customOrder));
    return [...customEntries, ...shuffle(otherEntries)];
  }

  async function startListening() {
    if (state.listening.preparing) return;
    const pendingStart = Number.isInteger(state.listening.pendingStartIndex)
      ? state.listening.pendingStartIndex
      : loadListeningProgress();
    const playlist = state.listening.previewPlaylist.length
      ? state.listening.previewPlaylist
      : buildListeningPlaylist();
    state.listening.previewPlaylist = [];
    if (!playlist.length) {
      dom.listeningEnglish.textContent = "还没有选择播放内容";
      dom.listeningChinese.textContent = "至少勾选一个分类。";
      return;
    }
    stopListening();
    const token = ++state.listening.token;
    state.listening.started = true;
    state.listening.playlist = playlist;
    state.listening.index = Math.min(Math.max(0, pendingStart), Math.max(0, playlist.length - 1));
    state.listening.currentTrack = -1;
    state.listening.playing = true;
    state.listening.preparing = true;
    state.listening.consumedSeconds = 0;
    state.listening.lastTime = 0;
    state.listening.timeline = [];
    state.listening.totalDuration = 0;
    state.listening.directFallback = false;
    state.listening.preparing = false;
    state.listening.audio.loop = false;
    state.listening.audio.volume = 1;
    state.listening.resumeSinkId = state.listening.audio.sinkId || "";
    configureSleepTimer();
    renderListening();
    startListeningWatchdog();
    const selected = new Set(
      Array.from(dom.listeningCategories.querySelectorAll("input:checked")).map((input) => input.dataset.listeningCategory)
    );
    state.listening.pendingStartIndex = null;
    startPreparedListening(playlist, token, pendingStart);
  }

  async function preparePreparedListeningChunk(chunk, token, chunkStart, showProgress = false) {
    const cacheKey = [
      chunk.map((entry) => entry.key || entry.english || entry.audioText).join("|"),
      dom.listeningMode.value,
      dom.listeningRepeat.value,
      dom.listeningInterval.value
    ].join("::");
    let prepared = state.listening.preparedCache.get(cacheKey);
    if (!prepared) {
      if (showProgress) {
        dom.listeningEnglish.textContent = "正在准备连续音频";
        dom.listeningChinese.textContent = "正在合成，完成后会自动开始播放";
      }
      prepared = await prepareListeningStream(chunk, token, showProgress ? (completed, total, entry) => {
        if (token !== state.listening.token) return;
        dom.listeningProgress.textContent = `准备 ${completed} / ${total}`;
        dom.listeningEnglish.textContent = "正在准备连续音频";
        dom.listeningChinese.textContent = entry?.english ? `已完成：${entry.english}` : "正在合成连续音频";
      } : null);
      prepared.timeline = prepared.timeline.map((segment, index) => ({
        ...segment,
        entryIndex: chunkStart + index
      }));
      prepared.count = chunk.length;
      state.listening.preparedCache.set(cacheKey, prepared);
      while (state.listening.preparedCache.size > 4) {
        state.listening.preparedCache.delete(state.listening.preparedCache.keys().next().value);
      }
    }
    return prepared;
  }

  function playPreparedListeningChunk(prepared, token) {
    return new Promise((resolve, reject) => {
      if (token !== state.listening.token || !state.listening.started) {
        resolve();
        return;
      }
      const audio = state.listening.audio;
      state.listening.timeline = prepared.timeline;
      state.listening.totalDuration = prepared.duration;
      state.listening.continuous = true;
      state.listening.preparing = false;
      if (state.listening.audioUrl) {
        try { URL.revokeObjectURL(state.listening.audioUrl); } catch (error) { console.debug(error); }
      }
      state.listening.audioUrl = URL.createObjectURL(prepared.blob);
      audio.loop = false;
      audio.volume = 1;
      audio.playbackRate = Number(dom.listeningSpeed.value) || 1;
      audio.preservesPitch = true;
      audio.webkitPreservesPitch = true;
      beginListeningInternalOperation();
      audio.onended = () => {
        audio.onended = null;
        audio.onerror = null;
        resolve();
      };
      audio.onerror = () => {
        audio.onended = null;
        audio.onerror = null;
        reject(new Error("Prepared listening chunk failed"));
      };
      audio.src = state.listening.audioUrl;
      audio.load();
      const firstIndex = prepared.timeline[0]?.entryIndex || 0;
      setListeningTrack(firstIndex);
      renderListening();
      startListeningWatchdog();
      updateMediaSessionMetadata(state.listening.playlist[firstIndex], firstIndex);
      audio.play().catch((error) => {
        audio.onended = null;
        audio.onerror = null;
        reject(error);
      });
    });
  }

  async function startPreparedListening(playlist, token, startIndex = 0) {
    const safeStart = Math.min(Math.max(0, startIndex), Math.max(0, playlist.length - 1));
    const orderedPlaylist = safeStart > 0
      ? [...playlist.slice(safeStart), ...playlist.slice(0, safeStart)]
      : playlist;
    state.listening.playlist = orderedPlaylist;
    state.listening.index = 0;
    state.listening.currentTrack = -1;
    state.listening.playing = true;
    state.listening.preparing = true;
    state.listening.timeline = [];
    state.listening.totalDuration = 0;
    state.listening.preparedQueueActive = true;
    beginListeningInternalOperation(1800);
    unlockListeningAudio();
    renderListening();
    try {
      let chunkStart = 0;
      let preparedPromise = preparePreparedListeningChunk(
        orderedPlaylist.slice(0, PREPARED_LISTENING_CHUNK_SIZE),
        token,
        chunkStart,
        true
      );
      while (token === state.listening.token && state.listening.started) {
        const prepared = await preparedPromise;
        if (token !== state.listening.token) return;
        const nextStart = (chunkStart + prepared.count) % orderedPlaylist.length;
        preparedPromise = preparePreparedListeningChunk(
          orderedPlaylist.slice(nextStart, nextStart + PREPARED_LISTENING_CHUNK_SIZE),
          token,
          nextStart,
          false
        );
        await playPreparedListeningChunk(prepared, token);
        chunkStart = nextStart;
      }
    } catch (error) {
      if (token !== state.listening.token) return;
      state.listening.preparing = false;
      state.listening.playing = false;
      state.listening.preparedQueueActive = false;
      console.error(error);
      dom.listeningEnglish.textContent = "随身听暂时不可用";
      dom.listeningChinese.textContent = "请重新点击开始；音频会继续使用已准备好的内容。";
      renderListening();
    }
  }

  async function startContinuousVocabulary(token, playlist, mode = "all", startIndex = 0) {
    const bilingual = mode === "single-bilingual";
    const single = mode === "single" || bilingual;
    const requestedText = playlist[startIndex]?.english || "";
    const selectedManifest = bilingual
      ? state.singleBilingualManifest
      : (single ? state.singleWordManifest : state.continuousManifest);
    const manifest = selectedManifest
      || await state.continuousManifestPromise
      || (bilingual ? state.singleBilingualManifest : (single ? state.singleWordManifest : state.continuousManifest));
    if (token !== state.listening.token) return;
    if (manifest?.entries?.length) {
      const indicesByText = new Map();
      playlist.forEach((entry, index) => {
        const key = String(entry.english || "");
        if (!indicesByText.has(key)) indicesByText.set(key, []);
        indicesByText.get(key).push(index);
      });
      const ordered = [];
      manifest.entries.forEach((entry) => {
        const matches = indicesByText.get(String(entry.text || ""));
        const nextIndex = matches?.shift();
        if (Number.isInteger(nextIndex)) ordered.push(playlist[nextIndex]);
      });
      if (ordered.length === manifest.entries.length && ordered.length === playlist.length) {
        state.listening.playlist = ordered;
        state.listening.timeline = manifest.entries.map((entry, index) => ({
          entryIndex: index,
          start: entry.start,
          end: entry.start + entry.duration,
          duration: entry.duration
        }));
        state.listening.totalDuration = manifest.duration;
        const requestedIndex = ordered.findIndex((entry) => entry.english === requestedText);
        if (requestedIndex >= 0) startIndex = requestedIndex;
      }
    }
    if (!state.listening.timeline.length) {
      state.listening.pendingStartIndex = null;
      state.listening.continuous = false;
      state.listening.index = Math.min(Math.max(0, startIndex), Math.max(0, playlist.length - 1));
      renderListening();
      try {
        await playListeningSequentially(playlist, token, startIndex);
      } catch (error) {
        if (token !== state.listening.token) return;
        state.listening.playing = false;
        console.error(error);
        dom.listeningEnglish.textContent = "随身听暂时不可用";
        dom.listeningChinese.textContent = "请重新点击开始；已经缓存的语音不会丢失。";
        renderListening();
      }
      return;
    }
    const audio = state.listening.audio;
    state.listening.continuous = true;
    state.listening.playing = true;
    state.listening.currentTrack = -1;
    state.listening.index = Math.min(Math.max(0, startIndex), Math.max(0, state.listening.playlist.length - 1));
    audio.loop = true;
    audio.volume = 1;
    audio.playbackRate = Number(dom.listeningSpeed.value) || 1;
    audio.preservesPitch = true;
    audio.webkitPreservesPitch = true;
    beginListeningInternalOperation();
    audio.src = bilingual
      ? "audio/continuous/custom-single-words-uk-us-cn-note.mp3"
      : (single
        ? "audio/continuous/custom-single-words-uk-us.mp3"
        : "audio/continuous/custom-uk-us.mp3");
    audio.load();
    const pending = state.listening.index;
    state.listening.pendingStartIndex = null;
    audio.onloadedmetadata = () => {
      if (pending > 0) seekListeningToIndex(pending);
    };
    setListeningTrack(pending);
    renderListening();
    updateMediaSessionMetadata({
      english: bilingual
        ? "我的单词 · 英式 + 美式 + 中文 + 笔记"
        : (single ? "我的单词 · 英式 + 美式" : "完整词库 · 英式 + 美式"),
      chinese: `${state.listening.playlist.length} 个单词连续随身听`
    }, 0);
    audio.play().catch((error) => {
      if (token !== state.listening.token) return;
      state.listening.playing = false;
      console.error(error);
      renderListening();
    });
  }

  function toggleListeningPlayback() {
    if (state.listening.preparing) return;
    if (!state.listening.started) {
      startListening();
      return;
    }
    if (state.listening.playing) {
      state.listening.interruptionPaused = false;
      state.listening.resumeAfterInterruption = false;
      pauseListeningAudio();
    }
    else resumeListeningAudio();
  }

  function changeListeningIndex(offset) {
    if (!state.listening.playlist.length) return;
    const total = state.listening.playlist.length;
    const next = (state.listening.index + offset + total) % total;
    seekListeningToIndex(next);
  }

  function jumpToSelectedListening() {
    const selected = Number(dom.listeningStartSelect.value);
    if (!Number.isFinite(selected) || selected < 1) return;
    const index = Math.min(selected - 1, state.listening.playlist.length - 1);
    if (!state.listening.started) {
      state.listening.pendingStartIndex = index;
      startListening();
      return;
    }
    seekListeningToIndex(index);
  }

  function seekListeningToIndex(next) {
    if (!state.listening.playlist.length) return;
    if (!state.listening.timeline.length) {
      const wasPlaying = state.listening.playing;
      stopListeningAudio();
      state.listening.playing = wasPlaying;
      state.listening.audio.loop = false;
      state.listening.audio.volume = 1;
      const token = ++state.listening.token;
      setListeningTrack(next);
      if (wasPlaying) playListeningSequentially(state.listening.playlist, token, next);
      return;
    }
    const segment = state.listening.timeline.find((entry) => entry.entryIndex === next)
      || state.listening.timeline[next];
    const audio = state.listening.audio;
    if (segment && Number.isFinite(audio.duration) && audio.duration > 0 && state.listening.totalDuration > 0) {
      const scaledStart = (segment.start / state.listening.totalDuration) * audio.duration;
      audio.currentTime = Math.min(Math.max(0, scaledStart + 0.005), Math.max(0, audio.duration - 0.05));
      state.listening.lastTime = audio.currentTime;
    }
    setListeningTrack(next);
    if (state.listening.playing) resumeListeningAudio();
  }

  function refreshListeningPreview() {
    if (state.listening.started) return;
    const selected = Array.from(dom.listeningCategories.querySelectorAll("input:checked"))
      .map((input) => input.dataset.listeningCategory)
      .sort()
      .join("|");
    const key = `${selected}:${state.customItems.length}:${state.predictionItems.length}`;
    if (state.listening.previewKey === key && state.listening.previewPlaylist.length) return;
    state.listening.previewKey = key;
    state.listening.previewPlaylist = buildListeningPlaylist();
    state.listening.playlist = state.listening.previewPlaylist;
    state.listening.index = 0;
    state.listening.timeline = [];
    state.listening.currentTrack = -1;
    state.listeningStartOptionsKey = "";
  }

  function renderListeningStartOptions() {
    if (!dom.listeningStartSelect) return;
    const playlist = state.listening.playlist;
    const key = playlist.length
      ? `${playlist.length}:${playlist[0]?.english || ""}:${playlist[playlist.length - 1]?.english || ""}`
      : "empty";
    if (state.listeningStartOptionsKey !== key) {
      state.listeningStartOptionsKey = key;
      dom.listeningStartSelect.replaceChildren();
      playlist.forEach((entry, index) => {
        const option = document.createElement("option");
        option.value = String(index + 1);
        option.textContent = `${index + 1}. ${entry.english || entry.audioText || "未命名"}`;
        dom.listeningStartSelect.appendChild(option);
      });
    }
    if (document.activeElement !== dom.listeningStartSelect && playlist.length) {
      dom.listeningStartSelect.value = String(state.listening.index + 1);
    }
    dom.listeningStartFromButton.disabled = !playlist.length;
  }

  function audioBufferToWav(audioBuffer) {
    const channels = Math.min(1, audioBuffer.numberOfChannels);
    const samples = audioBuffer.getChannelData(0);
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);
    const writeText = (offset, value) => {
      for (let index = 0; index < value.length; index += 1) view.setUint8(offset + index, value.charCodeAt(index));
    };
    writeText(0, "RIFF");
    view.setUint32(4, 36 + samples.length * 2, true);
    writeText(8, "WAVE");
    writeText(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, channels, true);
    view.setUint32(24, audioBuffer.sampleRate, true);
    view.setUint32(28, audioBuffer.sampleRate * channels * 2, true);
    view.setUint16(32, channels * 2, true);
    view.setUint16(34, 16, true);
    writeText(36, "data");
    view.setUint32(40, samples.length * 2, true);
    let offset = 44;
    for (let index = 0; index < samples.length; index += 1) {
      const sample = Math.max(-1, Math.min(1, samples[index]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
    return new Blob([buffer], { type: "audio/wav" });
  }

  async function composeListeningParts(parts, token) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const OfflineContextClass = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!AudioContextClass || !OfflineContextClass) {
      return { blob: neuralVoice.compose(parts), duration: parts.reduce((sum, part) => sum + neuralVoice.estimateDuration(part), 0) };
    }
    const decoder = new AudioContextClass();
    const buffers = [];
    try {
      for (const part of parts) {
        if (token !== state.listening.token) throw new Error("Listening preparation cancelled");
        if (!part?.size) continue;
        try {
          const data = await part.arrayBuffer();
          buffers.push(await decoder.decodeAudioData(data));
        } catch (error) {
          console.warn("Could not decode listening part.", error);
        }
      }
    } finally {
      try { await decoder.close(); } catch (error) { console.debug(error); }
    }
    if (!buffers.length) throw new Error("No decodable listening audio");
    const sampleRate = 24000;
    const totalDuration = buffers.reduce((sum, buffer) => sum + buffer.duration, 0);
    const offline = new OfflineContextClass(1, Math.max(1, Math.ceil(totalDuration * sampleRate)), sampleRate);
    let cursor = 0;
    buffers.forEach((buffer) => {
      const source = offline.createBufferSource();
      source.buffer = buffer;
      source.connect(offline.destination);
      source.start(cursor);
      cursor += buffer.duration;
    });
    const rendered = await offline.startRendering();
    return { blob: audioBufferToWav(rendered), duration: rendered.duration };
  }

  async function prepareListeningStream(playlist, token, onProgress) {
    const parts = [];
    const timeline = [];
    const repeat = Math.max(1, Number(dom.listeningRepeat.value) || 1);
    const bilingual = dom.listeningMode.value === "bilingual";
    const intervalSeconds = Math.max(0, Number(dom.listeningInterval.value) || 1);
    let cursor = 0;
    let failed = 0;
    let speechCount = 0;
    const voiceSession = neuralVoice.createSession();

    try {
      for (let entryIndex = 0; entryIndex < playlist.length; entryIndex += 1) {
      if (token !== state.listening.token) throw new Error("Listening preparation cancelled");
      const entry = playlist[entryIndex];
      const entryStart = cursor;
      const entryParts = entry.kind === "group" ? entry.parts : [entry];
      for (let partIndex = 0; partIndex < entryParts.length; partIndex += 1) {
        const part = entryParts[partIndex];
        let speechBlob;
        try {
          speechBlob = await getSpeechBlobForPart(part, { session: voiceSession });
        } catch (error) {
          failed += 1;
          console.warn("Could not generate listening audio.", part, error);
          continue;
        }
        speechCount += 1;
        for (let count = 0; count < repeat; count += 1) {
          parts.push(speechBlob);
          cursor += neuralVoice.estimateDuration(speechBlob);
          if (count < repeat - 1) {
            const gap = neuralVoice.silence(0.32);
            parts.push(gap);
            cursor += neuralVoice.estimateDuration(gap);
          }
        }
        const shouldTranslate = bilingual && !part.skipTranslation
          && part.chinese && part.chinese !== part.english && part.chinese !== part.audioText;
        if (shouldTranslate) {
          const translationGap = neuralVoice.silence(0.28);
          parts.push(translationGap);
          cursor += neuralVoice.estimateDuration(translationGap);
          try {
            const translationBlob = await getSpeechBlob(String(part.chinese), { session: voiceSession });
            parts.push(translationBlob);
            cursor += neuralVoice.estimateDuration(translationBlob);
          } catch (error) {
            failed += 1;
            console.warn("Could not generate translation audio.", part.chinese, error);
          }
        }
        if (partIndex < entryParts.length - 1) {
          const groupGap = neuralVoice.silence(0.34);
          parts.push(groupGap);
          cursor += neuralVoice.estimateDuration(groupGap);
        }
      }
      const entryEnd = cursor;
      timeline.push({
        entryIndex,
        start: entryStart,
        end: Math.max(entryEnd, entryStart + 0.05),
        duration: Math.max(0.05, entryEnd - entryStart)
      });
      if (intervalSeconds > 0) {
        const interval = neuralVoice.silence(intervalSeconds);
        parts.push(interval);
        cursor += neuralVoice.estimateDuration(interval);
      }
      onProgress?.(entryIndex + 1, playlist.length, entry);
      await Promise.resolve();
    }
      if (!speechCount) {
        throw new Error("No neural speech was generated");
      }
      const composed = await composeListeningParts(parts, token);
      return {
        blob: composed.blob,
        timeline,
        duration: composed.duration,
        failed
      };
    } finally {
      voiceSession.close();
    }
  }

  function unlockListeningAudio() {
    const audio = state.listening.audio;
    try {
      if (state.listening.audioUrl) {
        URL.revokeObjectURL(state.listening.audioUrl);
        state.listening.audioUrl = "";
      }
      const silenceBlob = neuralVoice.silence(0.12);
      state.listening.audioUrl = URL.createObjectURL(silenceBlob);
      audio.loop = true;
      audio.volume = 0;
      audio.src = state.listening.audioUrl;
      audio.play().catch((error) => console.debug("Audio unlock skipped.", error));
    } catch (error) {
      console.debug(error);
    }
  }

  async function getSpeechBlobForPart(part, options = {}) {
    if (!part) throw new Error("Missing listening part");
    if (part.kind === "number") {
      return getSpeechBlob(numberToEnglish(Number(part.number)), { ...options, number: part.number });
    }
    return getSpeechBlob(part.audioText || part.english || part.text || "", options);
  }

  async function getSpeechBlob(text, options = {}) {
    const normalized = neuralVoice.normalizeText(text);
    if (!normalized) throw new Error("Missing speech text");
    await state.voicePackPromise;
    const voiceEntry = state.voicePackIndex[normalized];
    const cacheKey = voiceEntry?.file ? `pack:${voiceEntry.file}` : `text:${normalized}`;
    if (state.audioBlobCache.has(cacheKey)) return state.audioBlobCache.get(cacheKey);
    let blob = null;

    if (voiceEntry?.file) {
      blob = await neuralVoice.fetchAudioBlob(`audio/voice-pack/${voiceEntry.file}`);
    } else if (["localhost", "127.0.0.1"].includes(window.location.hostname)) {
      try {
        const params = new URLSearchParams({ text: normalized, voice: settings.voice });
        blob = await neuralVoice.fetchAudioBlob(`/api/text-speech?${params.toString()}`);
      } catch (error) {
        console.debug("Local speech endpoint unavailable.", error);
      }
    }

    if (!blob) {
      if (Date.now() < state.neuralCooldownUntil) throw new Error("Neural voice is cooling down");
      const requestedVoice = options.voice || (neuralVoice.containsChinese(normalized) ? "zh-CN-XiaoxiaoNeural" : "en-GB-SoniaNeural");
      try {
        blob = options.session
          ? await options.session.synthesize(normalized, { voice: requestedVoice })
          : await neuralVoice.synthesize(normalized, { voice: requestedVoice });
      } catch (error) {
        state.neuralCooldownUntil = Date.now() + 60000;
        throw error;
      }
    }
    if (!blob?.size) throw new Error("Empty speech audio");
    state.audioBlobCache.set(cacheKey, blob);
    return blob;
  }

  async function playRepeatedSpeech(text, repeat, token, options = {}) {
    const playbackRate = playbackRateForType(options.type || "number");
    const immediate = getSyncSpeechSources(text, options.type || "number");
    if (options.preferImmediate && (!immediate || immediate.external)) {
      for (let index = 0; index < Math.max(1, repeat); index += 1) {
        if (token !== state.token) return;
        await speakBrowserText(text, playbackRate, token);
        if (token !== state.token) return;
        if (index < repeat - 1) await wait(850);
      }
      return;
    }
    if (immediate) {
      try {
        for (let index = 0; index < Math.max(1, repeat); index += 1) {
          if (token !== state.token) return;
          let playedAny = false;
          for (const source of immediate.sources) {
            if (token !== state.token) return;
            try {
              await playAudio(source, token, { rate: playbackRate });
              playedAny = true;
            } catch (error) {
              if (!immediate.external) throw error;
              console.debug("External audio segment unavailable; trying next source.", error);
              continue;
            }
            if (immediate.sources.length > 1) await wait(260);
          }
          if (!playedAny) await speakBrowserText(text, playbackRate, token);
          if (token !== state.token) return;
          if (index < repeat - 1) await wait(850);
        }
      } finally {
        if (immediate.revoke) immediate.sources.forEach((source) => URL.revokeObjectURL(source));
      }
      return;
    }

    const warmup = warmNeuralSpeech(text, options);
    for (let index = 0; index < Math.max(1, repeat); index += 1) {
      if (token !== state.token) return;
      try {
        await speakBrowserText(text, playbackRate, token);
      } catch (error) {
        const blob = await warmup;
        if (!blob) throw error;
        await playAudioBlob(blob, token, { rate: playbackRate });
      }
      if (token !== state.token) return;
      if (index < repeat - 1) await wait(850);
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
      let loadTimer = null;
      const finish = (error = null) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(loadTimer);
        audio.onended = null;
        audio.onerror = null;
        audio.onplaying = null;
        if (error) reject(error);
        else resolve();
      };
      audio.onended = () => finish();
      audio.onerror = () => finish(new Error("Listening audio failed"));
      audio.onplaying = () => window.clearTimeout(loadTimer);
      loadTimer = window.setTimeout(() => finish(new Error("Listening audio start timed out")), 8000);
      audio.playbackRate = Number(dom.listeningSpeed.value) || 1;
      audio.preservesPitch = true;
      audio.webkitPreservesPitch = true;
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

  function stopListeningAudio() {
    state.listening.token += 1;
    const audio = state.listening.audio;
    if (audio) {
      beginListeningInternalOperation(600);
      audio.onended = null;
      audio.onerror = null;
      try { audio.pause(); } catch (error) { console.debug(error); }
      try { audio.removeAttribute("src"); audio.load(); } catch (error) { console.debug(error); }
    }
    if (state.listening.audioUrl) {
      try { URL.revokeObjectURL(state.listening.audioUrl); } catch (error) { console.debug(error); }
      state.listening.audioUrl = "";
    }
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  function stopListening() {
    stopListeningAudio();
    stopListeningWatchdog();
    state.listening.playing = false;
    state.listening.started = false;
    state.listening.preparing = false;
    state.listening.currentTrack = -1;
    state.listening.timeline = [];
    state.listening.totalDuration = 0;
    state.listening.consumedSeconds = 0;
    state.listening.lastTime = 0;
    if (state.listening.sleepTimer) window.clearInterval(state.listening.sleepTimer);
    if (state.listening.interruptionResumeTimer) window.clearTimeout(state.listening.interruptionResumeTimer);
    if (state.listening.internalOperationTimer) window.clearTimeout(state.listening.internalOperationTimer);
    state.listening.sleepTimer = null;
    state.listening.interruptionResumeTimer = null;
    state.listening.internalOperationTimer = null;
    state.listening.internalOperation = false;
    state.listening.interruptionPaused = false;
    state.listening.resumeAfterInterruption = false;
    state.listening.sleepDeadline = 0;
    state.listening.sleepAudioDeadline = 0;
    state.listening.directFallback = false;
    state.listening.continuous = false;
    state.listening.preparedQueueActive = false;
    updateMediaSessionState("none");
    renderListening();
  }

  function configureSleepTimer() {
    if (state.listening.sleepTimer) window.clearInterval(state.listening.sleepTimer);
    state.listening.sleepTimer = null;
    const minutes = Number(dom.listeningSleep.value) || 0;
    state.listening.sleepDeadline = minutes ? Date.now() + minutes * 60000 : 0;
    state.listening.sleepAudioDeadline = minutes ? state.listening.consumedSeconds + minutes * 60 : 0;
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
    return (state.listening.sleepDeadline > 0 && Date.now() >= state.listening.sleepDeadline)
      || (state.listening.sleepAudioDeadline > 0 && state.listening.consumedSeconds >= state.listening.sleepAudioDeadline);
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
    dom.listeningChinese.textContent = current
      ? `${current.chinese || ""}${current.note ? ` · ${current.note}` : ""}`
      : "选择内容后点击开始";
    dom.listeningPlayButton.textContent = state.listening.preparing
      ? "准备中"
      : state.listening.playing
        ? "暂停"
        : (state.listening.started ? "继续" : "播放");
    dom.listeningProgressBar.style.width = total ? `${(index / total) * 100}%` : "0%";
    if (!state.listening.sleepDeadline) dom.listeningSleepStatus.textContent = "睡眠模式关闭";
    renderListeningStartOptions();
  }

  function predictionTypeLabel(type) {
    return {
      phone: "电话号码",
      money: "金额",
      date: "日期 / 月份",
      year: "年份",
      time: "时间",
      decimal: "小数",
      general: "普通数字"
    }[type] || "数字";
  }

  function predictionMoneyToEnglish(value) {
    const source = String(value || "").trim();
    const match = source.match(/([0-9][0-9,]*(?:\.[0-9]{1,2})?)/);
    if (!match) return source;
    const amount = match[1].replace(/,/g, "");
    const [wholeText, decimalText = ""] = amount.split(".");
    const whole = Number(wholeText) || 0;
    const decimal = decimalText ? Number(decimalText.padEnd(2, "0")) : 0;
    let main = "pounds";
    let subunit = "pence";
    if (/\$|usd|dollar/i.test(source)) {
      main = "dollars"; subunit = "cents";
    } else if (/€|eur|euro/i.test(source)) {
      main = "euros"; subunit = "cents";
    }
    const parts = [];
    if (whole > 0) parts.push(`${numberToEnglish(whole)} ${whole === 1 ? main.slice(0, -1) : main}`);
    if (decimal > 0) parts.push(`${numberToEnglish(decimal)} ${decimal === 1 ? subunit.slice(0, -1) : subunit}`);
    return parts.join(" ") || `${numberToEnglish(whole)} ${main}`;
  }

  function predictionDateToEnglish(value) {
    const source = String(value || "").trim();
    const lower = source.toLowerCase();
    let day = null;
    let monthIndex = null;
    let year = null;
    MONTHS.forEach((month, index) => {
      if (lower.includes(month.toLowerCase())) monthIndex = index;
    });
    const numbers = Array.from(source.matchAll(/\d+/g)).map((item) => Number(item[0]));
    if (monthIndex !== null) {
      const dayValue = numbers.find((number) => number >= 1 && number <= 31);
      const yearValue = numbers.find((number) => number >= 1000 && number <= 2999);
      day = dayValue || null;
      year = yearValue || null;
    } else {
      const numeric = source.match(/(\d{1,2})[\/\-.](\d{1,2})(?:[\/\-.](\d{2,4}))?/);
      if (numeric) {
        const first = Number(numeric[1]);
        const second = Number(numeric[2]);
        if (first <= 31 && second <= 12) {
          day = first; monthIndex = second - 1;
        } else if (first <= 12 && second <= 31) {
          monthIndex = first - 1; day = second;
        }
        year = numeric[3] ? Number(numeric[3]) : null;
      }
    }
    if (monthIndex === null || !MONTHS[monthIndex]) return source;
    const month = MONTHS[monthIndex];
    const dateText = day ? `the ${ordinalEnglish(day)} of ${month}` : month;
    return year ? `${dateText} ${yearToEnglish(year)}` : dateText;
  }

  function predictionTimeToEnglish(value) {
    const match = String(value || "").trim().match(/(\d{1,2})[:.](\d{2})/);
    if (!match) return String(value || "").trim();
    const hour = Number(match[1]);
    const minute = Number(match[2]);
    const hourText = hour === 0 ? "oh" : numberToEnglish(hour);
    if (minute === 0) return `${hourText} o'clock`;
    if (minute < 10) return `${hourText} oh ${numberToEnglish(minute)}`;
    return `${hourText} ${numberToEnglish(minute)}`;
  }

  function predictionDecimalToEnglish(value) {
    const source = String(value || "").trim().replace(/,/g, "");
    const match = source.match(/^(-)?(\d+)(?:\.(\d+))?$/);
    if (!match) return source;
    const parts = [];
    if (match[1]) parts.push("minus");
    parts.push(numberToEnglish(Number(match[2])));
    if (match[3]) {
      parts.push("point");
      match[3].split("").forEach((digit) => parts.push(ONES[Number(digit)]));
    }
    return parts.join(" ");
  }

  function predictionSpokenText(value, type) {
    const source = String(value || "").trim();
    if (!source) return "";
    if (type === "phone") return phoneToEnglish(source);
    if (type === "money") return predictionMoneyToEnglish(source);
    if (type === "date") return predictionDateToEnglish(source);
    if (type === "year") return yearToEnglish(Number(source.replace(/[^\d]/g, "")));
    if (type === "time") return predictionTimeToEnglish(source);
    if (type === "decimal") return predictionDecimalToEnglish(source);
    return numberToEnglish(Number(source.replace(/[,\s]/g, ""))) || source;
  }

  function renderPredictionStartOptions() {
    renderSelectOptions(
      dom.predictionPracticeStartSelect,
      state.predictionItems,
      (item) => item.id,
      (item, index) => `${index + 1}. ${item.value}`
    );
  }

  function renderPrediction() {
    if (!dom.predictionList) return;
    renderPredictionStartOptions();
    dom.startPredictionPracticeButton.disabled = state.predictionItems.length === 0;
    dom.predictionItemCount.textContent = String(state.predictionItems.length);
    dom.predictionList.replaceChildren();
    if (!state.predictionItems.length) {
      const empty = document.createElement("div");
      empty.className = "prediction-empty";
      empty.textContent = "还没有数字预测内容，点击右上角“添加数字”开始录入。";
      dom.predictionList.appendChild(empty);
      return;
    }
    state.predictionItems.forEach((item, index) => {
      const card = document.createElement("article");
      card.className = "prediction-card";
      card.dataset.id = item.id;
      const value = document.createElement("div");
      value.className = "prediction-card-value";
      value.textContent = item.value;
      const type = document.createElement("div");
      type.className = "prediction-card-type";
      type.textContent = predictionTypeLabel(item.type);
      const spoken = document.createElement("div");
      spoken.className = "prediction-card-spoken";
      spoken.textContent = item.spokenText || predictionSpokenText(item.value, item.type);
      const chinese = document.createElement("div");
      chinese.className = "prediction-card-type";
      chinese.textContent = item.chinese || "未填写中文提示";
      const note = document.createElement("div");
      note.className = "prediction-card-note";
      note.textContent = item.note || "";
      const actions = document.createElement("div");
      actions.className = "prediction-card-actions";
      const play = document.createElement("button");
      play.type = "button";
      play.className = "secondary-button";
      play.dataset.action = "play";
      play.dataset.index = String(index);
      play.dataset.id = item.id;
      play.textContent = state.playingWord === `prediction:${item.id}` ? "停止" : "播放";
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "text-button";
      remove.dataset.action = "delete";
      remove.dataset.id = item.id;
      remove.textContent = "删除";
      actions.append(play, remove);
      card.append(value, type, spoken, chinese, note, actions);
      dom.predictionList.appendChild(card);
    });
  }

  function openPredictionEditor(itemId = null) {
    const item = state.predictionItems.find((entry) => entry.id === itemId);
    state.predictionEditorId = item?.id || null;
    dom.predictionEditorTitle.textContent = item ? "编辑数字预测内容" : "添加数字预测内容";
    dom.predictionValueInput.value = item?.value || "";
    dom.predictionTypeInput.value = item?.type || "phone";
    dom.predictionSpokenInput.value = item?.spokenText || "";
    dom.predictionChineseInput.value = item?.chinese || "";
    dom.predictionNoteInput.value = item?.note || "";
    dom.predictionSaveStatus.textContent = item ? "修改后点击保存。" : "保存后可以继续添加下一条。";
    dom.predictionEditor.hidden = false;
    dom.predictionValueInput.focus();
  }

  function closePredictionEditor() {
    state.predictionEditorId = null;
    dom.predictionEditor.hidden = true;
    dom.predictionValueInput.value = "";
    dom.predictionSpokenInput.value = "";
    dom.predictionChineseInput.value = "";
    dom.predictionNoteInput.value = "";
  }

  function savePredictionItem() {
    const value = dom.predictionValueInput.value.trim();
    const type = dom.predictionTypeInput.value;
    if (!value) {
      dom.predictionValueInput.focus();
      return;
    }
    const spokenText = dom.predictionSpokenInput.value.trim() || predictionSpokenText(value, type);
    if (!spokenText) {
      dom.predictionSaveStatus.textContent = "无法自动转换，请手动填写标准英文读法。";
      return;
    }
    const entry = {
      value,
      type,
      spokenText,
      chinese: dom.predictionChineseInput.value.trim(),
      note: dom.predictionNoteInput.value.trim(),
      updatedAt: Date.now()
    };
    if (state.predictionEditorId) {
      const index = state.predictionItems.findIndex((item) => item.id === state.predictionEditorId);
      if (index !== -1) state.predictionItems[index] = { ...state.predictionItems[index], ...entry };
    } else {
      state.predictionItems.unshift({
        id: `prediction-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        createdAt: Date.now(),
        ...entry
      });
    }
    savePredictionItems();
    preloadPredictionSpeech(spokenText, type);
    renderPrediction();
    const saved = value;
    dom.predictionValueInput.value = "";
    dom.predictionSpokenInput.value = "";
    dom.predictionChineseInput.value = "";
    dom.predictionNoteInput.value = "";
    state.predictionEditorId = null;
    dom.predictionSaveStatus.textContent = `已保存“${saved}”，可继续添加下一条。`;
    dom.predictionValueInput.focus();
  }

  function handlePredictionListClick(event) {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const item = state.predictionItems.find((entry) => entry.id === button.dataset.id);
    if (!item) return;
    if (button.dataset.action === "delete") {
      state.predictionItems = state.predictionItems.filter((entry) => entry.id !== item.id);
      if (!state.deletedPredictionIds.includes(item.id)) {
        state.deletedPredictionIds.push(item.id);
        saveDeletedPredictionIds();
      }
      savePredictionItems();
      renderPrediction();
      return;
    }
    if (button.dataset.action === "play") {
      playPredictionItem(item);
    }
  }

  function startPredictionPractice() {
    if (!state.predictionItems.length) {
      dom.predictionSaveStatus.textContent = "请先添加数字预测内容。";
      return;
    }
    const orderedItems = reorderFromSelected(
      state.predictionItems,
      dom.predictionPracticeStartSelect?.value || ""
    );
    const practiceItems = orderedItems.map((item) => ({
      id: `prediction-practice-${item.id}`,
      text: item.value,
      audioText: item.spokenText || predictionSpokenText(item.value, item.type),
      predictionType: item.type,
      translation: item.chinese || "数字预测内容",
      note: item.note || "",
      phonetic: "",
      example: "",
      exampleTranslation: ""
    }));
    startCustomPractice(practiceItems, "prediction");
  }

  function predictionSpeechGroups(text) {
    const normalized = neuralVoice.normalizeText(text);
    if (!normalized) return [];
    const phrases = normalized.split(/[,;.!?，。；！？]+/).map((part) => part.trim()).filter(Boolean);
    const groups = [];
    phrases.forEach((phrase) => {
      const words = phrase.split(/\s+/).filter(Boolean);
      if (words.length <= 4) {
        groups.push(phrase);
        return;
      }
      for (let index = 0; index < words.length; index += 3) {
        groups.push(words.slice(index, index + 3).join(" "));
      }
    });
    return groups.length ? groups : [normalized];
  }

  function playPredictionBrowserText(text, rate, token) {
    const groups = predictionSpeechGroups(text);
    return (async () => {
      for (const group of groups) {
        if (token !== state.token) return;
        await speakBrowserText(group, rate, token);
        if (token !== state.token) return;
        await wait(280);
      }
    })();
  }

  async function playPredictionItem(item) {
    const key = `prediction:${item.id}`;
    if (state.playingWord === key && state.playing) {
      stopPlayback();
      return;
    }
    stopListening();
    stopPlayback();
    const token = ++state.token;
    state.playingWord = key;
    setPlaying(true);
    renderPrediction();
    const markedText = String(item.spokenText || predictionSpokenText(item.value, item.type) || "").trim();
    const repeat = Math.max(1, Number(settings.repeat) || 1);
    try {
      await playRepeatedSpeech(markedText, repeat, token, { type: item.type });
    } catch (error) {
      console.error(error);
    } finally {
      if (token === state.token) {
        setPlaying(false);
        state.playingWord = null;
        renderPrediction();
      }
    }
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

  async function loadBundledVocabulary() {
    try {
      const response = await fetch("data/izzy-vocabulary-918.json?v=20261013", { cache: "no-cache" });
      if (!response.ok) return;
      const payload = await response.json();
      const bundledCustom = Array.isArray(payload.customItems) ? payload.customItems : [];
      const bundledHearing = Array.isArray(payload.hearingWrong) ? payload.hearingWrong : [];
      const customMap = new Map(state.customItems.map((item) => [item.id, item]));
      const hearingMap = new Map(state.hearingWrong.map((item) => [item.id, item]));
      bundledCustom.forEach((item) => {
        if (item?.id && !customMap.has(item.id) && !state.deletedCustomIds.includes(item.id)) customMap.set(item.id, item);
      });
      bundledHearing.forEach((item) => {
        if (item?.id && !hearingMap.has(item.id)) hearingMap.set(item.id, item);
      });
      const nextCustom = Array.from(customMap.values()).sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0));
      const nextHearing = Array.from(hearingMap.values());
      const changed = nextCustom.length !== state.customItems.length || nextHearing.length !== state.hearingWrong.length;
      state.customItems = nextCustom;
      state.hearingWrong = nextHearing;
      if (changed) {
        saveCustomItems();
        saveHearingWrong();
        renderCustom();
        renderHearingWrong();
        renderListening();
        renderWrongBook();
      }
    } catch (error) {
      console.debug("Bundled vocabulary unavailable.", error);
    }
  }

  function warmCustomItemAudio(item) {
    if (!item) return;
    [item.text, item.translation, item.example, item.exampleTranslation, item.note].filter(Boolean).forEach((text) => {
      preloadExternalSpeech(text);
    });
  }

  function preloadPredictionSpeech(text, type) {
    const groups = predictionSpeechGroups(text);
    groups.forEach((group) => {
      const language = neuralVoice.containsChinese(group) ? "zh" : "en";
      const sources = language === "zh"
        ? [getBaiduTtsUrl(group, "zh")]
        : [getYoudaoAudioUrl(group, "1"), getBaiduTtsUrl(group, "en")];
      sources.forEach((source) => {
        try {
          fetch(source, { mode: "no-cors", cache: "force-cache" }).catch(() => {});
          const audio = new Audio();
          audio.preload = "auto";
          audio.src = source;
          audio.load();
        } catch (error) {
          console.debug("Could not preload prediction speech.", error);
        }
      });
    });
  }

  function preloadExternalSpeech(text) {
    const normalized = neuralVoice.normalizeText(text);
    if (!normalized || state.voicePackIndex[normalized]) return;
    const sources = getSyncSpeechSources(normalized)?.sources || [];
    sources.filter((source) => /^https?:/i.test(source)).forEach((source) => {
      try {
        const audio = new Audio();
        audio.preload = "auto";
        audio.src = source;
        audio.load();
      } catch (error) {
        console.debug("Could not preload speech.", error);
      }
    });
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
    warmCustomItemAudio(entry);
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

  function renderSelectOptions(select, items, getValue, getLabel) {
    if (!select) return;
    const selected = select.value;
    select.replaceChildren();
    items.forEach((item, index) => {
      const option = document.createElement("option");
      option.value = getValue(item, index);
      option.textContent = getLabel(item, index);
      select.appendChild(option);
    });
    const hasSelected = items.some((item, index) => getValue(item, index) === selected);
    if (hasSelected) select.value = selected;
    select.disabled = !items.length;
  }

  function renderCustomStartOptions() {
    renderSelectOptions(
      dom.customPracticeStartSelect,
      state.customItems,
      (item) => item.id,
      (item, index) => `${index + 1}. ${item.text}`
    );
    const savedId = loadCustomPracticePositionId();
    if (savedId && Array.from(dom.customPracticeStartSelect.options).some((option) => option.value === savedId)) {
      dom.customPracticeStartSelect.value = savedId;
    }
  }

  function renderCustom() {
    dom.customItemCount.textContent = String(state.customItems.length);
    renderCustomStartOptions();
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
    dom.customModeLabel.textContent = session.source === "hearing"
      ? "听力错词复习"
      : session.source === "prediction"
        ? "数字预测拼写"
        : "我的词句拼写";
    dom.customAnswerLabel.textContent = session.source === "prediction" ? "填写“数字或日期内容”一栏" : "英文拼写";
    dom.customAnswerInput.placeholder = session.source === "prediction" ? "例如 07749132760 / £25.50 / March 15" : "填写完整英文";
    dom.customListenHint.textContent = session.source === "prediction"
      ? "听标准英文读法，填写你最初录入的“数字或日期内容”。轻触播放区域重播，Enter 提交/下一题。"
      : "按 3 显示提示，Tab 重播当前内容";
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
      const predictionMode = session.source === "prediction";
      dom.customStartTitle.textContent = predictionMode
        ? "准备练习数字预测拼写"
        : (state.customItems.length ? "准备练习你的词句" : "先添加你要拼写的英文");
      dom.customStartDescription.textContent = predictionMode
        ? "听标准英文读法，填写完整英文；提交后显示对应数字、中文提示和笔记。"
        : (state.customItems.length
          ? "听英文，填写完整拼写；提交后显示中文翻译和个人笔记。"
          : "保存词句后，可以听英文、填写拼写，并查看中文翻译和笔记。");
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

  function reorderFromSelected(items, selectedId) {
    if (!Array.isArray(items) || !items.length || !selectedId) return items;
    const selectedIndex = items.findIndex((item) => item.id === selectedId);
    if (selectedIndex <= 0) return items;
    return [...items.slice(selectedIndex), ...items.slice(0, selectedIndex)];
  }

  function startCustomPractice(items = null, source = "all") {
    let sourceItems = Array.isArray(items) ? items : state.customItems;
    if (!Array.isArray(items) && source === "all") {
      sourceItems = reorderFromSelected(sourceItems, dom.customPracticeStartSelect?.value || "");
      if (sourceItems[0]?.id) {
        saveCustomPracticePositionId(sourceItems[0].id);
        dom.customPracticeStartSelect.value = sourceItems[0].id;
      }
    }
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
    resetThreeInputTracking();
    dom.customResult.hidden = true;
    renderCustomSession();
    dom.customAnswerInput.focus();
    playCurrentCustom();
  }

  async function playCurrentCustom() {
    const item = currentCustomItem();
    if (!item) return;
    stopListening();
    stopPlayback();
    const token = ++state.token;
    setPlaying(true);
    try {
      dom.customPlayStatus.textContent = "正在播放有道标准发音";
      const audioText = state.customSession.source === "prediction"
        ? (item.audioText || item.text)
        : item.text;
      await playRepeatedSpeech(audioText, settings.repeat, token, {
        type: item.predictionType || "number"
      });
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

  function hidePracticeReminder() {
    if (dom.practiceReminder) dom.practiceReminder.hidden = true;
  }

  function togglePracticeReminder() {
    if (!dom.practiceReminder || !state.customSession.started || state.customSession.complete) return;
    const item = currentCustomItem();
    if (!item) return;
    if (!dom.practiceReminder.hidden) {
      hidePracticeReminder();
      return;
    }
    dom.practiceReminder.replaceChildren();
    const addLine = (label, value) => {
      if (!value) return;
      const line = document.createElement("div");
      const strong = document.createElement("strong");
      strong.textContent = `${label}：`;
      line.append(strong, document.createTextNode(String(value)));
      dom.practiceReminder.appendChild(line);
    };
    if (state.customSession.source === "prediction") {
      addLine("原始数字", item.text);
      addLine("标准英文读法", item.audioText || predictionSpokenText(item.text, item.predictionType));
    } else {
      addLine("词汇提醒", item.text);
      addLine("音标", item.phonetic || lookupPhonetic(item.text));
      addLine("中文", item.translation || "");
    }
    dom.practiceReminder.hidden = false;
  }

  function normalizePredictionAnswer(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .replace(/，/g, ",")
      .replace(/\s+/g, "")
      .replace(/,/g, "");
  }

  function predictionAnswerMatches(answer, item) {
    const actual = normalizePredictionAnswer(answer);
    const expected = normalizePredictionAnswer(item.text);
    if (actual === expected) return true;
    if (item.predictionType === "money") {
      return actual.replace(/[£$€]/g, "") === expected.replace(/[£$€]/g, "");
    }
    return false;
  }

  function customAnswerIsCorrect(answer, item) {
    return state.customSession.source === "prediction"
      ? predictionAnswerMatches(answer, item)
      : normalizeEnglish(answer) === normalizeEnglish(item.text);
  }

  function handleCustomInput() {
    clearAutoSubmit();
    if (state.customSession.checked || settings.submitMode !== "auto") return;
    const item = currentCustomItem();
    if (!item) return;
    const answer = dom.customAnswerInput.value.trim();
    if (answer && customAnswerIsCorrect(answer, item)) {
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
    const correct = customAnswerIsCorrect(answer, item);
    state.customSession.checked = true;
    state.customSession.answered += 1;
    if (correct) {
      state.customSession.correct += 1;
      removeHearingWrong(item.id);
    } else {
      addOrResetHearingWrong(item);
    }
    dom.customResult.hidden = false;
    dom.customResult.classList.toggle("is-wrong", !correct);
    dom.customResultMark.textContent = correct ? "正确" : "需要再练";
    dom.customResultNote.textContent = correct ? "拼写正确，已移出听力错词本" : "已自动加入听力错词本";
    const predictionMode = state.customSession.source === "prediction";
    dom.customCorrectAnswerLabel.textContent = predictionMode ? "原始数字 / 日期" : "正确答案";
    dom.customCorrectPhoneticLabel.textContent = predictionMode ? "标准英文读法" : "英式音标";
    dom.customCorrectAnswer.textContent = item.text;
    dom.customCorrectPhonetic.textContent = predictionMode
      ? (item.audioText || predictionSpokenText(item.text, item.predictionType))
      : (item.phonetic || lookupPhonetic(item.text) || "暂无英式音标");
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
    hidePracticeReminder();
    if (!state.customSession.started || state.customSession.complete) return;
    if (state.customSession.index >= state.customSession.items.length - 1) {
      finishCustomRound();
      return;
    }
    stopPlayback();
    state.customSession.index += 1;
    state.customSession.checked = false;
    dom.customAnswerInput.value = "";
    resetThreeInputTracking();
    dom.customResult.hidden = true;
    dom.customUserAnswerRow.hidden = true;
    renderCustomSession();
    if (state.customSession.source === "all") {
      const current = currentCustomItem();
      if (current?.id) {
        saveCustomPracticePositionId(current.id);
        dom.customPracticeStartSelect.value = current.id;
      }
    }
    dom.customAnswerInput.focus();
    if (autoPlay) playCurrentCustom();
  }

  function finishCustomRound() {
    hidePracticeReminder();
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

  function removeHearingWrong(id) {
    const next = state.hearingWrong.filter((entry) => entry.id !== id);
    if (next.length !== state.hearingWrong.length) {
      state.hearingWrong = next;
      saveHearingWrong();
      renderHearingWrong();
    }
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
    const orderedEntries = reorderFromSelected(entries, dom.hearingPracticeStartSelect?.value || "");
    startCustomPractice(orderedEntries.map((entry) => ({
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
    renderSelectOptions(
      dom.hearingPracticeStartSelect,
      state.hearingWrong,
      (item) => item.id,
      (item, index) => `${index + 1}. ${item.text}`
    );
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
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "small-action";
      remove.dataset.action = "remove";
      remove.dataset.id = item.id;
      remove.textContent = "×";
      remove.setAttribute("aria-label", "移出错词本");
      actions.append(play, retry, remove);
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
      playSmartText(item.text, token).finally(() => setPlaying(false));
    }
    if (button.dataset.action === "edit") openCustomEditor(item.id);
    if (button.dataset.action === "delete") {
      state.customItems = state.customItems.filter((entry) => entry.id !== item.id);
      if (!state.deletedCustomIds.includes(item.id)) {
        state.deletedCustomIds.push(item.id);
        saveDeletedCustomIds();
      }
      saveCustomItems();
      renderCustom();
      renderListening();
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
      playSmartText(item.text, token).finally(() => setPlaying(false));
    }
    if (button.dataset.action === "retry") {
      startCustomPractice([{ id: item.id, text: item.text, translation: item.translation, note: item.note }], "hearing");
    }
    if (button.dataset.action === "remove") {
      removeHearingWrong(item.id);
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

    state.wrongNumbers.forEach((entry, index) => {
      const decoded = decodeWrongValue(entry);
      dom.wrongBookList.appendChild(createWrongBookItem({
        type: "number",
        index,
        value: answerTextForValue(decoded.value, decoded.type),
        word: spokenTextForValue(decoded.value, decoded.type),
        note: decoded.type === "phone"
          ? "电话号码错题 · 重练时填写阿拉伯数字"
          : decoded.type === "year"
            ? "年份错题 · 重练时填写阿拉伯数字"
            : "数字错题 · 重练时填写阿拉伯数字",
        key: `number:${String(entry)}`
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
    const rawNumber = type === "number" ? state.wrongNumbers[index] : null;
    const decodedNumber = type === "number" ? decodeWrongValue(rawNumber) : null;
    const entry = type === "number"
      ? { key: `number:${String(rawNumber)}`, number: decodedNumber.value, valueType: decodedNumber.type }
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
        await playNumberAudio(entry.number, token, entry.valueType);
      } else {
        await playSmartText(entry.data.audioText, token);
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

  function addWrongNumber(number, type = currentValueType()) {
    const value = encodeWrongValue(number, type);
    if (!state.wrongNumbers.some((entry) => String(entry) === String(value))) {
      state.wrongNumbers.push(value);
      state.wrongNumbers.sort(compareWrongEntries);
      saveWrongData();
    }
  }

  function removeWrongNumber(number, type = currentValueType()) {
    const value = encodeWrongValue(number, type);
    state.wrongNumbers = state.wrongNumbers.filter((entry) => String(entry) !== String(value));
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
