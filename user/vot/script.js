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

    // Xử lý sắp xếp vợt
    const sections = document.querySelectorAll('.rackets-section');
    
    sections.forEach(section => {
        const filterOptions = section.querySelectorAll('.filter-option');
        const racketsContainer = section.querySelector('.rackets-container');
        const racketCards = Array.from(racketsContainer.querySelectorAll('.racket-card'));
        
        filterOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Xóa class active của tất cả các option trong cùng một group
                const group = this.parentElement.parentElement;
                group.querySelectorAll('.filter-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                
                // Thêm class active cho option được chọn
                this.classList.add('active');
                
                // Lấy loại sắp xếp và thứ tự
                const sortBy = section.querySelector('.filter-options:first-child .filter-option.active')?.textContent;
                const order = section.querySelector('.filter-options:last-child .filter-option.active')?.textContent;
                
                if (sortBy && order) {
                    // Sắp xếp vợt
                    const sortedRackets = racketCards.sort((a, b) => {
                        if (sortBy === 'Giá') {
                            const priceA = parseInt(a.querySelector('.racket-price').textContent.match(/\d+/)[0]);
                            const priceB = parseInt(b.querySelector('.racket-price').textContent.match(/\d+/)[0]);
                            return order === 'Tăng dần' ? priceA - priceB : priceB - priceA;
                        } else if (sortBy === 'Tên') {
                            const nameA = a.querySelector('.racket-name').textContent;
                            const nameB = b.querySelector('.racket-name').textContent;
                            return order === 'Tăng dần' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
                        }
                    });
                    
                    // Cập nhật lại thứ tự các vợt
                    sortedRackets.forEach(racket => {
                        racketsContainer.appendChild(racket);
                    });
                }
            });
        });
    });
});