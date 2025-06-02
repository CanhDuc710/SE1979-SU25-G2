package org.example.se1979su25g2be.dto.Account;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.se1979su25g2be.entity.User;

@AllArgsConstructor
@Data
@NoArgsConstructor
@Builder
public class AccountDTO {
    private Integer userId;
    private String username;
    private String email;
    private String roleName;
    private User.Status status;
}
