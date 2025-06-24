package org.example.se1979su25g2be.service;

import lombok.RequiredArgsConstructor;
import org.example.se1979su25g2be.entity.Notification;
import org.example.se1979su25g2be.repository.NotificationRepository;
import org.example.se1979su25g2be.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository repo;

    @Override
    public Notification create(Notification noti) {
        noti.setTime(LocalDateTime.now());
        return repo.save(noti);
    }

    @Override
    public Page<Notification> getByUser(Long userId, Pageable pageable) {
        return repo.findByUserIdOrUserIdIsNull(userId, pageable);
    }

    @Override
    public Page<Notification> getByUserAndMonth(Long userId, int year, int month, Pageable pageable) {
        return repo.findByUserIdAndMonth(userId, year, month, pageable);
    }

    @Override
    public Page<Notification> searchByTitle(Long userId, String keyword, Pageable pageable) {
        return repo.findByUserIdAndTitleContainingIgnoreCase(userId, keyword, pageable);
    }

    @Override
    public Optional<Notification> getById(Long id) {
        return repo.findById(id);
    }

    @Override
    public Notification update(Notification noti) {
        return repo.save(noti);
    }

    @Override
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
