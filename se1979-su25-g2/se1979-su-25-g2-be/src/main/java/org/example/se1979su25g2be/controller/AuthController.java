package org.example.se1979su25g2be.controller;

import jakarta.validation.Valid;
import org.example.se1979su25g2be.dto.ChangePasswordDTO;
import org.example.se1979su25g2be.dto.EmailRequestDTO;
import org.example.se1979su25g2be.dto.OtpResetRequestDTO;
import org.example.se1979su25g2be.dto.auth.LoginRequestDTO;
import org.example.se1979su25g2be.dto.auth.RegisterRequestDTO;
import org.example.se1979su25g2be.service.AuthService;
import org.example.se1979su25g2be.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private PasswordResetService passwordResetService;

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequestDTO loginRequest) {
        return authService.authenticateUser(loginRequest);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        return authService.registerUser(registerRequest);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@Valid @RequestBody EmailRequestDTO request) {
        passwordResetService.createOtpAndSend(request.getEmail());
        return ResponseEntity.ok("OTP đã được gửi, vui lòng kiểm tra email.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody OtpResetRequestDTO request) {
        passwordResetService.resetPassword(request.getEmail(), request.getOtp(), request.getNewPassword());
        return ResponseEntity.ok("Đặt lại mật khẩu thành công.");
    }

    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> changePassword(
            @Valid @RequestBody ChangePasswordDTO dto) {
        return passwordResetService.changePassword(dto);
    }
}

