package org.example.se1979su25g2be.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.se1979su25g2be.dto.ProductDTO;
import org.example.se1979su25g2be.entity.Category;
import org.example.se1979su25g2be.entity.Product;
import org.example.se1979su25g2be.entity.ProductImage;
import org.example.se1979su25g2be.repository.CategoryRepository;
import org.example.se1979su25g2be.repository.ProductRepository;
import org.example.se1979su25g2be.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public Product createProduct(ProductDTO dto) {
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));

        Product product = Product.builder()
                .productCode(dto.getProductCode())
                .name(dto.getName())
                .description(dto.getDescription())
                .category(category)
                .brand(dto.getBrand())
                .material(dto.getMaterial())
                .gender(Product.Gender.valueOf(dto.getGender().toUpperCase()))
                .isActive(dto.getIsActive())
                .price(dto.getPrice())
                .build();

        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Integer id, ProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));

        product.setProductCode(dto.getProductCode());
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setCategory(category);
        product.setBrand(dto.getBrand());
        product.setMaterial(dto.getMaterial());
        product.setGender(Product.Gender.valueOf(dto.getGender().toUpperCase()));
        product.setIsActive(dto.getIsActive());
        product.setPrice(dto.getPrice());

        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Integer id) {
        productRepository.deleteById(id);
    }



    @Override
    public List<ProductDTO> getAllProductsDTO() {
        return productRepository.findAll().stream()
                .map(p -> {
                    ProductDTO dto = new ProductDTO();
                    dto.setProductCode(p.getProductCode());
                    dto.setName(p.getName());
                    dto.setDescription(p.getDescription());
                    dto.setBrand(p.getBrand());
                    dto.setMaterial(p.getMaterial());
                    dto.setGender(p.getGender() != null ? p.getGender().name() : null);
                    dto.setPrice(p.getPrice());
                    dto.setIsActive(p.getIsActive());
                    dto.setCategoryId(p.getCategory() != null ? p.getCategory().getCategoryId() : null);
                    if (p.getImages() != null) {
                        List<String> urls = p.getImages().stream()
                                .map(ProductImage::getImageUrl)
                                .collect(Collectors.toList());
                        dto.setImageUrls(urls);
                    }

                    return dto;
                })
                .collect(Collectors.toList());
    }

    private ProductDTO toDTO(Product p) {
        ProductDTO dto = new ProductDTO();
        dto.setProductCode(p.getProductCode());
        dto.setName(p.getName());
        dto.setDescription(p.getDescription());
        dto.setBrand(p.getBrand());
        dto.setMaterial(p.getMaterial());
        dto.setGender(p.getGender() != null ? p.getGender().name() : null);
        dto.setPrice(p.getPrice());
        dto.setIsActive(p.getIsActive());
        if (p.getCategory() != null) {
            dto.setCategoryId(p.getCategory().getCategoryId());
            dto.setCategoryName(p.getCategory().getName()); // ✅ Gán category name
        }
        if (p.getImages() != null) {
            List<String> urls = p.getImages().stream()
                    .map(ProductImage::getImageUrl)
                    .collect(Collectors.toList());
            dto.setImageUrls(urls);
        }
        return dto;
    }

    @Override
    public ProductDTO getProductById(Integer id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));
        return toDTO(p);
    }

    @Override
    public List<ProductDTO> getNewArrivals() {
        return productRepository.findTop5ByIsActiveTrueOrderByCreatedAtDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getRandomSuggestions(int limit) {
        return productRepository.findRandomProducts(limit).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }





}
