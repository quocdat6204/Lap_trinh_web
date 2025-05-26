package Spring.API.qdb.controller;

import Spring.API.qdb.dto.Day1DTO;
import Spring.API.qdb.model.Day1;
import Spring.API.qdb.service.Day1Service;
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
@RequestMapping("/api/days1")
@CrossOrigin(origins = "*")
public class Day1Controller {
    private final Day1Service day1Service;

    public Day1Controller(Day1Service day1Service) {
        this.day1Service = day1Service;
    }

    @GetMapping("/racket/{racketId}")
    public ResponseEntity<List<Day1DTO>> getDaysByRacket(@PathVariable Long racketId) {
        List<Day1DTO> days = day1Service.getDaysByRacket(racketId);
        return ResponseEntity.ok(days);
    }

    @GetMapping("/available/racket/{racketId}")
    public ResponseEntity<List<Day1DTO>> getAvailableDays(@PathVariable Long racketId) {
        List<Day1> days = day1Service.getAvailableDays(racketId);
        List<Day1DTO> dtos = days.stream()
            .map(day -> new Day1DTO(day.getId(), day.getDate(), day.getRacket().getId()))
            .toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Day1> getDayById(@PathVariable Long id) {
        Day1 day = day1Service.getDayById(id);
        return ResponseEntity.ok(day);
    }

    @GetMapping("/racket/{racketId}/paginated")
    public ResponseEntity<?> getPaginatedDaysByRacket(
            @PathVariable Long racketId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        Sort.Direction direction = Sort.Direction.fromString(sortDirection.toUpperCase());
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<Day1> days = day1Service.getPaginatedDaysByRacket(racketId, pageable);

        List<Day1DTO> dayDtos = days.getContent().stream()
            .map(day -> new Day1DTO(day.getId(), day.getDate(), day.getRacket().getId()))
            .toList();

        java.util.Map<String, Object> response = new java.util.HashMap<>();
        response.put("days", dayDtos);
        response.put("currentPage", days.getNumber());
        response.put("totalItems", days.getTotalElements());
        response.put("totalPages", days.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Day1DTO> createDay(@RequestBody Map<String, Object> request) {
        java.time.LocalDate date = java.time.LocalDate.parse(request.get("date").toString());
        Long racketId = Long.parseLong(request.get("racketId").toString());
        Day1 newDay = day1Service.createDay(date, racketId);
        Day1DTO dto = new Day1DTO(newDay.getId(), newDay.getDate(), newDay.getRacket().getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(dto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDay(@PathVariable Long id) {
        try {
            day1Service.deleteDay(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
} 