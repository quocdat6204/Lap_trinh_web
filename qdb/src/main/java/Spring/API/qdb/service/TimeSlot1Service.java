package Spring.API.qdb.service;

import Spring.API.qdb.dto.TimeSlot1DTO;
import Spring.API.qdb.exception.ResourceNotFoundException;
import Spring.API.qdb.model.Day1;
import Spring.API.qdb.model.TimeSlot1;
import Spring.API.qdb.repository.Day1Repository;
import Spring.API.qdb.repository.TimeSlot1Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;

@Service
public class TimeSlot1Service {
    private final TimeSlot1Repository timeSlot1Repository;
    private final Day1Repository day1Repository;

    public TimeSlot1Service(TimeSlot1Repository timeSlot1Repository, Day1Repository day1Repository) {
        this.timeSlot1Repository = timeSlot1Repository;
        this.day1Repository = day1Repository;
    }

    @Transactional(readOnly = true)
    public List<TimeSlot1DTO> getTimeSlotsByDay1(Long day1Id) {
        return timeSlot1Repository.findByDayId(day1Id).stream()
            .map(t -> new TimeSlot1DTO(t.getId(), t.getStartTime(), t.getEndTime(), t.isBooked(), t.getDay().getId(), t.getBookingId()))
            .toList();
    }

    @Transactional(readOnly = true)
    public List<TimeSlot1> getAvailableTimeSlots(Long day1Id) {
        return timeSlot1Repository.findByDayIdAndIsBooked(day1Id, false);
    }

    @Transactional(readOnly = true)
    public TimeSlot1 getTimeSlotById(Long id) {
        return timeSlot1Repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khung giờ với ID: " + id));
    }

    public TimeSlot1 bookTimeSlot(Long timeSlotId, Long bookingId) {
        TimeSlot1 timeSlot = getTimeSlotById(timeSlotId);
        if (timeSlot.isBooked()) {
            throw new IllegalStateException("Khung giờ này đã được đặt");
        }
        timeSlot.setBooked(true);
        timeSlot.setBookingId(bookingId);
        return timeSlot1Repository.save(timeSlot);
    }

    public TimeSlot1 cancelBooking(Long timeSlotId) {
        TimeSlot1 timeSlot = getTimeSlotById(timeSlotId);
        timeSlot.setBooked(false);
        timeSlot.setBookingId(null);
        return timeSlot1Repository.save(timeSlot);
    }

    @Transactional
    public TimeSlot1 createTimeSlot(LocalTime startTime, LocalTime endTime, Long day1Id) {
        Day1 day = day1Repository.findById(day1Id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ngày với ID: " + day1Id));
        TimeSlot1 timeSlot = new TimeSlot1();
        timeSlot.setStartTime(startTime);
        timeSlot.setEndTime(endTime);
        timeSlot.setDay(day);
        timeSlot.setBooked(false);
        return timeSlot1Repository.save(timeSlot);
    }

    @Transactional
    public void deleteTimeSlot(Long id) {
        TimeSlot1 timeSlot = timeSlot1Repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khung giờ với ID: " + id));
        
        // Kiểm tra nếu khung giờ đã được đặt
        if (timeSlot.isBooked()) {
            throw new IllegalStateException("Không thể xóa khung giờ đã được đặt");
        }
        
        timeSlot1Repository.delete(timeSlot);
    }
}