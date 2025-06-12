// ProvinceApiDTO.java
package org.example.se1979su25g2be.dto;

import lombok.Data;
import java.util.List;

@Data
public class ProvinceApiDTO {
    private String name;
    private Integer code;
    private String division_type;
    private Integer phone_code;
    private String codename;
    private List<DistrictApiDTO> districts;
}