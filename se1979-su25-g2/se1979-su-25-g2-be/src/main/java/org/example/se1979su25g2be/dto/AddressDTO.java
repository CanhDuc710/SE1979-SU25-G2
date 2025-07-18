package org.example.se1979su25g2be.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressDTO {
    private Integer id;   // ID của đơn vị hành chính (provinceId, districtId, wardId)
    private String name;  // Tên của đơn vị hành chính (ví dụ: "Hà Nội", "Đống Đa", "Láng Hạ")
}