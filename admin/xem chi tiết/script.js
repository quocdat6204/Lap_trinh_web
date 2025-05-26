// // Wait for the document to be fully loaded
// document.addEventListener('DOMContentLoaded', function() {
//     // Get all time buttons
//     const timeButtons = document.querySelectorAll('.time-btn');
    
//     // Add click event listener to each time button
//     timeButtons.forEach(button => {
//         button.addEventListener('click', function() {
//             // Toggle the 'selected' class on the clicked button
//             this.classList.toggle('selected');
            
//             // Optional: If you want only one time button to be selected at a time
//             // Uncomment the code below
//             /*
//             timeButtons.forEach(btn => {
//                 if (btn !== this) {
//                     btn.classList.remove('selected');
//                 }
//             });
//             */
//         });
//     });
    
//     // Similarly for date buttons if needed
//     const dateButtons = document.querySelectorAll('.date-btn');
//     dateButtons.forEach(button => {
//         button.addEventListener('click', function() {
//             // Remove 'selected' class from all date buttons
//             dateButtons.forEach(btn => {
//                 btn.classList.remove('selected');
//             });
            
//             // Add 'selected' class to clicked button
//             this.classList.add('selected');
//         });
//     });
// });


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

// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Get all date and time buttons
    const dateButtons = document.querySelectorAll('.date-btn');
    const timeButtons = document.querySelectorAll('.time-btn');
    const bookingRecordsContainer = document.getElementById('bookingRecordsContainer');
    const bookingRecordsBody = document.getElementById('bookingRecordsBody');
    
    // Booking data - simulates database records
    const bookingData = {
        '22/02': {
            '8:00': {
                customer: 'B22DCCN187',
                registeredAt: '20:00 21/02/2025'
            },
            '9:00': {
                customer: 'B22DCCN033',
                registeredAt: '19:30 21/02/2025'
            }
        },
        '23/02': {
            '15:00': {
                customer: 'B22DCCN042',
                registeredAt: '10:15 22/02/2025'
            }
        },
        '24/02': {
            '16:00': {
                customer: 'B22DCCN105',
                registeredAt: '14:20 23/02/2025'
            }
        }
    };
    
    // Selected date and time
    let selectedDate = null;
    let selectedTime = null;
    
    // Add click event listener to each date button
    dateButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove 'selected' class from all date buttons
            dateButtons.forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // Add 'selected' class to clicked button
            this.classList.add('selected');
            
            // Store selected date
            selectedDate = this.dataset.date;
            
            // Update time button states based on selected date
            updateTimeButtonStates();
            
            // Check if both date and time are selected
            checkAndDisplayBookings();
        });
    });
    
    // Add click event listener to each time button
    timeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Toggle the 'selected' class on the clicked button
            timeButtons.forEach(btn => {
                btn.classList.remove('selected');
            });
            
            this.classList.add('selected');
            
            // Store selected time
            selectedTime = this.dataset.time;
            
            // Check if both date and time are selected
            checkAndDisplayBookings();
        });
    });
    
    // Function to update time button states based on selected date
    function updateTimeButtonStates() {
        if (!selectedDate) return;
        
        // Reset all time buttons
        timeButtons.forEach(btn => {
            btn.classList.remove('selected');
            btn.style.backgroundColor = '';
            btn.style.color = '';
            btn.style.borderColor = '';
        });
        
        // If there are bookings for this date, mark those times
        if (bookingData[selectedDate]) {
            timeButtons.forEach(btn => {
                const time = btn.dataset.time;
                if (bookingData[selectedDate][time]) {
                    btn.style.backgroundColor = '#e74c3c';
                    btn.style.color = 'white';
                    btn.style.borderColor = '#e74c3c';
                }
            });
        }
    }
    
    // Function to check if both date and time are selected and display bookings
    function checkAndDisplayBookings() {
        if (selectedDate && selectedTime) {
            // Check if there's a booking for this slot
            if (bookingData[selectedDate] && bookingData[selectedDate][selectedTime]) {
                const booking = bookingData[selectedDate][selectedTime];
                
                // Populate and show the booking records table
                bookingRecordsBody.innerHTML = `
                    <tr>
                        <td>${booking.customer}</td>
                        <td>${booking.registeredAt}</td>
                        <td>
                            <button class="delete-btn" title="Xóa đặt sân">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
                bookingRecordsContainer.style.display = 'block';
                
                // Add event listener to delete button
                const deleteBtn = bookingRecordsBody.querySelector('.delete-btn');
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', function() {
                        if (confirm('Bạn có chắc chắn muốn xóa đặt sân này không?')) {
                            // In a real app, this would delete from database
                            delete bookingData[selectedDate][selectedTime];
                            
                            // Update UI
                            updateTimeButtonStates();
                            bookingRecordsContainer.style.display = 'none';
                        }
                    });
                }
            } else {
                // No booking for this slot
                bookingRecordsContainer.style.display = 'none';
            }
        }
    }
    
    // Initialize - check if any date is pre-selected
    const preSelectedDate = document.querySelector('.date-btn.selected');
    if (preSelectedDate) {
        selectedDate = preSelectedDate.dataset.date;
        updateTimeButtonStates();
    }
});
