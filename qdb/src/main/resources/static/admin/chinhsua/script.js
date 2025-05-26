// Biến cấu hình
const API_BASE_URL = '/api'; // Có thể thay đổi thành URL đầy đủ trong môi trường sản xuất

document.addEventListener('DOMContentLoaded', function() {
    // Xử lý menu dropdown của avatar
    const avatarButton = document.getElementById('avatarButton');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (avatarButton && dropdownMenu) {
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
    }
    
    // Xử lý modal thêm loại sân
    const addCourtTypeBtn = document.getElementById('addCourtTypeBtn');
    const courtTypeModal = document.getElementById('courtTypeModal');
    const courtTypeForm = document.querySelector('.court-type-form');
    const cancelBtn = document.querySelector('.court-type-modal-btn.cancel');
    const courtTypeModalTitle = document.getElementById('courtTypeModalTitle');
    const courtTypeModalSaveBtn = document.getElementById('courtTypeModalSaveBtn');
    
    if (addCourtTypeBtn && courtTypeModal) {
        addCourtTypeBtn.addEventListener('click', function() {
            editingCourtTypeId = null;
            courtTypeModalTitle.textContent = 'Thêm loại sân mới';
            courtTypeModalSaveBtn.textContent = 'Thêm';
            courtTypeForm.reset();
            courtTypeModal.style.display = 'block';
        });
        
        cancelBtn.addEventListener('click', function() {
            courtTypeModal.style.display = 'none';
            courtTypeForm.reset();
            editingCourtTypeId = null;
            courtTypeModalTitle.textContent = 'Thêm loại sân mới';
            courtTypeModalSaveBtn.textContent = 'Thêm';
        });
        
        courtTypeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const courtTypeName = document.getElementById('courtTypeName').value;
            if (editingCourtTypeId) {
                updateCourtType(editingCourtTypeId, courtTypeName);
            } else {
                createCourtType(courtTypeName);
            }
        });
        
        // Đóng modal khi click bên ngoài
        window.addEventListener('click', function(event) {
            if (event.target === courtTypeModal) {
                courtTypeModal.style.display = 'none';
                courtTypeForm.reset();
                editingCourtTypeId = null;
                courtTypeModalTitle.textContent = 'Thêm loại sân mới';
                courtTypeModalSaveBtn.textContent = 'Thêm';
            }
        });
    }
    
    // Khởi tạo trang quản lý sân
    loadCourtTypes();
    
    // Xử lý sự kiện click chọn file hình ảnh
    const courtImageInput = document.getElementById('courtImage');
    if (courtImageInput) {
        courtImageInput.addEventListener('change', function() {
            const fileLabel = document.querySelector('.file-upload-label');
            if (fileLabel) {
                fileLabel.textContent = this.files.length > 0 ? this.files[0].name : 'Chọn tệp';
            }
        });
    }
    
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
            if (!validateCourtForm()) {
                return;
            }
            
            // Lấy courtId từ data attribute nếu đang cập nhật
            const courtId = saveButton.dataset.courtId;
            const imageFile = document.getElementById('courtImage').files[0];
            
            if (courtId) {
                // Cập nhật sân
                updateCourt(courtId, name, address, hours, price, imageFile);
            } else {
                // Tạo sân mới
                const activeCategory = document.querySelector('.active-category');
                if (!activeCategory) {
                    showError('Vui lòng chọn loại sân');
                    return;
                }
                const courtTypeId = activeCategory.dataset.categoryId;
                createCourt(name, address, hours, price, courtTypeId, imageFile);
            }
        });
    }
    
    // Xử lý thanh tìm kiếm
    const searchBar = document.querySelector('.search-bar');
    if (searchBar) {
        searchBar.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    searchCourts(searchTerm);
                }
            }
        });
    }
    
    // Theo dõi trạng thái mạng
    window.addEventListener('online', function() {
        showToast('Kết nối đã được khôi phục', 'success');
    });

    window.addEventListener('offline', function() {
        showToast('Mất kết nối mạng. Một số tính năng có thể không hoạt động.', 'error');
    });
});

// ----- FUNCTIONS TO INTERACT WITH API -----

