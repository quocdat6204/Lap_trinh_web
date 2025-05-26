document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            // Thay đổi kiểu input giữa 'password' và 'text'
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Thay đổi biểu tượng
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
        });
    }
    
    // Xử lý submit form
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Kiểm tra đầu vào
            if (!username) {
                alert('Vui lòng nhập tên đăng nhập');
                return;
            }
            
            if (!password) {
                alert('Vui lòng nhập mật khẩu');
                return;
            }
            
            // Trong thực tế, bạn sẽ gửi dữ liệu đến server để xác thực
            console.log('Đăng nhập với:', username, password);
            
            // Chuyển hướng sau khi đăng nhập thành công (ví dụ)
            // window.location.href = 'trang-chu.html';
        });
    }
});


