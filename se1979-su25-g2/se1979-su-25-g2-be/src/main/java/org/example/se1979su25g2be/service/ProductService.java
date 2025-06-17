package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.dto.OptionDTO;
import org.example.se1979su25g2be.dto.ProductDTO;
import org.example.se1979su25g2be.entity.Product;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProductService {
    Page<ProductDTO> getAllProducts(int page, int size);

    Product createProduct(ProductDTO dto);
    Product updateProduct(Integer id, ProductDTO dto);
    void deleteProduct(Integer id);

    // ✅ Cũ: Search by name + isActive + pagination
    Page<ProductDTO> getActiveProductsDTO(String name, int page, int size);

    // ✅ Mới: Filter nâng cao (name + brand + gender + material + isActive + pagination)
    Page<ProductDTO> getFilteredProducts(String name, String brand, String gender, String material, int page, int size);

    ProductDTO getProductById(Integer id);
    List<ProductDTO> getNewArrivals();
    List<ProductDTO> getRandomSuggestions(int limit);
    List<OptionDTO> getAllBrandOptions();
    List<OptionDTO> getAllMaterialOptions();


}
