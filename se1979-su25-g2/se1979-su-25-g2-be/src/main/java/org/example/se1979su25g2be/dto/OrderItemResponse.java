package org.example.se1979su25g2be.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemResponse {
    private Integer orderItemId;
    private OrderItemProductVariantDTO productVariant; // <-- Đã thay đổi ở đây để dùng DTO mới
    private Integer quantity;         // Số lượng sản phẩm trong đơn hàng này
    private Double price;             // Giá của sản phẩm này tại thời điểm đặt hàng (từ OrderItem Entity)
}