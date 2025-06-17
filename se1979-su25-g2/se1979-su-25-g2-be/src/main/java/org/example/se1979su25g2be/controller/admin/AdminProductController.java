package org.example.se1979su25g2be.controller.admin;

import org.example.se1979su25g2be.dto.ProductCreateDTO;
import org.example.se1979su25g2be.dto.ProductDTO;
import org.example.se1979su25g2be.dto.ProductVariantDTO;
import org.example.se1979su25g2be.entity.Product;
import org.example.se1979su25g2be.entity.ProductVariant;
import org.example.se1979su25g2be.service.ProductService;
import org.example.se1979su25g2be.service.ProductVariantService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.persistence.EntityNotFoundException;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin("*")
public class AdminProductController {

    private final ProductService productService;
    private final ProductVariantService productVariantService;

    public AdminProductController(ProductService productService, ProductVariantService productVariantService) {
        this.productService = productService;
        this.productVariantService = productVariantService;
    }

    @GetMapping
    public ResponseEntity<Page<ProductDTO>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(productService.getAllProducts(page, size));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> createProduct(@RequestBody ProductCreateDTO productDTO) {
        try {
            Product createdProduct = productService.createProduct(productDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product created successfully");
            response.put("productId", createdProduct.getProductId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to create product: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PostMapping(value = "/with-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> createProductWithImages(
            @RequestPart("product") ProductCreateDTO productDTO,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        try {
            Product createdProduct = productService.createProductWithImages(productDTO, images);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product created successfully");
            response.put("productId", createdProduct.getProductId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IOException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to upload images: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to create product: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateProduct(
            @PathVariable Integer id,
            @RequestBody ProductCreateDTO productDTO) {
        try {
            Product updatedProduct = productService.updateProduct(id, productDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product updated successfully");
            response.put("productId", updatedProduct.getProductId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to update product: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping(value = "/{id}/with-images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> updateProductWithImages(
            @PathVariable Integer id,
            @RequestPart("product") ProductCreateDTO productDTO,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        try {
            Product updatedProduct = productService.updateProductWithImages(id, productDTO, images);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product updated successfully");
            response.put("productId", updatedProduct.getProductId());
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to upload images: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to update product: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteProduct(@PathVariable Integer id) {
        try {
            productService.deleteProduct(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product deleted successfully");
            response.put("productId", id);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to delete product: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    // Product variant management
    @PostMapping("/{productId}/variants")
    public ResponseEntity<Map<String, Object>> addVariant(
            @PathVariable Integer productId,
            @RequestBody ProductVariantDTO variantDTO) {
        try {
            Product product = productService.findById(productId);
            
            ProductVariant variant = productVariantService.createVariant(product, variantDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Variant added successfully");
            response.put("variantId", variant.getVariantId());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to add variant: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @PutMapping("/{productId}/variants/{variantId}")
    public ResponseEntity<Map<String, Object>> updateVariant(
            @PathVariable Integer productId,
            @PathVariable Integer variantId,
            @RequestBody ProductVariantDTO variantDTO) {
        try {
            // Ensure variant belongs to the specified product
            Product product = productService.findById(productId);
            
            variantDTO.setVariantId(variantId);
            ProductVariant variant = productVariantService.updateVariant(variantId, variantDTO);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Variant updated successfully");
            response.put("variantId", variant.getVariantId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to update variant: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    @DeleteMapping("/{productId}/variants/{variantId}")
    public ResponseEntity<Map<String, Object>> deleteVariant(
            @PathVariable Integer productId,
            @PathVariable Integer variantId) {
        try {
            // Ensure product exists
            productService.findById(productId);
            
            productVariantService.deleteVariant(variantId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Variant deleted successfully");
            response.put("variantId", variantId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to delete variant: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
