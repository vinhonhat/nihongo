// games/nihongo/data/specialized/index.js
// Từ điển chuyên ngành V1.3.0
// Thêm ngành mới: tạo file .js riêng, thêm field vào NIHONGO_SPECIALIZED_FIELDS,
// rồi thêm <script> trong index.html và js/core.js nếu muốn cache offline.

window.NIHONGO_SPECIALIZED_FIELDS = [
    { id: 'daily', label: 'Đời sống', icon: '🏠' },
    { id: 'it', label: 'IT-Máy tính', icon: '💻' },
    { id: 'factory', label: 'Nhà máy-Sản xuất', icon: '🏭' },
    { id: 'office', label: 'Văn phòng-Kế toán', icon: '📊' },
    { id: 'combini', label: 'Combini-Bán hàng', icon: '🏪' },
    { id: 'medical', label: 'Y tế & Điều dưỡng', icon: '🏥' },
    { id: 'construction', label: 'xây dựng', icon: '🏗️' },
    { id: 'mechanical', label: 'cơ khí-kỹ thuật', icon: '⚙️' },
    { id: 'driving', label: 'lái xe-giao nhận', icon: '🚚' },
    { id: 'hotel', label: 'khách sạn', icon: '🏨' },
    { id: 'restaurant', label: 'nhà hàng', icon: '🍽️' },
    { id: 'food_drink', label: 'ăn uống', icon: '🥤' },
    { id: 'food', label: 'thực phẩm-nhà máy thực phẩm', icon: '🏭' },
     { id: 'work_study', label: 'Học tập-Công việc', icon: '🎓' }
];

window.NIHONGO_SPECIALIZED_DATA = window.NIHONGO_SPECIALIZED_DATA || {};