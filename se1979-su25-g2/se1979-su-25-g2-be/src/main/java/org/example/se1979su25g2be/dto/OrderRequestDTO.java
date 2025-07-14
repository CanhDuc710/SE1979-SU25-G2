package org.example.se1979su25g2be.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequestDTO {
    private Integer userId; // nullable for guest
    private String sessionId; // for guest checkout
    private String shippingName;
    private String shippingPhone;
    private String shippingAddress; // address line (house number, street, etc.)
    private Integer provinceId;
    private Integer districtId;
    private Integer wardId;
    private String paymentMethod;
    private List<OrderItemDTO> items;
}