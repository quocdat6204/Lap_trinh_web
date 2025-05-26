package Spring.API.qdb.repository;

import Spring.API.qdb.model.RacketType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RacketTypeRepository extends JpaRepository<RacketType, Long> {
} 