package org.example.se1979su25g2be.repository;

import org.example.se1979su25g2be.entity.Province;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProvinceRepository extends JpaRepository<Province, Integer> {
    Province findByName(String name);
    boolean existsByName(String name);
}