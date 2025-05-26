package Spring.API.qdb.service;

import Spring.API.qdb.dto.DayDto;
import Spring.API.qdb.exception.ResourceNotFoundException;
import Spring.API.qdb.model.Day;
import Spring.API.qdb.model.Court;
import Spring.API.qdb.repository.DayRepository;
import Spring.API.qdb.repository.CourtRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
// import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.util.List;

@Service
public class DayService {
    
    private final DayRepository dayRepository;
    private final CourtRepository courtRepository;
    
    public DayService(DayRepository dayRepository, CourtRepository courtRepository) {
        this.dayRepository = dayRepository;
        this.courtRepository = courtRepository;
    }
    
    @Transactional(readOnly = true)
    public List<DayDto> getDaysByCourt(Long courtId) {
        return dayRepository.findDaysDtoByCourt(courtId);
    }
    
    @Transactional(readOnly = true)
    public List<Day> getAvailableDays(Long courtId) {
        LocalDate today = LocalDate.now();
        LocalDate endDate = today.plusDays(3); // Lấy 4 ngày từ hiện tại
        return dayRepository.findByCourtIdAndDateBetween(courtId, today, endDate);
    }
    
    @Transactional(readOnly = true)
    public Day getDayById(Long id) {
        return dayRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ngày với ID: " + id));
    }

    public Page<Day> getPaginatedDaysByCourt(Long courtId, Pageable pageable) {
        return dayRepository.findByCourtId(courtId, pageable);
    }

    @Transactional
    public Day createDay(LocalDate date, Long courtId) {
        Court court = courtRepository.findById(courtId)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sân với ID: " + courtId));
        Day day = new Day();
        day.setDate(date);
        day.setCourt(court);
        return dayRepository.save(day);
    }

    @Transactional
    public void deleteDay(Long id) {
        Day day = dayRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy ngày với ID: " + id));
        
        // Với cấu hình cascade = CascadeType.ALL và orphanRemoval = true,
        // các timeSlots liên quan sẽ tự động bị xóa
        dayRepository.delete(day);
    }
}
