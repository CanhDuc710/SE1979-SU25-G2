package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.dto.OrderRequestDTO;
import org.example.se1979su25g2be.entity.*;
import org.example.se1979su25g2be.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductVariantRepository productVariantRepository;
    private final UserRepository userRepository;
    private final CartItemRepository cartItemRepository;
    private final ProvinceRepository provinceRepository;
    private final DistrictRepository districtRepository;
    private final WardRepository wardRepository;

    public OrderServiceImpl(OrderRepository orderRepository,
                            ProductVariantRepository productVariantRepository,
                            UserRepository userRepository,
                            CartItemRepository cartItemRepository,
                            ProvinceRepository provinceRepository,
                            DistrictRepository districtRepository,
                            WardRepository wardRepository) {
        this.orderRepository = orderRepository;
        this.productVariantRepository = productVariantRepository;
        this.userRepository = userRepository;
        this.cartItemRepository = cartItemRepository;
        this.provinceRepository = provinceRepository;
        this.districtRepository = districtRepository;
        this.wardRepository = wardRepository;
    }

    @Override
    @Transactional
    public Order createOrder(OrderRequestDTO orderRequest) {
        List<CartItem> cartItems;
        User user = null;

        if (orderRequest.getUserId() != null) {
            user = userRepository.findById((int) orderRequest.getUserId().longValue())
                    .orElseThrow(() -> new EntityNotFoundException("User not found"));
            cartItems = cartItemRepository.findByUser(user);
        } else if (orderRequest.getSessionId() != null && !orderRequest.getSessionId().isEmpty()) {
            cartItems = cartItemRepository.findBySessionId(orderRequest.getSessionId());
        } else {
            throw new IllegalArgumentException("User ID or Session ID is required for order creation from cart.");
        }

        if (cartItems.isEmpty()) {
            throw new IllegalStateException("Cart is empty");
        }

        Province province = provinceRepository.findById(orderRequest.getProvinceId())
                .orElseThrow(() -> new EntityNotFoundException("Province not found"));
        District district = districtRepository.findById(orderRequest.getDistrictId())
                .orElseThrow(() -> new EntityNotFoundException("District not found"));
        Ward ward = wardRepository.findById(orderRequest.getWardId())
                .orElseThrow(() -> new EntityNotFoundException("Ward not found"));

        Order order = Order.builder()
                .user(user)
                .shippingName(orderRequest.getShippingName())
                .shippingPhone(orderRequest.getShippingPhone())
                .shippingAddress(orderRequest.getShippingAddress())
                .province(province)
                .district(district)
                .ward(ward)
                .paymentMethod(Order.PaymentMethod.valueOf(orderRequest.getPaymentMethod().toUpperCase()))
                .status(Order.Status.PENDING)
                .build();

        List<OrderItem> orderItems = cartItems.stream().map(cartItem -> {
            ProductVariant variant = cartItem.getVariant();
            double price = variant.getProduct().getPrice().doubleValue() * cartItem.getQuantity();
            return OrderItem.builder()
                    .order(order)
                    .productVariant(variant)
                    .quantity(cartItem.getQuantity())
                    .price(price)
                    .build();
        }).collect(Collectors.toList());

        order.setItems(orderItems);
        order.setTotalAmount(orderItems.stream().mapToDouble(OrderItem::getPrice).sum());

        Order savedOrder = orderRepository.save(order);

        if (user != null) {
            cartItemRepository.deleteByUser(user);
        } else {
            cartItemRepository.deleteBySessionId(orderRequest.getSessionId());
        }

        return savedOrder;
    }
}