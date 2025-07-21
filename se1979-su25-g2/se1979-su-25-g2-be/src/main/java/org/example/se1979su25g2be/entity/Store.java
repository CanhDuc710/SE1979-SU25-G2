package org.example.se1979su25g2be.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "store")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Store {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "store_name", nullable = false)
    @NotNull(message = "Store name cannot be null")
    @Size(min = 2, max = 50, message = "Store name must be between 3 and 50 characters")
    private String storeName;

    @Email(message = "Invalid email format")
    private String email;

    private String fanpage;

    @Size(max = 15, message = "Phone number must be at most 15 characters")
    private String phone;

    private String address;

    @Size(max = 500, message = "Description must be less than 500 characters")
    private String description;

    private String logo;
}
