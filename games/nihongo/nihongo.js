// games/nihongo/nihongo.js
// Nihongo Quest V1.1
// File này chỉ giữ logic game. Dữ liệu đã tách theo cấp tại games/nihongo/data/n0..n1/.

const NIHONGO_LEVEL_NAME = { n0: 'Nhập môn', n5: 'N5', n4: 'N4', n3: 'N3', n2: 'N2', n1: 'N1' };
const NIHONGO_REPEAT_MEMORY = {};

function nihongoBank() {
    return window.NIHONGO_DATA || {};
}

function nihongoShuffle(arr) {
    return typeof shuffleArray === 'function' ? shuffleArray(arr) : [...arr].sort(() => Math.random() - 0.5);
}

function nihongoRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function nihongoItemKey(item) {
    return [item.jp, item.reading, item.vi, item.romaji, item.type, item.hint].filter(Boolean).join('|');
}

function nihongoPick(pool, memoryKey, keepCount = 8) {
    if (!Array.isArray(pool) || pool.length === 0) return null;
    const history = NIHONGO_REPEAT_MEMORY[memoryKey] || [];
    const candidates = pool.filter(item => !history.includes(nihongoItemKey(item)));
    const usable = candidates.length ? candidates : pool;
    const item = nihongoRandom(usable);
    const key = nihongoItemKey(item);
    NIHONGO_REPEAT_MEMORY[memoryKey] = [key, ...history.filter(oldKey => oldKey !== key)].slice(0, Math.min(keepCount, Math.max(1, pool.length - 1)));
    return item;
}

function parseNihongoGameId(gameId) {
    const match = String(gameId || '').match(/^nihongo_(n[0-5])_(.+)$/);
    return match ? { level: match[1], mode: match[2] } : { level: 'n0', mode: 'quiz' };
}

function getLevelPool(level) {
    const bank = nihongoBank();
    return bank[level] || bank.n0 || { vocab: [], kanji: [], listening: [], grammar: [] };
}

function getAllItems(kind) {
    const bank = nihongoBank();
    return Object.values(bank).flatMap(level => Array.isArray(level[kind]) ? level[kind] : []);
}

function buildWrongOptions(correct, list, field) {
    const values = (list || []).map(item => item[field]).filter(value => value && value !== correct);
    const options = new Set([correct]);
    nihongoShuffle(values).forEach(value => { if (options.size < 4) options.add(value); });
    ['vocab', 'kanji', 'listening', 'grammar'].forEach(type => {
        getAllItems(type).forEach(item => {
            const value = item[field] || item.vi || item.jp;
            if (options.size < 4 && value && value !== correct) options.add(value);
        });
    });
    return nihongoShuffle(Array.from(options)).slice(0, 4);
}

function buildKanaQuestion(gameId) {
    const onlyKatakana = gameId.indexOf('katakana') >= 0;
    const type = onlyKatakana ? 'Katakana' : 'Hiragana';
    const pool = (window.NIHONGO_KANA || []).filter(item => item.type === type);
    const item = nihongoPick(pool, 'kana:' + type, 12) || { jp: 'あ', romaji: 'a', vi: 'a', type: 'Hiragana' };
    return { kind: 'kana', title: type, prompt: 'Chữ này đọc là gì?', jp: item.jp, reading: item.romaji, speakText: item.jp, correct: item.romaji, options: buildWrongOptions(item.romaji, pool, 'romaji') };
}

function buildVocabQuestion(level, mode) {
    const pool = getLevelPool(level).vocab || [];
    const item = nihongoPick(pool, level + ':vocab:' + mode, 10) || { jp: '日本語', reading: 'にほんご', vi: 'Tiếng Nhật' };
    const askJapanese = mode.indexOf('practice') >= 0 || Math.random() < 0.55;
    const correct = askJapanese ? item.vi : item.jp;
    return { kind: 'vocab', title: mode.indexOf('learn') >= 0 ? 'Học từ vựng' : 'Luyện từ vựng', prompt: askJapanese ? 'Nghĩa tiếng Việt là gì?' : 'Chọn từ tiếng Nhật đúng nghĩa.', jp: item.jp, reading: item.reading, vi: item.vi, speakText: item.jp, correct, options: buildWrongOptions(correct, pool, askJapanese ? 'vi' : 'jp') };
}

