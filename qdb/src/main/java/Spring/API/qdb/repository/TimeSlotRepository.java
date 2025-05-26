package Spring.API.qdb.repository;

import Spring.API.qdb.dto.TimeSlotDto;
import Spring.API.qdb.model.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    @Query("SELECT new Spring.API.qdb.dto.TimeSlotDto(t.id, t.startTime, t.endTime, t.isBooked, t.day.id, t.bookingId) " +
           "FROM TimeSlot t WHERE t.day.id = :dayId ORDER BY t.startTime")
    List<TimeSlotDto> findTimeSlotsByDayId(@Param("dayId") Long dayId);
    
    List<TimeSlot> findByDayId(Long dayId);
    List<TimeSlot> findByDayIdAndIsBooked(Long dayId, boolean isBooked);

    @Query("SELECT t FROM TimeSlot t " +
           "LEFT JOIN FETCH t.day d " +
           "LEFT JOIN FETCH d.court " +
           "WHERE t.bookingId = :bookingId " +
           "ORDER BY t.startTime")
    List<TimeSlot> findByBookingId(@Param("bookingId") Long bookingId);

    List<TimeSlot> findByBookingIdOrderByStartTime(Long bookingId);
}
