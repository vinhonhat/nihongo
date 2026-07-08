// js/game-menu.js
// Menu thông minh cho Nihongo Quest V1.1.
// Chọn cấp học lần đầu, lần sau vào thẳng menu đã lưu.

const MENU_STORAGE_KEY_LEVEL = 'nihongo_selected_level';
const MENU_STORAGE_KEY_GROUP = 'nihongo_selected_skill_group';
const MENU_STORAGE_KEY_LESSON_PREFIX = 'nihongo_selected_lesson_';

const NIHONGO_LEVELS = {
    "n0": {
        "label": "Nhập môn",
        "icon": "🌸",
        "note": "Bảng chữ cái, phát âm, từ đầu tiên"
    },
    "n5": {
        "label": "N5",
        "icon": "🗻",
        "note": "Từ vựng, Kanji và ngữ pháp nền tảng"
    },
    "n4": {
        "label": "N4",
        "icon": "🍵",
        "note": "Tăng tốc đọc hiểu, nghe hiểu và ngữ pháp"
    },
    "n3": {
        "label": "N3",
        "icon": "🎌",
        "note": "Trung cấp: hội thoại, đọc hiểu, Kanji nhiều hơn"
    },
    "n2": {
        "label": "N2",
        "icon": "🏯",
        "note": "Nâng cao: bài đọc dài, sắc thái ngữ pháp"
    },
    "n1": {
        "label": "N1",
        "icon": "👑",
        "note": "Cao cấp: từ vựng học thuật, Kanji và đề khó"
    },
    "n6": {
        "label": "Chuyên ngành",
        "icon": "🏢",
        "note": "Từ vựng theo ngành nghề: IT, nhà máy, văn phòng, combini, đời sống"
    }
};
const GAME_GROUPS = [
    {
        "id": "vocab",
        "label": "Từ vựng",
        "icon": "📚"
    },
    {
        "id": "grammar",
        "label": "Ngữ pháp",
        "icon": "🧩"
    },
    {
        "id": "practice",
        "label": "Luyện",
        "icon": "🎯"
    }
];
const GAME_MENU_DATA = [
    {
        "id": "nihongo_n0_kana",
        "label": "Hiragana",
        "icon": "あ",
        "group": "vocab",
        "levels": [
            "n0"
        ],
        "color": "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
        "badge": "Nhập môn"
    },
    {
        "id": "nihongo_n0_katakana",
        "label": "Katakana",
        "icon": "ア",
        "group": "vocab",
        "levels": [
            "n0"
        ],
        "color": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "badge": "Nhập môn"
    },
    {
        "id": "nihongo_n0_vocab",
        "label": "Từ đầu tiên",
        "icon": "🍙",
        "group": "vocab",
        "levels": [
            "n0"
        ],
        "color": "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        "badge": "Nhập môn"
    },
    {
        "id": "nihongo_n0_kanji",
        "label": "Kanji nhập môn",
        "icon": "日",
        "group": "vocab",
        "levels": [
            "n0"
        ],
        "color": "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
        "badge": "Nhập môn"
    },
    {
        "id": "nihongo_n0_grammar",
        "label": "Mẫu câu nhập môn",
        "icon": "🧩",
        "group": "grammar",
        "levels": [
            "n0"
        ],
        "color": "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
        "badge": "Nhập môn"
    },
    {
        "id": "nihongo_n0_listen",
        "label": "Nghe nhập môn",
        "icon": "👂",
        "group": "practice",
        "levels": [
            "n0"
        ],
        "color": "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
        "badge": "Nghe"
    },
    {
        "id": "nihongo_n0_quiz",
        "label": "Kiểm tra nhập môn",
        "icon": "🌸",
        "group": "practice",
        "levels": [
            "n0"
        ],
        "color": "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
        "badge": "Mini"
    },
    {
        "id": "nihongo_n5_vocab_learn",
        "label": "Từ vựng N5",
        "icon": "📖",
        "group": "vocab",
        "levels": [
            "n5"
        ],
        "color": "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        "badge": "Học"
    },
    {
        "id": "nihongo_n5_kanji",
        "label": "Kanji N5",
        "icon": "漢",
        "group": "vocab",
        "levels": [
            "n5"
        ],
        "color": "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
        "badge": "Kanji"
    },
    {
        "id": "nihongo_n5_grammar",
        "label": "Ngữ pháp N5",
        "icon": "🧩",
        "group": "grammar",
        "levels": [
            "n5"
        ],
        "color": "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
        "badge": "NP"
    },
    {
        "id": "nihongo_n5_sentence",
        "label": "Mẫu câu N5",
        "icon": "💬",
        "group": "grammar",
        "levels": [
            "n5"
        ],
        "color": "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
        "badge": "Mẫu"
    },
    {
        "id": "nihongo_n5_vocab_practice",
        "label": "Luyện từ N5",
        "icon": "🎯",
        "group": "practice",
        "levels": [
            "n5"
        ],
        "color": "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
        "badge": "Luyện"
    },
    {
        "id": "nihongo_n5_listening",
        "label": "Luyện nghe N5",
        "icon": "👂",
        "group": "practice",
        "levels": [
            "n5"
        ],
        "color": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "badge": "Nghe"
    },

    {
        "id": "nihongo_n5_sentence_build",
        "label": "Ghép câu N5",
        "icon": "🧱",
        "group": "practice",
        "levels": [
            "n5"
        ],
        "color": "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
        "badge": "Ghép"
    },
    {
        "id": "nihongo_n5_mock_test",
        "label": "Thi thử JLPT N5",
        "icon": "📝",
        "group": "practice",
        "levels": [
            "n5"
        ],
        "color": "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        "badge": "Test"
    },
    {
        "id": "nihongo_n4_vocab_learn",
        "label": "Từ vựng N4",
        "icon": "📖",
        "group": "vocab",
        "levels": [
            "n4"
        ],
        "color": "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        "badge": "Học"
    },
    {
        "id": "nihongo_n4_kanji",
        "label": "Kanji N4",
        "icon": "漢",
        "group": "vocab",
        "levels": [
            "n4"
        ],
        "color": "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
        "badge": "Kanji"
    },
    {
        "id": "nihongo_n4_grammar",
        "label": "Ngữ pháp N4",
        "icon": "🧩",
        "group": "grammar",
        "levels": [
            "n4"
        ],
        "color": "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
        "badge": "NP"
    },
    {
        "id": "nihongo_n4_sentence",
        "label": "Mẫu câu N4",
        "icon": "💬",
        "group": "grammar",
        "levels": [
            "n4"
        ],
        "color": "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
        "badge": "Mẫu"
    },
    {
        "id": "nihongo_n4_vocab_practice",
        "label": "Luyện từ N4",
        "icon": "🎯",
        "group": "practice",
        "levels": [
            "n4"
        ],
        "color": "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
        "badge": "Luyện"
    },
    {
        "id": "nihongo_n4_listening",
        "label": "Luyện nghe N4",
        "icon": "👂",
        "group": "practice",
        "levels": [
            "n4"
        ],
        "color": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "badge": "Nghe"
    },
    {
        "id": "nihongo_n4_mock_test",
        "label": "Thi thử JLPT N4",
        "icon": "📝",
        "group": "practice",
        "levels": [
            "n4"
        ],
        "color": "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        "badge": "Test"
    },
    {
        "id": "nihongo_n3_vocab_learn",
        "label": "Từ vựng N3",
        "icon": "📖",
        "group": "vocab",
        "levels": [
            "n3"
        ],
        "color": "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        "badge": "Học"
    },
    {
        "id": "nihongo_n3_kanji",
        "label": "Kanji N3",
        "icon": "漢",
        "group": "vocab",
        "levels": [
            "n3"
        ],
        "color": "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
        "badge": "Kanji"
    },
    {
        "id": "nihongo_n3_grammar",
        "label": "Ngữ pháp N3",
        "icon": "🧩",
        "group": "grammar",
        "levels": [
            "n3"
        ],
        "color": "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
        "badge": "NP"
    },
    {
        "id": "nihongo_n3_sentence",
        "label": "Mẫu câu N3",
        "icon": "💬",
        "group": "grammar",
        "levels": [
            "n3"
        ],
        "color": "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
        "badge": "Mẫu"
    },
    {
        "id": "nihongo_n3_vocab_practice",
        "label": "Luyện từ N3",
        "icon": "🎯",
        "group": "practice",
        "levels": [
            "n3"
        ],
        "color": "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
        "badge": "Luyện"
    },
    {
        "id": "nihongo_n3_listening",
        "label": "Luyện nghe N3",
        "icon": "👂",
        "group": "practice",
        "levels": [
            "n3"
        ],
        "color": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "badge": "Nghe"
    },
    {
        "id": "nihongo_n3_mock_test",
        "label": "Thi thử JLPT N3",
        "icon": "📝",
        "group": "practice",
        "levels": [
            "n3"
        ],
        "color": "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        "badge": "Test"
    },
    {
        "id": "nihongo_n2_vocab_learn",
        "label": "Từ vựng N2",
        "icon": "📖",
        "group": "vocab",
        "levels": [
            "n2"
        ],
        "color": "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        "badge": "Học"
    },
    {
        "id": "nihongo_n2_kanji",
        "label": "Kanji N2",
        "icon": "漢",
        "group": "vocab",
        "levels": [
            "n2"
        ],
        "color": "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
        "badge": "Kanji"
    },
    {
        "id": "nihongo_n2_grammar",
        "label": "Ngữ pháp N2",
        "icon": "🧩",
        "group": "grammar",
        "levels": [
            "n2"
        ],
        "color": "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
        "badge": "NP"
    },
    {
        "id": "nihongo_n2_sentence",
        "label": "Mẫu câu N2",
        "icon": "💬",
        "group": "grammar",
        "levels": [
            "n2"
        ],
        "color": "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
        "badge": "Mẫu"
    },
    {
        "id": "nihongo_n2_vocab_practice",
        "label": "Luyện từ N2",
        "icon": "🎯",
        "group": "practice",
        "levels": [
            "n2"
        ],
        "color": "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
        "badge": "Luyện"
    },
    {
        "id": "nihongo_n2_listening",
        "label": "Luyện nghe N2",
        "icon": "👂",
        "group": "practice",
        "levels": [
            "n2"
        ],
        "color": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "badge": "Nghe"
    },
    {
        "id": "nihongo_n2_mock_test",
        "label": "Thi thử JLPT N2",
        "icon": "📝",
        "group": "practice",
        "levels": [
            "n2"
        ],
        "color": "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        "badge": "Test"
    },
    {
        "id": "nihongo_n1_vocab_learn",
        "label": "Từ vựng N1",
        "icon": "📖",
        "group": "vocab",
        "levels": [
            "n1"
        ],
        "color": "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        "badge": "Học"
    },
    {
        "id": "nihongo_n1_kanji",
        "label": "Kanji N1",
        "icon": "漢",
        "group": "vocab",
        "levels": [
            "n1"
        ],
        "color": "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
        "badge": "Kanji"
    },
    {
        "id": "nihongo_n1_grammar",
        "label": "Ngữ pháp N1",
        "icon": "🧩",
        "group": "grammar",
        "levels": [
            "n1"
        ],
        "color": "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
        "badge": "NP"
    },
    {
        "id": "nihongo_n1_sentence",
        "label": "Mẫu câu N1",
        "icon": "💬",
        "group": "grammar",
        "levels": [
            "n1"
        ],
        "color": "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
        "badge": "Mẫu"
    },
    {
        "id": "nihongo_n1_vocab_practice",
        "label": "Luyện từ N1",
        "icon": "🎯",
        "group": "practice",
        "levels": [
            "n1"
        ],
        "color": "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
        "badge": "Luyện"
    },
    {
        "id": "nihongo_n1_listening",
        "label": "Luyện nghe N1",
        "icon": "👂",
        "group": "practice",
        "levels": [
            "n1"
        ],
        "color": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "badge": "Nghe"
    },
    {
        "id": "nihongo_n1_mock_test",
        "label": "Thi thử JLPT N1",
        "icon": "📝",
        "group": "practice",
        "levels": [
            "n1"
        ],
        "color": "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        "badge": "Test"
    }
,
    {
        "id": "nihongo_n6_vocab_learn",
        "label": "Từ vựng chuyên ngành",
        "icon": "🏢",
        "group": "vocab",
        "levels": [
            "n6"
        ],
        "color": "linear-gradient(135deg, #22c1c3 0%, #fdbb2d 100%)",
        "badge": "専門"
    }

 ];

