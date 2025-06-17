package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.dto.OrderRequestDTO;
import org.example.se1979su25g2be.entity.Order;

public interface OrderService {
    Order createOrder(OrderRequestDTO orderRequest);
}