package org.example.se1979su25g2be.controller;

import lombok.RequiredArgsConstructor;
import org.example.se1979su25g2be.entity.Banner;
import org.example.se1979su25g2be.entity.Category;
import org.example.se1979su25g2be.service.setting.SettingService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/setting/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")

public class SettingController {
    private final SettingService settingService;

    @GetMapping
    public Page<Category> getCategories(
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return settingService.getAllCategories(keyword, page, size);
    }


    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        return settingService.createCategory(category);
    }

    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable Integer id, @RequestBody Category category) {
        return settingService.updateCategory(id, category);
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Integer id) {
        settingService.deleteCategory(id);
    }

}


