// games/nihongo/nihongo.js
// Bộ bài học tiếng Nhật dùng chung cho menu V3.2.

const NIHONGO_LEVEL_NAME = { intro: 'Nhập môn', n5: 'N5', n4: 'N4', n3: 'N3', n2: 'N2', n1: 'N1' };

const NIHONGO_KANA = [
    { jp: 'あ', romaji: 'a', vi: 'a', type: 'Hiragana' }, { jp: 'い', romaji: 'i', vi: 'i', type: 'Hiragana' },
    { jp: 'う', romaji: 'u', vi: 'u', type: 'Hiragana' }, { jp: 'え', romaji: 'e', vi: 'e', type: 'Hiragana' },
    { jp: 'お', romaji: 'o', vi: 'o', type: 'Hiragana' }, { jp: 'か', romaji: 'ka', vi: 'ka', type: 'Hiragana' },
    { jp: 'き', romaji: 'ki', vi: 'ki', type: 'Hiragana' }, { jp: 'く', romaji: 'ku', vi: 'ku', type: 'Hiragana' },
    { jp: 'け', romaji: 'ke', vi: 'ke', type: 'Hiragana' }, { jp: 'こ', romaji: 'ko', vi: 'ko', type: 'Hiragana' },
    { jp: 'ア', romaji: 'a', vi: 'a', type: 'Katakana' }, { jp: 'イ', romaji: 'i', vi: 'i', type: 'Katakana' },
    { jp: 'ウ', romaji: 'u', vi: 'u', type: 'Katakana' }, { jp: 'エ', romaji: 'e', vi: 'e', type: 'Katakana' },
    { jp: 'オ', romaji: 'o', vi: 'o', type: 'Katakana' }, { jp: 'カ', romaji: 'ka', vi: 'ka', type: 'Katakana' },
    { jp: 'キ', romaji: 'ki', vi: 'ki', type: 'Katakana' }, { jp: 'ク', romaji: 'ku', vi: 'ku', type: 'Katakana' },
    { jp: 'ケ', romaji: 'ke', vi: 'ke', type: 'Katakana' }, { jp: 'コ', romaji: 'ko', vi: 'ko', type: 'Katakana' }
];

