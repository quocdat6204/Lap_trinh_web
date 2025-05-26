// Search functionality for courts and rackets
document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.querySelector('.search-bar');
    if (!searchBar) return;

    let searchTimeout;
    const searchDelay = 300; // Delay in milliseconds

    searchBar.addEventListener('input', function(e) {
        clearTimeout(searchTimeout);
        const searchTerm = e.target.value.trim();

        // Hide results if input is empty
        if (searchTerm.length === 0) {
            const existingResults = document.getElementById('search-results');
            if (existingResults) existingResults.remove();
            return;
        }

        if (searchTerm.length < 2) return; // Don't search if term is too short

        searchTimeout = setTimeout(() => {
            const isCourtPage = window.location.pathname.includes('santap');
            const isRacketPage = window.location.pathname.includes('vot');
            
            if (isCourtPage) {
                searchCourts(searchTerm);
            } else if (isRacketPage) {
                searchRackets(searchTerm);
            } else {
                // Trang chủ: Gọi song song cả 2 API và gộp kết quả
                Promise.all([
                    fetch(`/api/courts/search?term=${encodeURIComponent(searchTerm)}`, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    }).then(res => res.json()),
                    fetch(`/api/rackets/search?term=${encodeURIComponent(searchTerm)}`, {
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token')
                        }
                    }).then(res => res.json())
                ]).then(([courts, rackets]) => {
                    displayCombinedResults(courts, rackets);
                }).catch(() => {
                    showNoResults();
                });
            }
        }, searchDelay);
    });
});

async function searchCourts(term) {
    try {
        const response = await fetch(`/api/courts/search?term=${encodeURIComponent(term)}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        if (!response.ok) throw new Error('Search failed');
        
        const courts = await response.json();
        displaySearchResults(courts, 'court');
    } catch (error) {
        console.error('Error searching courts:', error);
    }
}

async function searchRackets(term) {
    try {
        const response = await fetch(`/api/rackets/search?term=${encodeURIComponent(term)}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        if (!response.ok) throw new Error('Search failed');
        
        const rackets = await response.json();
        displaySearchResults(rackets, 'racket');
    } catch (error) {
        console.error('Error searching rackets:', error);
    }
}

function formatCourtPrice(price) {
    if (typeof price === 'string' && price.toLowerCase().includes('k')) {
        const num = parseInt(price) * 1000;
        return num.toLocaleString() + 'đ/h';
    }
    if (!isNaN(price)) {
        return Number(price).toLocaleString() + 'đ/h';
    }
    if (typeof price === 'string' && price.includes('đ')) {
        const num = parseInt(price.replace(/[^0-9]/g, ''));
        return num.toLocaleString() + 'đ/h';
    }
    return price + 'đ/h';
}

function displaySearchResults(results, type) {
    // Remove existing search results if any
    const existingResults = document.getElementById('search-results');
    if (existingResults) {
        existingResults.remove();
    }

    if (results.length === 0) {
        showNoResults();
        return;
    }

    // Create results container
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'search-results';
    resultsContainer.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        max-height: 400px;
        overflow-y: auto;
        z-index: 1000;
    `;

    // Add results
    results.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.style.cssText = `
            padding: 10px;
            border-bottom: 1px solid #eee;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        // Add image if available
        if (item.imageUrl) {
            const img = document.createElement('img');
            img.src = item.imageUrl;
            img.style.cssText = `
                width: 50px;
                height: 50px;
                object-fit: cover;
                border-radius: 4px;
            `;
            resultItem.appendChild(img);
        }

        // Add content
        const content = document.createElement('div');
        content.innerHTML = `
            <div style="font-weight: bold;">${item.name}</div>
            ${type === 'court' ? 
                `<div style="color: #666; font-size: 0.9em;">${item.address}</div>` :
                `<div style="color: #666; font-size: 0.9em;">${item.brand}</div>`
            }
            <div style="color: #d9534f; font-weight: bold;">
                ${type === 'court' ? formatCourtPrice(item.price) : item.price.toLocaleString() + 'đ/h'}
            </div>
        `;
        resultItem.appendChild(content);

        // Add click handler
        resultItem.addEventListener('click', () => {
            window.location.href = `../thanhtoan/index.html?id=${item.id}&type=${type === 'court' ? 'COURT' : 'RACKET'}`;
        });

        resultsContainer.appendChild(resultItem);
    });

    // Add to DOM
    const searchContainer = document.querySelector('.search-login');
    searchContainer.style.position = 'relative';
    searchContainer.appendChild(resultsContainer);

    // Close results when clicking outside
    document.addEventListener('click', function closeResults(e) {
        if (!searchContainer.contains(e.target)) {
            resultsContainer.remove();
            document.removeEventListener('click', closeResults);
        }
    });
}

