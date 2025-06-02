// CartServiceImpl.java
package org.example.se1979su25g2be.service;

import lombok.RequiredArgsConstructor;
import org.example.se1979su25g2be.dto.CartDTO;
import org.example.se1979su25g2be.dto.CartItemDTO;
import org.example.se1979su25g2be.entity.*;
import org.example.se1979su25g2be.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service

public class CartServiceImpl implements CartService {
    private final CartItemRepository cartItemRepo;
    private final ProductVariantRepository variantRepo;

    public CartServiceImpl(CartItemRepository cartItemRepo, ProductVariantRepository variantRepo) {
        this.cartItemRepo = cartItemRepo;
        this.variantRepo = variantRepo;
    }

    // Logged-in user
    @Override
    public List<CartItemDTO> getCartDTO(User user) {
        return cartItemRepo.findByUser(user).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public void addToCart(User user, Integer variantId, Integer quantity) {
        ProductVariant variant = variantRepo.findById(variantId).orElseThrow();
        CartItem existing = cartItemRepo.findByUserAndVariant(user, variant).orElse(null);
        if (existing != null) existing.setQuantity(existing.getQuantity() + quantity);
        else existing = CartItem.builder().user(user).variant(variant).quantity(quantity).build();
        cartItemRepo.save(existing);
    }

    @Override
    public void removeFromCart(User user, Integer variantId) {
        variantRepo.findById(variantId).ifPresent(variant -> cartItemRepo.findByUserAndVariant(user, variant).ifPresent(cartItemRepo::delete));
    }

    @Override
    public void clearCart(User user) {
        cartItemRepo.deleteByUser(user);
    }

    @Override
    public void updateQuantity(User user, Integer variantId, Integer newQuantity) {
        ProductVariant variant = variantRepo.findById(variantId).orElseThrow();
        CartItem item = cartItemRepo.findByUserAndVariant(user, variant).orElseThrow();
        item.setQuantity(newQuantity);
        cartItemRepo.save(item);
    }

    @Override
    public int getCartItemCount(User user) {
        return cartItemRepo.countByUser(user);
    }

    @Override
    public CartDTO getCart(User user) {
        List<CartItemDTO> items = getCartDTO(user);
        BigDecimal total = items.stream().map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity()))).reduce(BigDecimal.ZERO, BigDecimal::add);
        return new CartDTO(null, items, total);
    }

    // Guest by sessionId
    @Override
    public CartDTO getCart(String sessionId) {
        List<CartItemDTO> items = cartItemRepo.findBySessionId(sessionId).stream().map(this::toDTO).collect(Collectors.toList());
        BigDecimal total = items.stream().map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity()))).reduce(BigDecimal.ZERO, BigDecimal::add);
        return new CartDTO(sessionId, items, total);
    }

    @Override
    public CartDTO addToCart(String sessionId, CartItemDTO itemDTO) {
        ProductVariant variant = variantRepo.findById(itemDTO.getVariantId()).orElseThrow();
        CartItem existing = cartItemRepo.findBySessionIdAndVariant(sessionId, variant).orElse(null);
        if (existing != null) existing.setQuantity(existing.getQuantity() + itemDTO.getQuantity());
        else existing = CartItem.builder().sessionId(sessionId).variant(variant).quantity(itemDTO.getQuantity()).build();
        cartItemRepo.save(existing);
        return getCart(sessionId);
    }

    @Override
    public CartDTO updateCartItem(String sessionId, CartItemDTO itemDTO) {
        ProductVariant variant = variantRepo.findById(itemDTO.getVariantId()).orElseThrow();
        CartItem item = cartItemRepo.findBySessionIdAndVariant(sessionId, variant).orElseThrow();
        item.setQuantity(itemDTO.getQuantity());
        cartItemRepo.save(item);
        return getCart(sessionId);
    }

    @Override
    public CartDTO removeFromCart(String sessionId, Integer variantId) {
        ProductVariant variant = variantRepo.findById(variantId).orElseThrow();
        cartItemRepo.findBySessionIdAndVariant(sessionId, variant).ifPresent(cartItemRepo::delete);
        return getCart(sessionId);
    }

    @Override
    public void clearCart(String sessionId) {
        cartItemRepo.deleteBySessionId(sessionId);
    }

    private CartItemDTO toDTO(CartItem item) {
        ProductVariant variant = item.getVariant();
        Product product = variant.getProduct();
        String imageUrl = (product.getImages() != null && !product.getImages().isEmpty()) ? product.getImages().get(0).getImageUrl() : null;
        return new CartItemDTO(
                variant.getVariantId(), product.getName(), variant.getColor(), variant.getSize(),
                product.getPrice(), item.getQuantity(), imageUrl
        );
    }
}
