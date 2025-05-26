package Spring.API.qdb.controller;

import Spring.API.qdb.dto.RacketDTO;
import Spring.API.qdb.dto.RacketUpdateDTO;
import Spring.API.qdb.model.Racket;
import Spring.API.qdb.service.RacketService;
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
@RequestMapping("/api/rackets")
@CrossOrigin(origins = "*")
public class RacketController {
    
    private final RacketService racketService;
    
    public RacketController(RacketService racketService) {
        this.racketService = racketService;
    }
    
    @GetMapping
    public ResponseEntity<List<RacketDTO>> getAllRackets() {
        List<Racket> rackets = racketService.getAllRackets();
        List<RacketDTO> racketDTOs = rackets.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(racketDTOs);
    }
    
    @GetMapping("/type/{racketTypeId}")
    public ResponseEntity<List<RacketDTO>> getRacketsByType(@PathVariable Long racketTypeId) {
        try {
            List<Racket> rackets = racketService.getRacketsByType(racketTypeId);
            List<RacketDTO> racketDTOs = rackets.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
            return ResponseEntity.ok(racketDTOs);
        } catch (Exception e) {
            throw new RuntimeException("Không thể lấy danh sách vợt: " + e.getMessage());
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<RacketDTO> getRacketById(@PathVariable Long id) {
        Racket racket = racketService.getRacketById(id);
        return ResponseEntity.ok(convertToDto(racket));
    }
    
    @PostMapping
    public ResponseEntity<RacketDTO> createRacket(@RequestBody Map<String, Object> request) {
        Racket racket = new Racket();
        racket.setName((String) request.get("name"));
        racket.setBrand((String) request.get("brand"));
        racket.setPrice(Double.parseDouble(request.get("price").toString()));
        racket.setImageUrl((String) request.get("imageUrl"));
        
        Long racketTypeId = Long.parseLong(request.get("racketTypeId").toString());
        
        Racket newRacket = racketService.createRacket(racket, racketTypeId);
        return new ResponseEntity<>(convertToDto(newRacket), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<RacketDTO> updateRacket(@PathVariable Long id, @RequestBody RacketUpdateDTO racketDetails) {
        Racket updatedRacket = racketService.updateRacket(id, racketDetails);
        return ResponseEntity.ok(convertToDto(updatedRacket));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRacket(@PathVariable Long id) {
        racketService.deleteRacket(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<RacketDTO>> searchRackets(@RequestParam("term") String term) {
        List<Racket> rackets = racketService.searchRackets(term);
        List<RacketDTO> racketDTOs = rackets.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(racketDTOs);
    }
    
    @GetMapping("/paginated")
    public ResponseEntity<?> getPaginatedRackets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        Sort.Direction direction = Sort.Direction.fromString(sortDirection.toUpperCase());
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<Racket> rackets = racketService.getPaginatedRackets(pageable);
        List<RacketDTO> racketDTOs = rackets.getContent().stream().map(this::convertToDto).toList();

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("rackets", racketDTOs);
        response.put("currentPage", rackets.getNumber());
        response.put("totalItems", rackets.getTotalElements());
        response.put("totalPages", rackets.getTotalPages());

        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/type/{racketTypeId}/paginated")
    public ResponseEntity<?> getPaginatedRacketsByType(
            @PathVariable Long racketTypeId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        Sort.Direction direction = Sort.Direction.fromString(sortDirection.toUpperCase());
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<Racket> rackets = racketService.getPaginatedRacketsByType(racketTypeId, pageable);
        List<RacketDTO> racketDTOs = rackets.getContent().stream().map(this::convertToDto).toList();

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("rackets", racketDTOs);
        response.put("currentPage", rackets.getNumber());
        response.put("totalItems", rackets.getTotalElements());
        response.put("totalPages", rackets.getTotalPages());

        return ResponseEntity.ok(response);
    }
    
    private RacketDTO convertToDto(Racket racket) {
        RacketDTO dto = new RacketDTO();
        dto.setId(racket.getId());
        dto.setName(racket.getName());
        dto.setBrand(racket.getBrand());
        dto.setPrice(racket.getPrice());
        dto.setImageUrl(racket.getImageUrl());
        
        if (racket.getRacketType() != null) {
            dto.setRacketTypeId(racket.getRacketType().getId());
            dto.setRacketTypeName(racket.getRacketType().getName());
        }
        
        return dto;
    }
} 