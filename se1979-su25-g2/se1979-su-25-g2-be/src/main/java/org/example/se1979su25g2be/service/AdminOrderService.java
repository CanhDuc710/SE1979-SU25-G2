package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.dto.OrderResponse;
import org.example.se1979su25g2be.dto.OrderSummaryResponse;
import org.example.se1979su25g2be.entity.Order.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

// Đây là Interface của AdminOrderService
public interface AdminOrderService {

    Page<OrderSummaryResponse> getAllOrders(Pageable pageable);
    
    Page<OrderSummaryResponse> searchOrders(String status, String searchTerm, String searchBy, int page, int size, String sortBy, String direction);

    Optional<OrderResponse> getOrderById(Integer orderId);

    Optional<OrderResponse> updateOrderStatus(Integer orderId, Status newStatus);

    void deleteOrder(Integer orderId);

    // Bạn có thể thêm các phương thức khác vào đây nếu có thêm chức năng quản lý Admin
    // Ví dụ: Optional<OrderResponse> createOrder(OrderRequest orderRequest); // Nếu admin tạo đơn hộ
    // List<OrderSummaryResponse> searchOrders(String keyword, Status status);
}