// V1.2.5: phần học Ngữ pháp và Mẫu câu đang dùng cùng dữ liệu,
// nên ẩn nút Mẫu câu ở màn học để tránh trùng. Ghép câu vẫn nằm trong mục Luyện.
GAME_MENU_DATA.forEach(item => {
    if (/^nihongo_n[1-5]_sentence$/.test(item.id)) {
        item.testOnly = true;
    }
});

['n0', 'n5', 'n4', 'n3', 'n2', 'n1'].forEach(level => {
    const label = level === 'n0' ? 'nhập môn' : level.toUpperCase();
    GAME_MENU_DATA.push({
        id: `nihongo_${level}_kanji_practice`,
        label: `Luyện Kanji ${label}`,
        icon: '漢',
        group: 'practice',
        levels: [level],
        color: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
        badge: 'Luyện'
    });
    GAME_MENU_DATA.push({
        id: `nihongo_${level}_grammar_practice`,
        label: `Luyện ngữ pháp ${label}`,
        icon: '🧩',
        group: 'practice',
        levels: [level],
        color: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        badge: 'Luyện'
    });
});

function safeGetStorage(key, fallback = '') {
    try { return localStorage.getItem(key) || fallback; } catch (e) { return fallback; }
}
function safeSetStorage(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
}
function safeSessionSet(key, value) {
    try { sessionStorage.setItem(key, value); } catch (e) {}
}
function safeSessionRemove(key) {
    try { sessionStorage.removeItem(key); } catch (e) {}
}
function clearNihongoMenuSearchSession() {
    safeSessionRemove('nihongo_search_query');
    safeSessionRemove('nihongo_search_scope');
}

