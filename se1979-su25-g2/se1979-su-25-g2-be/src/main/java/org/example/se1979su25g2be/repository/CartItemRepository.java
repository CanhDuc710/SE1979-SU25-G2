package org.example.se1979su25g2be.repository;

import org.example.se1979su25g2be.entity.CartItem;
import org.example.se1979su25g2be.entity.ProductVariant;
import org.example.se1979su25g2be.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Integer> {

    // 👉 Cho người dùng đã đăng nhập
    List<CartItem> findByUser(User user);

    Optional<CartItem> findByUserAndVariant(User user, ProductVariant variant);

    void deleteByUser(User user);

    int countByUser(User user);

    // 👉 Cho người dùng chưa đăng nhập (sử dụng sessionId)
    List<CartItem> findBySessionId(String sessionId);

    Optional<CartItem> findBySessionIdAndVariant(String sessionId, ProductVariant variant);

    void deleteBySessionId(String sessionId);
}
