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
@Table(name = "court_types")
public class CourtType {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @OrderBy("id ASC")
    @OneToMany(mappedBy = "courtType", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private Set<Court> courts = new HashSet<>();
}