function getSpecializedLessonsForMenu() {
    const fields = Array.isArray(window.NIHONGO_SPECIALIZED_FIELDS) ? window.NIHONGO_SPECIALIZED_FIELDS : [];
    const data = window.NIHONGO_SPECIALIZED_DATA || {};
    return fields
        .filter(field => field && field.id)
        .map(field => {
            const count = Array.isArray(data[field.id]) ? data[field.id].length : 0;
            return {
                id: field.id,
                label: `${field.icon || '🏢'} ${field.label || field.id}`,
                title: field.label || field.id,
                vocabCount: count
            };
        });
}
function nihongoMenuEscape(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
function getCurrentNihongoLevel() {
    let level = safeGetStorage(MENU_STORAGE_KEY_LEVEL, '');
    if (level === 'intro') { level = 'n0'; safeSetStorage(MENU_STORAGE_KEY_LEVEL, 'n0'); }
    return NIHONGO_LEVELS[level] ? level : '';
}
function getLevelGames(level) {
    return GAME_MENU_DATA.filter(game => !game.testOnly && Array.isArray(game.levels) && game.levels.includes(level));
}
function getAvailableGroups(level) {
    const games = getLevelGames(level);
    return GAME_GROUPS.filter(group => games.some(game => game.group === group.id));
}
function getCurrentGroup(level) {
    const groups = getAvailableGroups(level);
    if (!groups.length) return '';
    const saved = safeGetStorage(MENU_STORAGE_KEY_GROUP, groups[0].id);
    if (groups.some(group => group.id === saved)) return saved;
    safeSetStorage(MENU_STORAGE_KEY_GROUP, groups[0].id);
    return groups[0].id;
}

function getLessonsForLevel(level) {
    if (level === 'n6') return getSpecializedLessonsForMenu();
    const data = window.NIHONGO_DATA && window.NIHONGO_DATA[level];
    const meta = data && Array.isArray(data.lessonsMeta) ? data.lessonsMeta : [];
    return meta.filter(item => item && item.id);
}
function getCurrentLesson(level) {
    const lessons = getLessonsForLevel(level);
    if (!lessons.length) return 'all';
    const key = MENU_STORAGE_KEY_LESSON_PREFIX + level;
    const saved = safeGetStorage(key, 'all');
    if (saved === 'all' || lessons.some(item => item.id === saved)) return saved;
    safeSetStorage(key, 'all');
    return 'all';
}
function renderLessonSelector(level) {
    const lessons = getLessonsForLevel(level);
    if (!lessons.length) return '';
    const current = getCurrentLesson(level);
    const levelLabel = (NIHONGO_LEVELS[level] && NIHONGO_LEVELS[level].label) || level.toUpperCase();
    const selectorLabel = level === 'n6' ? 'Chuyên ngành:' : 'Bài:';
    const allLabel = level === 'n6' ? '🏢 Tất cả chuyên ngành' : `📚 Toàn bộ ${levelLabel}`;
    const options = [
        `<option value="all" ${current === 'all' ? 'selected' : ''}>${allLabel}</option>`
    ].concat(lessons.map(item => {
        const count = Number(item.vocabCount || 0);
        const countText = count ? ` - ${count} từ` : ' - trống';
        return `<option value="${item.id}" ${item.id === current ? 'selected' : ''}>${item.label || item.title || item.id}${countText}</option>`;
    })).join('');

    return `<div class="smart-level-line smart-lesson-line"><span>${selectorLabel}</span><select class="smart-level-select smart-lesson-select" onchange="selectNihongoLesson(this.value)">${options}</select></div>`;
}
function selectNihongoLesson(lessonId) {
    const level = getCurrentNihongoLevel();
    if (!level) return;
    safeSetStorage(MENU_STORAGE_KEY_LESSON_PREFIX + level, lessonId || 'all');
    renderGameMenu();
}
function renderGameMenu() {
    const root = document.getElementById('smart-menu-root');
    if (!root) return;
    const level = getCurrentNihongoLevel();
    if (!level) return renderLevelSelectScreen(root);
    renderMainGameMenu(root, level);
}

let adminGearTestTimer = null;
let adminGearActionDone = false;
let adminGearClickCount = 0;
let adminGearClickResetTimer = null;
let adminGearSuppressNextClick = false;
const ADMIN_GEAR_RESET_CLICK_COUNT = 10;

function renderAdminGearButton() {
    return `
        <button class="admin-gear-btn" type="button" aria-label="Cài đặt"
            title="Nhấn thả: mở Cài đặt. Giữ 1 giây: mở Test. Nhấn nhanh 10 lần: xoá cài đặt."
            onpointerdown="startAdminGearHold(event)"
            onpointerup="endAdminGearHold(event)"
            onpointercancel="cancelAdminGearHold(event)"
            onpointerleave="cancelAdminGearHold(event)"
            onclick="handleAdminGearTap(event)">⚙</button>`;
}

function startAdminGearHold(event) {
    // Không preventDefault ở pointerdown để iPhone/Safari vẫn phát sinh click sau khi thả tay.
    if (event) event.stopPropagation();
    cancelAdminGearHold(event);
    adminGearActionDone = false;
    adminGearSuppressNextClick = false;

    const btn = event && event.currentTarget ? event.currentTarget : null;
    if (btn) btn.classList.add('admin-gear-holding');

    adminGearTestTimer = setTimeout(() => {
        adminGearTestTimer = null;
        adminGearActionDone = true;
        adminGearSuppressNextClick = true;
        if (btn) btn.classList.remove('admin-gear-holding');
        openAdminTestMenu();

        // Nếu trình duyệt không bắn click sau long-press thì vẫn tự mở khoá lại.
        setTimeout(() => {
            adminGearActionDone = false;
            adminGearSuppressNextClick = false;
        }, 700);
    }, 1000);
}

function endAdminGearHold(event) {
    // Thả tay chỉ huỷ timer giữ. Nhấn-thả nhanh sẽ xử lý bằng onclick để ổn định trên iPhone.
    if (event) event.stopPropagation();
    const btn = event && event.currentTarget ? event.currentTarget : null;
    if (btn) btn.classList.remove('admin-gear-holding');

    if (adminGearTestTimer) {
        clearTimeout(adminGearTestTimer);
        adminGearTestTimer = null;
    }
}

function cancelAdminGearHold(event) {
    if (adminGearTestTimer) {
        clearTimeout(adminGearTestTimer);
        adminGearTestTimer = null;
    }
    const btn = event && event.currentTarget ? event.currentTarget : null;
    if (btn) btn.classList.remove('admin-gear-holding');
}

function handleAdminGearTap(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }

    // Sau khi giữ 1 giây mở Test, Safari vẫn có thể bắn thêm click. Bỏ click đó.
    if (adminGearSuppressNextClick || adminGearActionDone) {
        adminGearSuppressNextClick = false;
        adminGearActionDone = false;
        return;
    }

    handleAdminGearClick(event);
}

