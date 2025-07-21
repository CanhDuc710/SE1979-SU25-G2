package org.example.se1979su25g2be.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JwtResponseDTO {

    private String token;
    private String type = "Bearer";
    private Integer userId;
    private String username;
    private String email;
    private String roleName;

    public JwtResponseDTO(String token, Integer userId, String username, String email, String roleName) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.roleName = roleName;
    }
}
