// games/nihongo/nihongo.js
// Bộ bài học tiếng Nhật dùng chung cho Nihongo Quest V3.2.
// Có bộ nhớ câu hỏi gần nhất để tránh lặp liên tục.

const NIHONGO_LEVEL_NAME = { intro: 'Nhập môn', n5: 'N5', n4: 'N4', n3: 'N3', n2: 'N2', n1: 'N1' };
const NIHONGO_KANA = [
    {
        "jp": "あ",
        "romaji": "a",
        "vi": "a",
        "type": "Hiragana"
    },
    {
        "jp": "い",
        "romaji": "i",
        "vi": "i",
        "type": "Hiragana"
    },
    {
        "jp": "う",
        "romaji": "u",
        "vi": "u",
        "type": "Hiragana"
    },
    {
        "jp": "え",
        "romaji": "e",
        "vi": "e",
        "type": "Hiragana"
    },
    {
        "jp": "お",
        "romaji": "o",
        "vi": "o",
        "type": "Hiragana"
    },
    {
        "jp": "か",
        "romaji": "ka",
        "vi": "ka",
        "type": "Hiragana"
    },
    {
        "jp": "き",
        "romaji": "ki",
        "vi": "ki",
        "type": "Hiragana"
    },
    {
        "jp": "く",
        "romaji": "ku",
        "vi": "ku",
        "type": "Hiragana"
    },
    {
        "jp": "け",
        "romaji": "ke",
        "vi": "ke",
        "type": "Hiragana"
    },
    {
        "jp": "こ",
        "romaji": "ko",
        "vi": "ko",
        "type": "Hiragana"
    },
    {
        "jp": "さ",
        "romaji": "sa",
        "vi": "sa",
        "type": "Hiragana"
    },
    {
        "jp": "し",
        "romaji": "shi",
        "vi": "shi",
        "type": "Hiragana"
    },
    {
        "jp": "す",
        "romaji": "su",
        "vi": "su",
        "type": "Hiragana"
    },
    {
        "jp": "せ",
        "romaji": "se",
        "vi": "se",
        "type": "Hiragana"
    },
    {
        "jp": "そ",
        "romaji": "so",
        "vi": "so",
        "type": "Hiragana"
    },
    {
        "jp": "た",
        "romaji": "ta",
        "vi": "ta",
        "type": "Hiragana"
    },
    {
        "jp": "ち",
        "romaji": "chi",
        "vi": "chi",
        "type": "Hiragana"
    },
    {
        "jp": "つ",
        "romaji": "tsu",
        "vi": "tsu",
        "type": "Hiragana"
    },
    {
        "jp": "て",
        "romaji": "te",
        "vi": "te",
        "type": "Hiragana"
    },
    {
        "jp": "と",
        "romaji": "to",
        "vi": "to",
        "type": "Hiragana"
    },
    {
        "jp": "な",
        "romaji": "na",
        "vi": "na",
        "type": "Hiragana"
    },
    {
        "jp": "に",
        "romaji": "ni",
        "vi": "ni",
        "type": "Hiragana"
    },
    {
        "jp": "ぬ",
        "romaji": "nu",
        "vi": "nu",
        "type": "Hiragana"
    },
    {
        "jp": "ね",
        "romaji": "ne",
        "vi": "ne",
        "type": "Hiragana"
    },
    {
        "jp": "の",
        "romaji": "no",
        "vi": "no",
        "type": "Hiragana"
    },
    {
        "jp": "は",
        "romaji": "ha",
        "vi": "ha",
        "type": "Hiragana"
    },
    {
        "jp": "ひ",
        "romaji": "hi",
        "vi": "hi",
        "type": "Hiragana"
    },
    {
        "jp": "ふ",
        "romaji": "fu",
        "vi": "fu",
        "type": "Hiragana"
    },
    {
        "jp": "へ",
        "romaji": "he",
        "vi": "he",
        "type": "Hiragana"
    },
    {
        "jp": "ほ",
        "romaji": "ho",
        "vi": "ho",
        "type": "Hiragana"
    },
    {
        "jp": "ま",
        "romaji": "ma",
        "vi": "ma",
        "type": "Hiragana"
    },
    {
        "jp": "み",
        "romaji": "mi",
        "vi": "mi",
        "type": "Hiragana"
    },
    {
        "jp": "む",
        "romaji": "mu",
        "vi": "mu",
        "type": "Hiragana"
    },
    {
        "jp": "め",
        "romaji": "me",
        "vi": "me",
        "type": "Hiragana"
    },
    {
        "jp": "も",
        "romaji": "mo",
        "vi": "mo",
        "type": "Hiragana"
    },
    {
        "jp": "や",
        "romaji": "ya",
        "vi": "ya",
        "type": "Hiragana"
    },
    {
        "jp": "ゆ",
        "romaji": "yu",
        "vi": "yu",
        "type": "Hiragana"
    },
    {
        "jp": "よ",
        "romaji": "yo",
        "vi": "yo",
        "type": "Hiragana"
    },
    {
        "jp": "ら",
        "romaji": "ra",
        "vi": "ra",
        "type": "Hiragana"
    },
    {
        "jp": "り",
        "romaji": "ri",
        "vi": "ri",
        "type": "Hiragana"
    },
    {
        "jp": "る",
        "romaji": "ru",
        "vi": "ru",
        "type": "Hiragana"
    },
    {
        "jp": "れ",
        "romaji": "re",
        "vi": "re",
        "type": "Hiragana"
    },
    {
        "jp": "ろ",
        "romaji": "ro",
        "vi": "ro",
        "type": "Hiragana"
    },
    {
        "jp": "わ",
        "romaji": "wa",
        "vi": "wa",
        "type": "Hiragana"
    },
    {
        "jp": "を",
        "romaji": "wo",
        "vi": "wo",
        "type": "Hiragana"
    },
    {
        "jp": "ん",
        "romaji": "n",
        "vi": "n",
        "type": "Hiragana"
    },
    {
        "jp": "ア",
        "romaji": "a",
        "vi": "a",
        "type": "Katakana"
    },
    {
        "jp": "イ",
        "romaji": "i",
        "vi": "i",
        "type": "Katakana"
    },
    {
        "jp": "ウ",
        "romaji": "u",
        "vi": "u",
        "type": "Katakana"
    },
    {
        "jp": "エ",
        "romaji": "e",
        "vi": "e",
        "type": "Katakana"
    },
    {
        "jp": "オ",
        "romaji": "o",
        "vi": "o",
        "type": "Katakana"
    },
    {
        "jp": "カ",
        "romaji": "ka",
        "vi": "ka",
        "type": "Katakana"
    },
    {
        "jp": "キ",
        "romaji": "ki",
        "vi": "ki",
        "type": "Katakana"
    },
    {
        "jp": "ク",
        "romaji": "ku",
        "vi": "ku",
        "type": "Katakana"
    },
    {
        "jp": "ケ",
        "romaji": "ke",
        "vi": "ke",
        "type": "Katakana"
    },
    {
        "jp": "コ",
        "romaji": "ko",
        "vi": "ko",
        "type": "Katakana"
    },
    {
        "jp": "サ",
        "romaji": "sa",
        "vi": "sa",
        "type": "Katakana"
    },
    {
        "jp": "シ",
        "romaji": "shi",
        "vi": "shi",
        "type": "Katakana"
    },
    {
        "jp": "ス",
        "romaji": "su",
        "vi": "su",
        "type": "Katakana"
    },
    {
        "jp": "セ",
        "romaji": "se",
        "vi": "se",
        "type": "Katakana"
    },
    {
        "jp": "ソ",
        "romaji": "so",
        "vi": "so",
        "type": "Katakana"
    },
    {
        "jp": "タ",
        "romaji": "ta",
        "vi": "ta",
        "type": "Katakana"
    },
    {
        "jp": "チ",
        "romaji": "chi",
        "vi": "chi",
        "type": "Katakana"
    },
    {
        "jp": "ツ",
        "romaji": "tsu",
        "vi": "tsu",
        "type": "Katakana"
    },
    {
        "jp": "テ",
        "romaji": "te",
        "vi": "te",
        "type": "Katakana"
    },
    {
        "jp": "ト",
        "romaji": "to",
        "vi": "to",
        "type": "Katakana"
    },
    {
        "jp": "ナ",
        "romaji": "na",
        "vi": "na",
        "type": "Katakana"
    },
    {
        "jp": "ニ",
        "romaji": "ni",
        "vi": "ni",
        "type": "Katakana"
    },
    {
        "jp": "ヌ",
        "romaji": "nu",
        "vi": "nu",
        "type": "Katakana"
    },
    {
        "jp": "ネ",
        "romaji": "ne",
        "vi": "ne",
        "type": "Katakana"
    },
    {
        "jp": "ノ",
        "romaji": "no",
        "vi": "no",
        "type": "Katakana"
    },
    {
        "jp": "ハ",
        "romaji": "ha",
        "vi": "ha",
        "type": "Katakana"
    },
    {
        "jp": "ヒ",
        "romaji": "hi",
        "vi": "hi",
        "type": "Katakana"
    },
    {
        "jp": "フ",
        "romaji": "fu",
        "vi": "fu",
        "type": "Katakana"
    },
    {
        "jp": "ヘ",
        "romaji": "he",
        "vi": "he",
        "type": "Katakana"
    },
    {
        "jp": "ホ",
        "romaji": "ho",
        "vi": "ho",
        "type": "Katakana"
    },
    {
        "jp": "マ",
        "romaji": "ma",
        "vi": "ma",
        "type": "Katakana"
    },
    {
        "jp": "ミ",
        "romaji": "mi",
        "vi": "mi",
        "type": "Katakana"
    },
    {
        "jp": "ム",
        "romaji": "mu",
        "vi": "mu",
        "type": "Katakana"
    },
    {
        "jp": "メ",
        "romaji": "me",
        "vi": "me",
        "type": "Katakana"
    },
    {
        "jp": "モ",
        "romaji": "mo",
        "vi": "mo",
        "type": "Katakana"
    },
    {
        "jp": "ヤ",
        "romaji": "ya",
        "vi": "ya",
        "type": "Katakana"
    },
    {
        "jp": "ユ",
        "romaji": "yu",
        "vi": "yu",
        "type": "Katakana"
    },
    {
        "jp": "ヨ",
        "romaji": "yo",
        "vi": "yo",
        "type": "Katakana"
    },
    {
        "jp": "ラ",
        "romaji": "ra",
        "vi": "ra",
        "type": "Katakana"
    },
    {
        "jp": "リ",
        "romaji": "ri",
        "vi": "ri",
        "type": "Katakana"
    },
    {
        "jp": "ル",
        "romaji": "ru",
        "vi": "ru",
        "type": "Katakana"
    },
    {
        "jp": "レ",
        "romaji": "re",
        "vi": "re",
        "type": "Katakana"
    },
    {
        "jp": "ロ",
        "romaji": "ro",
        "vi": "ro",
        "type": "Katakana"
    },
    {
        "jp": "ワ",
        "romaji": "wa",
        "vi": "wa",
        "type": "Katakana"
    },
    {
        "jp": "ヲ",
        "romaji": "wo",
        "vi": "wo",
        "type": "Katakana"
    },
    {
        "jp": "ン",
        "romaji": "n",
        "vi": "n",
        "type": "Katakana"
    }
];
const NIHONGO_BANK = {
    "intro": {
        "vocab": [
            {
                "jp": "こんにちは",
                "reading": "konnichiwa",
                "vi": "Xin chào"
            },
            {
                "jp": "ありがとう",
                "reading": "arigatou",
                "vi": "Cảm ơn"
            },
            {
                "jp": "すみません",
                "reading": "sumimasen",
                "vi": "Xin lỗi / làm phiền"
            },
            {
                "jp": "はい",
                "reading": "hai",
                "vi": "Vâng / đúng"
            },
            {
                "jp": "いいえ",
                "reading": "iie",
                "vi": "Không"
            },
            {
                "jp": "すし",
                "reading": "sushi",
                "vi": "Sushi"
            },
            {
                "jp": "ねこ",
                "reading": "neko",
                "vi": "Con mèo"
            },
            {
                "jp": "みず",
                "reading": "mizu",
                "vi": "Nước"
            },
            {
                "jp": "にほん",
                "reading": "nihon",
                "vi": "Nhật Bản"
            },
            {
                "jp": "ともだち",
                "reading": "tomodachi",
                "vi": "Bạn bè"
            }
        ],
        "kanji": [
            {
                "jp": "日",
                "reading": "にち / ひ",
                "vi": "Ngày, mặt trời"
            },
            {
                "jp": "本",
                "reading": "ほん",
                "vi": "Sách, gốc"
            },
            {
                "jp": "人",
                "reading": "ひと / じん",
                "vi": "Người"
            },
            {
                "jp": "口",
                "reading": "くち",
                "vi": "Miệng"
            },
            {
                "jp": "目",
                "reading": "め",
                "vi": "Mắt"
            },
            {
                "jp": "手",
                "reading": "て",
                "vi": "Tay"
            }
        ],
        "grammar": [
            {
                "jp": "A は B です",
                "vi": "A là B",
                "hint": "Mẫu tự giới thiệu cơ bản"
            },
            {
                "jp": "これは A です",
                "vi": "Đây là A",
                "hint": "Chỉ đồ vật gần người nói"
            },
            {
                "jp": "A ですか",
                "vi": "A phải không?",
                "hint": "Thêm か để tạo câu hỏi"
            },
            {
                "jp": "A じゃありません",
                "vi": "Không phải A",
                "hint": "Phủ định lịch sự"
            },
            {
                "jp": "A の B",
                "vi": "B của A",
                "hint": "の nối danh từ"
            },
            {
                "jp": "A も B です",
                "vi": "A cũng là B",
                "hint": "も nghĩa là cũng"
            }
        ]
    },
    "n5": {
        "vocab": [
            {
                "jp": "学生",
                "reading": "がくせい",
                "vi": "Học sinh / sinh viên"
            },
            {
                "jp": "先生",
                "reading": "せんせい",
                "vi": "Giáo viên"
            },
            {
                "jp": "会社",
                "reading": "かいしゃ",
                "vi": "Công ty"
            },
            {
                "jp": "電車",
                "reading": "でんしゃ",
                "vi": "Tàu điện"
            },
            {
                "jp": "時間",
                "reading": "じかん",
                "vi": "Thời gian"
            },
            {
                "jp": "今日",
                "reading": "きょう",
                "vi": "Hôm nay"
            },
            {
                "jp": "明日",
                "reading": "あした",
                "vi": "Ngày mai"
            },
            {
                "jp": "昨日",
                "reading": "きのう",
                "vi": "Hôm qua"
            },
            {
                "jp": "家族",
                "reading": "かぞく",
                "vi": "Gia đình"
            },
            {
                "jp": "仕事",
                "reading": "しごと",
                "vi": "Công việc"
            },
            {
                "jp": "学校",
                "reading": "がっこう",
                "vi": "Trường học"
            },
            {
                "jp": "駅",
                "reading": "えき",
                "vi": "Nhà ga"
            }
        ],
        "kanji": [
            {
                "jp": "山",
                "reading": "やま",
                "vi": "Núi"
            },
            {
                "jp": "川",
                "reading": "かわ",
                "vi": "Sông"
            },
            {
                "jp": "田",
                "reading": "た",
                "vi": "Ruộng"
            },
            {
                "jp": "一",
                "reading": "いち",
                "vi": "Một"
            },
            {
                "jp": "二",
                "reading": "に",
                "vi": "Hai"
            },
            {
                "jp": "三",
                "reading": "さん",
                "vi": "Ba"
            },
            {
                "jp": "月",
                "reading": "つき / げつ",
                "vi": "Tháng, mặt trăng"
            },
            {
                "jp": "火",
                "reading": "ひ / か",
                "vi": "Lửa"
            },
            {
                "jp": "水",
                "reading": "みず / すい",
                "vi": "Nước"
            },
            {
                "jp": "木",
                "reading": "き / もく",
                "vi": "Cây"
            }
        ],
        "grammar": [
            {
                "jp": "A は B です",
                "vi": "A là B",
                "hint": "Câu danh từ cơ bản"
            },
            {
                "jp": "A に 行きます",
                "vi": "Đi đến A",
                "hint": "に chỉ điểm đến"
            },
            {
                "jp": "A を 食べます",
                "vi": "Ăn A",
                "hint": "を chỉ tân ngữ"
            },
            {
                "jp": "A があります",
                "vi": "Có A",
                "hint": "Dùng với đồ vật/sự việc"
            },
            {
                "jp": "A が 好きです",
                "vi": "Thích A",
                "hint": "が đánh dấu đối tượng thích"
            },
            {
                "jp": "A で B します",
                "vi": "Làm B ở/bằng A",
                "hint": "で chỉ nơi chốn hoặc phương tiện"
            }
        ]
    },
    "n4": {
        "vocab": [
            {
                "jp": "経験",
                "reading": "けいけん",
                "vi": "Kinh nghiệm"
            },
            {
                "jp": "準備",
                "reading": "じゅんび",
                "vi": "Chuẩn bị"
            },
            {
                "jp": "説明",
                "reading": "せつめい",
                "vi": "Giải thích"
            },
            {
                "jp": "残業",
                "reading": "ざんぎょう",
                "vi": "Tăng ca"
            },
            {
                "jp": "必要",
                "reading": "ひつよう",
                "vi": "Cần thiết"
            },
            {
                "jp": "便利",
                "reading": "べんり",
                "vi": "Tiện lợi"
            },
            {
                "jp": "予約",
                "reading": "よやく",
                "vi": "Đặt trước / đặt lịch"
            },
            {
                "jp": "連絡",
                "reading": "れんらく",
                "vi": "Liên lạc"
            },
            {
                "jp": "故障",
                "reading": "こしょう",
                "vi": "Hỏng hóc"
            },
            {
                "jp": "出発",
                "reading": "しゅっぱつ",
                "vi": "Xuất phát"
            },
            {
                "jp": "到着",
                "reading": "とうちゃく",
                "vi": "Đến nơi"
            },
            {
                "jp": "生活",
                "reading": "せいかつ",
                "vi": "Cuộc sống"
            }
        ],
        "kanji": [
            {
                "jp": "駅",
                "reading": "えき",
                "vi": "Nhà ga"
            },
            {
                "jp": "店",
                "reading": "みせ",
                "vi": "Cửa hàng"
            },
            {
                "jp": "員",
                "reading": "いん",
                "vi": "Nhân viên / thành viên"
            },
            {
                "jp": "新",
                "reading": "しん / あたらしい",
                "vi": "Mới"
            },
            {
                "jp": "古",
                "reading": "ふるい",
                "vi": "Cũ"
            },
            {
                "jp": "早",
                "reading": "はやい",
                "vi": "Sớm / nhanh"
            },
            {
                "jp": "安",
                "reading": "やすい / あん",
                "vi": "Rẻ / an toàn"
            },
            {
                "jp": "高",
                "reading": "たかい",
                "vi": "Cao / đắt"
            }
        ],
        "grammar": [
            {
                "jp": "〜たことがあります",
                "vi": "Đã từng...",
                "hint": "Nói về kinh nghiệm"
            },
            {
                "jp": "〜ながら",
                "vi": "Vừa... vừa...",
                "hint": "Hai hành động cùng lúc"
            },
            {
                "jp": "〜と思います",
                "vi": "Tôi nghĩ rằng...",
                "hint": "Nêu ý kiến"
            },
            {
                "jp": "〜てしまいました",
                "vi": "Lỡ / đã làm mất rồi",
                "hint": "Hoàn tất hoặc tiếc nuối"
            },
            {
                "jp": "〜なければなりません",
                "vi": "Phải...",
                "hint": "Nghĩa vụ cần làm"
            },
            {
                "jp": "〜てもいいです",
                "vi": "Có thể / được phép...",
                "hint": "Xin phép hoặc cho phép"
            }
        ]
    },
    "n3": {
        "vocab": [
            {
                "jp": "確認",
                "reading": "かくにん",
                "vi": "Xác nhận"
            },
            {
                "jp": "対応",
                "reading": "たいおう",
                "vi": "Đối ứng / xử lý"
            },
            {
                "jp": "状況",
                "reading": "じょうきょう",
                "vi": "Tình hình"
            },
            {
                "jp": "原因",
                "reading": "げんいん",
                "vi": "Nguyên nhân"
            },
            {
                "jp": "改善",
                "reading": "かいぜん",
                "vi": "Cải thiện"
            },
            {
                "jp": "提出",
                "reading": "ていしゅつ",
                "vi": "Nộp"
            },
            {
                "jp": "相談",
                "reading": "そうだん",
                "vi": "Trao đổi / tư vấn"
            },
            {
                "jp": "報告",
                "reading": "ほうこく",
                "vi": "Báo cáo"
            },
            {
                "jp": "予定",
                "reading": "よてい",
                "vi": "Dự định / lịch"
            },
            {
                "jp": "変更",
                "reading": "へんこう",
                "vi": "Thay đổi"
            },
            {
                "jp": "資料",
                "reading": "しりょう",
                "vi": "Tài liệu"
            },
            {
                "jp": "担当",
                "reading": "たんとう",
                "vi": "Phụ trách"
            }
        ],
        "kanji": [
            {
                "jp": "確",
                "reading": "かく",
                "vi": "Chắc chắn"
            },
            {
                "jp": "認",
                "reading": "にん",
                "vi": "Nhận biết / xác nhận"
            },
            {
                "jp": "状",
                "reading": "じょう",
                "vi": "Tình trạng"
            },
            {
                "jp": "況",
                "reading": "きょう",
                "vi": "Tình hình"
            },
            {
                "jp": "改",
                "reading": "かい",
                "vi": "Sửa đổi"
            },
            {
                "jp": "善",
                "reading": "ぜん",
                "vi": "Tốt / thiện"
            },
            {
                "jp": "報",
                "reading": "ほう",
                "vi": "Báo tin"
            },
            {
                "jp": "告",
                "reading": "こく",
                "vi": "Thông báo"
            }
        ],
        "grammar": [
            {
                "jp": "〜ようにしています",
                "vi": "Cố gắng duy trì thói quen...",
                "hint": "Thói quen có ý thức"
            },
            {
                "jp": "〜わけではない",
                "vi": "Không hẳn là...",
                "hint": "Phủ định một phần"
            },
            {
                "jp": "〜ばかりでなく",
                "vi": "Không chỉ... mà còn...",
                "hint": "Bổ sung ý"
            },
            {
                "jp": "〜によって",
                "vi": "Tùy theo / bởi...",
                "hint": "Nguồn nguyên nhân hoặc phương thức"
            },
            {
                "jp": "〜ことになっています",
                "vi": "Được quy định là...",
                "hint": "Quy định, lịch đã định"
            },
            {
                "jp": "〜ようとする",
                "vi": "Định / sắp...",
                "hint": "Cố gắng hoặc sắp xảy ra"
            }
        ]
    },
    "n2": {
        "vocab": [
            {
                "jp": "効率",
                "reading": "こうりつ",
                "vi": "Hiệu suất"
            },
            {
                "jp": "方針",
                "reading": "ほうしん",
                "vi": "Phương châm"
            },
            {
                "jp": "課題",
                "reading": "かだい",
                "vi": "Vấn đề / bài toán"
            },
            {
                "jp": "影響",
                "reading": "えいきょう",
                "vi": "Ảnh hưởng"
            },
            {
                "jp": "判断",
                "reading": "はんだん",
                "vi": "Phán đoán"
            },
            {
                "jp": "導入",
                "reading": "どうにゅう",
                "vi": "Đưa vào / áp dụng"
            },
            {
                "jp": "分析",
                "reading": "ぶんせき",
                "vi": "Phân tích"
            },
            {
                "jp": "評価",
                "reading": "ひょうか",
                "vi": "Đánh giá"
            },
            {
                "jp": "制度",
                "reading": "せいど",
                "vi": "Chế độ / hệ thống"
            },
            {
                "jp": "負担",
                "reading": "ふたん",
                "vi": "Gánh nặng"
            },
            {
                "jp": "需要",
                "reading": "じゅよう",
                "vi": "Nhu cầu"
            },
            {
                "jp": "供給",
                "reading": "きょうきゅう",
                "vi": "Cung cấp"
            }
        ],
        "kanji": [
            {
                "jp": "効",
                "reading": "こう",
                "vi": "Hiệu quả"
            },
            {
                "jp": "率",
                "reading": "りつ",
                "vi": "Tỷ lệ"
            },
            {
                "jp": "響",
                "reading": "きょう",
                "vi": "Âm vang / ảnh hưởng"
            },
            {
                "jp": "導",
                "reading": "どう",
                "vi": "Dẫn dắt"
            },
            {
                "jp": "判",
                "reading": "はん",
                "vi": "Phán xét"
            },
            {
                "jp": "析",
                "reading": "せき",
                "vi": "Phân tích"
            },
            {
                "jp": "価",
                "reading": "か",
                "vi": "Giá trị"
            },
            {
                "jp": "制",
                "reading": "せい",
                "vi": "Chế định"
            }
        ],
        "grammar": [
            {
                "jp": "〜に限らず",
                "vi": "Không chỉ giới hạn ở...",
                "hint": "Mở rộng phạm vi"
            },
            {
                "jp": "〜かねない",
                "vi": "Có nguy cơ...",
                "hint": "Kết quả xấu có thể xảy ra"
            },
            {
                "jp": "〜ものの",
                "vi": "Mặc dù...",
                "hint": "Nhượng bộ trang trọng"
            },
            {
                "jp": "〜に伴って",
                "vi": "Cùng với...",
                "hint": "Biến đổi kéo theo"
            },
            {
                "jp": "〜を問わず",
                "vi": "Bất kể...",
                "hint": "Không phân biệt điều kiện"
            },
            {
                "jp": "〜に応じて",
                "vi": "Tùy theo...",
                "hint": "Thay đổi theo tình huống"
            }
        ]
    },
    "n1": {
        "vocab": [
            {
                "jp": "抽象",
                "reading": "ちゅうしょう",
                "vi": "Trừu tượng"
            },
            {
                "jp": "妥当",
                "reading": "だとう",
                "vi": "Thỏa đáng"
            },
            {
                "jp": "推移",
                "reading": "すいい",
                "vi": "Chuyển biến"
            },
            {
                "jp": "顕著",
                "reading": "けんちょ",
                "vi": "Rõ rệt"
            },
            {
                "jp": "是正",
                "reading": "ぜせい",
                "vi": "Chấn chỉnh"
            },
            {
                "jp": "網羅",
                "reading": "もうら",
                "vi": "Bao quát"
            },
            {
                "jp": "緩和",
                "reading": "かんわ",
                "vi": "Nới lỏng / giảm nhẹ"
            },
            {
                "jp": "遂行",
                "reading": "すいこう",
                "vi": "Thực hiện đến cùng"
            },
            {
                "jp": "凝縮",
                "reading": "ぎょうしゅく",
                "vi": "Cô đọng"
            },
            {
                "jp": "普遍",
                "reading": "ふへん",
                "vi": "Phổ quát"
            },
            {
                "jp": "偏見",
                "reading": "へんけん",
                "vi": "Định kiến"
            },
            {
                "jp": "堅実",
                "reading": "けんじつ",
                "vi": "Vững chắc / chắc chắn"
            }
        ],
        "kanji": [
            {
                "jp": "抽",
                "reading": "ちゅう",
                "vi": "Rút ra"
            },
            {
                "jp": "象",
                "reading": "しょう",
                "vi": "Hiện tượng / voi"
            },
            {
                "jp": "妥",
                "reading": "だ",
                "vi": "Thỏa đáng"
            },
            {
                "jp": "顕",
                "reading": "けん",
                "vi": "Hiển hiện"
            },
            {
                "jp": "羅",
                "reading": "ら",
                "vi": "Lưới / sắp bày"
            },
            {
                "jp": "緩",
                "reading": "かん",
                "vi": "Chậm / nới"
            },
            {
                "jp": "遂",
                "reading": "すい",
                "vi": "Hoàn thành"
            },
            {
                "jp": "偏",
                "reading": "へん",
                "vi": "Lệch / thiên"
            }
        ],
        "grammar": [
            {
                "jp": "〜に至るまで",
                "vi": "Cho đến tận...",
                "hint": "Nhấn mạnh phạm vi rộng"
            },
            {
                "jp": "〜を余儀なくされる",
                "vi": "Bị buộc phải...",
                "hint": "Không còn lựa chọn"
            },
            {
                "jp": "〜に堪えない",
                "vi": "Không chịu nổi / rất...",
                "hint": "Sắc thái văn viết"
            },
            {
                "jp": "〜ともなると",
                "vi": "Một khi đã đến mức...",
                "hint": "Điều kiện ở cấp độ cao"
            },
            {
                "jp": "〜までもない",
                "vi": "Không cần phải...",
                "hint": "Không cần làm vì đã rõ"
            },
            {
                "jp": "〜をものともせず",
                "vi": "Không màng đến...",
                "hint": "Vượt qua khó khăn"
            }
        ]
    }
};

