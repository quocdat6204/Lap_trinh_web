package Spring.API.qdb.dto;

import java.time.LocalDate;

public class Day1DTO {
    private Long id;
    private LocalDate date;
    private Long racketId;

    public Day1DTO(Long id, LocalDate date, Long racketId) {
        this.id = id;
        this.date = date;
        this.racketId = racketId;
    }

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
    public Long getRacketId() {
        return racketId;
    }
    public void setRacketId(Long racketId) {
        this.racketId = racketId;
    }
} 