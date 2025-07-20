package org.example.se1979su25g2be.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.se1979su25g2be.entity.Order.Status;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderSummaryResponse {
    private Integer orderId;
    private Long numberOfProducts;
    private Double totalAmount;

    private UserDTO customerInfo;
    private String shippingName;
    private String shippingPhone;
    private String shippingAddressFull;

    private Status status;
    private LocalDateTime orderDate;
    private List<OrderItemResponse> items;
}