V1.3.3 - Contribution & Contact Update

1. Form đóng góp từ vựng
- Thêm popup đóng góp từ vựng trong app.
- Gửi dữ liệu đóng góp vào Google Form riêng.
- Kết nối các trường:
  + Từ tiếng Nhật
  + Cách đọc kana
  + Romaji
  + Nghĩa tiếng Việt
  + Nghĩa tiếng Anh
  + Chuyên ngành
  + Từ khóa liên quan
  + Ví dụ tiếng Nhật
  + Dịch ví dụ
  + Ghi chú
  + Tên người đóng góp
  + Nguồn tham khảo
- Đổi nhãn “Tags” trong app thành “Từ khóa liên quan” để người dùng dễ hiểu.
- Giữ nguyên name="tags" để không ảnh hưởng logic gửi dữ liệu.

2. Lưu nháp đóng góp
- Thêm lưu tạm nội dung đóng góp bằng localStorage.
- Nếu người dùng thoát form khi chưa gửi, lần sau mở lại sẽ hỏi:
  + Tiếp tục bản nháp
  + Hoặc tạo đóng góp mới
- Chỉ lưu nháp khi người dùng đã nhập nội dung thật.
- Không lưu nháp giả khi chỉ có chuyên ngành mặc định.

3. Trường bắt buộc
- Đánh dấu các trường bắt buộc bằng chữ đỏ và dấu ＊.
- Các trường bắt buộc gồm:
  + Từ tiếng Nhật
  + Cách đọc kana
  + Romaji
  + Nghĩa tiếng Việt
  + Chuyên ngành
- Thêm chú thích “＊ Các mục màu đỏ là bắt buộc”.

4. Chuyên ngành trong form đóng góp
- Trường chuyên ngành cho phép vừa chọn từ danh sách vừa tự nhập.
- Danh sách chuyên ngành lấy từ window.NIHONGO_SPECIALIZED_FIELDS trong data/specialized/index.js.
- Có fallback nếu index.js chưa tải:
  + IT / Máy tính
  + Nhà máy / Sản xuất
  + Văn phòng / Kế toán
  + Combini / Bán hàng
  + Đời sống

5. Form liên hệ / góp ý
- Tách riêng form liên hệ/góp ý, không dùng chung với form đóng góp từ vựng.
- Form liên hệ gồm:
  + Tên của bạn
  + Email
  + Số điện thoại
  + Nội dung góp ý / liên hệ
- Bắt buộc:
  + Tên của bạn
  + Nội dung góp ý / liên hệ
- Email và số điện thoại không bắt buộc.
- Gửi dữ liệu vào Google Form liên hệ riêng.

6. Phần Cài đặt / Thông tin
- Thay dòng liên hệ dạng link bằng nút “Liên hệ & góp ý”.
- Nút gọi openNihongoContactModal().
- Căn giữa nút liên hệ trong khung thông tin.
- Thêm class riêng:
  + settings-contact-action
  + settings-contact-btn

7. File có thay đổi
- index.html
- js/game-menu.js
- css/style.css
- version.json