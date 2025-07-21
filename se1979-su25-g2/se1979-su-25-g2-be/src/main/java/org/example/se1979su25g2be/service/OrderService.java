package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.dto.AccountOrderHistory.OrderHistoryDTO;
import org.example.se1979su25g2be.dto.OrderRequestDTO;
import org.example.se1979su25g2be.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    Order createOrder(OrderRequestDTO orderRequest);
    Page<OrderHistoryDTO> getOrdersByUser(Integer userId, String keyword, Pageable pageable);

}