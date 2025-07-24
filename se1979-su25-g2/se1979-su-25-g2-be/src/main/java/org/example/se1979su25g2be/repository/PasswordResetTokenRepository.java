package org.example.se1979su25g2be.repository;


import org.example.se1979su25g2be.entity.PasswordResetToken;
import org.example.se1979su25g2be.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    void deleteByUser(User user);
    Optional<PasswordResetToken> findByUserEmailAndOtpAndUsedFalse(String email, String otp);
}
