package Spring.API.qdb.dto;

import lombok.Data;

@Data
public class CourtUpdateDto {
    private String name;
    private String address;
    private String imageUrl;
    private String hours;
    private String price;
    private Long courtTypeId;
} 