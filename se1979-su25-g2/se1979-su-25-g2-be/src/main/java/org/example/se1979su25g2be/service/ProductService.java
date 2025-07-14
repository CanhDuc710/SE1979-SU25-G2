package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.dto.OptionDTO;
import org.example.se1979su25g2be.dto.ProductDTO;
import org.example.se1979su25g2be.dto.ProductCreateDTO;
import org.example.se1979su25g2be.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ProductService {
    Page<ProductDTO> getAllProducts(int page, int size);
    
    // Original methods
    Product createProduct(ProductDTO dto);
    Product updateProduct(Integer id, ProductDTO dto);
    
    // Admin methods
    Product createProduct(ProductCreateDTO dto);
    Product createProductWithImages(ProductCreateDTO dto, List<MultipartFile> images) throws IOException;
    Product updateProduct(Integer id, ProductCreateDTO dto);
    Product updateProductWithImages(Integer id, ProductCreateDTO dto, List<MultipartFile> images) throws IOException;
    Product findById(Integer id);
    
    void deleteProduct(Integer id);
    
    // Search and filtering methods
    Page<ProductDTO> getActiveProductsDTO(String name, int page, int size);
    Page<ProductDTO> getFilteredProducts(String name, String brand, String gender, String material, int page, int size);
    
    ProductDTO getProductById(Integer id);
    List<ProductDTO> getNewArrivals();
    List<ProductDTO> getRandomSuggestions(int limit);
    List<OptionDTO> getAllBrandOptions();
    List<OptionDTO> getAllMaterialOptions();
}
