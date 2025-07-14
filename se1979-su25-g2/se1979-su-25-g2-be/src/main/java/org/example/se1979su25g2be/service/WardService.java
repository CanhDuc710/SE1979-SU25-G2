package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.entity.Ward;
import org.example.se1979su25g2be.repository.WardRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WardService {
    private final WardRepository wardRepository;

    public WardService(WardRepository wardRepository) {
        this.wardRepository = wardRepository;
    }

    public List<Ward> getWardsByDistrict(Integer districtId) {
        return wardRepository.findByDistrict_DistrictId(districtId);
    }
}