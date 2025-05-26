package Spring.API.qdb.dto;

import Spring.API.qdb.model.BookingType;
import lombok.Data;
import java.util.ArrayList;
import java.util.List;

@Data
public class BookingRequestDto {
    private Long userId;
    private BookingType bookingType;
    private List<Long> timeSlotIds = new ArrayList<>();
    private List<Long> timeSlot1Ids = new ArrayList<>();
    private String itemName;
    private java.time.LocalDate itemDate;
    private String itemTime;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<Long> getTimeSlotIds() {
        return timeSlotIds;
    }

    public void setTimeSlotIds(List<Long> timeSlotIds) {
        this.timeSlotIds = timeSlotIds;
    }

    public BookingType getBookingType() {
        return bookingType;
    }

    public void setBookingType(BookingType bookingType) {
        this.bookingType = bookingType;
    }

    public List<Long> getTimeSlot1Ids() {
        return timeSlot1Ids;
    }

    public void setTimeSlot1Ids(List<Long> timeSlot1Ids) {
        this.timeSlot1Ids = timeSlot1Ids;
    }
} 