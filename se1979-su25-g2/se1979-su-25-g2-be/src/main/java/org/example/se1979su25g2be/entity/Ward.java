package org.example.se1979su25g2be.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "wards")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ward {
    @Id
    private Integer wardId;

    @ManyToOne
    @JoinColumn(name = "district_id")
    private District district;

    @Column(length = 100, nullable = false)
    private String name;
}