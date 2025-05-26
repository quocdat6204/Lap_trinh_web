package Spring.API.qdb.dto;

import Spring.API.qdb.model.BookingType;
import Spring.API.qdb.model.BookingStatus;
import java.time.LocalDateTime;
import java.util.List;
import Spring.API.qdb.dto.TimeSlotDto;
import Spring.API.qdb.dto.DayDto;
import Spring.API.qdb.dto.TimeSlot1DTO;
import Spring.API.qdb.dto.Day1DTO;

public class BookingDetailsDto {
    private Long id;
    private LocalDateTime bookingDate;
    private Double totalPrice;
    private Long userId;
    private BookingType bookingType;
    private BookingStatus status;
    
    // Court booking information
    private List<TimeSlotDto> timeSlots;
    private String courtName;
    private DayDto day;
    
    // Racket booking information
    private List<TimeSlot1DTO> timeSlot1s;
    private String racketName;
    private Day1DTO day1;

    private String itemName;
    private java.time.LocalDate itemDate;
    private String itemTime;

    public BookingDetailsDto() {
    }

    public BookingDetailsDto(Long id, LocalDateTime bookingDate, Double totalPrice, Long userId, 
                           BookingType bookingType, BookingStatus status,
                           List<TimeSlotDto> timeSlots, String courtName, DayDto day,
                           List<TimeSlot1DTO> timeSlot1s, String racketName, Day1DTO day1) {
        this.id = id;
        this.bookingDate = bookingDate;
        this.totalPrice = totalPrice;
        this.userId = userId;
        this.bookingType = bookingType;
        this.status = status;
        this.timeSlots = timeSlots;
        this.courtName = courtName;
        this.day = day;
        this.timeSlot1s = timeSlot1s;
        this.racketName = racketName;
        this.day1 = day1;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDateTime bookingDate) {
        this.bookingDate = bookingDate;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public BookingType getBookingType() {
        return bookingType;
    }

    public void setBookingType(BookingType bookingType) {
        this.bookingType = bookingType;
    }

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public List<TimeSlotDto> getTimeSlots() {
        return timeSlots;
    }

    public void setTimeSlots(List<TimeSlotDto> timeSlots) {
        this.timeSlots = timeSlots;
    }

    public String getCourtName() {
        return courtName;
    }

    public void setCourtName(String courtName) {
        this.courtName = courtName;
    }

    public DayDto getDay() {
        return day;
    }

    public void setDay(DayDto day) {
        this.day = day;
    }

    public List<TimeSlot1DTO> getTimeSlot1s() {
        return timeSlot1s;
    }

    public void setTimeSlot1s(List<TimeSlot1DTO> timeSlot1s) {
        this.timeSlot1s = timeSlot1s;
    }

    public String getRacketName() {
        return racketName;
    }

    public void setRacketName(String racketName) {
        this.racketName = racketName;
    }

    public Day1DTO getDay1() {
        return day1;
    }

    public void setDay1(Day1DTO day1) {
        this.day1 = day1;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public java.time.LocalDate getItemDate() {
        return itemDate;
    }

    public void setItemDate(java.time.LocalDate itemDate) {
        this.itemDate = itemDate;
    }

    public String getItemTime() {
        return itemTime;
    }

    public void setItemTime(String itemTime) {
        this.itemTime = itemTime;
    }
} 