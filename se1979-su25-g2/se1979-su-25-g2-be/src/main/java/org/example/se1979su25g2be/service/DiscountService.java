package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.dto.DiscountDTO;

import java.math.BigDecimal;
import java.util.List;

public interface DiscountService {
    List<DiscountDTO> getAll(String sortBy, String direction);
    DiscountDTO getByCode(String code);
    DiscountDTO create(DiscountDTO dto);
    DiscountDTO update(Integer id, DiscountDTO dto);
    void delete(Integer id);
    List<DiscountDTO> filter(BigDecimal min, BigDecimal max);
}
