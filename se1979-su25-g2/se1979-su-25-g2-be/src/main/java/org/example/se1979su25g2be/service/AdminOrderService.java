package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.dto.OrderResponse;
import org.example.se1979su25g2be.dto.OrderSummaryResponse;
import org.example.se1979su25g2be.entity.Order.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface AdminOrderService {

    Page<OrderSummaryResponse> getAllOrders(Pageable pageable);
    
    Page<OrderSummaryResponse> searchOrders(String status, String searchTerm, String searchBy, int page, int size, String sortBy, String direction);

    Optional<OrderResponse> getOrderById(Integer orderId);

    Optional<OrderResponse> updateOrderStatus(Integer orderId, Status newStatus);

    void deleteOrder(Integer orderId);
}