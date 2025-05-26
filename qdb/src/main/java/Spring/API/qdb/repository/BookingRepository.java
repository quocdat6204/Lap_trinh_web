package Spring.API.qdb.repository;

import Spring.API.qdb.model.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    // Tìm tất cả bookings của một user
    @Query("SELECT DISTINCT b FROM Booking b WHERE b.userId = :userId")
    List<Booking> findByUserId(@Param("userId") Long userId);
    
    // Override findAll để load cả timeSlots
    @Query("SELECT DISTINCT b FROM Booking b")
    List<Booking> findAllWithTimeSlots();

    // Lấy thông tin chi tiết booking
    @Query("SELECT b FROM Booking b WHERE b.id = :id")
    Optional<Booking> findBookingDetailsById(@Param("id") Long id);

    // Phân trang cho tất cả bookings
    @Query("SELECT DISTINCT b FROM Booking b")
    Page<Booking> findAllWithPagination(Pageable pageable);

    // Phân trang cho bookings của một user
    @Query("SELECT DISTINCT b FROM Booking b WHERE b.userId = :userId")
    Page<Booking> findByUserIdWithPagination(@Param("userId") Long userId, Pageable pageable);
} 