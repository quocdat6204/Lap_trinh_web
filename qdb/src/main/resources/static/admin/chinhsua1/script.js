// // Biến cấu hình
// const API_BASE_URL = '/api';

// document.addEventListener('DOMContentLoaded', function() {
//     // Xử lý menu dropdown của avatar
//     const avatarButton = document.getElementById('avatarButton');
//     const dropdownMenu = document.getElementById('dropdownMenu');
    
//     if (avatarButton && dropdownMenu) {
//         // Hiển thị/ẩn dropdown khi click vào avatar
//         avatarButton.addEventListener('click', function(event) {
//             dropdownMenu.classList.toggle('show');
//             event.stopPropagation();
//         });
        
//         // Ẩn dropdown khi click bất kỳ đâu khác trên trang
//         document.addEventListener('click', function(event) {
//             if (!dropdownMenu.contains(event.target) && event.target !== avatarButton) {
//                 dropdownMenu.classList.remove('show');
//             }
//         });
//     }

//     // Modal loại vợt
//     const addRacketTypeBtn = document.getElementById('addRacketTypeBtn');
//     const racketTypeModal = document.getElementById('racketTypeModal');
//     const racketTypeForm = document.querySelector('.racket-type-form');
//     const cancelBtn = document.querySelector('.racket-type-modal-btn.cancel');
//     const racketTypeModalTitle = document.getElementById('racketTypeModalTitle');
//     const racketTypeModalSaveBtn = document.getElementById('racketTypeModalSaveBtn');

//     if (addRacketTypeBtn && racketTypeModal) {
//         addRacketTypeBtn.addEventListener('click', function() {
//             editingRacketTypeId = null;
//             racketTypeModalTitle.textContent = 'Thêm loại vợt mới';
//             racketTypeModalSaveBtn.textContent = 'Thêm';
//             racketTypeForm.reset();
//             racketTypeModal.style.display = 'block';
//         });

//         cancelBtn.addEventListener('click', function() {
//             racketTypeModal.style.display = 'none';
//             racketTypeForm.reset();
//             editingRacketTypeId = null;
//             racketTypeModalTitle.textContent = 'Thêm loại vợt mới';
//             racketTypeModalSaveBtn.textContent = 'Thêm';
//         });

//         racketTypeForm.addEventListener('submit', function(e) {
//             e.preventDefault();
//             const racketTypeName = document.getElementById('racketTypeName').value;
//             if (editingRacketTypeId) {
//                 updateRacketType(editingRacketTypeId, racketTypeName);
//             } else {
//                 createRacketType(racketTypeName);
//             }
//         });

//         // Đóng modal khi click bên ngoài
//         window.addEventListener('click', function(event) {
//             if (event.target === racketTypeModal) {
//                 racketTypeModal.style.display = 'none';
//                 racketTypeForm.reset();
//                 editingRacketTypeId = null;
//                 racketTypeModalTitle.textContent = 'Thêm loại vợt mới';
//                 racketTypeModalSaveBtn.textContent = 'Thêm';
//             }
//         });
//     }

//     // Khởi tạo trang quản lý vợt
//     loadRacketTypes();

//     // Xử lý chọn file ảnh
//     const racketImageInput = document.getElementById('racketImage');
//     if (racketImageInput) {
//         racketImageInput.addEventListener('change', function() {
//             const fileLabel = document.querySelector('.file-upload-label');
//             if (fileLabel) {
//                 fileLabel.textContent = this.files.length > 0 ? this.files[0].name : 'Chọn tệp';
//             }
//         });
//     }

//     // Xử lý sự kiện click vào nút lưu
//     const saveButton = document.getElementById('saveButton');
//     if (saveButton) {
//         saveButton.addEventListener('click', function() {
//             // Lấy giá trị từ form
//             const name = document.getElementById('racketName').value;
//             const brand = document.getElementById('racketBrand').value;
//             const price = document.getElementById('racketPrice').value;
    

//             // Kiểm tra dữ liệu
//             if (!validateRacketForm()) {
//                 return;
//             }

//             // Lấy courtId từ data attribute nếu đang cập nhật
//             const racketId = saveButton.dataset.racketId;
//             const imageFile = document.getElementById('racketImage').files[0];

//             if (racketId) {
//                 // Cập nhật vợt 
//                 updateRacket(racketId, name, brand, price, imageFile);
//             } else {
//                 // Tạo vợt mới
//                 const activeCategory = document.querySelector('.active-category');
//                 if (!activeCategory) {
//                     showError('Vui lòng chọn loại vợt');
//                     return;
//                 }
//                 const racketTypeId = activeCategory.dataset.categoryId;
//                 createRacket(name, brand, price, racketTypeId, imageFile);
//             }
//         });
//     }

