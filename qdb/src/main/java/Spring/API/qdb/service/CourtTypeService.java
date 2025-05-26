package Spring.API.qdb.service;

import Spring.API.qdb.exception.ResourceNotFoundException;
// import Spring.API.qdb.model.Court;
import Spring.API.qdb.model.CourtType;
import Spring.API.qdb.repository.CourtTypeRepository;
// import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
// import java.util.Set;

@Service
public class CourtTypeService {
    
    private final CourtTypeRepository courtTypeRepository;
    
    // @Autowired
    public CourtTypeService(CourtTypeRepository courtTypeRepository) {
        this.courtTypeRepository = courtTypeRepository;
    }
    
    public List<CourtType> getAllCourtTypes() {
        return courtTypeRepository.findAll();
    }
    
    public CourtType getCourtTypeById(Long id) {
        return courtTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy loại sân với ID: " + id));
    }
    
    public CourtType createCourtType(CourtType courtType) {
        return courtTypeRepository.save(courtType);
    }
    
    @Transactional
    public CourtType updateCourtType(Long id, CourtType courtTypeDetails) {
        CourtType courtType = getCourtTypeById(id);
        
        // Chỉ cập nhật tên, giữ nguyên các thông tin khác
        courtType.setName(courtTypeDetails.getName());
        
        return courtTypeRepository.save(courtType);
    }
    
    @Transactional
    public void deleteCourtType(Long id) {
        CourtType courtType = getCourtTypeById(id);
        
        // Kiểm tra xem có sân nào thuộc loại sân này không
        if (!courtType.getCourts().isEmpty()) {
            throw new RuntimeException("Không thể xóa loại sân vì vẫn còn sân thuộc loại này");
        }
        
        courtTypeRepository.delete(courtType);
    }

    public Page<CourtType> getCourtTypesPage(Pageable pageable) {
        return courtTypeRepository.findAll(pageable);
    }
}
