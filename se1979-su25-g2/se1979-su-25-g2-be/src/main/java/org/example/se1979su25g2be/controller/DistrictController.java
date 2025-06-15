package org.example.se1979su25g2be.controller;

import org.example.se1979su25g2be.entity.District;
import org.example.se1979su25g2be.service.DistrictService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/districts")
public class DistrictController {
    private final DistrictService districtService;

    public DistrictController(DistrictService districtService) {
        this.districtService = districtService;
    }

    @GetMapping("/by-province/{provinceId}")
    public List<District> getDistrictsByProvince(@PathVariable Integer provinceId) {
        return districtService.getDistrictsByProvince(provinceId);
    }
}