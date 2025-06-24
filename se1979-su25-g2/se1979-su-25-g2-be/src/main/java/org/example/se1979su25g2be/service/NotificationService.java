package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface NotificationService {
    Notification create(Notification noti);
    Page<Notification> getByUser(Long userId, Pageable pageable);
    Page<Notification> getByUserAndMonth(Long userId, int year, int month, Pageable pageable);
    Page<Notification> searchByTitle(Long userId, String keyword, Pageable pageable);
    Optional<Notification> getById(Long id);
    Notification update(Notification noti);
    void delete(Long id);
}
