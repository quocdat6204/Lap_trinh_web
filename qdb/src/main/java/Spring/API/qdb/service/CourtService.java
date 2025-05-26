package Spring.API.qdb.service;

import Spring.API.qdb.exception.ResourceNotFoundException;
import Spring.API.qdb.model.Court;
import Spring.API.qdb.model.CourtType;
import Spring.API.qdb.repository.CourtRepository;
import Spring.API.qdb.repository.CourtTypeRepository;
import Spring.API.qdb.dto.CourtUpdateDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CourtService {
    
    private final CourtRepository courtRepository;
    private final CourtTypeRepository courtTypeRepository;
    
    public CourtService(CourtRepository courtRepository, 
                        CourtTypeRepository courtTypeRepository) {
        this.courtRepository = courtRepository;
        this.courtTypeRepository = courtTypeRepository;
    }
    
    @Transactional(readOnly = true)
    public List<Court> searchCourts(String term) {
        return courtRepository.findByNameContainingOrAddressContaining(term, term);
    }     

    public List<Court> getAllCourts() {
        return courtRepository.findAllWithCourtType();
    }
    
    @Transactional(readOnly = true)
    public List<Court> getCourtsByType(Long courtTypeId) {
        if (!courtTypeRepository.existsById(courtTypeId)) {
            throw new ResourceNotFoundException("Không tìm thấy loại sân với ID: " + courtTypeId);
        }
        return courtRepository.findByCourtTypeIdWithType(courtTypeId);
    }
    
    @Transactional(readOnly = true)
    public Court getCourtById(Long id) {
        return courtRepository.findByIdWithCourtType(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sân với ID: " + id));
    }
    
    @Transactional
    public Court createCourt(Court court, Long courtTypeId) {
        CourtType courtType = courtTypeRepository.findById(courtTypeId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy loại sân với ID: " + courtTypeId));
        
        court.setCourtType(courtType);
        Court savedCourt = courtRepository.save(court);
        
        return getCourtById(savedCourt.getId());
    }
    
    @Transactional
    public Court updateCourt(Long id, CourtUpdateDto courtDetails) {
        Court court = getCourtById(id);
        
        if (courtDetails.getName() != null) {
            court.setName(courtDetails.getName());
        }
        if (courtDetails.getAddress() != null) {
            court.setAddress(courtDetails.getAddress());
        }
        if (courtDetails.getImageUrl() != null) {
            court.setImageUrl(courtDetails.getImageUrl());
        }
        if (courtDetails.getHours() != null) {
            court.setHours(courtDetails.getHours());
        }
        if (courtDetails.getPrice() != null) {
            court.setPrice(courtDetails.getPrice());
        }
        if (courtDetails.getCourtTypeId() != null) {
            CourtType courtType = courtTypeRepository.findById(courtDetails.getCourtTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy loại sân với ID: " + courtDetails.getCourtTypeId()));
            court.setCourtType(courtType);
        }
        
        Court savedCourt = courtRepository.save(court);
        
        return getCourtById(savedCourt.getId());
    }
    
    @Transactional
    public void deleteCourt(Long id) {
        Court court = getCourtById(id);
        
        try {
            courtRepository.deleteTimeSlotsByCourt(id);
            courtRepository.deleteDaysByCourt(id);
            courtRepository.delete(court);
        } catch (Exception e) {
            throw new RuntimeException("Không thể xóa sân: " + e.getMessage());
        }
    }

    public Page<Court> getPaginatedCourts(Pageable pageable) {
        return courtRepository.findAll(pageable);
    }

    public Page<Court> getPaginatedCourtsByType(Long courtTypeId, Pageable pageable) {
        return courtRepository.findByCourtTypeId(courtTypeId, pageable);
    }
}
