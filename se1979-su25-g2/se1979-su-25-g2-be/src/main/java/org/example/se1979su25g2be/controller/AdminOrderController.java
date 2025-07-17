package org.example.se1979su25g2be.controller;

import lombok.RequiredArgsConstructor;
import org.example.se1979su25g2be.dto.OrderResponse;
import org.example.se1979su25g2be.dto.OrderSummaryResponse; // Import DTO mới
import org.example.se1979su25g2be.entity.Order; // Import Order entity để sử dụng enum Status
import org.example.se1979su25g2be.service.AdminOrderService; // Import Interface
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
    private AdminOrderService adminOrderService; // Inject Interface thay vì Implementation cụ thể

    @GetMapping
    public ResponseEntity<Page<OrderSummaryResponse>> getAllOrders(Pageable pageable) {
        Page<OrderSummaryResponse> orders = adminOrderService.getAllOrders(pageable);
        return ResponseEntity.ok(orders); // Trả về 200 OK với danh sách đơn hàng
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
                .map(ResponseEntity::ok) // Nếu tìm thấy, trả về 200 OK
                .orElse(ResponseEntity.notFound().build()); // Nếu không tìm thấy, trả về 404 Not Found
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
            // Xử lý trường hợp chuỗi trạng thái không hợp lệ
            return ResponseEntity.badRequest().body(null);
        } catch (RuntimeException e) {
            // Xử lý các lỗi nghiệp vụ khác từ service
            // Trong thực tế, nên dùng @ControllerAdvice và Custom Exceptions.
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @DeleteMapping("/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Integer orderId) {
        try {
            adminOrderService.deleteOrder(orderId);
            return ResponseEntity.noContent().build(); // 204 No Content (thành công nhưng không trả về nội dung)
        } catch (RuntimeException e) {
            // Xử lý trường hợp không tìm thấy đơn hàng để xóa
            return ResponseEntity.notFound().build();
        }
    }
}