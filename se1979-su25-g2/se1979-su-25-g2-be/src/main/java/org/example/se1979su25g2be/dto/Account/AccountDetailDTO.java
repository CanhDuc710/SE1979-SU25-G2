package org.example.se1979su25g2be.dto.Account;
import lombok.*;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AccountDetailDTO {
    private Integer userId;
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String phoneNumber;
    private String address;
    private String sex;
    private String dob;
    private String role;
    private String status;
    private String fullName;

}
