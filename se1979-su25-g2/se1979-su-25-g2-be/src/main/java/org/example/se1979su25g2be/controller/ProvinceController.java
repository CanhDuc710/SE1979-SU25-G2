package org.example.se1979su25g2be.controller;

import org.example.se1979su25g2be.entity.Province;
import org.example.se1979su25g2be.service.ProvinceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/provinces")
public class ProvinceController {
    private final ProvinceService provinceService;

    public ProvinceController(ProvinceService provinceService) {
        this.provinceService = provinceService;
    }

    @GetMapping
    public List<Province> getAllProvinces() {
        return provinceService.getAllProvinces();
    }
}