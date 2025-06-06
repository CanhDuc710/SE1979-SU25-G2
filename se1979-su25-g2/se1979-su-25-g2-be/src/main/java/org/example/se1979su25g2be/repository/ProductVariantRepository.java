package org.example.se1979su25g2be.repository;

import org.example.se1979su25g2be.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer> {

    List<ProductVariant> findByProductProductId(Integer productId);
}