const NIHONGO_REPEAT_MEMORY = {};

function nihongoShuffle(arr) {
    return typeof shuffleArray === 'function' ? shuffleArray(arr) : [...arr].sort(() => Math.random() - 0.5);
}

function nihongoRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function nihongoItemKey(item) {
    return [item.jp, item.reading, item.vi, item.romaji, item.type].filter(Boolean).join('|');
}

function nihongoPick(pool, memoryKey, keepCount = 4) {
    if (!Array.isArray(pool) || pool.length === 0) return null;
    const history = NIHONGO_REPEAT_MEMORY[memoryKey] || [];
    const candidates = pool.filter(item => !history.includes(nihongoItemKey(item)));
    const usable = candidates.length ? candidates : pool;
    const item = nihongoRandom(usable);
    const key = nihongoItemKey(item);
    NIHONGO_REPEAT_MEMORY[memoryKey] = [key, ...history.filter(oldKey => oldKey !== key)].slice(0, Math.min(keepCount, Math.max(1, pool.length - 1)));
    return item;
}

function parseNihongoGameId(gameId) {
    if (gameId.indexOf('nihongo_intro_') === 0) return { level: 'intro', mode: gameId.replace('nihongo_intro_', '') };
    const match = gameId.match(/^nihongo_(n[1-5])_(.+)$/);
    return match ? { level: match[1], mode: match[2] } : { level: 'intro', mode: 'quiz' };
}

