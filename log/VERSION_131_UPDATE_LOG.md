# VERSION 1.3.1 UPDATE LOG

Nền sử dụng: bản V1.2.9.2 restore-fix.

## Mục tiêu

Không giữ bố cục V1.3.0 dạng tab Tra cứu riêng. Quay lại menu kiểu V1.2.9.2 và chỉ thêm một cấp mới sau N1:

- N6 / Chuyên ngành
- Trong N6, selector "Bài" được đổi ý nghĩa thành "Chuyên ngành"
- Dữ liệu chuyên ngành lấy lại từ thư mục `games/nihongo/data/specialized/` của V1.3.0

## File thay đổi chính

- `index.html`
  - Nâng hiển thị lên `V1.3.1 Nihongo`
  - Nạp thêm data chuyên ngành: `specialized/index.js`, `it.js`, `factory.js`, `office.js`, `combini.js`, `daily.js`

- `version.json`
  - Nâng version lên `1.3.1`

- `sw.js`
  - Đổi cache shell sang `nihongo-quest-shell-v1-3-1`

- `js/core.js`
  - Nâng `CORE_APP_VERSION` lên `1.3.1`
  - Thêm cache offline cho data chuyên ngành
  - Thêm game config cho:
    - `nihongo_n6_vocab_learn`
    - `nihongo_n6_search`

- `js/game-menu.js`
  - Thêm cấp `n6` sau `n1`
  - Không thêm tab Tra cứu riêng
  - Thêm nút `Từ vựng chuyên ngành` trong nhóm Từ vựng của N6
  - Với N6, selector bài hiển thị thành `Chuyên ngành:` và lấy danh sách từ `NIHONGO_SPECIALIZED_FIELDS`
  - Tra cứu nhanh giữ kiểu V1.2.9.2, nhưng scope có thêm Chuyên ngành

- `games/nihongo/nihongo.js`
  - Thêm xử lý scope `n6`
  - `nihongo_n6_vocab_learn` hiển thị từ vựng chuyên ngành theo ngành đã chọn
  - `nihongo_n6_search` tra cứu trong chuyên ngành hoặc toàn bộ tùy scope từ menu
  - Scope `Toàn bộ` gom cả bài học N0-N1 và chuyên ngành

- `games/nihongo/nihongo.css`
  - Thêm style card riêng cho từ vựng chuyên ngành

- `games/nihongo/data/specialized/`
  - Giữ lại data chuyên ngành từ V1.3.0, không tạo lại data cấp học N0-N1

## Cách test nhanh

1. Mở app, xoá chọn cấp nếu cần.
2. Chọn cấp `Chuyên ngành` sau N1.
3. Đổi selector `Chuyên ngành:` qua IT / Nhà máy / Văn phòng / Combini / Đời sống.
4. Bấm `Từ vựng chuyên ngành`.
5. Tra cứu nhanh thử các từ:
   - `見積書`
   - `Wi-Fi`
   - `検品`
   - `袋`
   - `rác`
