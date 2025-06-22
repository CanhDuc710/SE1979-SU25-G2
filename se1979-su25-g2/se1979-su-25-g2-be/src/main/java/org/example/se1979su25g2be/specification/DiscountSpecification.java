package org.example.se1979su25g2be.specification;

import org.example.se1979su25g2be.entity.Discount;
import org.springframework.data.jpa.domain.Specification;

import jakarta.persistence.criteria.Predicate;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class DiscountSpecification {

    public static Specification<Discount> filter(
            String code,
            BigDecimal minValue,
            BigDecimal maxValue
    ) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (code != null && !code.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("code")), "%" + code.trim().toLowerCase() + "%"));
            }

            if (minValue != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("minOrderValue"), minValue));
            }

            if (maxValue != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("maxDiscountAmount"), maxValue));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
