package org.example.se1979su25g2be.controller;

import org.example.se1979su25g2be.entity.Ward;
import org.example.se1979su25g2be.service.WardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wards")
public class WardController {
    private final WardService wardService;

    public WardController(WardService wardService) {
        this.wardService = wardService;
    }

    @GetMapping("/by-district/{districtId}")
    public List<Ward> getWardsByDistrict(@PathVariable Integer districtId) {
        return wardService.getWardsByDistrict(districtId);
    }
}