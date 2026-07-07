# Nihongo Quest - N4 Full Data Patch V1.1.9

Bộ dữ liệu N4 tổng hợp theo cấu trúc mỗi bài 1 file.

## Cấu trúc

```text
games/nihongo/data/n4/
├── index.js
├── lesson01.js → lesson25.js
├── vocab.js
├── kanji.js
├── listening.js
└── grammar.js
```

## Số lượng dữ liệu

- Từ vựng: 400 mục
- Kanji: 144 mục
- Ngữ pháp: 50 mẫu
- Luyện nghe: 100 câu
- Ghép câu: 50 câu

## Lưu ý

Đây là bộ N4 tổng hợp tự biên soạn cho app, không phải danh sách chính thức của JLPT và không sao chép nguyên văn giáo trình có bản quyền. Sau này bạn có thể bổ sung/sửa trực tiếp trong từng `lessonXX.js`.

## Cách thêm từ

```js
vocab: [
    { jp: "急ぐ", reading: "いそぐ", vi: "Vội, gấp", en: "hurry" }
]
```

## Cách thêm ngữ pháp

```js
grammar: [
    {
        pattern: "〜ながら",
        vi: "Vừa làm A vừa làm B",
        en: "while doing",
        example: "音楽を聞きながら勉強します。",
        reading: "おんがくを ききながら べんきょうします。",
        exampleVi: "Tôi vừa nghe nhạc vừa học.",
        highlight: "聞きながら"
    }
]
```
