package Spring.API.qdb.service;

import Spring.API.qdb.exception.ResourceNotFoundException;
import Spring.API.qdb.model.Racket;
import Spring.API.qdb.model.RacketType;
import Spring.API.qdb.repository.RacketRepository;
import Spring.API.qdb.repository.RacketTypeRepository;
import Spring.API.qdb.dto.RacketUpdateDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class RacketService {
    private final RacketRepository racketRepository;
    private final RacketTypeRepository racketTypeRepository;

    public RacketService(RacketRepository racketRepository, RacketTypeRepository racketTypeRepository) {
        this.racketRepository = racketRepository;
        this.racketTypeRepository = racketTypeRepository;
    }

    @Transactional(readOnly = true)
    public List<Racket> searchRackets(String term) {
        return racketRepository.findByNameContainingOrBrandContaining(term, term);
    }

    public List<Racket> getAllRackets() {
        return racketRepository.findAllWithRacketType();
    }

    @Transactional(readOnly = true)
    public List<Racket> getRacketsByType(Long racketTypeId) {
        if (!racketTypeRepository.existsById(racketTypeId)) {
            throw new ResourceNotFoundException("Không tìm thấy loại vợt với ID: " + racketTypeId);
        }
        return racketRepository.findByRacketTypeIdWithType(racketTypeId);
    }

    @Transactional(readOnly = true)
    public Racket getRacketById(Long id) {
        return racketRepository.findByIdWithRacketType(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vợt với ID: " + id));
    }

    @Transactional
    public Racket createRacket(Racket racket, Long racketTypeId) {
        RacketType racketType = racketTypeRepository.findById(racketTypeId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy loại vợt với ID: " + racketTypeId));
        racket.setRacketType(racketType);
        Racket savedRacket = racketRepository.save(racket);
        return getRacketById(savedRacket.getId());
    }

    @Transactional
    public Racket updateRacket(Long id, RacketUpdateDTO racketDetails) {
        Racket racket = getRacketById(id);

        if (racketDetails.getName() != null) {
            racket.setName(racketDetails.getName());
        }
        if (racketDetails.getBrand() != null) {
            racket.setBrand(racketDetails.getBrand());
        }
        if (racketDetails.getPrice() != null) {
            racket.setPrice(racketDetails.getPrice());
        }
        if (racketDetails.getImageUrl() != null) {
            racket.setImageUrl(racketDetails.getImageUrl());
        }
        if (racketDetails.getRacketTypeId() != null) {
            RacketType racketType = racketTypeRepository.findById(racketDetails.getRacketTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy loại vợt với ID: " + racketDetails.getRacketTypeId()));
            racket.setRacketType(racketType);
        }

        Racket savedRacket = racketRepository.save(racket);
        return getRacketById(savedRacket.getId());
    }

    @Transactional
    public void deleteRacket(Long id) {
        Racket racket = getRacketById(id);
        try {
            racketRepository.deleteTimeSlots1ByRacket(id);
            racketRepository.deleteDays1ByRacket(id);
            racketRepository.delete(racket);
        } catch (Exception e) {
            throw new RuntimeException("Không thể xóa vợt: " + e.getMessage());
        }
    }

    public Page<Racket> getPaginatedRackets(Pageable pageable) {
        return racketRepository.findAll(pageable);
    }

    public Page<Racket> getPaginatedRacketsByType(Long racketTypeId, Pageable pageable) {
        return racketRepository.findByRacketTypeId(racketTypeId, pageable);
    }
} 