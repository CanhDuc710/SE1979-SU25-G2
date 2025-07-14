package org.example.se1979su25g2be.repository;

import org.example.se1979su25g2be.entity.District;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DistrictRepository extends JpaRepository<District, Integer> {
    District findByName(String name);
    boolean existsByName(String name);
    List<District> findByProvince_ProvinceId(Integer provinceId);

}