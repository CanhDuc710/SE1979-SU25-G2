package org.example.se1979su25g2be.service.setting;

import org.example.se1979su25g2be.entity.Banner;
import org.example.se1979su25g2be.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface SettingService {
    Page<Category> getAllCategories(String keyword, int page, int size);
    Category createCategory(Category category);
    Category updateCategory(Integer id, Category category);
    void deleteCategory(Integer id);
    List<Banner> getActiveBanners();
    Banner saveBanner(MultipartFile file) throws IOException;
    void deleteBanner(Long id);
    Banner updateBannerImage(MultipartFile file, Long id) throws IOException;

}
