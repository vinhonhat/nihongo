// js/game-menu.js
// =====================================================
// MENU THÔNG MINH CHO APP HỌC TIẾNG NHẬT V3.2
// Giữ luồng Hybrid Game Design: chọn cấp lần đầu, lần sau vào thẳng menu.
// Bánh răng: giữ 1 giây mở Test, nhấp 10 lần để reset về chọn cấp.
// =====================================================

const MENU_STORAGE_KEY_AGE = 'nihongo_selected_level';
const MENU_STORAGE_KEY_GROUP = 'nihongo_selected_skill_group';

const AGE_GROUPS = {
    "intro": {
        "label": "Nhập môn",
        "icon": "🌸",
        "note": "Hiragana, Katakana, cách đọc cơ bản"
    },
    "n5": {
        "label": "N5",
        "icon": "🗻",
        "note": "Từ vựng, mẫu câu và Kanji nền tảng"
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
    }
};
const GAME_GROUPS = [
    {
        "id": "kana",
        "label": "Bảng chữ",
        "icon": "あ"
    },
    {
        "id": "vocab",
        "label": "Từ vựng",
        "icon": "📚"
    },
    {
        "id": "listen",
        "label": "Luyện nghe",
        "icon": "👂"
    },
    {
        "id": "kanji",
        "label": "Kanji",
        "icon": "漢"
    },
    {
        "id": "grammar",
        "label": "Ngữ pháp",
        "icon": "🧩"
    },
    {
        "id": "test",
        "label": "Thi thử",
        "icon": "📝"
    }
];
const GAME_MENU_DATA = [
    {
        "id": "nihongo_intro_kana",
        "label": "Bảng Hiragana",
        "icon": "あ",
        "group": "kana",
        "levels": [
            "intro"
        ],
        "color": "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
        "badge": "Nhập môn"
    },
    {
        "id": "nihongo_intro_katakana",
        "label": "Bảng Katakana",
        "icon": "ア",
        "group": "kana",
        "levels": [
            "intro"
        ],
        "color": "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
        "badge": "Nhập môn"
    },
    {
        "id": "nihongo_intro_vocab",
        "label": "Từ đầu tiên",
        "icon": "🍙",
        "group": "vocab",
        "levels": [
            "intro"
        ],
        "color": "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
        "badge": "Nhập môn"
    },
    {
        "id": "nihongo_intro_listen",
        "label": "Nghe âm Kana",
        "icon": "👂あ",
        "group": "listen",
        "levels": [
            "intro"
        ],
        "color": "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        "badge": "Nhập môn"
    },
    {
        "id": "nihongo_intro_quiz",
        "label": "Kiểm tra nhập môn",
        "icon": "🌸",
        "group": "test",
        "levels": [
            "intro"
        ],
        "color": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        "badge": "Mini"
    },
    {
        "id": "nihongo_n5_vocab_learn",
        "label": "Học từ vựng N5",
        "icon": "📖",
        "group": "vocab",
        "levels": [
            "n5"
        ],
        "color": "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
        "badge": "Học"
    },
    {
        "id": "nihongo_n5_vocab_practice",
        "label": "Luyện từ vựng N5",
        "icon": "🎯",
        "group": "vocab",
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
        "group": "listen",
        "levels": [
            "n5"
        ],
        "color": "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        "badge": "Nghe"
    },
    {
        "id": "nihongo_n5_kanji",
        "label": "Kanji N5",
        "icon": "漢",
        "group": "kanji",
        "levels": [
            "n5"
        ],
        "color": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
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
        "color": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
        "color": "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        "badge": "Mẫu"
    },
    {
        "id": "nihongo_n5_mock_test",
        "label": "Thi thử N5",
        "icon": "📝",
        "group": "test",
        "levels": [
            "n5"
        ],
        "color": "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
        "badge": "Test"
    },
    {
        "id": "nihongo_n4_vocab_learn",
        "label": "Học từ vựng N4",
        "icon": "📖",
        "group": "vocab",
        "levels": [
            "n4"
        ],
        "color": "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
        "badge": "Học"
    },
    {
        "id": "nihongo_n4_vocab_practice",
        "label": "Luyện từ vựng N4",
        "icon": "🎯",
        "group": "vocab",
        "levels": [
            "n4"
        ],
        "color": "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        "badge": "Luyện"
    },
    {
        "id": "nihongo_n4_listening",
        "label": "Luyện nghe N4",
        "icon": "👂",
        "group": "listen",
        "levels": [
            "n4"
        ],
        "color": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        "badge": "Nghe"
    },
    {
        "id": "nihongo_n4_kanji",
        "label": "Kanji N4",
        "icon": "漢",
        "group": "kanji",
        "levels": [
            "n4"
        ],
        "color": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
        "color": "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
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
        "id": "nihongo_n4_mock_test",
        "label": "Thi thử N4",
        "icon": "📝",
        "group": "test",
        "levels": [
            "n4"
        ],
        "color": "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
        "badge": "Test"
    },
    {
        "id": "nihongo_n3_vocab_learn",
        "label": "Học từ vựng N3",
        "icon": "📖",
        "group": "vocab",
        "levels": [
            "n3"
        ],
        "color": "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        "badge": "Học"
    },
    {
        "id": "nihongo_n3_vocab_practice",
        "label": "Luyện từ vựng N3",
        "icon": "🎯",
        "group": "vocab",
        "levels": [
            "n3"
        ],
        "color": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        "badge": "Luyện"
    },
    {
        "id": "nihongo_n3_listening",
        "label": "Luyện nghe N3",
        "icon": "👂",
        "group": "listen",
        "levels": [
            "n3"
        ],
        "color": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "badge": "Nghe"
    },
    {
        "id": "nihongo_n3_kanji",
        "label": "Kanji N3",
        "icon": "漢",
        "group": "kanji",
        "levels": [
            "n3"
        ],
        "color": "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
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
        "color": "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
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
        "color": "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
        "badge": "Mẫu"
    },
    {
        "id": "nihongo_n3_mock_test",
        "label": "Thi thử N3",
        "icon": "📝",
        "group": "test",
        "levels": [
            "n3"
        ],
        "color": "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
        "badge": "Test"
    },
    {
        "id": "nihongo_n2_vocab_learn",
        "label": "Học từ vựng N2",
        "icon": "📖",
        "group": "vocab",
        "levels": [
            "n2"
        ],
        "color": "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        "badge": "Học"
    },
    {
        "id": "nihongo_n2_vocab_practice",
        "label": "Luyện từ vựng N2",
        "icon": "🎯",
        "group": "vocab",
        "levels": [
            "n2"
        ],
        "color": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "badge": "Luyện"
    },
    {
        "id": "nihongo_n2_listening",
        "label": "Luyện nghe N2",
        "icon": "👂",
        "group": "listen",
        "levels": [
            "n2"
        ],
        "color": "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        "badge": "Nghe"
    },
    {
        "id": "nihongo_n2_kanji",
        "label": "Kanji N2",
        "icon": "漢",
        "group": "kanji",
        "levels": [
            "n2"
        ],
        "color": "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
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
        "color": "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
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
        "color": "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
        "badge": "Mẫu"
    },
    {
        "id": "nihongo_n2_mock_test",
        "label": "Thi thử N2",
        "icon": "📝",
        "group": "test",
        "levels": [
            "n2"
        ],
        "color": "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
        "badge": "Test"
    },
    {
        "id": "nihongo_n1_vocab_learn",
        "label": "Học từ vựng N1",
        "icon": "📖",
        "group": "vocab",
        "levels": [
            "n1"
        ],
        "color": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "badge": "Học"
    },
    {
        "id": "nihongo_n1_vocab_practice",
        "label": "Luyện từ vựng N1",
        "icon": "🎯",
        "group": "vocab",
        "levels": [
            "n1"
        ],
        "color": "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
        "badge": "Luyện"
    },
    {
        "id": "nihongo_n1_listening",
        "label": "Luyện nghe N1",
        "icon": "👂",
        "group": "listen",
        "levels": [
            "n1"
        ],
        "color": "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
        "badge": "Nghe"
    },
    {
        "id": "nihongo_n1_kanji",
        "label": "Kanji N1",
        "icon": "漢",
        "group": "kanji",
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
        "color": "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
        "badge": "Mẫu"
    },
    {
        "id": "nihongo_n1_mock_test",
        "label": "Thi thử N1",
        "icon": "📝",
        "group": "test",
        "levels": [
            "n1"
        ],
        "color": "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        "badge": "Test"
    },
    {
        "id": "frame_test",
        "label": "Test Khung",
        "icon": "🧪",
        "group": "test",
        "levels": [],
        "color": "linear-gradient(135deg,#777 0%,#bbb 100%)",
        "badge": "Test",
        "testOnly": true
    }
];

