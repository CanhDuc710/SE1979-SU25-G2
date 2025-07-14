package org.example.se1979su25g2be.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Integer productId;
    private String productCode;
    private String name;
    private String description;
    private Integer categoryId;
    private String categoryName;
    private String brand;
    private String material;
    private String gender;
    private BigDecimal price;
    private Timestamp createdAt;
    private Boolean isActive;
    
    private String mainImageUrl;
    private List<String> imageUrls;
    private List<String> availableColors;
    private List<String> availableSizes;
    private Integer totalStock;
    private List<ProductVariantDTO> variants;

}
