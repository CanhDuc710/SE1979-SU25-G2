package org.example.se1979su25g2be.service.setting;

import lombok.RequiredArgsConstructor;
import org.example.se1979su25g2be.entity.Category;
import org.example.se1979su25g2be.repository.SettingRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SettingServiceImpl implements SettingService {

    private final SettingRepository settingRepository;

    @Override
    public Page<Category> getAllCategories(String keyword, int page, int size) {
        return settingRepository.findByNameContainingIgnoreCase(
                keyword,
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "categoryId"))
        );
    }


    @Override
    public Category createCategory(Category category) {
        if (settingRepository.existsByNameIgnoreCase(category.getName())) {
            throw new RuntimeException("Tên danh mục đã tồn tại");
        }
        return settingRepository.save(category);
    }

    @Override
    public Category updateCategory(Integer id, Category newCategory) {
        Category category = settingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục"));

        if (!category.getName().equalsIgnoreCase(newCategory.getName())
                && settingRepository.existsByNameIgnoreCase(newCategory.getName())) {
            throw new RuntimeException("Tên danh mục đã tồn tại");
        }

        category.setName(newCategory.getName());
        category.setDescription(newCategory.getDescription());
        return settingRepository.save(category);
    }

    @Override
    public void deleteCategory(Integer id) {
        Category category = settingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục"));
        if (category.getProducts() != null && !category.getProducts().isEmpty()) {
            throw new RuntimeException("Không thể xoá danh mục có sản phẩm liên kết");
        }
        settingRepository.delete(category);
    }
}
