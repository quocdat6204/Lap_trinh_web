package Spring.API.qdb.controller;

import Spring.API.qdb.dto.DayDto;
import Spring.API.qdb.model.Day;
import Spring.API.qdb.service.DayService;
// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/days")
@CrossOrigin(origins = "*")
public class DayController {
    
    private final DayService dayService;
    
    // @Autowired
    public DayController(DayService dayService) {
        this.dayService = dayService;
    }
    
    @GetMapping("/court/{courtId}")
    public ResponseEntity<List<DayDto>> getDaysByCourt(@PathVariable Long courtId) {
        List<DayDto> days = dayService.getDaysByCourt(courtId);
        return ResponseEntity.ok(days);
    }
    
    @GetMapping("/available/court/{courtId}")
    public ResponseEntity<List<DayDto>> getAvailableDays(@PathVariable Long courtId) {
        List<Day> days = dayService.getAvailableDays(courtId);
        List<DayDto> dayDtos = days.stream()
            .map(day -> new DayDto(day.getId(), day.getDate(), day.getCourt().getId()))
            .toList();
        return ResponseEntity.ok(dayDtos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Day> getDayById(@PathVariable Long id) {
        Day day = dayService.getDayById(id);
        return ResponseEntity.ok(day);
    }

    @GetMapping("/court/{courtId}/paginated")
    public ResponseEntity<?> getPaginatedDaysByCourt(
            @PathVariable Long courtId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        Sort.Direction direction = Sort.Direction.fromString(sortDirection.toUpperCase());
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<Day> days = dayService.getPaginatedDaysByCourt(courtId, pageable);

        List<DayDto> dayDtos = days.getContent().stream()
            .map(day -> new DayDto(day.getId(), day.getDate(), day.getCourt().getId()))
            .toList();

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("days", dayDtos);
        response.put("currentPage", days.getNumber());
        response.put("totalItems", days.getTotalElements());
        response.put("totalPages", days.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<DayDto> createDay(@RequestBody Map<String, Object> request) {
        java.time.LocalDate date = java.time.LocalDate.parse(request.get("date").toString());
        Long courtId = Long.parseLong(request.get("courtId").toString());
        Day newDay = dayService.createDay(date, courtId);
        DayDto dto = new DayDto(newDay.getId(), newDay.getDate(), newDay.getCourt().getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDay(@PathVariable Long id) {
        try {
            dayService.deleteDay(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
}
