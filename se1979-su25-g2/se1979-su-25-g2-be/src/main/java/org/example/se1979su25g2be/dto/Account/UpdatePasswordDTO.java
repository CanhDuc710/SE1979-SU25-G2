package org.example.se1979su25g2be.dto.Account;

public record UpdatePasswordDTO(
        String currentPassword,
        String newPassword,
        String confirmNewPassword
) {
}
