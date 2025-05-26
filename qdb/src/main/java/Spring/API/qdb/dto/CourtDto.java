// CourtDto.java
package Spring.API.qdb.dto;

import lombok.Data;

@Data
public class CourtDto {
    private Long id;
    private String name;
    private String address;
    private String imageUrl;
    private String hours;
    private String price;
    private Long courtTypeId;
    private String courtTypeName;
}

// CourtTypeDto.java - đã tạo trước đó
