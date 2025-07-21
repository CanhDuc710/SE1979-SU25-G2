package org.example.se1979su25g2be.controller;

import lombok.RequiredArgsConstructor;
import org.example.se1979su25g2be.entity.Banner;
import org.example.se1979su25g2be.service.setting.SettingService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/setting/banners")
@RequiredArgsConstructor
@CrossOrigin("*")
public class BannerController {
    private final SettingService settingService;

    @GetMapping
    public List<Banner> getActiveBanners() {
        return settingService.getActiveBanners();
    }

    @PostMapping
    public Banner uploadBanner(
            @RequestParam("file") MultipartFile file,
                    @RequestParam(value = "id", required = false) Long id
    ) throws IOException {
        return settingService.updateBannerImage(file, id);
    }


    @DeleteMapping("/{id}")
    public void deleteBanner(@PathVariable Long id) {
        settingService.deleteBanner(id);
    }
}
