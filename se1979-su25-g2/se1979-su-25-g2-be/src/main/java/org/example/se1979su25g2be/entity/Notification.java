package org.example.se1979su25g2be.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId; // null nếu thông báo toàn hệ thống

    private String title;
    private String content;

    private boolean isFavorite = false;
    private boolean isArchived = false;
    private boolean isRead = false;

    private LocalDateTime time;
}
