# Nihongo Quest V1.2.7

Patch này sửa 3 phần:

1. Đồng bộ hiển thị phiên bản
- UI lấy thông tin từ `js/core.js` qua `NIHONGO_APP_META`.
- `versionText` tự sinh từ `displayVersion`, nên đổi `displayVersion` trong core thì phần thông tin tác giả/phiên bản đổi theo.
- `version.json` vẫn là file riêng để PWA kiểm tra bản mới qua mạng. File tĩnh không thể tự ghi ngược từ core, nên khi release cần đổi cả `APP_VERSION/displayVersion` trong core và `version.json`.

2. Nút Sang câu
- Nút `Sang câu ➜` được đẩy lên trong khung câu hỏi, không bị vùng đáp án che.
- Tăng padding đáy khung câu hỏi để nội dung không chồng lên nút.

3. Menu PC
- Trên PC, thanh `Tra cứu nhanh` được giới hạn cùng chiều ngang với header, 3 tab menu và lưới bài học.
- iPad/mobile giữ layout cũ.

File thay đổi:
- index.html
- sw.js
- version.json
- js/core.js
- css/style.css
- games/nihongo/nihongo.js
- games/nihongo/nihongo.css