function safeGetStorage(key, fallback = '') {
    try { return localStorage.getItem(key) || fallback; } catch (e) { return fallback; }
}
function safeSetStorage(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
}
function getCurrentAgeGroup() {
    const age = safeGetStorage(MENU_STORAGE_KEY_AGE, '');
    return AGE_GROUPS[age] ? age : '';
}
function getAgeGames(age) {
    return GAME_MENU_DATA.filter(game => !game.testOnly && Array.isArray(game.levels) && game.levels.includes(age));
}
function getAvailableGroups(age) {
    const games = getAgeGames(age);
    return GAME_GROUPS.filter(group => games.some(game => game.group === group.id));
}
function getCurrentGroup(age) {
    const groups = getAvailableGroups(age);
    if (!groups.length) return '';
    const saved = safeGetStorage(MENU_STORAGE_KEY_GROUP, groups[0].id);
    if (groups.some(group => group.id === saved)) return saved;
    safeSetStorage(MENU_STORAGE_KEY_GROUP, groups[0].id);
    return groups[0].id;
}
function renderGameMenu() {
    const root = document.getElementById('smart-menu-root');
    if (!root) return;
    const age = getCurrentAgeGroup();
    if (!age) return renderAgeSelectScreen(root);
    renderMainGameMenu(root, age);
}

