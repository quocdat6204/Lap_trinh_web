package Spring.API.qdb.controller;

import Spring.API.qdb.dto.CourtDto;
import Spring.API.qdb.dto.CourtUpdateDto;
import Spring.API.qdb.model.Court;
import Spring.API.qdb.service.CourtService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courts")
@CrossOrigin(origins = "*")
public class CourtController {
    
    private final CourtService courtService;
    
    public CourtController(CourtService courtService) {
        this.courtService = courtService;
    }
    
    @GetMapping
    public ResponseEntity<List<CourtDto>> getAllCourts() {
        List<Court> courts = courtService.getAllCourts();
        List<CourtDto> courtDtos = courts.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(courtDtos);
    }
    
    @GetMapping("/type/{courtTypeId}")
    public ResponseEntity<List<CourtDto>> getCourtsByType(@PathVariable Long courtTypeId) {
        try {
            List<Court> courts = courtService.getCourtsByType(courtTypeId);
            List<CourtDto> courtDtos = courts.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
            return ResponseEntity.ok(courtDtos);
        } catch (Exception e) {
            throw new RuntimeException("Không thể lấy danh sách sân: " + e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CourtDto> getCourtById(@PathVariable Long id) {
        Court court = courtService.getCourtById(id);
        return ResponseEntity.ok(convertToDto(court));
    }
    
    @PostMapping
    public ResponseEntity<CourtDto> createCourt(@RequestBody Map<String, Object> request) {
        Court court = new Court();
        court.setName((String) request.get("name"));
        court.setAddress((String) request.get("address"));
        court.setImageUrl((String) request.get("imageUrl"));
        court.setHours((String) request.get("hours"));
        court.setPrice((String) request.get("price"));
        
        Long courtTypeId = Long.parseLong(request.get("courtTypeId").toString());
        
        Court newCourt = courtService.createCourt(court, courtTypeId);
        return new ResponseEntity<>(convertToDto(newCourt), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CourtDto> updateCourt(@PathVariable Long id, @RequestBody CourtUpdateDto courtDetails) {
        Court updatedCourt = courtService.updateCourt(id, courtDetails);
        return ResponseEntity.ok(convertToDto(updatedCourt));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourt(@PathVariable Long id) {
        courtService.deleteCourt(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<CourtDto>> searchCourts(@RequestParam("term") String term) {
        List<Court> courts = courtService.searchCourts(term);
        List<CourtDto> courtDtos = courts.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(courtDtos);
    }
    
    @GetMapping("/paginated")
    public ResponseEntity<?> getPaginatedCourts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        Sort.Direction direction = Sort.Direction.fromString(sortDirection.toUpperCase());
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<Court> courts = courtService.getPaginatedCourts(pageable);
        List<CourtDto> courtDtos = courts.getContent().stream().map(this::convertToDto).toList();

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("courts", courtDtos);
        response.put("currentPage", courts.getNumber());
        response.put("totalItems", courts.getTotalElements());
        response.put("totalPages", courts.getTotalPages());

        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/type/{courtTypeId}/paginated")
    public ResponseEntity<?> getPaginatedCourtsByType(
            @PathVariable Long courtTypeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        Sort.Direction direction = Sort.Direction.fromString(sortDirection.toUpperCase());
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<Court> courts = courtService.getPaginatedCourtsByType(courtTypeId, pageable);
        List<CourtDto> courtDtos = courts.getContent().stream().map(this::convertToDto).toList();

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("courts", courtDtos);
        response.put("currentPage", courts.getNumber());
        response.put("totalItems", courts.getTotalElements());
        response.put("totalPages", courts.getTotalPages());

        return ResponseEntity.ok(response);
    }
    
    private CourtDto convertToDto(Court court) {
        CourtDto dto = new CourtDto();
        dto.setId(court.getId());
        dto.setName(court.getName());
        dto.setAddress(court.getAddress());
        dto.setImageUrl(court.getImageUrl());
        dto.setHours(court.getHours());
        dto.setPrice(court.getPrice());
        
        if (court.getCourtType() != null) {
            dto.setCourtTypeId(court.getCourtType().getId());
            dto.setCourtTypeName(court.getCourtType().getName());
        }
        
        return dto;
    }
}
