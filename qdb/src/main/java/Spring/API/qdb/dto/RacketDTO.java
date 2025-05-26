package Spring.API.qdb.dto;

import lombok.Data;

@Data
public class RacketDTO{
    private Long id;
    private String name;
    private String brand;
    private Double price;
    private String imageUrl;
    private Long racketTypeId;
    private String racketTypeName;
} 