# Nihongo Quest V1.2.9 - N5 structure + font settings

## Đã chỉnh

- Chuẩn hóa N5 `grammar` và `sentence` vào từng `lessonXX.js` giống cấu trúc N4.
- `games/nihongo/data/n5/grammar.js` chỉ còn là file tương thích, không ghi đè dữ liệu lesson nữa.
- N5 ngữ pháp có thêm `reading` để hiện Hiragana.
- N5 ghép câu dùng `sentence`/`parts`; đáp án chỉ hiện câu tiếng Nhật, không lộ tiếng Việt/English.
- Cài đặt cỡ chữ đáp án mặc định tăng lên `1.1rem`, cho phép tăng tối đa `1.8rem`.
- Các thanh cỡ chữ khác tăng giới hạn tối đa để người mắt kém có thể phóng lớn hơn.

## Cấu trúc N5 chuẩn từ bản này

Trong mỗi file:

```text
games/nihongo/data/n5/lesson01.js
```

Object lesson nên có đủ:

```js
vocab: [],
kanji: [],
grammar: [
  {
    pattern: 'A は B です',
    vi: 'A là B',
    en: 'A is B',
    example: '私は学生です。',
    reading: 'わたしは がくせいです。',
    exampleVi: 'Tôi là học sinh.',
    highlight: 'です',
    hint: 'Câu danh từ cơ bản'
  }
],
listening: [],
sentence: [
  {
    jp: '私は学生です。',
    reading: 'わたしは がくせいです。',
    vi: 'Tôi là học sinh.',
    en: 'I am a student.',
    parts: ['私', 'は', '学生', 'です']
  }
]
```

## Lưu ý cài đặt cũ

Bản này đổi storage key cài đặt sang `nihongo_ui_settings_v1_2_9`, nhưng vẫn đọc key cũ. Nếu cỡ chữ đáp án cũ dưới 1.1 thì sẽ tự nâng lên 1.1.
