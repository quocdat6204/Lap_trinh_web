package Spring.API.qdb.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "courts")
public class Court {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private String address;
    
    private String imageUrl;
    
    private String hours;  // Giờ hoạt động (VD: "8:00 - 22:00")
    
    private String price;  // Giá thuê (VD: "80.000đ/h")
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "court_type_id", nullable = false)
    @ToString.Exclude
    private CourtType courtType;
    
    @OneToMany(mappedBy = "court", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude
    private Set<Day> days = new HashSet<>();
}
