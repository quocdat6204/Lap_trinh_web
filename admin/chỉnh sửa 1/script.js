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
    // Xử lý sự kiện click vào nút mũi tên xuống (dropdown)
    const dropdownButtons = document.querySelectorAll('.dropdown-btn');
    
    dropdownButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Thay đổi biểu tượng mũi tên
            this.textContent = this.textContent === '▼' ? '▲' : '▼';
            
            // Tìm và hiển thị/ẩn danh sách sân con
            const category = this.closest('.court-category');
            const subCourts = category.querySelector('.sub-courts');
            
            if (subCourts) {
                if (subCourts.style.display === 'none' || !subCourts.style.display) {
                    subCourts.style.display = 'block';
                    
                    // Nếu danh sách trống, thêm thông báo hoặc load dữ liệu
                    if (subCourts.children.length === 0) {
                        loadSubCourts(category);
                    }
                } else {
                    subCourts.style.display = 'none';
                }
            }
        });
    });
    
    // Xử lý sự kiện click vào tên danh mục (cũng mở/đóng danh sách)
    const categoryNames = document.querySelectorAll('.category-name');
    
    categoryNames.forEach(name => {
        name.addEventListener('click', function() {
            const category = this.closest('.court-category');
            const subCourts = category.querySelector('.sub-courts');
            const dropdownBtn = category.querySelector('.dropdown-btn');
            
            if (subCourts) {
                if (subCourts.style.display === 'none' || !subCourts.style.display) {
                    subCourts.style.display = 'block';
                    if (dropdownBtn) dropdownBtn.textContent = '▲';
                    
                    // Nếu danh sách trống, thêm thông báo hoặc load dữ liệu
                    if (subCourts.children.length === 0) {
                        loadSubCourts(category);
                    }
                } else {
                    subCourts.style.display = 'none';
                    if (dropdownBtn) dropdownBtn.textContent = '▼';
                }
            }
        });
    });
    
    // Xử lý sự kiện click vào nút mở rộng trong sân con
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('expand-btn')) {
            // Thay đổi biểu tượng mở rộng
            e.target.textContent = e.target.textContent === '▶' ? '▼' : '▶';
            
            // Hiển thị thông tin sân tương ứng
            const courtElement = e.target.closest('.sub-court');
            const courtId = courtElement.dataset.court;
            
            // Load dữ liệu sân
            loadCourtDetails(courtId);
        }
    });
    
    // Xử lý sự kiện click vào tên sân
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('court-name')) {
            const courtElement = e.target.closest('.sub-court');
            const courtId = courtElement.dataset.court;
            
            // Load dữ liệu sân
            loadCourtDetails(courtId);
        }
    });
    
    // Xử lý sự kiện click vào nút thêm
    const addButtons = document.querySelectorAll('.add-btn');
    
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Lấy tên danh mục
            const categoryHeader = this.closest('.category-header');
            const categoryName = categoryHeader.querySelector('.category-name').textContent;
            
            // Reset form và hiển thị form trống
            document.getElementById('courtForm').reset();
            alert(`Thêm sân mới vào danh mục: ${categoryName}`);
        });
    });
    
    // Xử lý sự kiện click vào nút lưu
    const saveButton = document.getElementById('saveButton');
    
    if (saveButton) {
        saveButton.addEventListener('click', function() {
            // Lấy giá trị từ form
            const name = document.getElementById('courtName').value;
            const address = document.getElementById('courtAddress').value;
            const hours = document.getElementById('courtHours').value;
            const price = document.getElementById('courtPrice').value;
            
            // Kiểm tra dữ liệu
            if (!name) {
                alert('Vui lòng nhập tên sân');
                return;
            }
            
            // Trong thực tế sẽ gửi dữ liệu lên server
            alert(`Đã lưu thông tin sân: ${name}`);
        });
    }
    
    // Hàm giả lập load danh sách sân con
    function loadSubCourts(category) {
        const categoryName = category.querySelector('.category-name').textContent;
        const subCourtsList = category.querySelector('.sub-courts');
        
        // Dữ liệu mẫu cho từng loại sân
        const courtsByCategory = {
            'Sân nhà thi đấu': [
                { id: 'san1', name: 'Sân 1' },
                { id: 'san2', name: 'Sân 2' }
            ],
            'Sân ngoài trời': [
                { id: 'san-ngoai-troi-1', name: 'Sân A' },
                { id: 'san-ngoai-troi-2', name: 'Sân B' },
                { id: 'san-ngoai-troi-3', name: 'Sân C' }
            ],
            'Sân trường học': [
                { id: 'san-truong-1', name: 'Sân trường THPT Chu Văn An' },
                { id: 'san-truong-2', name: 'Sân trường ĐH Bách Khoa' }
            ]
        };
        
        // Nếu có dữ liệu cho danh mục này
        if (courtsByCategory[categoryName]) {
            // Xóa nội dung cũ (nếu có)
            subCourtsList.innerHTML = '';
            
            // Thêm các sân vào danh sách
            courtsByCategory[categoryName].forEach(court => {
                const courtElement = document.createElement('div');
                courtElement.className = 'sub-court';
                courtElement.dataset.court = court.id;
                courtElement.innerHTML = `
                    <button class="expand-btn">▶</button>
                    <span class="court-name">${court.name}</span>
                `;
                subCourtsList.appendChild(courtElement);
            });
        } else {
            // Nếu không có dữ liệu
            subCourtsList.innerHTML = '<div class="sub-court-empty">Chưa có sân nào trong danh mục này</div>';
        }
    }
    
    // Hàm giả lập load dữ liệu sân
    function loadCourtDetails(courtId) {
        // Dữ liệu mẫu
        const courtData = {
            'san1': {
                name: 'Sân 1',
                address: '01 Nguyễn Văn Ngọc, phường Cống Vị, quận Ba Đình, Hà Nội',
                hours: '8:00 - 22:00',
                price: '80.000đ/h'
            },
            'san2': {
                name: 'Sân 2',
                address: '15 Trần Hưng Đạo, quận Hoàn Kiếm, Hà Nội',
                hours: '9:00 - 21:00',
                price: '90.000đ/h'
            },
            'san-ngoai-troi-1': {
                name: 'Sân A',
                address: '25 Lê Văn Lương, quận Thanh Xuân, Hà Nội',
                hours: '6:00 - 22:00',
                price: '70.000đ/h'
            },
            'san-ngoai-troi-2': {
                name: 'Sân B',
                address: '45 Xuân Thủy, quận Cầu Giấy, Hà Nội',
                hours: '7:00 - 21:00',
                price: '65.000đ/h'
            },
            'san-truong-1': {
                name: 'Sân trường THPT Chu Văn An',
                address: '10 Thụy Khuê, quận Tây Hồ, Hà Nội',
                hours: '17:00 - 21:00 (Sau giờ học)',
                price: '100.000đ/h'
            }
        };
        
        // Nếu có dữ liệu cho sân được chọn
        if (courtData[courtId]) {
            const data = courtData[courtId];
            
            // Điền dữ liệu vào form
            document.getElementById('courtName').value = data.name;
            document.getElementById('courtAddress').value = data.address;
            document.getElementById('courtHours').value = data.hours;
            document.getElementById('courtPrice').value = data.price;
        }
    }
});

