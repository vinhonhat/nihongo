# LOG khôi phục chức năng cho Nihongo Quest V1.2.9.2

Nền sử dụng: `nihongo v1.2.9.1 Full(1).zip`.

Mục tiêu: đối chiếu các patch v1.2.1 → v1.2.9.1 và khôi phục các phần chức năng thật sự bị thiếu trong bản full, không chép đè nguyên file để tránh mất dữ liệu N1/N2/N3/N4/N5 mới.

## Đã thêm/sửa

1. `games/nihongo/nihongo.js` — Khôi phục state chọn câu v1.2.8: NIHONGO_PICK_STATE để đi hết vòng câu hỏi trước khi lặp; NIHONGO_WRONG_REVIEW để lưu câu trả lời sai.
2. `games/nihongo/nihongo.js` — Khôi phục khóa nhận diện câu hỏi v1.2.8 + chống trùng danh sách học/search + hàng đợi ôn lại câu sai.
3. `games/nihongo/nihongo.js` — Thay lại thuật toán chọn câu v1.2.8: không còn random kẹt vài câu lặp liên tục; câu sai được ưu tiên quay lại sau khoảng 10 lượt.
4. `games/nihongo/nihongo.js` — Khôi phục helper luyện Kanji v1.2.5/v1.2.6: đáp án đọc/Kanji dạng bare để không lộ nghĩa hoặc cách đọc phụ.
5. `games/nihongo/nihongo.js` — Bổ sung memoryKey/rawItem cho từ vựng để khi trả lời sai có dữ liệu hiện đáp án đúng và đưa câu đó vào hàng ôn lại.
6. `games/nihongo/nihongo.js` — Bổ sung memoryKey/rawItem cho luyện nghe để sai vẫn hiện lại từ/cách đọc/nghĩa đúng.
7. `games/nihongo/nihongo.js` — Khôi phục luyện Kanji v1.2.5/v1.2.6: trộn 3 dạng hỏi “Kanji → cách đọc”, “cách đọc → Kanji”, “Kanji → nghĩa”; đáp án không lộ nghĩa khi chưa trả lời.
8. `games/nihongo/nihongo.js` — Bổ sung memoryKey/rawItem cho ngữ pháp để trả lời sai hiện đúng mẫu/câu ví dụ và đưa lại câu sai vào hàng ôn.
9. `games/nihongo/nihongo.js` — Bổ sung memoryKey/rawItem cho ghép câu để khi sai có thể hiện câu đúng và ôn lại.
10. `games/nihongo/nihongo.js` — Khôi phục fix v1.2.8 cho tra cứu/search: không gom grammar thêm lần nữa dưới dạng sentence, đồng thời dedupe kết quả học/search.
11. `games/nihongo/nihongo.js` — Khôi phục chức năng v1.2.5: bấm sai sẽ tô nút sai, khóa lựa chọn, tô đáp án đúng, hiện phần giải thích/đáp án đúng và tự sang câu sau khoảng 5 giây.
12. `games/nihongo/nihongo.css` — Bổ sung style v1.2.5 cho nút đúng/sai và style .nihongo-reading-target cho dạng Kanji “nhìn cách đọc → chọn Kanji”.
13. `version.json` — Cập nhật version từ 1.2.9.1-light-fix lên 1.2.9.2-restore-fix để app nhận bản vá tính năng, không chỉ sửa số version.
14. `sw.js` — Đổi cache shell từ v1-2-9-1 sang v1-2-9-2 để trình duyệt/PWA không giữ file cũ làm mất bản vá.
15. `index.html` — Cập nhật chữ version ngoài màn hình mở app sang V1.2.9.2 để dễ nhận biết đã chạy bản đã vá.
16. `games/nihongo/nihongo.js` — Bổ sung render `reading-target` cho dạng Kanji nhìn cách đọc -> chọn Kanji; nếu thiếu đoạn này thì câu hỏi vẫn chạy nhưng không dùng đúng layout chữ đọc.

## Các phần đã kiểm tra và giữ nguyên

- Menu học/luyện, tra cứu theo cấp, chọn lesson, mock test 01–20: bản full đã có nên không chép đè từ patch cũ.
- Dữ liệu N1/N2/N3/N4/N5 mới trong `games/nihongo/data/`: giữ nguyên, không thay bằng dữ liệu patch cũ.
- Các README hướng dẫn thêm ví dụ ngữ pháp/N2/N1/N5: giữ nguyên.
- `js/core.js`: bản full đã có luồng `onWrong`, `wrongDelayMs`, nút sang câu và update-hint nên không thay nguyên file.

## Chức năng cần test sau khi up

1. Vào luyện từ/ngữ pháp/Kanji, cố tình bấm sai: nút sai phải đỏ, đáp án đúng phải xanh, khung đáp án/giải thích hiện ra, rồi tự sang câu.
2. Câu sai sau khoảng vài câu sẽ xuất hiện lại để ôn.
3. Luyện Kanji phải có 3 kiểu: nhìn Kanji chọn đọc, nhìn đọc chọn Kanji, nhìn Kanji chọn nghĩa.
4. Tra cứu toàn bộ không bị lặp cùng một mẫu ngữ pháp thành 2 kết quả giống nhau.

## Ghi chú cache

Bản này đã đổi `version.json` và `CACHE_NAME` trong `sw.js` lên V1.2.9.2 để trình duyệt/PWA tải file mới. Nếu vẫn thấy bản cũ, mở app rồi nhấn cập nhật hoặc xóa cache/service worker một lần.