package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.entity.Notification;
import org.example.se1979su25g2be.repository.NotificationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.Optional;

@Service
public class NotificationService {

    private final NotificationRepository repo;

    public NotificationService(NotificationRepository repo) {
        this.repo = repo;
    }

    public Notification create(Notification n) {
        n.setTime(LocalDateTime.now());
        return repo.save(n);
    }

    public Page<Notification> getByUser(Long userId, Pageable pageable) {
        return repo.findByUserIdOrUserIdIsNull(userId, pageable);
    }

    public Page<Notification> getByUserAndMonth(Long userId, int year, int month, Pageable pageable) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDateTime start = ym.atDay(1).atStartOfDay();
        LocalDateTime end = ym.atEndOfMonth().atTime(23, 59, 59);
        return repo.findByUserIdOrUserIdIsNullAndTimeBetween(userId, start, end, pageable);
    }

    public Page<Notification> searchByTitle(Long userId, String keyword, Pageable pageable) {
        return repo.findByUserIdOrUserIdIsNullAndTitleContainingIgnoreCase(userId, keyword, pageable);
    }

    public Optional<Notification> getById(Long id) {
        return repo.findById(id);
    }

    public Notification update(Notification notification) {
        return repo.save(notification);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
