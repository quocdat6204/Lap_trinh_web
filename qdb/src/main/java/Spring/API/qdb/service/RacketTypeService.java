package Spring.API.qdb.service;

import Spring.API.qdb.exception.ResourceNotFoundException;
import Spring.API.qdb.model.RacketType;
import Spring.API.qdb.repository.RacketTypeRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RacketTypeService {
    
    private final RacketTypeRepository racketTypeRepository;
    
    public RacketTypeService(RacketTypeRepository racketTypeRepository) {
        this.racketTypeRepository = racketTypeRepository;
    }
    
    public List<RacketType> getAllRacketTypes() {
        return racketTypeRepository.findAll();
    }
    
    public RacketType getRacketTypeById(Long id) {
        return racketTypeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy loại vợt với ID: " + id));
    }
    
    public RacketType createRacketType(RacketType racketType) {
        return racketTypeRepository.save(racketType);
    }
    
    @Transactional
    public RacketType updateRacketType(Long id, RacketType racketTypeDetails) {
        RacketType racketType = getRacketTypeById(id);
        
        // Chỉ cập nhật tên
        racketType.setName(racketTypeDetails.getName());
        
        return racketTypeRepository.save(racketType);
    }
    
    @Transactional
    public void deleteRacketType(Long id) {
        RacketType racketType = getRacketTypeById(id);
        
        // Kiểm tra xem có vợt nào thuộc loại vợt này không
        if (!racketType.getRackets().isEmpty()) {
            throw new RuntimeException("Không thể xóa loại vợt vì vẫn còn vợt thuộc loại này");
        }
        
        racketTypeRepository.delete(racketType);
    }

    public Page<RacketType> getRacketTypesPage(Pageable pageable) {
        return racketTypeRepository.findAll(pageable);
    }
} 