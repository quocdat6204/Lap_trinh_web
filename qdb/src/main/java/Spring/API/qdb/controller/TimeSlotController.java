package Spring.API.qdb.controller;

import Spring.API.qdb.exception.ResourceNotFoundException;
import Spring.API.qdb.dto.TimeSlotDto;
import Spring.API.qdb.model.TimeSlot;
import Spring.API.qdb.service.TimeSlotService;
// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.time.LocalTime;

@RestController
@RequestMapping("/api/time-slots")
@CrossOrigin(origins = "*")
public class TimeSlotController {
    
    private final TimeSlotService timeSlotService;
    
    // @Autowired
    public TimeSlotController(TimeSlotService timeSlotService) {
        this.timeSlotService = timeSlotService;
    }
    
    @GetMapping("/day/{dayId}")
    public ResponseEntity<List<TimeSlotDto>> getTimeSlotsByDay(@PathVariable Long dayId) {
        List<TimeSlotDto> timeSlots = timeSlotService.getTimeSlotsByDay(dayId);
        return ResponseEntity.ok(timeSlots);
    }
    
    @GetMapping("/available/day/{dayId}")
    public ResponseEntity<List<TimeSlotDto>> getAvailableTimeSlots(@PathVariable Long dayId) {
        List<TimeSlot> timeSlots = timeSlotService.getAvailableTimeSlots(dayId);
        List<TimeSlotDto> dtos = timeSlots.stream()
            .map(t -> new TimeSlotDto(t.getId(), t.getStartTime(), t.getEndTime(), t.isBooked(), t.getDay().getId(), t.getBookingId()))
            .toList();
        return ResponseEntity.ok(dtos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TimeSlot> getTimeSlotById(@PathVariable Long id) {
        TimeSlot timeSlot = timeSlotService.getTimeSlotById(id);
        return ResponseEntity.ok(timeSlot);
    }
    
    @PostMapping("/{id}/book")
    public ResponseEntity<TimeSlot> bookTimeSlot(@PathVariable Long id, @RequestBody Map<String, Long> request) {
        Long bookingId = request.get("bookingId");
        TimeSlot bookedTimeSlot = timeSlotService.bookTimeSlot(id, bookingId);
        return ResponseEntity.ok(bookedTimeSlot);
    }
    
    @PostMapping("/{id}/cancel")
    public ResponseEntity<TimeSlot> cancelBooking(@PathVariable Long id) {
        TimeSlot canceledTimeSlot = timeSlotService.cancelBooking(id);
        return ResponseEntity.ok(canceledTimeSlot);
    }
    
    @PostMapping
    public ResponseEntity<TimeSlotDto> createTimeSlot(@RequestBody Map<String, Object> request) {
        LocalTime startTime = LocalTime.parse(request.get("startTime").toString());
        LocalTime endTime = LocalTime.parse(request.get("endTime").toString());
        Long dayId = Long.parseLong(request.get("dayId").toString());
        TimeSlot newSlot = timeSlotService.createTimeSlot(startTime, endTime, dayId);
        TimeSlotDto dto = new TimeSlotDto(newSlot.getId(), newSlot.getStartTime(), newSlot.getEndTime(), newSlot.isBooked(), newSlot.getDay().getId(), newSlot.getBookingId());
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTimeSlot(@PathVariable Long id) {
        try {
            timeSlotService.deleteTimeSlot(id);
            return ResponseEntity.ok().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
