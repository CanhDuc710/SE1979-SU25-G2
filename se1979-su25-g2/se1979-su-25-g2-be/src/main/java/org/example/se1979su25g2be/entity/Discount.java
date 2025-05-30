package org.example.se1979su25g2be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "discounts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Discount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer discountId;

    @Column(length = 50, unique = true, nullable = false)
    private String code;

    @Lob
    private String description;

    private BigDecimal discountPercent;

    private BigDecimal maxDiscountAmount;

    private BigDecimal minOrderValue;

    private LocalDate startDate;
    private LocalDate endDate;

    private Boolean isActive = true;

    // Constructors, Getters, Setters
}

