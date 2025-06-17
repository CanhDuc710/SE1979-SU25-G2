package org.example.se1979su25g2be.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantDTO {
    private Integer variantId;
    private String color;
    private String size;
    private Integer stockQuantity;
    private Boolean isActive;
}
