package org.example.se1979su25g2be.controller;

import lombok.RequiredArgsConstructor;
import org.example.se1979su25g2be.dto.DiscountDTO;
import org.example.se1979su25g2be.service.DiscountService;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/discounts")
@RequiredArgsConstructor
@CrossOrigin("*")
public class DiscountController {

    private final DiscountService discountService;

    @GetMapping
    public Page<DiscountDTO> getAll(
            @RequestParam(required = false) String sortBy,
            @RequestParam(defaultValue = "asc") String direction,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return discountService.getAllWithPagination(sortBy, direction, page, size);
    }


    @GetMapping("/code/{code}")
    public DiscountDTO getByCode(@PathVariable String code) {
        return discountService.getByCode(code);
    }

    @PostMapping
    public DiscountDTO create(@RequestBody DiscountDTO dto) {
        return discountService.create(dto);
    }

    @PutMapping("/{id}")
    public DiscountDTO update(@PathVariable Integer id, @RequestBody DiscountDTO dto) {
        return discountService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        discountService.delete(id);
    }

    @GetMapping("/filter")
    public List<DiscountDTO> filter(
            @RequestParam(required = false) BigDecimal min,
            @RequestParam(required = false) BigDecimal max) {
        return discountService.filter(min, max);
    }

    @GetMapping("/search")
    public Page<DiscountDTO> searchDiscounts(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) BigDecimal minValue,
            @RequestParam(required = false) BigDecimal maxValue,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "discountId") String sortBy,
            @RequestParam(defaultValue = "asc") String direction
    ) {
        return discountService.search(code, minValue, maxValue, page, size, sortBy, direction);
    }

}
