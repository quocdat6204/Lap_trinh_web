document.addEventListener('DOMContentLoaded', function() {
    // Xử lý nút hiển thị/ẩn mật khẩu
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            // Thay đổi biểu tượng
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    });
    
    // Xử lý submit form
    const registerForm = document.querySelector('.register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Lấy giá trị từ form
            const lastName = document.getElementById('lastName').value;
            const firstName = document.getElementById('firstName').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Kiểm tra đầu vào
            if (!lastName || !firstName) {
                alert('Vui lòng nhập đầy đủ họ và tên');
                return;
            }
            
            if (!username) {
                alert('Vui lòng nhập tên đăng nhập');
                return;
            }
            
            if (!password) {
                alert('Vui lòng nhập mật khẩu');
                return;
            }
            
            if (password.length < 8) {
                alert('Mật khẩu phải có ít nhất 8 kí tự');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Mật khẩu nhập lại không khớp');
                return;
            }
            
            // Trong thực tế, bạn sẽ gửi dữ liệu đến server để đăng ký
            console.log('Đăng ký với:', {
                lastName,
                firstName,
                username,
                password
            });
            
            // Chuyển hướng sau khi đăng ký thành công (ví dụ)
            // window.location.href = 'login.html';
            
            alert('Đăng ký thành công!');
        });
    }
});
