package org.example.se1979su25g2be.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CartDTO {
    private String sessionId;
    private List<CartItemDTO> items;
    private BigDecimal totalPrice;

    public CartDTO(List<CartItemDTO> items, BigDecimal total) {
    }

    public CartDTO(String sessionId, List<CartItemDTO> items, BigDecimal totalPrice) {
        this.sessionId = sessionId;
        this.items = items;
        this.totalPrice = totalPrice;
    }

    public CartDTO() {
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public List<CartItemDTO> getItems() {
        return items;
    }

    public void setItems(List<CartItemDTO> items) {
        this.items = items;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }
}