// 1. COURT TYPES MANAGEMENT

// Hàm gọi API lấy danh sách loại sân
function loadCourtTypes() {
    showLoading(true);
    fetch(`${API_BASE_URL}/court-types`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(handleResponse)
        .then(data => {
            // Cập nhật UI với danh sách loại sân
            updateCourtTypesList(data);
            showLoading(false);
        })
        .catch(error => {
            console.error('Error loading court types:', error);
            showError('Không thể tải danh sách loại sân: ' + error.message);
            showLoading(false);
        });
}

// Hàm cập nhật UI danh sách loại sân
function updateCourtTypesList(courtTypes) {
    const sidebar = document.querySelector('.court-list-sidebar');
    if (!sidebar) return;
    
    sidebar.innerHTML = ''; // Xóa nội dung hiện tại
    
    if (courtTypes.length === 0) {
        sidebar.innerHTML = '<div class="empty-message">Chưa có loại sân nào</div>';
        return;
    }
    
    courtTypes.forEach(courtType => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'court-category';
        categoryDiv.dataset.categoryId = courtType.id;
        categoryDiv.dataset.categoryName = courtType.name;
        
        categoryDiv.innerHTML = `
            <div class="category-header">
                <span class="category-name">${courtType.name}</span>
                <div class="action-buttons">
                    <button class="edit-category-btn" title="Sửa loại sân"><i class="fas fa-edit"></i></button>
                    <button class="add-btn" title="Thêm sân mới">+</button>
                    <button class="dropdown-btn" title="Hiển thị danh sách sân">▼</button>
                    <button class="delete-category-btn" title="Xóa loại sân">×</button>
                </div>
            </div>
            <div class="sub-courts" style="display: none;"></div>
        `;
        
        sidebar.appendChild(categoryDiv);
        
        // Gắn sự kiện cho các nút
        attachCategoryEvents(categoryDiv);
    });
}

// Hàm tạo loại sân mới
function createCourtType(name) {
    showLoading(true);
    fetch(`${API_BASE_URL}/court-types`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ name: name })
    })
    .then(handleResponse)
    .then(data => {
        showSuccess('Đã thêm loại sân mới thành công');
        document.getElementById('courtTypeModal').style.display = 'none';
        document.querySelector('.court-type-form').reset();
        loadCourtTypes(); // Tải lại danh sách loại sân
    })
    .catch(error => {
        console.error('Error creating court type:', error);
        showError('Không thể thêm loại sân: ' + error.message);
    })
    .finally(() => {
        showLoading(false);
    });
}

// Hàm xóa loại sân
function deleteCourtType(courtTypeId) {
    showConfirm(
        'Xóa loại sân',
        'Bạn có chắc chắn muốn xóa loại sân này?',
        function() {
            showLoading(true);
            fetch(`${API_BASE_URL}/court-types/${courtTypeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then(handleResponse)
            .then(() => {
                showSuccess('Đã xóa loại sân thành công');
                loadCourtTypes(); // Tải lại danh sách loại sân
            })
            .catch(error => {
                console.error('Error deleting court type:', error);
                if (error.message.includes('còn sân')) {
                    showError('Không thể xóa loại sân vì vẫn còn sân trong loại này');
                } else {
                    showError('Không thể xóa loại sân: ' + error.message);
                }
            })
            .finally(() => {
                showLoading(false);
            });
        }
    );
}

// Hàm sửa loại sân
function updateCourtType(courtTypeId, name) {
    showLoading(true);
    fetch(`${API_BASE_URL}/court-types/${courtTypeId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ name: name })
    })
    .then(handleResponse)
    .then(data => {
        showSuccess('Đã cập nhật loại sân thành công');
        courtTypeModal.style.display = 'none';
        document.querySelector('.court-type-form').reset();
        editingCourtTypeId = null;
        courtTypeModalTitle.textContent = 'Thêm loại sân mới';
        courtTypeModalSaveBtn.textContent = 'Thêm';
        loadCourtTypes(); // Tải lại danh sách loại sân
    })
    .catch(error => {
        console.error('Error updating court type:', error);
        showError('Không thể cập nhật loại sân: ' + error.message);
    })
    .finally(() => {
        showLoading(false);
    });
}

