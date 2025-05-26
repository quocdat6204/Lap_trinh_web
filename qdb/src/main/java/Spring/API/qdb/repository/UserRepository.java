package Spring.API.qdb.repository;

import Spring.API.qdb.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);  // Kiểm tra username đã tồn tại chưa
    User findByUsername(String username);       // Tìm user theo username
    Page<User> findAll(Pageable pageable);      // Lấy danh sách user có phân trang
    
    @Query("SELECT u FROM User u WHERE u.role != 'ADMIN'")
    Page<User> findAllNonAdminUsers(Pageable pageable);
}