function buildListeningQuestion(level) {
    const levelPool = getLevelPool(level);
    const pool = (levelPool.listening && levelPool.listening.length) ? levelPool.listening : (levelPool.vocab || []);
    const item = nihongoPick(pool, level + ':listen', 10) || { jp: '日本語', reading: 'にほんご', vi: 'Tiếng Nhật' };
    return { kind: 'listen', title: 'Luyện nghe', prompt: 'Bấm loa nghe từ, rồi chọn nghĩa đúng.', jp: '？？？', reading: 'Nghe trước, xem đáp án sau', vi: item.vi, speakText: item.jp, correct: item.vi, options: buildWrongOptions(item.vi, pool, 'vi') };
}

function buildKanjiQuestion(level) {
    const pool = getLevelPool(level).kanji || [];
    const item = nihongoPick(pool, level + ':kanji', 8) || { jp: '日', reading: 'にち / ひ', vi: 'Ngày, mặt trời' };
    return { kind: 'kanji', title: 'Kanji', prompt: 'Kanji này có nghĩa gì?', jp: item.jp, reading: item.reading, vi: item.vi, speakText: item.reading || item.jp, correct: item.vi, options: buildWrongOptions(item.vi, pool, 'vi') };
}

function buildGrammarQuestion(level, mode) {
    const pool = getLevelPool(level).grammar || [];
    const item = nihongoPick(pool, level + ':grammar:' + mode, 8) || { jp: 'A は B です', vi: 'A là B', hint: 'Câu danh từ cơ bản' };
    return { kind: 'grammar', title: mode === 'sentence' ? 'Mẫu câu' : 'Ngữ pháp', prompt: mode === 'sentence' ? 'Mẫu câu này dùng để nói gì?' : 'Ý nghĩa ngữ pháp là gì?', jp: item.jp, reading: item.hint, vi: item.vi, speakText: item.jp, correct: item.vi, options: buildWrongOptions(item.vi, pool, 'vi') };
}

function buildMockQuestion(level) {
    const builders = [() => buildVocabQuestion(level, 'vocab_practice'), () => buildListeningQuestion(level), () => buildKanjiQuestion(level), () => buildGrammarQuestion(level, 'grammar')];
    const q = nihongoRandom(builders)();
    q.title = 'Thi thử ' + (NIHONGO_LEVEL_NAME[level] || '');
    q.kind = q.kind === 'listen' ? 'listen' : 'mock';
    return q;
}

function buildNihongoQuestion(gameId) {
    const parsed = parseNihongoGameId(gameId);
    const level = parsed.level;
    const mode = parsed.mode;
    if (level === 'n0' && (mode === 'kana' || mode === 'katakana')) return buildKanaQuestion(gameId);
    if (level === 'n0' && mode === 'listen') return buildListeningQuestion('n0');
    if (level === 'n0' && mode === 'quiz') return buildMockQuestion('n0');
    if (mode.indexOf('vocab') >= 0) return buildVocabQuestion(level, mode);
    if (mode === 'listening') return buildListeningQuestion(level);
    if (mode === 'kanji') return buildKanjiQuestion(level);
    if (mode === 'grammar' || mode === 'sentence') return buildGrammarQuestion(level, mode);
    if (mode === 'mock_test') return buildMockQuestion(level);
    return buildVocabQuestion(level, mode);
}

function escapeForClick(text) { return encodeURIComponent(String(text || '')); }

function speakNihongo(text) {
    if (!text || !('speechSynthesis' in window)) return;
    try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'ja-JP';
        utter.rate = 0.82;
        utter.pitch = 1;
        window.speechSynthesis.speak(utter);
    } catch (err) { console.warn('Không đọc được tiếng Nhật:', err); }
}

