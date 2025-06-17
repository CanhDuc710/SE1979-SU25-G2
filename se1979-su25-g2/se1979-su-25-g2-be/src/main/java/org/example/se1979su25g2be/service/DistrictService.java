package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.entity.District;
import org.example.se1979su25g2be.repository.DistrictRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DistrictService {
    private final DistrictRepository districtRepository;

    public DistrictService(DistrictRepository districtRepository) {
        this.districtRepository = districtRepository;
    }

    public List<District> getDistrictsByProvince(Integer provinceId) {
        return districtRepository.findByProvince_ProvinceId(provinceId);
    }
}