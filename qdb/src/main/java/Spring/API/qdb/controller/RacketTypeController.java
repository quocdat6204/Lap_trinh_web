package Spring.API.qdb.controller;

import Spring.API.qdb.dto.RacketTypeDto;
import Spring.API.qdb.model.RacketType;
import Spring.API.qdb.service.RacketTypeService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

//import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/racket-types")
@CrossOrigin(origins = "*")
public class RacketTypeController {
    
    private final RacketTypeService racketTypeService;
    
    public RacketTypeController(RacketTypeService racketTypeService) {
        this.racketTypeService = racketTypeService;
    }
    
    @GetMapping
    public ResponseEntity<List<RacketTypeDto>> getAllRacketTypes() {
        List<RacketType> racketTypes = racketTypeService.getAllRacketTypes();
        List<RacketTypeDto> racketTypeDtos = racketTypes.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(racketTypeDtos);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<RacketTypeDto> getRacketTypeById(@PathVariable Long id) {
        RacketType racketType = racketTypeService.getRacketTypeById(id);
        return ResponseEntity.ok(convertToDto(racketType));
    }
    
    @PostMapping
    public ResponseEntity<RacketTypeDto> createRacketType(@RequestBody RacketType racketType) {
        RacketType newRacketType = racketTypeService.createRacketType(racketType);
        return new ResponseEntity<>(convertToDto(newRacketType), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<RacketTypeDto> updateRacketType(@PathVariable Long id, @RequestBody RacketType racketTypeDetails) {
        RacketType updatedRacketType = racketTypeService.updateRacketType(id, racketTypeDetails);
        return ResponseEntity.ok(convertToDto(updatedRacketType));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRacketType(@PathVariable Long id) {
        racketTypeService.deleteRacketType(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/paginated")
    public ResponseEntity<?> getPaginatedRacketTypes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        Sort.Direction direction = Sort.Direction.fromString(sortDirection.toUpperCase());
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<RacketType> racketTypes = racketTypeService.getRacketTypesPage(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("racketTypes", racketTypes.getContent().stream().map(this::convertToDto).toList());
        response.put("currentPage", racketTypes.getNumber());
        response.put("totalItems", racketTypes.getTotalElements());
        response.put("totalPages", racketTypes.getTotalPages());

        return ResponseEntity.ok(response);
    }
    
    private RacketTypeDto convertToDto(RacketType racketType) {
        RacketTypeDto dto = new RacketTypeDto();
        dto.setId(racketType.getId());
        dto.setName(racketType.getName());
        return dto;
    }
} 