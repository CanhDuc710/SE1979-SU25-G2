package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.dto.DashboardMetricsDTO;
import org.example.se1979su25g2be.dto.OrdersByPeriodDTO;
import org.example.se1979su25g2be.dto.RevenueByPeriodDTO;
import org.example.se1979su25g2be.repository.OrderRepository;
import org.example.se1979su25g2be.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Autowired
    public DashboardServiceImpl(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Override
    public DashboardMetricsDTO getDashboardMetrics() {
        return new DashboardMetricsDTO(
                orderRepository.findMonthlyRevenue(),
                orderRepository.findYearlyRevenue(),
                orderRepository.findMonthlyCompletedOrdersCount(),
                orderRepository.findYearlyCompletedOrdersCount(),
                productRepository.countByIsActiveTrue()
        );
    }
    @Override
    public List<RevenueByPeriodDTO> getRevenueByPeriod(String type) {
        if ("monthly".equalsIgnoreCase(type)) {
            return orderRepository.findMonthlyRevenueGrouped();
        } else if ("yearly".equalsIgnoreCase(type)) {
            return orderRepository.findYearlyRevenueGrouped();
        } else {
            throw new IllegalArgumentException("Type must be either 'monthly' or 'yearly'");
        }
    }

    @Override
    public List<OrdersByPeriodDTO> getCompletedOrdersByPeriod(String type) {
        if ("monthly".equalsIgnoreCase(type)) {
            return orderRepository.findMonthlyCompletedOrders();
        } else if ("yearly".equalsIgnoreCase(type)) {
            return orderRepository.findYearlyCompletedOrders();
        } else {
            throw new IllegalArgumentException("Type must be either 'monthly' or 'yearly'");
        }
    }

    @Override
    public Long getActiveProductsCount() {
        return productRepository.countByIsActiveTrue();
    }
}
