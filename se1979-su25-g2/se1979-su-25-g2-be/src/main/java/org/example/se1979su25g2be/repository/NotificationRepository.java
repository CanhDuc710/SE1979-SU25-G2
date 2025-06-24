package org.example.se1979su25g2be.repository;

import org.example.se1979su25g2be.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    Page<Notification> findByUserIdOrUserIdIsNull(Long userId, Pageable pageable);

    @Query("SELECT n FROM Notification n WHERE (n.userId = :userId OR n.userId IS NULL) AND " +
            "FUNCTION('YEAR', n.time) = :year AND FUNCTION('MONTH', n.time) = :month")
    Page<Notification> findByUserIdAndMonth(Long userId, int year, int month, Pageable pageable);

    Page<Notification> findByUserIdAndTitleContainingIgnoreCase(Long userId, String keyword, Pageable pageable);
}
