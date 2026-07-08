# Từ điển chuyên ngành V1.3.0

Cấu trúc dữ liệu chuyên ngành nằm riêng, không trộn vào data N0-N1.

## Thêm từ mới

Mở file theo ngành, ví dụ `office.js`, rồi thêm object:

```js
{
  id: 'office_004',
  jp: '発注書',
  reading: 'はっちゅうしょ',
  romaji: 'hacchuusho',
  vi: 'đơn đặt hàng',
  en: 'purchase order',
  field: 'office',
  type: 'vocab',
  tags: ['văn phòng', 'đặt hàng'],
  examples: [{ jp: '発注書を作成します。', vi: 'Tạo đơn đặt hàng.' }],
  note: 'Ghi chú nếu cần'
}
```

## Thêm ngành mới

1. Tạo file mới trong thư mục này, ví dụ `medical.js`.
2. Thêm ngành vào `index.js` trong `NIHONGO_SPECIALIZED_FIELDS`.
3. Thêm script vào `index.html`.
4. Nếu muốn PWA cache offline, thêm file đó vào `buildNihongoOfflineAssetList()` trong `js/core.js`.
