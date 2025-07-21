package org.example.se1979su25g2be.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RevenueByPeriodDTO {
    private String period; // e.g., "2025-01" for monthly, "2025" for yearly
    private Double revenue;
}
