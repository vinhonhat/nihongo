# Ghi chú thêm ví dụ ngữ pháp

Trong từng `lessonXX.js`, mỗi mục trong mảng `grammar` có thể thêm trường `examples` để app hiện nhiều ví dụ khi bấm **Ví dụ thêm**.

Mẫu chuẩn:

```js
{
    "pattern": "〜ながら",
    "vi": "Vừa làm A vừa làm B",
    "en": "while doing",
    "example": "音楽を聞きながら勉強します。",
    "reading": "おんがくを ききながら べんきょうします。",
    "exampleVi": "Tôi vừa nghe nhạc vừa học.",
    "highlight": "聞きながら",
    "examples": [
        {
            "jp": "テレビを見ながらご飯を食べます。",
            "reading": "テレビを みながら ごはんを たべます。",
            "vi": "Tôi vừa xem tivi vừa ăn cơm.",
            "en": "I eat while watching TV.",
            "highlight": "見ながら"
        }
    ]
}
```

Nếu chưa có `examples`, app sẽ lấy thêm vài câu trong `sentence` cùng bài để hiện ở phần **Ví dụ thêm trong bài**.
