package org.example.se1979su25g2be.controller;

import org.example.se1979su25g2be.entity.Notification;
import org.example.se1979su25g2be.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin("*")
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @PostMapping
    public Notification create(@RequestBody Notification notification) {
        return service.create(notification);
    }

    @GetMapping("/{userId}")
    public Page<Notification> getByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return service.getByUser(userId, PageRequest.of(page, size));
    }

    @GetMapping("/{userId}/month")
    public Page<Notification> getByMonth(
            @PathVariable Long userId,
            @RequestParam int year,
            @RequestParam int month,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return service.getByUserAndMonth(userId, year, month, PageRequest.of(page, size));
    }

    @GetMapping("/{userId}/search")
    public Page<Notification> search(
            @PathVariable Long userId,
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return service.searchByTitle(userId, keyword, PageRequest.of(page, size));
    }

    @PatchMapping("/{id}/favorite")
    public Notification toggleFavorite(@PathVariable Long id) {
        Notification noti = service.getById(id).orElseThrow();
        noti.setFavorite(!noti.isFavorite());
        return service.update(noti);
    }

    @PatchMapping("/{id}/archive")
    public Notification toggleArchive(@PathVariable Long id) {
        Notification noti = service.getById(id).orElseThrow();
        noti.setArchived(!noti.isArchived());
        return service.update(noti);
    }

    @PatchMapping("/{id}/read")
    public Notification markAsRead(@PathVariable Long id) {
        Notification noti = service.getById(id).orElseThrow();
        noti.setRead(true);
        return service.update(noti);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
