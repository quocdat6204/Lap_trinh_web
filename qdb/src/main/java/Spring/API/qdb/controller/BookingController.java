package Spring.API.qdb.controller;

import Spring.API.qdb.dto.BookingDetailsDto;
import Spring.API.qdb.dto.BookingRequestDto;
import Spring.API.qdb.model.Booking;
import Spring.API.qdb.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {
    
    @Autowired
    private BookingService bookingService;
    
    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody BookingRequestDto bookingRequest) {
        Booking newBooking = bookingService.createBooking(bookingRequest);
        return ResponseEntity.ok(newBooking);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBooking(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(booking);
    }

    // API trả về tất cả bookings
    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    // API phân trang
    @GetMapping("/paginated")
    public ResponseEntity<?> getPaginatedBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        try {
            Sort.Direction direction = Sort.Direction.fromString(sortDirection.toUpperCase());
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
            Page<Booking> bookings = bookingService.getPaginatedBookings(pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("bookings", bookings.getContent());
            response.put("currentPage", bookings.getNumber());
            response.put("totalItems", bookings.getTotalElements());
            response.put("totalPages", bookings.getTotalPages());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getBookingsByUserId(@PathVariable Long userId) {
        List<Booking> bookings = bookingService.getBookingsByUserId(userId);
        return ResponseEntity.ok(bookings);
    }

    // API phân trang cho bookings của user
    @GetMapping("/user/{userId}/paginated")
    public ResponseEntity<?> getPaginatedBookingsByUserId(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        try {
            Sort.Direction direction = Sort.Direction.fromString(sortDirection.toUpperCase());
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
            Page<Booking> bookings = bookingService.getPaginatedBookingsByUserId(userId, pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("bookings", bookings.getContent());
            response.put("currentPage", bookings.getNumber());
            response.put("totalItems", bookings.getTotalElements());
            response.put("totalPages", bookings.getTotalPages());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/confirm/{id}")
    public ResponseEntity<?> confirmBooking(@PathVariable Long id, @RequestParam("accept") boolean accept) {
        bookingService.confirmBooking(id, accept);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<?> getBookingDetails(@PathVariable Long id) {
        try {
            BookingDetailsDto bookingDetails = bookingService.getBookingDetails(id);
            return ResponseEntity.ok(bookingDetails);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
} 