function renderNihongoDisplay(data) {
    const jp = data.kind === 'listen' ? '？？？' : data.jp;
    const hint = data.kind === 'listen' ? 'Nghe trước, xem đáp án sau' : (data.reading || '');

    // ID trong HTML để chỉnh tay dễ trong CSS:
    // - #nihongo-question-card: khung logic phủ full khu câu hỏi
    // - #nihongo-question-bg: ảnh mờ nền, PC dùng ảnh ngang, iPhone dùng ảnh dọc
    // - #nihongo-question-top: chip bài học + nút loa nổi lên mép trên
    // - #nihongo-question-center: cụm câu hỏi / chữ Nhật / cách đọc
    return `
        <div id="nihongo-question-card" class="nihongo-card nihongo-kind-${data.kind}">
            <div id="nihongo-question-bg" class="nihongo-question-bg" aria-hidden="true"></div>

            <div id="nihongo-question-top" class="nihongo-card-top">
                <span id="nihongo-question-chip" class="nihongo-chip">${data.title}</span>
                <button
                    id="nihongo-question-speaker"
                    class="nihongo-speak-btn"
                    type="button"
                    onclick="speakNihongo(decodeURIComponent('${escapeForClick(data.speakText)}'))"
                    aria-label="Nghe tiếng Nhật">🔊</button>
            </div>

            <div id="nihongo-question-center" class="nihongo-question-center">
                <div id="nihongo-question-text" class="nihongo-prompt">${data.prompt}</div>
                <div id="nihongo-question-japanese" class="nihongo-jp">${jp}</div>
                <div id="nihongo-question-reading" class="nihongo-reading">${hint}</div>
            </div>
        </div>
    `;
}

function makeNihongoGame(gameId) {
    return {
        questionTimeSec: gameId.indexOf('mock_test') >= 0 ? 22 : 18,
        gridClass: 'nihongo-options-grid',
        generateData() { return buildNihongoQuestion(gameId); },
        renderDisplay(data) {
            setTimeout(() => {
                if (data && data.kind === 'listen') speakNihongo(data.speakText);
            }, 280);
            return renderNihongoDisplay(data);
        },
        getOptions(data) { return data.options || []; },
        styleOptionBtn(btn, value) {
            btn.textContent = value;
            btn.classList.add('nihongo-option-btn');
            btn.setAttribute('aria-label', 'Đáp án ' + value);
        },
        getAudio() { return []; },
        checkResult(selected, data) { return String(selected) === String(data.correct); }
    };
}

const NIHONGO_GAME_IDS = [
    'nihongo_n0_kana', 'nihongo_n0_katakana', 'nihongo_n0_vocab', 'nihongo_n0_listen', 'nihongo_n0_kanji', 'nihongo_n0_grammar', 'nihongo_n0_quiz',
    'nihongo_n5_vocab_learn', 'nihongo_n5_vocab_practice', 'nihongo_n5_listening', 'nihongo_n5_kanji', 'nihongo_n5_grammar', 'nihongo_n5_sentence', 'nihongo_n5_mock_test',
    'nihongo_n4_vocab_learn', 'nihongo_n4_vocab_practice', 'nihongo_n4_listening', 'nihongo_n4_kanji', 'nihongo_n4_grammar', 'nihongo_n4_sentence', 'nihongo_n4_mock_test',
    'nihongo_n3_vocab_learn', 'nihongo_n3_vocab_practice', 'nihongo_n3_listening', 'nihongo_n3_kanji', 'nihongo_n3_grammar', 'nihongo_n3_sentence', 'nihongo_n3_mock_test',
    'nihongo_n2_vocab_learn', 'nihongo_n2_vocab_practice', 'nihongo_n2_listening', 'nihongo_n2_kanji', 'nihongo_n2_grammar', 'nihongo_n2_sentence', 'nihongo_n2_mock_test',
    'nihongo_n1_vocab_learn', 'nihongo_n1_vocab_practice', 'nihongo_n1_listening', 'nihongo_n1_kanji', 'nihongo_n1_grammar', 'nihongo_n1_sentence', 'nihongo_n1_mock_test'
];

NIHONGO_GAME_IDS.forEach(id => registerGame(id, makeNihongoGame(id)));
window.speakNihongo = speakNihongo;

