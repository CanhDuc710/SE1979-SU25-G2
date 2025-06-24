package org.example.se1979su25g2be.controller;

import org.example.se1979su25g2be.entity.Faq;
import org.example.se1979su25g2be.service.FaqService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/faqs")
@CrossOrigin("*")
public class FaqController {

    private final FaqService faqService;

    public FaqController(FaqService faqService) {
        this.faqService = faqService;
        faqService.insertSampleFaqsIfEmpty(); // Chạy khi controller khởi tạo
    }

    @GetMapping
    public List<Faq> getAllFaqs() {
        return faqService.getAllFaqs();
    }
}
