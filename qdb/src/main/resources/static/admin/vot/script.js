// JavaScript để xử lý click vào avatar và các chức năng khác
document.addEventListener('DOMContentLoaded', function() {
    const avatarButton = document.getElementById('avatarButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const racketTypeFilter = document.getElementById('racketTypeFilter');
    
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
    racketTypeFilter.addEventListener('change', function() {
        const selectedType = this.value;
        filterRackets(selectedType);
    });

    // Load tất cả loại vợt cho dropdown
    loadAllRacketTypes();
    // Load trang đầu tiên với phân trang
    loadRacketTypes(0);
});

// Hàm load tất cả loại vợt cho dropdown
async function loadAllRacketTypes() {
    try {
        const response = await fetch('/api/racket-types', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        const racketTypes = await response.json();
        
        // Thêm các option vào select
        const racketTypeFilter = document.getElementById('racketTypeFilter');
        racketTypeFilter.innerHTML = '<option value="all">Tất cả loại vợt</option>';
        racketTypes.forEach(racketType => {
            const option = document.createElement('option');
            option.value = racketType.id;
            option.textContent = racketType.name;
            racketTypeFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Lỗi khi tải danh sách loại vợt cho dropdown:', error);
    }
}

// Hàm gọi API lấy danh sách loại vợt có phân trang
async function loadRacketTypes(page) {
    try {
        const response = await fetch(`/api/racket-types/paginated?page=${page}&size=3`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        const data = await response.json();
        
        // Xóa các section cũ và phân trang cũ
        const main = document.querySelector('main');
        const oldSections = main.querySelectorAll('.rackets-section');
        oldSections.forEach(section => section.remove());
        const oldPagination = document.querySelector('.pagination-container');
        if (oldPagination) {
            oldPagination.remove();
        }
        
        // Tạo container cho các section
        const sectionsContainer = document.createElement('div');
        sectionsContainer.className = 'sections-container';
        main.appendChild(sectionsContainer);
        
        // Tạo các section cho từng loại vợt
        for (const racketType of data.racketTypes) {
            await createRacketTypeSection(racketType);
        }

        // Sau khi tất cả các section đã được tạo xong, mới tạo phân trang
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination-container';
        main.appendChild(paginationContainer);
        createPagination(data.currentPage, data.totalPages);
    } catch (error) {
        console.error('Lỗi khi tải danh sách loại vợt:', error);
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
                onclick="loadRacketTypes(${currentPage - 1})">
            &laquo; Trước
        </button>
    `;

    // Các nút số trang
    for (let i = 0; i < totalPages; i++) {
        paginationHtml += `
            <button class="pagination-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="loadRacketTypes(${i})">
                ${i + 1}
            </button>
        `;
    }

    // Nút Next
    paginationHtml += `
        <button class="pagination-btn" ${currentPage === totalPages - 1 ? 'disabled' : ''} 
                onclick="loadRacketTypes(${currentPage + 1})">
            Sau &raquo;
        </button>
    `;

    paginationHtml += '</div>';
    paginationContainer.innerHTML = paginationHtml;
}

// Hàm lọc vợt theo loại
async function filterRackets(selectedType) {
    const main = document.querySelector('main');
    const oldSections = main.querySelectorAll('.rackets-section');
    const oldPagination = document.querySelector('.pagination-container');
    
    // Xóa các section và phân trang cũ
    oldSections.forEach(section => section.remove());
    if (oldPagination) {
        oldPagination.remove();
    }

    if (selectedType === 'all') {
        // Nếu chọn "Tất cả loại vợt", hiển thị phân trang
        loadRacketTypes(0);
    } else {
        // Nếu chọn một loại vợt cụ thể, hiển thị tất cả vợt của loại đó
        try {
            const response = await fetch(`/api/rackets/type/${selectedType}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            });
            const rackets = await response.json();
            
            // Tạo section cho loại vợt đã chọn
            const racketType = document.querySelector(`#racketTypeFilter option[value="${selectedType}"]`).textContent;
            const sectionHtml = `
                <section class="rackets-section">
                    <div class="container">
                        <h2 class="section-title">${racketType}</h2>
                        <div class="rackets-container">
                            ${rackets.map(racket => createRacketCard(racket)).join('')}
                        </div>
                    </div>
                </section>
            `;
            
            main.insertAdjacentHTML('beforeend', sectionHtml);
        } catch (error) {
            console.error('Lỗi khi tải vợt theo loại:', error);
        }
    }
}

// Hàm tạo section cho một loại vợt
async function createRacketTypeSection(racketType) {
    try {
        // Gọi API lấy danh sách vợt theo loại
        const response = await fetch(`/api/rackets/type/${racketType.id}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        const rackets = await response.json();
        
        // Tính toán phân trang
        const racketsPerPage = 3;
        // Tạo HTML cho section với phân trang
        const sectionHtml = `
            <section class="rackets-section">
                <div class="container">
                    <div class="section-header">
                        <h2 class="section-title">${racketType.name}</h2>
                        <div class="section-pagination" data-type="${racketType.id}"></div>
                    </div>
                    <div class="rackets-container" id="rackets-${racketType.id}">
                        ${rackets.slice(0, racketsPerPage).map(racket => createRacketCard(racket)).join('')}
                    </div>
                </div>
            </section>
        `;
        // Thêm section vào DOM
        document.querySelector('main').insertAdjacentHTML('beforeend', sectionHtml);
        // Render phân trang lần đầu
        renderSectionPagination(racketType.id, rackets, racketsPerPage, 0);
    } catch (error) {
        console.error(`Lỗi khi tải vợt cho loại ${racketType.name}:`, error);
    }
}

// Hàm render phân trang cho section và gán lại event listeners
function renderSectionPagination(racketTypeId, rackets, racketsPerPage, currentPage) {
    const totalPages = Math.ceil(rackets.length / racketsPerPage);
    const sectionPagination = document.querySelector(`.section-pagination[data-type="${racketTypeId}"]`);
    if (!sectionPagination) return;

    let paginationHtml = '<div class="section-pagination-buttons">';
    // Nút Previous
    paginationHtml += `
        <button class="section-pagination-btn" ${currentPage === 0 ? 'disabled' : ''} 
                data-page="${currentPage - 1}" data-type="${racketTypeId}">
            &laquo;
        </button>
    `;
    // Các nút số trang
    for (let i = 0; i < totalPages; i++) {
        paginationHtml += `
            <button class="section-pagination-btn ${i === currentPage ? 'active' : ''}" 
                    data-page="${i}" data-type="${racketTypeId}">
                ${i + 1}
            </button>
        `;
    }
    // Nút Next
    paginationHtml += `
        <button class="section-pagination-btn" ${currentPage === totalPages - 1 ? 'disabled' : ''} 
                data-page="${currentPage + 1}" data-type="${racketTypeId}">
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
            const start = page * racketsPerPage;
            const end = start + racketsPerPage;
            const pageRackets = rackets.slice(start, end);
            // Cập nhật hiển thị vợt
            const racketsContainer = document.getElementById(`rackets-${racketTypeId}`);
            racketsContainer.innerHTML = pageRackets.map(racket => createRacketCard(racket)).join('');
            // Render lại phân trang với trạng thái mới
            renderSectionPagination(racketTypeId, rackets, racketsPerPage, page);
        });
    });
}

// Hàm tạo card cho một vợt
function createRacketCard(racket) {
    return `
        <div class="racket-card" id="racket-${racket.id}">
            <div class="racket-image">
                <img src="${racket.imageUrl}" alt="${racket.name}">
            </div>
            <div class="racket-info">
                <h3 class="racket-name">${racket.name}</h3>
                <p class="racket-brand">Thương hiệu: ${racket.brand}</p>
                <p class="racket-price">Giá thuê: ${racket.price}đ/h</p>
            </div>
        </div>
    `;
}

// Xử lý sự kiện click vào card vợt
document.addEventListener('click', function(event) {
    const racketCard = event.target.closest('.racket-card');
    if (racketCard) {
        const racketId = racketCard.id.split('-')[1];
        window.location.href = `../xemchitiet1/index.html?id=${racketId}`;
    }
});