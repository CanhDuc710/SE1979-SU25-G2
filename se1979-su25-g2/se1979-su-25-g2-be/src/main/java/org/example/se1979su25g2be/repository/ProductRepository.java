package org.example.se1979su25g2be.repository;

import org.example.se1979su25g2be.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    Optional<Product> findByProductCode(String productCode);
    List<Product> findTop5ByIsActiveTrueOrderByCreatedAtDesc();
    @Query(value = "SELECT * FROM products WHERE is_active = true ORDER BY RAND() LIMIT :limit", nativeQuery = true)
    List<Product> findRandomProducts(@Param("limit") int limit);
}
