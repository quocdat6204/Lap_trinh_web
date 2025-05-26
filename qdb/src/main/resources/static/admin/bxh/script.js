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

    const bxhSelect = document.getElementById('bxh-select');
    fetchAndRenderBXH(bxhSelect.value);
    bxhSelect.addEventListener('change', function() {
        fetchAndRenderBXH(this.value);
    });
});

// Thêm code xử lý bảng xếp hạng và biểu đồ tròn
const apiMap = {
    courtType: '/api/statistics/court-type-ranking',
    court: '/api/statistics/court-ranking',
    racketType: '/api/statistics/racket-type-ranking',
    racket: '/api/statistics/racket-ranking',
    userBooking: '/api/statistics/user-booking-ranking',
    userSpending: '/api/statistics/user-spending-ranking'
};

const tableRenderers = {
    courtType: renderCourtTypeTable,
    court: renderCourtTable,
    racketType: renderRacketTypeTable,
    racket: renderRacketTable,
    userBooking: renderUserBookingTable,
    userSpending: renderUserSpendingTable
};

let pieChart = null;

function hideAllTables() {
    document.querySelectorAll('.bxh-table').forEach(div => div.style.display = 'none');
}

function showTable(id) {
    document.getElementById(id + '-table').style.display = '';
}

function updatePieChart(labels, data) {
    const ctx = document.getElementById('pieChart').getContext('2d');
    if (pieChart) pieChart.destroy();
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#4dc9f6','#f67019','#f53794','#537bc4','#acc236','#166a8f','#00a950','#58595b','#8549ba','#e6194b','#3cb44b','#ffe119','#4363d8','#f58231','#911eb4','#46f0f0','#f032e6','#bcf60c','#fabebe','#008080'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
}

function fetchAndRenderBXH(type) {
    fetch(apiMap[type], {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(res => {
        if (!res.ok) throw new Error('API error: ' + res.status);
        return res.json();
    })
    .then(data => {
        hideAllTables();
        tableRenderers[type](data);
        showTable(type);
        // Pie chart
        let labels = [], values = [];
        if (type === 'courtType') {
            labels = data.map(i => i.courtTypeName);
            values = data.map(i => i.percentage);
        } else if (type === 'court') {
            labels = data.map(i => i.courtName);
            values = data.map(i => i.percentage);
        } else if (type === 'racketType') {
            labels = data.map(i => i.racketTypeName);
            values = data.map(i => i.percentage);
        } else if (type === 'racket') {
            labels = data.map(i => i.racketName);
            values = data.map(i => i.percentage);
        } else if (type === 'userBooking' || type === 'userSpending') {
            labels = data.map(i => i.fullName);
            values = data.map(i => i.percentage);
        }
        updatePieChart(labels, values);
    })
    .catch(err => console.error('Fetch BXH error:', err));
}

// Render table functions
function renderCourtTypeTable(data) {
    let html = `<table class="bxh-table-main"><thead><tr><th>Hạng</th><th>Loại sân</th><th>Lượt đặt</th><th>%</th></tr></thead><tbody>`;
    data.forEach((row, idx) => {
        html += `<tr><td>${idx+1}</td><td>${row.courtTypeName}</td><td>${row.totalBookings}</td><td>${row.percentage}%</td></tr>`;
    });
    html += '</tbody></table>';
    document.getElementById('courtType-table').innerHTML = html;
}
function renderCourtTable(data) {
    let html = `<table class="bxh-table-main"><thead><tr><th>Hạng</th><th>Sân</th><th>Loại sân</th><th>Lượt đặt</th><th>%</th></tr></thead><tbody>`;
    data.forEach((row, idx) => {
        html += `<tr><td>${idx+1}</td><td>${row.courtName}</td><td>${row.courtTypeName}</td><td>${row.totalBookings}</td><td>${row.percentage}%</td></tr>`;
    });
    html += '</tbody></table>';
    document.getElementById('court-table').innerHTML = html;
}
function renderRacketTypeTable(data) {
    let html = `<table class="bxh-table-main"><thead><tr><th>Hạng</th><th>Loại vợt</th><th>Lượt thuê</th><th>%</th></tr></thead><tbody>`;
    data.forEach((row, idx) => {
        html += `<tr><td>${idx+1}</td><td>${row.racketTypeName}</td><td>${row.totalBookings}</td><td>${row.percentage}%</td></tr>`;
    });
    html += '</tbody></table>';
    document.getElementById('racketType-table').innerHTML = html;
}
function renderRacketTable(data) {
    let html = `<table class="bxh-table-main"><thead><tr><th>Hạng</th><th>Vợt</th><th>Loại vợt</th><th>Lượt thuê</th><th>%</th></tr></thead><tbody>`;
    data.forEach((row, idx) => {
        html += `<tr><td>${idx+1}</td><td>${row.racketName}</td><td>${row.racketTypeName}</td><td>${row.totalBookings}</td><td>${row.percentage}%</td></tr>`;
    });
    html += '</tbody></table>';
    document.getElementById('racket-table').innerHTML = html;
}
function renderUserBookingTable(data) {
    let html = `<table class="bxh-table-main"><thead><tr><th>Hạng</th><th>Họ tên</th><th>Tài khoản</th><th>Lượt đặt</th><th>%</th></tr></thead><tbody>`;
    data.forEach((row, idx) => {
        html += `<tr><td>${idx+1}</td><td>${row.fullName}</td><td>${row.username}</td><td>${row.totalBookings}</td><td>${row.percentage}%</td></tr>`;
    });
    html += '</tbody></table>';
    document.getElementById('userBooking-table').innerHTML = html;
}
function renderUserSpendingTable(data) {
    let html = `<table class="bxh-table-main"><thead><tr><th>Hạng</th><th>Họ tên</th><th>Tài khoản</th><th>Tổng tiền đã dùng</th><th>%</th></tr></thead><tbody>`;
    data.forEach((row, idx) => {
        html += `<tr><td>${idx+1}</td><td>${row.fullName}</td><td>${row.username}</td><td>${row.totalSpending}</td><td>${row.percentage}%</td></tr>`;
    });
    html += '</tbody></table>';
    document.getElementById('userSpending-table').innerHTML = html;
}

