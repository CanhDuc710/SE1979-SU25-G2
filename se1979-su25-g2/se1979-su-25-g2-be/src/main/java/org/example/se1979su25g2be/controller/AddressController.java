// AddressController.java
package org.example.se1979su25g2be.controller;

import org.example.se1979su25g2be.dto.ProvinceApiDTO;
import org.example.se1979su25g2be.service.AddressApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/address")
public class AddressController {

    private final AddressApiService addressApiService;

    @Autowired
    public AddressController(AddressApiService addressApiService) {
        this.addressApiService = addressApiService;
    }

    @GetMapping("/provinces-with-districts")
    public ProvinceApiDTO[] getProvincesWithDistricts() {
        return addressApiService.fetchProvincesWithDistricts();
    }
}