// 2. COURTS MANAGEMENT

// Hàm gọi API lấy danh sách sân theo loại
function loadCourtsByType(courtTypeId, subCourtsContainer) {
    if (!subCourtsContainer) return;
    
    showLoading(true);
    fetch(`${API_BASE_URL}/courts/type/${courtTypeId}`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(handleResponse)
        .then(data => {
            // Cập nhật UI với danh sách sân
            updateCourtsList(data, subCourtsContainer);
            showLoading(false);
        })
        .catch(error => {
            console.error('Error loading courts:', error);
            showError('Không thể tải danh sách sân: ' + error.message);
            showLoading(false);
        });
}

// Hàm cập nhật UI danh sách sân
function updateCourtsList(courts, container) {
    if (!container) return;
    
    container.innerHTML = ''; // Xóa nội dung hiện tại
    
    if (courts.length === 0) {
        container.innerHTML = '<div class="sub-court-empty">Chưa có sân nào trong danh mục này</div>';
        return;
    }
    
    courts.forEach(court => {
        const courtDiv = document.createElement('div');
        courtDiv.className = 'sub-court';
        courtDiv.dataset.court = court.id;
        
        courtDiv.innerHTML = `
            <button class="expand-btn">▶</button>
            <span class="court-name">${court.name}</span>
            <div class="court-actions">
                <button class="edit-btn" title="Chỉnh sửa"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" title="Xóa"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        container.appendChild(courtDiv);
        
        // Gắn sự kiện cho sân
        attachCourtEvents(courtDiv);
    });
}

// Hàm gọi API lấy thông tin chi tiết sân
function loadCourtDetails(courtId) {
    showLoading(true);
    fetch(`${API_BASE_URL}/courts/${courtId}`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(handleResponse)
        .then(data => {
            // Cập nhật UI với thông tin sân
            updateCourtForm(data);
            showLoading(false);
        })
        .catch(error => {
            console.error('Error loading court details:', error);
            showError('Không thể tải thông tin sân: ' + error.message);
            showLoading(false);
        });
}

// Hàm tìm kiếm sân
function searchCourts(term) {
    showLoading(true);
    fetch(`${API_BASE_URL}/courts/search?term=${encodeURIComponent(term)}`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
        .then(handleResponse)
        .then(data => {
            // Hiển thị kết quả tìm kiếm
            // Tùy thuộc vào UI, bạn có thể hiển thị popup hoặc chuyển đến trang kết quả
            showLoading(false);
            
            if (data.length === 0) {
                showToast('Không tìm thấy sân nào phù hợp', 'info');
            } else {
                // Hiển thị kết quả tìm kiếm
                showSearchResults(data, term);
            }
        })
        .catch(error => {
            console.error('Error searching courts:', error);
            showError('Lỗi khi tìm kiếm: ' + error.message);
            showLoading(false);
        });
}

// Hàm hiển thị kết quả tìm kiếm
function showSearchResults(results, term) {
    // Tạo và hiển thị modal kết quả tìm kiếm
    let modal = document.getElementById('searchResultsModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'searchResultsModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Kết quả tìm kiếm: <span id="searchTerm"></span></h3>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div id="searchResultsList"></div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Xử lý đóng modal
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Cập nhật nội dung modal
    const searchTermEl = modal.querySelector('#searchTerm');
    searchTermEl.textContent = term;
    
    const resultsList = modal.querySelector('#searchResultsList');
    resultsList.innerHTML = '';
    
    results.forEach(court => {
        const courtItem = document.createElement('div');
        courtItem.className = 'search-result-item';
        courtItem.innerHTML = `
            <h4>${court.name}</h4>
            <p>${court.address || 'Chưa có địa chỉ'}</p>
            <p>${court.hours || ''} - ${court.price || ''}</p>
            <button class="view-court-btn" data-court-id="${court.id}">Xem chi tiết</button>
        `;
        resultsList.appendChild(courtItem);
        
        // Xử lý nút xem chi tiết
        const viewBtn = courtItem.querySelector('.view-court-btn');
        viewBtn.addEventListener('click', function() {
            loadCourtDetails(this.dataset.courtId);
            modal.style.display = 'none';
        });
    });
    
    // Hiển thị modal
    modal.style.display = 'block';
}

// Hàm cập nhật form thông tin sân
function updateCourtForm(court) {
    document.getElementById('courtName').value = court.name || '';
    document.getElementById('courtAddress').value = court.address || '';
    document.getElementById('courtHours').value = court.hours || '';
    document.getElementById('courtPrice').value = court.price || '';
    
    // Reset file input
    const fileInput = document.getElementById('courtImage');
    if (fileInput) {
        fileInput.value = '';
        const fileLabel = document.querySelector('.file-upload-label');
        if (fileLabel) {
            fileLabel.textContent = 'Chọn tệp';
        }
    }
    
    // Lưu courtId vào data attribute của nút lưu
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        saveButton.dataset.courtId = court.id;
    }
    
    // Cập nhật tiêu đề
    const detailsTitle = document.querySelector('.details-title');
    if (detailsTitle) {
        detailsTitle.textContent = `Thông tin sân: ${court.name}`;
    }
    
    // Hiển thị hình ảnh nếu có
    if (court.imageUrl) {
        // Tạo hoặc cập nhật preview hình ảnh
        let imagePreview = document.getElementById('courtImagePreview');
        if (!imagePreview) {
            imagePreview = document.createElement('div');
            imagePreview.id = 'courtImagePreview';
            imagePreview.className = 'image-preview';
            
            const fileUploadWrapper = document.querySelector('.file-upload-wrapper');
            if (fileUploadWrapper) {
                fileUploadWrapper.appendChild(imagePreview);
            }
        }
        
        imagePreview.innerHTML = `<img src="${court.imageUrl}?t=${Date.now()}" alt="${court.name}">`;
        imagePreview.style.display = 'block';
    } else {
        const imagePreview = document.getElementById('courtImagePreview');
        if (imagePreview) {
            imagePreview.style.display = 'none';
        }
    }
}

// Hàm kiểm tra form thông tin sân
function validateCourtForm() {
    const name = document.getElementById('courtName').value.trim();
    const address = document.getElementById('courtAddress').value.trim();
    const hours = document.getElementById('courtHours').value.trim();
    const price = document.getElementById('courtPrice').value.trim();
    
    if (!name) {
        showError('Vui lòng nhập tên sân');
        return false;
    }
    
    if (!address) {
        showError('Vui lòng nhập địa chỉ sân');
        return false;
    }
    
    if (!hours) {
        showError('Vui lòng nhập giờ thuê');
        return false;
    }
    
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

// Hàm upload ảnh trả về imageUrl
function uploadImageOnly(imageFile) {
    if (!imageFile) return Promise.resolve({});
    const formData = new FormData();
    formData.append('image', imageFile);
    return fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(handleResponse)
    .then(data => data);
}

// Hàm gọi API tạo sân mới
function createCourt(name, address, hours, price, courtTypeId, imageFile) {
    showLoading(true);
    const doCreate = (imageUrl) => {
        const courtData = {
            name: name,
            address: address,
            hours: hours,
            price: price,
            courtTypeId: courtTypeId,
            imageUrl: imageUrl || ''
        };
        console.log('Tạo sân với courtData:', courtData);
        fetch(`${API_BASE_URL}/courts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(courtData)
        })
        .then(handleResponse)
        .then(data => {
            showSuccess('Đã lưu thông tin sân thành công');
            // Làm mới danh sách sân
            const category = document.querySelector(`.court-category[data-category-id="${courtTypeId}"]`);
            if (category) {
                const subCourts = category.querySelector('.sub-courts');
                loadCourtsByType(courtTypeId, subCourts);
            }
            // Reset form
            document.getElementById('courtForm').reset();
            document.getElementById('saveButton').removeAttribute('data-court-id');
            
            // Reset image preview
            const imagePreview = document.getElementById('courtImagePreview');
            if (imagePreview) {
                imagePreview.style.display = 'none';
            }
            
            // Reset file label
            const fileLabel = document.querySelector('.file-upload-label');
            if (fileLabel) {
                fileLabel.textContent = 'Chọn tệp';
            }
            
            showLoading(false);
        })
        .catch(error => {
            console.error('Error creating court:', error);
            showError('Lỗi khi tạo sân: ' + error.message);
            showLoading(false);
        });
    };
    if (imageFile) {
        uploadImageOnly(imageFile).then(res => {
            doCreate(res && res.imageUrl ? res.imageUrl : '');
        }).catch(err => {
            showError('Lỗi upload ảnh: ' + err.message);
            showLoading(false);
        });
    } else {
        doCreate('');
    }
}

