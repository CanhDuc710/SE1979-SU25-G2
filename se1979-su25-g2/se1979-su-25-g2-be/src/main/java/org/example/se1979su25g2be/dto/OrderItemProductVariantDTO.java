package org.example.se1979su25g2be.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemProductVariantDTO {
    private Integer variantId;       // ID của biến thể sản phẩm
    private Integer productId;       // ID của sản phẩm cha
    private String productName;      // Tên sản phẩm chính (ví dụ: "Áo Polo Nam")
    private String variantName;      // Tên biến thể (ví dụ: "Đỏ - M", được ghép từ color và size)
    private String color;
    private String size;
    private Double unitPrice;        // Giá gốc của biến thể/sản phẩm tại thời điểm hiện tại (lấy từ Product entity)
    private Integer stockQuantity;   // Tồn kho hiện tại của biến thể
}