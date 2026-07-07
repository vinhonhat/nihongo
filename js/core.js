// js/core.js
// Điều khiển app V1.1: mở khóa audio, hiện menu, load CSS/JS game khi bấm.
// =====================================================
// PHIÊN BẢN APP
// Từ V1.2.9 trở đi: thông tin hiển thị ưu tiên đọc từ version.json.
// CORE_APP_VERSION chỉ là bản dự phòng để so sánh/cảnh báo khi đang chạy cache cũ.
// =====================================================

const CORE_APP_VERSION = '1.2.9.1-light-fix';
const APP_VERSION = CORE_APP_VERSION;
const APP_VERSION_KEY = 'nihongo_app_version';

const NIHONGO_APP_META = {
    name: 'Nihongo Quest',
    displayVersion: 'V1.2.9.1 Nihongo',
    get versionText() { return 'Ứng dụng web học tiếng Nhật Nihongo Quest ' + this.displayVersion.replace(' Nihongo', ''); },
    author: 'Quang Vinh - Vinh ở Nhật',
    contact: 'https://vinhonhat.github.io'
};
window.NIHONGO_APP_META = NIHONGO_APP_META;

let NIHONGO_REMOTE_VERSION_INFO = null;

function buildNihongoVersionText(displayVersion) {
    return 'Ứng dụng web học tiếng Nhật Nihongo Quest ' + String(displayVersion || '').replace(' Nihongo', '');
}

function applyNihongoVersionInfo(info) {
    if (!info || typeof info !== 'object') return;
    NIHONGO_REMOTE_VERSION_INFO = info;
    const meta = window.NIHONGO_APP_META || NIHONGO_APP_META;
    if (info.name) meta.name = String(info.name);
    if (info.displayVersion) meta.displayVersion = String(info.displayVersion);
    if (info.author) meta.author = String(info.author);
    if (info.contact) meta.contact = String(info.contact);
    if (info.versionText) {
        Object.defineProperty(meta, 'versionText', {
            configurable: true,
            enumerable: true,
            get() { return String(info.versionText); }
        });
    } else if (info.displayVersion) {
        Object.defineProperty(meta, 'versionText', {
            configurable: true,
            enumerable: true,
            get() { return buildNihongoVersionText(meta.displayVersion); }
        });
    }
    window.NIHONGO_APP_META = meta;
    if (document.readyState !== 'loading') applyNihongoAppMeta();
}

function getNihongoRuntimeVersion() {
    return String((NIHONGO_REMOTE_VERSION_INFO && NIHONGO_REMOTE_VERSION_INFO.version) || APP_VERSION);
}


const NIHONGO_REMOTE_VERSION_URL = 'version.json';
const NIHONGO_OFFLINE_CACHE_NAME = 'nihongo-offline-runtime';
const NIHONGO_OFFLINE_READY_KEY = 'nihongo_offline_ready_version';

function buildNihongoOfflineAssetList() {
    const assets = [
        './',
        'index.html',
        'manifest.json',
        'sw.js',
        'nihongo.png',
        'css/style.css',
        'css/game-core.css',
        'games/nihongo/nihongo.css',
        'games/nihongo/nihongo.js',
        'js/asset.js',
        'js/audio.js',
        'js/core.js',
        'js/game-core.js',
        'js/game-menu.js',
        'js/nihongo-settings.js',
        'games/nihongo/data/n0/kana.js',
        'games/nihongo/data/n0/vocab.js',
        'games/nihongo/data/n0/kanji.js',
        'games/nihongo/data/n0/listening.js',
        'games/nihongo/data/n0/grammar.js'
    ];

    ['n5', 'n4', 'n3', 'n2', 'n1'].forEach(level => {
        ['index.js', 'vocab.js', 'kanji.js', 'listening.js', 'grammar.js'].forEach(file => {
            assets.push(`games/nihongo/data/${level}/${file}`);
        });
        for (let i = 1; i <= 25; i += 1) {
            assets.push(`games/nihongo/data/${level}/lesson${String(i).padStart(2, '0')}.js`);
        }
    });

    return assets;
}

