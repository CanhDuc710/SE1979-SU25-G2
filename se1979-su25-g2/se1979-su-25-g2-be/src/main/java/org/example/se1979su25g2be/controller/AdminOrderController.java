package org.example.se1979su25g2be.controller;

import lombok.RequiredArgsConstructor;
import org.example.se1979su25g2be.dto.OrderResponse;
import org.example.se1979su25g2be.dto.OrderSummaryResponse;
import org.example.se1979su25g2be.entity.Order;
import org.example.se1979su25g2be.service.AdminOrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/orders")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AdminOrderController {

    @Autowired
    private AdminOrderService adminOrderService;

    @GetMapping
    public ResponseEntity<Page<OrderSummaryResponse>> getAllOrders(Pageable pageable) {
        Page<OrderSummaryResponse> orders = adminOrderService.getAllOrders(pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<OrderSummaryResponse>> searchOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) String searchBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size,
            @RequestParam(defaultValue = "orderDate") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        Page<OrderSummaryResponse> orders = adminOrderService.searchOrders(status, searchTerm, searchBy, page, size, sortBy, direction);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Integer orderId) {
        return adminOrderService.getOrderById(orderId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable Integer orderId,
                                                           @RequestBody String newStatusString) {
        try {
            Order.Status newStatus = Order.Status.valueOf(newStatusString.toUpperCase());
            return adminOrderService.updateOrderStatus(orderId, newStatus)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Integer orderId) {
        try {
            adminOrderService.deleteOrder(orderId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}