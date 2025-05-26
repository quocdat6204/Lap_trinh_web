package Spring.API.qdb.service;

import Spring.API.qdb.dto.TimeSlotDto;
import Spring.API.qdb.exception.ResourceNotFoundException;
import Spring.API.qdb.model.TimeSlot;
import Spring.API.qdb.repository.TimeSlotRepository;
import Spring.API.qdb.model.Day;
import Spring.API.qdb.repository.DayRepository;
import java.time.LocalTime;
// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class TimeSlotService {
    
    private final TimeSlotRepository timeSlotRepository;
    private final DayRepository dayRepository;
    
    // @Autowired
    public TimeSlotService(TimeSlotRepository timeSlotRepository, DayRepository dayRepository) {
        this.timeSlotRepository = timeSlotRepository;
        this.dayRepository = dayRepository;
    }
    
    @Transactional(readOnly = true)
    public List<TimeSlotDto> getTimeSlotsByDay(Long dayId) {
        return timeSlotRepository.findTimeSlotsByDayId(dayId);
    }
    
    @Transactional(readOnly = true)
    public List<TimeSlot> getAvailableTimeSlots(Long dayId) {
        return timeSlotRepository.findByDayIdAndIsBooked(dayId, false);
    }
    
    @Transactional(readOnly = true)
    public TimeSlot getTimeSlotById(Long id) {
        return timeSlotRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khung giờ với ID: " + id));
    }
    
    public TimeSlot bookTimeSlot(Long timeSlotId, Long bookingId) {
        TimeSlot timeSlot = getTimeSlotById(timeSlotId);
        
        if (timeSlot.isBooked()) {
            throw new IllegalStateException("Khung giờ này đã được đặt");
        }
        
        timeSlot.setBooked(true);
        timeSlot.setBookingId(bookingId);

        
        return timeSlotRepository.save(timeSlot);
    }
    
    public TimeSlot cancelBooking(Long timeSlotId) {
        TimeSlot timeSlot = getTimeSlotById(timeSlotId);
        
        timeSlot.setBooked(false);
        timeSlot.setBookingId(null);
        
        return timeSlotRepository.save(timeSlot);
    }
    
    @Transactional
    public TimeSlot createTimeSlot(LocalTime startTime, LocalTime endTime, Long dayId) {
        Day day = dayRepository.findById(dayId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ngày với ID: " + dayId));
        TimeSlot timeSlot = new TimeSlot();
        timeSlot.setStartTime(startTime);
        timeSlot.setEndTime(endTime);
        timeSlot.setDay(day);
        timeSlot.setBooked(false);
        return timeSlotRepository.save(timeSlot);
    }

    @Transactional
    public void deleteTimeSlot(Long id) {
        TimeSlot timeSlot = timeSlotRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khung giờ với ID: " + id));
        
        // Kiểm tra nếu khung giờ đã được đặt
        if (timeSlot.isBooked()) {
            throw new IllegalStateException("Không thể xóa khung giờ đã được đặt");
        }
        
        timeSlotRepository.delete(timeSlot);
    }
}
