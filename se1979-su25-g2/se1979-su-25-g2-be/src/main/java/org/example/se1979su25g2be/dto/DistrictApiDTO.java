// DistrictApiDTO.java
package org.example.se1979su25g2be.dto;

import lombok.Data;
import java.util.List;

@Data
public class DistrictApiDTO {
    private String name;
    private Integer code;
    private String codename;
    private String division_type;
    private Integer province_code;
    private List<WardApiDTO> wards;
}