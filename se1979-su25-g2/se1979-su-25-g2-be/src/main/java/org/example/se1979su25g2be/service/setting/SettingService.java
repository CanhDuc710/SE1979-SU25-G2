package org.example.se1979su25g2be.service.setting;

import org.example.se1979su25g2be.entity.Category;
import org.springframework.data.domain.Page;

public interface SettingService {
    Page<Category> getAllCategories(String keyword, int page, int size);
    Category createCategory(Category category);
    Category updateCategory(Integer id, Category category);
    void deleteCategory(Integer id);
}
