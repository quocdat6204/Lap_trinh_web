// JavaScript để xử lý click vào avatar
document.addEventListener('DOMContentLoaded', function() {
    const avatarButton = document.getElementById('avatarButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const courtTypeFilter = document.getElementById('courtTypeFilter');
    
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

    // Xử lý sự kiện thay đổi filter
    courtTypeFilter.addEventListener('change', function() {
        const selectedType = this.value;
        filterCourts(selectedType);
    });

    // Load tất cả loại sân cho dropdown
    loadAllCourtTypes();
    // Load trang đầu tiên với phân trang
    loadCourtTypes(0);
});

// Hàm load tất cả loại sân cho dropdown
async function loadAllCourtTypes() {
    try {
        const response = await fetch('/api/court-types', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        const courtTypes = await response.json();
        
        // Thêm các option vào select
        const courtTypeFilter = document.getElementById('courtTypeFilter');
        courtTypeFilter.innerHTML = '<option value="all">Tất cả loại sân</option>';
        courtTypes.forEach(courtType => {
            const option = document.createElement('option');
            option.value = courtType.id;
            option.textContent = courtType.name;
            courtTypeFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Lỗi khi tải danh sách loại sân cho dropdown:', error);
    }
}

// Hàm gọi API lấy danh sách loại sân có phân trang
async function loadCourtTypes(page) {
    try {
        const response = await fetch(`/api/court-types/paginated?page=${page}&size=3`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        const data = await response.json();
        
        // Xóa các section cũ và phân trang cũ
        const main = document.querySelector('main');
        const oldSections = main.querySelectorAll('.courts-section');
        oldSections.forEach(section => section.remove());
        const oldPagination = document.querySelector('.pagination-container');
        if (oldPagination) {
            oldPagination.remove();
        }
        
        // Tạo container cho các section
        const sectionsContainer = document.createElement('div');
        sectionsContainer.className = 'sections-container';
        main.appendChild(sectionsContainer);
        
        // Tạo các section cho từng loại sân
        for (const courtType of data.courtTypes) {
            await createCourtTypeSection(courtType);
        }

        // Sau khi tất cả các section đã được tạo xong, mới tạo phân trang
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination-container';
        main.appendChild(paginationContainer);
        createPagination(data.currentPage, data.totalPages);
    } catch (error) {
        console.error('Lỗi khi tải danh sách loại sân:', error);
    }
}

// Hàm tạo phân trang
function createPagination(currentPage, totalPages) {
    const paginationContainer = document.querySelector('.pagination-container');
    if (!paginationContainer) return;

    let paginationHtml = '<div class="pagination">';
    
    // Nút Previous
    paginationHtml += `
        <button class="pagination-btn" ${currentPage === 0 ? 'disabled' : ''} 
                onclick="loadCourtTypes(${currentPage - 1})">
            &laquo; Trước
        </button>
    `;

    // Các nút số trang
    for (let i = 0; i < totalPages; i++) {
        paginationHtml += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="loadCourtTypes(${i})">
                ${i + 1}
            </button>
        `;
    }

    // Nút Next
    paginationHtml += `
        <button class="pagination-btn" ${currentPage === totalPages - 1 ? 'disabled' : ''} 
                onclick="loadCourtTypes(${currentPage + 1})">
            Sau &raquo;
        </button>
    `;

    paginationHtml += '</div>';
    paginationContainer.innerHTML = paginationHtml;
}

// Hàm lọc sân theo loại
async function filterCourts(selectedType) {
    const main = document.querySelector('main');
    const oldSections = main.querySelectorAll('.courts-section');
    const oldPagination = document.querySelector('.pagination-container');
    
    // Xóa các section và phân trang cũ
    oldSections.forEach(section => section.remove());
    if (oldPagination) {
        oldPagination.remove();
    }

    if (selectedType === 'all') {
        // Nếu chọn "Tất cả loại sân", hiển thị phân trang
        loadCourtTypes(0);
    } else {
        // Nếu chọn một loại sân cụ thể, hiển thị tất cả sân của loại đó
        try {
            const response = await fetch(`/api/courts/type/${selectedType}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            const courts = await response.json();
            
            // Tạo section cho loại sân đã chọn
            const courtType = document.querySelector(`#courtTypeFilter option[value="${selectedType}"]`).textContent;
            const sectionHtml = `
                <section class="courts-section">
                    <div class="container">
                        <h2 class="section-title">${courtType}</h2>
                        <div class="courts-container">
                            ${courts.map(court => createCourtCard(court)).join('')}
                        </div>
                    </div>
                </section>
            `;
            
            main.insertAdjacentHTML('beforeend', sectionHtml);
        } catch (error) {
            console.error('Lỗi khi tải sân theo loại:', error);
        }
    }
}

// Hàm tạo section cho một loại sân
async function createCourtTypeSection(courtType) {
    try {
        // Gọi API lấy danh sách sân theo loại
        const response = await fetch(`/api/courts/type/${courtType.id}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        const courts = await response.json();
        
        // Tính toán phân trang
        const courtsPerPage = 3;
        // Tạo HTML cho section với phân trang
        const sectionHtml = `
            <section class="courts-section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">${courtType.name}</h2>
                        <div class="section-pagination" data-type="${courtType.id}"></div>
                    </div>
                    <div class="courts-container" id="courts-${courtType.id}">
                        ${courts.slice(0, courtsPerPage).map(court => createCourtCard(court)).join('')}
                    </div>
                </div>
            </section>
        `;
        // Thêm section vào DOM
        document.querySelector('main').insertAdjacentHTML('beforeend', sectionHtml);
        // Render phân trang lần đầu
        renderSectionPagination(courtType.id, courts, courtsPerPage, 0);
    } catch (error) {
        console.error(`Lỗi khi tải sân cho loại ${courtType.name}:`, error);
    }
}

// Hàm render phân trang cho section và gán lại event listeners
function renderSectionPagination(courtTypeId, courts, courtsPerPage, currentPage) {
    const totalPages = Math.ceil(courts.length / courtsPerPage);
    const sectionPagination = document.querySelector(`.section-pagination[data-type="${courtTypeId}"]`);
    if (!sectionPagination) return;

    let paginationHtml = '<div class="section-pagination-buttons">';
    // Nút Previous
    paginationHtml += `
        <button class="section-pagination-btn" ${currentPage === 0 ? 'disabled' : ''} 
                data-page="${currentPage - 1}" data-type="${courtTypeId}">
            &laquo;
        </button>
    `;
    // Các nút số trang
    for (let i = 0; i < totalPages; i++) {
        paginationHtml += `
            <button class="section-pagination-btn ${i === currentPage ? 'active' : ''}" 
                    data-page="${i}" data-type="${courtTypeId}">
                ${i + 1}
            </button>
        `;
    }
    // Nút Next
    paginationHtml += `
        <button class="section-pagination-btn" ${currentPage === totalPages - 1 ? 'disabled' : ''} 
                data-page="${currentPage + 1}" data-type="${courtTypeId}">
            &raquo;
        </button>
    `;
    paginationHtml += '</div>';
    sectionPagination.innerHTML = paginationHtml;

    // Gán lại event listener
    const paginationButtons = sectionPagination.querySelectorAll('.section-pagination-btn');
    paginationButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.disabled) return;
            const page = parseInt(this.dataset.page);
            const start = page * courtsPerPage;
            const end = start + courtsPerPage;
            const pageCourts = courts.slice(start, end);
            // Cập nhật hiển thị sân
            const courtsContainer = document.getElementById(`courts-${courtTypeId}`);
            courtsContainer.innerHTML = pageCourts.map(court => createCourtCard(court)).join('');
            // Render lại phân trang với trạng thái mới
            renderSectionPagination(courtTypeId, courts, courtsPerPage, page);
        });
    });
}

// Hàm tạo card cho một sân
function createCourtCard(court) {
    return `
        <div class="court-card" id="court-${court.id}">
            <div class="court-image">
                <img src="${court.imageUrl || '../../chung/default-court.jpg'}" alt="${court.name}">
            </div>
            <div class="court-info">
                <h3 class="court-name">${court.name}</h3>
                <ul>
                    <li><span class="icon">📍</span> <strong>Địa chỉ:</strong> ${court.address}</li>
                    <li><span class="icon">🕖</span> <strong>Giờ mở cửa:</strong> ${court.hours}</li>
                    <li><span class="icon">💰</span> <strong>Giá thuê sân:</strong> ${court.price}đ/h</li>
                </ul>
            </div>
        </div>
    `;
}

// Xử lý sự kiện click vào card sân
document.addEventListener('click', function(event) {
    const courtCard = event.target.closest('.court-card');
    if (courtCard) {
        const courtId = courtCard.id.split('-')[1];
        window.location.href = `../xemchitiet/index.html?id=${courtId}`;
    }
});
