package org.example.se1979su25g2be.service;

import lombok.RequiredArgsConstructor;
import org.example.se1979su25g2be.dto.CollectionDTO;
import org.example.se1979su25g2be.entity.Collection;
import org.example.se1979su25g2be.entity.Product;
import org.example.se1979su25g2be.repository.CollectionRepository;
import org.example.se1979su25g2be.repository.ProductRepository;
import org.example.se1979su25g2be.service.CollectionService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class CollectionServiceImpl implements CollectionService {

    private final CollectionRepository collectionRepository;
    private final LocalImageService localImageService;
    private final ProductRepository productRepository;

    public CollectionServiceImpl(CollectionRepository collectionRepository, LocalImageService localImageService, ProductRepository productRepository) {
        this.collectionRepository = collectionRepository;
        this.localImageService = localImageService;
        this.productRepository = productRepository;
    }

    @Override
    public List<Collection> getAllCollections() {
        return collectionRepository.findAll();
    }

    @Override
    public Collection getById(Integer id) {
        return collectionRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Collection not found with id: " + id)
        );
    }

    @Override
    public Collection createCollection(CollectionDTO collectionDTO) {
        Collection collection = new Collection();
        collection.setName(collectionDTO.getName());
        collection.setDescription(collectionDTO.getDescription());
        collection.setBannerUrl(collectionDTO.getBannerUrl());
        
        // Initialize with empty list to avoid null pointer
        collection.setProducts(new ArrayList<>());
        
        // Set products if provided
        if (collectionDTO.getProductIds() != null && !collectionDTO.getProductIds().isEmpty()) {
            List<Product> products = productRepository.findAllById(collectionDTO.getProductIds());
            if (products != null && !products.isEmpty()) {
                collection.setProducts(products);
            }
        }
        
        return collectionRepository.save(collection);
    }

    @Override
    public Collection updateCollection(Integer id, CollectionDTO collectionDTO) {
        Collection collection = collectionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Collection not found with id: " + id));
        
        collection.setName(collectionDTO.getName());
        collection.setDescription(collectionDTO.getDescription());
        
        // Update banner URL only if provided
        if (collectionDTO.getBannerUrl() != null) {
            collection.setBannerUrl(collectionDTO.getBannerUrl());
        }
        
        // Update products if provided
        if (collectionDTO.getProductIds() != null) {
            // Initialize with empty list to avoid null pointer
            if (collection.getProducts() == null) {
                collection.setProducts(new ArrayList<>());
            }
            
            // Clear existing products to avoid duplicates
            collection.getProducts().clear();
            
            // Add new products
            if (!collectionDTO.getProductIds().isEmpty()) {
                List<Product> products = productRepository.findAllById(collectionDTO.getProductIds());
                if (products != null && !products.isEmpty()) {
                    collection.getProducts().addAll(products);
                }
            }
        }
        
        return collectionRepository.save(collection);
    }

    @Override
    public void deleteCollection(Integer id) {
        Collection collection = collectionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Collection not found with id: " + id));
        
        // Clear the products association to avoid constraint violations
        if (collection.getProducts() != null) {
            collection.getProducts().clear();
            collectionRepository.save(collection);
        }
        
        // Now delete the collection
        collectionRepository.delete(collection);
    }

    @Override
    public String updateBannerImage(Integer collectionId, MultipartFile file) throws IOException {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bộ sưu tập"));

        // ✅ Dùng service để lưu ảnh và lấy URL
        String imageUrl = localImageService.saveImage(file);

        collection.setBannerUrl(imageUrl);
        collectionRepository.save(collection);

        return imageUrl;
    }
    
    @Override
    public Collection addProductToCollection(Integer collectionId, Integer productId) {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new IllegalArgumentException("Collection not found with id: " + collectionId));
                
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + productId));
        
        // Initialize products list if null
        if (collection.getProducts() == null) {
            collection.setProducts(new ArrayList<>());
        }
        
        // Check if product is already in the collection
        boolean productExists = collection.getProducts().stream()
                .anyMatch(p -> p.getProductId().equals(productId));
                
        if (!productExists) {
            collection.getProducts().add(product);
            return collectionRepository.save(collection);
        }
        
        return collection; // Product already exists in collection
    }
    
    @Override
    public Collection removeProductFromCollection(Integer collectionId, Integer productId) {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new IllegalArgumentException("Collection not found with id: " + collectionId));
        
        // If products list is null or empty, nothing to remove
        if (collection.getProducts() == null || collection.getProducts().isEmpty()) {
            return collection;
        }
        
        // Remove product from collection
        collection.getProducts().removeIf(p -> p.getProductId().equals(productId));
        return collectionRepository.save(collection);
    }

}