// Hàm gọi API cập nhật sân
function updateCourt(courtId, name, address, hours, price, imageFile) {
    showLoading(true);
    const doUpdate = (imageUrl) => {
        const courtData = {
            name: name,
            address: address,
            hours: hours,
            price: price
        };
        if (imageUrl !== undefined) courtData.imageUrl = imageUrl;
        console.log('Cập nhật sân với courtData:', courtData);
        fetch(`${API_BASE_URL}/courts/${courtId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(courtData)
        })
        .then(handleResponse)
        .then(finalData => {
            showSuccess('Đã cập nhật thông tin sân thành công');
            // Cập nhật tên sân trong danh sách
            const courtNameElement = document.querySelector(`.sub-court[data-court="${courtId}"] .court-name`);
            if (courtNameElement) {
                courtNameElement.textContent = name;
            }
            // Cập nhật lại preview ảnh nếu có imageUrl mới
            if (finalData && finalData.imageUrl) {
                let imagePreview = document.getElementById('courtImagePreview');
                if (!imagePreview) {
                    imagePreview = document.createElement('div');
                    imagePreview.id = 'courtImagePreview';
                    imagePreview.className = 'image-preview';
                    const fileUploadWrapper = document.querySelector('.file-upload-wrapper');
                    if (fileUploadWrapper) {
                        fileUploadWrapper.appendChild(imagePreview);
                    }
                }
                // Thêm query string để tránh cache ảnh cũ
                imagePreview.innerHTML = `<img src="${finalData.imageUrl}?t=${Date.now()}" alt="${name}">`;
                imagePreview.style.display = 'block';
            }
            showLoading(false);
        })
        .catch(error => {
            console.error('Error updating court:', error);
            showError('Lỗi khi cập nhật sân: ' + error.message);
            showLoading(false);
        });
    };
    if (imageFile) {
        uploadImageOnly(imageFile).then(res => {
            doUpdate(res && res.imageUrl ? res.imageUrl : '');
        }).catch(err => {
            showError('Lỗi upload ảnh: ' + err.message);
            showLoading(false);
        });
    } else {
        doUpdate();
    }
}

// Hàm gọi API xóa sân
function deleteCourt(courtId, courtTypeId) {
    showConfirm('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa sân này không?', function() {
        showLoading(true);
        fetch(`${API_BASE_URL}/courts/${courtId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(handleResponse)
        .then(data => {
            showSuccess('Đã xóa sân thành công');
            // Làm mới danh sách sân
            const category = document.querySelector(`.court-category[data-category-id="${courtTypeId}"]`);
            if (category) {
                const subCourts = category.querySelector('.sub-courts');
                loadCourtsByType(courtTypeId, subCourts);
            }
            // Reset form
            document.getElementById('courtForm').reset();
            document.getElementById('saveButton').removeAttribute('data-court-id');
            
            // Cập nhật tiêu đề
            const detailsTitle = document.querySelector('.details-title');
            if (detailsTitle) {
                detailsTitle.textContent = 'Thông tin';
            }
            
            // Reset image preview
            const imagePreview = document.getElementById('courtImagePreview');
            if (imagePreview) {
                imagePreview.style.display = 'none';
            }
            
            showLoading(false);
        })
        .catch(error => {
            console.error('Error deleting court:', error);
            showError('Lỗi khi xóa sân: ' + error.message);
            showLoading(false);
        });
    });
}

// ----- UI FUNCTIONS -----

// Hàm gắn sự kiện cho các danh mục loại sân
function attachCategoryEvents(categoryDiv) {
    const categoryHeader = categoryDiv.querySelector('.category-header');
    const subCourts = categoryDiv.querySelector('.sub-courts');
    const dropdownBtn = categoryDiv.querySelector('.dropdown-btn');
    const addBtn = categoryDiv.querySelector('.add-btn');
    const deleteBtn = categoryDiv.querySelector('.delete-category-btn');
    const editBtn = categoryDiv.querySelector('.edit-category-btn');
    const categoryId = categoryDiv.dataset.categoryId;
    const categoryName = categoryDiv.dataset.categoryName;
    
    // Xử lý nút sửa loại sân
    if (editBtn) {
        editBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            editingCourtTypeId = categoryId;
            document.getElementById('courtTypeName').value = categoryName;
            courtTypeModalTitle.textContent = 'Sửa loại sân';
            courtTypeModalSaveBtn.textContent = 'Lưu';
            courtTypeModal.style.display = 'block';
        });
    }
    
    // Xử lý nút xóa loại sân
    deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        deleteCourtType(categoryId);
    });
    
    if (dropdownBtn && subCourts && categoryId) {
        dropdownBtn.addEventListener('click', function() {
            this.textContent = this.textContent === '▼' ? '▲' : '▼';
            
            if (subCourts.style.display === 'none' || !subCourts.style.display) {
                subCourts.style.display = 'block';
                
                // Load danh sách sân
                loadCourtsByType(categoryId, subCourts);
            } else {
                subCourts.style.display = 'none';
            }
        });
    }
    
    // Gắn sự kiện cho nút thêm sân
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            // Đặt category này là active
            document.querySelectorAll('.court-category').forEach(cat => {
                cat.classList.remove('active-category');
            });
            categoryDiv.classList.add('active-category');
            
            // Reset form
            document.getElementById('courtForm').reset();
            const saveButton = document.getElementById('saveButton');
            if (saveButton) {
                saveButton.removeAttribute('data-court-id');
            }
            
            // Reset image preview
            const imagePreview = document.getElementById('courtImagePreview');
            if (imagePreview) {
                imagePreview.style.display = 'none';
            }
            
            // Cập nhật tiêu đề
            const detailsTitle = document.querySelector('.details-title');
            if (detailsTitle) {
                detailsTitle.textContent = `Thêm sân mới - ${categoryDiv.dataset.categoryName}`;
            }
        });
    }
    
    // Gắn sự kiện cho tên danh mục
    const categoryNameEl = categoryDiv.querySelector('.category-name');
    if (categoryNameEl && dropdownBtn) {
        categoryNameEl.addEventListener('click', function() {
            dropdownBtn.click(); // Simulate click on dropdown button
        });
    }
}

