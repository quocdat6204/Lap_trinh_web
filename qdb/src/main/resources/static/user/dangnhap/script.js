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
            
            // Tạo đối tượng dữ liệu để gửi lên server
            const loginData = {
                username: username,
                password: password
            };
            
            // Gửi request đến API
            fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; });
                }
                return response.json();
            })
            .then(data => {
                console.log('Đăng nhập thành công:', data);
                
                // Lưu thông tin người dùng và token vào localStorage
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                
                // Kiểm tra role và chuyển hướng đến trang phù hợp
                // if (data.user.role === 'ADMIN') {
                //     window.location.href = '../../admin/trangchu/index.html';
                // } else {
                //     window.location.href = '../trangchu1/index.html';
                // }
                if (data.user.role === 'USER') {
                    window.location.href = '../trangchu1/index.html';
                } else{
                    alert('Bạn không có quyền truy cập vào trang này');
                }
            })
            .catch(error => {
                alert('Lỗi: Sai tên đăng nhập hoặc mật khẩu')
                //alert('Lỗi: ' + (error.error || 'Không thể đăng nhập'));
                console.error('Lỗi:', error);
            });
        });
    }
});
