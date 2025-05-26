package Spring.API.qdb.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data                   // Tự động tạo getter, setter, toString, equals, hashCode
@NoArgsConstructor      // Tạo constructor không tham số
@AllArgsConstructor     // Tạo constructor đầy đủ tham số
@Entity                 // Đánh dấu đây là entity JPA
@Table(name = "users")  // Tên bảng trong cơ sở dữ liệu
public class User {
    
    @Id                                                 // Đánh dấu đây là khóa chính
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increment
    private Long id;
    
    @Column(nullable = false)  // Không cho phép NULL
    private String lastName;
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(nullable = false, unique = true)  // username phải duy nhất
    private String username;
    
    @Column(nullable = false)
    private String password;
    
    // Các trường bổ sung
    private String role = "USER";      // Mặc định role là USER
    private boolean enabled = true;    // Mặc định tài khoản được kích hoạt
}