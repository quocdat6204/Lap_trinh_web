// Biến toàn cục để lưu trạng thái phân trang
let currentPage = 0;
let totalPages = 1;
let pageSize = 10;
let sortBy = 'id';
let sortDirection = 'asc';

// Hàm tải dữ liệu người dùng
async function loadUsers(page = 0) {
    try {
        const response = await fetch(`/api/users/paginated?page=${page}&size=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        if (!response.ok) {
            throw new Error('Không thể tải dữ liệu người dùng');
        }
        
        const data = await response.json();
        displayUsers(data.users);
        updatePagination(data.currentPage, data.totalPages);
        
        // Cập nhật biến toàn cục
        currentPage = data.currentPage;
        totalPages = data.totalPages;
    } catch (error) {
        console.error('Lỗi:', error);
        alert('Không thể tải dữ liệu người dùng');
    }
}

// Hàm hiển thị danh sách người dùng
function displayUsers(users) {
    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = '';
    
    users.forEach((user, index) => {
        const row = document.createElement('tr');
        if (index % 2 === 0) {
            row.classList.add('row-colored');
        }
        
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.lastName}</td>
            <td>${user.firstName}</td>
            <td>${user.username}</td>
            <td>
                <span class="password-hidden">******</span>
                <button class="password-toggle-btn" data-password="${user.password}">
                    <i class="fas fa-eye-slash"></i>
                </button>
            </td>
            <td>
                <button class="delete-btn" data-user-id="${user.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Thêm event listeners cho các nút
    addEventListeners();
}

// Hàm cập nhật trạng thái phân trang
function updatePagination(currentPage, totalPages) {
    const pageInfo = document.getElementById('pageInfo');
    const prevBtn = document.getElementById('prevPage');
    const nextBtn = document.getElementById('nextPage');
    
    pageInfo.textContent = `Trang ${currentPage + 1} / ${totalPages}`;
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === totalPages - 1;
}

// Hàm thêm event listeners
function addEventListeners() {
    // Xử lý nút hiển thị/ẩn mật khẩu
    const passwordToggleBtns = document.querySelectorAll('.password-toggle-btn');
    passwordToggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const passwordSpan = this.previousElementSibling;
            const icon = this.querySelector('i');
            const actualPassword = this.dataset.password;
            
            if (passwordSpan.classList.contains('password-hidden')) {
                passwordSpan.textContent = actualPassword;
                passwordSpan.classList.remove('password-hidden');
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            } else {
                passwordSpan.textContent = '******';
                passwordSpan.classList.add('password-hidden');
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            }
        });
    });
    
    // Xử lý nút xóa
    const deleteBtns = document.querySelectorAll('.delete-btn');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', async function() {
            const userId = this.dataset.userId;
            if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
                try {
                    const response = await fetch(`/api/users/${userId}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error('Không thể xóa người dùng');
                    }
                    
                    const data = await response.json();
                    alert(data.message);
                    
                    // Tải lại danh sách người dùng
                    loadUsers(currentPage);
                } catch (error) {
                    console.error('Lỗi:', error);
                    alert('Lỗi: ' + error.message);
                }
            }
        });
    });
}

// Xử lý sự kiện khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    // Tải dữ liệu ban đầu
    loadUsers();
    
    // Xử lý nút phân trang
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 0) {
            loadUsers(currentPage - 1);
        }
    });
    
    document.getElementById('nextPage').addEventListener('click', () => {
        if (currentPage < totalPages - 1) {
            loadUsers(currentPage + 1);
        }
    });
    
    // Xử lý các tùy chọn
    document.getElementById('pageSize').addEventListener('change', function() {
        pageSize = parseInt(this.value);
        currentPage = 0; // Reset về trang đầu tiên
        loadUsers(currentPage);
    });
    
    document.getElementById('sortBy').addEventListener('change', function() {
        sortBy = this.value;
        currentPage = 0; // Reset về trang đầu tiên
        loadUsers(currentPage);
    });
    
    document.getElementById('sortDirection').addEventListener('change', function() {
        sortDirection = this.value;
        currentPage = 0; // Reset về trang đầu tiên
        loadUsers(currentPage);
    });
    
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
