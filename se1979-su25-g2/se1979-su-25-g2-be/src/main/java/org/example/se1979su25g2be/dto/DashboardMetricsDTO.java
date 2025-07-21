package org.example.se1979su25g2be.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardMetricsDTO {
    private Double monthlyRevenue;
    private Double yearlyRevenue;
    private Long monthlyConfirmedOrders;
    private Long yearlyConfirmedOrders;
    private Long activeProductsCount;
}
