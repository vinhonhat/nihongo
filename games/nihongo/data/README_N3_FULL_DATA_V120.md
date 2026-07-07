# Nihongo Quest - N3 Full Data Patch V1.2.0

Patch này bổ sung dữ liệu N3 theo cấu trúc mỗi bài 1 file.

## Thư mục

```text
games/nihongo/data/n3/
├── index.js
├── lesson01.js
├── lesson02.js
├── ...
├── lesson25.js
├── vocab.js
├── kanji.js
├── listening.js
└── grammar.js
```

## Nội dung đã có

- Từ vựng: 450 mục
- Kanji: 150 mục
- Ngữ pháp: 75 mẫu
- Luyện nghe: 100 câu
- Ghép câu: 75 câu

Đây là bộ dữ liệu N3 tổng hợp tự biên soạn cho app, không chép nguyên văn giáo trình hay danh sách có bản quyền. Bạn có thể chỉnh, thêm hoặc thay từng bài trực tiếp trong `lessonXX.js`.

## Cấu trúc một mục từ vựng

```js
{ jp: "確認", reading: "かくにん", vi: "Xác nhận", en: "confirmation" }
```

## Cấu trúc một mục ngữ pháp

```js
{
  pattern: "〜ようになる",
  vi: "Trở nên có thể / trở nên",
  en: "come to",
  example: "漢字が少し読めるようになりました。",
  reading: "かんじが すこし よめるようになりました。",
  exampleVi: "Tôi đã dần đọc được một ít kanji.",
  highlight: "読めるようになりました"
}
```
