package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.dto.ProductVariantDTO;
import org.example.se1979su25g2be.entity.Product;
import org.example.se1979su25g2be.entity.ProductVariant;

import java.util.List;

public interface ProductVariantService {
    ProductVariant createVariant(Product product, ProductVariantDTO variantDTO);
    ProductVariant updateVariant(Integer id, ProductVariantDTO variantDTO);
    void deleteVariant(Integer id);
    List<ProductVariant> createVariantsForProduct(Product product, List<ProductVariantDTO> variants);
    void updateVariantsForProduct(Product product, List<ProductVariantDTO> variants);
}
