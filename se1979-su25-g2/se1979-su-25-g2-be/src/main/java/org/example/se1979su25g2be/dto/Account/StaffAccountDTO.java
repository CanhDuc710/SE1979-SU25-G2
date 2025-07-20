package org.example.se1979su25g2be.dto.Account;
import jakarta.validation.constraints.*;
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

    @NotBlank(message = "Họ không được để trống")
    @Size(max = 30, message = "Họ tối đa 30 ký tự")
    private String firstName;

    @NotBlank(message = "Tên không được để trống")
    @Size(max = 30, message = "Tên tối đa 30 ký tự")
    private String lastName;

    @NotBlank(message = "Tên tài khoản không được để trống")
    @Size(max = 20, message = "Tên tài khoản tối đa 20 ký tự")
    private String username;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    @Size(max = 50, message = "Email tối đa 50 ký tự")
    private String email;

    private String password;

    @Pattern(regexp = "^\\d{9,20}$", message = "Số điện thoại chỉ được chứa số và tối đa 20 chữ số")
    private String phone;

    @NotBlank(message = "Giới tính không được để trống")
    @Pattern(regexp = "MALE|FEMALE|OTHER", message = "Giới tính phải là MALE, FEMALE hoặc OTHER")
    private String gender;

    private LocalDate dob;

    @NotBlank(message = "Vai trò không được để trống")
    private String role;
}
