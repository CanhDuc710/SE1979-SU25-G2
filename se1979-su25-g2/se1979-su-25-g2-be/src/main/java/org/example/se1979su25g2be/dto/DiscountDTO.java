package org.example.se1979su25g2be.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiscountDTO {
    private Integer discountId;
    private String code;
    private String description;
    private BigDecimal discountPercent;
    private BigDecimal maxDiscountAmount;
    private BigDecimal minOrderValue;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isActive;
}
