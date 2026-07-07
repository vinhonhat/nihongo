# Nihongo Quest V1.2.4 - Nút sang câu + sửa N5 grammar

Chép đè các file trong patch vào thư mục gốc `nihongo/`.

## Đã chỉnh

1. Sau khi trả lời đúng sẽ hiện nút `Sang câu ➜` trong khung đáp án đúng.
   - Mặc định vẫn tự sang câu sau 3 giây.
   - Nếu người học muốn qua luôn thì bấm nút này.
   - Nút sẽ hủy timer 3 giây để không bị nhảy 2 câu liên tiếp.

2. Sửa lỗi màn Ngữ pháp N5 bị trống.
   - N5 đang có từ vựng tách theo bài nhưng ngữ pháp vẫn nằm ở file chung `grammar.js`.
   - Logic mới sẽ tự fallback về dữ liệu chung nếu bài đang chọn chưa có grammar riêng.
   - Sau này nếu bạn thêm grammar vào từng `lessonXX.js` thì app tự ưu tiên dữ liệu theo bài.

3. Chuẩn hóa `games/nihongo/data/n5/index.js` giống N4/N3.
   - `index.js` tự nạp `lesson01.js` đến `lesson25.js`.
   - `index.html` không còn liệt kê thủ công 25 file N5 lesson nữa.

4. Tăng version lên `V1.2.4 Nihongo`.
   - Cache service worker: `nihongo-quest-v1-2-4`.

## File trong patch

- `index.html`
- `sw.js`
- `js/core.js`
- `games/nihongo/nihongo.js`
- `games/nihongo/nihongo.css`
- `games/nihongo/data/n5/index.js`
