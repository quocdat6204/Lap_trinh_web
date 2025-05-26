// JavaScript để xử lý click vào avatar
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra nếu người dùng đã đăng nhập
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        // Nếu chưa đăng nhập, chuyển hướng về trang đăng nhập
        window.location.href = '../dangnhap/index.html';
        return;
    }
    
    // Cập nhật chữ cái đầu cho avatar
    const avatarButton = document.getElementById('avatarButton');
    if (avatarButton && currentUser.lastName) {
        avatarButton.textContent = currentUser.lastName.charAt(0).toUpperCase();
    }
    
    // Hiển thị/ẩn dropdown khi click vào avatar
    avatarButton.addEventListener('click', function(event) {
        const dropdownMenu = document.getElementById('dropdownMenu');
        dropdownMenu.classList.toggle('show');
        event.stopPropagation();
    });
    
    // Ẩn dropdown khi click bất kỳ đâu khác trên trang
    document.addEventListener('click', function(event) {
        const dropdownMenu = document.getElementById('dropdownMenu');
        if (dropdownMenu && !dropdownMenu.contains(event.target) && event.target !== avatarButton) {
            dropdownMenu.classList.remove('show');
        }
    });
    
    // Xử lý đăng xuất
    const logoutLink = document.querySelector('.dropdown-content a[href="../trangchu/index.html"]');
    if (logoutLink) {
        logoutLink.addEventListener('click', function(event) {
            event.preventDefault();
            // Xóa thông tin người dùng khỏi localStorage
            localStorage.removeItem('currentUser');
            // Chuyển hướng về trang chủ
            window.location.href = '../trangchu/index.html';
        });
    }
    
    // JavaScript để xử lý hiện/ẩn mật khẩu
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    });
    
    // Xử lý submit form đổi mật khẩu
    const passwordForm = document.querySelector('.password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Lấy giá trị từ form
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Kiểm tra đầu vào
            if (!currentPassword) {
                alert('Vui lòng nhập mật khẩu hiện tại');
                return;
            }
            
            if (!newPassword) {
                alert('Vui lòng nhập mật khẩu mới');
                return;
            }
            
            if (newPassword.length < 8) {
                alert('Mật khẩu mới phải có ít nhất 8 ký tự');
                return;
            }
            
            if (newPassword !== confirmPassword) {
                alert('Mật khẩu xác nhận không khớp');
                return;
            }
            
            // Tạo đối tượng dữ liệu để gửi lên server
            const passwordData = {
                userId: currentUser.id,
                currentPassword: currentPassword,
                newPassword: newPassword,
                confirmPassword: confirmPassword
            };
            
            // Hiển thị trạng thái đang xử lý
            const submitButton = passwordForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            submitButton.textContent = 'Đang xử lý...';
            submitButton.disabled = true;
            
            // Gửi request đến API
            fetch('/api/users/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(passwordData)
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => { throw err; });
                }
                return response.json();
            })
            .then(data => {
                // Xử lý thành công
                alert('Đổi mật khẩu thành công!');
                
                // Đặt lại form
                passwordForm.reset();
                
                // Đề xuất đăng nhập lại
                if (confirm('Bạn có muốn đăng nhập lại với mật khẩu mới không?')) {
                    localStorage.removeItem('currentUser');
                    window.location.href = '../dangnhap/index.html';
                }
            })
            .catch(error => {
                // Xử lý lỗi
                alert('Lỗi: ' + (error.error || 'Không thể đổi mật khẩu'));
                console.error('Lỗi:', error);
            })
            .finally(() => {
                // Khôi phục trạng thái nút submit
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
        });
    }
});
