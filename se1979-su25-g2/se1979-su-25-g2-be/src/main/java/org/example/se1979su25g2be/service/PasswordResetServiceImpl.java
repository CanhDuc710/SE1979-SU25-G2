package org.example.se1979su25g2be.service;


import jakarta.transaction.Transactional;
import org.example.se1979su25g2be.dto.ChangePasswordDTO;
import org.example.se1979su25g2be.entity.PasswordResetToken;
import org.example.se1979su25g2be.entity.User;
import org.example.se1979su25g2be.repository.PasswordResetTokenRepository;
import org.example.se1979su25g2be.repository.UserRepository;
import org.example.se1979su25g2be.service.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;
@Service
@RequiredArgsConstructor
public class PasswordResetServiceImpl implements PasswordResetService {
    private static final int OTP_LENGTH = 6;
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void createOtpAndSend(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Email không tồn tại"));
        // Xóa các OTP hiện có của người dùng này để đảm bảo chỉ có một OTP hợp lệ tại một thời điểm.
        tokenRepository.deleteByUser(user);
        String otp = generateNumericOtp();
        PasswordResetToken prt = new PasswordResetToken();
        prt.setOtp(otp);
        prt.setUser(user);
        prt.setExpiryDate(LocalDateTime.now().plusMinutes(5));
        prt.setUsed(false);
        tokenRepository.save(prt);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Mã OTP xác thực đặt lại mật khẩu");
        message.setText("Mã OTP của bạn là: " + otp + "\nHết hạn sau 5 phút.");
        mailSender.send(message);
    }

    @Override
    @Transactional
    public void resetPassword(String email, String otp, String newPassword) {
        PasswordResetToken prt = tokenRepository
                .findByUserEmailAndOtpAndUsedFalse(email, otp)
                .orElseThrow(() -> new IllegalArgumentException("OTP không hợp lệ hoặc đã dùng"));
        if (prt.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("OTP đã hết hạn");
        }
        User user = prt.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        prt.setUsed(true);
        tokenRepository.save(prt);
    }

    private String generateNumericOtp() {
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < OTP_LENGTH; i++) sb.append(random.nextInt(10));
        return sb.toString();
    }



    @Override
    @Transactional
    public ResponseEntity<String> changePassword(ChangePasswordDTO dto) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User không tồn tại"));
        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException("Mật khẩu hiện tại không đúng");
        }
        user.setPasswordHash(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("Đổi mật khẩu thành công.");
    }
}

