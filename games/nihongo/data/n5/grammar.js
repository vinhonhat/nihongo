// games/nihongo/data/n5/grammar.js
// V1.2.9: N5 grammar đã được chuẩn hóa vào từng lesson giống N4.
// File này chỉ còn làm lớp tương thích để link cũ không lỗi.
// Không ghi đè window.NIHONGO_DATA.n5.grammar nữa, tránh mất lessonId/reading/parts.

window.NIHONGO_DATA = window.NIHONGO_DATA || {};
window.NIHONGO_DATA.n5 = window.NIHONGO_DATA.n5 || {};

(function () {
    if (typeof window.rebuildNihongoLevelFromLessons === 'function') {
        window.rebuildNihongoLevelFromLessons('n5');
    }
})();
