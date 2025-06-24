package org.example.se1979su25g2be.repository;

import org.example.se1979su25g2be.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findByUserIdOrUserIdIsNull(Long userId, Pageable pageable);

    Page<Notification> findByUserIdOrUserIdIsNullAndTimeBetween(
            Long userId, LocalDateTime start, LocalDateTime end, Pageable pageable
    );

    Page<Notification> findByUserIdOrUserIdIsNullAndTitleContainingIgnoreCase(
            Long userId, String keyword, Pageable pageable
    );
}