function handleAdminGearClick(event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }

    adminGearClickCount += 1;
    if (adminGearClickResetTimer) clearTimeout(adminGearClickResetTimer);

    // Nhấn nhanh 10 lần trong 3 giây vẫn giữ chức năng reset cũ.
    if (adminGearClickCount >= ADMIN_GEAR_RESET_CLICK_COUNT) {
        adminGearClickCount = 0;
        adminGearClickResetTimer = null;
        closeAdminTestMenu();
        resetNihongoMenuFromGear();
        return;
    }

    // Chờ rất ngắn để phân biệt 1 nhấn mở Cài đặt và 10 nhấn reset.
    adminGearClickResetTimer = setTimeout(() => {
        adminGearClickCount = 0;
        adminGearClickResetTimer = null;
        if (typeof openNihongoSettings === 'function') {
            openNihongoSettings();
        } else {
            console.warn('openNihongoSettings chưa sẵn sàng');
            alert('Cài đặt chưa sẵn sàng. Hãy tải lại trang một lần.');
        }
    }, 220);
}

function resetNihongoMenuFromGear() {
    cancelAdminGearHold();
    const ok = confirm('Xoá cài đặt hiện tại và quay lại chọn cấp học từ đầu?\n\nThao tác này sẽ xoá lựa chọn cấp học, nhóm học và dữ liệu tạm trong app.');
    if (!ok) { adminGearActionDone = false; return; }
    try { localStorage.clear(); sessionStorage.clear(); } catch (err) { console.warn('Không xoá được storage:', err); }
    closeAdminTestMenu();
    const root = document.getElementById('smart-menu-root');
    if (root) renderLevelSelectScreen(root); else renderGameMenu();
}
function renderLevelSelectScreen(root) {
    const cards = Object.entries(NIHONGO_LEVELS).map(([levelId, level]) => `
        <button class="level-card level-card-${levelId}" type="button" onclick="selectNihongoLevel('${levelId}')">
            <span class="level-card-icon">${level.icon}</span>
            <span class="level-card-label">${level.label}</span>
            <span class="level-card-note">${level.note}</span>
        </button>`).join('');
    root.innerHTML = `
        <section class="level-select-screen nihongo-select-screen">
            <div class="nihongo-splash-mark">日本語</div>
            <h1 class="app-title smart-title">Học tiếng Nhật</h1>
            <p class="smart-subtitle">Chọn cấp độ trước. Lần sau app sẽ vào thẳng menu cấp đã chọn.</p>
            <div class="level-card-grid">${cards}</div>
            <div class="admin-gear-zone">${renderAdminGearButton()}</div>
        </section>`;
}
function renderNihongoMenuSearchPanel(level) {
    const levelInfo = NIHONGO_LEVELS[level] || { label: level.toUpperCase(), icon: '🔎' };
    const levelOptions = Object.entries(NIHONGO_LEVELS)
        .filter(([levelId]) => levelId !== level)
        .map(([levelId, item]) => `<option value="${levelId}">${item.icon} ${item.label}</option>`)
        .join('');

    return `
        <div class="nihongo-menu-search">
            <div class="nihongo-menu-search-title">🔎 Tra cứu nhanh</div>
            <div class="nihongo-menu-search-row">
                <input id="nihongo-menu-search-input" class="nihongo-menu-search-input"
                    type="search" autocomplete="off"
                    placeholder="Tìm từ / kanji / ngữ pháp trong ${nihongoMenuEscape(levelInfo.label)}..."
                    onkeydown="if(event.key==='Enter') startNihongoMenuSearch()">
                <select id="nihongo-menu-search-scope" class="nihongo-menu-search-scope">
                    <option value="${level}" selected>${levelInfo.icon} ${nihongoMenuEscape(levelInfo.label)}</option>
                    <option value="all">🌐 Toàn bộ</option>
                    ${levelOptions}
                </select>
                <button class="nihongo-menu-search-btn" type="button" onclick="startNihongoMenuSearch()">Tìm</button>
                <button class="contribute-vocab-btn" type="button" onclick="openNihongoContributionModal()">
                    ➕ Góp từ
                </button>
            </div>
            <div class="nihongo-menu-search-note">Mặc định tìm trong cấp đang chọn. Nếu chọn Chuyên ngành, phạm vi sẽ theo chuyên ngành đang chọn. Chọn “Toàn bộ” để tìm cả bài học và chuyên ngành.</div>
        </div>`;
}


