package org.example.se1979su25g2be.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer userId;

    @NotBlank(message = "Họ không được để trống")
    @Size(max = 50, message = "Họ tối đa 50 ký tự")
    @Column(length = 50, nullable = false)
    private String firstName;

    @NotBlank(message = "Tên không được để trống")
    @Size(max = 50, message = "Tên tối đa 50 ký tự")
    @Column(length = 50, nullable = false)
    private String lastName;

    private LocalDate dob;


    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không hợp lệ")
    @Size(max = 100, message = "Email tối đa 100 ký tự")
    @Column(length = 100, nullable = false, unique = true)
    private String email;

    @NotBlank(message = "Username không được để trống")
    @Size(min = 4, max = 50, message = "Username từ 4–50 ký tự")
    @Pattern(regexp = "^[a-zA-Z0-9_]+$", message = "Username chỉ chứa chữ, số và dấu gạch dưới")
    @Column(length = 50, nullable = false, unique = true)
    private String username;

    @NotNull(message = "Giới tính không được để trống")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Sex sex = Sex.OTHER;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Size(min = 6, max = 255, message = "Mật khẩu tối thiểu 6 ký tự")
    @Column(length = 255, nullable = false)
    private String passwordHash;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^[0-9]{9,11}$", message = "Số điện thoại phải 9–11 chữ số")
    @Column(length = 20, nullable = false)
    private String phoneNumber;

    @NotNull(message = "Role không được để trống")
    @ManyToOne(optional = false)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @CreationTimestamp
    private Timestamp createdAt;

    @NotNull(message = "Status không được để trống")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.INACTIVE;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Address> addresses = new ArrayList<>();

    public enum Sex {
        MALE, FEMALE, OTHER
    }

    public enum Status {
        ACTIVE, INACTIVE, BANNED
    }
}
