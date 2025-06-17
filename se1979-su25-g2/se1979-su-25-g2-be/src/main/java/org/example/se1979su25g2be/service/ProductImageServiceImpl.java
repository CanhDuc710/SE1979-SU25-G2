package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.entity.Product;
import org.example.se1979su25g2be.entity.ProductImage;
import org.example.se1979su25g2be.repository.ProductImageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductImageServiceImpl implements ProductImageService {
    
    private final ProductImageRepository productImageRepository;
    private final LocalImageService localImageService;
    
    public ProductImageServiceImpl(ProductImageRepository productImageRepository, LocalImageService localImageService) {
        this.productImageRepository = productImageRepository;
        this.localImageService = localImageService;
    }
    
    @Override
    public ProductImage addImageToProduct(Product product, String imageUrl, boolean isMain) {
        ProductImage image = new ProductImage();
        image.setProduct(product);
        image.setImageUrl(imageUrl);
        image.setMain(isMain);
        return productImageRepository.save(image);
    }
    
    @Override
    @Transactional
    public List<ProductImage> addImagesToProduct(Product product, List<MultipartFile> files) throws IOException {
        List<ProductImage> savedImages = new ArrayList<>();
        
        if (files == null || files.isEmpty()) {
            return savedImages;
        }
        
        // Make the first image the main one if no other main image exists
        boolean hasMainImage = productImageRepository.findByProduct(product).stream()
                .anyMatch(ProductImage::isMain);
        
        for (int i = 0; i < files.size(); i++) {
            MultipartFile file = files.get(i);
            String imageUrl = localImageService.saveImage(file);
            boolean isMain = !hasMainImage && i == 0;
            
            ProductImage image = new ProductImage();
            image.setProduct(product);
            image.setImageUrl(imageUrl);
            image.setMain(isMain);
            
            savedImages.add(productImageRepository.save(image));
            
            if (isMain) {
                hasMainImage = true;
            }
        }
        
        return savedImages;
    }
    
    @Override
    public void deleteImage(Integer imageId) {
        productImageRepository.deleteById(imageId);
    }
    
    @Override
    @Transactional
    public void deleteAllImagesForProduct(Product product) {
        productImageRepository.deleteByProduct(product);
    }
}