function getLevelPool(level) {
    return NIHONGO_BANK[level] || NIHONGO_BANK.intro;
}

function buildWrongOptions(correct, list, field) {
    const values = list.map(item => item[field]).filter(value => value && value !== correct);
    const options = new Set([correct]);
    nihongoShuffle(values).forEach(value => { if (options.size < 4) options.add(value); });
    Object.values(NIHONGO_BANK).forEach(group => {
        ['vocab', 'kanji', 'grammar'].forEach(type => {
            (group[type] || []).forEach(item => {
                const value = item[field] || item.vi || item.jp;
                if (options.size < 4 && value && value !== correct) options.add(value);
            });
        });
    });
    return nihongoShuffle(Array.from(options));
}

function buildKanaQuestion(gameId) {
    const onlyKatakana = gameId.indexOf('katakana') >= 0;
    const type = onlyKatakana ? 'Katakana' : 'Hiragana';
    const pool = NIHONGO_KANA.filter(item => item.type === type);
    const item = nihongoPick(pool, 'kana:' + type, 8);
    return { kind: 'kana', title: type, prompt: 'Chữ này đọc là gì?', jp: item.jp, reading: item.romaji, speakText: item.jp, correct: item.romaji, options: buildWrongOptions(item.romaji, pool, 'romaji') };
}

