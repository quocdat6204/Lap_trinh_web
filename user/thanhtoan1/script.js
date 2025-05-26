// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const racketBrand = urlParams.get('brand');
const racketName = urlParams.get('name');
const rentalTime = urlParams.get('time');
const rentalPrice = urlParams.get('price');

// Update racket information
document.getElementById('racket-brand').textContent = racketBrand || 'Yonex';
document.getElementById('racket-name').textContent = racketName || 'Nanoflare 800';
document.getElementById('rental-time').textContent = rentalTime || '2 giờ';
document.getElementById('rental-price').textContent = rentalPrice || '40.000đ/giờ';

// Calculate total price
function calculateTotal() {
    const time = parseInt(rentalTime) || 2;
    const price = parseInt(rentalPrice) || 40000;
    const total = time * price;
    document.getElementById('total-price').textContent = total.toLocaleString('vi-VN') + 'đ';
}

calculateTotal();

// Payment method selection
const methodOptions = document.querySelectorAll('.method-option');
methodOptions.forEach(option => {
    option.addEventListener('click', () => {
        const radio = option.querySelector('input[type="radio"]');
        radio.checked = true;
        
        // Update selected style
        methodOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
    });
});

// Confirm payment button
document.getElementById('confirm-payment').addEventListener('click', () => {
    const selectedMethod = document.querySelector('input[name="payment-method"]:checked');
    
    if (!selectedMethod) {
        alert('Vui lòng chọn phương thức thanh toán');
        return;
    }

    // Show payment success message
    alert('Thanh toán thành công!');
    
    // Redirect to rental history page
    window.location.href = '../dathue/index.html';
});

// Cancel button
document.getElementById('cancel-payment').addEventListener('click', () => {
    if (confirm('Bạn có chắc chắn muốn hủy thanh toán?')) {
        window.location.href = '../vot/index.html';
    }
});

// Dropdown menu
const avatarButton = document.getElementById('avatarButton');
const dropdownMenu = document.getElementById('dropdownMenu');

avatarButton.addEventListener('click', () => {
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
});

// Close dropdown when clicking outside
document.addEventListener('click', (event) => {
    if (!avatarButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.style.display = 'none';
    }
}); 