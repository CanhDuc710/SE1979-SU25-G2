package org.example.se1979su25g2be.controller;

import lombok.RequiredArgsConstructor;
import org.example.se1979su25g2be.entity.BannerConfig;
import org.example.se1979su25g2be.service.setting.SettingService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/setting/banner-config")
@RequiredArgsConstructor
@CrossOrigin("*")
public class BannerConfigController {
    private final SettingService settingService;

    @GetMapping
    public BannerConfig getConfig() {
        return settingService.getBannerConfig();
    }

    @PostMapping
    public BannerConfig saveConfig(@RequestBody BannerConfig config) {
        return settingService.saveBannerConfig(config);
    }
}
