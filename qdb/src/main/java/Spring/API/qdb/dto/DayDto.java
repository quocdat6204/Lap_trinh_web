package Spring.API.qdb.dto;

import java.time.LocalDate;

public class DayDto {
    private Long id;
    private LocalDate date;
    private Long courtId;

    public DayDto(Long id, LocalDate date, Long courtId) {
        this.id = id;
        this.date = date;
        this.courtId = courtId;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Long getCourtId() {
        return courtId;
    }

    public void setCourtId(Long courtId) {
        this.courtId = courtId;
    }
} 