const NIHONGO_BANK = {
    intro: {
        vocab: [
            { jp: 'こんにちは', reading: 'konnichiwa', vi: 'Xin chào' }, { jp: 'ありがとう', reading: 'arigatou', vi: 'Cảm ơn' },
            { jp: 'すし', reading: 'sushi', vi: 'Sushi' }, { jp: 'ねこ', reading: 'neko', vi: 'Con mèo' },
            { jp: 'みず', reading: 'mizu', vi: 'Nước' }, { jp: 'にほん', reading: 'nihon', vi: 'Nhật Bản' }
        ],
        kanji: [{ jp: '日', reading: 'にち / ひ', vi: 'Ngày, mặt trời' }, { jp: '本', reading: 'ほん', vi: 'Sách, gốc' }, { jp: '人', reading: 'ひと / じん', vi: 'Người' }],
        grammar: [{ jp: 'A は B です', vi: 'A là B', hint: 'Mẫu tự giới thiệu cơ bản' }, { jp: 'これは A です', vi: 'Đây là A', hint: 'Chỉ đồ vật gần người nói' }, { jp: 'A ですか', vi: 'A phải không?', hint: 'Thêm か để tạo câu hỏi' }]
    },
    n5: {
        vocab: [{ jp:'学生',reading:'がくせい',vi:'Học sinh / sinh viên'},{ jp:'先生',reading:'せんせい',vi:'Giáo viên'},{ jp:'会社',reading:'かいしゃ',vi:'Công ty'},{ jp:'電車',reading:'でんしゃ',vi:'Tàu điện'},{ jp:'時間',reading:'じかん',vi:'Thời gian'},{ jp:'今日',reading:'きょう',vi:'Hôm nay'}],
        kanji: [{jp:'山',reading:'やま',vi:'Núi'},{jp:'川',reading:'かわ',vi:'Sông'},{jp:'田',reading:'た',vi:'Ruộng'},{jp:'一',reading:'いち',vi:'Một'},{jp:'二',reading:'に',vi:'Hai'},{jp:'三',reading:'さん',vi:'Ba'}],
        grammar: [{jp:'A は B です',vi:'A là B',hint:'Câu danh từ cơ bản'},{jp:'A に 行きます',vi:'Đi đến A',hint:'に chỉ điểm đến'},{jp:'A を 食べます',vi:'Ăn A',hint:'を chỉ tân ngữ'},{jp:'A があります',vi:'Có A',hint:'Dùng với đồ vật/sự việc'}]
    },
    n4: {
        vocab: [{jp:'経験',reading:'けいけん',vi:'Kinh nghiệm'},{jp:'準備',reading:'じゅんび',vi:'Chuẩn bị'},{jp:'説明',reading:'せつめい',vi:'Giải thích'},{jp:'残業',reading:'ざんぎょう',vi:'Tăng ca'},{jp:'必要',reading:'ひつよう',vi:'Cần thiết'},{jp:'便利',reading:'べんり',vi:'Tiện lợi'}],
        kanji: [{jp:'駅',reading:'えき',vi:'Nhà ga'},{jp:'店',reading:'みせ',vi:'Cửa hàng'},{jp:'員',reading:'いん',vi:'Nhân viên / thành viên'},{jp:'新',reading:'しん / あたらしい',vi:'Mới'},{jp:'古',reading:'ふるい',vi:'Cũ'}],
        grammar: [{jp:'〜たことがあります',vi:'Đã từng...',hint:'Nói về kinh nghiệm'},{jp:'〜ながら',vi:'Vừa... vừa...',hint:'Hai hành động cùng lúc'},{jp:'〜と思います',vi:'Tôi nghĩ rằng...',hint:'Nêu ý kiến'},{jp:'〜てしまいました',vi:'Lỡ / đã làm mất rồi',hint:'Hoàn tất hoặc tiếc nuối'}]
    },
    n3: {
        vocab: [{jp:'確認',reading:'かくにん',vi:'Xác nhận'},{jp:'対応',reading:'たいおう',vi:'Đối ứng / xử lý'},{jp:'状況',reading:'じょうきょう',vi:'Tình hình'},{jp:'原因',reading:'げんいん',vi:'Nguyên nhân'},{jp:'改善',reading:'かいぜん',vi:'Cải thiện'},{jp:'提出',reading:'ていしゅつ',vi:'Nộp'}],
        kanji: [{jp:'確',reading:'かく',vi:'Chắc chắn'},{jp:'認',reading:'にん',vi:'Nhận biết / xác nhận'},{jp:'状',reading:'じょう',vi:'Tình trạng'},{jp:'況',reading:'きょう',vi:'Tình hình'},{jp:'改',reading:'かい',vi:'Sửa đổi'}],
        grammar: [{jp:'〜ようにしています',vi:'Cố gắng duy trì thói quen...',hint:'Thói quen có ý thức'},{jp:'〜わけではない',vi:'Không hẳn là...',hint:'Phủ định một phần'},{jp:'〜ばかりでなく',vi:'Không chỉ... mà còn...',hint:'Bổ sung ý'},{jp:'〜によって',vi:'Tùy theo / bởi...',hint:'Nguồn nguyên nhân hoặc phương thức'}]
    },
    n2: {
        vocab: [{jp:'効率',reading:'こうりつ',vi:'Hiệu suất'},{jp:'方針',reading:'ほうしん',vi:'Phương châm'},{jp:'課題',reading:'かだい',vi:'Vấn đề / bài toán'},{jp:'影響',reading:'えいきょう',vi:'Ảnh hưởng'},{jp:'判断',reading:'はんだん',vi:'Phán đoán'},{jp:'導入',reading:'どうにゅう',vi:'Đưa vào / áp dụng'}],
        kanji: [{jp:'効',reading:'こう',vi:'Hiệu quả'},{jp:'率',reading:'りつ',vi:'Tỷ lệ'},{jp:'響',reading:'きょう',vi:'Âm vang / ảnh hưởng'},{jp:'導',reading:'どう',vi:'Dẫn dắt'},{jp:'判',reading:'はん',vi:'Phán xét'}],
        grammar: [{jp:'〜に限らず',vi:'Không chỉ giới hạn ở...',hint:'Mở rộng phạm vi'},{jp:'〜かねない',vi:'Có nguy cơ...',hint:'Kết quả xấu có thể xảy ra'},{jp:'〜ものの',vi:'Mặc dù...',hint:'Nhượng bộ trang trọng'},{jp:'〜に伴って',vi:'Cùng với...',hint:'Biến đổi kéo theo'}]
    },
    n1: {
        vocab: [{jp:'抽象',reading:'ちゅうしょう',vi:'Trừu tượng'},{jp:'妥当',reading:'だとう',vi:'Thỏa đáng'},{jp:'推移',reading:'すいい',vi:'Chuyển biến'},{jp:'顕著',reading:'けんちょ',vi:'Rõ rệt'},{jp:'是正',reading:'ぜせい',vi:'Chấn chỉnh'},{jp:'網羅',reading:'もうら',vi:'Bao quát'}],
        kanji: [{jp:'抽',reading:'ちゅう',vi:'Rút ra'},{jp:'象',reading:'しょう',vi:'Hiện tượng / voi'},{jp:'妥',reading:'だ',vi:'Thỏa đáng'},{jp:'顕',reading:'けん',vi:'Hiển hiện'},{jp:'羅',reading:'ら',vi:'Lưới / sắp bày'}],
        grammar: [{jp:'〜に至るまで',vi:'Cho đến tận...',hint:'Nhấn mạnh phạm vi rộng'},{jp:'〜を余儀なくされる',vi:'Bị buộc phải...',hint:'Không còn lựa chọn'},{jp:'〜に堪えない',vi:'Không chịu nổi / rất...',hint:'Sắc thái văn viết'},{jp:'〜ともなると',vi:'Một khi đã đến mức...',hint:'Điều kiện ở cấp độ cao'}]
    }
};

function nihongoRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function nihongoShuffle(arr) { return typeof shuffleArray === 'function' ? shuffleArray(arr) : [...arr].sort(() => Math.random() - 0.5); }
function parseNihongoGameId(gameId) {
    if (gameId.indexOf('nihongo_intro_') === 0) return { level: 'intro', mode: gameId.replace('nihongo_intro_', '') };
    const match = gameId.match(/^nihongo_(n[1-5])_(.+)$/);
    return match ? { level: match[1], mode: match[2] } : { level: 'intro', mode: 'quiz' };
}
function getLevelPool(level) { return NIHONGO_BANK[level] || NIHONGO_BANK.intro; }
function buildWrongOptions(correct, list, field) {
    const values = list.map(item => item[field]).filter(value => value && value !== correct);
    const options = new Set([correct]);
    nihongoShuffle(values).forEach(value => { if (options.size < 4) options.add(value); });
    ['Xin chào','Cảm ơn','Công ty','Thời gian','Không chỉ... mà còn...','Có nguy cơ...'].forEach(value => { if (options.size < 4 && value !== correct) options.add(value); });
    return nihongoShuffle(Array.from(options));
}
function buildKanaQuestion(gameId) {
    const onlyKatakana = gameId.indexOf('katakana') >= 0;
    const pool = NIHONGO_KANA.filter(item => onlyKatakana ? item.type === 'Katakana' : item.type === 'Hiragana');
    const item = nihongoRandom(pool);
    return { kind:'kana', title:item.type, prompt:'Chữ này đọc là gì?', jp:item.jp, reading:item.romaji, speakText:item.jp, correct:item.romaji, options:buildWrongOptions(item.romaji, NIHONGO_KANA, 'romaji') };
}
function buildVocabQuestion(level, mode) {
    const pool = getLevelPool(level).vocab;
    const item = nihongoRandom(pool);
    const askJapanese = mode.indexOf('practice') >= 0 || Math.random() < 0.5;
    const correct = askJapanese ? item.vi : item.jp;
    return { kind:'vocab', title:mode.indexOf('learn') >= 0 ? 'Học từ vựng' : 'Luyện từ vựng', prompt:askJapanese ? 'Nghĩa tiếng Việt là gì?' : 'Chọn từ tiếng Nhật đúng nghĩa.', jp:item.jp, reading:item.reading, vi:item.vi, speakText:item.jp, correct, options:buildWrongOptions(correct, pool, askJapanese ? 'vi' : 'jp') };
}
function buildListeningQuestion(level) {
    const pool = getLevelPool(level).vocab;
    const item = nihongoRandom(pool);
    return { kind:'listen', title:'Luyện nghe', prompt:'Bấm loa nghe từ, rồi chọn nghĩa đúng.', jp:'？？？', reading:'Nghe trước, xem đáp án sau', vi:item.vi, speakText:item.jp, correct:item.vi, options:buildWrongOptions(item.vi, pool, 'vi') };
}
function buildKanjiQuestion(level) {
    const pool = getLevelPool(level).kanji;
    const item = nihongoRandom(pool);
    return { kind:'kanji', title:'Kanji', prompt:'Kanji này có nghĩa gì?', jp:item.jp, reading:item.reading, vi:item.vi, speakText:item.reading || item.jp, correct:item.vi, options:buildWrongOptions(item.vi, pool, 'vi') };
}
function buildGrammarQuestion(level, mode) {
    const pool = getLevelPool(level).grammar;
    const item = nihongoRandom(pool);
    return { kind:'grammar', title:mode === 'sentence' ? 'Mẫu câu' : 'Ngữ pháp', prompt:mode === 'sentence' ? 'Mẫu câu này dùng để nói gì?' : 'Ý nghĩa ngữ pháp là gì?', jp:item.jp, reading:item.hint, vi:item.vi, speakText:item.jp, correct:item.vi, options:buildWrongOptions(item.vi, pool, 'vi') };
}
function buildMockQuestion(level) {
    const builders = [() => buildVocabQuestion(level, 'vocab_practice'), () => buildListeningQuestion(level), () => buildKanjiQuestion(level), () => buildGrammarQuestion(level, 'grammar')];
    const q = nihongoRandom(builders)();
    q.title = 'Thi thử ' + (NIHONGO_LEVEL_NAME[level] || '');
    q.kind = 'mock';
    return q;
}
function buildNihongoQuestion(gameId) {
    const parsed = parseNihongoGameId(gameId), level = parsed.level, mode = parsed.mode;
    if (level === 'intro' && (mode === 'kana' || mode === 'katakana')) return buildKanaQuestion(gameId);
    if (level === 'intro' && mode === 'listen') return buildListeningQuestion('intro');
    if (level === 'intro' && mode === 'quiz') return buildMockQuestion('intro');
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
        utter.lang = 'ja-JP'; utter.rate = 0.82; utter.pitch = 1;
        window.speechSynthesis.speak(utter);
    } catch (err) { console.warn('Không đọc được tiếng Nhật:', err); }
}
function renderNihongoDisplay(data) {
    const showListenMask = data.kind === 'listen';
    const jp = showListenMask ? '？？？' : data.jp;
    const hint = showListenMask ? 'Bấm nút loa trên thẻ để nghe bằng giọng máy nếu trình duyệt hỗ trợ.' : (data.reading || '');
    return `<div class="nihongo-card nihongo-kind-${data.kind}"><div class="nihongo-card-top"><span class="nihongo-chip">${data.title}</span><button class="nihongo-speak-btn" type="button" onclick="speakNihongo(decodeURIComponent('${escapeForClick(data.speakText)}'))">🔊</button></div><div class="nihongo-prompt">${data.prompt}</div><div class="nihongo-jp">${jp}</div><div class="nihongo-reading">${hint}</div></div>`;
}
function makeNihongoGame(gameId) {
    return {
        questionTimeSec: gameId.indexOf('mock_test') >= 0 ? 22 : 18,
        gridClass: 'nihongo-options-grid',
        generateData() { return buildNihongoQuestion(gameId); },
        renderDisplay(data) { setTimeout(() => { if (data && data.kind === 'listen') speakNihongo(data.speakText); }, 280); return renderNihongoDisplay(data); },
        getOptions(data) { return data.options || []; },
        styleOptionBtn(btn, value) { btn.textContent = value; btn.classList.add('nihongo-option-btn'); btn.setAttribute('aria-label', 'Đáp án ' + value); },
        getAudio() { return []; },
        checkResult(selected, data) { return String(selected) === String(data.correct); }
    };
}
const NIHONGO_GAME_IDS = [
    "nihongo_intro_kana",
    "nihongo_intro_katakana",
    "nihongo_intro_vocab",
    "nihongo_intro_listen",
    "nihongo_intro_quiz",
    "nihongo_n5_vocab_learn",
    "nihongo_n5_vocab_practice",
    "nihongo_n5_listening",
    "nihongo_n5_kanji",
    "nihongo_n5_grammar",
    "nihongo_n5_sentence",
    "nihongo_n5_mock_test",
    "nihongo_n4_vocab_learn",
    "nihongo_n4_vocab_practice",
    "nihongo_n4_listening",
    "nihongo_n4_kanji",
    "nihongo_n4_grammar",
    "nihongo_n4_sentence",
    "nihongo_n4_mock_test",
    "nihongo_n3_vocab_learn",
    "nihongo_n3_vocab_practice",
    "nihongo_n3_listening",
    "nihongo_n3_kanji",
    "nihongo_n3_grammar",
    "nihongo_n3_sentence",
    "nihongo_n3_mock_test",
    "nihongo_n2_vocab_learn",
    "nihongo_n2_vocab_practice",
    "nihongo_n2_listening",
    "nihongo_n2_kanji",
    "nihongo_n2_grammar",
    "nihongo_n2_sentence",
    "nihongo_n2_mock_test",
    "nihongo_n1_vocab_learn",
    "nihongo_n1_vocab_practice",
    "nihongo_n1_listening",
    "nihongo_n1_kanji",
    "nihongo_n1_grammar",
    "nihongo_n1_sentence",
    "nihongo_n1_mock_test"
];
NIHONGO_GAME_IDS.forEach(id => registerGame(id, makeNihongoGame(id)));
window.speakNihongo = speakNihongo;
