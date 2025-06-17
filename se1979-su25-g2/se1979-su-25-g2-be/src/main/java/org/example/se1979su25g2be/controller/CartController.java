package org.example.se1979su25g2be.controller;

import lombok.RequiredArgsConstructor;
import org.example.se1979su25g2be.dto.CartDTO;
import org.example.se1979su25g2be.dto.CartItemDTO;
import org.example.se1979su25g2be.entity.User;
import org.example.se1979su25g2be.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin("*")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // ✅ Get cart for user (logged in) or guest (sessionId)
    @GetMapping
    public ResponseEntity<CartDTO> getCart(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String sessionId
    ) {
        if (user != null) {
            return ResponseEntity.ok(cartService.getCart(user));
        } else {
            return ResponseEntity.ok(cartService.getCart(sessionId));
        }
    }

    // ✅ Add item to cart
    @PostMapping("/add")
    public ResponseEntity<CartDTO> addToCart(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String sessionId,
            @RequestBody CartItemDTO itemDTO
    ) {
        if (user != null) {
            cartService.addToCart(user, itemDTO.getVariantId(), itemDTO.getQuantity());
            return ResponseEntity.ok(cartService.getCart(user));
        } else {
            return ResponseEntity.ok(cartService.addToCart(sessionId, itemDTO));
        }
    }

    // ✅ Update quantity
    @PutMapping("/update")
    public ResponseEntity<CartDTO> updateItemQuantity(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String sessionId,
            @RequestBody CartItemDTO itemDTO
    ) {
        if (user != null) {
            cartService.updateQuantity(user, itemDTO.getVariantId(), itemDTO.getQuantity());
            return ResponseEntity.ok(cartService.getCart(user));
        } else {
            return ResponseEntity.ok(cartService.updateCartItem(sessionId, itemDTO));
        }
    }

    // ✅ Remove item
    @DeleteMapping("/remove/{variantId}")
    public ResponseEntity<CartDTO> removeFromCart(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String sessionId,
            @PathVariable Integer variantId
    ) {
        if (user != null) {
            cartService.removeFromCart(user, variantId);
            return ResponseEntity.ok(cartService.getCart(user));
        } else {
            return ResponseEntity.ok(cartService.removeFromCart(sessionId, variantId));
        }
    }

    // ✅ Clear all
    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) String sessionId
    ) {
        if (user != null) {
            cartService.clearCart(user);
        } else {
            cartService.clearCart(sessionId);
        }
        return ResponseEntity.noContent().build();
    }
}