function startNihongoMenuSearch() {
    const level = getCurrentNihongoLevel() || 'n5';
    const input = document.getElementById('nihongo-menu-search-input');
    const select = document.getElementById('nihongo-menu-search-scope');
    const query = input ? input.value.trim() : '';
    const scope = select ? (select.value || level) : level;

    safeSessionSet('nihongo_search_query', query);
    safeSessionSet('nihongo_search_scope', scope);

    const startLevel = scope === 'all' ? level : scope;
    startGameFromSmartMenu(`nihongo_${startLevel}_search`);
}

function renderMainGameMenu(root, level) {
    const levelInfo = NIHONGO_LEVELS[level];
    const groups = getAvailableGroups(level);
    const currentGroup = getCurrentGroup(level);
    const games = getLevelGames(level).filter(game => game.group === currentGroup);
    const levelOptions = Object.entries(NIHONGO_LEVELS).map(([levelId, item]) => `<option value="${levelId}" ${levelId === level ? 'selected' : ''}>${item.icon} ${item.label}</option>`).join('');
    const lessonSelector = renderLessonSelector(level);
    const groupTabs = groups.map(group => `
        <button class="menu-group-tab ${group.id === currentGroup ? 'active' : ''}" type="button" onclick="setGameMenuGroup('${group.id}')">
            <span>${group.icon}</span><span>${group.label}</span>
        </button>`).join('');
    root.innerHTML = `
        <section class="smart-menu-screen nihongo-menu-screen">
            <div class="smart-menu-header">
                <div>
                    <div class="nihongo-mini-title">Nihongo Quest</div>
                    <h1 class="smart-menu-title">Chọn bài học</h1>
                    <div class="smart-level-line"><span>Cấp độ:</span><select class="smart-level-select" onchange="selectNihongoLevel(this.value)">${levelOptions}</select></div>
                    ${lessonSelector}
                    <div class="nihongo-level-note">${levelInfo.note}</div>
                </div>
                <div class="smart-level-badge" title="${levelInfo.note}"><span>${levelInfo.icon}</span></div>
            </div>
            ${renderNihongoMenuSearchPanel(level)}
            <div class="menu-group-tabs">${groupTabs}</div>
            <div class="smart-game-grid">${games.map(renderMenuGameButton).join('')}</div>
            <div class="smart-menu-footer">${renderAdminGearButton()}</div>
        </section>`;
}
function renderMenuGameButton(game) {
    const badge = game.badge ? `<span class="${game.badge === 'New' ? 'menu-new-app' : 'menu-version'}">${game.badge}</span>` : '';
    return `<button class="menu-btn smart-game-btn btn-${game.id}" type="button" onclick="startGameFromSmartMenu('${game.id}')" style="background: ${game.color};">${badge}<div class="menu-icon">${game.icon}</div><div class="menu-label">${game.label}</div></button>`;
}
function selectNihongoLevel(levelId) {
    if (!NIHONGO_LEVELS[levelId]) return;
    safeSetStorage(MENU_STORAGE_KEY_LEVEL, levelId);
    const groups = getAvailableGroups(levelId);
    if (groups.length) safeSetStorage(MENU_STORAGE_KEY_GROUP, groups[0].id);
    renderGameMenu();
}
function setGameMenuGroup(groupId) { safeSetStorage(MENU_STORAGE_KEY_GROUP, groupId); renderGameMenu(); }
function startGameFromSmartMenu(gameId) {
    if (typeof startGame !== 'function') { console.warn('startGame chưa sẵn sàng:', gameId); return; }

    // Từ khoá tra cứu ngoài menu chỉ dùng một lần cho màn Tra cứu.
    // Khi vào Từ vựng/Kanji/Ngữ pháp/Luyện khác thì không giữ lại từ khoá cũ.
    if (!/_search$/.test(String(gameId || ''))) {
        clearNihongoMenuSearchSession();
    }

    startGame(gameId);
}
function openAdminTestMenu() {
    const root = document.getElementById('smart-menu-root');
    if (!root) return;
    const old = document.getElementById('admin-test-overlay');
    if (old) old.remove();
    const overlay = document.createElement('div');
    overlay.id = 'admin-test-overlay';
    overlay.className = 'admin-test-overlay';
    overlay.innerHTML = `<div class="admin-test-box"><div class="admin-test-head"><div><div class="admin-test-title">⚙ Quản trị / Test</div><div class="admin-test-note">Hiện toàn bộ bài học để test nhanh khi sửa code.</div></div><button class="admin-test-close" type="button" onclick="closeAdminTestMenu()">✕</button></div><div class="admin-test-grid">${GAME_MENU_DATA.slice().map(renderMenuGameButton).join('')}</div></div>`;
    root.appendChild(overlay);
}
function closeAdminTestMenu() { const overlay = document.getElementById('admin-test-overlay'); if (overlay) overlay.remove(); }