function isNihongoStandalonePwa() {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function applyNihongoAppMeta() {
    const meta = window.NIHONGO_APP_META || NIHONGO_APP_META;
    document.querySelectorAll('[data-app-meta]').forEach(el => {
        const key = el.getAttribute('data-app-meta');
        if (!key || meta[key] == null) return;
        el.textContent = String(meta[key]);
    });
}
window.applyNihongoAppMeta = applyNihongoAppMeta;


const loadedCss = new Set();
const loadedJs = new Set();
const gameModules = {};

let activeGame = null;
let activeGameId = null;
let currentQuestionData = null;
let correctAdvanceTimer = null;

let replayTimer = null;
let questionTimer = null;
let timerColorZone = '';
let topTimerLength = 0;

let noInteractionCount = 0;
let gamePausedByNoInteraction = false;

let gameStartedOnce = false;

const GAME_CONFIG = {
    "nihongo_n0_kana": {
        "title": "Hiragana",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n0_kana",
        "type": "registered"
    },
    "nihongo_n0_katakana": {
        "title": "Katakana",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n0_katakana",
        "type": "registered"
    },
    "nihongo_n0_vocab": {
        "title": "Từ đầu tiên",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n0_vocab",
        "type": "registered"
    },
    "nihongo_n0_kanji": {
        "title": "Kanji nhập môn",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n0_kanji",
        "type": "registered"
    },
    "nihongo_n0_grammar": {
        "title": "Mẫu câu nhập môn",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n0_grammar",
        "type": "registered"
    },
    "nihongo_n0_listen": {
        "title": "Nghe nhập môn",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n0_listen",
        "type": "registered"
    },
    "nihongo_n0_quiz": {
        "title": "Kiểm tra nhập môn",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n0_quiz",
        "type": "registered"
    },
    "nihongo_n5_vocab_learn": {
        "title": "Từ vựng N5",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n5_vocab_learn",
        "type": "registered"
    },
    "nihongo_n5_kanji": {
        "title": "Kanji N5",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n5_kanji",
        "type": "registered"
    },
    "nihongo_n5_grammar": {
        "title": "Ngữ pháp N5",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n5_grammar",
        "type": "registered"
    },
    "nihongo_n5_sentence": {
        "title": "Mẫu câu N5",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n5_sentence",
        "type": "registered"
    },

    "nihongo_n5_sentence_build": {
        "title": "Ghép câu N5",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n5_sentence_build",
        "type": "registered"
    },
    "nihongo_n5_vocab_practice": {
        "title": "Luyện từ N5",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n5_vocab_practice",
        "type": "registered"
    },
    "nihongo_n5_listening": {
        "title": "Luyện nghe N5",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n5_listening",
        "type": "registered"
    },
    "nihongo_n5_mock_test": {
        "title": "Thi thử N5",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n5_mock_test",
        "type": "registered"
    },
    "nihongo_n4_vocab_learn": {
        "title": "Từ vựng N4",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n4_vocab_learn",
        "type": "registered"
    },
    "nihongo_n4_kanji": {
        "title": "Kanji N4",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n4_kanji",
        "type": "registered"
    },
    "nihongo_n4_grammar": {
        "title": "Ngữ pháp N4",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n4_grammar",
        "type": "registered"
    },
    "nihongo_n4_sentence": {
        "title": "Mẫu câu N4",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n4_sentence",
        "type": "registered"
    },
    "nihongo_n4_vocab_practice": {
        "title": "Luyện từ N4",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n4_vocab_practice",
        "type": "registered"
    },
    "nihongo_n4_listening": {
        "title": "Luyện nghe N4",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n4_listening",
        "type": "registered"
    },
    "nihongo_n4_mock_test": {
        "title": "Thi thử N4",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n4_mock_test",
        "type": "registered"
    },
    "nihongo_n3_vocab_learn": {
        "title": "Từ vựng N3",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n3_vocab_learn",
        "type": "registered"
    },
    "nihongo_n3_kanji": {
        "title": "Kanji N3",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n3_kanji",
        "type": "registered"
    },
    "nihongo_n3_grammar": {
        "title": "Ngữ pháp N3",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n3_grammar",
        "type": "registered"
    },
    "nihongo_n3_sentence": {
        "title": "Mẫu câu N3",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n3_sentence",
        "type": "registered"
    },
    "nihongo_n3_vocab_practice": {
        "title": "Luyện từ N3",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n3_vocab_practice",
        "type": "registered"
    },
    "nihongo_n3_listening": {
        "title": "Luyện nghe N3",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n3_listening",
        "type": "registered"
    },
    "nihongo_n3_mock_test": {
        "title": "Thi thử N3",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n3_mock_test",
        "type": "registered"
    },
    "nihongo_n2_vocab_learn": {
        "title": "Từ vựng N2",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n2_vocab_learn",
        "type": "registered"
    },
    "nihongo_n2_kanji": {
        "title": "Kanji N2",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n2_kanji",
        "type": "registered"
    },
    "nihongo_n2_grammar": {
        "title": "Ngữ pháp N2",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n2_grammar",
        "type": "registered"
    },
    "nihongo_n2_sentence": {
        "title": "Mẫu câu N2",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n2_sentence",
        "type": "registered"
    },
    "nihongo_n2_vocab_practice": {
        "title": "Luyện từ N2",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n2_vocab_practice",
        "type": "registered"
    },
    "nihongo_n2_listening": {
        "title": "Luyện nghe N2",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n2_listening",
        "type": "registered"
    },
    "nihongo_n2_mock_test": {
        "title": "Thi thử N2",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n2_mock_test",
        "type": "registered"
    },
    "nihongo_n1_vocab_learn": {
        "title": "Từ vựng N1",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n1_vocab_learn",
        "type": "registered"
    },
    "nihongo_n1_kanji": {
        "title": "Kanji N1",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n1_kanji",
        "type": "registered"
    },
    "nihongo_n1_grammar": {
        "title": "Ngữ pháp N1",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n1_grammar",
        "type": "registered"
    },
    "nihongo_n1_sentence": {
        "title": "Mẫu câu N1",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n1_sentence",
        "type": "registered"
    },
    "nihongo_n1_vocab_practice": {
        "title": "Luyện từ N1",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n1_vocab_practice",
        "type": "registered"
    },
    "nihongo_n1_listening": {
        "title": "Luyện nghe N1",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n1_listening",
        "type": "registered"
    },
    "nihongo_n1_mock_test": {
        "title": "Thi thử N1",
        "folder": "nihongo",
        "css": "games/nihongo/nihongo.css",
        "js": "games/nihongo/nihongo.js",
        "moduleId": "nihongo_n1_mock_test",
        "type": "registered"
    }
};

// =====================================================
// TÌM KIẾM / TRA CỨU
// Mỗi cấp có một module search. Khi chọn "Toàn bộ" ở menu,
// phạm vi thật được lưu trong sessionStorage và module search tự đọc.
// =====================================================
['n0', 'n5', 'n4', 'n3', 'n2', 'n1'].forEach(level => {
    const label = level === 'n0' ? 'Nhập môn' : level.toUpperCase();
    GAME_CONFIG[`nihongo_${level}_search`] = {
        title: `Tra cứu ${label}`,
        folder: 'nihongo',
        css: 'games/nihongo/nihongo.css',
        js: 'games/nihongo/nihongo.js',
        moduleId: `nihongo_${level}_search`,
        type: 'registered'
    };
    GAME_CONFIG[`nihongo_${level}_kanji_practice`] = {
        title: `Luyện Kanji ${label}`,
        folder: 'nihongo',
        css: 'games/nihongo/nihongo.css',
        js: 'games/nihongo/nihongo.js',
        moduleId: `nihongo_${level}_kanji_practice`,
        type: 'registered'
    };
    GAME_CONFIG[`nihongo_${level}_grammar_practice`] = {
        title: `Luyện ngữ pháp ${label}`,
        folder: 'nihongo',
        css: 'games/nihongo/nihongo.css',
        js: 'games/nihongo/nihongo.js',
        moduleId: `nihongo_${level}_grammar_practice`,
        type: 'registered'
    };

    // Thi thử JLPT theo đề số. Hiện mỗi đề dùng ngân hàng câu hỏi của cấp;
    // sau này có thể gắn dữ liệu đề riêng theo set01, set02... trong data.
    for (let i = 1; i <= 20; i += 1) {
        const setNo = String(i).padStart(2, '0');
        GAME_CONFIG[`nihongo_${level}_mock_test_${setNo}`] = {
            title: `Thi thử JLPT ${label} - Đề số ${setNo}`,
            folder: 'nihongo',
            css: 'games/nihongo/nihongo.css',
            js: 'games/nihongo/nihongo.js',
            moduleId: `nihongo_${level}_mock_test_${setNo}`,
            type: 'registered'
        };
    }
});

function registerGame(gameId, gameLogic) {
    gameModules[gameId] = gameLogic;
}

function loadCssOnce(href) {
    return new Promise(resolve => {
        if (!href || loadedCss.has(href)) return resolve();

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = () => {
            loadedCss.add(href);
            resolve();
        };
        link.onerror = () => {
            console.warn('Không load được CSS:', href);
            resolve();
        };
        document.head.appendChild(link);
    });
}

function loadJsOnce(src) {
    return new Promise(resolve => {
        if (!src || loadedJs.has(src)) return resolve();

        const script = document.createElement('script');
        script.src = src;
        script.defer = true;
        script.onload = () => {
            loadedJs.add(src);
            resolve();
        };
        script.onerror = () => {
            console.warn('Không load được JS:', src);
            resolve();
        };
        document.body.appendChild(script);
    });
}

function refreshSmartMenu() {
    if (typeof renderGameMenu === 'function') {
        renderGameMenu();
    }
}

function unlockAudio() {
    unlockAudioPolicy();

    const overlay = document.getElementById('start-overlay');
    const menu = document.getElementById('menu-screen');
    const game = document.getElementById('game-screen');

    if (overlay) overlay.style.display = 'none';
    if (game) game.style.display = 'none';
    refreshSmartMenu();
    if (menu) menu.style.display = 'flex';

    // Phát lời chào nếu có. Dù audio thiếu/bị chặn thì menu vẫn đã hiện.
    //if (!gameStartedOnce) {
    //    gameStartedOnce = true;
    //    playAudio(commonAudioPath('dingdong.mp3'), { stopOld: false });
    //}
}

function showMenuOnly() {
    const overlay = document.getElementById('start-overlay');
    const menu = document.getElementById('menu-screen');
    const game = document.getElementById('game-screen');

    if (overlay) overlay.style.display = 'none';
    if (game) {
        game.style.display = 'none';
        game.innerHTML = '';
        game.className = 'game-view';
    }
    refreshSmartMenu();
    if (menu) menu.style.display = 'flex';
}

function backToMenu() {
    stopAutoReplay();
    stopQuestionTimer(true);
    closeNoInteractionPause();
    stopAllAudio();

    gamePausedByNoInteraction = false;
    noInteractionCount = 0;

    activeGame = null;
    activeGameId = null;
    currentQuestionData = null;

    const oldScreen = document.getElementById('kana-screen');
    if (oldScreen) oldScreen.remove();

    showMenuOnly();
}

function applyGameLayoutClass(gameId) {
    const game = document.getElementById('game-screen');
    if (!game) return;

    const safeId = String(gameId).replace(/_/g, '-');

    game.className = 'game-view game-' + safeId;
}

async function startGame(gameId) {
    const config = GAME_CONFIG[gameId];

    if (!config) {
        showMaintenancePopup('Game');
        return;
    }

    stopAutoReplay();
    stopQuestionTimer(true);
    closeNoInteractionPause();
    stopAllAudio();

    gamePausedByNoInteraction = false;
    noInteractionCount = 0;

    applyGameLayoutClass(gameId);

    await loadCssOnce(config.css);
    await loadJsOnce(config.js);

    // Bài học dạng custom
    if (config.type === 'custom') {
        const fn = window[config.startFn];

        if (typeof fn === 'function') {
            fn();
        } else {
            showMaintenancePopup(config.title);
        }

        return;
    }

    // Game dùng hệ thống registerGame()
    const moduleId = config.moduleId || gameId;
    const module = gameModules[moduleId];

    if (!module) {
        showMaintenancePopup(config.title);
        return;
    }

    const menu = document.getElementById('menu-screen');
    const game = document.getElementById('game-screen');

    if (menu) menu.style.display = 'none';

    if (game) {
        game.style.display = 'flex';
        game.innerHTML = '';
    }

    startRegisteredGame(gameId, config.title, module);

    // Áp dụng cài đặt Nihongo sau khi khung câu hỏi/đáp án đã được render.
    // Dùng setTimeout ngắn để tránh chạy trước khi module dựng xong DOM.
    if (typeof window.applySavedNihongoSettings === 'function') {
        setTimeout(() => window.applySavedNihongoSettings(), 50);
    }
}

function showMaintenance(title = 'Game') {
    showMaintenancePopup(title);
}
function showMaintenancePopup(title = 'Game') {
    closeMaintenancePopup();

    const popup = document.createElement('div');
    popup.id = 'maintenance-popup';
    popup.className = 'maintenance-popup';

    popup.innerHTML = `
        <div class="maintenance-box">
            <div class="maintenance-icon">⚠️</div>
            <div class="maintenance-title">${title}</div>
            <div class="maintenance-text">
            🚧 Game này đang bảo trì hoặc chưa hoàn thiện.<br>                      
            </div>
            <button class="maintenance-close" type="button" onclick="closeMaintenancePopup()">
                Chọn bài khác nhé
            </button>
        </div>
    `;

    document.body.appendChild(popup);
}

function closeMaintenancePopup() {
    const old = document.getElementById('maintenance-popup');
    if (old) old.remove();
}

function startRegisteredGame(gameId, title, module) {
    activeGameId = gameId;
    activeGame = module;
    currentQuestionData = null;

    gamePausedByNoInteraction = false;
    noInteractionCount = 0;

    // Màn học/tra cứu dạng danh sách tự dựng giao diện riêng, không dùng timer/đáp án.
    if (module && typeof module.start === 'function') {
        module.start({ gameId, title });
        return;
    }

    // 1. Dựng khung game trước
    renderGameShell(title);
    resetScore();
    resetTopTimerBar();

    // 2. Hiện câu hỏi + đáp án ngay
    // Nhưng chưa phát âm câu hỏi và chưa chạy thời gian
    nextQuestion({
        playAudioNow: false,
        startTimerNow: false
    });

    // 3. Phát dingdong mỗi lần vào game
    let introDone = false;

    function afterIntro() {
        if (introDone) return;
        if (activeGame !== module) return;
        if (gamePausedByNoInteraction) return;

        introDone = true;

        // Dingdong xong mới đọc câu hỏi và chạy timer
        playQuestionAudio();
        startQuestionTimer();
        startAutoReplay();
    }

    playAudio(welcomeAudioPath(), {
        stopOld: true,
        onended: afterIntro,
        onerror: afterIntro
    });
}

function nextQuestion(config = {}) {
    if (correctAdvanceTimer) {
        clearTimeout(correctAdvanceTimer);
        correctAdvanceTimer = null;
    }

    if (!activeGame) return;
    if (gamePausedByNoInteraction) return;

    const playAudioNow = config.playAudioNow !== false;
    const startTimerNow = config.startTimerNow !== false;
    const audioDelay = config.audioDelay ?? 300;

    stopAutoReplay();
    stopQuestionTimer(false);

    const questionContent = document.getElementById('question-content');
    const optionsGrid = document.getElementById('options-grid');

    if (!questionContent || !optionsGrid) return;

    currentQuestionData = activeGame.generateData();
    activeGame.currentData = currentQuestionData;

    const questionHtml = activeGame.renderDisplay(currentQuestionData);

    const answerOptions = shuffleArray(
        activeGame.getOptions(currentQuestionData)
    );

    const fragment = document.createDocumentFragment();

    answerOptions.forEach(option => {
        const btn = document.createElement('button');

        btn.className = 'option-btn';

        activeGame.styleOptionBtn(btn, option);

        btn.onclick = () => handleCheckAnswer(option, btn);

        fragment.appendChild(btn);
    });

    questionContent.innerHTML = questionHtml;

    optionsGrid.innerHTML = '';
    optionsGrid.className = 'options-grid';

    if (activeGame.gridClass) {
        optionsGrid.classList.add(activeGame.gridClass);
    }

    optionsGrid.appendChild(fragment);

    resetTopTimerBar();

    if (playAudioNow) {
        setTimeout(() => {
            if (gamePausedByNoInteraction) return;

            playQuestionAudio();

            if (startTimerNow) {
                startQuestionTimer();
            }

            startAutoReplay();
        }, audioDelay);
    } else if (startTimerNow) {
        startQuestionTimer();
    }
}

function playQuestionAudio() {
    if (!activeGame || !currentQuestionData || typeof activeGame.getAudio !== 'function') return;

    const files = activeGame.getAudio(currentQuestionData);
    if (files && files.length > 0) {
        playSequence(files);
    }
}

function handleReplayQuestion() {
    if (gamePausedByNoInteraction) return;

    markGameInteraction();

    playQuestionAudio();
}

function handleCheckAnswer(selected, btn) {
    if (!activeGame || !currentQuestionData) return;
    if (gamePausedByNoInteraction) return;

    markGameInteraction();

    const isCorrect = activeGame.checkResult(selected, currentQuestionData);

    if (isCorrect) {
        stopAutoReplay();
        stopQuestionTimer(false);
        btn.classList.add('correct');
        document.querySelectorAll('#options-grid button').forEach(optionBtn => {
            optionBtn.disabled = true;
            optionBtn.classList.add('locked');
        });
        addScore(1);

        if (typeof activeGame.onCorrect === 'function') {
            activeGame.onCorrect(currentQuestionData, selected, btn);
        }

        let queue = [];
        if (typeof activeGame.getAnswerAudio === 'function') {
            queue = activeGame.getAnswerAudio(selected) || [];
        }
        queue.push(correctAudioPath());
        playSequence(queue);

        fireGameConfetti();
        const nextDelay = Number(activeGame.correctDelayMs || 2000);
        const questionRef = currentQuestionData;
        correctAdvanceTimer = setTimeout(() => {
            correctAdvanceTimer = null;
            if (currentQuestionData !== questionRef) return;
            if (!activeGame || gamePausedByNoInteraction) return;
            nextQuestion();
        }, Number.isFinite(nextDelay) ? nextDelay : 2000);
    } else {
        stopAutoReplay();
        stopQuestionTimer(false);
        btn.classList.add('wrong');

        document.querySelectorAll('#options-grid button').forEach(optionBtn => {
            optionBtn.disabled = true;
            optionBtn.classList.add('locked');
        });

        let queue = [];
        if (typeof activeGame.getAnswerAudio === 'function') {
            queue = activeGame.getAnswerAudio(selected) || [];
        }
        queue.push(wrongAudioPath());
        playSequence(queue);

        const handledWrong = typeof activeGame.onWrong === 'function'
            ? activeGame.onWrong(currentQuestionData, selected, btn)
            : false;

        if (!handledWrong) {
            setTimeout(() => {
                btn.classList.remove('wrong');
                document.querySelectorAll('#options-grid button').forEach(optionBtn => {
                    optionBtn.disabled = false;
                    optionBtn.classList.remove('locked');
                });
                startQuestionTimer();
                startAutoReplay();
            }, 900);
            return;
        }

        const nextDelay = Number(activeGame.wrongDelayMs || 5000);
        const questionRef = currentQuestionData;
        correctAdvanceTimer = setTimeout(() => {
            correctAdvanceTimer = null;
            if (currentQuestionData !== questionRef) return;
            if (!activeGame || gamePausedByNoInteraction) return;
            nextQuestion();
        }, Number.isFinite(nextDelay) ? nextDelay : 5000);
    }
}

function goNextQuestionNow() {
    if (correctAdvanceTimer) {
        clearTimeout(correctAdvanceTimer);
        correctAdvanceTimer = null;
    }

    if (!activeGame || gamePausedByNoInteraction) return;
    if (typeof stopAllAudio === 'function') stopAllAudio();
    nextQuestion();
}

window.goNextQuestionNow = goNextQuestionNow;

function startAutoReplay(delayMs = 5000) {
    stopAutoReplay();

    const questionRef = currentQuestionData;

    replayTimer = setTimeout(() => {
        replayTimer = null;

        if (!activeGame) return;
        if (gamePausedByNoInteraction) return;
        if (currentQuestionData !== questionRef) return;

        // Nhắc lại câu hỏi đúng 1 lần
        playQuestionAudio();
    }, delayMs);
}

function stopAutoReplay() {
    if (replayTimer) {
        clearTimeout(replayTimer);
        replayTimer = null;
    }
}

// =====================================================
// TƯƠNG TÁC CỦA NGƯỜI HỌC
// Có bấm đáp án hoặc bấm loa thì tính là có tương tác.
// Sau 3 câu liên tiếp không tương tác thì tạm dừng game.
// =====================================================

function markGameInteraction() {
    noInteractionCount = 0;
}


// =====================================================
// THANH THỜI GIAN CÂU HỎI
// Viền top-bar là đồng hồ đếm ngược.
// Mặc định mỗi câu có 10 giây.
// Game nào muốn khác: activeGame.questionTimeSec = số giây.
// =====================================================

function getQuestionTimeMs() {
    if (!activeGame) return 10000;

    const sec = Number(
        activeGame.questionTimeSec ||
        activeGame.questionTime ||
        10
    );

    if (!Number.isFinite(sec) || sec <= 0) {
        return 10000;
    }

    return sec > 1000 ? sec : sec * 1000;
}

function prepareTopTimerStroke() {
    const progress = document.querySelector('#game-screen .top-timer-progress');
    if (!progress) return null;

    if (!topTimerLength) {
        topTimerLength = progress.getTotalLength();
    }

    progress.style.strokeDasharray = String(topTimerLength);
    progress.style.strokeDashoffset = '0';

    return progress;
}

function resetTopTimerBar() {
    topTimerLength = 0;
    setTopTimerPercent(100, false);
}

function setTopTimerPercent(percent, running = true) {
    const bar = document.querySelector('#game-screen .top-bar');
    if (!bar) return;

    const p = Math.max(0, Math.min(100, percent));

    // Thanh dưới top-bar thu nhỏ từ phải sang trái.
    // p = 100: đầy thanh. p = 0: hết thanh.
    bar.style.setProperty('--timer-scale', (p / 100).toFixed(4));

    if (!running) {
        bar.classList.remove(
            'timer-running',
            'timer-green',
            'timer-yellow',
            'timer-red'
        );

        timerColorZone = '';
        return;
    }

    if (!bar.classList.contains('timer-running')) {
        bar.classList.add('timer-running');
    }

    let zone = 'green';

    if (p <= 30) {
        zone = 'red';
    } else if (p <= 60) {
        zone = 'yellow';
    }

    if (zone !== timerColorZone) {
        bar.classList.remove(
            'timer-green',
            'timer-yellow',
            'timer-red'
        );

        bar.classList.add('timer-' + zone);

        timerColorZone = zone;
    }
}

function startQuestionTimer() {
    if (gamePausedByNoInteraction) return;

    stopQuestionTimer(false);

    const totalMs = getQuestionTimeMs();
    const startTime = performance.now();
    const endTime = startTime + totalMs;

    setTopTimerPercent(100, true);

    function updateTimer(now) {
        if (gamePausedByNoInteraction) {
            stopQuestionTimer(false);
            return;
        }

        const remainMs = endTime - now;
        const percent = (remainMs / totalMs) * 100;

        setTopTimerPercent(percent, true);

        if (remainMs <= 0) {
            questionTimer = null;
            stopQuestionTimer(false);
            handleQuestionTimeUp();
            return;
        }

        questionTimer = requestAnimationFrame(updateTimer);
    }

    questionTimer = requestAnimationFrame(updateTimer);
}

function stopQuestionTimer(resetBar = false) {
    if (questionTimer) {
        cancelAnimationFrame(questionTimer);
        questionTimer = null;
    }

    if (resetBar) {
        resetTopTimerBar();
    }
}

function handleQuestionTimeUp() {
    if (!activeGame || !currentQuestionData) return;
    if (gamePausedByNoInteraction) return;

    stopAutoReplay();
    setTopTimerPercent(0, true);

    // Một số bài học Nihongo không phải dạng game chạy điểm.
    // Khi hết giờ, module có thể tự hiện đáp án và giữ nguyên màn hình
    // để người học xem lại thay vì tự nhảy câu tiếp theo.
    if (typeof activeGame.onTimeUp === 'function') {
        const handled = activeGame.onTimeUp(currentQuestionData);
        if (handled === true) {
            noInteractionCount = 0;
            return;
        }
    }

    noInteractionCount += 1;

    if (noInteractionCount >= 3) {
        pauseGameForNoInteraction();
        return;
    }

    playSequence([wrongAudioPath()]);

    setTimeout(() => {
        if (activeGame && !gamePausedByNoInteraction) {
            nextQuestion();
        }
    }, 1200);
}


// =====================================================
// TẠM DỪNG KHI NGƯỜI HỌC KHÔNG TƯƠNG TÁC
// Sau 3 câu liên tiếp hết giờ không bấm gì.
// =====================================================

function pauseGameForNoInteraction() {
    if (gamePausedByNoInteraction) return;

    gamePausedByNoInteraction = true;

    stopAutoReplay();
    stopQuestionTimer(false);
    stopAllAudio();

    setTopTimerPercent(0, true);

    const gameScreen = document.getElementById('game-screen');
    if (!gameScreen) return;

    closeNoInteractionPause();

    const pause = document.createElement('div');
    pause.id = 'game-pause-overlay';
    pause.className = 'game-pause-overlay';

    pause.innerHTML = `
        <div class="game-pause-box">
            <div class="game-pause-icon">⏸️</div>

            <div class="game-pause-title">
                Đã tạm dừng
            </div>

            <div class="game-pause-text">
                Bạn chưa chọn đáp án trong 3 câu liên tiếp.
            </div>

            <div class="game-pause-actions">
                <button
                    class="game-pause-resume"
                    type="button"
                    onclick="resumeGameAfterPause()">
                    Học tiếp
                </button>

                <button
                    class="game-pause-menu"
                    type="button"
                    onclick="backToMenu()">
                    Về menu
                </button>
            </div>
        </div>
    `;

    gameScreen.appendChild(pause);
}

function closeNoInteractionPause() {
    const old = document.getElementById('game-pause-overlay');
    if (old) old.remove();
}

function resumeGameAfterPause() {
    if (!activeGame) return;

    closeNoInteractionPause();

    gamePausedByNoInteraction = false;
    noInteractionCount = 0;

    resetTopTimerBar();

    // Học tiếp bằng một câu mới
    nextQuestion({
        playAudioNow: false,
        startTimerNow: false
    });

    let introDone = false;

    function afterIntro() {
        if (introDone) return;
        if (!activeGame) return;
        if (gamePausedByNoInteraction) return;

        introDone = true;

        playQuestionAudio();
        startQuestionTimer();
        startAutoReplay();
    }

    playAudio(welcomeAudioPath(), {
        stopOld: true,
        onended: afterIntro,
        onerror: afterIntro
    });
}

// =====================================================
// NÚT VÀO CHƠI + KIỂM TRA PHIÊN BẢN
// Bấm 1 lần: vào app
// Bấm đúp: hỏi xoá cache / cập nhật
// =====================================================

let startButtonClickTimer = null;
let hasNewAppVersion = false;

window.addEventListener('DOMContentLoaded', () => {
    applyNihongoAppMeta();
    setupStartButtonActions();
    checkAppVersionForUpdateHint();
});

function setupStartButtonActions() {
    const startBtn = document.getElementById('start-btn');

    if (!startBtn) return;

    startBtn.addEventListener('click', () => {
        if (startButtonClickTimer) {
            clearTimeout(startButtonClickTimer);
            startButtonClickTimer = null;

            askClearPwaCache();
            return;
        }

        startButtonClickTimer = setTimeout(() => {
            startButtonClickTimer = null;
            startNihongoAppFlow();
        }, 260);
    });
}
// =====================================================
// KIỂM TRA PHIÊN BẢN
// Nếu localStorage đang lưu bản cũ khác APP_VERSION
// thì hiện gợi ý nhấn đúp để cập nhật.
// =====================================================

async function checkAppVersionForUpdateHint() {
    const hint = document.getElementById('update-hint');

    let remoteVersion = APP_VERSION;
    let remoteLabel = (window.NIHONGO_APP_META && window.NIHONGO_APP_META.displayVersion) || APP_VERSION;

    // version.json luôn đọc network/no-store, không dùng cache PWA.
    // Nếu core đang chạy là bản cũ nhưng version.json trên mạng đã mới hơn,
    // mới hiện thông báo cập nhật. Không dùng bản đã lưu trong localStorage
    // để tránh lỗi đã cập nhật rồi mà màn ngoài vẫn báo mãi.
    if (navigator.onLine) {
        try {
            const res = await fetch(NIHONGO_REMOTE_VERSION_URL + '?t=' + Date.now(), {
                cache: 'no-store',
                credentials: 'same-origin'
            });
            if (res.ok) {
                const info = await res.json();
                if (info) applyNihongoVersionInfo(info);
                if (info && info.version) remoteVersion = String(info.version);
                if (info && info.displayVersion) remoteLabel = String(info.displayVersion);
            }
        } catch (err) {
            console.warn('Không đọc được version.json, dùng version trong core/version dự phòng:', err);
        }
    }

    if (remoteVersion && remoteVersion !== APP_VERSION) {
        hasNewAppVersion = true;
        if (hint) {
            hint.style.display = 'block';
            hint.textContent = `Có bản cập nhật mới ${remoteLabel}. Nhấn đúp “Vào chơi” để xoá cache và tải lại.`;
        }
        return;
    }

    // Đang chạy đúng bản mới: cập nhật lại mốc đã lưu rồi ẩn thông báo.
    hasNewAppVersion = false;
    localStorage.setItem(APP_VERSION_KEY, remoteVersion || APP_VERSION);
    if (hint) hint.style.display = 'none';
}

function showNihongoOfflineProgress(done, total, message = '') {
    let overlay = document.getElementById('nihongo-offline-progress');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'nihongo-offline-progress';
        overlay.style.cssText = 'position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;background:rgba(33,24,31,.55);padding:18px;';
        overlay.innerHTML = `
            <div style="width:min(92vw,420px);background:#fffdf9;border-radius:22px;padding:18px;box-shadow:0 20px 50px rgba(0,0,0,.25);font-family:system-ui,-apple-system,BlinkMacSystemFont,sans-serif;color:#33232e;">
                <div style="font-weight:950;font-size:1.05rem;margin-bottom:6px;">Đang tải dữ liệu học offline</div>
                <div id="nihongo-offline-progress-text" style="font-size:.86rem;font-weight:800;color:#705b66;margin-bottom:12px;">Chuẩn bị...</div>
                <div style="height:10px;background:#f4e9ee;border-radius:999px;overflow:hidden;">
                    <div id="nihongo-offline-progress-bar" style="height:100%;width:0%;background:linear-gradient(90deg,#ff7a87,#ffad61);border-radius:999px;"></div>
                </div>
                <div style="font-size:.76rem;color:#8a7780;margin-top:10px;line-height:1.45;">Lần đầu khi dùng PWA, app sẽ tải dữ liệu về máy để học cục bộ. File phiên bản vẫn luôn đọc online để biết khi nào cần cập nhật.</div>
            </div>`;
        document.body.appendChild(overlay);
    }
    const percent = total ? Math.round(done / total * 100) : 0;
    const text = document.getElementById('nihongo-offline-progress-text');
    const bar = document.getElementById('nihongo-offline-progress-bar');
    if (text) text.textContent = message || `Đã tải ${done}/${total} file (${percent}%)`;
    if (bar) bar.style.width = percent + '%';
}

