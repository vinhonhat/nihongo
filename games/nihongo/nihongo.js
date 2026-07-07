// games/nihongo/nihongo.js
// Nihongo Quest V1.2.7
// Logic câu hỏi dùng chung. Dữ liệu vẫn tách theo cấp tại games/nihongo/data/n0..n1/.
// Cấu trúc mới:
// - Từ vựng/Kanji: không hiện Hiragana dưới câu hỏi trước khi trả lời.
// - Đáp án chọn từ tiếng Nhật sẽ hiện Kanji/Kana + cách đọc ở dưới.
// - Trả lời đúng mới bung cách đọc + nghĩa tiếng Việt.
// - Ngữ pháp hiện câu ví dụ, phần ngữ pháp áp dụng được tô đậm.
// - Ghép câu dùng chung dữ liệu grammar.sentenceParts nếu có.

const NIHONGO_LEVEL_NAME = { n0: 'Nhập môn', n5: 'N5', n4: 'N4', n3: 'N3', n2: 'N2', n1: 'N1' };
const NIHONGO_REPEAT_MEMORY = {};
const NIHONGO_PICK_STATE = {};
const NIHONGO_WRONG_REVIEW = {};

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

function queueNihongoWrongReview(memoryKey, item, wait = 10) {
    if (!memoryKey || !item) return;
    const key = nihongoItemKey(item);
    if (!key) return;
    const list = NIHONGO_WRONG_REVIEW[memoryKey] || [];
    if (!list.some(entry => entry.key === key)) {
        list.push({ key, item, wait });
    }
    NIHONGO_WRONG_REVIEW[memoryKey] = list.slice(-8);
}

function pullNihongoWrongReview(memoryKey, validKeys) {
    const list = NIHONGO_WRONG_REVIEW[memoryKey];
    if (!Array.isArray(list) || !list.length) return null;
    for (const entry of list) entry.wait = Math.max(0, Number(entry.wait || 0) - 1);
    const idx = list.findIndex(entry => entry.wait <= 0 && validKeys.has(entry.key));
    if (idx < 0) return null;
    const [entry] = list.splice(idx, 1);
    return entry.item || null;
}

function nihongoPick(pool, memoryKey, keepCount = 8) {
    if (!Array.isArray(pool) || pool.length === 0) return null;

    // Cách chọn mới: đi hết một vòng dữ liệu rồi mới lặp lại.
    // Như vậy random vẫn có, nhưng không bị kẹt vài câu lặp liên tục.
    const normalized = pool.filter(Boolean);
    const validKeys = new Set(normalized.map(nihongoItemKey));
    const reviewItem = pullNihongoWrongReview(memoryKey, validKeys);
    if (reviewItem) return reviewItem;

    const signature = normalized.map(nihongoItemKey).join('::');
    let state = NIHONGO_PICK_STATE[memoryKey];

    if (!state || state.signature !== signature || !Array.isArray(state.queue) || state.queue.length === 0) {
        let queue = nihongoShuffle(normalized);
        const lastKey = state && state.lastKey;
        if (queue.length > 1 && lastKey && nihongoItemKey(queue[0]) === lastKey) {
            queue.push(queue.shift());
        }
        state = { signature, queue, lastKey: lastKey || '' };
        NIHONGO_PICK_STATE[memoryKey] = state;
    }

    const item = state.queue.shift() || nihongoRandom(normalized);
    state.lastKey = nihongoItemKey(item);

    // Giữ lại lịch sử ngắn để tương thích với code cũ / debug.
    const history = NIHONGO_REPEAT_MEMORY[memoryKey] || [];
    NIHONGO_REPEAT_MEMORY[memoryKey] = [state.lastKey, ...history.filter(oldKey => oldKey !== state.lastKey)]
        .slice(0, Math.min(keepCount, Math.max(1, normalized.length - 1)));

    return item;
}

function parseNihongoGameId(gameId) {
    const match = String(gameId || '').match(/^nihongo_(n[0-5])_(.+)$/);
    return match ? { level: match[1], mode: match[2] } : { level: 'n0', mode: 'quiz' };
}

function getSelectedNihongoLessonId(level) {
    try {
        return localStorage.getItem('nihongo_selected_lesson_' + level) || 'all';
    } catch (err) {
        return 'all';
    }
}

function mapLessonItems(list, lessonId, lessonTitle) {
    return Array.isArray(list)
        ? list.map(item => ({ ...item, lessonId, lessonTitle }))
        : [];
}