//     // Xử lý thanh tìm kiếm
//     const searchBar = document.querySelector('.search-bar');
//     if (searchBar) {
//         searchBar.addEventListener('keypress', function(e) {
//             if (e.key === 'Enter') {
//                 const searchTerm = this.value.trim();
//                 if (searchTerm) {
//                     searchRackets(searchTerm);
//                 }
//             }
//         });
//     }

//     // Theo dõi trạng thái mạng
//     window.addEventListener('online', function() {
//         showToast('Kết nối đã được khôi phục', 'success');
//     });

//     window.addEventListener('offline', function() {
//         showToast('Mất kết nối mạng. Một số tính năng có thể không hoạt động.', 'error');
//     });
// });

// // ----- FUNCTIONS TO INTERACT WITH API -----

// // 1. RACKET TYPES MANAGEMENT

// // Hàm gọi API lấy danh sách loại 
// function loadRacketTypes() {
//     fetch(`${API_BASE_URL}/racket-types`)
//         .then(handleResponse)
//         .then(data => updateRacketTypesList(data))
//         .catch(error => showError('Không thể tải loại vợt: ' + error.message));
// }

// function updateRacketTypesList(racketTypes) {
//     const sidebar = document.querySelector('.racket-list-sidebar');
//     if (!sidebar) return;
//     sidebar.innerHTML = '';
//     if (racketTypes.length === 0) {
//         sidebar.innerHTML = '<div class="empty-message">Chưa có loại vợt nào</div>';
//         return;
//     }
//     racketTypes.forEach(racketType => {
//         const categoryDiv = document.createElement('div');
//         categoryDiv.className = 'racket-category';
//         categoryDiv.dataset.categoryId = racketType.id;
//         categoryDiv.dataset.categoryName = racketType.name;
//         categoryDiv.innerHTML = `
//             <div class="category-header">
//                 <span class="category-name">${racketType.name}</span>
//                 <div class="action-buttons">
//                     <button class="edit-category-btn" title="Sửa loại vợt"><i class="fas fa-edit"></i></button>
//                     <button class="add-btn" title="Thêm vợt mới">+</button>
//                     <button class="dropdown-btn" title="Hiển thị danh sách vợt">▼</button>
//                     <button class="delete-category-btn" title="Xóa loại vợt">×</button>
//                 </div>
//             </div>
//             <div class="sub-rackets" style="display: none;"></div>
//         `;
//         sidebar.appendChild(categoryDiv);
//         attachCategoryEvents(categoryDiv);
//     });
// }

// function createRacketType(name) {
//     fetch(`${API_BASE_URL}/racket-types`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name })
//     })
//     .then(handleResponse)
//     .then(() => {
//         showSuccess('Đã thêm loại vợt mới thành công');
//         document.getElementById('racketTypeModal').style.display = 'none';
//         document.querySelector('.racket-type-form').reset();
//         loadRacketTypes();
//     })
//     .catch(error => showError('Không thể thêm loại vợt: ' + error.message));
// }

// function updateRacketType(racketTypeId, name) {
//     fetch(`${API_BASE_URL}/racket-types/${racketTypeId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ name })
//     })
//     .then(handleResponse)
//     .then(() => {
//         showSuccess('Đã cập nhật loại vợt thành công');
//         document.getElementById('racketTypeModal').style.display = 'none';
//         document.querySelector('.racket-type-form').reset();
//         loadRacketTypes();
//     })
//     .catch(error => showError('Không thể cập nhật loại vợt: ' + error.message));
// }

// function deleteRacketType(racketTypeId) {
//     if (!confirm('Bạn có chắc chắn muốn xóa loại vợt này?')) return;
//     fetch(`${API_BASE_URL}/racket-types/${racketTypeId}`, { method: 'DELETE' })
//     .then(handleResponse)
//     .then(data => {
//         showSuccess('Đã xóa loại vợt thành công');
//         loadRacketTypes();
//     })
//     .catch(error => {
//         if (error.message.includes('còn vợt')) {
//             showError('Không thể xóa loại vợt vì vẫn còn vợt trong loại này');
//         } else {
//             showError('Không thể xóa loại vợt: ' + error.message);
//         }
//     });
// }

// function loadRacketsByType(racketTypeId, subRacketsContainer) {
//     fetch(`${API_BASE_URL}/rackets/type/${racketTypeId}`)
//         .then(handleResponse)
//         .then(data => updateRacketsList(data, subRacketsContainer))
//         .catch(error => showError('Không thể tải danh sách vợt: ' + error.message));
// }

// function updateRacketsList(rackets, container) {
//     container.innerHTML = '';
//     if (rackets.length === 0) {
//         container.innerHTML = '<div class="sub-court-empty">Chưa có vợt nào</div>';
//         return;
//     }
//     rackets.forEach(racket => {
//         const racketDiv = document.createElement('div');
//         racketDiv.className = 'sub-racket';
//         racketDiv.dataset.racketId = racket.id;
//         racketDiv.innerHTML = `
//             <button class="expand-btn">▶</button>
//             <span class="racket-name">${racket.name}</span>
//         `;
//         container.appendChild(racketDiv);
//         attachRacketEvents(racketDiv);
//     });
// }