function hideNihongoOfflineProgress() {
    document.getElementById('nihongo-offline-progress')?.remove();
}

async function cacheNihongoOfflineAssets(options = {}) {
    if (!('caches' in window)) return;
    if (!navigator.onLine) return;

    const force = options.force === true;
    const runtimeVersion = getNihongoRuntimeVersion();
    const alreadyReady = localStorage.getItem(NIHONGO_OFFLINE_READY_KEY) === runtimeVersion;
    if (!force && alreadyReady) return;

    const assets = buildNihongoOfflineAssetList();
    const cache = await caches.open(NIHONGO_OFFLINE_CACHE_NAME);
    let done = 0;

    showNihongoOfflineProgress(0, assets.length, 'Đang chuẩn bị tải dữ liệu...');

    for (const asset of assets) {
        done += 1;
        try {
            // Không cache version.json. Các file khác được cache để PWA học offline.
            const requestUrl = asset + (asset.includes('?') ? '&' : '?') + 'v=' + encodeURIComponent(runtimeVersion);
            const response = await fetch(requestUrl, { cache: 'reload', credentials: 'same-origin' });
            if (response && response.ok) {
                await cache.put(asset, response.clone());
            }
        } catch (err) {
            // Bỏ qua file chưa có, ví dụ N1/N2 chưa đủ dữ liệu. App vẫn chạy các file đang tồn tại.
            console.warn('Không cache được:', asset, err);
        }
        if (done === 1 || done === assets.length || done % 5 === 0) {
            showNihongoOfflineProgress(done, assets.length);
            await new Promise(resolve => setTimeout(resolve, 0));
        }
    }

    localStorage.setItem(NIHONGO_OFFLINE_READY_KEY, runtimeVersion);
    showNihongoOfflineProgress(assets.length, assets.length, 'Đã tải xong dữ liệu offline. Đang mở app...');
    await new Promise(resolve => setTimeout(resolve, 260));
    hideNihongoOfflineProgress();
}

