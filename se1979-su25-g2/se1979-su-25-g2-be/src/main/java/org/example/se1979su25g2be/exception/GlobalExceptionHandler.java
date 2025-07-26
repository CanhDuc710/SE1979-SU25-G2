package org.example.se1979su25g2be.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException; // Import này để bắt lỗi @Valid
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // Lớp nội bộ để tạo cấu trúc phản hồi lỗi chuẩn
    public static class ErrorResponse {
        private final int status;
        private final String message;
        private final LocalDateTime timestamp;
        private final Map<String, String> errors; // Dùng cho lỗi validation

        public ErrorResponse(int status, String message) {
            this(status, message, null);
        }

        public ErrorResponse(int status, String message, Map<String, String> errors) {
            this.status = status;
            this.message = message;
            this.timestamp = LocalDateTime.now();
            this.errors = errors;
        }

        public int getStatus() { return status; }
        public String getMessage() { return message; }
        public LocalDateTime getTimestamp() { return timestamp; }
        public Map<String, String> getErrors() { return errors; }
    }

    // --- Xử lý lỗi cho Forgot Password (createOtpAndSend) ---
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException ex) {
        // Cần kiểm tra nội dung thông báo để xác định loại lỗi cụ thể nếu dùng chung IllegalArgumentException
        // Tốt hơn là tạo Custom Exceptions như đã thảo luận trước đó.
        if ("Email không tồn tại".equals(ex.getMessage())) {
            ErrorResponse error = new ErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage());
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        }
        // Có thể có các IllegalArgumentException khác nên trả về BAD_REQUEST
        ErrorResponse error = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // --- Xử lý lỗi cho Reset Password (resetPassword) ---
    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalStateException(IllegalStateException ex) {
        // Ở đây là "OTP đã hết hạn"
        ErrorResponse error = new ErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getMessage()); // Hoặc UNAUTHORIZED tùy bạn
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    // Bắt IllegalArgumentException từ resetPassword cho "OTP không hợp lệ hoặc đã dùng"
    // Cần cẩn thận nếu IllegalArgumentException cũng được dùng cho các trường hợp khác.
    // Nếu bạn sử dụng Custom Exception cho "OTP không hợp lệ", nó sẽ rõ ràng hơn.
    // Hiện tại nó đang được xử lý bởi handleIllegalArgumentException ở trên.

    // --- Xử lý lỗi cho Change Password (changePassword) ---
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException ex) {
        // "Mật khẩu hiện tại không đúng"
        ErrorResponse error = new ErrorResponse(HttpStatus.UNAUTHORIZED.value(), ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }

    // --- Xử lý lỗi Validation (@Valid) ---
    // Đây là lỗi khi DTO không hợp lệ (ví dụ: email sai định dạng, mật khẩu quá ngắn)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));

        ErrorResponse errorResponse = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Dữ liệu nhập vào không hợp lệ",
                errors
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }

    // --- Xử lý các lỗi chung khác ---
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        // Log đầy đủ lỗi để debug trên server
        ex.printStackTrace();
        ErrorResponse error = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau."
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}