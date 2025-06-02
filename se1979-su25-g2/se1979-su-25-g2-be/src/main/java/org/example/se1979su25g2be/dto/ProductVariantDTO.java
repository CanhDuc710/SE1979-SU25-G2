package org.example.se1979su25g2be.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class ProductVariantDTO {
    private Integer variantId;
    private String color;
    private String size;
    private Integer stockQuantity;
    private Boolean isActive;

    public ProductVariantDTO(){

    }

    public ProductVariantDTO(Integer variantId, String color, String size, Integer stockQuantity, Boolean isActive) {
        this.variantId = variantId;
        this.color = color;
        this.size = size;
        this.stockQuantity = stockQuantity;
        this.isActive = isActive;
    }

    public Integer getVariantId() {
        return variantId;
    }

    public void setVariantId(Integer variantId) {
        this.variantId = variantId;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean active) {
        isActive = active;
    }
}

