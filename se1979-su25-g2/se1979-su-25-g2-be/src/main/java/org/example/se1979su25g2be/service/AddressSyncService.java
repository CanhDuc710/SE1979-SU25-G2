// AddressSyncService.java
package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.dto.ProvinceApiDTO;
import org.example.se1979su25g2be.dto.DistrictApiDTO;
import org.example.se1979su25g2be.dto.WardApiDTO;
import org.example.se1979su25g2be.entity.Province;
import org.example.se1979su25g2be.entity.District;
import org.example.se1979su25g2be.entity.Ward;
import org.example.se1979su25g2be.repository.ProvinceRepository;
import org.example.se1979su25g2be.repository.DistrictRepository;
import org.example.se1979su25g2be.repository.WardRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AddressSyncService {

    private final AddressApiService addressApiService;
    private final ProvinceRepository provinceRepository;
    private final DistrictRepository districtRepository;
    private final WardRepository wardRepository;

    public AddressSyncService(AddressApiService addressApiService,
                              ProvinceRepository provinceRepository,
                              DistrictRepository districtRepository,
                              WardRepository wardRepository) {
        this.addressApiService = addressApiService;
        this.provinceRepository = provinceRepository;
        this.districtRepository = districtRepository;
        this.wardRepository = wardRepository;
    }

    @Transactional
    public void syncProvincesAndDistricts() {
        ProvinceApiDTO[] provinces = addressApiService.fetchProvincesWithDistricts();
        for (ProvinceApiDTO provinceDto : provinces) {
            Province province = provinceRepository.findById(provinceDto.getCode()).orElse(null);
            if (province == null) {
                province = new Province();
                province.setProvinceId(provinceDto.getCode());
            }
            province.setName(provinceDto.getName());
            provinceRepository.save(province);

            for (DistrictApiDTO districtDto : provinceDto.getDistricts()) {
                District district = districtRepository.findById(districtDto.getCode()).orElse(null);
                if (district == null) {
                    district = new District();
                    district.setDistrictId(districtDto.getCode());
                }
                district.setName(districtDto.getName());
                district.setProvince(province);
                districtRepository.save(district);

                // Sync wards
                if (districtDto.getWards() != null) {
                    for (WardApiDTO wardDto : districtDto.getWards()) {
                        Ward ward = wardRepository.findById(wardDto.getCode()).orElse(null);
                        if (ward == null) {
                            ward = new Ward();
                            ward.setWardId(wardDto.getCode());
                        }
                        ward.setName(wardDto.getName());
                        ward.setDistrict(district);
                        wardRepository.save(ward);
                    }
                }
            }
        }
    }
}