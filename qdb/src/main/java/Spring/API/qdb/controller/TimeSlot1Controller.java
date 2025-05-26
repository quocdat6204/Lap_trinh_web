package Spring.API.qdb.controller;

import Spring.API.qdb.exception.ResourceNotFoundException;
import Spring.API.qdb.dto.TimeSlot1DTO;
import Spring.API.qdb.model.TimeSlot1;
import Spring.API.qdb.service.TimeSlot1Service;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/timeslots1")
@CrossOrigin(origins = "*")
public class TimeSlot1Controller {
    private final TimeSlot1Service timeSlot1Service;

    public TimeSlot1Controller(TimeSlot1Service timeSlot1Service) {
        this.timeSlot1Service = timeSlot1Service;
    }

    @GetMapping("/day1/{day1Id}")
    public ResponseEntity<List<TimeSlot1DTO>> getTimeSlotsByDay1(@PathVariable Long day1Id) {
        List<TimeSlot1DTO> timeSlots = timeSlot1Service.getTimeSlotsByDay1(day1Id);
        return ResponseEntity.ok(timeSlots);
    }

    @GetMapping("/available/day1/{day1Id}")
    public ResponseEntity<List<TimeSlot1DTO>> getAvailableTimeSlots(@PathVariable Long day1Id) {
        List<TimeSlot1> timeSlots = timeSlot1Service.getAvailableTimeSlots(day1Id);
        List<TimeSlot1DTO> dtos = timeSlots.stream()
            .map(t -> new TimeSlot1DTO(t.getId(), t.getStartTime(), t.getEndTime(), t.isBooked(), t.getDay().getId(), t.getBookingId()))
            .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TimeSlot1> getTimeSlotById(@PathVariable Long id) {
        TimeSlot1 timeSlot = timeSlot1Service.getTimeSlotById(id);
        return ResponseEntity.ok(timeSlot);
    }

    @PostMapping("/{id}/book")
    public ResponseEntity<TimeSlot1> bookTimeSlot(@PathVariable Long id, @RequestBody Map<String, Long> request) {
        Long bookingId = request.get("bookingId");
        TimeSlot1 bookedTimeSlot = timeSlot1Service.bookTimeSlot(id, bookingId);
        return ResponseEntity.ok(bookedTimeSlot);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<TimeSlot1> cancelBooking(@PathVariable Long id) {
        TimeSlot1 canceledTimeSlot = timeSlot1Service.cancelBooking(id);
        return ResponseEntity.ok(canceledTimeSlot);
    }

    @PostMapping
    public ResponseEntity<TimeSlot1DTO> createTimeSlot(@RequestBody Map<String, Object> request) {
        LocalTime startTime = LocalTime.parse(request.get("startTime").toString());
        LocalTime endTime = LocalTime.parse(request.get("endTime").toString());
        Long day1Id = Long.parseLong(request.get("day1Id").toString());
        TimeSlot1 newSlot = timeSlot1Service.createTimeSlot(startTime, endTime, day1Id);
        TimeSlot1DTO dto = new TimeSlot1DTO(newSlot.getId(), newSlot.getStartTime(), newSlot.getEndTime(), newSlot.isBooked(), newSlot.getDay().getId(), newSlot.getBookingId());
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTimeSlot(@PathVariable Long id) {
        try {
            timeSlot1Service.deleteTimeSlot(id);
            return ResponseEntity.ok().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
} 