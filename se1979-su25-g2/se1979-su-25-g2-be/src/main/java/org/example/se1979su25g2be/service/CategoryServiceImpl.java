package org.example.se1979su25g2be.service.impl;

import org.example.se1979su25g2be.dto.CategoryDTO;
import org.example.se1979su25g2be.entity.Category;
import org.example.se1979su25g2be.repository.CategoryRepository;
import org.example.se1979su25g2be.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(cat -> new CategoryDTO(cat.getCategoryId(), cat.getName()))
                .toList();
    }

}
