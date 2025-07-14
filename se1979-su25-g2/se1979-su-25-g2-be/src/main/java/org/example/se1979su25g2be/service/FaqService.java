package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.entity.Faq;
import org.example.se1979su25g2be.repository.FaqRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FaqService {

    private final FaqRepository faqRepository;

    public FaqService(FaqRepository faqRepository) {
        this.faqRepository = faqRepository;
    }

    public List<Faq> getAllFaqs() {
        return faqRepository.findAll();
    }

    public void insertSampleFaqsIfEmpty() {
        if (faqRepository.count() == 0) {
            faqRepository.save(new Faq("Làm sao để chọn đúng size?", "Xem bảng size trên trang chi tiết sản phẩm."));
            faqRepository.save(new Faq("Có thể đổi hàng không?", "Được đổi trong vòng 7 ngày nếu sản phẩm chưa sử dụng."));
            faqRepository.save(new Faq("Thời gian giao hàng?", "Từ 2 đến 5 ngày tùy khu vực."));
        }
    }
}
