package Spring.API.qdb.repository;

import Spring.API.qdb.model.Court;
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
public interface CourtRepository extends JpaRepository<Court, Long> {
    List<Court> findByNameContainingOrAddressContaining(String name, String address);
    List<Court> findByCourtTypeId(Long courtTypeId);
    
    @Query("SELECT DISTINCT c FROM Court c LEFT JOIN FETCH c.courtType ct WHERE ct.id = :courtTypeId")
    List<Court> findByCourtTypeIdWithType(@Param("courtTypeId") Long courtTypeId);

    @Query("SELECT c FROM Court c LEFT JOIN FETCH c.courtType WHERE c.courtType IS NOT NULL")
    List<Court> findAllWithCourtType();

    @Query("SELECT c FROM Court c LEFT JOIN FETCH c.courtType WHERE c.id = :id")
    Optional<Court> findByIdWithCourtType(@Param("id") Long id);

    @Modifying
    @Query(value = "DELETE FROM time_slots WHERE day_id IN (SELECT id FROM days WHERE court_id = :courtId)", nativeQuery = true)
    void deleteTimeSlotsByCourt(@Param("courtId") Long courtId);

    @Modifying
    @Query(value = "DELETE FROM days WHERE court_id = :courtId", nativeQuery = true)
    void deleteDaysByCourt(@Param("courtId") Long courtId);

    Page<Court> findByCourtTypeId(Long courtTypeId, Pageable pageable);
}
