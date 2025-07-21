package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.dto.DashboardMetricsDTO;
import org.example.se1979su25g2be.dto.OrdersByPeriodDTO;
import org.example.se1979su25g2be.dto.RevenueByPeriodDTO;

import java.util.List;

public interface DashboardService {
    DashboardMetricsDTO getDashboardMetrics();
    List<RevenueByPeriodDTO> getRevenueByPeriod(String type);
    List<OrdersByPeriodDTO> getCompletedOrdersByPeriod(String type);
    Long getActiveProductsCount();
}
