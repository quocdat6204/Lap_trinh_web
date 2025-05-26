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
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;

    const pageSize = getPageSize();
    const filterType = getFilterType();
    const tbody = document.getElementById('bookingsBody');
    tbody.innerHTML = '<tr><td colspan="7">Đang tải...</td></tr>';
    
    try {
        // Gọi API lấy danh sách booking
        let url = `/api/bookings/user/${currentUser.id}/paginated?page=${page}&size=${pageSize}&sortBy=id&sortDirection=desc`;
        if (filterType !== 'ALL') {
            url += `&type=${filterType}`; // Thêm tham số type thay vì bookingType
        }

        const res = await fetch(url, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        if (!res.ok) throw new Error('Không thể lấy danh sách đã thuê');
        const data = await res.json();
        tbody.innerHTML = '';

        if (!data.bookings || data.bookings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Bạn chưa có đơn thuê nào.</td></tr>';
            renderPagination(0, 1);
            return;
        }

        // Lọc dữ liệu theo loại booking nếu cần
        let filteredBookings = data.bookings;
        if (filterType !== 'ALL') {
            filteredBookings = data.bookings.filter(booking => booking.bookingType === filterType);
        }

        for (const booking of filteredBookings) {
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
                statusText = 'Chờ xác nhận';
                statusClass = 'status-pending';
            } else if (status === 'SUCCESS') {
                statusText = 'Đã thanh toán';
                statusClass = 'status-success';
            } else if (status === 'FAILED') {
                statusText = 'Đã hủy';
                statusClass = 'status-failed';
            } else {
                statusText = status;
            }

            tbody.innerHTML += `
                <tr>
                    <td>${type}</td>
                    <td>${name}</td>
                    <td>${day}</td>
                    <td>${time}</td>
                    <td>${price}</td>
                    <td>${regTime}</td>
                    <td><span class="${statusClass}">${statusText}</span></td>
                </tr>
            `;
        }
        renderPagination(data.currentPage, data.totalPages);
    } catch (error) {
        console.error('Error loading bookings:', error);
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:red;">Có lỗi xảy ra khi tải dữ liệu.</td></tr>';
        renderPagination(0, 1);
    }
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

