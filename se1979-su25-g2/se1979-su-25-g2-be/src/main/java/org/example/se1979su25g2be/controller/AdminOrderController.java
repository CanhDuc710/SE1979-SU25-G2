package org.example.se1979su25g2be.controller;

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
@RequestMapping("/api/admin/orders") // Base path cho tất cả các API quản lý đơn hàng của Admin
public class AdminOrderController {

    @Autowired
    private AdminOrderService adminOrderService; // Inject Interface thay vì Implementation cụ thể

    /**
     * API để lấy danh sách tất cả các đơn hàng (có phân trang và sắp xếp).
     * Trả về thông tin tóm tắt.
     * GET /api/admin/orders
     * Ví dụ: /api/admin/orders?page=0&size=10&sort=orderDate,desc
     * @param pageable Đối tượng Pageable tự động được Spring tạo từ các tham số request.
     * @return ResponseEntity chứa Page các OrderSummaryResponse.
     */
    @GetMapping
    public ResponseEntity<Page<OrderSummaryResponse>> getAllOrders(Pageable pageable) {
        Page<OrderSummaryResponse> orders = adminOrderService.getAllOrders(pageable);
        return ResponseEntity.ok(orders); // Trả về 200 OK với danh sách đơn hàng
    }

    /**
     * API để lấy chi tiết một đơn hàng theo ID.
     * Trả về thông tin đầy đủ.
     * GET /api/admin/orders/{orderId}
     * Ví dụ: /api/admin/orders/123
     * @param orderId ID của đơn hàng.
     * @return ResponseEntity chứa OrderResponse nếu tìm thấy, hoặc 404 Not Found nếu không.
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Integer orderId) {
        return adminOrderService.getOrderById(orderId)
                .map(ResponseEntity::ok) // Nếu tìm thấy, trả về 200 OK
                .orElse(ResponseEntity.notFound().build()); // Nếu không tìm thấy, trả về 404 Not Found
    }

    /**
     * API để cập nhật trạng thái của một đơn hàng.
     * PUT /api/admin/orders/{orderId}/status
     * Request Body (JSON): "CONFIRMED" (hoặc "PENDING", "SHIPPED", "DELIVERED", "CANCELLED")
     * @param orderId ID của đơn hàng cần cập nhật.
     * @param newStatusString Trạng thái mới dưới dạng chuỗi.
     * @return ResponseEntity chứa OrderResponse đã cập nhật nếu thành công, hoặc lỗi 4xx/5xx nếu có vấn đề.
     */
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

    /**
     * API để xóa một đơn hàng.
     * DELETE /api/admin/orders/{orderId}
     * @param orderId ID của đơn hàng cần xóa.
     * @return ResponseEntity 204 No Content nếu xóa thành công, hoặc 404 Not Found nếu không.
     */
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