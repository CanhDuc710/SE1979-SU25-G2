package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.dto.DiscountDTO;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.util.List;

public interface DiscountService {
    Page<DiscountDTO> getAllWithPagination(String sortBy, String direction, int page, int size);

    DiscountDTO getByCode(String code);
    DiscountDTO create(DiscountDTO dto);
    DiscountDTO update(Integer id, DiscountDTO dto);
    void delete(Integer id);

    List<DiscountDTO> filter(BigDecimal min, BigDecimal max);

    // ✅ Thêm mới hàm có paging + filter
    Page<DiscountDTO> search(
            String code,
            BigDecimal minValue,
            BigDecimal maxValue,
            int page,
            int size,
            String sortBy,
            String direction
    );
}