window.renderGameMenu = renderGameMenu;
window.selectNihongoLevel = selectNihongoLevel;
window.setGameMenuGroup = setGameMenuGroup;
window.selectNihongoLesson = selectNihongoLesson;
window.startNihongoMenuSearch = startNihongoMenuSearch;
window.clearNihongoMenuSearchSession = clearNihongoMenuSearchSession;
window.startGameFromSmartMenu = startGameFromSmartMenu;
window.openAdminTestMenu = openAdminTestMenu;
window.closeAdminTestMenu = closeAdminTestMenu;
window.renderAdminGearButton = renderAdminGearButton;
window.startAdminGearHold = startAdminGearHold;
window.endAdminGearHold = endAdminGearHold;
window.cancelAdminGearHold = cancelAdminGearHold;
window.handleAdminGearClick = handleAdminGearClick;
window.resetNihongoMenuFromGear = resetNihongoMenuFromGear;
window.addEventListener('DOMContentLoaded', renderGameMenu);

// =====================================================
// ĐÓNG GÓP TỪ VỰNG
// Giao diện tự dựng trong app, gửi dữ liệu vào Google Form.
// Sau khi tạo Google Form, chỉ cần thay FORM_ID và entry.xxxxx ở dưới.
// =====================================================

const NIHONGO_CONTRIBUTION_DRAFT_KEY = 'nihongo_contribution_draft_v1';

const NIHONGO_GOOGLE_FORM_ACTION_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSffnXgE3631cwQsmamJcOVoRKHGoln80GtCmOFgAfyrdzFCzg/formResponse';

const NIHONGO_GOOGLE_FORM_ENTRIES = {
    word: 'entry.259303754',
    kana: 'entry.1237546725',
    romaji: 'entry.1286687669',
    meaning: 'entry.1018924359',
    meaningEn: 'entry.2078562331',
    field: 'entry.573125806',
    tags: 'entry.365752317',
    exampleJp: 'entry.345809715',
    exampleVi: 'entry.2094837595',
    note: 'entry.1392596545',
    contributor: 'entry.632020508',
    source: 'entry.52638904'
};

// field là select chọn chuyên ngành, không tính là nội dung nháp.
// Nếu chỉ mở form rồi đóng, app sẽ không hỏi lưu nháp nữa.
const NIHONGO_CONTRIBUTION_TEXT_FIELDS = [
    'word',
    'kana',
    'romaji',
    'meaning',
    'meaningEn',
    'tags',
    'exampleJp',
    'exampleVi',
    'note',
    'contributor',
    'source'
];

function isNihongoGoogleFormConfigured() {
    if (!NIHONGO_GOOGLE_FORM_ACTION_URL || NIHONGO_GOOGLE_FORM_ACTION_URL.includes('FORM_ID')) {
        return false;
    }

    return Object.values(NIHONGO_GOOGLE_FORM_ENTRIES).every(entry => {
        return /^entry\.\d+$/.test(String(entry || ''));
    });
}


function getNihongoContributionFieldOptionsHtml() {
    const fields = Array.isArray(window.NIHONGO_SPECIALIZED_FIELDS)
        ? window.NIHONGO_SPECIALIZED_FIELDS
        : [];

    const fallbackFields = [
        { id: 'it', label: 'IT / Máy tính', icon: '💻' },
        { id: 'factory', label: 'Nhà máy / Sản xuất', icon: '🏭' },
        { id: 'office', label: 'Văn phòng / Kế toán', icon: '🧾' },
        { id: 'combini', label: 'Combini / Bán hàng', icon: '🏪' },
        { id: 'daily', label: 'Đời sống', icon: '🏠' }
    ];

    const sourceFields = fields.length ? fields : fallbackFields;
    const seen = new Set();

    return sourceFields
        .filter(field => field && (field.label || field.id))
        .map(field => {
            const label = String(field.label || field.id || '').trim();
            const icon = String(field.icon || '🏢').trim();
            const value = `${icon} ${label}`.trim();
            const key = value.toLowerCase();

            if (!label || seen.has(key)) return '';
            seen.add(key);

            return `<option value="${nihongoMenuEscape(value)}"></option>`;
        })
        .join('');
}

function getNihongoContributionFormValues(form) {
    const data = new FormData(form);
    return {
        word: data.get('word') || '',
        kana: data.get('kana') || '',
        romaji: data.get('romaji') || '',
        meaning: data.get('meaning') || '',
        meaningEn: data.get('meaningEn') || '',
        field: data.get('field') || '',
        tags: data.get('tags') || '',
        exampleJp: data.get('exampleJp') || '',
        exampleVi: data.get('exampleVi') || '',
        note: data.get('note') || '',
        contributor: data.get('contributor') || '',
        source: data.get('source') || ''
    };
}

function isNihongoContributionDraftEmpty(values) {
    if (!values) return true;

    return NIHONGO_CONTRIBUTION_TEXT_FIELDS.every(key => {
        return !String(values[key] || '').trim();
    });
}

function saveNihongoContributionDraft(form) {
    if (!form) return;

    const values = getNihongoContributionFormValues(form);

    if (isNihongoContributionDraftEmpty(values)) {
        clearNihongoContributionDraft();
        return;
    }

    try {
        localStorage.setItem(NIHONGO_CONTRIBUTION_DRAFT_KEY, JSON.stringify({
            savedAt: Date.now(),
            values
        }));
    } catch (err) {
        console.warn('Không lưu được nháp đóng góp:', err);
    }
}

