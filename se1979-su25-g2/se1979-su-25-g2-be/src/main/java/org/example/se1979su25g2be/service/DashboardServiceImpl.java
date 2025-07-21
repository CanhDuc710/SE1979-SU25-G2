package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.dto.DashboardMetricsDTO;
import org.example.se1979su25g2be.dto.OrdersByPeriodDTO;
import org.example.se1979su25g2be.dto.RevenueByPeriodDTO;
import org.example.se1979su25g2be.repository.DashboardRepository;
import org.example.se1979su25g2be.repository.DashboardRepository;
import org.example.se1979su25g2be.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final DashboardRepository dashboardRepository;
    private final ProductRepository productRepository;

    @Autowired
    public DashboardServiceImpl(DashboardRepository dashboardRepository, ProductRepository productRepository) {
        this.dashboardRepository = dashboardRepository;
        this.productRepository = productRepository;
    }

    @Override
    public DashboardMetricsDTO getDashboardMetrics() {
        return new DashboardMetricsDTO(
                dashboardRepository.findMonthlyRevenue(),
                dashboardRepository.findYearlyRevenue(),
                dashboardRepository.findMonthlyCompletedOrdersCount(),
                dashboardRepository.findYearlyCompletedOrdersCount(),
                productRepository.countByIsActiveTrue()
        );
    }
    @Override
    public List<RevenueByPeriodDTO> getRevenueByPeriod(String type) {
        if ("monthly".equalsIgnoreCase(type)) {
            return dashboardRepository.findMonthlyRevenueGrouped();
        } else if ("yearly".equalsIgnoreCase(type)) {
            return dashboardRepository.findYearlyRevenueGrouped();
        } else {
            throw new IllegalArgumentException("Type must be either 'monthly' or 'yearly'");
        }
    }

    @Override
    public List<OrdersByPeriodDTO> getCompletedOrdersByPeriod(String type) {
        if ("monthly".equalsIgnoreCase(type)) {
            return dashboardRepository.findMonthlyCompletedOrders();
        } else if ("yearly".equalsIgnoreCase(type)) {
            return dashboardRepository.findYearlyCompletedOrders();
        } else {
            throw new IllegalArgumentException("Type must be either 'monthly' or 'yearly'");
        }
    }

    @Override
    public Long getActiveProductsCount() {
        return productRepository.countByIsActiveTrue();
    }
}
