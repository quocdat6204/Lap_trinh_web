// JavaScript để xử lý chức năng đặt sân, tìm kiếm, đăng nhập, v.v.
document.addEventListener('DOMContentLoaded', function() {
    // Tìm tất cả các phần tử có class 'cta-button'
    // const ctaButtons = document.querySelectorAll('.cta-button');
    
    // Thêm event listener cho mỗi nút
    // ctaButtons.forEach(function(button) {
    //     button.addEventListener('click', function(e) {
    //         e.preventDefault();
    //         alert('Vui lòng đăng nhập để sử dụng dịch vụ.');
    //     });
    // });

    // Xử lý dropdown menu
    const avatarButton = document.getElementById('avatarButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (avatarButton && dropdownMenu) {
        // Hiển thị/ẩn dropdown khi click vào avatar
        avatarButton.addEventListener('click', function(event) {
            event.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
        
        // Ẩn dropdown khi click bất kỳ đâu khác trên trang
        document.addEventListener('click', function(event) {
            if (!dropdownMenu.contains(event.target) && event.target !== avatarButton) {
                dropdownMenu.classList.remove('show');
            }
        });
    }
});
