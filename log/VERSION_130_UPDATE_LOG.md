# Nihongo Quest V1.3.0 - Tra cứu / Từ điển chuyên ngành

## File chỉnh chính

- `index.html`
  - Nâng hiển thị version lên `V1.3.0 Nihongo`.
  - Thêm script data chuyên ngành ở `games/nihongo/data/specialized/*.js`.

- `version.json`
  - Nâng version lên `1.3.0`.

- `sw.js`
  - Đổi cache shell sang `nihongo-quest-shell-v1-3-0`.

- `js/core.js`
  - Nâng `CORE_APP_VERSION` lên `1.3.0`.
  - Thêm game config cho 3 mục từ điển:
    - `dict_all`: tra cứu toàn bộ.
    - `dict_study`: chỉ tra cứu bài học N0-N1.
    - `dict_specialized`: từ điển chuyên ngành.
  - Thêm file chuyên ngành vào danh sách cache offline.

- `js/game-menu.js`
  - Thêm tab menu mới: `🔎 Tra cứu`.
  - Thêm 3 nút trong tab này:
    - `🌐 Tra cứu toàn bộ`.
    - `📚 Tra cứu bài học`.
    - `🏢 Từ điển chuyên ngành`.
  - Ô tra cứu nhanh ngoài menu có thêm phạm vi `Tất cả`, `Bài học`, `Chuyên ngành`.

- `games/nihongo/nihongo.js`
  - Thêm logic đọc dữ liệu chuyên ngành từ `window.NIHONGO_SPECIALIZED_DATA`.
  - Tra cứu `Toàn bộ` sẽ gom cả bài học N0-N1 và chuyên ngành.
  - Tra cứu `Chuyên ngành` có thể lọc tất cả ngành hoặc từng ngành.
  - Thêm card hiển thị riêng cho từ chuyên ngành: từ, cách đọc, nghĩa, tag, ví dụ, nút nghe.

- `games/nihongo/nihongo.css`
  - Thêm style cho card từ điển chuyên ngành.

## File data chuyên ngành mới

- `games/nihongo/data/specialized/index.js`
- `games/nihongo/data/specialized/it.js`
- `games/nihongo/data/specialized/factory.js`
- `games/nihongo/data/specialized/office.js`
- `games/nihongo/data/specialized/combini.js`
- `games/nihongo/data/specialized/daily.js`
- `games/nihongo/data/specialized/README_SPECIALIZED_DATA.md`

## Cách test nhanh

1. Vào app → chọn cấp bất kỳ.
2. Bấm tab `Tra cứu`.
3. Chọn `Từ điển chuyên ngành`.
4. Gõ thử: `見積書`, `wifi`, `rác`, `検品`, `袋`.
5. Chọn dropdown trong màn tra cứu để lọc từng ngành.

## Ghi chú

Bản này không sửa dữ liệu cấp học N0-N1. Chỉ thêm data chuyên ngành riêng và logic tra cứu.
