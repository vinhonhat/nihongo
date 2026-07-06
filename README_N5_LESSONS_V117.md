# Nihongo V1.1.7 - cấu trúc N5 theo từng bài

## Cấu trúc mới

```text
games/nihongo/data/n5/
├── index.js
├── lesson01.js
├── lesson02.js
├── ...
└── lesson25.js
```

Mỗi bài là 1 file. Trong mỗi file có thể thêm:

```js
vocab: [],
kanji: [],
grammar: [],
listening: [],
sentence: []
```

## Cách thêm từ mới

Mở đúng bài, ví dụ `lesson10.js`, thêm vào mảng `vocab`:

```js
{
    jp: "はい",
    reading: "はい",
    vi: "Vâng / đúng",
    en: "Yes"
}
```


## Ghi chú

Dữ liệu từ file `vocab.js` bạn gửi đã được tách vào lesson01 đến lesson09 theo thứ tự hiện có.
Lesson10 đến lesson25 đã tạo sẵn khung rỗng để bạn bổ sung sau.
Khi chọn `Toàn bộ N5`, app gom toàn bộ bài có dữ liệu để random.
Khi chọn một bài cụ thể, phần từ vựng và nghe sẽ ưu tiên đúng bài đó.
