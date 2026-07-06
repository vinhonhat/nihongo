// games/nihongo/nihongo.js
// Nihongo Quest V1.1.5
// Logic câu hỏi dùng chung. Dữ liệu vẫn tách theo cấp tại games/nihongo/data/n0..n1/.
// Cấu trúc mới:
// - Từ vựng/Kanji: không hiện Hiragana dưới câu hỏi trước khi trả lời.
// - Đáp án chọn từ tiếng Nhật sẽ hiện Kanji/Kana + cách đọc ở dưới.
// - Trả lời đúng mới bung cách đọc + nghĩa tiếng Việt.
// - Ngữ pháp hiện câu ví dụ, phần ngữ pháp áp dụng được tô đậm.
// - Ghép câu dùng chung dữ liệu grammar.sentenceParts nếu có.

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

function nihongoEscape(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function nihongoOptionKey(value) {
    if (value && typeof value === 'object') return String(value.key ?? value.value ?? value.primary ?? '');
    return String(value ?? '');
}

function nihongoItemKey(item) {
    return [item.jp, item.reading, item.vi, item.en, item.romaji, item.type, item.hint, item.example]
        .filter(Boolean)
        .join('|');
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

function getLevelVocabMixed(level) {
    const levelPool = getLevelPool(level);
    const vocab = Array.isArray(levelPool.vocab) ? levelPool.vocab.map(item => ({ ...item, sourceKind: 'vocab' })) : [];
    const kanji = Array.isArray(levelPool.kanji) ? levelPool.kanji.map(item => ({ ...item, sourceKind: 'kanji' })) : [];
    return [...vocab, ...kanji].filter(item => item.jp && item.vi);
}

function makeMeaningOption(item) {
    return {
        key: String(item.vi || ''),
        primary: item.vi || '',
        secondary: item.en || '',
        speak: item.jp || item.reading || '',
        raw: item
    };
}

function makeJapaneseOption(item) {
    return {
        key: [item.jp, item.reading, item.vi].filter(Boolean).join('|'),
        primary: item.jp || '',
        secondary: item.reading || '',
        speak: item.jp || item.reading || '',
        raw: item
    };
}

function makeSentenceOption(item) {
    const sentence = item.example || item.sentence || item.jp || '';
    return {
        key: sentence,
        primary: sentence,
        secondary: item.sentenceVi || item.hint || item.vi || '',
        speak: sentence,
        raw: item
    };
}

function buildOptionsFromItems(correctItem, list, optionMaker, extraKinds = []) {
    const correct = optionMaker(correctItem);
    const map = new Map([[correct.key, correct]]);

    nihongoShuffle(list || []).forEach(item => {
        if (map.size >= 4) return;
        if (!item) return;
        const opt = optionMaker(item);
        if (opt.key && opt.key !== correct.key) map.set(opt.key, opt);
    });

    extraKinds.forEach(kind => {
        getAllItems(kind).forEach(item => {
            if (map.size >= 4) return;
            const opt = optionMaker(item);
            if (opt.key && opt.key !== correct.key) map.set(opt.key, opt);
        });
    });

    return nihongoShuffle(Array.from(map.values())).slice(0, 4);
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
    return nihongoShuffle(Array.from(options)).slice(0, 4).map(value => ({ key: String(value), primary: String(value), secondary: '' }));
}

function buildKanaQuestion(gameId) {
    const onlyKatakana = gameId.indexOf('katakana') >= 0;
    const type = onlyKatakana ? 'Katakana' : 'Hiragana';
    const pool = (window.NIHONGO_KANA || []).filter(item => item.type === type);
    const item = nihongoPick(pool, 'kana:' + type, 12) || { jp: 'あ', romaji: 'a', vi: 'a', type: 'Hiragana' };
    return {
        kind: 'kana',
        title: type,
        prompt: 'Chữ này đọc là gì?',
        displayType: 'jp',
        jp: item.jp,
        reading: '',
        vi: item.romaji,
        speakText: item.jp,
        correctKey: String(item.romaji),
        options: buildWrongOptions(item.romaji, pool, 'romaji'),
        reveal: { reading: item.romaji, vi: 'Cách đọc: ' + item.romaji, en: item.en || '' }
    };
}

function buildVocabQuestion(level, mode) {
    const levelPool = getLevelPool(level);
    const pureVocab = levelPool.vocab || [];
    const mixedPool = mode.indexOf('practice') >= 0 ? getLevelVocabMixed(level) : pureVocab;
    const pool = mixedPool.length ? mixedPool : pureVocab;
    const item = nihongoPick(pool, level + ':vocab:' + mode, 14) || { jp: '日本語', reading: 'にほんご', vi: 'Tiếng Nhật' };

    // Học từ vựng: ưu tiên kiểu nhìn nghĩa tiếng Việt -> chọn từ tiếng Nhật đúng.
    // Luyện từ: random 2 chiều để không học vẹt.
    const askPickJapanese = mode.indexOf('learn') >= 0 || Math.random() < 0.55;

    if (askPickJapanese) {
        const options = buildOptionsFromItems(item, pool, makeJapaneseOption, ['vocab', 'kanji']);
        return {
            kind: 'vocab',
            title: mode.indexOf('learn') >= 0 ? 'Học từ vựng' : 'Luyện từ vựng',
            prompt: 'Chọn từ tiếng Nhật đúng nghĩa.',
            displayType: 'vi',
            jp: item.jp,
            reading: item.reading || '',
            vi: item.vi,
            en: item.en || '',
            speakText: item.jp,
            correctKey: makeJapaneseOption(item).key,
            options,
            reveal: { jp: item.jp, reading: item.reading, vi: item.vi, en: item.en || '' }
        };
    }

    const options = buildOptionsFromItems(item, pool, makeMeaningOption, ['vocab', 'kanji']);
    return {
        kind: item.sourceKind === 'kanji' ? 'kanji vocab' : 'vocab',
        title: 'Luyện từ vựng',
        prompt: 'Nghĩa tiếng Việt là gì?',
        displayType: 'jp',
        jp: item.jp,
        reading: '',
        vi: item.vi,
        en: item.en || '',
        speakText: item.jp,
        correctKey: makeMeaningOption(item).key,
        options,
        reveal: { jp: item.jp, reading: item.reading, vi: item.vi, en: item.en || '' }
    };
}

function buildListeningQuestion(level) {
    const levelPool = getLevelPool(level);
    const pool = (levelPool.listening && levelPool.listening.length) ? levelPool.listening : (levelPool.vocab || []);
    const item = nihongoPick(pool, level + ':listen', 12) || { jp: '日本語', reading: 'にほんご', vi: 'Tiếng Nhật' };
    return {
        kind: 'listen',
        title: 'Luyện nghe',
        prompt: 'Bấm loa nghe từ, rồi chọn nghĩa đúng.',
        displayType: 'listen',
        jp: '？？？',
        reading: '',
        vi: item.vi,
        en: item.en || '',
        speakText: item.jp,
        correctKey: makeMeaningOption(item).key,
        options: buildOptionsFromItems(item, pool, makeMeaningOption, ['vocab']),
        reveal: { jp: item.jp, reading: item.reading, vi: item.vi, en: item.en || '' }
    };
}

function buildKanjiQuestion(level) {
    const pool = getLevelPool(level).kanji || [];
    const item = nihongoPick(pool, level + ':kanji', 10) || { jp: '日', reading: 'にち / ひ', vi: 'Ngày, mặt trời' };
    return {
        kind: 'kanji',
        title: 'Kanji ' + (NIHONGO_LEVEL_NAME[level] || '').trim(),
        prompt: 'Kanji này có nghĩa gì?',
        displayType: 'jp',
        jp: item.jp,
        reading: '',
        vi: item.vi,
        speakText: item.reading || item.jp,
        correctKey: makeMeaningOption(item).key,
        options: buildOptionsFromItems(item, pool, makeMeaningOption, ['kanji']),
        reveal: { jp: item.jp, reading: item.reading, vi: item.vi, en: item.en || '' }
    };
}

function renderGrammarExample(item) {
    const example = item.example || item.sentence || item.jp || '';
    const focusList = Array.isArray(item.focus) ? item.focus : (item.focus ? [item.focus] : []);
    let safe = nihongoEscape(example);

    focusList
        .filter(Boolean)
        .sort((a, b) => String(b).length - String(a).length)
        .forEach(focus => {
            const escapedFocus = nihongoEscape(focus);
            safe = safe.split(escapedFocus).join('<strong>' + escapedFocus + '</strong>');
        });

    return safe;
}

function buildGrammarQuestion(level, mode) {
    const pool = getLevelPool(level).grammar || [];
    const item = nihongoPick(pool, level + ':grammar:' + mode, 10) || {
        jp: 'A は B です',
        pattern: 'A は B です',
        example: '私は学生です。',
        focus: ['は', 'です'],
        vi: 'A là B',
        hint: 'Câu danh từ cơ bản'
    };

    return {
        kind: 'grammar',
        title: mode === 'sentence' ? 'Mẫu câu' : 'Ngữ pháp',
        prompt: 'Phần tô đậm trong câu dùng để làm gì?',
        displayType: 'grammar',
        jp: item.pattern || item.jp,
        reading: item.hint || '',
        vi: item.vi,
        en: item.en || '',
        example: item.example || item.sentence || item.jp,
        exampleHtml: renderGrammarExample(item),
        hint: item.hint || '',
        speakText: item.example || item.jp,
        correctKey: makeMeaningOption(item).key,
        options: buildOptionsFromItems(item, pool, makeMeaningOption, ['grammar']),
        reveal: { pattern: item.pattern || item.jp, example: item.example || item.sentence, hint: item.hint, vi: item.vi, en: item.en || '' }
    };
}

function splitSentenceParts(item) {
    if (Array.isArray(item.sentenceParts) && item.sentenceParts.length) return item.sentenceParts;
    const sentence = String(item.example || item.sentence || item.jp || '').replace(/[。！？!?]$/g, '');
    if (!sentence) return [];
    return sentence.split(/\s+/).filter(Boolean).length > 1
        ? sentence.split(/\s+/).filter(Boolean)
        : [sentence];
}

function buildSentenceBuildQuestion(level) {
    const pool = (getLevelPool(level).grammar || []).filter(item => item.example || item.sentence || item.jp);
    const item = nihongoPick(pool, level + ':sentence_build', 10) || {
        jp: 'A は B です',
        example: '私は学生です。',
        sentenceParts: ['私', 'は', '学生', 'です'],
        vi: 'Tôi là học sinh / sinh viên',
        hint: 'A là B'
    };

    const parts = splitSentenceParts(item);
    const options = buildOptionsFromItems(item, pool, makeSentenceOption, ['grammar']);

    return {
        kind: 'sentence-build',
        title: 'Ghép câu',
        prompt: 'Chọn câu tiếng Nhật được ghép đúng.',
        displayType: 'sentence-build',
        jp: item.example || item.sentence || item.jp,
        reading: item.hint || '',
        vi: item.sentenceVi || item.vi,
        en: item.sentenceEn || item.en || '',
        parts: nihongoShuffle(parts),
        speakText: item.example || item.sentence || item.jp,
        correctKey: makeSentenceOption(item).key,
        options,
        reveal: { jp: item.example || item.sentence || item.jp, hint: item.hint, vi: item.sentenceVi || item.vi, en: item.sentenceEn || item.en || '' }
    };
}

function buildMockQuestion(level) {
    const builders = [
        () => buildVocabQuestion(level, 'vocab_practice'),
        () => buildListeningQuestion(level),
        () => buildKanjiQuestion(level),
        () => buildGrammarQuestion(level, 'grammar')
    ];
    if ((getLevelPool(level).grammar || []).some(item => item.example || item.sentence)) builders.push(() => buildSentenceBuildQuestion(level));
    const q = nihongoRandom(builders)();
    q.title = 'Thi thử ' + (NIHONGO_LEVEL_NAME[level] || '');
    q.kind = q.kind === 'listen' ? 'listen' : 'mock ' + q.kind;
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
    if (mode === 'sentence_build') return buildSentenceBuildQuestion(level);
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
    const isListen = data.displayType === 'listen';
    const isViTarget = data.displayType === 'vi';
    const isGrammar = data.displayType === 'grammar';
    const isSentenceBuild = data.displayType === 'sentence-build';
    const jp = isListen ? '？？？' : (data.jp || '');

    let mainHtml = '';

    if (isGrammar) {
        mainHtml = `
            <div id="nihongo-question-text" class="nihongo-prompt">${nihongoEscape(data.prompt)}</div>
            <div id="nihongo-grammar-pattern" class="nihongo-grammar-pattern">${nihongoEscape(data.jp)}</div>
            <div id="nihongo-grammar-example" class="nihongo-grammar-example">${data.exampleHtml || nihongoEscape(data.example)}</div>
            <div id="nihongo-question-reading" class="nihongo-reading">${nihongoEscape(data.hint || '')}</div>
        `;
    } else if (isSentenceBuild) {
        const partHtml = (data.parts || []).map(part => `<span>${nihongoEscape(part)}</span>`).join('');
        mainHtml = `
            <div id="nihongo-question-text" class="nihongo-prompt">${nihongoEscape(data.prompt)}</div>
            <div id="nihongo-vietnamese-target" class="nihongo-vi-target">${nihongoEscape(data.vi)}</div>
            ${data.en ? `<div id="nihongo-english-target" class="nihongo-en-target">${nihongoEscape(data.en)}</div>` : ''}
            <div id="nihongo-sentence-parts" class="nihongo-sentence-parts">${partHtml}</div>
        `;
    } else if (isViTarget) {
        mainHtml = `
            <div id="nihongo-question-text" class="nihongo-prompt">${nihongoEscape(data.prompt)}</div>
            <div id="nihongo-vietnamese-target" class="nihongo-vi-target">${nihongoEscape(data.vi)}</div>
            ${data.en ? `<div id="nihongo-english-target" class="nihongo-en-target">${nihongoEscape(data.en)}</div>` : ''}
        `;
    } else {
        const hint = isListen ? 'Nghe trước, xem đáp án sau' : (data.reading || '');
        mainHtml = `
            <div id="nihongo-question-text" class="nihongo-prompt">${nihongoEscape(data.prompt)}</div>
            <div id="nihongo-question-japanese" class="nihongo-jp">${nihongoEscape(jp)}</div>
            ${hint ? `<div id="nihongo-question-reading" class="nihongo-reading">${nihongoEscape(hint)}</div>` : ''}
        `;
    }

    return `
        <div id="nihongo-question-card" class="nihongo-card nihongo-kind-${String(data.kind || '').replace(/\s+/g, '-')}">
            <div id="nihongo-question-bg" class="nihongo-question-bg" aria-hidden="true"></div>

            <div id="nihongo-question-top" class="nihongo-card-top">
                <span id="nihongo-question-chip" class="nihongo-chip">${nihongoEscape(data.title)}</span>
                <button
                    id="nihongo-question-speaker"
                    class="nihongo-speak-btn"
                    type="button"
                    onclick="speakNihongo(decodeURIComponent('${escapeForClick(data.speakText)}'))"
                    aria-label="Nghe tiếng Nhật">🔊</button>
            </div>

            <div id="nihongo-question-center" class="nihongo-question-center">
                ${mainHtml}
                <div id="nihongo-answer-reveal" class="nihongo-answer-reveal" aria-live="polite"></div>
            </div>
        </div>
    `;
}

function renderNihongoOption(btn, option) {
    const opt = option && typeof option === 'object'
        ? option
        : { key: String(option), primary: String(option), secondary: '' };

    btn.innerHTML = `
        <span class="nihongo-option-main">${nihongoEscape(opt.primary)}</span>
        ${opt.secondary ? `<span class="nihongo-option-sub">${nihongoEscape(opt.secondary)}</span>` : ''}
    `;
    btn.dataset.answerKey = opt.key;
    btn.classList.add('nihongo-option-btn');
    btn.setAttribute('aria-label', 'Đáp án ' + (opt.primary || opt.key));
}

function revealNihongoAnswer(data, options = {}) {
    const box = document.getElementById('nihongo-answer-reveal');
    if (!box || !data) return;

    const reveal = data.reveal || {};
    const jp = reveal.jp || '';
    const reading = reveal.reading || '';
    const vi = reveal.vi || '';
    const pattern = reveal.pattern || '';
    const hint = reveal.hint || '';
    const en = reveal.en || data.en || '';
    const labelText = options.timeUp ? 'Hết giờ - xem đáp án' : (options.label || 'Đáp án');

    if (data.displayType === 'grammar') {
        box.innerHTML = `
            <div class="reveal-label">${options.timeUp ? 'Hết giờ - xem đáp án' : 'Đúng rồi'}</div>
            ${pattern ? `<div class="reveal-line"><b>Mẫu:</b> ${nihongoEscape(pattern)}</div>` : ''}
            ${vi ? `<div class="reveal-line"><b>Nghĩa:</b> ${nihongoEscape(vi)}</div>` : ''}
            ${en ? `<div class="reveal-line reveal-en"><b>English:</b> ${nihongoEscape(en)}</div>` : ''}
            ${hint ? `<div class="reveal-line"><b>Ghi nhớ:</b> ${nihongoEscape(hint)}</div>` : ''}
        `;
    } else if (data.displayType === 'sentence-build') {
        box.innerHTML = `
            <div class="reveal-label">${options.timeUp ? 'Hết giờ - xem đáp án' : 'Câu đúng'}</div>
            ${jp ? `<div class="reveal-jp">${nihongoEscape(jp)}</div>` : ''}
            ${hint ? `<div class="reveal-reading">${nihongoEscape(hint)}</div>` : ''}
            ${vi ? `<div class="reveal-vi">${nihongoEscape(vi)}</div>` : ''}
            ${en ? `<div class="reveal-en">${nihongoEscape(en)}</div>` : ''}
        `;
    } else {
        box.innerHTML = `
            <div class="reveal-label">${labelText}</div>
            ${jp ? `<div class="reveal-jp">${nihongoEscape(jp)}</div>` : ''}
            ${reading ? `<div class="reveal-reading">${nihongoEscape(reading)}</div>` : ''}
            ${vi ? `<div class="reveal-vi">${nihongoEscape(vi)}</div>` : ''}
            ${en ? `<div class="reveal-en">${nihongoEscape(en)}</div>` : ''}
        `;
    }

    if (options.timeUp) {
        box.insertAdjacentHTML('beforeend', `
            <button class="nihongo-reveal-next" type="button" onclick="nextQuestion()">
                Câu tiếp theo
            </button>
        `);
    }

    box.classList.add('show');
}

function isNihongoLearnGame(gameId) {
    return /_vocab_learn$/.test(gameId) || /_kana$/.test(gameId) || /_katakana$/.test(gameId) || /_n0_vocab$/.test(gameId);
}

function markNihongoCorrectButton(data) {
    const key = String(data && data.correctKey || '');
    document.querySelectorAll('#options-grid .nihongo-option-btn').forEach(btn => {
        if (btn.dataset.answerKey === key) btn.classList.add('correct');
        btn.disabled = true;
    });
}

function makeNihongoGame(gameId) {
    const isLearn = isNihongoLearnGame(gameId);
    const isMock = gameId.indexOf('mock_test') >= 0;

    return {
        questionTimeSec: isMock ? 30 : (isLearn ? 30 : 24),
        correctDelayMs: 3000,
        gridClass: 'nihongo-options-grid',
        generateData() { return buildNihongoQuestion(gameId); },
        renderDisplay(data) {
            setTimeout(() => {
                if (data && data.kind === 'listen') speakNihongo(data.speakText);
            }, 280);
            return renderNihongoDisplay(data);
        },
        getOptions(data) { return data.options || []; },
        styleOptionBtn(btn, value) { renderNihongoOption(btn, value); },
        getAudio() { return []; },
        checkResult(selected, data) { return nihongoOptionKey(selected) === String(data.correctKey); },
        onCorrect(data) {
            revealNihongoAnswer(data);
            if (data && data.speakText) setTimeout(() => speakNihongo(data.speakText), 120);
        },
        onTimeUp(data) {
            if (!isLearn) return false;
            markNihongoCorrectButton(data);
            revealNihongoAnswer(data, { timeUp: true });
            return true;
        }
    };
}

const NIHONGO_GAME_IDS = [
    'nihongo_n0_kana', 'nihongo_n0_katakana', 'nihongo_n0_vocab', 'nihongo_n0_listen', 'nihongo_n0_kanji', 'nihongo_n0_grammar', 'nihongo_n0_quiz',
    'nihongo_n5_vocab_learn', 'nihongo_n5_vocab_practice', 'nihongo_n5_listening', 'nihongo_n5_kanji', 'nihongo_n5_grammar', 'nihongo_n5_sentence', 'nihongo_n5_sentence_build', 'nihongo_n5_mock_test',
    'nihongo_n4_vocab_learn', 'nihongo_n4_vocab_practice', 'nihongo_n4_listening', 'nihongo_n4_kanji', 'nihongo_n4_grammar', 'nihongo_n4_sentence', 'nihongo_n4_sentence_build', 'nihongo_n4_mock_test',
    'nihongo_n3_vocab_learn', 'nihongo_n3_vocab_practice', 'nihongo_n3_listening', 'nihongo_n3_kanji', 'nihongo_n3_grammar', 'nihongo_n3_sentence', 'nihongo_n3_sentence_build', 'nihongo_n3_mock_test',
    'nihongo_n2_vocab_learn', 'nihongo_n2_vocab_practice', 'nihongo_n2_listening', 'nihongo_n2_kanji', 'nihongo_n2_grammar', 'nihongo_n2_sentence', 'nihongo_n2_sentence_build', 'nihongo_n2_mock_test',
    'nihongo_n1_vocab_learn', 'nihongo_n1_vocab_practice', 'nihongo_n1_listening', 'nihongo_n1_kanji', 'nihongo_n1_grammar', 'nihongo_n1_sentence', 'nihongo_n1_sentence_build', 'nihongo_n1_mock_test'
];

NIHONGO_GAME_IDS.forEach(id => registerGame(id, makeNihongoGame(id)));
window.speakNihongo = speakNihongo;