// function loadRacketDetails(racketId) {
//     fetch(`${API_BASE_URL}/rackets/${racketId}`)
//         .then(handleResponse)
//         .then(racket => updateRacketForm(racket))
//         .catch(error => showError('Không thể tải thông tin vợt: ' + error.message));
// }

// function searchRackets(term) {
//     fetch(`${API_BASE_URL}/rackets/search?term=${encodeURIComponent(term)}`)
//         .then(handleResponse)
//         .then(data => showSearchResults(data, term))
//         .catch(error => showError('Không thể tìm kiếm vợt: ' + error.message));
// }

// function showSearchResults(results, term) {
//     const sidebar = document.querySelector('.racket-list-sidebar');
//     if (!sidebar) return;
//     sidebar.innerHTML = `<div class="search-results-title">Kết quả tìm kiếm cho "${term}"</div>`;
//     updateRacketsList(results, sidebar);
// }

// function updateRacketForm(racket) {
//     document.getElementById('racketName').value = racket.name || '';
//     document.getElementById('racketBrand').value = racket.brand || '';
//     document.getElementById('racketPrice').value = racket.price || '';
//     document.getElementById('racketImage').value = '';
//     const saveButton = document.getElementById('saveButton');
//     saveButton.dataset.racketId = racket.id;
// }

// function validateRacketForm() {
//     const name = document.getElementById('racketName').value.trim();
//     const brand = document.getElementById('racketBrand').value.trim();
//     const price = document.getElementById('racketPrice').value.trim();
//     if (!name || !brand || !price) {
//         showError('Vui lòng nhập đầy đủ thông tin vợt');
//         return false;
//     }
//     if (isNaN(price) || Number(price) <= 0) {
//         showError('Giá thuê phải là số dương');
//         return false;
//     }
//     return true;
// }

// function createRacket(name, brand, price, racketTypeId, imageFile) {
//     const doCreate = (imageUrl) => {
//         fetch(`${API_BASE_URL}/rackets`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ name, brand, price, imageUrl, racketTypeId })
//         })
//         .then(handleResponse)
//         .then(() => {
//             showSuccess('Đã thêm vợt mới thành công');
//             loadRacketTypes();
//         })
//         .catch(error => showError('Không thể thêm vợt: ' + error.message));
//     };
//     if (imageFile) {
//         uploadImageOnly(imageFile).then(doCreate).catch(() => showError('Lỗi upload ảnh'));
//     } else {
//         doCreate('');
//     }
// }

// function updateRacket(racketId, name, brand, price, imageFile) {
//     const doUpdate = (imageUrl) => {
//         fetch(`${API_BASE_URL}/rackets/${racketId}`, {
//             method: 'PUT',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ name, brand, price, imageUrl })
//         })
//         .then(handleResponse)
//         .then(() => {
//             showSuccess('Đã cập nhật vợt thành công');
//             loadRacketTypes();
//         })
//         .catch(error => showError('Không thể cập nhật vợt: ' + error.message));
//     };
//     if (imageFile) {
//         uploadImageOnly(imageFile).then(doUpdate).catch(() => showError('Lỗi upload ảnh'));
//     } else {
//         doUpdate('');
//     }
// }

// function deleteRacket(racketId, racketTypeId) {
//     if (!confirm('Bạn có chắc chắn muốn xóa vợt này?')) return;
//     fetch(`${API_BASE_URL}/rackets/${racketId}`, { method: 'DELETE' })
//     .then(handleResponse)
//     .then(data => {
//         showSuccess('Đã xóa vợt thành công');
//         loadRacketsByType(racketTypeId, document.querySelector(`.racket-category[data-category-id='${racketTypeId}'] .sub-rackets`));
//     })
//     .catch(error => showError('Không thể xóa vợt: ' + error.message));
// }

// function uploadImageOnly(imageFile) {
//     // Giả lập upload ảnh, trả về promise resolve url rỗng hoặc base64 nếu backend hỗ trợ
//     return new Promise((resolve) => {
//         resolve('');
//     });
// }

