// games/nihongo/data/specialized/index.js
// Từ điển chuyên ngành V1.3.0
// Thêm ngành mới: tạo file .js riêng, thêm field vào NIHONGO_SPECIALIZED_FIELDS,
// rồi thêm <script> trong index.html và js/core.js nếu muốn cache offline.

window.NIHONGO_SPECIALIZED_FIELDS = [
    { id: 'it', label: 'IT / Máy tính', icon: '💻' },
    { id: 'factory', label: 'Nhà máy / Sản xuất', icon: '🏭' },
    { id: 'office', label: 'Văn phòng / Kế toán', icon: '🧾' },
    { id: 'combini', label: 'Combini / Bán hàng', icon: '🏪' },
    { id: 'daily', label: 'Đời sống', icon: '🏠' }
];

window.NIHONGO_SPECIALIZED_DATA = window.NIHONGO_SPECIALIZED_DATA || {};
