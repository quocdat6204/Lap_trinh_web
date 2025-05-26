package Spring.API.qdb.repository;

import Spring.API.qdb.dto.Day1DTO;
import Spring.API.qdb.model.Day1;
import Spring.API.qdb.model.Racket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface Day1Repository extends JpaRepository<Day1, Long> {
    @Query("SELECT new Spring.API.qdb.dto.Day1DTO(d.id, d.date, d.racket.id) FROM Day1 d WHERE d.racket.id = :racketId ORDER BY d.date")
    List<Day1DTO> findDay1DtoByRacket(@Param("racketId") Long racketId);

    List<Day1> findByRacketId(Long racketId);
    List<Day1> findByRacketIdAndDateBetween(Long racketId, LocalDate startDate, LocalDate endDate);
    Page<Day1> findByRacketId(Long racketId, Pageable pageable);
    boolean existsByDateAndRacket(LocalDate date, Racket racket);
} 