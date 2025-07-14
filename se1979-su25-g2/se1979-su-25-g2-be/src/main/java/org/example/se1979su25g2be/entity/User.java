package org.example.se1979su25g2be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
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

    @Column(length = 50)
    private String firstName;

    @Column(length = 50)
    private String lastName;

    private LocalDate dob;

    @Column(length = 100, unique = true)
    private String email;

    @Column(length = 50, unique = true)
    private String username;

    @Enumerated(EnumType.STRING)
    private Sex sex = Sex.OTHER;

    @Column(length = 255)
    private String passwordHash;

    @Column(length = 20)
    private String phoneNumber;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    @CreationTimestamp
    private java.sql.Timestamp createdAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.INACTIVE;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Address> addresses = new ArrayList<>();

    public enum Sex {
        MALE, FEMALE, OTHER
    }

    public enum Status {
        ACTIVE,
        INACTIVE,
        BANNED
    }
}