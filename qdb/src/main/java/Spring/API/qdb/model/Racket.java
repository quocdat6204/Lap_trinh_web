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
@Table(name = "rackets")
public class Racket {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "brand", nullable = false)
    private String brand;
    
    @Column(name = "price")
    private Double price;      // in dollars
    
    @Column(name = "image_url")
    private String imageUrl;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "racket_type_id", nullable = false)
    @ToString.Exclude
    private RacketType racketType;
    
    @OneToMany(mappedBy = "racket", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @ToString.Exclude
    private Set<Day1> days1 = new HashSet<>();
} 