async function startNihongoAppFlow() {
    try {
        if (isNihongoStandalonePwa() && navigator.onLine) {
            await cacheNihongoOfflineAssets();
        }
    } catch (err) {
        console.warn('Tải offline không hoàn tất, vẫn mở app:', err);
        hideNihongoOfflineProgress();
    }
    unlockAudio();
}
// =====================================================
// HỎI XOÁ CACHE / CẬP NHẬT
// =====================================================

function askClearPwaCache() {
    const message = hasNewAppVersion
        ? 'Có bản cập nhật mới.\n\nBạn muốn xoá cache để tải bản mới không?'
        : 'Bạn muốn xoá cache ứng dụng không?\n\nDùng khi app bị lỗi hoặc kẹt bản cũ.';

    const ok = confirm(message);

    if (!ok) return;

    clearPwaCacheAndReload();
}
// =====================================================
// XOÁ CACHE PWA + SERVICE WORKER + LOCAL STORAGE
// Dùng khi app bị kẹt bản cũ.
// Hiện tại điểm chưa lưu nên có thể xoá localStorage.
// Sau này nếu có lưu điểm/cài đặt thì bỏ localStorage.clear().
// =====================================================

async function clearPwaCacheAndReload() {
    try {
        // 1. Xoá Cache Storage
        if ('caches' in window) {
            const cacheNames = await caches.keys();

            await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
        }

        // 2. Gỡ service worker nếu có
        if ('serviceWorker' in navigator) {
            const registrations =
                await navigator.serviceWorker.getRegistrations();

            await Promise.all(
                registrations.map(registration => registration.unregister())
            );
        }

        // 3. Xoá localStorage
        // Sau này nếu có lưu điểm/cài đặt thì tắt dòng này.
        localStorage.clear();

        // 4. Xoá sessionStorage
        sessionStorage.clear();

        alert('Đã xoá cache. App sẽ tải lại bản mới.');

        // 5. Reload chống cache
        const cleanUrl = location.origin + location.pathname;
        location.replace(cleanUrl + '?refresh=' + Date.now());

    } catch (err) {
        console.error('Lỗi xoá cache:', err);

        alert(
            'Không xoá được cache hoàn toàn.\n' +
            'Bạn hãy đóng app rồi mở lại.'
        );
    }
}


