# Nihongo Quest V1.1.8 - N4/N3/N2/N1 lesson files

Patch này thêm đủ khung file cho N4, N3, N2, N1 theo cấu trúc giống N5.

## Cấu trúc mới

```text
games/nihongo/data/n4/
├── index.js
├── lesson01.js
├── lesson02.js
...
├── lesson25.js
├── vocab.js
├── kanji.js
├── listening.js
└── grammar.js
```

N3/N2/N1 cũng giống như vậy.

## Cách nhập dữ liệu

Mở đúng file bài, ví dụ:

```text
games/nihongo/data/n4/lesson01.js
```

Thêm từ vựng vào mảng `vocab`:

```js
vocab: [
    { jp: "", reading: "", vi: "", en: "" }
]
```

Thêm Kanji vào mảng `kanji`:

```js
kanji: [
    { jp: "", reading: "", vi: "", en: "", onyomi: "", kunyomi: "" }
]
```

Thêm ngữ pháp vào mảng `grammar`:

```js
grammar: [
    {
        pattern: "",
        vi: "",
        en: "",
        example: "",
        reading: "",
        exampleVi: "",
        highlight: ""
    }
]
```

Thêm câu nghe vào `listening`:

```js
listening: [
    { jp: "", reading: "", vi: "", en: "" }
]
```

Thêm ghép câu vào `sentence`:

```js
sentence: [
    { jp: "", reading: "", vi: "", en: "", parts: ["", "", ""] }
]
```

## Ghi chú

- `index.js` của từng cấp tự nạp `lesson01.js` đến `lesson25.js`, nên `index.html` không bị quá dài.
- `vocab.js`, `kanji.js`, `listening.js`, `grammar.js` chỉ còn là file giữ tương thích, không nên nhập dữ liệu mới vào đó nữa.
- Sau này làm N4/N3/N2/N1 chỉ cần nhập dữ liệu theo từng bài.
