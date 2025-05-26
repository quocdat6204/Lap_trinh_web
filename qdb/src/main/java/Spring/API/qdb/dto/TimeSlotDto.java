package Spring.API.qdb.dto;

import java.time.LocalTime;

public class TimeSlotDto {
    private Long id;
    private LocalTime startTime;
    private LocalTime endTime;
    private boolean isBooked;
    private Long dayId;
    private Long bookingId;

    public TimeSlotDto(Long id, LocalTime startTime, LocalTime endTime, boolean isBooked, Long dayId, Long bookingId) {
        this.id = id;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isBooked = isBooked;
        this.dayId = dayId;
        this.bookingId = bookingId;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public boolean isBooked() {
        return isBooked;
    }

    public void setBooked(boolean booked) {
        isBooked = booked;
    }

    public Long getDayId() {
        return dayId;
    }

    public void setDayId(Long dayId) {
        this.dayId = dayId;
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }
} 