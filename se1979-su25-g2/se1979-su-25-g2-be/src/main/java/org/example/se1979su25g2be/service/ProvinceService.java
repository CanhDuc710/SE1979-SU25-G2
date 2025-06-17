package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.entity.Province;
import org.example.se1979su25g2be.repository.ProvinceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProvinceService {
    private final ProvinceRepository provinceRepository;

    public ProvinceService(ProvinceRepository provinceRepository) {
        this.provinceRepository = provinceRepository;
    }

    public List<Province> getAllProvinces() {
        return provinceRepository.findAll();
    }
}