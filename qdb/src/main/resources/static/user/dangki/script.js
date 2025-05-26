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
            
            // Tạo đối tượng dữ liệu để gửi lên server
            const userData = {
                lastName: lastName,
                firstName: firstName,
                username: username,
                password: password,
                confirmPassword: confirmPassword
            };
            
            // Gửi request đến API bằng Fetch API
            fetch('http://localhost:8080/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
            .then(response => {
                // Xử lý phản hồi từ server
                if (!response.ok) {
                    // Nếu server trả về lỗi
                    return response.json().then(err => { throw err; });
                }
                return response.json();
            })
            .then(data => {
                // Xử lý khi đăng ký thành công
                alert('Đăng ký thành công!');
                window.location.href = '../dangnhap/index.html'; // Chuyển hướng đến trang đăng nhập
            })
            .catch(error => {
                // Xử lý khi có lỗi
                alert('Lỗi: ' + (error.error || 'Không thể đăng ký'));
                console.error('Lỗi:', error);
            });
        });
    }
});
