// // Wait for the document to be fully loaded
// document.addEventListener('DOMContentLoaded', function() {
//     // Get all time buttons
//     const timeButtons = document.querySelectorAll('.time-btn');
    
//     // Add click event listener to each time button
//     timeButtons.forEach(button => {
//         button.addEventListener('click', function() {
//             // Toggle the 'selected' class on the clicked button
//             this.classList.toggle('selected');
            
//             // Optional: If you want only one time button to be selected at a time
//             // Uncomment the code below
//             /*
//             timeButtons.forEach(btn => {
//                 if (btn !== this) {
//                     btn.classList.remove('selected');
//                 }
//             });
//             */
//         });
//     });
    
//     // Similarly for date buttons if needed
//     const dateButtons = document.querySelectorAll('.date-btn');
//     dateButtons.forEach(button => {
//         button.addEventListener('click', function() {
//             // Remove 'selected' class from all date buttons
//             dateButtons.forEach(btn => {
//                 btn.classList.remove('selected');
//             });
            
//             // Add 'selected' class to clicked button
//             this.classList.add('selected');
//         });
//     });
// });


// JavaScript để xử lý click vào avatar
// document.addEventListener('DOMContentLoaded', function() {
//     const avatarButton = document.getElementById('avatarButton');
//     const dropdownMenu = document.getElementById('dropdownMenu');
    
//     // Hiển thị/ẩn dropdown khi click vào avatar
//     avatarButton.addEventListener('click', function(event) {
//         dropdownMenu.classList.toggle('show');
//         event.stopPropagation();
//     });
    
//     // Ẩn dropdown khi click bất kỳ đâu khác trên trang
//     document.addEventListener('click', function(event) {
//         if (!dropdownMenu.contains(event.target) && event.target !== avatarButton) {
//             dropdownMenu.classList.remove('show');
//         }
//     });
// });


// qr thanh toán
document.addEventListener('DOMContentLoaded', function() {
    // Dropdown menu cho avatar
    const avatarButton = document.getElementById('avatarButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (avatarButton && dropdownMenu) {
        avatarButton.addEventListener('click', function(event) {
            dropdownMenu.classList.toggle('show');
            event.stopPropagation();
        });
        
        document.addEventListener('click', function(event) {
            if (!dropdownMenu.contains(event.target) && event.target !== avatarButton) {
                dropdownMenu.classList.remove('show');
            }
        });
    }
    
    // Lấy các phần tử cần thiết
    const bookingBtn = document.querySelector('.booking-btn');
    const paymentModal = document.getElementById('paymentModal');
    const successModal = document.getElementById('successModal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const checkPaymentBtn = document.getElementById('checkPaymentBtn');
    const cancelPaymentBtn = document.getElementById('cancelPaymentBtn');
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    
    // Các nút ngày và giờ
    const dateButtons = document.querySelectorAll('.date-btn');
    const timeButtons = document.querySelectorAll('.time-btn');
    
    // Biến lưu trữ lựa chọn của người dùng
    let selectedDate = '';
    let selectedTime = '';
    
    // Xử lý chọn ngày
    dateButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Bỏ chọn tất cả các nút ngày
            dateButtons.forEach(btn => btn.classList.remove('selected'));
            // Chọn nút hiện tại
            this.classList.add('selected');
            // Lưu ngày đã chọn
            selectedDate = this.textContent;
            // Cập nhật thông tin trong modal
            document.getElementById('modal-date').textContent = selectedDate;
        });
    });
    
    // Xử lý chọn giờ
    timeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Bỏ chọn tất cả các nút giờ
            // timeButtons.forEach(btn => btn.classList.remove('selected'));
            // Chọn nút hiện tại
            this.classList.add('selected');
            // Lưu giờ đã chọn
            selectedTime = this.textContent;
            // Cập nhật thông tin trong modal
            document.getElementById('modal-time').textContent = selectedTime;
        });
    });
    
    // Mở modal thanh toán khi nhấn nút đặt sân
    if (bookingBtn) {
        bookingBtn.addEventListener('click', function() {
            // Kiểm tra xem người dùng đã chọn ngày và giờ chưa
            if (!selectedDate || !selectedTime) {
                alert('Vui lòng chọn ngày và giờ trước khi đặt sân');
                return;
            }
            
            // Hiển thị modal thanh toán
            paymentModal.style.display = 'block';
        });
    }
    
    // Đóng các modal khi nhấn nút X
    closeModalButtons.forEach(button => {
        button.addEventListener('click', function() {
            paymentModal.style.display = 'none';
            successModal.style.display = 'none';
        });
    });
    
    // Đóng modal khi click bên ngoài
    window.addEventListener('click', function(event) {
        if (event.target === paymentModal) {
            paymentModal.style.display = 'none';
        }
        if (event.target === successModal) {
            successModal.style.display = 'none';
        }
    });
    
    // Xử lý khi nhấn nút kiểm tra thanh toán
    if (checkPaymentBtn) {
        checkPaymentBtn.addEventListener('click', function() {
            // Ẩn modal thanh toán
            paymentModal.style.display = 'none';
            // Hiển thị modal thành công
            successModal.style.display = 'block';
        });
    }
    
    // Xử lý khi nhấn nút hủy
    if (cancelPaymentBtn) {
        cancelPaymentBtn.addEventListener('click', function() {
            paymentModal.style.display = 'none';
        });
    }
    
    // Xử lý khi nhấn nút trở về trang chủ
    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', function() {
            window.location.href = '../trangchu/index.html';
        });
    }
});
