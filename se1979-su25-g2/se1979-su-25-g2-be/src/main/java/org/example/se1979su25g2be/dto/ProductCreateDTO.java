package org.example.se1979su25g2be.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductCreateDTO {
    private String productCode;
    private String name;
    private String description;
    private Integer categoryId;
    private String brand;
    private String material;
    private String gender;
    private Boolean isActive;
    private BigDecimal price;
    private List<ProductVariantDTO> variants;
}