// function attachCategoryEvents(categoryDiv) {
//     const header = categoryDiv.querySelector('.category-header');
//     const addBtn = categoryDiv.querySelector('.add-btn');
//     const dropdownBtn = categoryDiv.querySelector('.dropdown-btn');
//     const editBtn = categoryDiv.querySelector('.edit-category-btn');
//     const deleteBtn = categoryDiv.querySelector('.delete-category-btn');
//     const subRackets = categoryDiv.querySelector('.sub-rackets');
//     header.addEventListener('click', function() {
//         document.querySelectorAll('.racket-category').forEach(c => c.classList.remove('active-category'));
//         categoryDiv.classList.add('active-category');
//         loadRacketsByType(categoryDiv.dataset.categoryId, subRackets);
//         subRackets.style.display = 'block';
//     });
//     addBtn.addEventListener('click', function(e) {
//         e.stopPropagation();
//         document.getElementById('racketForm').reset();
//         document.getElementById('saveButton').dataset.racketId = '';
//     });
//     dropdownBtn.addEventListener('click', function(e) {
//         e.stopPropagation();
//         if (subRackets.style.display === 'block') {
//             subRackets.style.display = 'none';
//         } else {
//             loadRacketsByType(categoryDiv.dataset.categoryId, subRackets);
//             subRackets.style.display = 'block';
//         }
//     });
//     editBtn.addEventListener('click', function(e) {
//         e.stopPropagation();
//         editingRacketTypeId = categoryDiv.dataset.categoryId;
//         racketTypeModalTitle.textContent = 'Sửa loại vợt';
//         racketTypeModalSaveBtn.textContent = 'Lưu';
//         document.getElementById('racketTypeName').value = categoryDiv.dataset.categoryName;
//         racketTypeModal.style.display = 'block';
//     });
//     deleteBtn.addEventListener('click', function(e) {
//         e.stopPropagation();
//         deleteRacketType(categoryDiv.dataset.categoryId);
//     });
// }

// function attachRacketEvents(racketDiv) {
//     const nameSpan = racketDiv.querySelector('.racket-name');
//     nameSpan.addEventListener('click', function() {
//         loadRacketDetails(racketDiv.dataset.racketId);
//     });
//     const expandBtn = racketDiv.querySelector('.expand-btn');
//     expandBtn.addEventListener('click', function(e) {
//         e.stopPropagation();
//         loadRacketDetails(racketDiv.dataset.racketId);
//     });
//     // Có thể thêm nút xóa/sửa vợt ở đây nếu muốn
// }

// function handleResponse(response) {
//     if (!response.ok) {
//         // Xử lý lỗi dựa trên status code
//         if (response.status === 404) {
//             throw new Error('Không tìm thấy tài nguyên');
//         } else if (response.status === 403) {
//             throw new Error('Bạn không có quyền thực hiện thao tác này');
//         } else if (response.status === 400) {
//             return response.json().then(err => { throw new Error(err.error || 'Dữ liệu không hợp lệ'); });
//         } else {
//             return response.json().then(err => { throw new Error(err.error || 'Lỗi không xác định'); });
//         }
//     }
    
//     // Phản hồi 204 No Content, trả về null
//     if (response.status === 204) {
//         return null;
//     }
    
//     // Phản hồi thành công có dữ liệu
//     return response.json();
// }

