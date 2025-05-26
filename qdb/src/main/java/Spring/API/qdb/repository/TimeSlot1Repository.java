package Spring.API.qdb.repository;

import Spring.API.qdb.dto.TimeSlot1DTO;
import Spring.API.qdb.model.TimeSlot1;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimeSlot1Repository extends JpaRepository<TimeSlot1, Long> {
    @Query("SELECT new Spring.API.qdb.dto.TimeSlot1DTO(t.id, t.startTime, t.endTime, t.isBooked, t.day.id, t.bookingId) " +
           "FROM TimeSlot1 t WHERE t.day.id = :day1Id ORDER BY t.startTime")
    List<TimeSlot1DTO> findTimeSlotsByDayId(@Param("day1Id") Long day1Id);
    
    List<TimeSlot1> findByDayId(Long day1Id);
    List<TimeSlot1> findByDayIdAndIsBooked(Long day1Id, boolean isBooked);

    @Query("SELECT t FROM TimeSlot1 t LEFT JOIN FETCH t.day d WHERE t.bookingId = :bookingId ORDER BY t.startTime")
    List<TimeSlot1> findByBookingId(@Param("bookingId") Long bookingId);

    List<TimeSlot1> findByBookingIdOrderByStartTime(Long bookingId);
} 