package org.example.se1979su25g2be.repository;

import org.example.se1979su25g2be.entity.Ward;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WardRepository extends JpaRepository<Ward, Integer> {
    Ward findByName(String name);
    boolean existsByName(String name);
    List<Ward> findByDistrict_DistrictId(Integer districtId);
}