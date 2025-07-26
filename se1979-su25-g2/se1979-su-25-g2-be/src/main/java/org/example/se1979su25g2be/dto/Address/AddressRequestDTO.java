package org.example.se1979su25g2be.dto.Address;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddressRequestDTO {
    @NotBlank(message = "Address line is required")
    private String addressLine;

    @NotNull(message = "Province is required")
    private Integer provinceId;

    @NotNull(message = "District is required")
    private Integer districtId;

    @NotNull(message = "Ward is required")
    private Integer wardId;

    private String postalCode;
    private Boolean isDefault = false;
}
