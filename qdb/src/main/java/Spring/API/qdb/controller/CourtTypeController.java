package Spring.API.qdb.controller;

import Spring.API.qdb.dto.CourtTypeDto;
import Spring.API.qdb.model.CourtType;
import Spring.API.qdb.service.CourtTypeService;
// import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping("/api/court-types")
@CrossOrigin(origins = "*")
public class CourtTypeController {
    
    private final CourtTypeService courtTypeService;
    
    // @Autowired
    public CourtTypeController(CourtTypeService courtTypeService) {
        this.courtTypeService = courtTypeService;
    }
    
    @GetMapping
    public ResponseEntity<List<CourtTypeDto>> getAllCourtTypes() {
        List<CourtType> courtTypes = courtTypeService.getAllCourtTypes();
        List<CourtTypeDto> courtTypeDtos = courtTypes.stream()
            .map(this::convertToDto)
            .collect(Collectors.toList());
        return ResponseEntity.ok(courtTypeDtos);
    }

    private CourtTypeDto convertToDto(CourtType courtType) {
        CourtTypeDto dto = new CourtTypeDto();
        dto.setId(courtType.getId());
        dto.setName(courtType.getName());
        return dto;
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CourtTypeDto> getCourtTypeById(@PathVariable Long id) {
        CourtType courtType = courtTypeService.getCourtTypeById(id);
        return ResponseEntity.ok(convertToDto(courtType));
    }
    
    @PostMapping
    public ResponseEntity<CourtTypeDto> createCourtType(@RequestBody CourtType courtType) {
        CourtType newCourtType = courtTypeService.createCourtType(courtType);
        return new ResponseEntity<>(convertToDto(newCourtType), HttpStatus.CREATED);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<CourtTypeDto> updateCourtType(@PathVariable Long id, @RequestBody CourtType courtType) {
        CourtType updatedCourtType = courtTypeService.updateCourtType(id, courtType);
        return ResponseEntity.ok(convertToDto(updatedCourtType));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourtType(@PathVariable Long id) {
        courtTypeService.deleteCourtType(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/paginated")
    public ResponseEntity<?> getPaginatedCourtTypes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection) {
        Sort.Direction direction = Sort.Direction.fromString(sortDirection.toUpperCase());
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<CourtType> courtTypes = courtTypeService.getCourtTypesPage(pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("courtTypes", courtTypes.getContent().stream().map(this::convertToDto).toList());
        response.put("currentPage", courtTypes.getNumber());
        response.put("totalItems", courtTypes.getTotalElements());
        response.put("totalPages", courtTypes.getTotalPages());

        return ResponseEntity.ok(response);
    }

}