function loadNihongoContributionDraft(form) {
    if (!form) return false;

    let draft = null;

    try {
        draft = JSON.parse(localStorage.getItem(NIHONGO_CONTRIBUTION_DRAFT_KEY) || 'null');
    } catch (err) {
        draft = null;
    }

    if (!draft || !draft.values) return false;
    if (isNihongoContributionDraftEmpty(draft.values)) return false;

    Object.entries(draft.values).forEach(([key, value]) => {
        const field = form.elements[key];
        if (field) field.value = value;
    });

    return true;
}

function clearNihongoContributionDraft() {
    try {
        localStorage.removeItem(NIHONGO_CONTRIBUTION_DRAFT_KEY);
    } catch (err) {
        console.warn('Không xoá được nháp đóng góp:', err);
    }
}

function hasNihongoContributionDraft() {
    let draft = null;

    try {
        draft = JSON.parse(localStorage.getItem(NIHONGO_CONTRIBUTION_DRAFT_KEY) || 'null');
    } catch (err) {
        draft = null;
    }

    return !!(draft && draft.values && !isNihongoContributionDraftEmpty(draft.values));
}

function openNihongoContributionModal() {
    const old = document.getElementById('nihongo-contribution-modal');
    if (old) old.remove();

    const modal = document.createElement('div');
    modal.id = 'nihongo-contribution-modal';
    modal.className = 'nihongo-contribution-modal';

    modal.innerHTML = `
        <div class="contribution-box">
            <div class="contribution-head">
                <div>
                    <div class="contribution-mini">Nihongo Quest</div>
                    <h2>Đóng góp từ vựng</h2>
                    <p>Gửi từ mới để mình kiểm tra và thêm vào dữ liệu học.</p>
                    <p style="margin:6px 0 0;color:#d93025;font-weight:950;font-size:.84rem;">＊ Các mục màu đỏ là bắt buộc</p>
                </div>
                <button type="button" class="contribution-close" onclick="closeNihongoContributionModal()">×</button>
            </div>

            <form id="nihongo-contribution-form" class="contribution-form">
                <label style="color:#d93025;font-weight:950;">Từ tiếng Nhật <span aria-hidden="true">＊</span> <span style="font-size:.78rem;">bắt buộc</span></label>
                <input name="word" required placeholder="例: 見積書">

                <label style="color:#d93025;font-weight:950;">Cách đọc kana <span aria-hidden="true">＊</span> <span style="font-size:.78rem;">bắt buộc</span></label>
                <input name="kana" required placeholder="例: みつもりしょ">

                <label style="color:#d93025;font-weight:950;">Romaji <span aria-hidden="true">＊</span> <span style="font-size:.78rem;">bắt buộc</span></label>
                <input name="romaji" required placeholder="例: mitsumorisho">

                <label style="color:#d93025;font-weight:950;">Nghĩa tiếng Việt <span aria-hidden="true">＊</span> <span style="font-size:.78rem;">bắt buộc</span></label>
                <input name="meaning" required placeholder="例: bảng báo giá">

                <label>Nghĩa tiếng Anh</label>
                <input name="meaningEn" placeholder="例: quotation">

                <label style="color:#d93025;font-weight:950;">Chuyên ngành <span aria-hidden="true">＊</span> <span style="font-size:.78rem;">bắt buộc</span></label>
                <input name="field" list="nihongo-contribution-field-list" required placeholder="Chọn sẵn hoặc tự nhập chuyên ngành">
                <datalist id="nihongo-contribution-field-list">
                    ${getNihongoContributionFieldOptionsHtml()}
                </datalist>
                <div class="contribution-help">Có thể chọn ngành có sẵn hoặc tự gõ ngành mới.</div>

                <label>Từ khóa liên quan (dùng tìm kiếm) </label>
                <input name="tags" placeholder="例: báo giá, văn phòng, kế toán">

                <label>Ví dụ tiếng Nhật</label>
                <textarea name="exampleJp" rows="2" placeholder="例: 見積書を送ってください。"></textarea>

                <label>Dịch ví dụ</label>
                <textarea name="exampleVi" rows="2" placeholder="例: Vui lòng gửi bảng báo giá."></textarea>

                <label>Ghi chú</label>
                <textarea name="note" rows="2" placeholder="Từ này dùng trong tình huống nào?"></textarea>

                <label>Tên người đóng góp</label>
                <input name="contributor" placeholder="Tên hoặc biệt danh">

                <label>Nguồn tham khảo</label>
                <input name="source" placeholder="Từ điển, website, sách, kinh nghiệm...">

                <button type="submit" class="contribution-submit">Gửi đóng góp</button>
                <div id="contribution-status" class="contribution-status"></div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    const form = document.getElementById('nihongo-contribution-form');

    if (hasNihongoContributionDraft()) {
        const resume = confirm('Bạn có bản đóng góp đang nhập dở.\n\nBấm OK để tiếp tục.\nBấm Huỷ để tạo đóng góp mới.');

        if (resume) {
            loadNihongoContributionDraft(form);
        } else {
            clearNihongoContributionDraft();
        }
    }

    form.addEventListener('input', () => {
        saveNihongoContributionDraft(form);
    });

    form.addEventListener('change', () => {
        saveNihongoContributionDraft(form);
    });

    form.addEventListener('submit', submitNihongoContribution);
}

function closeNihongoContributionModal() {
    const modal = document.getElementById('nihongo-contribution-modal');
    const form = document.getElementById('nihongo-contribution-form');

    if (form) {
        const values = getNihongoContributionFormValues(form);

        if (!isNihongoContributionDraftEmpty(values)) {
            const keep = confirm('Bạn chưa gửi đóng góp.\n\nBấm OK để lưu tạm.\nBấm Huỷ để xoá bản nháp.');

            if (keep) {
                saveNihongoContributionDraft(form);
            } else {
                clearNihongoContributionDraft();
            }
        }
    }

    if (modal) modal.remove();
}

async function submitNihongoContribution(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const status = document.getElementById('contribution-status');
    const submitBtn = form.querySelector('.contribution-submit');

    if (!isNihongoGoogleFormConfigured()) {
        if (status) {
            status.textContent = 'Chưa cấu hình Google Form. Hãy thay FORM_ID và entry.xxxxx trong js/game-menu.js.';
            status.className = 'contribution-status error';
        }
        return;
    }

    const data = new FormData(form);
    const body = new FormData();

    Object.entries(NIHONGO_GOOGLE_FORM_ENTRIES).forEach(([key, entryName]) => {
        body.append(entryName, data.get(key) || '');
    });

    if (submitBtn) submitBtn.disabled = true;

    if (status) {
        status.textContent = 'Đang gửi đóng góp...';
        status.className = 'contribution-status sending';
    }

    try {
        await fetch(NIHONGO_GOOGLE_FORM_ACTION_URL, {
            method: 'POST',
            mode: 'no-cors',
            body
        });

        clearNihongoContributionDraft();

        if (status) {
            status.textContent = 'Đã gửi. Cảm ơn bạn đã đóng góp!';
            status.className = 'contribution-status success';
        }

        form.reset();

        setTimeout(() => {
            document.getElementById('nihongo-contribution-modal')?.remove();
        }, 1200);
    } catch (error) {
        console.error(error);

        if (status) {
            status.textContent = 'Không gửi được. Vui lòng thử lại sau.';
            status.className = 'contribution-status error';
        }

        if (submitBtn) submitBtn.disabled = false;
    }
}

window.openNihongoContributionModal = openNihongoContributionModal;
window.closeNihongoContributionModal = closeNihongoContributionModal;

// =====================================================
// FORM LIÊN HỆ / GÓP Ý
// Dùng Google Form riêng, không dùng chung form đóng góp từ vựng.
// Bắt buộc: Tên + Nội dung
// Không bắt buộc: Email + Số điện thoại
// =====================================================

const NIHONGO_CONTACT_FORM_ACTION_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLSfDzGLYdghN2V2GUPqsvbWGLSpEz6f13q4sfx1iP6jm-sj9HQ/formResponse';

const NIHONGO_CONTACT_FORM_ENTRIES = {
    name: 'entry.1323201463',
    email: 'entry.1987269523',
    phone: 'entry.1867146734',
    message: 'entry.720126449'
};

function openNihongoContactModal() {
    const old = document.getElementById('nihongo-contact-modal');
    if (old) old.remove();

    const modal = document.createElement('div');
    modal.id = 'nihongo-contact-modal';
    modal.className = 'nihongo-contribution-modal';

    modal.innerHTML = `
        <div class="contribution-box">
            <div class="contribution-head">
                <div>
                    <div class="contribution-mini">Nihongo Quest</div>
                    <h2>Liên hệ / Góp ý</h2>
                    <p>Gửi góp ý, báo lỗi hoặc nội dung cần liên hệ.</p>
                    <p style="margin-top:6px;color:#d93025;font-weight:900;font-size:.86rem;">
                        ＊ Các mục màu đỏ là bắt buộc
                    </p>
                </div>
                <button type="button" class="contribution-close" onclick="closeNihongoContactModal()">×</button>
            </div>

            <form id="nihongo-contact-form" class="contribution-form">
                <label style="color:#d93025;font-weight:950;">
                    Tên của bạn <span aria-hidden="true">＊</span>
                    <span style="font-size:.78rem;">bắt buộc</span>
                </label>
                <input name="name" required placeholder="Ví dụ: Quang Vinh">

                <label>Email</label>
                <input name="email" type="email" placeholder="Ví dụ: abc@gmail.com">

                <label>Số điện thoại</label>
                <input name="phone" type="tel" placeholder="Ví dụ: 090xxxxxxx">

                <label style="color:#d93025;font-weight:950;">
                    Nội dung góp ý / liên hệ <span aria-hidden="true">＊</span>
                    <span style="font-size:.78rem;">bắt buộc</span>
                </label>
                <textarea name="message" rows="5" required placeholder="Nhập nội dung góp ý, báo lỗi hoặc lời nhắn..."></textarea>

                <button type="submit" class="contribution-submit">Gửi liên hệ</button>
                <div id="contact-status" class="contribution-status"></div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    const form = document.getElementById('nihongo-contact-form');
    if (form) {
        form.addEventListener('submit', submitNihongoContactForm);
    }
}

