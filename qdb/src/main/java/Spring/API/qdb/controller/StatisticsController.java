package Spring.API.qdb.controller;

import Spring.API.qdb.service.StatisticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/statistics")
@CrossOrigin(origins = "*")
public class StatisticsController {

    private final StatisticsService statisticsService;

    public StatisticsController(StatisticsService statisticsService) {
        this.statisticsService = statisticsService;
    }

    @GetMapping("/court-type-ranking")
    public ResponseEntity<?> getCourtTypeRanking() {
        try {
            return ResponseEntity.ok(statisticsService.getCourtTypeRanking());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/court-ranking")
    public ResponseEntity<?> getCourtRanking() {
        try {
            return ResponseEntity.ok(statisticsService.getCourtRanking());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/racket-type-ranking")
    public ResponseEntity<?> getRacketTypeRanking() {
        try {
            return ResponseEntity.ok(statisticsService.getRacketTypeRanking());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/racket-ranking")
    public ResponseEntity<?> getRacketRanking() {
        try {
            return ResponseEntity.ok(statisticsService.getRacketRanking());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user-booking-ranking")
    public ResponseEntity<?> getUserBookingRanking() {
        try {
            return ResponseEntity.ok(statisticsService.getUserBookingRanking());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user-spending-ranking")
    public ResponseEntity<?> getUserSpendingRanking() {
        try {
            return ResponseEntity.ok(statisticsService.getUserSpendingRanking());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
} 