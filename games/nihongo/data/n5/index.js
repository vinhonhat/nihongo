// games/nihongo/data/n5/index.js
// N5 lesson loader V1.1.7
// Mỗi bài chỉ cần 1 file lessonXX.js. File này gom dữ liệu từng bài thành mảng chung để game dùng như cũ.
// Cấu trúc mỗi lesson:
// window.registerNihongoLesson('n5', { id, title, vocab: [], kanji: [], grammar: [], listening: [], sentence: [] });

window.NIHONGO_DATA = window.NIHONGO_DATA || {};
window.NIHONGO_DATA.n5 = window.NIHONGO_DATA.n5 || {};
window.NIHONGO_DATA.n5.lessons = window.NIHONGO_DATA.n5.lessons || {};
window.NIHONGO_DATA.n5.lessonsMeta = window.NIHONGO_DATA.n5.lessonsMeta || [];

function rebuildNihongoLevelFromLessons(level) {
    const bank = window.NIHONGO_DATA = window.NIHONGO_DATA || {};
    const levelData = bank[level] = bank[level] || {};
    const lessons = levelData.lessons || {};
    const ids = Object.keys(lessons).sort();

    const merge = (kind) => ids.flatMap(id => {
        const lesson = lessons[id] || {};
        const list = Array.isArray(lesson[kind]) ? lesson[kind] : [];
        return list.map(item => ({
            ...item,
            lessonId: id,
            lessonTitle: lesson.title || id
        }));
    });

    // Các mảng này giữ tương thích với logic game cũ: getLevelPool(level).vocab/kanji/grammar/listening.
    levelData.vocab = merge('vocab');

    // Chỉ ghi các mảng phụ nếu lesson có dữ liệu. Nếu chưa có, vẫn giữ file kanji.js/grammar.js/listening.js cũ.
    const lessonKanji = merge('kanji');
    const lessonGrammar = merge('grammar');
    const lessonListening = merge('listening');
    const lessonSentence = merge('sentence');

    if (lessonKanji.length) levelData.kanji = lessonKanji;
    if (lessonGrammar.length) levelData.grammar = lessonGrammar;
    if (lessonListening.length) levelData.listening = lessonListening;
    if (lessonSentence.length) levelData.sentence = lessonSentence;

    levelData.lessonsMeta = ids.map(id => {
        const lesson = lessons[id] || {};
        return {
            id,
            title: lesson.title || id,
            label: lesson.label || lesson.title || id,
            note: lesson.note || '',
            vocabCount: Array.isArray(lesson.vocab) ? lesson.vocab.length : 0,
            kanjiCount: Array.isArray(lesson.kanji) ? lesson.kanji.length : 0,
            grammarCount: Array.isArray(lesson.grammar) ? lesson.grammar.length : 0,
            listeningCount: Array.isArray(lesson.listening) ? lesson.listening.length : 0
        };
    });
}

window.registerNihongoLesson = function registerNihongoLesson(level, lesson) {
    const bank = window.NIHONGO_DATA = window.NIHONGO_DATA || {};
    const levelData = bank[level] = bank[level] || {};
    levelData.lessons = levelData.lessons || {};
    if (!lesson || !lesson.id) return;

    levelData.lessons[lesson.id] = {
        title: lesson.title || lesson.id,
        label: lesson.label || lesson.title || lesson.id,
        note: lesson.note || '',
        vocab: Array.isArray(lesson.vocab) ? lesson.vocab : [],
        kanji: Array.isArray(lesson.kanji) ? lesson.kanji : [],
        grammar: Array.isArray(lesson.grammar) ? lesson.grammar : [],
        listening: Array.isArray(lesson.listening) ? lesson.listening : [],
        sentence: Array.isArray(lesson.sentence) ? lesson.sentence : []
    };

    rebuildNihongoLevelFromLessons(level);
};

window.rebuildNihongoLevelFromLessons = rebuildNihongoLevelFromLessons;
