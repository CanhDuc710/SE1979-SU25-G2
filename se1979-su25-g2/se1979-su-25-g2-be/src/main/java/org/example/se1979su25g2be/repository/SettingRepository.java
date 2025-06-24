package org.example.se1979su25g2be.repository;

import org.example.se1979su25g2be.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SettingRepository extends JpaRepository<Category, Integer> {
    Page<Category> findByNameContainingIgnoreCase(String keyword, Pageable pageable);
    boolean existsByNameIgnoreCase(String name);
}