function closeNihongoContactModal() {
    const modal = document.getElementById('nihongo-contact-modal');
    if (modal) modal.remove();
}

async function submitNihongoContactForm(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const status = document.getElementById('contact-status');
    const data = new FormData(form);

    const name = String(data.get('name') || '').trim();
    const message = String(data.get('message') || '').trim();

    if (!name || !message) {
        if (status) {
            status.textContent = 'Vui lòng nhập Tên và Nội dung trước khi gửi.';
            status.className = 'contribution-status error';
        }
        return;
    }

    const body = new FormData();
    body.append(NIHONGO_CONTACT_FORM_ENTRIES.name, name);
    body.append(NIHONGO_CONTACT_FORM_ENTRIES.email, data.get('email') || '');
    body.append(NIHONGO_CONTACT_FORM_ENTRIES.phone, data.get('phone') || '');
    body.append(NIHONGO_CONTACT_FORM_ENTRIES.message, message);

    if (status) {
        status.textContent = 'Đang gửi liên hệ...';
        status.className = 'contribution-status sending';
    }

    try {
        await fetch(NIHONGO_CONTACT_FORM_ACTION_URL, {
            method: 'POST',
            mode: 'no-cors',
            body
        });

        if (status) {
            status.textContent = 'Đã gửi. Cảm ơn bạn đã góp ý!';
            status.className = 'contribution-status success';
        }

        form.reset();

        setTimeout(() => {
            closeNihongoContactModal();
        }, 1200);

    } catch (error) {
        console.error(error);

        if (status) {
            status.textContent = 'Không gửi được. Vui lòng thử lại sau.';
            status.className = 'contribution-status error';
        }
    }
}

window.openNihongoContactModal = openNihongoContactModal;
window.closeNihongoContactModal = closeNihongoContactModal;
