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
@Table(name = "racket_types")
public class RacketType {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false, unique = true)
    private String name;
    
    @OrderBy("id ASC")
    @OneToMany(mappedBy = "racketType", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    private Set<Racket> rackets = new HashSet<>();
}