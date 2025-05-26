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

// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get all date and time buttons
    const dateButtons = document.querySelectorAll('.date-btn');
    const timeButtons = document.querySelectorAll('.time-btn');
    const bookingRecordsContainer = document.getElementById('bookingRecordsContainer');
    const bookingRecordsBody = document.getElementById('bookingRecordsBody');
    
    // Booking data - simulates database records
    const bookingData = {
        '22/02': {
            '8:00': {
                customer: 'B22DCCN187',
                registeredAt: '20:00 21/02/2025'
            },
            '9:00': {
                customer: 'B22DCCN033',
                registeredAt: '19:30 21/02/2025'
            }
        },
        '23/02': {
            '15:00': {
                customer: 'B22DCCN042',
                registeredAt: '10:15 22/02/2025'
            }
        },
        '24/02': {
            '16:00': {
                customer: 'B22DCCN105',
                registeredAt: '14:20 23/02/2025'
            }
        }
    };
    
    // Selected date and time
    let selectedDate = null;
    let selectedTime = null;
    
    // Add click event listener to each date button
    dateButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove 'selected' class from all date buttons
            dateButtons.forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Add 'selected' class to clicked button
            this.classList.add('selected');
            
            // Store selected date
            selectedDate = this.dataset.date;
            
            // Update time button states based on selected date
            updateTimeButtonStates();
            
            // Check if both date and time are selected
            checkAndDisplayBookings();
        });
    });
    
    // Add click event listener to each time button
    timeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Ẩn tất cả info dưới các slot khác
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
            document.querySelectorAll('.booking-info-under-slot').forEach(div => div.style.display = 'none');
            btn.classList.add('selected');
            // Nếu có infoDiv thì hiện ra
            if (btnWrap.querySelector('.booking-info-under-slot')) {
                btnWrap.querySelector('.booking-info-under-slot').style.display = 'block';
            }
        });
    });
    
    // Function to update time button states based on selected date
    function updateTimeButtonStates() {
        if (!selectedDate) return;
        
        // Reset all time buttons
        timeButtons.forEach(btn => {
            btn.classList.remove('selected');
            btn.style.backgroundColor = '';
            btn.style.color = '';
            btn.style.borderColor = '';
        });
        
        // If there are bookings for this date, mark those times
        if (bookingData[selectedDate]) {
            timeButtons.forEach(btn => {
                const time = btn.dataset.time;
                if (bookingData[selectedDate][time]) {
                    btn.style.backgroundColor = '#e74c3c';
                    btn.style.color = 'white';
                    btn.style.borderColor = '#e74c3c';
                }
            });
        }
    }
    
    // Function to check if both date and time are selected and display bookings
    function checkAndDisplayBookings() {
        if (selectedDate && selectedTime) {
            // Check if there's a booking for this slot
            if (bookingData[selectedDate] && bookingData[selectedDate][selectedTime]) {
                const booking = bookingData[selectedDate][selectedTime];
                
                // Populate and show the booking records table
                bookingRecordsBody.innerHTML = `
                    <tr>
                        <td>${booking.customer}</td>
                        <td>${booking.registeredAt}</td>
                        <td>
                            <button class="delete-btn" title="Hủy thuê vợt">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
                bookingRecordsContainer.style.display = 'block';
                
                // Add event listener to delete button
                const deleteBtn = bookingRecordsBody.querySelector('.delete-btn');
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', function() {
                        if (confirm('Bạn có chắc chắn muốn hủy thuê vợt này không?')) {
                            // In a real app, this would delete from database
                            delete bookingData[selectedDate][selectedTime];
                            
                            // Update UI
                            updateTimeButtonStates();
                            bookingRecordsContainer.style.display = 'none';
                        }
                    });
                }
            } else {
                // No booking for this slot
                bookingRecordsContainer.style.display = 'none';
            }
        }
    }
    
    // Initialize - check if any date is pre-selected
    const preSelectedDate = document.querySelector('.date-btn.selected');
    if (preSelectedDate) {
        selectedDate = preSelectedDate.dataset.date;
        updateTimeButtonStates();
    }
});

// Helper: Lấy query param từ URL
function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

let currentRacketData = null;
let racketTypesList = [];

// Lấy danh sách loại vợt cho select
async function fetchRacketTypes() {
    const res = await fetch('/api/racket-types', {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });
    racketTypesList = await res.json();
}

// Chuyển sang chế độ chỉnh sửa
function enableEditMode() {
    const name = document.getElementById('racketName').textContent;
    const brand = document.getElementById('racketBrand').textContent.replace('Thương hiệu: ', '');
    const price = document.getElementById('racketPrice').textContent.replace('Giá thuê: ', '').replace('/h','');
    const typeName = document.getElementById('racketType').textContent.replace('Loại vợt: ', '');
    const imageUrl = document.getElementById('racketImage').src;

    // Tên
    document.getElementById('racketName').innerHTML = `<input id="editName" type="text" value="${name}" class="edit-input">`;
    // Thương hiệu
    document.getElementById('racketBrand').innerHTML = `<input id="editBrand" type="text" value="${brand}" class="edit-input">`;
    // Giá
    document.getElementById('racketPrice').innerHTML = `<input id="editPrice" type="text" value="${price}" class="edit-input">`;
    // Loại vợt
    let typeOptions = racketTypesList.map(t => `<option value="${t.id}" ${t.name===typeName?'selected':''}>${t.name}</option>`).join('');
    document.getElementById('racketType').innerHTML = `<select id="editType" class="edit-input">${typeOptions}</select>`;
    // Ảnh
    document.getElementById('racketImage').outerHTML = `<div id="editImageWrap"><img id="racketImage" src="${imageUrl}" style="max-width:180px;max-height:120px;border-radius:8px;display:block;margin-bottom:8px;"><input type="file" id="editImageInput" accept="image/*"></div>`;

    document.getElementById('editBtn').style.display = 'none';
    document.getElementById('saveBtn').style.display = '';
    document.getElementById('cancelBtn').style.display = '';
}

// Thoát chế độ chỉnh sửa
function disableEditMode() {
    renderRacketDetail(currentRacketData);
    document.getElementById('editBtn').style.display = '';
    document.getElementById('saveBtn').style.display = 'none';
    document.getElementById('cancelBtn').style.display = 'none';
}

// Hàm kiểm tra form chỉnh sửa
function validateEditForm() {
    const price = document.getElementById('editPrice').value.trim();
    
    if (!price) {
        showError('Vui lòng nhập giá thuê');
        return false;
    }

    // Kiểm tra giá thuê phải là số nguyên dương
    const priceNumber = parseInt(price);
    if (isNaN(priceNumber) || priceNumber <= 0 || !Number.isInteger(priceNumber)) {
        showError('Giá thuê phải là số nguyên dương');
        return false;
    }
    
    return true;
}

// Hàm hiển thị thông báo lỗi
function showError(message) {
    alert(message);
}

// Lưu chỉnh sửa
async function saveEdit() {
    // Kiểm tra dữ liệu trước khi lưu
    if (!validateEditForm()) {
        return;
    }

    const racketId = getQueryParam('id');
    const name = document.getElementById('editName').value;
    const brand = document.getElementById('editBrand').value;
    const price = document.getElementById('editPrice').value;
    const racketTypeId = document.getElementById('editType').value;
    let imageUrl = currentRacketData.imageUrl;
    let imageFile = document.getElementById('editImageInput').files[0];

    // Nếu có file ảnh mới, upload lên server trước
    if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile); // đúng tên param là 'image'
        const uploadRes = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            imageUrl = uploadData.imageUrl; // lấy đúng key 'imageUrl'
        } else {
            alert('Upload ảnh thất bại!');
            return;
        }
    }

    const body = {
        name,
        brand,
        price,
        racketTypeId,
        imageUrl
    };

    const res = await fetch(`/api/rackets/${racketId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(body)
    });
    if (res.ok) {
        const updated = await res.json();
        currentRacketData = updated;
        disableEditMode();
        renderRacketDetail(updated);
        alert('Cập nhật thành công!');
    } else {
        alert('Cập nhật thất bại!');
    }
}

// Render thông tin vợt (bổ sung param data để dùng lại khi disableEditMode)
async function renderRacketDetail(data) {
    let racket;
    if (data) {
        racket = data;
    } else {
        const racketId = getQueryParam('id');
        if (!racketId) return;
        const res = await fetch(`/api/rackets/${racketId}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        racket = await res.json();
    }
    currentRacketData = racket;
    // Luôn render lại đúng HTML ảnh
    document.querySelector('.racket-image').innerHTML = `<img id="racketImage" src="${racket.imageUrl || '../../chung/default-racket.jpg'}" alt="Ảnh vợt">`;
    document.getElementById('racketName').textContent = racket.name;
    document.getElementById('racketBrand').textContent = 'Thương hiệu: ' + (racket.brand || '');
    document.getElementById('racketPrice').textContent = 'Giá thuê: ' + (racket.price || '') + '/h';
    document.getElementById('racketType').textContent = 'Loại vợt: ' + (racket.racketTypeName || '');
    renderDays(racket.id);
}

// Khởi động khi load trang
window.addEventListener('DOMContentLoaded', async function() {
    await fetchRacketTypes();
    renderRacketDetail();
    // ... giữ nguyên code dropdown avatar ...
    document.getElementById('editBtn').onclick = enableEditMode;
    document.getElementById('cancelBtn').onclick = disableEditMode;
    document.getElementById('saveBtn').onclick = saveEdit;

    // Nút tạo ngày mới
    const addDayBtn = document.getElementById('addDayBtn');
    const newDayInput = document.getElementById('newDayInput');
    const saveDayBtn = document.getElementById('saveDayBtn');
    const cancelDayBtn = document.getElementById('cancelDayBtn');
    addDayBtn.onclick = function() {
        addDayBtn.style.display = 'none';
        newDayInput.style.display = '';
        saveDayBtn.style.display = '';
        cancelDayBtn.style.display = '';
    };
    cancelDayBtn.onclick = function() {
        addDayBtn.style.display = '';
        newDayInput.style.display = 'none';
        saveDayBtn.style.display = 'none';
        cancelDayBtn.style.display = 'none';
        newDayInput.value = '';
    };
    saveDayBtn.onclick = async function() {
        const date = newDayInput.value;
        if (!date) { alert('Vui lòng chọn ngày!'); return; }
        const racketId = getQueryParam('id');
        const res = await fetch('/api/days1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ date, racketId })
        });
        if (res.ok) {
            alert('Tạo ngày mới thành công!');
            renderDays(racketId);
        } else {
            alert('Tạo ngày mới thất bại!');
        }
        addDayBtn.style.display = '';
        newDayInput.style.display = 'none';
        saveDayBtn.style.display = 'none';
        cancelDayBtn.style.display = 'none';
        newDayInput.value = '';
    };

    // --- TẠO GIỜ MỚI ---
    const addTimeBtn = document.getElementById('addTimeBtn');
    const newStartTimeInput = document.getElementById('newStartTimeInput');
    const newEndTimeInput = document.getElementById('newEndTimeInput');
    const saveTimeBtn = document.getElementById('saveTimeBtn');
    const cancelTimeBtn = document.getElementById('cancelTimeBtn');
    const toLabel = document.getElementById('toLabel');
    let currentDayId = null;
    // Hook vào renderTimeSlots để biết dayId hiện tại
    const oldRenderTimeSlots = window.renderTimeSlots;
    window.renderTimeSlots = async function(dayId) {
        currentDayId = dayId;
        await oldRenderTimeSlots(dayId);
    };
    addTimeBtn.onclick = function() {
        addTimeBtn.style.display = 'none';
        newStartTimeInput.style.display = '';
        toLabel.style.display = '';
        newEndTimeInput.style.display = '';
        saveTimeBtn.style.display = '';
        cancelTimeBtn.style.display = '';
    };
    cancelTimeBtn.onclick = function() {
        addTimeBtn.style.display = '';
        newStartTimeInput.style.display = 'none';
        toLabel.style.display = 'none';
        newEndTimeInput.style.display = 'none';
        saveTimeBtn.style.display = 'none';
        cancelTimeBtn.style.display = 'none';
        newStartTimeInput.value = '';
        newEndTimeInput.value = '';
    };
    saveTimeBtn.onclick = async function() {
        const startTime = newStartTimeInput.value;
        const endTime = newEndTimeInput.value;
        if (!startTime || !endTime) { alert('Vui lòng nhập đủ giờ bắt đầu và kết thúc!'); return; }
        if (startTime >= endTime) { alert('Giờ bắt đầu phải nhỏ hơn giờ kết thúc!'); return; }
        if (!currentDayId) { alert('Vui lòng chọn ngày trước!'); return; }
        const res = await fetch('/api/timeslots1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({ startTime, endTime, day1Id: currentDayId })
        });
        if (res.ok) {
            alert('Tạo khung giờ mới thành công!');
            renderTimeSlots(currentDayId);
        } else {
            alert('Tạo khung giờ mới thất bại!');
        }
        addTimeBtn.style.display = '';
        newStartTimeInput.style.display = 'none';
        toLabel.style.display = 'none';
        newEndTimeInput.style.display = 'none';
        saveTimeBtn.style.display = 'none';
        cancelTimeBtn.style.display = 'none';
        newStartTimeInput.value = '';
        newEndTimeInput.value = '';
    };
});

// --- PHÂN TRANG NGÀY ---
const DAYS_PER_PAGE = 6;
let allDays = [];
let currentPage = 1;
let totalPages = 1;

async function renderDays(racketId) {
    const dateButtons = document.getElementById('dateButtons');
    dateButtons.innerHTML = '<span>Đang tải ngày...</span>';
    const res = await fetch(`/api/days1/racket/${racketId}`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });
    allDays = await res.json();
    // Sắp xếp ngày giảm dần
    allDays.sort((a, b) => new Date(b.date) - new Date(a.date));
    totalPages = Math.ceil(allDays.length / DAYS_PER_PAGE) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    renderDaysPage();
}

function renderDaysPage() {
    const dateButtons = document.getElementById('dateButtons');
    dateButtons.innerHTML = '';
    const startIdx = (currentPage - 1) * DAYS_PER_PAGE;
    const endIdx = startIdx + DAYS_PER_PAGE;
    const daysToShow = allDays.slice(startIdx, endIdx);
    daysToShow.forEach(day => {
        const btnWrap = document.createElement('div');
        btnWrap.style.display = 'inline-block';
        btnWrap.style.position = 'relative';
        btnWrap.style.margin = '0 4px 4px 0';
        // Nút ngày
        const btn = document.createElement('button');
        btn.className = 'date-btn';
        btn.textContent = day.date;
        btn.dataset.dayId = day.id;
        btn.addEventListener('click', function() {
            document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            renderTimeSlots(day.id);
        });
        btnWrap.appendChild(btn);
        // Nút X xoá ngày
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-day-btn-x';
        delBtn.title = 'Xóa ngày';
        delBtn.innerHTML = '&times;';
        delBtn.onclick = async function(e) {
            e.stopPropagation();
            if (confirm('Bạn có chắc chắn muốn xóa ngày này không?')) {
                await deleteDay(day.id);
            }
        };
        btnWrap.appendChild(delBtn);
        dateButtons.appendChild(btnWrap);
    });
    // Tự động chọn ngày đầu tiên nếu có
    if (daysToShow.length > 0) {
        setTimeout(() => {
            if (!document.querySelector('.date-btn.selected')) {
                dateButtons.querySelector('.date-btn').click();
            }
        }, 0);
    } else {
        document.getElementById('timeButtons').innerHTML = '<span>Không có ngày nào khả dụng</span>';
    }
    // Cập nhật thông tin trang
    document.getElementById('pageInfo').textContent = `Trang ${currentPage} / ${totalPages}`;
    // Vô hiệu hóa nút nếu ở đầu/cuối
    document.getElementById('prevPageBtn').disabled = currentPage === 1;
    document.getElementById('nextPageBtn').disabled = currentPage === totalPages;
}

document.getElementById('prevPageBtn').onclick = function() {
    if (currentPage > 1) {
        currentPage--;
        renderDaysPage();
    }
};
document.getElementById('nextPageBtn').onclick = function() {
    if (currentPage < totalPages) {
        currentPage++;
        renderDaysPage();
    }
};

// Render các nút giờ cho 1 ngày
async function renderTimeSlots(dayId) {
    const timeButtons = document.getElementById('timeButtons');
    timeButtons.innerHTML = '<span>Đang tải giờ...</span>';
    const res = await fetch(`/api/timeslots1/day1/${dayId}`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    });
    const slots = await res.json();
    timeButtons.innerHTML = '';
    for (const slot of slots) {
        const btnWrap = document.createElement('div');
        btnWrap.style.display = 'inline-block';
        btnWrap.style.position = 'relative';
        btnWrap.style.margin = '0 4px 4px 0';
        btnWrap.style.width = '100%';
        // Nút giờ
        const btn = document.createElement('button');
        btn.className = 'time-btn';
        btn.textContent = slot.startTime + ' - ' + slot.endTime;
        btn.dataset.slotId = slot.id;
        let infoDiv = null;
        if (slot.booked) {
            btn.classList.add('booked');
            btn.disabled = false; // Cho phép click để hiện thông tin
            btn.title = 'Đã có người thuê';
            // Tạo div hiển thị thông tin đặt
            infoDiv = document.createElement('div');
            infoDiv.className = 'booking-info-under-slot';
            infoDiv.textContent = 'Đang tải thông tin...';
            // Lấy thông tin booking
            if (slot.bookingId) {
                try {
                    const bookingRes = await fetch(`/api/bookings/${slot.bookingId}`, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    });
                    const booking = await bookingRes.json();
                    // Lấy thông tin người dùng
                    const userRes = await fetch(`/api/users/${booking.userId}`, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    });
                    const user = await userRes.json();
                    // Format thời gian đặt
                    const bookingDate = new Date(booking.bookingDate);
                    const formattedDate = bookingDate.toLocaleString('vi-VN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    // Hiển thị thông tin
                    infoDiv.innerHTML = `
                        <b>Người đặt:</b> ${user.firstName} ${user.lastName}<br>
                        <b>Thời gian đặt:</b> ${formattedDate}
                    `;
                } catch (error) {
                    infoDiv.textContent = 'Không thể tải thông tin đặt';
                }
            }
        }
        btn.addEventListener('click', function() {
            // Ẩn tất cả info dưới các slot khác
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('selected'));
            document.querySelectorAll('.booking-info-under-slot').forEach(div => div.style.display = 'none');
            this.classList.add('selected');
            // Nếu có infoDiv thì hiện ra
            const infoDiv = this.parentElement.querySelector('.booking-info-under-slot');
            if (infoDiv) {
                infoDiv.style.display = 'block';
            }
        });
        btnWrap.appendChild(btn);
        if (infoDiv) btnWrap.appendChild(infoDiv);
        // Nút X xoá giờ
        const delBtn = document.createElement('button');
        delBtn.className = 'delete-time-btn-x';
        delBtn.title = 'Xóa giờ';
        delBtn.innerHTML = '&times;';
        delBtn.onclick = async function(e) {
            e.stopPropagation();
            if (confirm('Bạn có chắc chắn muốn xóa khung giờ này không?')) {
                await deleteTimeSlot(slot.id, dayId);
            }
        };
        btnWrap.appendChild(delBtn);
        timeButtons.appendChild(btnWrap);
    }
    if (slots.length === 0) {
        timeButtons.innerHTML = '<span>Không có khung giờ nào khả dụng</span>';
    }
}

async function deleteDay(dayId) {
    try {
        const response = await fetch(`/api/days1/${dayId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        
        if (!response.ok) {
            const error = await response.text();
            if (error.includes("Không thể xóa ngày này vì có khung giờ đã được đặt")) {
                alert("Không thể xóa ngày này vì còn các khung giờ đã được đặt!");
            } else {
                alert("Có lỗi xảy ra khi xóa ngày!");
            }
            return;
        }
        
        // Refresh the days list
        renderDays(currentRacketData.id);
    } catch (error) {
        console.error('Error:', error);
        alert("Có lỗi xảy ra khi xóa ngày!");
    }
}

async function deleteTimeSlot(timeSlotId, dayId) {
    try {
        const response = await fetch(`/api/timeslots1/${timeSlotId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        
        if (!response.ok) {
            const error = await response.text();
            if (error.includes("Không thể xóa khung giờ đã được đặt")) {
                alert("Không thể xóa khung giờ đã được đặt!");
            } else {
                alert("Có lỗi xảy ra khi xóa khung giờ!");
            }
            return;
        }
        
        // Refresh the time slots list
        await renderTimeSlots(dayId);
    } catch (error) {
        console.error('Error:', error);
        alert("Có lỗi xảy ra khi xóa khung giờ!");
    }
}
