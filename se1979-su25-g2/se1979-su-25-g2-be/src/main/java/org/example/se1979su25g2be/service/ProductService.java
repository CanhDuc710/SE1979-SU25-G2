package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.dto.ProductDTO;
import org.example.se1979su25g2be.entity.Product;

import java.util.List;

public interface ProductService {
    Product createProduct(ProductDTO dto);
    Product updateProduct(Integer id, ProductDTO dto);
    void deleteProduct(Integer id);
    List<ProductDTO> getAllProductsDTO();
    ProductDTO getProductById(Integer id);
    List<ProductDTO> getNewArrivals();
    List<ProductDTO> getRandomSuggestions(int limit);


}
