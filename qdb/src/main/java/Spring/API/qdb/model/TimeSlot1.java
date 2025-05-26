package Spring.API.qdb.model;

// import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "time_slots1")
public class TimeSlot1 {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private LocalTime startTime;
    
    @Column(nullable = false)
    private LocalTime endTime;
    
    @Column(nullable = false)
    private boolean isBooked = false;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "day1_id", nullable = false)
    private Day1 day;

    @Column(name = "booking_id")
    private Long bookingId;

} 