// =====================================================
// CHẶN THU PHÓNG TRÊN ĐIỆN THOẠI
// -----------------------------------------------------
// Hỗ trợ iPhone/Android: chặn pinch zoom, double-tap zoom
// nhưng vẫn giữ thao tác chạm nút/game bình thường.
// =====================================================

function installMobileZoomBlock() {
    let lastTouchEnd = 0;

    document.addEventListener('touchstart', event => {
        if (event.touches && event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('touchmove', event => {
        if (event.touches && event.touches.length > 1) {
            event.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('touchend', event => {
        const now = Date.now();
        const target = event.target;
        const isInteractive =
            target &&
            typeof target.closest === 'function' &&
            target.closest('button, select, input, textarea, a, [onclick]');

        // Không chặn double-click trên nút, để nút Vào Chơi vẫn nhấn đúp xoá cache được.
        if (!isInteractive && now - lastTouchEnd <= 320) {
            event.preventDefault();
        }

        lastTouchEnd = now;
    }, { passive: false });

    ['gesturestart', 'gesturechange', 'gestureend'].forEach(type => {
        document.addEventListener(type, event => {
            event.preventDefault();
        }, { passive: false });
    });
}

installMobileZoomBlock();

// PWA: dùng đường dẫn tương đối để chạy được trong thư mục /nihongo/ hoặc khi test local.
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(err => {
            console.log('SW Failed:', err);
        });
    });
}

let deferredPrompt = null;



window.addEventListener('DOMContentLoaded', () => {
    const installBtn = document.getElementById('pwa-install-btn');
    const iosGuide = document.getElementById('ios-guide');

    const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;

    if (isStandalone) {
        if (installBtn) installBtn.style.display = 'none';
        if (iosGuide) iosGuide.style.display = 'none';
        return;
    }

    // iPhone/iPad: không có popup cài trực tiếp như Android/PC
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS && iosGuide) {
        iosGuide.style.display = 'block';
    }

    // Android Chrome / PC Chrome
    window.addEventListener('beforeinstallprompt', e => {
        e.preventDefault();
        deferredPrompt = e;

        if (installBtn) {
            installBtn.style.display = 'flex';
        }

        showInstallInvitePopup();
    });

    if (installBtn) {
        installBtn.addEventListener('click', triggerPwaInstall);
    }

    window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        closeInstallInvitePopup();

        if (installBtn) {
            installBtn.style.display = 'none';
        }
    });
});

