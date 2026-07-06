// js/asset.js
// =====================================================
// QUY ƯỚC TÀI NGUYÊN NIHONGO QUEST V1.1
// =====================================================
//
// Ảnh:            img/logo.png
// Âm thanh chung: audio/common/dingdong.mp3
//                 audio/common/chinh-xac.mp3
//                 audio/common/gioi-qua.mp3
//                 audio/common/sai-roi.mp3
// Âm thanh Nhật:  audio/nihongo/...
//
// App vẫn chạy được khi chưa có file mp3, vì bài Nihongo đang dùng
// giọng đọc tiếng Nhật của trình duyệt.
// =====================================================

const APP_PATH = {
    img: 'img/',
    audio: 'audio/'
};

function isFullPath(path) {
    if (!path) return false;
    return (/^(https?:)?\/\//.test(path) || path.startsWith('/') || path.startsWith('data:') || path.startsWith(APP_PATH.audio) || path.startsWith(APP_PATH.img));
}

function imgPath(fileName) {
    if (!fileName) return '';
    return isFullPath(fileName) ? fileName : APP_PATH.img + fileName;
}

function audioPath(fileName) {
    if (!fileName) return '';
    return isFullPath(fileName) ? fileName : APP_PATH.audio + fileName;
}

function gameAudioPath(folder, fileName) {
    if (!fileName) return '';
    if (isFullPath(fileName)) return fileName;
    if (fileName.startsWith(folder + '/')) return APP_PATH.audio + fileName;
    return APP_PATH.audio + folder + '/' + fileName;
}

const COMMON_AUDIO_FILE = {
    welcome: 'common/dingdong.mp3',
    correct: ['common/gioi-qua.mp3', 'common/chinh-xac.mp3'],
    wrong: 'common/sai-roi.mp3'
};

const COMMON_AUDIO_ALIAS = {
    'dingdong.mp3': 'welcome',
    'common/dingdong.mp3': 'welcome',
    'gioi qua.mp3': 'correct',
    'gioi-qua.mp3': 'correct',
    'common/gioi-qua.mp3': 'correct',
    'chinh xac.mp3': 'correct',
    'chinh-xac.mp3': 'correct',
    'common/chinh-xac.mp3': 'correct',
    'sai roi.mp3': 'wrong',
    'sai-roi.mp3': 'wrong',
    'common/sai-roi.mp3': 'wrong'
};

function commonAudioPath(keyOrFileName) {
    if (!keyOrFileName) return '';
    const key = COMMON_AUDIO_ALIAS[keyOrFileName] || keyOrFileName;
    const fileName = COMMON_AUDIO_FILE[key] || keyOrFileName;
    return audioPath(fileName);
}

function welcomeAudioPath() { return commonAudioPath('welcome'); }
function correctAudioPath() {
    const list = COMMON_AUDIO_FILE.correct;
    return audioPath(list[Math.floor(Math.random() * list.length)]);
}
function wrongAudioPath() { return commonAudioPath('wrong'); }
function nihongoAudioPath(fileName) { return gameAudioPath('nihongo', fileName); }