function showNoResults() {
    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'search-results';
    resultsContainer.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        padding: 10px;
        text-align: center;
        color: #666;
    `;
    resultsContainer.textContent = 'Không tìm thấy kết quả';

    const searchContainer = document.querySelector('.search-login');
    searchContainer.style.position = 'relative';
    searchContainer.appendChild(resultsContainer);

    // Remove after 2 seconds
    setTimeout(() => {
        resultsContainer.remove();
    }, 2000);
}

function displayCombinedResults(courts, rackets) {
    // Remove existing search results if any
    const existingResults = document.getElementById('search-results');
    if (existingResults) existingResults.remove();

    if ((!courts || courts.length === 0) && (!rackets || rackets.length === 0)) {
        showNoResults();
        return;
    }

    const resultsContainer = document.createElement('div');
    resultsContainer.id = 'search-results';
    resultsContainer.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        max-height: 400px;
        overflow-y: auto;
        z-index: 1000;
    `;

    // Nhóm sân
    if (courts && courts.length > 0) {
        const courtHeader = document.createElement('div');
        courtHeader.textContent = 'Sân cầu lông';
        courtHeader.style.cssText = 'font-weight:bold;padding:8px 10px 4px 10px;color:#2b2b2b;background:#f5f5f5;border-bottom:1px solid #eee;';
        resultsContainer.appendChild(courtHeader);
        courts.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.style.cssText = `
                padding: 10px;
                border-bottom: 1px solid #eee;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
            `;
            if (item.imageUrl) {
                const img = document.createElement('img');
                img.src = item.imageUrl;
                img.style.cssText = `width: 50px; height: 50px; object-fit: cover; border-radius: 4px;`;
                resultItem.appendChild(img);
            }
            const content = document.createElement('div');
            content.innerHTML = `
                <div style=\"font-weight: bold;\">${item.name}</div>
                <div style=\"color: #666; font-size: 0.9em;\">${item.address}</div>
                <div style=\"color: #d9534f; font-weight: bold;\">${formatCourtPrice(item.price)}</div>
            `;
            resultItem.appendChild(content);
            resultItem.addEventListener('click', () => {
                window.location.href = `../thanhtoan/index.html?id=${item.id}&type=COURT`;
            });
            resultsContainer.appendChild(resultItem);
        });
    }
    // Nhóm vợt
    if (rackets && rackets.length > 0) {
        const racketHeader = document.createElement('div');
        racketHeader.textContent = 'Vợt cầu lông';
        racketHeader.style.cssText = 'font-weight:bold;padding:8px 10px 4px 10px;color:#2b2b2b;background:#f5f5f5;border-bottom:1px solid #eee;';
        resultsContainer.appendChild(racketHeader);
        rackets.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.style.cssText = `
                padding: 10px;
                border-bottom: 1px solid #eee;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 10px;
            `;
            if (item.imageUrl) {
                const img = document.createElement('img');
                img.src = item.imageUrl;
                img.style.cssText = `width: 50px; height: 50px; object-fit: cover; border-radius: 4px;`;
                resultItem.appendChild(img);
            }
            const content = document.createElement('div');
            content.innerHTML = `
                <div style=\"font-weight: bold;\">${item.name}</div>
                <div style=\"color: #666; font-size: 0.9em;\">${item.brand}</div>
                <div style=\"color: #d9534f; font-weight: bold;\">${item.price.toLocaleString()}đ/h</div>
            `;
            resultItem.appendChild(content);
            resultItem.addEventListener('click', () => {
                window.location.href = `../thanhtoan/index.html?id=${item.id}&type=RACKET`;
            });
            resultsContainer.appendChild(resultItem);
        });
    }

    const searchContainer = document.querySelector('.search-login');
    searchContainer.style.position = 'relative';
    searchContainer.appendChild(resultsContainer);

    document.addEventListener('click', function closeResults(e) {
        if (!searchContainer.contains(e.target)) {
            resultsContainer.remove();
            document.removeEventListener('click', closeResults);
        }
    });
} 