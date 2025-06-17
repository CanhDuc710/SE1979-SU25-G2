package org.example.se1979su25g2be.service;

import lombok.RequiredArgsConstructor;
import org.example.se1979su25g2be.dto.DiscountDTO;
import org.example.se1979su25g2be.entity.Discount;
import org.example.se1979su25g2be.repository.DiscountRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiscountServiceImpl implements DiscountService {

    private final DiscountRepository discountRepository;

    private DiscountDTO mapToDTO(Discount d) {
        return DiscountDTO.builder()
                .discountId(d.getDiscountId())
                .code(d.getCode())
                .description(d.getDescription())
                .discountPercent(d.getDiscountPercent())
                .maxDiscountAmount(d.getMaxDiscountAmount())
                .minOrderValue(d.getMinOrderValue())
                .startDate(d.getStartDate())
                .endDate(d.getEndDate())
                .isActive(d.getIsActive())
                .build();
    }

    private Discount mapToEntity(DiscountDTO dto) {
        return Discount.builder()
                .discountId(dto.getDiscountId())
                .code(dto.getCode())
                .description(dto.getDescription())
                .discountPercent(dto.getDiscountPercent())
                .maxDiscountAmount(dto.getMaxDiscountAmount())
                .minOrderValue(dto.getMinOrderValue())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .isActive(dto.getIsActive())
                .build();
    }

    @Override
    public List<DiscountDTO> getAll(String sortBy, String direction) {
        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy != null ? sortBy : "code");
        return discountRepository.findAll(sort)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DiscountDTO getByCode(String code) {
        Discount discount = discountRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Not found"));
        return mapToDTO(discount);
    }

    @Override
    public DiscountDTO create(DiscountDTO dto) {
        if (discountRepository.findByCode(dto.getCode()).isPresent()) {
            throw new RuntimeException("Discount code already exists");
        }
        Discount saved = discountRepository.save(mapToEntity(dto));
        return mapToDTO(saved);
    }

    @Override
    public DiscountDTO update(Integer id, DiscountDTO dto) {
        Discount existing = discountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        existing.setCode(dto.getCode());
        existing.setDescription(dto.getDescription());
        existing.setDiscountPercent(dto.getDiscountPercent());
        existing.setMaxDiscountAmount(dto.getMaxDiscountAmount());
        existing.setMinOrderValue(dto.getMinOrderValue());
        existing.setStartDate(dto.getStartDate());
        existing.setEndDate(dto.getEndDate());
        existing.setIsActive(dto.getIsActive());

        return mapToDTO(discountRepository.save(existing));
    }

    @Override
    public void delete(Integer id) {
        discountRepository.deleteById(id);
    }

    @Override
    public List<DiscountDTO> filter(BigDecimal min, BigDecimal max) {
        return discountRepository.filterByValue(min, max)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
}
