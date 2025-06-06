package org.example.se1979su25g2be.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;

@Entity
@Table(name = "cart_items")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(length = 100)
    private String sessionId;

    @ManyToOne
    @JoinColumn(name = "product_variant_id", nullable = false)
    private ProductVariant variant;

    private Integer quantity;

    @CreationTimestamp
    private Timestamp createdAt;

    public CartItem() {}

    public CartItem(Integer id, User user, String sessionId, ProductVariant variant, Integer quantity, Timestamp createdAt) {
        this.id = id;
        this.user = user;
        this.sessionId = sessionId;
        this.variant = variant;
        this.quantity = quantity;
        this.createdAt = createdAt;
    }

    // === GETTERS & SETTERS ===
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public ProductVariant getVariant() {
        return variant;
    }

    public void setVariant(ProductVariant variant) {
        this.variant = variant;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    // === MANUAL BUILDER ===
    public static CartItemBuilder builder() {
        return new CartItemBuilder();
    }

    public static class CartItemBuilder {
        private User user;
        private String sessionId;
        private ProductVariant variant;
        private Integer quantity;

        public CartItemBuilder user(User user) {
            this.user = user;
            return this;
        }

        public CartItemBuilder sessionId(String sessionId) {
            this.sessionId = sessionId;
            return this;
        }

        public CartItemBuilder variant(ProductVariant variant) {
            this.variant = variant;
            return this;
        }

        public CartItemBuilder quantity(Integer quantity) {
            this.quantity = quantity;
            return this;
        }

        public CartItem build() {
            CartItem item = new CartItem();
            item.setUser(user);
            item.setSessionId(sessionId);
            item.setVariant(variant);
            item.setQuantity(quantity);
            return item;
        }
    }
}
