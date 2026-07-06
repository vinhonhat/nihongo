window.NIHONGO_DATA = window.NIHONGO_DATA || {};
window.NIHONGO_DATA.n5 = window.NIHONGO_DATA.n5 || {};

// N5 grammar dùng chung cho:
// - Ngữ pháp: hiện ví dụ, phần focus được tô đậm.
// - Mẫu câu: hỏi ý nghĩa mẫu câu.
// - Ghép câu: dùng sentenceParts để tạo bài chọn câu đúng.
// Sau này thêm bài mới chỉ cần giữ các field: jp, pattern, example, focus, vi, hint, sentenceParts.
window.NIHONGO_DATA.n5.grammar = [
  {
    "jp": "A は B です",
    "pattern": "A は B です",
    "example": "私は学生です。",
    "focus": ["は", "です"],
    "vi": "A là B",
    "hint": "Câu danh từ cơ bản",
    "sentenceParts": ["私", "は", "学生", "です"],
    "sentenceVi": "Tôi là học sinh / sinh viên"
  },
  {
    "jp": "A に 行きます",
    "pattern": "Nơi chốn に 行きます",
    "example": "学校に行きます。",
    "focus": ["に", "行きます"],
    "vi": "Đi đến A",
    "hint": "に chỉ điểm đến",
    "sentenceParts": ["学校", "に", "行きます"],
    "sentenceVi": "Tôi đi đến trường"
  },
  {
    "jp": "A を 食べます",
    "pattern": "Tân ngữ を Động từ",
    "example": "ごはんを食べます。",
    "focus": ["を", "食べます"],
    "vi": "Ăn A / làm hành động lên A",
    "hint": "を chỉ tân ngữ",
    "sentenceParts": ["ごはん", "を", "食べます"],
    "sentenceVi": "Tôi ăn cơm"
  },
  {
    "jp": "A があります",
    "pattern": "Đồ vật が あります",
    "example": "部屋に机があります。",
    "focus": ["が", "あります"],
    "vi": "Có A",
    "hint": "Dùng với đồ vật/sự việc",
    "sentenceParts": ["部屋", "に", "机", "が", "あります"],
    "sentenceVi": "Trong phòng có cái bàn"
  },
  {
    "jp": "A が 好きです",
    "pattern": "A が 好きです",
    "example": "日本語が好きです。",
    "focus": ["が", "好きです"],
    "vi": "Thích A",
    "hint": "が đánh dấu đối tượng thích",
    "sentenceParts": ["日本語", "が", "好き", "です"],
    "sentenceVi": "Tôi thích tiếng Nhật"
  },
  {
    "jp": "A で B します",
    "pattern": "Nơi chốn / phương tiện で Động từ",
    "example": "駅で友だちに会います。",
    "focus": ["で", "会います"],
    "vi": "Làm B ở/bằng A",
    "hint": "で chỉ nơi chốn hoặc phương tiện",
    "sentenceParts": ["駅", "で", "友だち", "に", "会います"],
    "sentenceVi": "Tôi gặp bạn ở nhà ga"
  },
  {
    "jp": "A へ 行きます",
    "pattern": "Nơi chốn へ 行きます",
    "example": "日本へ行きます。",
    "focus": ["へ", "行きます"],
    "vi": "Đi về phía/đến A",
    "hint": "へ nhấn hướng di chuyển",
    "sentenceParts": ["日本", "へ", "行きます"],
    "sentenceVi": "Tôi đi Nhật"
  },
  {
    "jp": "A から B まで",
    "pattern": "A から B まで",
    "example": "九時から五時まで働きます。",
    "focus": ["から", "まで"],
    "vi": "Từ A đến B",
    "hint": "Nói khoảng cách/thời gian",
    "sentenceParts": ["九時", "から", "五時", "まで", "働きます"],
    "sentenceVi": "Tôi làm việc từ 9 giờ đến 5 giờ"
  },
  {
    "jp": "A と B",
    "pattern": "A と B",
    "example": "母とスーパーへ行きます。",
    "focus": ["と"],
    "vi": "A và B / cùng với A",
    "hint": "Nối danh từ hoặc người đi cùng",
    "sentenceParts": ["母", "と", "スーパー", "へ", "行きます"],
    "sentenceVi": "Tôi đi siêu thị cùng mẹ"
  },
  {
    "jp": "A ませんか",
    "pattern": "Động từ ませんか",
    "example": "一緒に昼ごはんを食べませんか。",
    "focus": ["ませんか"],
    "vi": "Bạn có muốn A không? / Mời rủ",
    "hint": "Mời rủ lịch sự",
    "sentenceParts": ["一緒に", "昼ごはん", "を", "食べませんか"],
    "sentenceVi": "Bạn có muốn ăn trưa cùng tôi không?"
  },
  {
    "jp": "A ましょう",
    "pattern": "Động từ ましょう",
    "example": "日本語を勉強しましょう。",
    "focus": ["ましょう"],
    "vi": "Cùng A nào",
    "hint": "Đề nghị cùng làm",
    "sentenceParts": ["日本語", "を", "勉強しましょう"],
    "sentenceVi": "Cùng học tiếng Nhật nào"
  },
  {
    "jp": "A たいです",
    "pattern": "Động từ thể ます bỏ ます + たいです",
    "example": "水を飲みたいです。",
    "focus": ["たいです"],
    "vi": "Muốn làm A",
    "hint": "Diễn tả mong muốn",
    "sentenceParts": ["水", "を", "飲みたい", "です"],
    "sentenceVi": "Tôi muốn uống nước"
  },
  {
    "jp": "A てもいいです",
    "pattern": "Động từ thể て + もいいです",
    "example": "ここで写真を撮ってもいいです。",
    "focus": ["てもいいです"],
    "vi": "Được phép làm A",
    "hint": "Xin phép / cho phép",
    "sentenceParts": ["ここ", "で", "写真", "を", "撮ってもいいです"],
    "sentenceVi": "Chụp ảnh ở đây được không?"
  },
  {
    "jp": "A てはいけません",
    "pattern": "Động từ thể て + はいけません",
    "example": "ここでたばこを吸ってはいけません。",
    "focus": ["てはいけません"],
    "vi": "Không được làm A",
    "hint": "Cấm đoán",
    "sentenceParts": ["ここ", "で", "たばこ", "を", "吸ってはいけません"],
    "sentenceVi": "Không được hút thuốc ở đây"
  },
  {
    "jp": "A ています",
    "pattern": "Động từ thể て + います",
    "example": "今、日本語を勉強しています。",
    "focus": ["ています"],
    "vi": "Đang làm A / trạng thái",
    "hint": "Thể て + います",
    "sentenceParts": ["今", "日本語", "を", "勉強しています"],
    "sentenceVi": "Bây giờ tôi đang học tiếng Nhật"
  },
  {
    "jp": "A たほうがいいです",
    "pattern": "Động từ thể た + ほうがいいです",
    "example": "早く寝たほうがいいです。",
    "focus": ["たほうがいいです"],
    "vi": "Nên làm A",
    "hint": "Khuyên nhủ",
    "sentenceParts": ["早く", "寝た", "ほうがいいです"],
    "sentenceVi": "Bạn nên ngủ sớm"
  }
];
