package org.example.se1979su25g2be.config;

import org.example.se1979su25g2be.entity.FAQ;
import org.example.se1979su25g2be.repository.FAQRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializerConfig {
    @Bean
    CommandLineRunner initFAQs(FAQRepository faqRepository) {
        return args -> {
            if (faqRepository.count() == 0) {
                faqRepository.save(new FAQ(null, "Làm thế nào để đặt hàng?", "Bạn chỉ cần chọn sản phẩm và nhấn nút Đặt hàng."));
                faqRepository.save(new FAQ(null, "Tôi có thể đổi trả sản phẩm không?", "Bạn có thể đổi trả trong vòng 7 ngày kể từ khi nhận hàng."));
                faqRepository.save(new FAQ(null, "Phương thức thanh toán nào được chấp nhận?", "Chúng tôi chấp nhận thanh toán qua thẻ, chuyển khoản và COD."));
            }
        };
    }
}
