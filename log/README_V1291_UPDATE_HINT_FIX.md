# Nihongo Quest V1.2.9.1

## Nội dung sửa

- Tăng phiên bản lên `V1.2.9.1 Nihongo`.
- Sửa lỗi màn ngoài vẫn báo có bản cập nhật dù bên trong app đã chạy bản mới.
- Logic kiểm tra cập nhật nằm trong `js/core.js`, hàm `checkAppVersionForUpdateHint()`.
- Từ bản này, thông báo cập nhật chỉ hiện khi `version.json.version` khác `CORE_APP_VERSION` trong `js/core.js`.
- Khi hai bản giống nhau, app tự cập nhật lại `localStorage.nihongo_app_version` và ẩn thông báo.

## File đã chỉnh

- `index.html`
- `sw.js`
- `version.json`
- `js/core.js`

## Lưu ý

`version.json` dùng để PWA đọc online xem có bản mới. Nhưng `sw.js` vẫn là file tĩnh; nếu đổi cache hoặc muốn trình duyệt cài service worker mới thì vẫn cần đổi cache name trong `sw.js`.
