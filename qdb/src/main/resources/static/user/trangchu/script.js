// JavaScript để xử lý chức năng đặt sân, tìm kiếm, đăng nhập, v.v.
document.addEventListener('DOMContentLoaded', function() {
    // Tìm tất cả các phần tử có class 'cta-button'
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    // Thêm event listener cho mỗi nút
    ctaButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Vui lòng đăng nhập để sử dụng dịch vụ.');
        });
    });

    document.getElementById("s").addEventListener("click", function(event) {
        event.preventDefault(); // Ngăn chuyển hướng
        alert("Vui lòng đăng nhập");
    });

    document.getElementById("t").addEventListener("click", function(event) {
        event.preventDefault(); // Ngăn chuyển hướng
        alert("Vui lòng đăng nhập");
    });
});
