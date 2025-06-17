package org.example.se1979su25g2be.repository;

import org.example.se1979su25g2be.entity.Product;
import org.example.se1979su25g2be.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {
    List<ProductImage> findByProduct(Product product);
    void deleteByProduct(Product product);
}
