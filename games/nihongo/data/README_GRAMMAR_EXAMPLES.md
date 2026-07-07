# Cách thêm nhiều ví dụ cho từng mẫu ngữ pháp

Từ bản patch này, màn **Ngữ pháp** sẽ hiện 1 ví dụ mặc định. Khi người học bấm **Ví dụ thêm**, app sẽ bung thêm nhiều ví dụ.

Bạn thêm ví dụ trực tiếp trong từng file bài:

```text
games/nihongo/data/n5/lesson01.js
games/nihongo/data/n4/lesson01.js
games/nihongo/data/n3/lesson01.js
games/nihongo/data/n2/lesson01.js
games/nihongo/data/n1/lesson01.js
```

## 1. Form ngữ pháp chuẩn

Trong mảng `grammar`, mỗi mẫu nên viết như sau:

```js
{
    "pattern": "〜ながら",
    "vi": "Vừa làm A vừa làm B",
    "en": "while doing",

    // Ví dụ chính: hiện ngay ở card ngữ pháp
    "example": "音楽を聞きながら勉強します。",
    "reading": "おんがくを ききながら べんきょうします。",
    "exampleVi": "Tôi vừa nghe nhạc vừa học.",
    "highlight": "聞きながら",

    // Ví dụ mở rộng: chỉ hiện khi bấm Ví dụ thêm
    "examples": [
        {
            "jp": "テレビを見ながらご飯を食べます。",
            "reading": "テレビを みながら ごはんを たべます。",
            "vi": "Tôi vừa xem tivi vừa ăn cơm.",
            "en": "I eat while watching TV.",
            "highlight": "見ながら"
        },
        {
            "jp": "電話しながら運転しないでください。",
            "reading": "でんわしながら うんてんしないでください。",
            "vi": "Xin đừng vừa gọi điện vừa lái xe.",
            "en": "Please do not drive while talking on the phone.",
            "highlight": "電話しながら"
        }
    ]
}
```

## 2. Giải thích các trường

- `pattern`: mẫu ngữ pháp, ví dụ `〜ながら`.
- `vi`: nghĩa tiếng Việt của mẫu.
- `en`: nghĩa tiếng Anh ngắn.
- `example`: ví dụ chính, hiện ngay ngoài danh sách.
- `reading`: cách đọc Hiragana của ví dụ chính.
- `exampleVi`: nghĩa tiếng Việt của ví dụ chính.
- `highlight`: phần cần tô đậm trong câu ví dụ.
- `examples`: danh sách ví dụ mở rộng. Mỗi ví dụ có thể có `jp`, `reading`, `vi`, `en`, `highlight`.

## 3. Nếu chưa thêm `examples` thì sao?

Nếu `examples` chưa có, app sẽ tự lấy vài câu trong mảng `sentence` cùng bài để hiện ở phần **Ví dụ thêm trong bài**.

Ví dụ trong cùng file bài:

```js
"sentence": [
    {
        "jp": "ご飯を食べてから、学校へ行きます。",
        "reading": "ごはんを たべてから、がっこうへ いきます。",
        "vi": "Sau khi ăn cơm, tôi đi học.",
        "en": "After eating, I go to school.",
        "parts": ["ご飯を", "食べてから", "学校へ", "行きます"]
    }
]
```

Cách tốt nhất vẫn là thêm `examples` trực tiếp trong từng mẫu ngữ pháp, vì như vậy ví dụ sẽ đúng chính xác với mẫu đó.

## 4. Không cần sửa JS khi thêm ví dụ

Sau này bạn chỉ cần sửa file `lessonXX.js`, thêm `examples` vào mẫu ngữ pháp. App sẽ tự đọc và hiển thị.
