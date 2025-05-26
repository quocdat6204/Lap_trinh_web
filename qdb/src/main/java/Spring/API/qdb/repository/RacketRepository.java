package Spring.API.qdb.repository;

import Spring.API.qdb.model.Racket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RacketRepository extends JpaRepository<Racket, Long> {
    List<Racket> findByNameContainingOrBrandContaining(String name, String brand);
    List<Racket> findByRacketTypeId(Long racketTypeId);
    
    @Query("SELECT DISTINCT r FROM Racket r LEFT JOIN FETCH r.racketType rt WHERE rt.id = :racketTypeId")
    List<Racket> findByRacketTypeIdWithType(@Param("racketTypeId") Long racketTypeId);

    @Query("SELECT r FROM Racket r LEFT JOIN FETCH r.racketType WHERE r.racketType IS NOT NULL")
    List<Racket> findAllWithRacketType();

    @Query("SELECT r FROM Racket r LEFT JOIN FETCH r.racketType WHERE r.id = :id")
    Optional<Racket> findByIdWithRacketType(@Param("id") Long id);

    @Modifying
    @Query(value = "DELETE FROM time_slots1 WHERE day1_id IN (SELECT id FROM days1 WHERE racket_id = :racketId)", nativeQuery = true)
    void deleteTimeSlots1ByRacket(@Param("racketId") Long racketId);

    @Modifying
    @Query(value = "DELETE FROM days1 WHERE racket_id = :racketId", nativeQuery = true)
    void deleteDays1ByRacket(@Param("racketId") Long racketId);

    Page<Racket> findByRacketTypeId(Long racketTypeId, Pageable pageable);
} 