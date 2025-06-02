package org.example.se1979su25g2be.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.se1979su25g2be.dto.OptionDTO;
import org.example.se1979su25g2be.dto.ProductDTO;
import org.example.se1979su25g2be.dto.ProductVariantDTO;
import org.example.se1979su25g2be.entity.Category;
import org.example.se1979su25g2be.entity.Product;
import org.example.se1979su25g2be.entity.ProductImage;
import org.example.se1979su25g2be.entity.ProductVariant;
import org.example.se1979su25g2be.repository.CategoryRepository;
import org.example.se1979su25g2be.repository.ProductRepository;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

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
    public Page<ProductDTO> getActiveProductsDTO(String name, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());

        Specification<Product> spec = Specification.where(isActive())
                .and(nameContains(name));

        Page<Product> productsPage = productRepository.findAll(spec, pageable);

        return productsPage.map(this::toDTO);
    }

    public Page<ProductDTO> getFilteredProducts(String name, String brand, String gender, String material, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());

        Specification<Product> spec = Specification.where(isActive())
                .and(nameContains(name))
                .and(brandEquals(brand))
                .and(genderEquals(gender))
                .and(materialEquals(material));

        Page<Product> productsPage = productRepository.findAll(spec, pageable);

        return productsPage.map(this::toDTO);
    }

    private Specification<Product> isActive() {
        return (root, query, cb) -> cb.isTrue(root.get("isActive"));
    }

    private Specification<Product> nameContains(String name) {
        return (root, query, cb) -> !StringUtils.hasText(name)
                ? cb.conjunction()
                : cb.like(cb.lower(root.get("name")), "%" + name.toLowerCase() + "%");
    }

    private Specification<Product> brandEquals(String brand) {
        return (root, query, cb) -> !StringUtils.hasText(brand)
                ? cb.conjunction()
                : cb.equal(root.get("brand"), brand);
    }

    private Specification<Product> genderEquals(String gender) {
        return (root, query, cb) -> {
            if (!StringUtils.hasText(gender)) return cb.conjunction();
            try {
                Product.Gender genderEnum = Product.Gender.valueOf(gender.toUpperCase());
                return cb.equal(root.get("gender"), genderEnum);
            } catch (IllegalArgumentException e) {
                return cb.disjunction(); // Invalid enum → no match
            }
        };
    }

    private Specification<Product> materialEquals(String material) {
        return (root, query, cb) -> !StringUtils.hasText(material)
                ? cb.conjunction()
                : cb.equal(root.get("material"), material);
    }

    private ProductDTO toDTO(Product p) {
        ProductDTO dto = new ProductDTO();
        dto.setProductId(p.getProductId());
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
            dto.setCategoryName(p.getCategory().getName());
        }

        if (p.getImages() != null) {
            List<String> urls = p.getImages().stream()
                    .map(ProductImage::getImageUrl)
                    .collect(Collectors.toList());
            dto.setImageUrls(urls);
        }

        // 💥 Thêm phần này
        if (p.getVariants() != null) {
            List<ProductVariantDTO> variantDTOs = p.getVariants().stream()
                    .filter(ProductVariant::getIsActive)
                    .map(v -> new ProductVariantDTO(
                            v.getVariantId(),
                            v.getColor(),
                            v.getSize(),
                            v.getStockQuantity(),
                            v.getIsActive()
                    ))
                    .collect(Collectors.toList());
            dto.setVariants(variantDTOs);
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
        return productRepository.findTop8ByIsActiveTrueOrderByCreatedAtDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDTO> getRandomSuggestions(int limit) {
        return productRepository.findRandomProducts(limit).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OptionDTO> getAllBrandOptions() {
        return productRepository.findAllDistinctBrands().stream()
                .map(brand -> new OptionDTO(brand, brand))
                .collect(Collectors.toList());
    }

    @Override
    public List<OptionDTO> getAllMaterialOptions() {
        return productRepository.findAllDistinctMaterials().stream()
                .map(material -> new OptionDTO(material, material))
                .collect(Collectors.toList());
    }



}
