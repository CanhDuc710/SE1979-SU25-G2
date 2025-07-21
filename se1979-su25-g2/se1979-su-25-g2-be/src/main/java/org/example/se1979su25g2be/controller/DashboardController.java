package org.example.se1979su25g2be.controller;

import org.example.se1979su25g2be.dto.DashboardMetricsDTO;
import org.example.se1979su25g2be.dto.OrdersByPeriodDTO;
import org.example.se1979su25g2be.dto.RevenueByPeriodDTO;
import org.example.se1979su25g2be.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")
public class DashboardController {

    private final DashboardService dashboardService;

    @Autowired
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/metrics")
    public ResponseEntity<DashboardMetricsDTO> getDashboardMetrics() {
        DashboardMetricsDTO metrics = dashboardService.getDashboardMetrics();
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/revenue")
    public ResponseEntity<List<RevenueByPeriodDTO>> getRevenueByPeriod(@RequestParam String type) {
        try {
            List<RevenueByPeriodDTO> revenue = dashboardService.getRevenueByPeriod(type);
            return ResponseEntity.ok(revenue);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/completed-orders")
    public ResponseEntity<List<OrdersByPeriodDTO>> getCompletedOrdersByPeriod(@RequestParam String type) {
        try {
            List<OrdersByPeriodDTO> orders = dashboardService.getCompletedOrdersByPeriod(type);
            return ResponseEntity.ok(orders);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