// Hàm gắn sự kiện cho các sân
function attachCourtEvents(courtDiv) {
    if (!courtDiv) return;
    
    const courtId = courtDiv.dataset.court;
    const courtTypeId = courtDiv.closest('.court-category')?.dataset.categoryId;
    
    // Gắn sự kiện cho nút mở rộng
    const expandBtn = courtDiv.querySelector('.expand-btn');
    if (expandBtn) {
        expandBtn.addEventListener('click', function() {
            this.textContent = this.textContent === '▶' ? '▼' : '▶';
            
            // Load thông tin chi tiết sân
            loadCourtDetails(courtId);
            
            // Đánh dấu sân đang được chọn
            document.querySelectorAll('.sub-court').forEach(court => {
                court.classList.remove('selected');
            });
            courtDiv.classList.add('selected');
        });
    }
    
    // Gắn sự kiện cho tên sân
    const courtName = courtDiv.querySelector('.court-name');
    if (courtName) {
        courtName.addEventListener('click', function() {
            // Load thông tin chi tiết sân
            loadCourtDetails(courtId);
            
            // Đánh dấu sân đang được chọn
            document.querySelectorAll('.sub-court').forEach(court => {
                court.classList.remove('selected');
            });
            courtDiv.classList.add('selected');
            
            // Thay đổi icon nút mở rộng
            if (expandBtn) {
                expandBtn.textContent = '▼';
            }
        });
    }
    
    // Gắn sự kiện cho nút chỉnh sửa
    const editBtn = courtDiv.querySelector('.edit-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            loadCourtDetails(courtId);
            
            // Đánh dấu sân đang được chọn
            document.querySelectorAll('.sub-court').forEach(court => {
                court.classList.remove('selected');
            });
            courtDiv.classList.add('selected');
            
            // Thay đổi icon nút mở rộng
            if (expandBtn) {
                expandBtn.textContent = '▼';
            }
        });
    }
    
    // Gắn sự kiện cho nút xóa
    const deleteBtn = courtDiv.querySelector('.delete-btn');
    if (deleteBtn && courtTypeId) {
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            deleteCourt(courtId, courtTypeId);
        });
    }
}

