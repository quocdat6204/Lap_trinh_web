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
    // Xử lý nút xóa
    const deleteBtns = document.querySelectorAll('.delete-btn');
    
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Bạn có chắc chắn muốn hủy đặt sân/vợt này?')) {
                // Xóa hàng trong bảng (trong thực tế sẽ gọi API để xóa dữ liệu)
                const row = this.closest('tr');
                row.remove();
            }
        });
    });
});

