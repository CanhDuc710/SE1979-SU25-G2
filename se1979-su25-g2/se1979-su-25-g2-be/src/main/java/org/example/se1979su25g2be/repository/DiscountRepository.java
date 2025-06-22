package org.example.se1979su25g2be.repository;

import org.example.se1979su25g2be.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;


public interface DiscountRepository extends JpaRepository<Discount, Integer>, JpaSpecificationExecutor<Discount> {

    Optional<Discount> findByCode(String code);

    @Query("SELECT d FROM Discount d WHERE " +
            "(:min IS NULL OR d.minOrderValue >= :min) AND " +
            "(:max IS NULL OR d.maxDiscountAmount <= :max)")
    List<Discount> filterByValue(BigDecimal min, BigDecimal max);
}
