package org.example.se1979su25g2be.dto.Account;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@Data
@NoArgsConstructor
@Builder
public class StaffAccountDTO {
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String password;
    private String phone;
    private String gender;
    private LocalDate dob;
    private String role;
}
