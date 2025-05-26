document.addEventListener('DOMContentLoaded', function () {
    // Xử lý các nút 'cta-button'
    const ctaButtons = document.querySelectorAll('.cta-button');
    ctaButtons.forEach(function (button) {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            alert('Vui lòng đăng nhập để sử dụng dịch vụ.');
        });
    });

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

    // Kiểm tra nếu người dùng đã đăng nhập
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
        window.location.href = '../dangnhap/index.html';
        return;
    }
    
    // Cập nhật chữ cái đầu cho avatar
    if (avatarButton && currentUser.lastName) {
        avatarButton.textContent = currentUser.lastName.charAt(0).toUpperCase();
    }
});
