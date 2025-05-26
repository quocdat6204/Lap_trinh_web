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

// Thêm xử lý submit form đổi mật khẩu
document.addEventListener('DOMContentLoaded', function() {
    const passwordForm = document.querySelector('.password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (!currentUser) {
                alert('Bạn chưa đăng nhập!');
                return;
            }
            if (!currentPassword || !newPassword || !confirmPassword) {
                alert('Vui lòng nhập đầy đủ thông tin!');
                return;
            }
            if (newPassword.length < 8) {
                alert('Mật khẩu mới phải có ít nhất 8 ký tự!');
                return;
            }
            if (newPassword !== confirmPassword) {
                alert('Mật khẩu xác nhận không khớp!');
                return;
            }
            try {
                const response = await fetch('/api/users/change-password', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        userId: currentUser.id,
                        currentPassword: currentPassword,
                        newPassword: newPassword,
                        confirmPassword: confirmPassword
                    })
                });
                const data = await response.json();
                if (response.ok) {
                    alert('Đổi mật khẩu thành công!');
                    passwordForm.reset();
                } else {
                    alert('Lỗi: ' + (data.error || 'Không thể đổi mật khẩu!'));
                }
            } catch (error) {
                alert('Lỗi: ' + error.message);
            }
        });
    }
});