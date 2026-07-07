# Nihongo Quest V1.2.6

## Thay đổi chính

- Luyện Kanji không còn lộ nghĩa/cách đọc phụ ở câu hỏi/đáp án.
  - Kiểu `Chọn Kanji đúng cho cách đọc này` chỉ hiện cách đọc ở câu hỏi.
  - Đáp án chỉ hiện Kanji, không hiện nghĩa Việt bên dưới.
  - Kiểu `Chọn cách đọc đúng` chỉ hiện cách đọc trong đáp án, không hiện nghĩa.
- Đúng và sai đều giữ màn hình 5 giây để người học kịp xem.
- Nút `Sang câu ➜` vẫn hiện để người học qua ngay nếu không muốn chờ.
- Cỡ chữ đáp án tăng lên 1.0rem.
- Thêm cơ chế tải dữ liệu offline cho PWA:
  - Khi chạy dạng PWA và có mạng, bấm `Vào chơi` sẽ tải các file app/data về cache.
  - `version.json` không cache, luôn đọc online để biết có bản mới.
  - Nhấn đúp `Vào chơi` sẽ xoá cache và tải lại từ đầu.

## File trong patch

- `index.html`
- `sw.js`
- `version.json`
- `js/core.js`
- `games/nihongo/nihongo.js`
- `games/nihongo/nihongo.css`
- `README_V126_KANJI_OFFLINE.md`

## Ghi chú dữ liệu

Dữ liệu từ vựng vẫn có thể thêm `source` nếu muốn ghi nguồn giáo trình, ví dụ:

```js
{ jp: "発売", reading: "はつばい", vi: "Phát hành, bán ra", en: "Release / sale", source: "Shinkanzen" }
```

App hiện tại vẫn chạy nếu chưa có `source`.
