package Spring.API.qdb.repository;

import Spring.API.qdb.model.CourtType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourtTypeRepository extends JpaRepository<CourtType, Long> {
}