function buildVocabQuestion(level, mode) {
    const pool = getLevelPool(level).vocab;
    const item = nihongoPick(pool, level + ':vocab:' + mode, 5);
    const askJapanese = mode.indexOf('practice') >= 0 || Math.random() < 0.5;
    const correct = askJapanese ? item.vi : item.jp;
    return { kind: 'vocab', title: mode.indexOf('learn') >= 0 ? 'Học từ vựng' : 'Luyện từ vựng', prompt: askJapanese ? 'Nghĩa tiếng Việt là gì?' : 'Chọn từ tiếng Nhật đúng nghĩa.', jp: item.jp, reading: item.reading, vi: item.vi, speakText: item.jp, correct, options: buildWrongOptions(correct, pool, askJapanese ? 'vi' : 'jp') };
}

function buildListeningQuestion(level) {
    const pool = getLevelPool(level).vocab;
    const item = nihongoPick(pool, level + ':listen', 5);
    return { kind: 'listen', title: 'Luyện nghe', prompt: 'Bấm loa nghe từ, rồi chọn nghĩa đúng.', jp: '？？？', reading: 'Nghe trước, xem đáp án sau', vi: item.vi, speakText: item.jp, correct: item.vi, options: buildWrongOptions(item.vi, pool, 'vi') };
}

