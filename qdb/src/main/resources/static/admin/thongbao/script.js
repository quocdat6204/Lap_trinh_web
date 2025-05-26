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

    // Xử lý chọn số booking/trang
    const pageSizeSelect = document.getElementById('pageSizeSelect');
    pageSizeSelect.addEventListener('change', function() {
        loadBookings(0);
    });

    // Xử lý lọc theo loại booking
    const filterTypeSelect = document.getElementById('filterTypeSelect');
    if (filterTypeSelect) {
        filterTypeSelect.addEventListener('change', function() {
            loadBookings(0);
        });
    }

    // Render bookings
    loadBookings(0);
});

function getPageSize() {
    const sel = document.getElementById('pageSizeSelect');
    return sel ? parseInt(sel.value) : 10;
}

function getFilterType() {
    const sel = document.getElementById('filterTypeSelect');
    return sel ? sel.value : 'ALL';
}

async function loadBookings(page) {
    const pageSize = getPageSize();
    const filterType = getFilterType();
    const tbody = document.getElementById('bookingsBody');
    tbody.innerHTML = '<tr><td colspan="8">Đang tải...</td></tr>';
    
    const res = await fetch(`/api/bookings/paginated?page=${page}&size=${pageSize}&sortBy=id&sortDirection=desc`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });
    const data = await res.json();
    tbody.innerHTML = '';

    // Lọc dữ liệu theo loại booking
    let filteredBookings = data.bookings;
    if (filterType !== 'ALL') {
        filteredBookings = data.bookings.filter(booking => booking.bookingType === filterType);
    }

    for (const booking of filteredBookings) {
        // Lấy thông tin user
        let userName = '';
        try {
            const userRes = await fetch(`/api/users/${booking.userId}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            if (userRes.ok) {
                const user = await userRes.json();
                userName = user.firstName + ' ' + user.lastName;
            }
        } catch {}
        // Loại booking
        let type = booking.bookingType === 'COURT' ? 'Sân' : 'Vợt';
        // Tên sân/vợt
        let name = '';
        try {
            if (!booking.itemName) {
                name = 'Đã bị xóa';
            } else if (booking.bookingType === 'COURT') {
                const courtRes = await fetch(`/api/courts/${booking.itemName}`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });
                if (courtRes.ok) {
                    const court = await courtRes.json();
                    name = court.name;
                } else {
                    name = 'Đã bị xóa';
                }
            } else if (booking.bookingType === 'RACKET') {
                const racketRes = await fetch(`/api/rackets/${booking.itemName}`, {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });
                if (racketRes.ok) {
                    const racket = await racketRes.json();
                    name = racket.name;
                } else {
                    name = 'Đã bị xóa';
                }
            }
        } catch (error) {
            console.error('Error fetching item name:', error);
            name = 'Đã bị xóa';
        }
        // Ngày
        let day = booking.itemDate || '';
        // Giờ
        let time = booking.itemTime || '';
        // Thành tiền
        let price = booking.totalPrice ? booking.totalPrice.toLocaleString('vi-VN') + 'đ' : '';
        // Thời gian đăng ký
        let regTime = booking.bookingDate ? new Date(booking.bookingDate).toLocaleString('vi-VN') : '';
        // Trạng thái
        let status = booking.status;
        let statusText = '';
        let statusClass = '';
        if (status === 'PENDING') {
            statusText = 'Đang xử lý';
            statusClass = 'status-pending';
        } else if (status === 'SUCCESS') {
            statusText = 'Thành công';
            statusClass = 'status-success';
        } else if (status === 'FAILED') {
            statusText = 'Đã hủy';
            statusClass = 'status-failed';
        } else {
            statusText = status;
        }
        // Nút xử lý
        let actionHtml = '';
        if (status === 'PENDING') {
            actionHtml = `
                <button class="accept-btn" data-id="${booking.id}">Chấp nhận</button>
                <button class="reject-btn" data-id="${booking.id}">Từ chối</button>
            `;
        }
        tbody.innerHTML += `
            <tr>
                <td>${userName}</td>
                <td>${type}</td>
                <td>${name}</td>
                <td>${day}</td>
                <td>${time}</td>
                <td>${price}</td>
                <td>${regTime}</td>
                <td><span class="${statusClass}">${statusText}</span></td>
                <td>${actionHtml}</td>
            </tr>
        `;
    }
    renderPagination(data.currentPage, data.totalPages);
    // Gán sự kiện cho nút xử lý
    document.querySelectorAll('.accept-btn').forEach(btn => {
        btn.onclick = async function() {
            await fetch(`/api/bookings/confirm/${btn.dataset.id}?accept=true`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            loadBookings(data.currentPage);
        };
    });
    document.querySelectorAll('.reject-btn').forEach(btn => {
        btn.onclick = async function() {
            await fetch(`/api/bookings/confirm/${btn.dataset.id}?accept=false`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            loadBookings(data.currentPage);
        };
    });
}

function renderPagination(currentPage, totalPages) {
    const pag = document.getElementById('pagination');
    let html = '';
    if (totalPages > 1) {
        html += `<button ${currentPage === 0 ? 'disabled' : ''} onclick="loadBookings(${currentPage - 1})">&laquo; Trước</button>`;
        for (let i = 0; i < totalPages; i++) {
            html += `<button class="${i === currentPage ? 'active' : ''}" onclick="loadBookings(${i})">${i + 1}</button>`;
        }
        html += `<button ${currentPage === totalPages - 1 ? 'disabled' : ''} onclick="loadBookings(${currentPage + 1})">Sau &raquo;</button>`;
    }
    pag.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', function() {
    // Xử lý nút xóa
    const deleteBtns = document.querySelectorAll('.delete-btn');
    
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Bạn có chắc chắn muốn hủy đặt sân/vợt này?')) {
                // Xóa hàng trong bảng (trong thực tế sẽ gọi API để xóa dữ liệu)
                const row = this.closest('tr');
                row.remove();
            }
        });
    });
});

