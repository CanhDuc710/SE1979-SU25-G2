package org.example.se1979su25g2be.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
public class CartItemDTO {
    private Integer variantId;
    private String productName;
    private String color;
    private String size;
    private BigDecimal price;
    private Integer quantity;
    private String imageUrl;

    public Integer getVariantId() {
        return variantId;
    }

    public void setVariantId(Integer variantId) {
        this.variantId = variantId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public CartItemDTO(Integer variantId, String productName, String color, String size, BigDecimal price, Integer quantity, String imageUrl) {
        this.variantId = variantId;
        this.productName = productName;
        this.color = color;
        this.size = size;
        this.price = price;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
    }

    public CartItemDTO() {
    }
}

