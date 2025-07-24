package org.example.se1979su25g2be.service;


import org.example.se1979su25g2be.dto.ChangePasswordDTO;
import org.springframework.http.ResponseEntity;

public interface PasswordResetService {
    ResponseEntity<String> changePassword(ChangePasswordDTO changePasswordDTO);
    void createOtpAndSend(String email);
    void resetPassword(String email, String otp, String newPassword);
}