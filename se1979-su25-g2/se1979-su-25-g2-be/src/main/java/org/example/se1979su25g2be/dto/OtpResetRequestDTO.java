package org.example.se1979su25g2be.dto;

import lombok.Data;

@Data
public class OtpResetRequestDTO {
    private String email;
    private String otp;
    private String newPassword;
}
