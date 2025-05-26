package Spring.API.qdb.dto;

import Spring.API.qdb.model.BookingType;
import Spring.API.qdb.model.BookingStatus;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
public class BookingDTO {
    private Long id;
    private LocalDateTime bookingDate;
    private Double totalPrice;
    private Long userId;
    private BookingType bookingType;
    private Set<Long> timeSlotIds;
    private Set<Long> timeSlot1Ids;
    private BookingStatus status;
    private String itemName;
    private java.time.LocalDate itemDate;
    private String itemTime;
} 