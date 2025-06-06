package org.example.se1979su25g2be.dto.Account;

public record UpdateProfileDTO(
        Integer userId,
        String firstName,
        String lastName,
        String username,
        String email,
        String phoneNumber,
        String address,
        String gender,
        String dob,
        String role,
        String status,
        String fullName) {
}
