package org.example.se1979su25g2be.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.se1979su25g2be.entity.Order.Status; // Import enum Status
import java.time.LocalDateTime; // Import cho orderDate

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderSummaryResponse {
    private Integer orderId;       // Mã đơn hàng
    private Long numberOfProducts; // Tổng số sản phẩm trong đơn hàng (tính tổng quantity của các order_items)
    private Double totalAmount;    // Tổng thành tiền của đơn hàng

    private UserDTO customerInfo; // Thông tin người mua (UserDTO)
    private String shippingName;   // Tên người nhận hàng
    private String shippingPhone;  // SĐT người nhận hàng
    private String shippingAddressFull; // Địa chỉ đầy đủ (gồm số nhà, đường, phường, quận, tỉnh)

    private Status status;         // Trạng thái đơn hàng
    private LocalDateTime orderDate; // Ngày đặt hàng
}