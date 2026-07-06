// js/game-menu.js
// Menu thông minh cho Nihongo Quest V1.1.
// Chọn cấp học lần đầu, lần sau vào thẳng menu đã lưu.

const MENU_STORAGE_KEY_LEVEL = 'nihongo_selected_level';
const MENU_STORAGE_KEY_GROUP = 'nihongo_selected_skill_group';

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
        "id": "nihongo_n5_mock_test",
        "label": "Thi thử N5",
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
        "label": "Thi thử N4",
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
        "label": "Thi thử N3",
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
        "label": "Thi thử N2",
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
        "label": "Thi thử N1",
        "icon": "📝",
        "group": "practice",
        "levels": [
            "n1"
        ],
        "color": "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        "badge": "Test"
    }
];

function safeGetStorage(key, fallback = '') {
    try { return localStorage.getItem(key) || fallback; } catch (e) { return fallback; }
}
function safeSetStorage(key, value) {
    try { localStorage.setItem(key, value); } catch (e) {}
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
const ADMIN_GEAR_RESET_CLICK_COUNT = 10;

function renderAdminGearButton() {
    return `
        <button class="admin-gear-btn" type="button" aria-label="Cài đặt"
            title="Nhấn thả: mở Cài đặt. Giữ 1 giây: mở Test. Nhấn nhanh 10 lần: xoá cài đặt."
            onpointerdown="startAdminGearHold(event)"
            onpointerup="endAdminGearHold(event)"
            onpointercancel="cancelAdminGearHold(event)"
            onpointerleave="cancelAdminGearHold(event)">⚙</button>`;
}

function startAdminGearHold(event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    cancelAdminGearHold();
    adminGearActionDone = false;
    const btn = event && event.currentTarget ? event.currentTarget : null;
    if (btn) btn.classList.add('admin-gear-holding');
    adminGearTestTimer = setTimeout(() => {
        adminGearTestTimer = null;
        adminGearActionDone = true;
        if (btn) btn.classList.remove('admin-gear-holding');
        openAdminTestMenu();
    }, 1000);
}

function endAdminGearHold(event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    const btn = event && event.currentTarget ? event.currentTarget : null;
    if (btn) btn.classList.remove('admin-gear-holding');

    // Nếu đã giữ đủ 1 giây và mở Test thì thả tay không mở Cài đặt nữa.
    if (adminGearActionDone) {
        adminGearActionDone = false;
        cancelAdminGearHold();
        return;
    }

    cancelAdminGearHold();
    handleAdminGearClick(event);
}

function cancelAdminGearHold(event) {
    if (adminGearTestTimer) { clearTimeout(adminGearTestTimer); adminGearTestTimer = null; }
    const btn = event && event.currentTarget ? event.currentTarget : null;
    if (btn) btn.classList.remove('admin-gear-holding');
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
        }
    }, 260);
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
function renderMainGameMenu(root, level) {
    const levelInfo = NIHONGO_LEVELS[level];
    const groups = getAvailableGroups(level);
    const currentGroup = getCurrentGroup(level);
    const games = getLevelGames(level).filter(game => game.group === currentGroup);
    const levelOptions = Object.entries(NIHONGO_LEVELS).map(([levelId, item]) => `<option value="${levelId}" ${levelId === level ? 'selected' : ''}>${item.icon} ${item.label}</option>`).join('');
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
                    <div class="nihongo-level-note">${levelInfo.note}</div>
                </div>
                <div class="smart-level-badge" title="${levelInfo.note}"><span>${levelInfo.icon}</span></div>
            </div>
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
