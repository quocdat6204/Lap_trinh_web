package Spring.API.qdb.service;

import Spring.API.qdb.dto.Day1DTO;
import Spring.API.qdb.exception.ResourceNotFoundException;
import Spring.API.qdb.model.Day1;
import Spring.API.qdb.model.Racket;
import Spring.API.qdb.repository.Day1Repository;
import Spring.API.qdb.repository.RacketRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class Day1Service {
    private final Day1Repository day1Repository;
    private final RacketRepository racketRepository;

    public Day1Service(Day1Repository day1Repository, RacketRepository racketRepository) {
        this.day1Repository = day1Repository;
        this.racketRepository = racketRepository;
    }

    @Transactional(readOnly = true)
    public List<Day1DTO> getDaysByRacket(Long racketId) {
        return day1Repository.findDay1DtoByRacket(racketId);
    }

    @Transactional(readOnly = true)
    public List<Day1> getAvailableDays(Long racketId) {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(3);
        return day1Repository.findByRacketIdAndDateBetween(racketId, today, endDate);
    }

    @Transactional(readOnly = true)
    public Day1 getDayById(Long id) {
        return day1Repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ngày với ID: " + id));
    }

    public Page<Day1> getPaginatedDaysByRacket(Long racketId, Pageable pageable) {
        return day1Repository.findByRacketId(racketId, pageable);
    }

    @Transactional
    public Day1 createDay(LocalDate date, Long racketId) {
        Racket racket = racketRepository.findById(racketId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy vợt với ID: " + racketId));
        Day1 day = new Day1();
        day.setDate(date);
        day.setRacket(racket);
        return day1Repository.save(day);
    }

    @Transactional
    public void deleteDay(Long id) {
        Day1 day = day1Repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ngày với ID: " + id));
        
        // Với cấu hình cascade = CascadeType.ALL và orphanRemoval = true,
        // các timeSlots1 liên quan sẽ tự động bị xóa
        day1Repository.delete(day);
    }
} 