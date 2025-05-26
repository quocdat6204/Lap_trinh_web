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
});

// Đoạn mã này xử lý việc đặt sân/vợt và thanh toán trong ứng dụng web.
// Helper: Lấy query param từ URL
function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

// Biến lưu trữ thông tin sân/vợt
let currentItem = null;
let currentItemType = null; // 'COURT' hoặc 'RACKET'
let selectedDate = '';
let selectedTime = '';
let selectedTimeSlotId = null;

// Lấy thông tin sân/vợt từ URL
async function loadItemDetails() {
    const itemId = getQueryParam('id');
    const type = getQueryParam('type');
    
    if (!itemId || !type) {
        alert('Không tìm thấy thông tin sân/vợt');
        window.location.href = '../trangchu1/index.html';
        return;
    }

    try {
        const response = await fetch(`/api/${type.toLowerCase()}s/${itemId}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        if (!response.ok) throw new Error('Không thể lấy thông tin');
        
        currentItem = await response.json();
        currentItemType = type;
        
        // Cập nhật UI với thông tin sân/vợt
        document.querySelector('.court-name').textContent = currentItem.name;
        document.querySelector('.court-price').textContent = `Giá thuê: ${currentItem.price}${type === 'COURT' ? 'k/h' : 'đ/h'}`;
        
        if (type === 'COURT') {
            // Hiển thị thông tin sân
            document.querySelector('.court-address').textContent = `Địa chỉ: ${currentItem.address}`;
            // Thêm hiển thị thời gian mở cửa
            const openingHours = document.createElement('p');
            openingHours.className = 'court-opening-hours';
            openingHours.textContent = `Thời gian mở cửa: ${currentItem.openingHours || '6:00 - 22:00'}`;
            document.querySelector('.court-info').appendChild(openingHours);
        } else {
            // Hiển thị thông tin vợt
            const brand = document.createElement('p');
            brand.className = 'racket-brand';
            brand.textContent = `Thương hiệu: ${currentItem.brand || 'Chưa cập nhật'}`;
            document.querySelector('.court-info').appendChild(brand);
            // Xóa hiển thị địa chỉ cho vợt
            document.querySelector('.court-address').style.display = 'none';
        }
        
        document.querySelector('.court-image img').src = currentItem.imageUrl || '../../chung/default-court.jpg';
        
        // Load danh sách ngày
        loadAvailableDays();
    } catch (error) {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi tải thông tin');
    }
}

// Load danh sách ngày có sẵn
async function loadAvailableDays() {
    try {
        const endpoint = currentItemType === 'RACKET' 
            ? `/api/days1/available/racket/${currentItem.id}`
            : `/api/days/available/court/${currentItem.id}`;
        const response = await fetch(endpoint, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        if (!response.ok) throw new Error('Không thể lấy danh sách ngày');
        const days = await response.json();
        days.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sắp xếp tăng dần
        console.log('DANH SÁCH NGÀY:', days);

        const dateButtons = document.getElementById('date-buttons');
        dateButtons.innerHTML = '';
        // Thêm container cho các nút ngày
        const dateContainer = document.createElement('div');
        dateContainer.style.display = 'flex';
        dateContainer.style.flexWrap = 'wrap';
        dateContainer.style.gap = '10px';
        dateButtons.appendChild(dateContainer);
        days.forEach(day => {
            const btn = document.createElement('button');
            btn.className = 'date-btn';
            btn.textContent = day.date;
            btn.dataset.dayId = day.id;
            btn.addEventListener('click', () => selectDate(day));
            dateContainer.appendChild(btn);
        });
        // Xóa phần hiển thị khung giờ ban đầu
        const timeButtons = document.getElementById('time-buttons');
        timeButtons.innerHTML = '';
    } catch (error) {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi tải danh sách ngày');
    }
}

// Biến lưu trữ các khung giờ đã chọn
let selectedTimeSlots = [];

// Ẩn 'Thành tiền' khi load trang
window.addEventListener('DOMContentLoaded', function() {
    const priceTag = document.querySelector('.price-tag');
    if (priceTag) priceTag.style.display = 'none';
});

// Xử lý khi chọn giờ (multi-select)
function selectTime(slot) {
    const btn = event.target;
    // Toggle chọn/bỏ chọn
    btn.classList.toggle('selected');
    if (btn.classList.contains('selected')) {
        selectedTimeSlots.push(slot);
    } else {
        selectedTimeSlots = selectedTimeSlots.filter(s => s.id !== slot.id);
    }
    // Cập nhật UI
    updateSelectedTimes();
}

// Cập nhật tổng tiền và hiển thị các giờ đã chọn
function updateSelectedTimes() {
    const priceTag = document.querySelector('.price-tag');
    const totalPriceSpan = document.querySelector('.total-price');
    if (selectedTimeSlots.length === 0) {
        if (priceTag) priceTag.style.display = 'none';
        selectedTime = '';
        selectedTimeSlotId = null;
    } else {
        if (priceTag) priceTag.style.display = '';
        // Hiển thị các giờ đã chọn (nếu muốn)
        selectedTime = selectedTimeSlots.map(s => `${s.startTime} - ${s.endTime}`).join(', ');
        selectedTimeSlotId = selectedTimeSlots.map(s => s.id); // mảng id
        // Tính tổng tiền
        const price = currentItemType === 'COURT' ? parseFloat(currentItem.price) : currentItem.price;
        const totalPrice = price * selectedTimeSlots.length;
        if (totalPriceSpan) totalPriceSpan.textContent = `${totalPrice.toLocaleString()}đ`;
    }
}

// Xử lý khi chọn ngày
async function selectDate(day) {
    selectedDate = day.date;
    selectedTime = '';
    selectedTimeSlotId = null;
    selectedTimeSlots = [];
    // Cập nhật UI
    document.querySelectorAll('.date-btn').forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
    // Load danh sách giờ trống
    try {
        const endpoint = currentItemType === 'RACKET'
            ? `/api/timeslots1/day1/${day.id}`
            : `/api/time-slots/day/${day.id}`;
        const response = await fetch(endpoint, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        if (!response.ok) throw new Error('Không thể lấy danh sách giờ');
        const timeSlots = await response.json();
        timeSlots.sort((a, b) => a.startTime.localeCompare(b.startTime)); // Sắp xếp tăng dần
        const timeButtons = document.getElementById('time-buttons');
        timeButtons.innerHTML = '';
        // Thêm container cho các nút khung giờ
        const timeContainer = document.createElement('div');
        timeContainer.style.display = 'flex';
        timeContainer.style.flexWrap = 'wrap';
        timeContainer.style.gap = '10px';
        timeButtons.appendChild(timeContainer);
        timeSlots.forEach(slot => {
            if (!slot.booked) {
                const btn = document.createElement('button');
                btn.className = 'time-btn';
                btn.textContent = `${slot.startTime} - ${slot.endTime}`;
                btn.dataset.slotId = slot.id;
                btn.addEventListener('click', () => selectTime(slot));
                timeContainer.appendChild(btn);
            }
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi tải danh sách giờ');
    }
}

// Xử lý đặt sân/vợt
async function handleBooking() {
    if (!selectedDate || selectedTimeSlots.length === 0) {
        alert('Vui lòng chọn ngày và giờ trước khi đặt');
        return;
    }

    // Hiển thị modal thanh toán với thông tin đã chọn
    document.getElementById('modal-court-name').textContent = currentItem.name;
    document.getElementById('modal-date').textContent = selectedDate;
    document.getElementById('modal-time').textContent = selectedTime;
    document.getElementById('modal-price').textContent = document.querySelector('.total-price').textContent;
    
    document.getElementById('paymentModal').style.display = 'block';
}

// Xử lý thanh toán
async function handlePayment() {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (!currentUser) {
            alert('Vui lòng đăng nhập để đặt sân/vợt');
            window.location.href = '../dangnhap/index.html';
            return;
        }

        const bookingRequest = {
            userId: currentUser.id,
            bookingType: currentItemType,
            itemName: currentItem.id.toString(),
            itemDate: selectedDate,
            itemTime: selectedTime
        };
        if (currentItemType === 'COURT') {
            bookingRequest.timeSlotIds = selectedTimeSlots.map(s => s.id);
        } else if (currentItemType === 'RACKET') {
            bookingRequest.timeSlot1Ids = selectedTimeSlots.map(s => s.id);
        }

        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(bookingRequest)
        });

        if (!response.ok) throw new Error('Không thể tạo đơn đặt');

        // Ẩn modal thanh toán và hiện modal thành công
        document.getElementById('paymentModal').style.display = 'none';
        document.getElementById('successModal').style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi đặt sân/vợt');
    }
}

// Khởi tạo trang
document.addEventListener('DOMContentLoaded', function() {
    // Load thông tin sân/vợt
    loadItemDetails();

    // Xử lý nút đặt sân/vợt
    const bookingBtn = document.querySelector('.booking-btn');
    if (bookingBtn) {
        bookingBtn.addEventListener('click', handleBooking);
    }

    // Xử lý nút kiểm tra thanh toán
    const checkPaymentBtn = document.getElementById('checkPaymentBtn');
    if (checkPaymentBtn) {
        checkPaymentBtn.addEventListener('click', handlePayment);
    }

    // Xử lý nút hủy
    const cancelPaymentBtn = document.getElementById('cancelPaymentBtn');
    if (cancelPaymentBtn) {
        cancelPaymentBtn.addEventListener('click', function() {
            document.getElementById('paymentModal').style.display = 'none';
        });
    }

    // Xử lý nút trở về trang chủ
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', function() {
            window.location.href = '../dathue/index.html';
        });
    }

    // Xử lý đóng modal
    const closeModalButtons = document.querySelectorAll('.close-modal');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            document.getElementById('paymentModal').style.display = 'none';
            document.getElementById('successModal').style.display = 'none';
        });
    });

    // Xử lý click bên ngoài modal
    window.addEventListener('click', function(event) {
        if (event.target === document.getElementById('paymentModal')) {
            document.getElementById('paymentModal').style.display = 'none';
        }
        if (event.target === document.getElementById('successModal')) {
            document.getElementById('successModal').style.display = 'none';
        }
    });
});
