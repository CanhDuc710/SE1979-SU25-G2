package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.dto.AccountOrderHistory.OrderHistoryDTO;
import org.example.se1979su25g2be.dto.AccountOrderHistory.OrderItemDTO;
import org.example.se1979su25g2be.dto.OrderRequestDTO;
import org.example.se1979su25g2be.entity.*;
import org.example.se1979su25g2be.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
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

    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static final NumberFormat VN_CURRENCY = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));

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

        // Sử dụng finalTotal từ frontend thay vì tự tính từ cart items
        if (orderRequest.getFinalTotal() != null) {
            order.setTotalAmount(orderRequest.getFinalTotal()); // Đã là Double, không cần convert
        } else {
            // Fallback: tự tính nếu không có finalTotal từ frontend
            order.setTotalAmount(orderItems.stream().mapToDouble(OrderItem::getPrice).sum());
        }

        // Set thời gian trước khi save
        LocalDateTime now = LocalDateTime.now();
        order.setCreatedAt(Timestamp.valueOf(now));
        order.setOrderDate(now);

        Order savedOrder = orderRepository.save(order);

        // Clear cart sau khi tạo order thành công
        if (user != null) {
            cartItemRepository.deleteByUser(user);
        } else {
            cartItemRepository.deleteBySessionId(orderRequest.getSessionId());
        }

        return savedOrder;
    }

    @Override
    public Page<OrderHistoryDTO> getOrdersByUser(Integer userId, String keyword, Pageable pageable) {
        String kw = (keyword != null && !keyword.isBlank()) ? keyword.trim() : null;
        return orderRepository.findByUserIdAndKeyword(userId, kw, pageable)
                .map(order -> {
                    // Map items
                    List<OrderItemDTO> items = order.getItems().stream()
                            .map(it -> OrderItemDTO.builder()
                                    .productId(it.getProductVariant().getProduct().getProductId().longValue())
                                    .name(it.getProductVariant().getProduct().getName())
                                    .quantity(it.getQuantity())
                                    // Lấy URL ảnh đầu tiên từ danh sách images
                                    .img(it.getProductVariant().getProduct().getImages().get(0).getImageUrl())
                                    .build()
                            )
                            .collect(Collectors.toList());

                    // Build DTO with formatted date and total
                    return OrderHistoryDTO.builder()
                            .orderId(order.getOrderId().longValue())
                            .date(order.getOrderDate().format(DATE_FMT))
                            .total(VN_CURRENCY.format(order.getTotalAmount()))
                            .status(order.getStatus().name())
                            .items(items)
                            .build();
                });
    }
}

