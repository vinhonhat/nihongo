# Nihongo Quest V1.2.3 - Search không lưu + menu thi thử JLPT

Giải nén patch này rồi chép đè vào thư mục gốc `nihongo/`.

## Đã sửa

1. Ô tìm kiếm ngoài menu chỉ dùng một lần cho màn Tra cứu.
   - Vào Từ vựng / Kanji / Ngữ pháp sau đó sẽ không còn giữ từ khóa cũ.
   - Màn học mặc định sẽ hiện danh sách đầy đủ theo cấp/bài đang chọn.

2. Ô Tra cứu nhanh ngoài menu vẫn có phạm vi:
   - Cấp hiện tại, ví dụ N4.
   - Toàn bộ N0/N5/N4/N3/N2/N1.
   - Hoặc chọn cấp khác.

3. Mục Luyện thêm menu thi thử JLPT theo đề số.
   - Bấm `Thi thử JLPT N...` sẽ mở danh sách `Đề số 01` đến `Đề số 20`.
   - Hiện tại mỗi đề dùng ngân hàng câu hỏi của cấp đó.
   - Sau này có thể thêm data đề riêng theo từng set mà không cần đổi menu.

## File đã chỉnh

- `index.html`
- `sw.js`
- `js/core.js`
- `js/game-menu.js`
- `games/nihongo/nihongo.js`
- `games/nihongo/nihongo.css`

## Version

- `V1.2.3 Nihongo`
- cache: `nihongo-quest-v1-2-3`
