# Nihongo Quest V1.2.5 - chỉnh luyện Kanji, sai câu, chống lặp

## File cần chép đè

- `index.html`
- `sw.js`
- `js/core.js`
- `js/game-menu.js`
- `games/nihongo/nihongo.js`
- `games/nihongo/nihongo.css`

## Nội dung đã chỉnh

1. Luyện Kanji giờ trộn 3 kiểu câu hỏi:
   - Nhìn Kanji/từ Kanji → chọn cách đọc.
   - Nhìn cách đọc → chọn Kanji đúng.
   - Nhìn Kanji/từ Kanji → chọn nghĩa.

2. Chọn sai:
   - Tô đáp án sai.
   - Tự tô đáp án đúng.
   - Hiện giải thích/đáp án đúng.
   - Giữ 5 giây rồi mới sang câu.
   - Có nút `Sang câu ➜` để qua ngay.

3. Chọn đúng:
   - Vẫn tự qua sau 3 giây.
   - Có nút `Sang câu ➜` nằm nổi phía dưới khung câu hỏi, không nằm trong khung giải thích nữa.

4. Chống lặp câu hỏi:
   - Random theo vòng. Đi hết ngân hàng câu hỏi rồi mới lặp lại.
   - Câu trả lời sai sẽ được nhắc lại sau khoảng 10 lượt.

5. Menu:
   - Ẩn nút `Mẫu câu N...` trong phần học vì đang trùng với `Ngữ pháp`.
   - `Ghép câu` vẫn nằm trong mục `Luyện`.
   - Mô tả màn `Thi thử JLPT` đổi thành nội dung người học hiểu được, không còn ghi kiểu đang chờ cập nhật dữ liệu.

6. Version/cache:
   - `V1.2.5 Nihongo`
   - cache `nihongo-quest-v1-2-5`
