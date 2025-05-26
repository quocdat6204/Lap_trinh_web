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

document.addEventListener('DOMContentLoaded', function() {
    // Pagination variables
    const itemsPerPage = 3; // Number of items to show per page
    let currentPage = 1;
    
    // Get all court cards
    const courtCards = document.querySelectorAll('.court-card');
    const totalPages = Math.ceil(courtCards.length / itemsPerPage);
    
    // Pagination elements
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const paginationNumbers = document.getElementById('pagination-numbers');
    
    // Function to show items for current page
    function showPage(page) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        courtCards.forEach((card, index) => {
            if (index >= startIndex && index < endIndex) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Function to update pagination numbers
    function updatePaginationNumbers() {
        paginationNumbers.innerHTML = '';
        
        for (let i = 1; i <= totalPages; i++) {
            const pageNumber = document.createElement('button');
            pageNumber.textContent = i;
            pageNumber.classList.add('page-number');
            
            if (i === currentPage) {
                pageNumber.classList.add('active');
            }
            
            pageNumber.addEventListener('click', () => {
                currentPage = i;
                showPage(currentPage);
                updatePaginationNumbers();
                updatePaginationButtons();
            });
            
            paginationNumbers.appendChild(pageNumber);
        }
    }
    
    // Function to update pagination buttons
    function updatePaginationButtons() {
        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;
    }
    
    // Event listeners for pagination buttons
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            showPage(currentPage);
            updatePaginationNumbers();
            updatePaginationButtons();
        }
    });
    
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
            updatePaginationNumbers();
            updatePaginationButtons();
        }
    });
    
    // Initialize pagination
    showPage(currentPage);
    updatePaginationNumbers();
    updatePaginationButtons();
    
    // Danh sách các card và đường link tương ứng
    const courtLinks = {
        'court-nguyenvanngoc': "../thanhtoan/index.html",
        'court-another-id': 'https://example.com/dat-san/another-location',
        // Thêm các card khác ở đây
    };
    
    // Thêm event listener cho mỗi card
    courtCards.forEach(function(card) {
        // Thêm style cursor pointer
        card.style.cursor = 'pointer';
        
        // Xử lý sự kiện click
        card.addEventListener('click', function() {
            // Lấy ID của card
            const cardId = this.id;
            
            // Kiểm tra xem card có trong danh sách không
            if (courtLinks[cardId]) {
                // Chuyển hướng người dùng đến trang đặt sân
                window.location.href = courtLinks[cardId];
            } else {
                // Xử lý cho các card không có trong danh sách
                // Có thể chuyển đến trang mặc định hoặc hiển thị thông báo
                alert('Vui lòng đăng nhập để đặt sân này.');
            }
        });
    });
});
