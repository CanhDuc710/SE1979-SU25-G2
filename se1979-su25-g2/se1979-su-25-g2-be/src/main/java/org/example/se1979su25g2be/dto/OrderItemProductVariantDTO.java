package org.example.se1979su25g2be.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemProductVariantDTO {
    private Integer variantId;
    private Integer productId;
    private String productName;
    private String color;
    private String size;
    private Double unitPrice;
    private String imageUrl;
}