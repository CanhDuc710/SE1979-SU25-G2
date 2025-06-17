package org.example.se1979su25g2be.service;

import jakarta.persistence.EntityNotFoundException;
import org.example.se1979su25g2be.dto.ProductVariantDTO;
import org.example.se1979su25g2be.entity.Product;
import org.example.se1979su25g2be.entity.ProductVariant;
import org.example.se1979su25g2be.repository.ProductVariantRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProductVariantServiceImpl implements ProductVariantService {
    
    private final ProductVariantRepository productVariantRepository;
    
    public ProductVariantServiceImpl(ProductVariantRepository productVariantRepository) {
        this.productVariantRepository = productVariantRepository;
    }

    @Override
    public ProductVariant createVariant(Product product, ProductVariantDTO variantDTO) {
        ProductVariant variant = ProductVariant.builder()
                .product(product)
                .color(variantDTO.getColor())
                .size(variantDTO.getSize())
                .stockQuantity(variantDTO.getStockQuantity())
                .isActive(variantDTO.getIsActive() != null ? variantDTO.getIsActive() : true)
                .build();
        
        return productVariantRepository.save(variant);
    }

    @Override
    public ProductVariant updateVariant(Integer id, ProductVariantDTO variantDTO) {
        ProductVariant variant = productVariantRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product variant not found"));
        
        variant.setColor(variantDTO.getColor());
        variant.setSize(variantDTO.getSize());
        variant.setStockQuantity(variantDTO.getStockQuantity());
        variant.setIsActive(variantDTO.getIsActive());
        
        return productVariantRepository.save(variant);
    }

    @Override
    public void deleteVariant(Integer id) {
        productVariantRepository.deleteById(id);
    }

    @Override
    @Transactional
    public List<ProductVariant> createVariantsForProduct(Product product, List<ProductVariantDTO> variants) {
        if (variants == null || variants.isEmpty()) {
            return List.of();
        }
        
        List<ProductVariant> productVariants = variants.stream()
                .map(variantDTO -> createVariant(product, variantDTO))
                .collect(Collectors.toList());
        
        return productVariants;
    }

    @Override
    @Transactional
    public void updateVariantsForProduct(Product product, List<ProductVariantDTO> variants) {
        if (variants == null) {
            return;
        }
        
        // Get existing variants for comparison
        List<ProductVariant> existingVariants = productVariantRepository.findByProduct(product);
        Map<Integer, ProductVariant> existingVariantMap = existingVariants.stream()
                .collect(Collectors.toMap(ProductVariant::getVariantId, v -> v));
        
        List<ProductVariant> toCreate = new ArrayList<>();
        List<ProductVariant> toUpdate = new ArrayList<>();
        List<Integer> keepVariantIds = new ArrayList<>();
        
        for (ProductVariantDTO variantDTO : variants) {
            if (variantDTO.getVariantId() == null) {
                // New variant
                toCreate.add(ProductVariant.builder()
                        .product(product)
                        .color(variantDTO.getColor())
                        .size(variantDTO.getSize())
                        .stockQuantity(variantDTO.getStockQuantity())
                        .isActive(variantDTO.getIsActive() != null ? variantDTO.getIsActive() : true)
                        .build());
            } else {
                // Update existing variant
                ProductVariant existingVariant = existingVariantMap.get(variantDTO.getVariantId());
                if (existingVariant != null) {
                    existingVariant.setColor(variantDTO.getColor());
                    existingVariant.setSize(variantDTO.getSize());
                    existingVariant.setStockQuantity(variantDTO.getStockQuantity());
                    existingVariant.setIsActive(variantDTO.getIsActive());
                    toUpdate.add(existingVariant);
                    keepVariantIds.add(variantDTO.getVariantId());
                }
            }
        }
        
        // Delete variants that are no longer in the list
        List<ProductVariant> toDelete = existingVariants.stream()
                .filter(v -> !keepVariantIds.contains(v.getVariantId()))
                .collect(Collectors.toList());
        
        productVariantRepository.saveAll(toCreate);
        productVariantRepository.saveAll(toUpdate);
        productVariantRepository.deleteAll(toDelete);
    }
}
