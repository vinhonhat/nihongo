// games/nihongo/data/n5/index.js
// N5 lesson loader V1.2.4
// Cấu trúc chuẩn giống N4/N3: mỗi bài 1 file lesson01.js ... lesson25.js
// Mỗi lesson có thể chứa: vocab, kanji, grammar, listening, sentence.
// Nếu N5 grammar/kanji/listening vẫn nằm ở file chung thì logic app sẽ fallback, không bị trống.

window.NIHONGO_DATA = window.NIHONGO_DATA || {};
window.NIHONGO_DATA.n5 = window.NIHONGO_DATA.n5 || {};
window.NIHONGO_DATA.n5.lessons = window.NIHONGO_DATA.n5.lessons || {};
window.NIHONGO_DATA.n5.lessonsMeta = window.NIHONGO_DATA.n5.lessonsMeta || [];

(function () {
    function rebuildNihongoLevelFromLessons(levelName) {
        const bank = window.NIHONGO_DATA = window.NIHONGO_DATA || {};
        const levelData = bank[levelName] = bank[levelName] || {};
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

        const lessonVocab = merge('vocab');
        const lessonKanji = merge('kanji');
        const lessonGrammar = merge('grammar');
        const lessonListening = merge('listening');
        const lessonSentence = merge('sentence');

        // Vocab N5 đã tách theo bài nên ghi trực tiếp.
        levelData.vocab = lessonVocab;

        // Các mảng phụ chỉ ghi khi lesson có dữ liệu.
        // Nếu chưa có, giữ dữ liệu file chung kanji.js / grammar.js / listening.js để tránh màn học bị trống.
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
                listeningCount: Array.isArray(lesson.listening) ? lesson.listening.length : 0,
                sentenceCount: Array.isArray(lesson.sentence) ? lesson.sentence.length : 0
            };
        });
    }

    window.rebuildNihongoLevelFromLessons = window.rebuildNihongoLevelFromLessons || rebuildNihongoLevelFromLessons;

    window.registerNihongoLesson = window.registerNihongoLesson || function registerNihongoLesson(levelName, lesson) {
        const bank = window.NIHONGO_DATA = window.NIHONGO_DATA || {};
        const levelData = bank[levelName] = bank[levelName] || {};
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

        window.rebuildNihongoLevelFromLessons(levelName);
    };

    for (let i = 1; i <= 25; i += 1) {
        const num = String(i).padStart(2, '0');
        document.write('<script src="games/nihongo/data/n5/lesson' + num + '.js"><\/script>');
    }
})();
