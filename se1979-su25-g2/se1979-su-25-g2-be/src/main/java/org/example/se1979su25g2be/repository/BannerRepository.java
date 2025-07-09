package org.example.se1979su25g2be.repository;

import org.example.se1979su25g2be.entity.Banner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BannerRepository extends JpaRepository<Banner, Long> {
    List<Banner> findByActiveTrue();
}
