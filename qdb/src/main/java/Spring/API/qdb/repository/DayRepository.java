package Spring.API.qdb.repository;

import Spring.API.qdb.dto.DayDto;
import Spring.API.qdb.model.Day;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DayRepository extends JpaRepository<Day, Long> {
    @Query("SELECT new Spring.API.qdb.dto.DayDto(d.id, d.date, d.court.id) FROM Day d WHERE d.court.id = :courtId ORDER BY d.date")
    List<DayDto> findDaysDtoByCourt(@Param("courtId") Long courtId);
    
    List<Day> findByCourtId(Long courtId);
    List<Day> findByCourtIdAndDateBetween(Long courtId, LocalDate startDate, LocalDate endDate);
    Page<Day> findByCourtId(Long courtId, Pageable pageable);
}