function buildKanjiQuestion(level) {
    const pool = getLevelPool(level).kanji;
    const item = nihongoPick(pool, level + ':kanji', 4);
    return { kind: 'kanji', title: 'Kanji', prompt: 'Kanji này có nghĩa gì?', jp: item.jp, reading: item.reading, vi: item.vi, speakText: item.reading || item.jp, correct: item.vi, options: buildWrongOptions(item.vi, pool, 'vi') };
}

function buildGrammarQuestion(level, mode) {
    const pool = getLevelPool(level).grammar;
    const item = nihongoPick(pool, level + ':grammar:' + mode, 4);
    return { kind: 'grammar', title: mode === 'sentence' ? 'Mẫu câu' : 'Ngữ pháp', prompt: mode === 'sentence' ? 'Mẫu câu này dùng để nói gì?' : 'Ý nghĩa ngữ pháp là gì?', jp: item.jp, reading: item.hint, vi: item.vi, speakText: item.jp, correct: item.vi, options: buildWrongOptions(item.vi, pool, 'vi') };
}

function buildMockQuestion(level) {
    const builders = [() => buildVocabQuestion(level, 'vocab_practice'), () => buildListeningQuestion(level), () => buildKanjiQuestion(level), () => buildGrammarQuestion(level, 'grammar')];
    const q = nihongoRandom(builders)();
    q.title = 'Thi thử ' + (NIHONGO_LEVEL_NAME[level] || '');
    q.kind = 'mock';
    return q;
}

