package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.dto.CartDTO;
import org.example.se1979su25g2be.dto.CartItemDTO;
import org.example.se1979su25g2be.entity.User;
import java.util.List;

public interface CartService {
    // Logged-in user
    List<CartItemDTO> getCartDTO(User user);
    void addToCart(User user, Integer variantId, Integer quantity);
    void removeFromCart(User user, Integer variantId);
    void clearCart(User user);
    void updateQuantity(User user, Integer variantId, Integer newQuantity);
    int getCartItemCount(User user);
    CartDTO getCart(User user);

    // Guest by sessionId
    CartDTO getCart(String sessionId);
    CartDTO addToCart(String sessionId, CartItemDTO itemDTO);
    CartDTO updateCartItem(String sessionId, CartItemDTO itemDTO);
    CartDTO removeFromCart(String sessionId, Integer variantId);
    void clearCart(String sessionId);
}