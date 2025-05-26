// JavaScript để xử lý click vào avatar
document.addEventListener('DOMContentLoaded', function() {
    const avatarButton = document.getElementById('avatarButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    // Hiển thị/ẩn dropdown khi click vào avatar
    avatarButton.addEventListener('click', function(event) {
        dropdownMenu.classList.toggle('show');
        event.stopPropagation();
    });
    
    // Ẩn dropdown khi click bất kỳ đâu khác trên trang
    document.addEventListener('click', function(event) {
        if (!dropdownMenu.contains(event.target) && event.target !== avatarButton) {
            dropdownMenu.classList.remove('show');
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    // Danh sách các card và đường link tương ứng
    const courtLinks = {
        'court-nguyenvanngoc': "C:\\Users\\HP\\Desktop\\web\\admin\\xem chi tiết\\index.html",
        'court-another-id': 'https://example.com/dat-san/another-location',
        // Thêm các card khác ở đây
    };
    
    // Tìm tất cả các court-card
    const courtCards = document.querySelectorAll('.court-card');
    
    // Thêm event listener cho mỗi card
    courtCards.forEach(function(card) {
        // Thêm style cursor pointer
        card.style.cursor = 'pointer';
        
        // Xử lý sự kiện click
        card.addEventListener('click', function() {
            // Lấy ID của card
            const cardId = this.id;
            
            // Kiểm tra xem card có trong danh sách không
            if (courtLinks[cardId]) {
                // Chuyển hướng người dùng đến trang đặt sân
                window.location.href = courtLinks[cardId];
            } else {
                // Xử lý cho các card không có trong danh sách
                // Có thể chuyển đến trang mặc định hoặc hiển thị thông báo
                alert('Vui lòng đăng nhập để đặt sân này.');
            }
        });
    });
});