function buildNihongoQuestion(gameId) {
    const parsed = parseNihongoGameId(gameId);
    const level = parsed.level;
    const mode = parsed.mode;
    if (level === 'intro' && (mode === 'kana' || mode === 'katakana')) return buildKanaQuestion(gameId);
    if (level === 'intro' && mode === 'listen') return buildListeningQuestion('intro');
    if (level === 'intro' && mode === 'quiz') return buildMockQuestion('intro');
    if (mode.indexOf('vocab') >= 0) return buildVocabQuestion(level, mode);
    if (mode === 'listening') return buildListeningQuestion(level);
    if (mode === 'kanji') return buildKanjiQuestion(level);
    if (mode === 'grammar' || mode === 'sentence') return buildGrammarQuestion(level, mode);
    if (mode === 'mock_test') return buildMockQuestion(level);
    return buildVocabQuestion(level, mode);
}

function escapeForClick(text) { return encodeURIComponent(String(text || '')); }

function speakNihongo(text) {
    if (!text || !('speechSynthesis' in window)) return;
    try {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'ja-JP';
        utter.rate = 0.82;
        utter.pitch = 1;
        window.speechSynthesis.speak(utter);
    } catch (err) { console.warn('Không đọc được tiếng Nhật:', err); }
}

function renderNihongoDisplay(data) {
    const showListenMask = data.kind === 'listen' || data.kind === 'mock' && data.title.includes('Thi thử') && data.prompt.includes('nghe');
    const jp = data.kind === 'listen' ? '？？？' : data.jp;
    const hint = data.kind === 'listen' ? 'Bấm nút loa trên thẻ để nghe bằng giọng máy nếu trình duyệt hỗ trợ.' : (data.reading || '');
    return `<div class="nihongo-card nihongo-kind-${data.kind}"><div class="nihongo-card-top"><span class="nihongo-chip">${data.title}</span><button class="nihongo-speak-btn" type="button" onclick="speakNihongo(decodeURIComponent('${escapeForClick(data.speakText)}'))">🔊</button></div><div class="nihongo-prompt">${data.prompt}</div><div class="nihongo-jp">${jp}</div><div class="nihongo-reading">${hint}</div></div>`;
}