// ----- HELPER FUNCTIONS -----

// Xử lý response từ API
function handleResponse(response) {
    if (!response.ok) {
        if (response.status === 401) {
            window.location.href = '/login.html';
            throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }
        // Nếu có lỗi, vẫn cố gắng đọc JSON để lấy message
        return response.text().then(text => {
            let err;
            try {
                err = text ? JSON.parse(text) : {};
            } catch {
                err = { message: text };
            }
            throw new Error(err.message || 'Lỗi từ server');
        });
    }
    // Nếu là 204 No Content hoặc không có body, trả về true
    if (response.status === 204) {
        return true;
    }
    // Nếu có body, trả về JSON
    return response.text().then(text => text ? JSON.parse(text) : {});
}

// Đọc dữ liệu từ localStorage một cách an toàn
function getSafeItem(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error('Error reading from localStorage:', e);
        return null;
    }
}

// Hiển thị thông báo thành công
function showSuccess(message) {
    showToast(message, 'success');
}

// Hiển thị thông báo lỗi
function showError(message) {
    showToast(message, 'error');
}

// Hiển thị toast notification
function showToast(message, type) {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        ${message}
        <button class="toast-close">&times;</button>
    `;
    
    container.appendChild(toast);
    
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', function() {
        container.removeChild(toast);
    });
    
    setTimeout(() => {
        if (container.contains(toast)) {
            container.removeChild(toast);
        }
    }, 5000);
}

// Hiển thị modal xác nhận
function showConfirm(title, message, onConfirm) {
    let modal = document.getElementById('confirmModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'confirmModal';
        modal.className = 'confirm-modal';
        modal.innerHTML = `
            <div class="confirm-content">
                <h3 class="confirm-title"></h3>
                <p class="confirm-message"></p>
                <div class="confirm-buttons">
                    <button class="confirm-cancel">Hủy</button>
                    <button class="confirm-ok">Xác nhận</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Cập nhật nội dung
    modal.querySelector('.confirm-title').textContent = title;
    modal.querySelector('.confirm-message').textContent = message;
    
    // Hiển thị modal
    modal.style.display = 'flex';
    
    // Xử lý nút cancel
    const cancelBtn = modal.querySelector('.confirm-cancel');
    cancelBtn.onclick = function() {
        modal.style.display = 'none';
    };
    
    // Xử lý nút ok
    const okBtn = modal.querySelector('.confirm-ok');
    okBtn.onclick = function() {
        modal.style.display = 'none';
        if (typeof onConfirm === 'function') {
            onConfirm();
        }
    };
    
    // Đóng modal khi click bên ngoài
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Hiển thị loading
function showLoading(isLoading) {
    // Tạo hoặc cập nhật overlay loading nếu cần
    let loadingOverlay = document.getElementById('loadingOverlay');
    
    if (isLoading) {
        if (!loadingOverlay) {
            // Tạo overlay loading nếu chưa có
            loadingOverlay = document.createElement('div');
            loadingOverlay.id = 'loadingOverlay';
            
            const spinner = document.createElement('div');
            spinner.className = 'spinner';
            
            loadingOverlay.appendChild(spinner);
            document.body.appendChild(loadingOverlay);
        } else {
            loadingOverlay.style.display = 'flex';
        }
    } else if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}
