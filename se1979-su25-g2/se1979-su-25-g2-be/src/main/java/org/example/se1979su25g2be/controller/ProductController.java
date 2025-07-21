package org.example.se1979su25g2be.controller;

import jakarta.persistence.EntityNotFoundException;
import org.example.se1979su25g2be.dto.OptionDTO;
import org.example.se1979su25g2be.dto.ProductDTO;
import org.example.se1979su25g2be.entity.Product;
import org.example.se1979su25g2be.entity.ProductImage;
import org.example.se1979su25g2be.repository.ProductImageRepository;
import org.example.se1979su25g2be.repository.ProductRepository;
import org.example.se1979su25g2be.service.LocalImageService;
import org.example.se1979su25g2be.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {

    private final ProductService productService;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final LocalImageService localImageService;

    public ProductController(ProductService productService, ProductRepository productRepository, ProductImageRepository productImageRepository, LocalImageService localImageService) {
        this.productService = productService;
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
        this.localImageService = localImageService;
    }

    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(productService.getAllProducts(page, size));
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody ProductDTO dto) {
        return ResponseEntity.ok(productService.createProduct(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Integer id, @RequestBody ProductDTO dto) {
        return ResponseEntity.ok(productService.updateProduct(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProduct(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @GetMapping("/dto")
    public ResponseEntity<Page<ProductDTO>> getFilteredProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) String material,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "8") int size) {

        Page<ProductDTO> result = productService.getFilteredProducts(name, brand, gender, material, page, size);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/brands")
    public ResponseEntity<List<OptionDTO>> getAllBrandOptions() {
        return ResponseEntity.ok(productService.getAllBrandOptions());
    }

    @GetMapping("/materials")
    public ResponseEntity<List<OptionDTO>> getAllMaterialOptions() {
        return ResponseEntity.ok(productService.getAllMaterialOptions());
    }

    @GetMapping("/new-arrivals")
    public ResponseEntity<List<ProductDTO>> getNewArrivals() {
        return ResponseEntity.ok(productService.getNewArrivals());
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<ProductDTO>> getSuggestions(@RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(productService.getRandomSuggestions(limit));
    }

    @PostMapping("/{productId}/images")
    public ResponseEntity<?> uploadProductImages(@PathVariable Integer productId,
                                                 @RequestParam("files") List<MultipartFile> files) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new EntityNotFoundException("Product not found"));

        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                String imageUrl = localImageService.saveImage(file);
                ProductImage image = new ProductImage();
                image.setProduct(product);
                image.setImageUrl(imageUrl);
                productImageRepository.save(image);
                urls.add(imageUrl);
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Upload failed: " + e.getMessage());
            }
        }

        return ResponseEntity.ok(urls);
    }

    @GetMapping("/active-count")
    public ResponseEntity<Long> getActiveProductsCount() {
        Long count = productRepository.countByIsActiveTrue();
        return ResponseEntity.ok(count);
    }


}
