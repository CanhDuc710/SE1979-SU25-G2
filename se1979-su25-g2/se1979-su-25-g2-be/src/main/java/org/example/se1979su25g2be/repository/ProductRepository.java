package org.example.se1979su25g2be.repository;

import org.example.se1979su25g2be.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Integer>, JpaSpecificationExecutor {
    Optional<Product> findByProductCode(String productCode);
    List<Product> findTop8ByIsActiveTrueOrderByCreatedAtDesc();
    @Query(value = "SELECT * FROM products WHERE is_active = true ORDER BY RAND() LIMIT :limit", nativeQuery = true)
    List<Product> findRandomProducts(@Param("limit") int limit);
    Page<Product> findByIsActiveTrueAndNameContainingIgnoreCase(String name, Pageable pageable);
    @Query("SELECT DISTINCT p.brand FROM Product p WHERE p.brand IS NOT NULL")
    List<String> findAllDistinctBrands();
    @Query("SELECT DISTINCT p.material FROM Product p WHERE p.material IS NOT NULL")
    List<String> findAllDistinctMaterials();

    // Count active products
    Long countByIsActiveTrue();
}