// function showSuccess(message) {
//     alert(message);
// }
// function showError(message) {
//     alert(message);

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
    
    // Xử lý modal thêm loại vợt
    const addRacketTypeBtn = document.getElementById('addRacketTypeBtn');
    const racketTypeModal = document.getElementById('racketTypeModal');
    const racketTypeForm = document.querySelector('.racket-type-form');
    const cancelBtn = document.querySelector('.racket-type-modal-btn.cancel');
    const racketTypeModalTitle = document.getElementById('racketTypeModalTitle');
    const racketTypeModalSaveBtn = document.getElementById('racketTypeModalSaveBtn');
    
    if (addRacketTypeBtn && racketTypeModal) {
        addRacketTypeBtn.addEventListener('click', function() {
            editingRacketTypeId = null;
            racketTypeModalTitle.textContent = 'Thêm loại vợt mới';
            racketTypeModalSaveBtn.textContent = 'Thêm';
            racketTypeForm.reset();
            racketTypeModal.style.display = 'block';
        });
        
        cancelBtn.addEventListener('click', function() {
            racketTypeModal.style.display = 'none';
            racketTypeForm.reset();
            editingRacketTypeId = null;
            racketTypeModalTitle.textContent = 'Thêm loại vợt mới';
            racketTypeModalSaveBtn.textContent = 'Thêm';
        });
        
        racketTypeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const racketTypeName = document.getElementById('racketTypeName').value;
            if (editingRacketTypeId) {
                updateRacketType(editingRacketTypeId, racketTypeName);
            } else {
                createRacketType(racketTypeName);
            }
        });
        
        // Đóng modal khi click bên ngoài
        window.addEventListener('click', function(event) {
            if (event.target === racketTypeModal) {
                racketTypeModal.style.display = 'none';
                racketTypeForm.reset();
                editingRacketTypeId = null;
                racketTypeModalTitle.textContent = 'Thêm loại vợt mới';
                racketTypeModalSaveBtn.textContent = 'Thêm';
            }
        });
    }
    
    // Khởi tạo trang quản lý vợt
    loadRacketTypes();
    
    // Xử lý sự kiện click chọn file hình ảnh
    const racketImageInput = document.getElementById('racketImage');
    if (racketImageInput) {
        racketImageInput.addEventListener('change', function() {
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
            const name = document.getElementById('racketName').value;
            const brand = document.getElementById('racketBrand').value;
            const price = document.getElementById('racketPrice').value;
            
            // Kiểm tra dữ liệu
            if (!validateRacketForm()) {
                return;
            }
            
            // Lấy racketId từ data attribute nếu đang cập nhật
            const racketId = saveButton.dataset.racketId;
            const imageFile = document.getElementById('racketImage').files[0];
            
            if (racketId) {
                // Cập nhật vợt
                updateRacket(racketId, name, brand, price, imageFile);
            } else {
                // Tạo vợt mới
                const activeCategory = document.querySelector('.active-category');
                if (!activeCategory) {
                    showError('Vui lòng chọn loại vợt');
                    return;
                }
                const racketTypeId = activeCategory.dataset.categoryId;
                createRacket(name, brand, price, racketTypeId, imageFile);
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
                    searchRackets(searchTerm);
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

// 1. RACKET TYPES MANAGEMENT

// Hàm gọi API lấy danh sách loại vợt
function loadRacketTypes() {
    showLoading(true);
    fetch(`${API_BASE_URL}/racket-types`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(handleResponse)
    .then(data => {
        // Cập nhật UI với danh sách loại vợt
        updateRacketTypesList(data);
        showLoading(false);
    })
    .catch(error => {
        console.error('Error loading racket types:', error);
        showError('Không thể tải danh sách loại vợt: ' + error.message);
        showLoading(false);
    });
}

// Hàm cập nhật UI danh sách loại vợt
function updateRacketTypesList(racketTypes) {
    const sidebar = document.querySelector('.racket-list-sidebar');
    if (!sidebar) return;
    
    sidebar.innerHTML = ''; // Xóa nội dung hiện tại
    
    if (racketTypes.length === 0) {
        sidebar.innerHTML = '<div class="empty-message">Chưa có loại vợt nào</div>';
        return;
    }
    
    racketTypes.forEach(racketType => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'racket-category';
        categoryDiv.dataset.categoryId = racketType.id;
        categoryDiv.dataset.categoryName = racketType.name;
        
        categoryDiv.innerHTML = `
            <div class="category-header">
                <span class="category-name">${racketType.name}</span>
                <div class="action-buttons">
                    <button class="edit-category-btn" title="Sửa loại vợt"><i class="fas fa-edit"></i></button>
                    <button class="add-btn" title="Thêm vợt mới">+</button>
                    <button class="dropdown-btn" title="Hiển thị danh sách vợt">▼</button>
                    <button class="delete-category-btn" title="Xóa loại vợt">×</button>
                </div>
            </div>
            <div class="sub-rackets" style="display: none;"></div>
        `;
        
        sidebar.appendChild(categoryDiv);
        
        // Gắn sự kiện cho các nút
        attachCategoryEvents(categoryDiv);
    });
}

// Hàm tạo loại vợt mới
function createRacketType(name) {
    showLoading(true);
    fetch(`${API_BASE_URL}/racket-types`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ name: name })
    })
    .then(handleResponse)
    .then(data => {
        showSuccess('Đã thêm loại vợt mới thành công');
        document.getElementById('racketTypeModal').style.display = 'none';
        document.querySelector('.racket-type-form').reset();
        loadRacketTypes(); // Tải lại danh sách loại vợt
    })
    .catch(error => {
        console.error('Error creating racket type:', error);
        showError('Không thể thêm loại vợt: ' + error.message);
    })
    .finally(() => {
        showLoading(false);
    });
}

// Hàm xóa loại vợt
function deleteRacketType(racketTypeId) {
    showConfirm(
        'Xóa loại vợt',
        'Bạn có chắc chắn muốn xóa loại vợt này?',
        function() {
            showLoading(true);
            fetch(`${API_BASE_URL}/racket-types/${racketTypeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            })
            .then(handleResponse)
            .then(() => {
                showSuccess('Đã xóa loại vợt thành công');
                loadRacketTypes(); // Tải lại danh sách loại vợt
            })
            .catch(error => {
                console.error('Error deleting racket type:', error);
                if (error.message.includes('còn vợt')) {
                    showError('Không thể xóa loại vợt vì vẫn còn vợt trong loại này');
                } else {
                    showError('Không thể xóa loại vợt: ' + error.message);
                }
            })
            .finally(() => {
                showLoading(false);
            });
        }
    );
}

// Hàm sửa loại vợt
function updateRacketType(racketTypeId, name) {
    showLoading(true);
    fetch(`${API_BASE_URL}/racket-types/${racketTypeId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify({ name: name })
    })
    .then(handleResponse)
    .then(data => {
        showSuccess('Đã cập nhật loại vợt thành công');
        racketTypeModal.style.display = 'none';
        document.querySelector('.racket-type-form').reset();
        editingRacketTypeId = null;
        racketTypeModalTitle.textContent = 'Thêm loại vợt mới';
        racketTypeModalSaveBtn.textContent = 'Thêm';
        loadRacketTypes(); // Tải lại danh sách loại vợt
    })
    .catch(error => {
        console.error('Error updating racket type:', error);
        showError('Không thể cập nhật loại vợt: ' + error.message);
    })
    .finally(() => {
        showLoading(false);
    });
}

// 2. RACKETS MANAGEMENT

// Hàm gọi API lấy danh sách vợt theo loại
function loadRacketsByType(racketTypeId, subRacketsContainer) {
    if (!subRacketsContainer) return;
    
    showLoading(true);
    fetch(`${API_BASE_URL}/rackets/type/${racketTypeId}`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(handleResponse)
    .then(data => {
        // Cập nhật UI với danh sách vợt
        updateRacketsList(data, subRacketsContainer);
        showLoading(false);
    })
    .catch(error => {
        console.error('Error loading rackets:', error);
        showError('Không thể tải danh sách vợt: ' + error.message);
        showLoading(false);
    });
}

// Hàm cập nhật UI danh sách vợt
function updateRacketsList(rackets, container) {
    if (!container) return;
    
    container.innerHTML = ''; // Xóa nội dung hiện tại
    
    if (rackets.length === 0) {
        container.innerHTML = '<div class="sub-racket-empty">Chưa có vợt nào trong danh mục này</div>';
        return;
    }
    
    rackets.forEach(racket => {
        const racketDiv = document.createElement('div');
        racketDiv.className = 'sub-racket';
        racketDiv.dataset.racket = racket.id;
        
        racketDiv.innerHTML = `
            <button class="expand-btn">▶</button>
            <span class="racket-name">${racket.name}</span>
            <div class="racket-actions">
                <button class="edit-btn" title="Chỉnh sửa"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" title="Xóa"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        container.appendChild(racketDiv);
        
        // Gắn sự kiện cho vợt
        attachRacketEvents(racketDiv);
    });
}

// Hàm gọi API lấy thông tin chi tiết vợt
function loadRacketDetails(racketId) {
    showLoading(true);
    fetch(`${API_BASE_URL}/rackets/${racketId}`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(handleResponse)
    .then(data => {
        // Cập nhật UI với thông tin vợt
        updateRacketForm(data);
        showLoading(false);
    })
    .catch(error => {
        console.error('Error loading racket details:', error);
        showError('Không thể tải thông tin vợt: ' + error.message);
        showLoading(false);
    });
}

// Hàm tìm kiếm vợt
function searchRackets(term) {
    showLoading(true);
    fetch(`${API_BASE_URL}/rackets/search?term=${encodeURIComponent(term)}`, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(handleResponse)
    .then(data => {
        // Hiển thị kết quả tìm kiếm
        showLoading(false);
        
        if (data.length === 0) {
            showToast('Không tìm thấy vợt nào phù hợp', 'info');
        } else {
            // Hiển thị kết quả tìm kiếm
            showSearchResults(data, term);
        }
    })
    .catch(error => {
        console.error('Error searching rackets:', error);
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
    
    results.forEach(racket => {
        const racketItem = document.createElement('div');
        racketItem.className = 'search-result-item';
        racketItem.innerHTML = `
            <h4>${racket.name}</h4>
            <p>Thương hiệu: ${racket.brand || 'Chưa có thông tin'}</p>
            <p>Giá: ${racket.price || 'Chưa có thông tin'}</p>
            <button class="view-racket-btn" data-racket-id="${racket.id}">Xem chi tiết</button>
        `;
        resultsList.appendChild(racketItem);
        
        // Xử lý nút xem chi tiết
        const viewBtn = racketItem.querySelector('.view-racket-btn');
        viewBtn.addEventListener('click', function() {
            loadRacketDetails(this.dataset.racketId);
            modal.style.display = 'none';
        });
    });
    
    // Hiển thị modal
    modal.style.display = 'block';
}

// Hàm cập nhật form thông tin vợt
function updateRacketForm(racket) {
    document.getElementById('racketName').value = racket.name || '';
    document.getElementById('racketBrand').value = racket.brand || '';
    document.getElementById('racketPrice').value = racket.price || '';
    
    // Reset file input
    const fileInput = document.getElementById('racketImage');
    if (fileInput) {
        fileInput.value = '';
        const fileLabel = document.querySelector('.file-upload-label');
        if (fileLabel) {
            fileLabel.textContent = 'Chọn tệp';
        }
    }
    
    // Lưu racketId vào data attribute của nút lưu
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
        saveButton.dataset.racketId = racket.id;
    }
    
    // Cập nhật tiêu đề
    const detailsTitle = document.querySelector('.details-title');
    if (detailsTitle) {
        detailsTitle.textContent = `Thông tin vợt: ${racket.name}`;
    }
    
    // Hiển thị hình ảnh nếu có
    if (racket.imageUrl) {
        // Tạo hoặc cập nhật preview hình ảnh
        let imagePreview = document.getElementById('racketImagePreview');
        if (!imagePreview) {
            imagePreview = document.createElement('div');
            imagePreview.id = 'racketImagePreview';
            imagePreview.className = 'image-preview';
            
            const fileUploadWrapper = document.querySelector('.file-upload-wrapper');
            if (fileUploadWrapper) {
                fileUploadWrapper.appendChild(imagePreview);
            }
        }
        
        imagePreview.innerHTML = `<img src="${racket.imageUrl}?t=${Date.now()}" alt="${racket.name}">`;
        imagePreview.style.display = 'block';
    } else {
        const imagePreview = document.getElementById('racketImagePreview');
        if (imagePreview) {
            imagePreview.style.display = 'none';
        }
    }
}

// Hàm kiểm tra form thông tin vợt
function validateRacketForm() {
    const name = document.getElementById('racketName').value.trim();
    const brand = document.getElementById('racketBrand').value.trim();
    const price = document.getElementById('racketPrice').value.trim();
    
    if (!name) {
        showError('Vui lòng nhập tên vợt');
        return false;
    }
    
    if (!brand) {
        showError('Vui lòng nhập thương hiệu vợt');
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

// Hàm gọi API tạo vợt mới
function createRacket(name, brand, price, racketTypeId, imageFile) {
    showLoading(true);
    const doCreate = (imageUrl) => {
        const racketData = {
            name: name,
            brand: brand,
            price: price,
            racketTypeId: racketTypeId,
            imageUrl: imageUrl || ''
        };
        console.log('Tạo vợt với racketData:', racketData);
        fetch(`${API_BASE_URL}/rackets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(racketData)
        })
        .then(handleResponse)
        .then(data => {
            showSuccess('Đã lưu thông tin vợt thành công');
            // Làm mới danh sách vợt
            const category = document.querySelector(`.racket-category[data-category-id="${racketTypeId}"]`);
            if (category) {
                const subRackets = category.querySelector('.sub-rackets');
                loadRacketsByType(racketTypeId, subRackets);
            }
            // Reset form
            document.getElementById('racketForm').reset();
            document.getElementById('saveButton').removeAttribute('data-racket-id');
            
            // Reset image preview
            const imagePreview = document.getElementById('racketImagePreview');
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
            console.error('Error creating racket:', error);
            showError('Lỗi khi tạo vợt: ' + error.message);
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

// Hàm gọi API cập nhật vợt
function updateRacket(racketId, name, brand, price, imageFile) {
    showLoading(true);
    const doUpdate = (imageUrl) => {
        const racketData = {
            name: name,
            brand: brand,
            price: price
        };
        if (imageUrl !== undefined) racketData.imageUrl = imageUrl;
        console.log('Cập nhật vợt với racketData:', racketData);
        fetch(`${API_BASE_URL}/rackets/${racketId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(racketData)
        })
        .then(handleResponse)
        .then(finalData => {
            showSuccess('Đã cập nhật thông tin vợt thành công');
            // Cập nhật tên vợt trong danh sách
            const racketNameElement = document.querySelector(`.sub-racket[data-racket="${racketId}"] .racket-name`);
            if (racketNameElement) {
                racketNameElement.textContent = name;
            }
            // Cập nhật lại preview ảnh nếu có imageUrl mới
            if (finalData && finalData.imageUrl) {
                let imagePreview = document.getElementById('racketImagePreview');
                if (!imagePreview) {
                    imagePreview = document.createElement('div');
                    imagePreview.id = 'racketImagePreview';
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
            console.error('Error updating racket:', error);
            showError('Lỗi khi cập nhật vợt: ' + error.message);
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

// Hàm gọi API xóa vợt
function deleteRacket(racketId, racketTypeId) {
    showConfirm('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa vợt này không?', function() {
        showLoading(true);
        fetch(`${API_BASE_URL}/rackets/${racketId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(handleResponse)
        .then(data => {
            showSuccess('Đã xóa vợt thành công');
            // Làm mới danh sách vợt
            const category = document.querySelector(`.racket-category[data-category-id="${racketTypeId}"]`);
            if (category) {
                const subRackets = category.querySelector('.sub-rackets');
                loadRacketsByType(racketTypeId, subRackets);
            }
            // Reset form
            document.getElementById('racketForm').reset();
            document.getElementById('saveButton').removeAttribute('data-racket-id');
            
            // Cập nhật tiêu đề
            const detailsTitle = document.querySelector('.details-title');
            if (detailsTitle) {
                detailsTitle.textContent = 'Thông tin';
            }
            
            // Reset image preview
            const imagePreview = document.getElementById('racketImagePreview');
            if (imagePreview) {
                imagePreview.style.display = 'none';
            }
            
            showLoading(false);
        })
        .catch(error => {
            console.error('Error deleting racket:', error);
            showError('Lỗi khi xóa vợt: ' + error.message);
            showLoading(false);
        });
    });
}

// ----- UI FUNCTIONS -----

// Hàm gắn sự kiện cho các danh mục loại vợt
function attachCategoryEvents(categoryDiv) {
    const categoryHeader = categoryDiv.querySelector('.category-header');
    const subRackets = categoryDiv.querySelector('.sub-rackets');
    const dropdownBtn = categoryDiv.querySelector('.dropdown-btn');
    const addBtn = categoryDiv.querySelector('.add-btn');
    const deleteBtn = categoryDiv.querySelector('.delete-category-btn');
    const editBtn = categoryDiv.querySelector('.edit-category-btn');
    const categoryId = categoryDiv.dataset.categoryId;
    const categoryName = categoryDiv.dataset.categoryName;
    
    // Xử lý nút sửa loại vợt
    if (editBtn) {
        editBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            editingRacketTypeId = categoryId;
            document.getElementById('racketTypeName').value = categoryName;
            racketTypeModalTitle.textContent = 'Sửa loại vợt';
            racketTypeModalSaveBtn.textContent = 'Lưu';
            racketTypeModal.style.display = 'block';
        });
    }
    
    // Xử lý nút xóa loại vợt
    deleteBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        deleteRacketType(categoryId);
    });
    
    if (dropdownBtn && subRackets && categoryId) {
        dropdownBtn.addEventListener('click', function() {
            this.textContent = this.textContent === '▼' ? '▲' : '▼';
            
            if (subRackets.style.display === 'none' || !subRackets.style.display) {
                subRackets.style.display = 'block';
                
                // Load danh sách vợt
                loadRacketsByType(categoryId, subRackets);
            } else {
                subRackets.style.display = 'none';
            }
        });
    }
    
    // Gắn sự kiện cho nút thêm vợt
    if (addBtn) {
        addBtn.addEventListener('click', function() {
            // Đặt category này là active
            document.querySelectorAll('.racket-category').forEach(cat => {
                cat.classList.remove('active-category');
            });
            categoryDiv.classList.add('active-category');
            
            // Reset form
            document.getElementById('racketForm').reset();
            const saveButton = document.getElementById('saveButton');
            if (saveButton) {
                saveButton.removeAttribute('data-racket-id');
            }

            // Reset image preview
            const imagePreview = document.getElementById('racketImagePreview');
            if (imagePreview) {
                imagePreview.style.display = 'none';
            }
            
            // Cập nhật tiêu đề
            const detailsTitle = document.querySelector('.details-title');
            if (detailsTitle) {
                detailsTitle.textContent = `Thêm vợt mới - ${categoryDiv.dataset.categoryName}`;
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

// Hàm gắn sự kiện cho các vợt
function attachRacketEvents(racketDiv) {
    if (!racketDiv) return;
    
    const racketId = racketDiv.dataset.racket;
    const racketTypeId = racketDiv.closest('.racket-category')?.dataset.categoryId;
    
    // Gắn sự kiện cho nút mở rộng
    const expandBtn = racketDiv.querySelector('.expand-btn');
    if (expandBtn) {
        expandBtn.addEventListener('click', function() {
            this.textContent = this.textContent === '▶' ? '▼' : '▶';
            
            // Load thông tin chi tiết vợt
            loadRacketDetails(racketId);
            
            // Đánh dấu vợt đang được chọn
            document.querySelectorAll('.sub-racket').forEach(racket => {
                racket.classList.remove('selected');
            });
            racketDiv.classList.add('selected');
        });
    }
    
    // Gắn sự kiện cho tên vợt
    const racketName = racketDiv.querySelector('.racket-name');
    if (racketName) {
        racketName.addEventListener('click', function() {
            // Load thông tin chi tiết vợt
            loadRacketDetails(racketId);
            
            // Đánh dấu vợt đang được chọn
            document.querySelectorAll('.sub-racket').forEach(racket => {
                racket.classList.remove('selected');
            });
            racketDiv.classList.add('selected');
            
            // Thay đổi icon nút mở rộng
            if (expandBtn) {
                expandBtn.textContent = '▼';
            }
        });
    }
    
    // Gắn sự kiện cho nút chỉnh sửa
    const editBtn = racketDiv.querySelector('.edit-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            loadRacketDetails(racketId);
            
            // Đánh dấu vợt đang được chọn
            document.querySelectorAll('.sub-racket').forEach(racket => {
                racket.classList.remove('selected');
            });
            racketDiv.classList.add('selected');
            
            // Thay đổi icon nút mở rộng
            if (expandBtn) {
                expandBtn.textContent = '▼';
            }
        });
    }
    
    // Gắn sự kiện cho nút xóa
    const deleteBtn = racketDiv.querySelector('.delete-btn');
    if (deleteBtn && racketTypeId) {
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            deleteRacket(racketId, racketTypeId);
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
            