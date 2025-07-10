package org.example.se1979su25g2be.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "banner_config")
@Data
@NoArgsConstructor
public class BannerConfig {
    @Id
    private Long id = 1L;
    private boolean displayBanner;
    private boolean randomize;
    @Column(name = "interval_seconds")
    private int interval;
}
