# Nihongo Quest V1.2.8

Patch này sửa các phần:

## 1. Tra cứu / Ngữ pháp
- Sửa lỗi kết quả ngữ pháp bị lặp trong màn Tra cứu Toàn bộ.
- Tra cứu Toàn bộ chỉ gom 3 nhóm chính: vocab, kanji, grammar.
- Thêm lớp chống trùng dữ liệu khi cùng một mẫu bị gom từ nhiều nguồn.

## 2. Đáp án luyện tập
- Cỡ chữ đáp án mặc định tăng lên 1rem.
- Ghép câu: đáp án chỉ hiện câu tiếng Nhật, không hiện nghĩa Việt/English ở dưới để tránh lộ đáp án.
- Nút Sang câu vẫn nổi phía trên đáp án, không bị che.

## 3. Menu PC
- Trên PC, header/menu/tra cứu nhanh/lưới bài học kéo rộng bằng khung app.
- iPad/mobile giữ layout cũ.

## 4. Phiên bản / thông tin app
- Từ bản này, UI ưu tiên đọc thông tin từ `version.json`.
- Sau này nếu chỉ đổi text phiên bản/tác giả/liên hệ, sửa `version.json` là các chỗ hiển thị sẽ tự cập nhật khi có mạng.
- `sw.js` vẫn là file service worker. Nếu thay đổi logic cache/service worker thì vẫn cần cập nhật `sw.js` để trình duyệt cài service worker mới.

File thay đổi:
- index.html
- sw.js
- version.json
- js/core.js
- css/style.css
- games/nihongo/nihongo.js
- games/nihongo/nihongo.css
