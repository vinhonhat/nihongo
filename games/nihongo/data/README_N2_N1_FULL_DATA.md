# Nihongo N2/N1 Data Patch

Patch này chỉ bổ sung dữ liệu cho `games/nihongo/data/n2/` và `games/nihongo/data/n1/`.

Không thay:
- `version.json`
- `sw.js`
- `js/core.js`

## Kiểm tra N4/N3 từ file bạn gửi

N4:
- 25 lesson
- 400 vocab
- 144 kanji
- 50 grammar
- 100 listening
- 50 sentence
- Không có lesson rỗng

N3:
- 25 lesson
- 450 vocab
- 150 kanji
- 75 grammar
- 100 listening
- 75 sentence
- Không có lesson rỗng

=> N4/N3 đang ổn theo cấu trúc hiện tại.

## Dữ liệu bổ sung

N2:
- 25 lesson
- 340 vocab
- 150 kanji/kanji-word practice items
- 100 grammar
- 125 listening
- 100 sentence

N1:
- 25 lesson
- 340 vocab
- 150 kanji/kanji-word practice items
- 100 grammar
- 125 listening
- 100 sentence

## Cấu trúc mỗi lesson

```js
window.registerNihongoLesson && window.registerNihongoLesson('n2', {
    id: 'lesson01',
    title: 'N2 Bài 1',
    label: 'Bài 1',
    note: '',
    vocab: [],
    kanji: [],
    grammar: [],
    listening: [],
    sentence: []
});
```

## Ghi chú

Dữ liệu là bộ tổng hợp/tự biên soạn cho app, không phải bản chép nguyên văn từ một giáo trình có bản quyền.
Sau này nếu bạn có danh sách chuẩn theo sách cụ thể, có thể thay trực tiếp trong từng `lessonXX.js`.