function makeNihongoGame(gameId) {
    return {
        questionTimeSec: gameId.indexOf('mock_test') >= 0 ? 22 : 18,
        gridClass: 'nihongo-options-grid',
        generateData() { return buildNihongoQuestion(gameId); },
        renderDisplay(data) {
            setTimeout(() => {
                if (data && (data.kind === 'listen' || data.kind === 'mock')) speakNihongo(data.speakText);
            }, 280);
            return renderNihongoDisplay(data);
        },
        getOptions(data) { return data.options || []; },
        styleOptionBtn(btn, value) {
            btn.textContent = value;
            btn.classList.add('nihongo-option-btn');
            btn.setAttribute('aria-label', 'Đáp án ' + value);
        },
        getAudio() { return []; },
        checkResult(selected, data) { return String(selected) === String(data.correct); }
    };
}

const NIHONGO_GAME_IDS = [
    'nihongo_intro_kana', 'nihongo_intro_katakana', 'nihongo_intro_vocab', 'nihongo_intro_listen', 'nihongo_intro_quiz',
    'nihongo_n5_vocab_learn', 'nihongo_n5_vocab_practice', 'nihongo_n5_listening', 'nihongo_n5_kanji', 'nihongo_n5_grammar', 'nihongo_n5_sentence', 'nihongo_n5_mock_test',
    'nihongo_n4_vocab_learn', 'nihongo_n4_vocab_practice', 'nihongo_n4_listening', 'nihongo_n4_kanji', 'nihongo_n4_grammar', 'nihongo_n4_sentence', 'nihongo_n4_mock_test',
    'nihongo_n3_vocab_learn', 'nihongo_n3_vocab_practice', 'nihongo_n3_listening', 'nihongo_n3_kanji', 'nihongo_n3_grammar', 'nihongo_n3_sentence', 'nihongo_n3_mock_test',
    'nihongo_n2_vocab_learn', 'nihongo_n2_vocab_practice', 'nihongo_n2_listening', 'nihongo_n2_kanji', 'nihongo_n2_grammar', 'nihongo_n2_sentence', 'nihongo_n2_mock_test',
    'nihongo_n1_vocab_learn', 'nihongo_n1_vocab_practice', 'nihongo_n1_listening', 'nihongo_n1_kanji', 'nihongo_n1_grammar', 'nihongo_n1_sentence', 'nihongo_n1_mock_test'
];

NIHONGO_GAME_IDS.forEach(id => registerGame(id, makeNihongoGame(id)));
window.speakNihongo = speakNihongo;
