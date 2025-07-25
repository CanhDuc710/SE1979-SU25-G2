package org.example.se1979su25g2be.service;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.se1979su25g2be.dto.OptionDTO;
import org.example.se1979su25g2be.dto.ProductDTO;
import org.example.se1979su25g2be.dto.ProductCreateDTO;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductVariantService productVariantService;
    private final ProductImageService productImageService;

    public ProductServiceImpl(ProductRepository productRepository,
                           CategoryRepository categoryRepository,
                           ProductVariantService productVariantService,
                           ProductImageService productImageService) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.productVariantService = productVariantService;
        this.productImageService = productImageService;
    }

    @Override
    public Page<ProductDTO> getAllProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<Product> productPage = productRepository.findAll(pageable);
        return productPage.map(this::toDTO);
    }

    @Override
    @Transactional
    public Product createProduct(ProductCreateDTO dto) {
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

        Product savedProduct = productRepository.save(product);

        // Create variants if any
        if (dto.getVariants() != null && !dto.getVariants().isEmpty()) {
            productVariantService.createVariantsForProduct(savedProduct, dto.getVariants());
        }

        return savedProduct;
    }

    @Override
    @Transactional
    public Product createProductWithImages(ProductCreateDTO dto, List<MultipartFile> images) throws IOException {
        Product product = createProduct(dto);

        // Add images if any
        if (images != null && !images.isEmpty()) {
            productImageService.addImagesToProduct(product, images);
        }

        return product;
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
    @Transactional
    public Product updateProduct(Integer id, ProductCreateDTO dto) {
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

        Product savedProduct = productRepository.save(product);

        // Update variants
        if (dto.getVariants() != null) {
            productVariantService.updateVariantsForProduct(savedProduct, dto.getVariants());
        }

        return savedProduct;
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
    @Transactional
    public Product updateProductWithImages(Integer id, ProductCreateDTO dto, List<MultipartFile> images) throws IOException {
        Product product = updateProduct(id, dto);

        // Add new images if any
        if (images != null && !images.isEmpty()) {
            productImageService.addImagesToProduct(product, images);
        }

        return product;
    }

    @Override
    @Transactional
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

    @Override
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

            // Set main image if available
            p.getImages().stream()
                .filter(ProductImage::isMain)
                .findFirst()
                .ifPresent(mainImage -> dto.setMainImageUrl(mainImage.getImageUrl()));
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

            // Extract available colors and sizes for filtering
            List<String> availableColors = p.getVariants().stream()
                    .filter(ProductVariant::getIsActive)
                    .map(ProductVariant::getColor)
                    .distinct()
                    .collect(Collectors.toList());

            List<String> availableSizes = p.getVariants().stream()
                    .filter(ProductVariant::getIsActive)
                    .map(ProductVariant::getSize)
                    .distinct()
                    .collect(Collectors.toList());

            dto.setAvailableColors(availableColors);
            dto.setAvailableSizes(availableSizes);

            // Calculate total stock
            int totalStock = p.getVariants().stream()
                    .filter(ProductVariant::getIsActive)
                    .mapToInt(ProductVariant::getStockQuantity)
                    .sum();
            dto.setTotalStock(totalStock);
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
    @Override
    public Product findById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with ID: " + id));
    }
}