/* =====================================================
   NIHONGO SETTINGS UI V1.1.2
   Chỉnh cỡ chữ, chia khung câu hỏi/đáp án, độ mờ nền.
   Có MutationObserver để áp dụng lại sau khi game-screen được render lại.
===================================================== */
(function () {
    const STORAGE_KEY = 'nihongo_ui_settings_v1_1_2';
    const OLD_STORAGE_KEY = 'nihongo_ui_settings_v1';

    const DEFAULT_SETTINGS = {
        promptSize: 0.95,
        jpScale: 1,
        answerSize: 0.78,
        questionRatio: 70,
        bgOpacity: 0.14
    };

    function getGameScreen() {
        return document.getElementById('game-screen');
    }

    function isNihongoScreen(screen) {
        return !!(screen && screen.className && String(screen.className).indexOf('game-nihongo') >= 0);
    }

    function normalizeSettings(settings = {}) {
        return {
            promptSize: Number(settings.promptSize ?? DEFAULT_SETTINGS.promptSize),
            jpScale: Number(settings.jpScale ?? DEFAULT_SETTINGS.jpScale),
            answerSize: Number(settings.answerSize ?? DEFAULT_SETTINGS.answerSize),
            questionRatio: Number(settings.questionRatio ?? DEFAULT_SETTINGS.questionRatio),
            bgOpacity: Number(settings.bgOpacity ?? DEFAULT_SETTINGS.bgOpacity)
        };
    }

    function applyNihongoSettings(settings) {
        const screen = getGameScreen();
        if (!isNihongoScreen(screen)) return;

        const finalSettings = normalizeSettings(settings);
        const questionRatio = Math.max(55, Math.min(85, finalSettings.questionRatio));
        const answerRatio = 100 - questionRatio;
        const jpScale = Math.max(0.65, Math.min(1.5, finalSettings.jpScale));

        screen.style.setProperty('--NQ-question-row', `${questionRatio}fr`);
        screen.style.setProperty('--NQ-answer-row', `${answerRatio}fr`);
        screen.style.setProperty('--NQ-prompt-size', `${finalSettings.promptSize}rem`);
        screen.style.setProperty('--NQ-answer-font', `${finalSettings.answerSize}rem`);
        screen.style.setProperty('--NQ-bg-opacity', `${finalSettings.bgOpacity}`);
        screen.style.setProperty('--NQ-jp-size', `clamp(${(1.7 * jpScale).toFixed(2)}rem, ${(8.5 * jpScale).toFixed(2)}vw, ${(3.3 * jpScale).toFixed(2)}rem)`);
        screen.style.setProperty('--NQ-kanji-size', `clamp(${(1.95 * jpScale).toFixed(2)}rem, ${(9.2 * jpScale).toFixed(2)}vw, ${(3.7 * jpScale).toFixed(2)}rem)`);
    }

    function loadSettings() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(OLD_STORAGE_KEY);
            return normalizeSettings(saved ? JSON.parse(saved) : DEFAULT_SETTINGS);
        } catch (e) {
            return normalizeSettings(DEFAULT_SETTINGS);
        }
    }

    function saveSettings(settings) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeSettings(settings)));
    }

    function updateLabels(settings) {
        const finalSettings = normalizeSettings(settings);
        const promptValue = document.getElementById('set-prompt-value');
        const jpValue = document.getElementById('set-jp-value');
        const answerValue = document.getElementById('set-answer-value');
        const ratioValue = document.getElementById('set-question-ratio-value');
        const opacityValue = document.getElementById('set-bg-opacity-value');

        if (promptValue) promptValue.textContent = `${finalSettings.promptSize.toFixed(2)}rem`;
        if (jpValue) jpValue.textContent = `${Math.round(finalSettings.jpScale * 100)}%`;
        if (answerValue) answerValue.textContent = `${finalSettings.answerSize.toFixed(2)}rem`;
        if (ratioValue) ratioValue.textContent = `${finalSettings.questionRatio}% / ${100 - finalSettings.questionRatio}%`;
        if (opacityValue) opacityValue.textContent = finalSettings.bgOpacity.toFixed(2);
    }

    function readPanelValues() {
        return normalizeSettings({
            promptSize: document.getElementById('set-prompt-size')?.value,
            jpScale: document.getElementById('set-jp-scale')?.value,
            answerSize: document.getElementById('set-answer-size')?.value,
            questionRatio: document.getElementById('set-question-ratio')?.value,
            bgOpacity: document.getElementById('set-bg-opacity')?.value
        });
    }

    function setPanelValues(settings) {
        const finalSettings = normalizeSettings(settings);
        const prompt = document.getElementById('set-prompt-size');
        const jp = document.getElementById('set-jp-scale');
        const answer = document.getElementById('set-answer-size');
        const ratio = document.getElementById('set-question-ratio');
        const opacity = document.getElementById('set-bg-opacity');

        if (prompt) prompt.value = finalSettings.promptSize;
        if (jp) jp.value = finalSettings.jpScale;
        if (answer) answer.value = finalSettings.answerSize;
        if (ratio) ratio.value = finalSettings.questionRatio;
        if (opacity) opacity.value = finalSettings.bgOpacity;

        updateLabels(finalSettings);
        applyNihongoSettings(finalSettings);
    }

    window.applySavedNihongoSettings = function () {
        applyNihongoSettings(loadSettings());
    };

    window.openNihongoSettings = function () {
        const modal = document.getElementById('nihongo-settings-modal');
        if (!modal) return;
        setPanelValues(loadSettings());
        modal.classList.remove('hidden');
    };

    window.closeNihongoSettings = function () {
        document.getElementById('nihongo-settings-modal')?.classList.add('hidden');
    };

    function resetNihongoAppFromSettings() {
        const ok = confirm('Xoá lựa chọn cấp học và quay lại màn chọn cấp từ đầu?\n\nCài đặt giao diện đã lưu cũng sẽ được xoá.');
        if (!ok) return;
        try {
            localStorage.clear();
            sessionStorage.clear();
        } catch (err) {
            console.warn('Không xoá được storage:', err);
        }
        window.closeNihongoSettings?.();
        if (typeof closeAdminTestMenu === 'function') closeAdminTestMenu();
        if (typeof renderGameMenu === 'function') renderGameMenu();
    }

    document.addEventListener('DOMContentLoaded', function () {
        const modal = document.getElementById('nihongo-settings-modal');
        const closeBtn = document.getElementById('nihongo-settings-close');
        const saveBtn = document.getElementById('settings-save-btn');
        const resetBtn = document.getElementById('settings-reset-btn');
        const resetAppBtn = document.getElementById('settings-reset-app-btn');

        const inputs = [
            'set-prompt-size',
            'set-jp-scale',
            'set-answer-size',
            'set-question-ratio',
            'set-bg-opacity'
        ];

        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (!input) return;
            input.addEventListener('input', function () {
                const settings = readPanelValues();
                updateLabels(settings);
                applyNihongoSettings(settings);
            });
        });

        closeBtn?.addEventListener('click', window.closeNihongoSettings);

        modal?.addEventListener('click', function (e) {
            if (e.target === modal) window.closeNihongoSettings();
        });

        saveBtn?.addEventListener('click', function () {
            const settings = readPanelValues();
            saveSettings(settings);
            applyNihongoSettings(settings);
            window.closeNihongoSettings();
        });

        resetBtn?.addEventListener('click', function () {
            try {
                localStorage.removeItem(STORAGE_KEY);
                localStorage.removeItem(OLD_STORAGE_KEY);
            } catch (e) {}
            setPanelValues(DEFAULT_SETTINGS);
            applyNihongoSettings(DEFAULT_SETTINGS);
        });

        resetAppBtn?.addEventListener('click', resetNihongoAppFromSettings);

        const screen = getGameScreen();
        if (screen && 'MutationObserver' in window) {
            const observer = new MutationObserver(function () {
                window.applySavedNihongoSettings?.();
            });
            observer.observe(screen, { attributes: true, childList: true, subtree: false });
        }

        setPanelValues(loadSettings());
        setTimeout(() => window.applySavedNihongoSettings?.(), 250);
    });
})();
