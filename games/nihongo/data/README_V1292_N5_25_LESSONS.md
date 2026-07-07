# Nihongo Quest V1.2.9.2 - N5 25 bài

Patch này chuẩn hóa lại toàn bộ `games/nihongo/data/n5/` theo cấu trúc mỗi bài 1 file:

- `lesson01.js` → `lesson25.js`
- Mỗi bài có đủ mảng: `vocab`, `kanji`, `grammar`, `listening`, `sentence`
- `vocab` có thêm trường `source: "MinanoNihongo"`
- `index.js` gom lại toàn bộ bài để app tìm kiếm/luyện/học danh sách.

Ghi chú: dữ liệu được biên tập lại theo cấu trúc học N5 từng bài để dùng trong app, không phải bản scan/chép nguyên trang sách.

Do dữ liệu JS có thể bị PWA cache, patch có kèm `sw.js` và `version.json` V1.2.9.2 để ép tải lại cache bài N5.