function showInstallInvitePopup() {
    if (!deferredPrompt) return;
    if (document.getElementById('install-invite-popup')) return;

    // Chỉ hiện 1 lần trong mỗi tab, tránh làm phiền người học
    if (sessionStorage.getItem('installInviteClosed') === '1') return;

    const popup = document.createElement('div');
    popup.id = 'install-invite-popup';
    popup.className = 'install-invite-popup';

    popup.innerHTML = `
        <div class="install-invite-box">
            <div class="install-invite-icon">📲</div>
            <div class="install-invite-title">Cài Nihongo Quest?</div>
            <div class="install-invite-text">
                Cài ra màn hình chính để mở bài học nhanh hơn.
            </div>

            <div class="install-invite-actions">
                <button class="install-now-btn" type="button" onclick="triggerPwaInstall()">
                    Cài ngay
                </button>
                <button class="install-later-btn" type="button" onclick="closeInstallInvitePopup(true)">
                    Để sau
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(popup);
}

function closeInstallInvitePopup(saveClosed = false) {
    const popup = document.getElementById('install-invite-popup');
    if (popup) popup.remove();

    if (saveClosed) {
        sessionStorage.setItem('installInviteClosed', '1');
    }
}

async function triggerPwaInstall() {
    closeInstallInvitePopup(false);

    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    await deferredPrompt.userChoice;

    deferredPrompt = null;

    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) {
        installBtn.style.display = 'none';
    }
}


