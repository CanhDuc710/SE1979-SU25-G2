package org.example.se1979su25g2be.controller;

import org.example.se1979su25g2be.dto.OrderRequestDTO;
import org.example.se1979su25g2be.dto.AccountOrderHistory.OrderHistoryDTO;
import org.example.se1979su25g2be.entity.Order;
import org.example.se1979su25g2be.service.OrderService;
import org.example.se1979su25g2be.service.VNPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final VNPayService vnPayService;

    @Autowired
    public OrderController(OrderService orderService, VNPayService vnPayService) {
        this.orderService = orderService;
        this.vnPayService = vnPayService;
    }

    @PostMapping
    public Order createOrder(@RequestBody OrderRequestDTO orderRequest) {
        return orderService.createOrder(orderRequest);
    }

    @PostMapping("/vnpay")
    public ResponseEntity<Map<String, String>> createVNPayPayment(
            @RequestBody OrderRequestDTO orderRequest,
            HttpServletRequest request) {
        try {
            System.out.println("Received VNPay payment request: " + orderRequest);
            System.out.println("Payment method: " + orderRequest.getPaymentMethod());
            System.out.println("Final total: " + orderRequest.getFinalTotal());

            // Validate input first
            if (orderRequest.getShippingName() == null || orderRequest.getShippingName().trim().isEmpty()) {
                throw new IllegalArgumentException("Shipping name is required");
            }
            if (orderRequest.getShippingPhone() == null || orderRequest.getShippingPhone().trim().isEmpty()) {
                throw new IllegalArgumentException("Shipping phone is required");
            }
            if (orderRequest.getShippingAddress() == null || orderRequest.getShippingAddress().trim().isEmpty()) {
                throw new IllegalArgumentException("Shipping address is required");
            }
            if (orderRequest.getProvinceId() == null || orderRequest.getDistrictId() == null || orderRequest.getWardId() == null) {
                throw new IllegalArgumentException("Province, District, and Ward are required");
            }
            if (orderRequest.getSessionId() == null || orderRequest.getSessionId().trim().isEmpty()) {
                throw new IllegalArgumentException("Session ID is required for guest checkout");
            }

            // Tạo order trước
            Order order = orderService.createOrder(orderRequest);
            System.out.println("Created order with ID: " + order.getOrderId());

            // Tạo URL thanh toán VNPay
            String orderInfo = "Thanh toan don hang " + order.getOrderId(); // Bỏ dấu :
            int amount = order.getTotalAmount().intValue();
            System.out.println("Creating VNPay payment for amount: " + amount);

            String paymentUrl = vnPayService.createOrder(request, amount, orderInfo, "");
            System.out.println("Generated payment URL: " + paymentUrl);

            Map<String, String> response = new HashMap<>();
            response.put("paymentUrl", paymentUrl);
            response.put("orderId", order.getOrderId().toString());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Error creating VNPay payment: " + e.getMessage());
            e.printStackTrace();

            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to create VNPay payment: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/vnpay-return")
    public ResponseEntity<Map<String, Object>> vnpayReturn(HttpServletRequest request) {
        int paymentStatus = vnPayService.orderReturn(request);

        Map<String, Object> response = new HashMap<>();
        response.put("status", paymentStatus);

        if (paymentStatus == 1) {
            response.put("message", "Payment successful");
            response.put("success", true);
        } else if (paymentStatus == 0) {
            response.put("message", "Payment failed");
            response.put("success", false);
        } else {
            response.put("message", "Invalid signature");
            response.put("success", false);
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<OrderHistoryDTO>> getUserOrderHistory(
            @PathVariable Integer userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<OrderHistoryDTO> orders = orderService.getOrdersByUser(userId, keyword, pageable);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            System.err.println("Error fetching user order history: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/user/{userId}/order/{orderId}")
    public ResponseEntity<Order> getUserOrderDetail(
            @PathVariable Integer userId,
            @PathVariable Integer orderId) {
        try {
            Order order = orderService.getUserOrderDetail(userId, orderId);
            return ResponseEntity.ok(order);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            System.err.println("Error fetching user order detail: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/user/{userId}/order/{orderId}/cancel")
    public ResponseEntity<Map<String, String>> cancelUserOrder(
            @PathVariable Integer userId,
            @PathVariable Integer orderId) {
        try {
            orderService.cancelUserOrder(userId, orderId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Order cancelled successfully");
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Order not found");
            return ResponseEntity.status(404).body(errorResponse);
        } catch (IllegalStateException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            System.err.println("Error cancelling order: " + e.getMessage());
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to cancel order");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
