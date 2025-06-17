package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.entity.Product;
import org.example.se1979su25g2be.entity.ProductImage;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ProductImageService {
    ProductImage addImageToProduct(Product product, String imageUrl, boolean isMain);
    List<ProductImage> addImagesToProduct(Product product, List<MultipartFile> files) throws IOException;
    void deleteImage(Integer imageId);
    void deleteAllImagesForProduct(Product product);
}