let parentGearTestTimer = null;
let parentGearActionDone = false;
let parentGearClickCount = 0;
let parentGearClickResetTimer = null;
const PARENT_GEAR_RESET_CLICK_COUNT = 10;

function renderParentGearButton() {
    return `
        <button class="parent-gear-btn" type="button" aria-label="Phụ huynh / Test"
            title="Giữ 1 giây để mở Test. Nhấp ${PARENT_GEAR_RESET_CLICK_COUNT} lần liên tiếp để xoá cài đặt và chọn lại cấp học."
            onpointerdown="startParentGearHold(event)" onpointerup="endParentGearHold(event)"
            onpointercancel="cancelParentGearHold()" onpointerleave="cancelParentGearHold()"
            onclick="handleParentGearClick(event)">⚙</button>`;
}
function startParentGearHold(event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    cancelParentGearHold();
    parentGearActionDone = false;
    parentGearTestTimer = setTimeout(() => {
        parentGearTestTimer = null;
        parentGearActionDone = true;
        openParentTestMenu();
    }, 1000);
}
function endParentGearHold(event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    cancelParentGearHold();
}
function cancelParentGearHold() {
    if (parentGearTestTimer) { clearTimeout(parentGearTestTimer); parentGearTestTimer = null; }
}
function handleParentGearClick(event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    if (parentGearActionDone) { parentGearActionDone = false; return; }
    parentGearClickCount += 1;
    if (parentGearClickResetTimer) clearTimeout(parentGearClickResetTimer);
    parentGearClickResetTimer = setTimeout(() => { parentGearClickCount = 0; parentGearClickResetTimer = null; }, 3000);
    if (parentGearClickCount >= PARENT_GEAR_RESET_CLICK_COUNT) {
        parentGearClickCount = 0;
        if (parentGearClickResetTimer) { clearTimeout(parentGearClickResetTimer); parentGearClickResetTimer = null; }
        closeParentTestMenu();
        resetKidMenuFromGear();
    }
}
function resetKidMenuFromGear() {
    cancelParentGearHold();
    const ok = confirm('Xoá cài đặt hiện tại và quay lại chọn cấp học từ đầu?\n\nThao tác này sẽ xoá lựa chọn cấp học, nhóm học và dữ liệu tạm trong app.');
    if (!ok) { parentGearActionDone = false; return; }
    try { localStorage.clear(); sessionStorage.clear(); } catch (err) { console.warn('Không xoá được storage:', err); }
    closeParentTestMenu();
    const root = document.getElementById('smart-menu-root');
    if (root) renderAgeSelectScreen(root); else renderGameMenu();
}
function renderAgeSelectScreen(root) {
    const cards = Object.entries(AGE_GROUPS).map(([ageId, age]) => `
        <button class="age-card level-card level-card-${ageId}" type="button" onclick="selectKidAge('${ageId}')">
            <span class="age-card-icon">${age.icon}</span>
            <span class="age-card-label">${age.label}</span>
            <span class="age-card-note">${age.note}</span>
        </button>`).join('');
    root.innerHTML = `
        <section class="age-select-screen nihongo-select-screen">
            <div class="nihongo-splash-mark">日本語</div>
            <h1 class="app-title smart-title">Học tiếng Nhật</h1>
            <p class="smart-subtitle">Chọn cấp độ trước. Lần sau app sẽ vào thẳng menu cấp đã chọn.</p>
            <div class="age-card-grid level-card-grid">${cards}</div>
            <div class="parent-gear-zone">${renderParentGearButton()}</div>
        </section>`;
}
function renderMainGameMenu(root, age) {
    const ageInfo = AGE_GROUPS[age];
    const groups = getAvailableGroups(age);
    const currentGroup = getCurrentGroup(age);
    const games = getAgeGames(age).filter(game => game.group === currentGroup);
    const ageOptions = Object.entries(AGE_GROUPS).map(([ageId, item]) => `<option value="${ageId}" ${ageId === age ? 'selected' : ''}>${item.icon} ${item.label}</option>`).join('');
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
                    <div class="smart-age-line"><span>Cấp độ:</span><select class="smart-age-select" onchange="selectKidAge(this.value)">${ageOptions}</select></div>
                    <div class="nihongo-level-note">${ageInfo.note}</div>
                </div>
                <div class="smart-age-badge" title="${ageInfo.note}"><span>${ageInfo.icon}</span></div>
            </div>
            <div class="menu-group-tabs">${groupTabs}</div>
            <div class="smart-game-grid">${games.map(renderMenuGameButton).join('')}</div>
            <div class="smart-menu-footer">${renderParentGearButton()}</div>
        </section>`;
}
function renderMenuGameButton(game) {
    const badge = game.badge ? `<span class="${game.badge === 'New' ? 'menu-new-app' : 'menu-version'}">${game.badge}</span>` : '';
    return `<button class="menu-btn smart-game-btn btn-${game.id}" type="button" onclick="startGameFromSmartMenu('${game.id}')" style="background: ${game.color};">${badge}<div class="menu-icon">${game.icon}</div><div class="menu-label">${game.label}</div></button>`;
}
function selectKidAge(ageId) {
    if (!AGE_GROUPS[ageId]) return;
    safeSetStorage(MENU_STORAGE_KEY_AGE, ageId);
    const groups = getAvailableGroups(ageId);
    if (groups.length) safeSetStorage(MENU_STORAGE_KEY_GROUP, groups[0].id);
    renderGameMenu();
}
function setGameMenuGroup(groupId) { safeSetStorage(MENU_STORAGE_KEY_GROUP, groupId); renderGameMenu(); }
function startGameFromSmartMenu(gameId) {
    if (typeof startGame !== 'function') { console.warn('startGame chưa sẵn sàng:', gameId); return; }
    startGame(gameId);
}
function openParentTestMenu() {
    const root = document.getElementById('smart-menu-root');
    if (!root) return;
    const old = document.getElementById('parent-test-overlay');
    if (old) old.remove();
    const overlay = document.createElement('div');
    overlay.id = 'parent-test-overlay';
    overlay.className = 'parent-test-overlay';
    overlay.innerHTML = `<div class="parent-test-box"><div class="parent-test-head"><div><div class="parent-test-title">⚙ Phụ huynh / Test</div><div class="parent-test-note">Hiện toàn bộ bài học để test nhanh khi sửa code.</div></div><button class="parent-test-close" type="button" onclick="closeParentTestMenu()">✕</button></div><div class="parent-test-grid">${GAME_MENU_DATA.slice().map(renderMenuGameButton).join('')}</div></div>`;
    root.appendChild(overlay);
}
function closeParentTestMenu() { const overlay = document.getElementById('parent-test-overlay'); if (overlay) overlay.remove(); }

window.renderGameMenu = renderGameMenu;
window.selectKidAge = selectKidAge;
window.setGameMenuGroup = setGameMenuGroup;
window.startGameFromSmartMenu = startGameFromSmartMenu;
window.openParentTestMenu = openParentTestMenu;
window.closeParentTestMenu = closeParentTestMenu;
window.renderParentGearButton = renderParentGearButton;
window.startParentGearHold = startParentGearHold;
window.endParentGearHold = endParentGearHold;
window.cancelParentGearHold = cancelParentGearHold;
window.handleParentGearClick = handleParentGearClick;
window.resetKidMenuFromGear = resetKidMenuFromGear;
window.addEventListener('DOMContentLoaded', renderGameMenu);
