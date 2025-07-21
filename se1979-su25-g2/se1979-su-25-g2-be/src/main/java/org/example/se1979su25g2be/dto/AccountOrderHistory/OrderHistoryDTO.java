package org.example.se1979su25g2be.dto.AccountOrderHistory;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderHistoryDTO {
    private Long orderId;
    private String date;
    private String total;
    private String status;
    private List<OrderItemDTO> items;
}
