package org.example.se1979su25g2be.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.se1979su25g2be.entity.Order.PaymentMethod; // Import enum từ Entity Order
import org.example.se1979su25g2be.entity.Order.Status;       // Import enum từ Entity Order

import java.time.LocalDateTime; // Import cho orderDate
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Integer orderId;
    private UserDTO user; // Thông tin người dùng đặt hàng (dùng DTO)
    private List<OrderItemResponse> items; // Danh sách các mặt hàng trong đơn hàng (dùng DTO)
    private String shippingName;
    private String shippingPhone;
    private AddressDTO province; // Thông tin tỉnh (dùng DTO)
    private AddressDTO district; // Thông tin quận/huyện (dùng DTO)
    private AddressDTO ward;     // Thông tin phường/xã (dùng DTO)
    private String shippingAddress; // Địa chỉ chi tiết (số nhà, tên đường)
    private PaymentMethod paymentMethod; // Phương thức thanh toán
    private Status status;           // Trạng thái đơn hàng
    private Double totalAmount;      // Tổng số tiền của đơn hàng
    private LocalDateTime orderDate; // Thời gian đặt hàng
    // Thêm các trường khác nếu có trong Order Entity và Admin cần xem (ví dụ: discountCode, createdAt, updatedAt)
}