function getLevelPool(level) {
    const bank = nihongoBank();
    const fallback = bank.n0 || { vocab: [], kanji: [], listening: [], grammar: [] };
    const base = bank[level] || fallback;
    const lessonId = getSelectedNihongoLessonId(level);

    if (lessonId && lessonId !== 'all' && base.lessons && base.lessons[lessonId]) {
        const lesson = base.lessons[lessonId];
        const lessonTitle = lesson.title || lesson.label || lessonId;
        const vocab = mapLessonItems(lesson.vocab, lessonId, lessonTitle);
        const kanji = mapLessonItems(lesson.kanji, lessonId, lessonTitle);
        const grammar = mapLessonItems(lesson.grammar, lessonId, lessonTitle);
        const listening = mapLessonItems(lesson.listening, lessonId, lessonTitle);

        return {
            ...base,
            selectedLessonId: lessonId,
            selectedLessonTitle: lessonTitle,
            // Từ vựng lọc đúng theo bài đã chọn.
            vocab,
            // Các phần chưa nhập theo bài thì tạm dùng dữ liệu chung của cấp để app không bị trống.
            kanji: kanji.length ? kanji : (base.kanji || []),
            grammar: grammar.length ? grammar : (base.grammar || []),
            // Listening ưu tiên listening riêng; nếu chưa có thì dùng vocab của bài để nghe từ trong bài.
            listening: listening.length ? listening : (vocab.length ? vocab : (base.listening || [])),
            sentence: Array.isArray(lesson.sentence) && lesson.sentence.length ? mapLessonItems(lesson.sentence, lessonId, lessonTitle) : (base.sentence || [])
        };
    }

    return { ...base, selectedLessonId: 'all', selectedLessonTitle: '' };
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

function getLessonTitleSuffix(levelPool) {
    return levelPool && levelPool.selectedLessonTitle ? ' · ' + levelPool.selectedLessonTitle : '';
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

function makeReadingOption(item) {
    const reading = item.reading || item.kunyomi || item.onyomi || item.on || item.kun || '';
    return {
        key: String(reading || ''),
        primary: reading || '',
        secondary: item.vi || item.en || '',
        speak: item.jp || reading || '',
        raw: item
    };
}

function makeKanjiOption(item) {
    return {
        key: String(item.jp || item.kanji || ''),
        primary: item.jp || item.kanji || '',
        secondary: item.vi || item.reading || '',
        speak: item.jp || item.reading || '',
        raw: item
    };
}

// Dùng riêng cho luyện Kanji để không lộ nghĩa/cách đọc trong đáp án.
// Ví dụ: câu hỏi "Chọn Kanji của れいぞうこ" thì đáp án chỉ hiện 冷蔵庫.
function makeBareKanjiOption(item) {
    return {
        key: String(item.jp || item.kanji || ''),
        primary: item.jp || item.kanji || '',
        secondary: '',
        speak: item.jp || item.reading || '',
        raw: item
    };
}

// Dùng riêng cho luyện cách đọc để đáp án chỉ hiện しんはつばい, không hiện nghĩa bên dưới.
function makeBareReadingOption(item) {
    const reading = item.reading || item.kunyomi || item.onyomi || item.on || item.kun || '';
    return {
        key: String(reading || ''),
        primary: reading || '',
        secondary: '',
        speak: item.jp || reading || '',
        raw: item
    };
}

function getSimilarKanjiDistractors(correctItem, list, targetField = 'reading') {
    const correctKey = targetField === 'jp'
        ? String(correctItem.jp || correctItem.kanji || '')
        : String(correctItem.reading || correctItem.kunyomi || correctItem.onyomi || '');
    const correctReading = String(correctItem.reading || '');
    const correctJp = String(correctItem.jp || correctItem.kanji || '');

    return [...(list || [])]
        .filter(item => item && item !== correctItem)
        .filter(item => {
            const value = targetField === 'jp'
                ? String(item.jp || item.kanji || '')
                : String(item.reading || item.kunyomi || item.onyomi || '');
            return value && value !== correctKey;
        })
        .map(item => {
            const r = String(item.reading || '');
            const j = String(item.jp || item.kanji || '');
            let score = 0;
            if (correctReading && r && r[0] === correctReading[0]) score += 4;
            if (correctJp && j && j[0] === correctJp[0]) score += 3;
            score += Math.max(0, 6 - Math.abs(r.length - correctReading.length));
            score += Math.max(0, 4 - Math.abs(j.length - correctJp.length));
            return { item, score: score + Math.random() };
        })
        .sort((a, b) => b.score - a.score)
        .map(entry => entry.item);
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
    const lessonSuffix = getLessonTitleSuffix(levelPool);
    const pureVocab = levelPool.vocab || [];
    const mixedPool = mode.indexOf('practice') >= 0 ? getLevelVocabMixed(level) : pureVocab;
    const pool = mixedPool.length ? mixedPool : pureVocab;
    const memoryKey = level + ':vocab:' + mode;
    const item = nihongoPick(pool, memoryKey, 14) || { jp: '日本語', reading: 'にほんご', vi: 'Tiếng Nhật' };

    // Học từ vựng: ưu tiên kiểu nhìn nghĩa tiếng Việt -> chọn từ tiếng Nhật đúng.
    // Luyện từ: random 2 chiều để không học vẹt.
    const askPickJapanese = mode.indexOf('learn') >= 0 || Math.random() < 0.55;

    if (askPickJapanese) {
        const options = buildOptionsFromItems(item, pool, makeJapaneseOption, ['vocab', 'kanji']);
        return {
            kind: 'vocab',
            title: (mode.indexOf('learn') >= 0 ? 'Học từ vựng' : 'Luyện từ vựng') + lessonSuffix,
            prompt: 'Chọn từ tiếng Nhật đúng nghĩa.',
            displayType: 'vi',
            jp: item.jp,
            reading: item.reading || '',
            vi: item.vi,
            en: item.en || '',
            speakText: item.jp,
            correctKey: makeJapaneseOption(item).key,
            memoryKey,
            rawItem: item,
            options,
            reveal: { jp: item.jp, reading: item.reading, vi: item.vi, en: item.en || '' }
        };
    }

    const options = buildOptionsFromItems(item, pool, makeMeaningOption, ['vocab', 'kanji']);
    return {
        kind: item.sourceKind === 'kanji' ? 'kanji vocab' : 'vocab',
        title: 'Luyện từ vựng' + lessonSuffix,
        prompt: 'Nghĩa tiếng Việt là gì?',
        displayType: 'jp',
        jp: item.jp,
        reading: '',
        vi: item.vi,
        en: item.en || '',
        speakText: item.jp,
        correctKey: makeMeaningOption(item).key,
        memoryKey,
        rawItem: item,
        options,
        reveal: { jp: item.jp, reading: item.reading, vi: item.vi, en: item.en || '' }
    };
}

function buildListeningQuestion(level) {
    const levelPool = getLevelPool(level);
    const lessonSuffix = getLessonTitleSuffix(levelPool);
    const pool = (levelPool.listening && levelPool.listening.length) ? levelPool.listening : (levelPool.vocab || []);
    const memoryKey = level + ':listen';
    const item = nihongoPick(pool, memoryKey, 12) || { jp: '日本語', reading: 'にほんご', vi: 'Tiếng Nhật' };
    return {
        kind: 'listen',
        title: 'Luyện nghe' + lessonSuffix,
        prompt: 'Bấm loa nghe từ, rồi chọn nghĩa đúng.',
        displayType: 'listen',
        jp: '？？？',
        reading: '',
        vi: item.vi,
        en: item.en || '',
        speakText: item.jp,
        correctKey: makeMeaningOption(item).key,
        memoryKey,
        rawItem: item,
        options: buildOptionsFromItems(item, pool, makeMeaningOption, ['vocab']),
        reveal: { jp: item.jp, reading: item.reading, vi: item.vi, en: item.en || '' }
    };
}

function buildKanjiQuestion(level) {
    const levelPool = getLevelPool(level);
    const lessonSuffix = getLessonTitleSuffix(levelPool);
    const pool = (levelPool.kanji || []).filter(item => (item.jp || item.kanji) && (item.reading || item.vi));
    const memoryKey = level + ':kanji';
    const item = nihongoPick(pool, memoryKey, 16) || { jp: '日', reading: 'にち / ひ', vi: 'Ngày, mặt trời' };
    const modeSeed = Math.random();
    const canAskReading = !!item.reading;
    const canAskKanji = !!(item.jp || item.kanji) && !!item.reading;

    // Luyện Kanji trộn 3 kiểu:
    // 1) Nhìn Kanji -> chọn cách đọc.
    // 2) Nhìn cách đọc -> chọn Kanji.
    // 3) Nhìn Kanji -> chọn nghĩa.
    if (canAskReading && modeSeed < 0.42) {
        const distractors = getSimilarKanjiDistractors(item, pool, 'reading');
        const options = buildOptionsFromItems(item, [item, ...distractors], makeBareReadingOption, ['kanji']);
        return {
            kind: 'kanji-reading',
            title: 'Luyện Kanji ' + (NIHONGO_LEVEL_NAME[level] || '').trim() + lessonSuffix,
            prompt: 'Chọn cách đọc đúng của Kanji này.',
            displayType: 'jp',
            jp: item.jp || item.kanji,
            reading: '',
            vi: item.vi,
            en: item.en || '',
            speakText: item.jp || item.reading,
            correctKey: makeBareReadingOption(item).key,
            memoryKey,
            rawItem: item,
            options,
            reveal: { jp: item.jp || item.kanji, reading: item.reading, vi: item.vi, en: item.en || '' }
        };
    }

    if (canAskKanji && modeSeed < 0.84) {
        const distractors = getSimilarKanjiDistractors(item, pool, 'jp');
        const options = buildOptionsFromItems(item, [item, ...distractors], makeBareKanjiOption, ['kanji']);
        return {
            kind: 'kanji-word',
            title: 'Luyện Kanji ' + (NIHONGO_LEVEL_NAME[level] || '').trim() + lessonSuffix,
            prompt: 'Chọn Kanji đúng cho cách đọc này.',
            displayType: 'reading-target',
            jp: item.reading,
            reading: '',
            vi: item.vi,
            en: item.en || '',
            speakText: item.reading || item.jp,
            correctKey: makeBareKanjiOption(item).key,
            memoryKey,
            rawItem: item,
            options,
            reveal: { jp: item.jp || item.kanji, reading: item.reading, vi: item.vi, en: item.en || '' }
        };
    }

    return {
        kind: 'kanji-meaning',
        title: 'Luyện Kanji ' + (NIHONGO_LEVEL_NAME[level] || '').trim() + lessonSuffix,
        prompt: 'Kanji này có nghĩa gì?',
        displayType: 'jp',
        jp: item.jp || item.kanji,
        reading: '',
        vi: item.vi,
        speakText: item.reading || item.jp,
        correctKey: makeMeaningOption(item).key,
        memoryKey,
        rawItem: item,
        options: buildOptionsFromItems(item, pool, makeMeaningOption, ['kanji']),
        reveal: { jp: item.jp || item.kanji, reading: item.reading, vi: item.vi, en: item.en || '' }
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
    const levelPool = getLevelPool(level);
    const lessonSuffix = getLessonTitleSuffix(levelPool);
    const pool = levelPool.grammar || [];
    const memoryKey = level + ':grammar:' + mode;
    const item = nihongoPick(pool, memoryKey, 10) || {
        jp: 'A は B です',
        pattern: 'A は B です',
        example: '私は学生です。',
        focus: ['は', 'です'],
        vi: 'A là B',
        hint: 'Câu danh từ cơ bản'
    };

    return {
        kind: 'grammar',
        title: (mode === 'sentence' ? 'Mẫu câu' : 'Ngữ pháp') + lessonSuffix,
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
        memoryKey,
        rawItem: item,
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
    const levelPool = getLevelPool(level);
    const lessonSuffix = getLessonTitleSuffix(levelPool);
    const pool = (levelPool.grammar || []).filter(item => item.example || item.sentence || item.jp);
    const memoryKey = level + ':sentence_build';
    const item = nihongoPick(pool, memoryKey, 10) || {
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
        title: 'Ghép câu' + lessonSuffix,
        prompt: 'Chọn câu tiếng Nhật được ghép đúng.',
        displayType: 'sentence-build',
        jp: item.example || item.sentence || item.jp,
        reading: item.hint || '',
        vi: item.sentenceVi || item.vi,
        en: item.sentenceEn || item.en || '',
        parts: nihongoShuffle(parts),
        speakText: item.example || item.sentence || item.jp,
        correctKey: makeSentenceOption(item).key,
        memoryKey,
        rawItem: item,
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
    if (mode === 'kanji' || mode === 'kanji_practice') return buildKanjiQuestion(level);
    if (mode === 'grammar' || mode === 'sentence' || mode === 'grammar_practice') return buildGrammarQuestion(level, mode);
    if (mode === 'sentence_build') return buildSentenceBuildQuestion(level);
    if (mode.indexOf('mock_test') === 0) return buildMockQuestion(level);
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
    const isReadingTarget = data.displayType === 'reading-target';
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
    } else if (isReadingTarget) {
        mainHtml = `
            <div id="nihongo-question-text" class="nihongo-prompt">${nihongoEscape(data.prompt)}</div>
            <div id="nihongo-question-reading-target" class="nihongo-reading-target">${nihongoEscape(data.jp)}</div>
            ${data.reading ? `<div id="nihongo-question-reading" class="nihongo-reading">${nihongoEscape(data.reading)}</div>` : ''}
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

            <button id="nihongo-floating-next" class="nihongo-floating-next" type="button"
                onclick="window.goNextQuestionNow ? goNextQuestionNow() : nextQuestion()" aria-label="Sang câu tiếp theo">
                Sang câu ➜
            </button>
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
    const labelText = options.timeUp ? 'Hết giờ - xem đáp án' : (options.wrong ? 'Đáp án đúng' : (options.label || 'Đáp án'));

    if (data.displayType === 'grammar') {
        box.innerHTML = `
            <div class="reveal-label">${options.timeUp ? 'Hết giờ - xem đáp án' : (options.wrong ? 'Đáp án đúng' : 'Đúng rồi')}</div>
            ${pattern ? `<div class="reveal-line"><b>Mẫu:</b> ${nihongoEscape(pattern)}</div>` : ''}
            ${vi ? `<div class="reveal-line"><b>Nghĩa:</b> ${nihongoEscape(vi)}</div>` : ''}
            ${en ? `<div class="reveal-line reveal-en"><b>English:</b> ${nihongoEscape(en)}</div>` : ''}
            ${hint ? `<div class="reveal-line"><b>Ghi nhớ:</b> ${nihongoEscape(hint)}</div>` : ''}
        `;
    } else if (data.displayType === 'sentence-build') {
        box.innerHTML = `
            <div class="reveal-label">${options.timeUp ? 'Hết giờ - xem đáp án' : (options.wrong ? 'Câu đúng' : 'Câu đúng')}</div>
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

    box.classList.add('show');

    const nextBtn = document.getElementById('nihongo-floating-next');
    if (nextBtn) {
        nextBtn.textContent = options.timeUp ? 'Câu tiếp theo ➜' : 'Sang câu ➜';
        nextBtn.classList.add('show');
    }
}


// =====================================================
// STUDY LIST / TRA CỨU V1.2.2
// - Từ vựng/Kanji/Ngữ pháp: hiển thị danh sách kéo học, không timer.
// - Ô tìm trong bài học lọc theo cấp/bài đang chọn.
// - Search từ menu có thể tìm trong cấp hiện tại hoặc toàn bộ.
// =====================================================

const NIHONGO_STUDY_LEVELS = ['n0', 'n5', 'n4', 'n3', 'n2', 'n1'];
let NIHONGO_STUDY_STATE = null;

function isNihongoStudyListGame(gameId) {
    return /_(vocab_learn|kanji|grammar|sentence|search)$/.test(String(gameId || ''));
}

function getNihongoLevelLabel(level) {
    return NIHONGO_LEVEL_NAME[level] || (level ? level.toUpperCase() : '');
}

function normalText(value) {
    return String(value ?? '').toLowerCase().trim();
}

function collectNihongoLessonItems(level, kind, lessonId = 'all') {
    const bank = nihongoBank();
    const base = bank[level] || {};
    const result = [];
    const pushList = (list, meta = {}) => {
        if (!Array.isArray(list)) return;
        list.forEach((item, idx) => {
            if (!item) return;
            result.push({
                ...item,
                _kind: kind,
                _level: level,
                _levelLabel: getNihongoLevelLabel(level),
                _lessonId: item.lessonId || meta.lessonId || lessonId || 'all',
                _lessonTitle: item.lessonTitle || meta.lessonTitle || '',
                _order: idx + 1
            });
        });
    };

    // Nếu bài đang chọn có dữ liệu theo bài thì dùng dữ liệu đó.
    // Nếu chưa có dữ liệu theo bài, ví dụ N5 grammar cũ đang nằm ở grammar.js chung,
    // thì fallback về dữ liệu chung của cấp để màn học không bị trống.
    if (lessonId && lessonId !== 'all' && base.lessons && base.lessons[lessonId]) {
        const lesson = base.lessons[lessonId];
        const title = lesson.title || lesson.label || lessonId;
        pushList(lesson[kind], { lessonId, lessonTitle: title });
        if (result.length) return result;

        pushList(base[kind], {
            lessonId: 'all',
            lessonTitle: `${getNihongoLevelLabel(level)} chung`
        });
        return result;
    }

    if (base.lessons && Object.keys(base.lessons).length) {
        Object.keys(base.lessons).sort().forEach(id => {
            const lesson = base.lessons[id] || {};
            const title = lesson.title || lesson.label || id;
            pushList(lesson[kind], { lessonId: id, lessonTitle: title });
        });
        if (result.length) return result;

        pushList(base[kind], {
            lessonId: 'all',
            lessonTitle: `${getNihongoLevelLabel(level)} chung`
        });
        return result;
    }

    pushList(base[kind], { lessonId: 'all', lessonTitle: `${getNihongoLevelLabel(level)} chung` });
    return result;
}

function collectNihongoStudyItems(config) {
    const scope = config.scope || 'n5';
    const kind = config.kind || 'vocab';
    const lessonId = config.lessonId || 'all';
    const levels = scope === 'all' ? NIHONGO_STUDY_LEVELS : [scope];
    const items = [];

    levels.forEach(level => {
        if (kind === 'all') {
            ['vocab', 'kanji', 'grammar', 'sentence'].forEach(k => {
                const sourceKind = k === 'sentence' ? 'grammar' : k;
                collectNihongoLessonItems(level, sourceKind, 'all').forEach(item => {
                    items.push({ ...item, _kind: k });
                });
            });
        } else {
            collectNihongoLessonItems(level, kind, lessonId).forEach(item => items.push(item));
        }
    });

    return items;
}

function getNihongoStudyKindFromMode(mode) {
    if (mode === 'search') return 'all';
    if (mode === 'kanji') return 'kanji';
    if (mode === 'grammar' || mode === 'sentence') return 'grammar';
    return 'vocab';
}

function getNihongoStudyTitle(kind, scope, lessonTitle = '') {
    const levelText = scope === 'all' ? 'Toàn bộ' : getNihongoLevelLabel(scope);
    const suffix = lessonTitle ? ' · ' + lessonTitle : '';
    if (kind === 'kanji') return 'Kanji ' + levelText + suffix;
    if (kind === 'grammar') return 'Ngữ pháp ' + levelText + suffix;
    if (kind === 'all') return 'Tra cứu ' + levelText;
    return 'Từ vựng ' + levelText + suffix;
}

function getNihongoStudySearchText(item) {
    return [
        item.jp, item.reading, item.romaji, item.vi, item.en,
        item.pattern, item.example, item.exampleVi, item.sentence,
        item.hint, item.onyomi, item.kunyomi, item.on, item.kun,
        item._levelLabel, item._lessonTitle, item._kind
    ].filter(Boolean).join(' ').toLowerCase();
}

function filterNihongoStudyItems(items, query) {
    const q = normalText(query);
    if (!q) return items;
    return items.filter(item => getNihongoStudySearchText(item).includes(q));
}

function renderNihongoStudyMeta(item) {
    const kindLabel = item._kind === 'kanji' ? 'Kanji' : (item._kind === 'grammar' || item._kind === 'sentence' ? 'Ngữ pháp' : 'Từ vựng');
    const lesson = item._lessonTitle || (item._lessonId && item._lessonId !== 'all' ? item._lessonId : 'Toàn bộ');
    return `<div class="nihongo-study-meta">${nihongoEscape(item._levelLabel || '')} · ${nihongoEscape(lesson)} · ${kindLabel}</div>`;
}

function renderNihongoHighlightedExample(item) {
    const example = item.example || item.sentence || item.jp || '';
    if (!example) return '';
    const html = renderGrammarExample({ ...item, focus: item.focus || item.highlight || item.pattern });
    return `<div class="nihongo-study-example">${html}</div>`;
}

function renderNihongoStudyCard(item, index) {
    if (item._kind === 'kanji') return renderNihongoKanjiStudyCard(item, index);
    if (item._kind === 'grammar' || item._kind === 'sentence') return renderNihongoGrammarStudyCard(item, index);
    return renderNihongoVocabStudyCard(item, index);
}

function renderNihongoVocabStudyCard(item, index) {
    const speak = item.jp || item.reading || '';
    return `
        <article class="nihongo-study-card nihongo-study-vocab-card">
            <div class="nihongo-study-index">${index + 1}.</div>
            <div class="nihongo-study-main">
                <div class="nihongo-study-jp">${nihongoEscape(item.jp || '')}</div>
                ${item.reading ? `<div class="nihongo-study-reading">${nihongoEscape(item.reading)}</div>` : ''}
                ${item.romaji ? `<div class="nihongo-study-romaji">${nihongoEscape(item.romaji)}</div>` : ''}
                ${item.vi ? `<div class="nihongo-study-vi">${nihongoEscape(item.vi)}</div>` : ''}
                ${item.en ? `<div class="nihongo-study-en">${nihongoEscape(item.en)}</div>` : ''}
                ${renderNihongoStudyMeta(item)}
            </div>
            <div class="nihongo-study-actions">
                <button class="nihongo-study-speak" type="button" onclick="speakNihongo(decodeURIComponent('${escapeForClick(speak)}'))">🔊</button>
            </div>
        </article>`;
}

function renderNihongoKanjiStudyCard(item, index) {
    const speak = item.jp || item.reading || item.kunyomi || item.onyomi || '';
    const on = item.onyomi || item.on || '';
    const kun = item.kunyomi || item.kun || item.reading || '';
    return `
        <article class="nihongo-study-card nihongo-study-kanji-card">
            <div class="nihongo-study-index">${index + 1}.</div>
            <div class="nihongo-kanji-side">
                <div class="nihongo-kanji-big">${nihongoEscape(item.jp || item.kanji || '')}</div>
                ${item.reading ? `<div class="nihongo-kanji-main-reading">${nihongoEscape(item.reading)}</div>` : ''}
                <button class="nihongo-study-speak" type="button" onclick="speakNihongo(decodeURIComponent('${escapeForClick(speak)}'))">🔊</button>
            </div>
            <div class="nihongo-study-main">
                ${on ? `<div class="nihongo-study-line"><b>on:</b> <span class="study-blue">${nihongoEscape(on)}</span></div>` : ''}
                ${kun ? `<div class="nihongo-study-line"><b>kun:</b> <span class="study-purple">${nihongoEscape(kun)}</span></div>` : ''}
                ${item.vi ? `<div class="nihongo-study-vi">${nihongoEscape(item.vi)}</div>` : ''}
                ${item.en ? `<div class="nihongo-study-en">${nihongoEscape(item.en)}</div>` : ''}
                ${item.hint || item.mnemonic ? `<div class="nihongo-study-hint">${nihongoEscape(item.hint || item.mnemonic)}</div>` : ''}
                ${renderNihongoStudyMeta(item)}
            </div>
        </article>`;
}

function renderNihongoGrammarStudyCard(item, index) {
    const pattern = item.pattern || item.jp || '';
    const speak = item.example || item.sentence || pattern;
    return `
        <article class="nihongo-study-card nihongo-study-grammar-card">
            <div class="nihongo-study-index">${index + 1}.</div>
            <div class="nihongo-study-main">
                <div class="nihongo-study-pattern">${nihongoEscape(pattern)}</div>
                ${item.vi ? `<div class="nihongo-study-vi">${nihongoEscape(item.vi)}</div>` : ''}
                ${item.en ? `<div class="nihongo-study-en">${nihongoEscape(item.en)}</div>` : ''}
                ${renderNihongoHighlightedExample(item)}
                ${item.reading ? `<div class="nihongo-study-reading">${nihongoEscape(item.reading)}</div>` : ''}
                ${item.exampleVi || item.sentenceVi ? `<div class="nihongo-study-example-vi">${nihongoEscape(item.exampleVi || item.sentenceVi)}</div>` : ''}
                ${item.hint ? `<div class="nihongo-study-hint">${nihongoEscape(item.hint)}</div>` : ''}
                ${renderNihongoStudyMeta(item)}
            </div>
            <div class="nihongo-study-actions">
                <button class="nihongo-study-speak" type="button" onclick="speakNihongo(decodeURIComponent('${escapeForClick(speak)}'))">🔊</button>
            </div>
        </article>`;
}

function getStudyLessonOptions(level, currentLesson) {
    const data = window.NIHONGO_DATA && window.NIHONGO_DATA[level];
    const meta = data && Array.isArray(data.lessonsMeta) ? data.lessonsMeta : [];
    if (!meta.length) return '';
    const opts = [`<option value="all" ${currentLesson === 'all' ? 'selected' : ''}>Toàn bộ ${getNihongoLevelLabel(level)}</option>`]
        .concat(meta.map(item => `<option value="${nihongoEscape(item.id)}" ${item.id === currentLesson ? 'selected' : ''}>${nihongoEscape(item.label || item.title || item.id)}</option>`));
    return opts.join('');
}

function renderNihongoStudyList() {
    if (!NIHONGO_STUDY_STATE) return;
    const listEl = document.getElementById('nihongo-study-list');
    const countEl = document.getElementById('nihongo-study-count');
    if (!listEl) return;

    const input = document.getElementById('nihongo-study-search-input');
    const query = input ? input.value : (NIHONGO_STUDY_STATE.query || '');
    const filtered = filterNihongoStudyItems(NIHONGO_STUDY_STATE.items, query);
    const visible = filtered.slice(0, NIHONGO_STUDY_STATE.maxVisible || 600);

    if (countEl) {
        countEl.textContent = `${filtered.length} mục` + (filtered.length > visible.length ? ` · đang hiện ${visible.length}` : '');
    }

    if (!visible.length) {
        listEl.innerHTML = `<div class="nihongo-study-empty">Không tìm thấy dữ liệu phù hợp. Hãy thử từ khoá khác hoặc đổi bài/cấp.</div>`;
        return;
    }

    listEl.innerHTML = visible.map(renderNihongoStudyCard).join('');
}

function setNihongoStudyLesson(lessonId) {
    if (!NIHONGO_STUDY_STATE) return;
    const state = NIHONGO_STUDY_STATE;
    if (state.scope === 'all') return;
    try { localStorage.setItem('nihongo_selected_lesson_' + state.scope, lessonId || 'all'); } catch (e) {}
    state.lessonId = lessonId || 'all';
    state.items = collectNihongoStudyItems({ scope: state.scope, kind: state.kind, lessonId: state.lessonId });
    const titleEl = document.getElementById('nihongo-study-title');
    if (titleEl) titleEl.textContent = getNihongoStudyTitle(state.kind, state.scope, state.lessonId === 'all' ? '' : (window.NIHONGO_DATA?.[state.scope]?.lessons?.[state.lessonId]?.title || state.lessonId));
    renderNihongoStudyList();
}

function setNihongoStudyScope(scope) {
    if (!NIHONGO_STUDY_STATE) return;
    const state = NIHONGO_STUDY_STATE;
    state.scope = scope || state.scope;
    state.lessonId = 'all';
    state.items = collectNihongoStudyItems({ scope: state.scope, kind: state.kind, lessonId: 'all' });
    const lessonBox = document.getElementById('nihongo-study-lesson-box');
    if (lessonBox) {
        lessonBox.innerHTML = state.scope === 'all' ? '' : `<select class="nihongo-study-select" onchange="setNihongoStudyLesson(this.value)">${getStudyLessonOptions(state.scope, 'all')}</select>`;
    }
    const titleEl = document.getElementById('nihongo-study-title');
    if (titleEl) titleEl.textContent = getNihongoStudyTitle(state.kind, state.scope);
    renderNihongoStudyList();
}

function renderNihongoStudyScreen(gameId, title) {
    const gameScreen = document.getElementById('game-screen');
    if (!gameScreen) return;

    const parsed = parseNihongoGameId(gameId);
    const mode = parsed.mode;
    const fromMenuSearch = mode === 'search';
    const storedScope = fromMenuSearch ? (() => { try { return sessionStorage.getItem('nihongo_search_scope') || ''; } catch (e) { return ''; } })() : '';
    const storedQuery = fromMenuSearch ? (() => { try { return sessionStorage.getItem('nihongo_search_query') || ''; } catch (e) { return ''; } })() : '';
    const scope = fromMenuSearch ? (storedScope || parsed.level) : parsed.level;
    const kind = getNihongoStudyKindFromMode(mode);
    const lessonId = scope === 'all' ? 'all' : getSelectedNihongoLessonId(scope);
    const lessonTitle = scope !== 'all' && lessonId !== 'all' ? (window.NIHONGO_DATA?.[scope]?.lessons?.[lessonId]?.title || lessonId) : '';
    const items = collectNihongoStudyItems({ scope, kind, lessonId });
    const headerTitle = getNihongoStudyTitle(kind, scope, lessonTitle);

    NIHONGO_STUDY_STATE = { gameId, mode, kind, scope, lessonId, items, query: storedQuery, maxVisible: scope === 'all' && !storedQuery ? 180 : 800 };

    const scopeOptions = [`<option value="all" ${scope === 'all' ? 'selected' : ''}>🌐 Toàn bộ</option>`]
        .concat(NIHONGO_STUDY_LEVELS.map(level => `<option value="${level}" ${scope === level ? 'selected' : ''}>${getNihongoLevelLabel(level)}</option>`))
        .join('');
    const lessonSelect = scope === 'all' ? '' : `<select class="nihongo-study-select" onchange="setNihongoStudyLesson(this.value)">${getStudyLessonOptions(scope, lessonId)}</select>`;

    gameScreen.innerHTML = `
        ${renderGameHeader({ score: '<span id="nihongo-study-title">' + nihongoEscape(headerTitle) + '</span>', onHome: 'backToMenu()' })}
        <div class="nihongo-study-screen">
            <div class="nihongo-study-toolbar">
                <div class="nihongo-study-search-wrap">
                    <input id="nihongo-study-search-input" class="nihongo-study-search-input" type="search" autocomplete="off"
                        placeholder="Tìm tiếng Nhật / cách đọc / nghĩa Việt / English..." value="${nihongoEscape(storedQuery)}"
                        oninput="renderNihongoStudyList()">
                </div>
                <select class="nihongo-study-select" onchange="setNihongoStudyScope(this.value)">${scopeOptions}</select>
                <span id="nihongo-study-lesson-box">${lessonSelect}</span>
                <span id="nihongo-study-count" class="nihongo-study-count"></span>
            </div>
            <div id="nihongo-study-list" class="nihongo-study-list"></div>
        </div>
    `;

    // Query từ ô Tra cứu ngoài menu chỉ dùng để mở màn Tra cứu một lần.
    // Không lưu sang lần mở Từ vựng/Kanji/Ngữ pháp kế tiếp.
    if (fromMenuSearch) {
        try {
            sessionStorage.removeItem('nihongo_search_query');
            sessionStorage.removeItem('nihongo_search_scope');
        } catch (e) {}
    }

    renderNihongoStudyList();
}

function makeNihongoStudyGame(gameId) {
    return {
        start(ctx = {}) {
            try { activeGame = null; } catch (e) {}
            try { currentQuestionData = null; } catch (e) {}
            if (typeof stopQuestionTimer === 'function') stopQuestionTimer(true);
            if (typeof stopAutoReplay === 'function') stopAutoReplay();
            renderNihongoStudyScreen(gameId, ctx.title || 'Nihongo Quest');
        }
    };
}

// =====================================================
// JLPT MOCK TEST MENU V1.2.3
// - Nút "Thi thử JLPT" trong nhóm Luyện không vào đề ngay.
// - Mở menu Đề số 01..20 để sau này cập nhật dữ liệu từng đề.
// - Hiện tại mỗi đề dùng ngân hàng câu hỏi random của cấp đó.
// =====================================================
const NIHONGO_JLPT_MOCK_SET_COUNT = 20;

function isNihongoMockMenuGame(gameId) {
    return /_mock_test$/.test(String(gameId || ''));
}

function isNihongoMockSetGame(gameId) {
    return /_mock_test_\d{2}$/.test(String(gameId || ''));
}

function getNihongoMockSetNo(gameId) {
    const match = String(gameId || '').match(/_mock_test_(\d{2})$/);
    return match ? match[1] : '';
}

function renderNihongoMockMenuScreen(gameId) {
    const gameScreen = document.getElementById('game-screen');
    if (!gameScreen) return;

    const parsed = parseNihongoGameId(gameId);
    const level = parsed.level || 'n5';
    const levelLabel = getNihongoLevelLabel(level);
    const setButtons = Array.from({ length: NIHONGO_JLPT_MOCK_SET_COUNT }, (_, idx) => {
        const setNo = String(idx + 1).padStart(2, '0');
        return `
            <button class="nihongo-mock-set-btn" type="button" onclick="startNihongoMockSet('${level}', '${setNo}')">
                <span class="nihongo-mock-set-no">Đề số ${setNo}</span>
                <span class="nihongo-mock-set-sub">JLPT ${levelLabel}</span>
            </button>`;
    }).join('');

    gameScreen.innerHTML = `
        ${renderGameHeader({ score: 'Thi thử JLPT ' + nihongoEscape(levelLabel), onHome: 'backToMenu()' })}
        <div class="nihongo-mock-menu-screen">
            <div class="nihongo-mock-menu-head">
                <div class="nihongo-mock-menu-kicker">Luyện · Thi thử</div>
                <h2>Chọn đề ${nihongoEscape(levelLabel)}</h2>
                <p>Chọn một đề để bắt đầu luyện tổng hợp từ vựng, Kanji, ngữ pháp, nghe và ghép câu.</p>
            </div>
            <div class="nihongo-mock-set-grid">${setButtons}</div>
        </div>
    `;
}

function startNihongoMockSet(level, setNo) {
    const safeLevel = /^n[0-5]$/.test(String(level || '')) ? level : 'n5';
    const safeSet = String(setNo || '01').padStart(2, '0').slice(-2);
    try { sessionStorage.setItem('nihongo_mock_set_' + safeLevel, safeSet); } catch (e) {}
    if (typeof startGame === 'function') startGame(`nihongo_${safeLevel}_mock_test_${safeSet}`);
}

function makeNihongoMockMenuGame(gameId) {
    return {
        start(ctx = {}) {
            try { activeGame = null; } catch (e) {}
            try { currentQuestionData = null; } catch (e) {}
            if (typeof stopQuestionTimer === 'function') stopQuestionTimer(true);
            if (typeof stopAutoReplay === 'function') stopAutoReplay();
            renderNihongoMockMenuScreen(gameId, ctx.title || 'Thi thử JLPT');
        }
    };
}

window.renderNihongoStudyList = renderNihongoStudyList;
window.setNihongoStudyLesson = setNihongoStudyLesson;
window.setNihongoStudyScope = setNihongoStudyScope;
window.startNihongoMockSet = startNihongoMockSet;

function isNihongoLearnGame(gameId) {
    return /_vocab_learn$/.test(gameId) || /_kana$/.test(gameId) || /_katakana$/.test(gameId) || /_n0_vocab$/.test(gameId);
}

function markNihongoCorrectButton(data) {
    const key = String(data && data.correctKey || '');
    document.querySelectorAll('#options-grid .nihongo-option-btn').forEach(btn => {
        if (btn.dataset.answerKey === key) btn.classList.add('correct');
        btn.disabled = true;
        btn.classList.add('locked');
    });
}

function markNihongoWrongAnswer(data, selectedBtn) {
    if (selectedBtn) selectedBtn.classList.add('wrong');
    if (data && data.memoryKey && data.rawItem) {
        queueNihongoWrongReview(data.memoryKey, data.rawItem, 10);
    }
    markNihongoCorrectButton(data);
    revealNihongoAnswer(data, { wrong: true });
}

function makeNihongoGame(gameId) {
    if (isNihongoStudyListGame(gameId)) return makeNihongoStudyGame(gameId);
    if (isNihongoMockMenuGame(gameId)) return makeNihongoMockMenuGame(gameId);
    const isLearn = isNihongoLearnGame(gameId);
    const isMock = gameId.indexOf('mock_test') >= 0;

    return {
        questionTimeSec: isMock ? 30 : (isLearn ? 30 : 24),
        correctDelayMs: 5000,
        wrongDelayMs: 5000,
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
        onWrong(data, selected, btn) {
            markNihongoWrongAnswer(data, btn);
            return true;
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
    'nihongo_n0_search', 'nihongo_n5_search', 'nihongo_n4_search', 'nihongo_n3_search', 'nihongo_n2_search', 'nihongo_n1_search',
    'nihongo_n0_kanji_practice', 'nihongo_n0_grammar_practice', 'nihongo_n5_kanji_practice', 'nihongo_n5_grammar_practice', 'nihongo_n4_kanji_practice', 'nihongo_n4_grammar_practice', 'nihongo_n3_kanji_practice', 'nihongo_n3_grammar_practice', 'nihongo_n2_kanji_practice', 'nihongo_n2_grammar_practice', 'nihongo_n1_kanji_practice', 'nihongo_n1_grammar_practice',
    'nihongo_n0_kana', 'nihongo_n0_katakana', 'nihongo_n0_vocab', 'nihongo_n0_listen', 'nihongo_n0_kanji', 'nihongo_n0_grammar', 'nihongo_n0_quiz',
    'nihongo_n5_vocab_learn', 'nihongo_n5_vocab_practice', 'nihongo_n5_listening', 'nihongo_n5_kanji', 'nihongo_n5_grammar', 'nihongo_n5_sentence', 'nihongo_n5_sentence_build', 'nihongo_n5_mock_test',
    'nihongo_n4_vocab_learn', 'nihongo_n4_vocab_practice', 'nihongo_n4_listening', 'nihongo_n4_kanji', 'nihongo_n4_grammar', 'nihongo_n4_sentence', 'nihongo_n4_sentence_build', 'nihongo_n4_mock_test',
    'nihongo_n3_vocab_learn', 'nihongo_n3_vocab_practice', 'nihongo_n3_listening', 'nihongo_n3_kanji', 'nihongo_n3_grammar', 'nihongo_n3_sentence', 'nihongo_n3_sentence_build', 'nihongo_n3_mock_test',
    'nihongo_n2_vocab_learn', 'nihongo_n2_vocab_practice', 'nihongo_n2_listening', 'nihongo_n2_kanji', 'nihongo_n2_grammar', 'nihongo_n2_sentence', 'nihongo_n2_sentence_build', 'nihongo_n2_mock_test',
    'nihongo_n1_vocab_learn', 'nihongo_n1_vocab_practice', 'nihongo_n1_listening', 'nihongo_n1_kanji', 'nihongo_n1_grammar', 'nihongo_n1_sentence', 'nihongo_n1_sentence_build', 'nihongo_n1_mock_test'
];

NIHONGO_STUDY_LEVELS.forEach(level => {
    for (let i = 1; i <= NIHONGO_JLPT_MOCK_SET_COUNT; i += 1) {
        NIHONGO_GAME_IDS.push(`nihongo_${level}_mock_test_${String(i).padStart(2, '0')}`);
    }
});

NIHONGO_GAME_IDS.forEach(id => registerGame(id, makeNihongoGame(id)));
window.speakNihongo = speakNihongo;
