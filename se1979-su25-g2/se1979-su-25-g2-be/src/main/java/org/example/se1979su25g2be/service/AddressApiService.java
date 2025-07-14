// AddressApiService.java
package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.dto.ProvinceApiDTO;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class AddressApiService {

    private final RestTemplate restTemplate = new RestTemplate();

    public ProvinceApiDTO[] fetchProvincesWithDistricts() {
        String url = "https://provinces.open-api.vn/api/?depth=3";
        return restTemplate.getForObject(url, ProvinceApiDTO[].class);
    }
}