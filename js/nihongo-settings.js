// js/nihongo-settings.js
// =====================================================
// NIHONGO SETTINGS UI V1.1.3
// Luôn load cùng index.html để nút bánh răng mở được cả khi chưa vào bài học.
// Sửa lỗi iPhone bị treo sau khi bấm Lưu: KHÔNG observe thuộc tính style nữa,
// vì apply settings sẽ đổi style và có thể tạo vòng lặp MutationObserver.
// =====================================================
(function () {
    'use strict';

    const STORAGE_KEY = 'nihongo_ui_settings_v1_1_3';
    const OLD_STORAGE_KEYS = [
        'nihongo_ui_settings_v1_1_2',
        'nihongo_ui_settings_v1'
    ];

    const DEFAULT_SETTINGS = {
        promptSize: 0.95,
        jpScale: 1,
        answerSize: 0.78,
        questionRatio: 70,
        bgOpacity: 0.14
    };

    let settingsEventsReady = false;
    let gameObserverReady = false;
    let pendingApplyTimer = null;

    function clampNumber(value, min, max, fallback) {
        const n = Number(value);
        if (!Number.isFinite(n)) return fallback;
        return Math.max(min, Math.min(max, n));
    }

    function normalizeSettings(settings = {}) {
        return {
            promptSize: clampNumber(settings.promptSize, 0.7, 1.4, DEFAULT_SETTINGS.promptSize),
            jpScale: clampNumber(settings.jpScale, 0.75, 1.35, DEFAULT_SETTINGS.jpScale),
            answerSize: clampNumber(settings.answerSize, 0.65, 1.1, DEFAULT_SETTINGS.answerSize),
            questionRatio: Math.round(clampNumber(settings.questionRatio, 60, 85, DEFAULT_SETTINGS.questionRatio)),
            bgOpacity: clampNumber(settings.bgOpacity, 0, 0.6, DEFAULT_SETTINGS.bgOpacity)
        };
    }

    function getGameScreen() {
        return document.getElementById('game-screen');
    }

    function isNihongoScreen(screen) {
        return !!(screen && String(screen.className || '').indexOf('game-nihongo') >= 0);
    }

    function loadSettings() {
        try {
            let raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                for (const key of OLD_STORAGE_KEYS) {
                    raw = localStorage.getItem(key);
                    if (raw) break;
                }
            }
            return normalizeSettings(raw ? JSON.parse(raw) : DEFAULT_SETTINGS);
        } catch (err) {
            console.warn('Không đọc được cài đặt Nihongo:', err);
            return normalizeSettings(DEFAULT_SETTINGS);
        }
    }

    function saveSettings(settings) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeSettings(settings)));
            OLD_STORAGE_KEYS.forEach(key => localStorage.removeItem(key));
        } catch (err) {
            console.warn('Không lưu được cài đặt Nihongo:', err);
        }
    }

    function applyNihongoSettings(settings) {
        const screen = getGameScreen();
        if (!isNihongoScreen(screen)) return;

        const finalSettings = normalizeSettings(settings);
        const questionRatio = finalSettings.questionRatio;
        const answerRatio = 100 - questionRatio;
        const jpScale = finalSettings.jpScale;

        screen.style.setProperty('--NQ-question-row', `${questionRatio}fr`);
        screen.style.setProperty('--NQ-answer-row', `${answerRatio}fr`);
        screen.style.setProperty('--NQ-prompt-size', `${finalSettings.promptSize}rem`);
        screen.style.setProperty('--NQ-answer-font', `${finalSettings.answerSize}rem`);
        screen.style.setProperty('--NQ-bg-opacity', `${finalSettings.bgOpacity}`);
        screen.style.setProperty('--NQ-jp-size', `clamp(${(1.7 * jpScale).toFixed(2)}rem, ${(8.5 * jpScale).toFixed(2)}vw, ${(3.3 * jpScale).toFixed(2)}rem)`);
        screen.style.setProperty('--NQ-kanji-size', `clamp(${(1.95 * jpScale).toFixed(2)}rem, ${(9.2 * jpScale).toFixed(2)}vw, ${(3.7 * jpScale).toFixed(2)}rem)`);
    }

    function scheduleApplySavedSettings() {
        if (pendingApplyTimer) clearTimeout(pendingApplyTimer);
        pendingApplyTimer = setTimeout(function () {
            pendingApplyTimer = null;
            applyNihongoSettings(loadSettings());
        }, 30);
    }

    function updateLabels(settings) {
        const finalSettings = normalizeSettings(settings);
        const promptValue = document.getElementById('set-prompt-value');
        const jpValue = document.getElementById('set-jp-value');
        const answerValue = document.getElementById('set-answer-value');
        const ratioValue = document.getElementById('set-question-ratio-value');
        const opacityValue = document.getElementById('set-bg-opacity-value');

        if (promptValue) promptValue.textContent = `${finalSettings.promptSize.toFixed(2)}rem`;
        if (jpValue) jpValue.textContent = `${Math.round(finalSettings.jpScale * 100)}%`;
        if (answerValue) answerValue.textContent = `${finalSettings.answerSize.toFixed(2)}rem`;
        if (ratioValue) ratioValue.textContent = `${finalSettings.questionRatio}% / ${100 - finalSettings.questionRatio}%`;
        if (opacityValue) opacityValue.textContent = finalSettings.bgOpacity.toFixed(2);
    }

    function setInputValue(id, value) {
        const input = document.getElementById(id);
        if (input) input.value = value;
    }

    function readPanelValues() {
        return normalizeSettings({
            promptSize: document.getElementById('set-prompt-size')?.value,
            jpScale: document.getElementById('set-jp-scale')?.value,
            answerSize: document.getElementById('set-answer-size')?.value,
            questionRatio: document.getElementById('set-question-ratio')?.value,
            bgOpacity: document.getElementById('set-bg-opacity')?.value
        });
    }

    function setPanelValues(settings) {
        const finalSettings = normalizeSettings(settings);
        setInputValue('set-prompt-size', finalSettings.promptSize);
        setInputValue('set-jp-scale', finalSettings.jpScale);
        setInputValue('set-answer-size', finalSettings.answerSize);
        setInputValue('set-question-ratio', finalSettings.questionRatio);
        setInputValue('set-bg-opacity', finalSettings.bgOpacity);
        updateLabels(finalSettings);
        applyNihongoSettings(finalSettings);
    }

    function openNihongoSettings() {
        ensureSettingsEvents();
        const modal = document.getElementById('nihongo-settings-modal');
        if (!modal) return;
        setPanelValues(loadSettings());
        modal.classList.remove('hidden');
    }

    function closeNihongoSettings() {
        document.getElementById('nihongo-settings-modal')?.classList.add('hidden');
    }

    function resetNihongoAppFromSettings() {
        const ok = confirm('Xoá lựa chọn cấp học và quay lại màn chọn cấp từ đầu?\n\nCài đặt giao diện đã lưu cũng sẽ được xoá.');
        if (!ok) return;
        try {
            localStorage.removeItem('nihongo_selected_level');
            localStorage.removeItem('nihongo_selected_skill_group');
            localStorage.removeItem(STORAGE_KEY);
            OLD_STORAGE_KEYS.forEach(key => localStorage.removeItem(key));
            sessionStorage.clear();
        } catch (err) {
            console.warn('Không xoá được storage:', err);
        }
        closeNihongoSettings();
        if (typeof closeAdminTestMenu === 'function') closeAdminTestMenu();
        if (typeof backToMenu === 'function') backToMenu();
        if (typeof renderGameMenu === 'function') renderGameMenu();
    }

    function ensureSettingsEvents() {
        if (settingsEventsReady) return;

        const modal = document.getElementById('nihongo-settings-modal');
        if (!modal) return;

        settingsEventsReady = true;

        const closeBtn = document.getElementById('nihongo-settings-close');
        const saveBtn = document.getElementById('settings-save-btn');
        const resetBtn = document.getElementById('settings-reset-btn');
        const resetAppBtn = document.getElementById('settings-reset-app-btn');
        const inputIds = [
            'set-prompt-size',
            'set-jp-scale',
            'set-answer-size',
            'set-question-ratio',
            'set-bg-opacity'
        ];

        inputIds.forEach(id => {
            const input = document.getElementById(id);
            if (!input) return;
            input.addEventListener('input', function () {
                const settings = readPanelValues();
                updateLabels(settings);
                applyNihongoSettings(settings);
            }, { passive: true });
        });

        closeBtn?.addEventListener('click', function (event) {
            event.preventDefault();
            closeNihongoSettings();
        });

        modal.addEventListener('click', function (event) {
            if (event.target === modal) closeNihongoSettings();
        });

        saveBtn?.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            const settings = readPanelValues();
            saveSettings(settings);
            updateLabels(settings);
            applyNihongoSettings(settings);
            closeNihongoSettings();
        });

        resetBtn?.addEventListener('click', function (event) {
            event.preventDefault();
            try {
                localStorage.removeItem(STORAGE_KEY);
                OLD_STORAGE_KEYS.forEach(key => localStorage.removeItem(key));
            } catch (err) {}
            setPanelValues(DEFAULT_SETTINGS);
        });

        resetAppBtn?.addEventListener('click', function (event) {
            event.preventDefault();
            resetNihongoAppFromSettings();
        });

        setPanelValues(loadSettings());
    }

    function ensureGameObserver() {
        if (gameObserverReady || !('MutationObserver' in window)) return;
        const screen = getGameScreen();
        if (!screen) return;
        gameObserverReady = true;

        const observer = new MutationObserver(function () {
            // Chỉ chạy khi nội dung game thay đổi. Không observe attributes/style để tránh treo app.
            scheduleApplySavedSettings();
        });
        observer.observe(screen, { childList: true, subtree: false });
    }

    function init() {
        ensureSettingsEvents();
        ensureGameObserver();
        scheduleApplySavedSettings();
    }

    window.openNihongoSettings = openNihongoSettings;
    window.closeNihongoSettings = closeNihongoSettings;
    window.applySavedNihongoSettings = function () {
        applyNihongoSettings(loadSettings());
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
