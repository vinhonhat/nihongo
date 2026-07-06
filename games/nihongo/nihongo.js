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
    return `<div class="nihongo-card nihongo-kind-${data.kind}"><div class="nihongo-card-top"><span class="nihongo-chip">${data.title}</span><button class="nihongo-speak-btn" type="button" onclick="speakNihongo(decodeURIComponent('${escapeForClick(data.speakText)}'))">🔊</button></div><div class="nihongo-prompt">${data.prompt}</div><div class="nihongo-jp">${jp}</div><div class="nihongo-reading">${hint}</div></div>`;
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
