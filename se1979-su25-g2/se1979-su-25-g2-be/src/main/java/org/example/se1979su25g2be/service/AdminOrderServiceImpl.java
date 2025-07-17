package org.example.se1979su25g2be.service;

import jakarta.transaction.Transactional;
import org.example.se1979su25g2be.dto.*; // Import tất cả DTOs
import org.example.se1979su25g2be.entity.*; // Import tất cả entities
import org.example.se1979su25g2be.entity.Order.Status;
import org.example.se1979su25g2be.repository.*; // Import tất cả repositories
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service // Đánh dấu đây là một Spring Service component
public class AdminOrderServiceImpl implements AdminOrderService { // Triển khai Interface

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductVariantRepository productVariantRepository;
    @Autowired
    private ProductRepository productRepository; // Cần thiết để lấy giá sản phẩm và tên sản phẩm
    @Autowired
    private ProvinceRepository provinceRepository;
    @Autowired
    private DistrictRepository districtRepository;
    @Autowired
    private WardRepository wardRepository;


    // --- Mapper methods: Convert Entity to DTO ---
    private OrderSummaryResponse mapOrderToOrderSummaryResponse(Order order) {
        if (order == null) return null;

        UserDTO customerInfo = null;
        if (order.getUser() != null) {
            // Ghép firstName và lastName để tạo fullName
            String fullName = (order.getUser().getFirstName() != null ? order.getUser().getFirstName() : "") +
                    (order.getUser().getLastName() != null ? " " + order.getUser().getLastName() : "");
            fullName = fullName.trim(); // Loại bỏ khoảng trắng thừa nếu một trong hai trường rỗng

            customerInfo = new UserDTO(
                    order.getUser().getUserId(),
                    order.getUser().getUsername(),
                    fullName, // <-- Đã sửa
                    order.getUser().getEmail(),
                    order.getUser().getPhoneNumber() // <-- Đã sửa
            );
        }

        long numberOfProducts = order.getItems().stream()
                .mapToLong(OrderItem::getQuantity)
                .sum();

        String shippingAddressFull = order.getShippingAddress();
        if (order.getWard() != null) {
            shippingAddressFull += ", " + order.getWard().getName();
        }
        if (order.getDistrict() != null) {
            shippingAddressFull += ", " + order.getDistrict().getName();
        }
        if (order.getProvince() != null) {
            shippingAddressFull += ", " + order.getProvince().getName();
        }

        return new OrderSummaryResponse(
                order.getOrderId(),
                numberOfProducts,
                order.getTotalAmount(),
                customerInfo,
                order.getShippingName(),
                order.getShippingPhone(),
                shippingAddressFull,
                order.getStatus(),
                order.getOrderDate()
        );
    }

    private OrderResponse mapOrderToOrderResponse(Order order) {
        if (order == null) return null;

        UserDTO userDTO = null;
        if (order.getUser() != null) {
            // Ghép firstName và lastName để tạo fullName
            String fullName = (order.getUser().getFirstName() != null ? order.getUser().getFirstName() : "") +
                    (order.getUser().getLastName() != null ? " " + order.getUser().getLastName() : "");
            fullName = fullName.trim(); // Loại bỏ khoảng trắng thừa nếu một trong hai trường rỗng

            userDTO = new UserDTO(
                    order.getUser().getUserId(),
                    order.getUser().getUsername(),
                    fullName, // <-- Đã sửa ở đây
                    order.getUser().getEmail(),
                    order.getUser().getPhoneNumber() // <-- LƯU Ý: Trường này là phoneNumber chứ không phải phone
            );
        }

        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(this::mapOrderItemToOrderItemResponse)
                .collect(Collectors.toList());

        AddressDTO provinceDTO = order.getProvince() != null ? new AddressDTO(order.getProvince().getProvinceId(), order.getProvince().getName()) : null; // Sử dụng getProvinceId()
        AddressDTO districtDTO = order.getDistrict() != null ? new AddressDTO(order.getDistrict().getDistrictId(), order.getDistrict().getName()) : null; // Sử dụng getDistrictId()
        AddressDTO wardDTO = order.getWard() != null ? new AddressDTO(order.getWard().getWardId(), order.getWard().getName()) : null; // Sử dụng getWardId()
        return new OrderResponse(
                order.getOrderId(),
                userDTO,
                itemResponses,
                order.getShippingName(),
                order.getShippingPhone(),
                provinceDTO,
                districtDTO,
                wardDTO,
                order.getShippingAddress(),
                order.getPaymentMethod(),
                order.getStatus(),
                order.getTotalAmount(),
                order.getOrderDate()
        );
    }

    private OrderItemProductVariantDTO mapProductVariantToOrderItemProductVariantDTO(ProductVariant pv) {
        if (pv == null) return null;

        Product product = pv.getProduct(); // Lấy Product entity từ ProductVariant

        String productName = (product != null) ? product.getName() : null;
        Double unitPrice = (product != null && product.getPrice() != null) ? product.getPrice().doubleValue() : null;

        // Ghép tên biến thể từ color và size
        String variantName = "";
        if (pv.getColor() != null && !pv.getColor().isEmpty()) {
            variantName += pv.getColor();
        }
        if (pv.getSize() != null && !pv.getSize().isEmpty()) {
            if (!variantName.isEmpty()) variantName += " - ";
            variantName += pv.getSize();
        }
        if (variantName.isEmpty()) {
            variantName = "N/A";
        }

        return new OrderItemProductVariantDTO(
                pv.getVariantId(),
                (product != null) ? product.getProductId() : null,
                productName,
                variantName,
                pv.getColor(),
                pv.getSize(),
                unitPrice,
                pv.getStockQuantity()
        );
    }

    private OrderItemResponse mapOrderItemToOrderItemResponse(OrderItem item) {
        if (item == null) return null;
        OrderItemProductVariantDTO orderItemProductVariantDTO = mapProductVariantToOrderItemProductVariantDTO(item.getProductVariant());
        return new OrderItemResponse(
                item.getOrderItemId(),
                orderItemProductVariantDTO,
                item.getQuantity(),
                item.getPrice()
        );
    }
    // --- End Mapper methods ---


    @Override // Bắt buộc phải override các phương thức từ interface
    public Page<OrderSummaryResponse> getAllOrders(Pageable pageable) {
        Page<Order> orders = orderRepository.findAll(pageable);
        return orders.map(this::mapOrderToOrderSummaryResponse);
    }

    @Override
    public Page<OrderSummaryResponse> searchOrders(String status, String searchTerm, String searchBy, int page, int size, String sortBy, String direction) {
        // Create Pageable with sorting
        org.springframework.data.domain.Sort sort = org.springframework.data.domain.Sort.by(
            "desc".equalsIgnoreCase(direction) ? 
                org.springframework.data.domain.Sort.Direction.DESC : 
                org.springframework.data.domain.Sort.Direction.ASC, 
            sortBy
        );
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size, sort);
        
        Page<Order> orders;
        
        // If no filters, return all orders
        if ((status == null || status.equals("all")) && 
            (searchTerm == null || searchTerm.trim().isEmpty())) {
            orders = orderRepository.findAll(pageable);
        } else {
            // Apply filters
            Order.Status statusEnum = null;
            if (status != null && !status.equals("all")) {
                try {
                    statusEnum = Order.Status.valueOf(status.toUpperCase());
                } catch (IllegalArgumentException e) {
                    // Invalid status, ignore
                }
            }
            
            if (searchTerm != null && !searchTerm.trim().isEmpty()) {
                String searchPattern = "%" + searchTerm.toLowerCase() + "%";
                
                if ("customer".equals(searchBy)) {
                    orders = orderRepository.findByStatusAndCustomerName(statusEnum, searchPattern, pageable);
                } else if ("phone".equals(searchBy)) {
                    orders = orderRepository.findByStatusAndPhone(statusEnum, searchPattern, pageable);
                } else if ("address".equals(searchBy)) {
                    orders = orderRepository.findByStatusAndAddress(statusEnum, searchPattern, pageable);
                } else {
                    // Search all fields
                    orders = orderRepository.findByStatusAndAllFields(statusEnum, searchPattern, pageable);
                }
            } else {
                // Only status filter
                orders = orderRepository.findByStatus(statusEnum, pageable);
            }
        }
        
        return orders.map(this::mapOrderToOrderSummaryResponse);
    }

    @Override // Bắt buộc phải override các phương thức từ interface
    public Optional<OrderResponse> getOrderById(Integer orderId) {
        return orderRepository.findById(orderId)
                .map(this::mapOrderToOrderResponse);
    }

    @Override // Bắt buộc phải override các phương thức từ interface
    @Transactional
    public Optional<OrderResponse> updateOrderStatus(Integer orderId, Status newStatus) {
        return orderRepository.findById(orderId).map(order -> {
            switch (order.getStatus()) {
                case PENDING:
                    if (newStatus == Status.SHIPPED || newStatus == Status.DELIVERED) {
                        throw new RuntimeException("Cannot transition from PENDING directly to SHIPPED/DELIVERED.");
                    }
                    break;
                case CONFIRMED:
                    if (newStatus == Status.PENDING || newStatus == Status.DELIVERED) {
                        throw new RuntimeException("Cannot transition from CONFIRMED directly to PENDING/DELIVERED.");
                    }
                    break;
                case SHIPPED:
                    if (newStatus == Status.PENDING || newStatus == Status.CONFIRMED) {
                        throw new RuntimeException("Cannot transition from SHIPPED directly to PENDING/CONFIRMED.");
                    }
                    break;
                case DELIVERED:
                case CANCELLED:
                    throw new RuntimeException("Cannot change status of a " + order.getStatus() + " order.");
            }

            if (newStatus == Status.DELIVERED) {
                // Logic khi đơn hàng được giao
            } else if (newStatus == Status.CANCELLED) {
                for (OrderItem item : order.getItems()) {
                    ProductVariant pv = item.getProductVariant();
                    if (pv != null) {
                        pv.setStockQuantity(pv.getStockQuantity() + item.getQuantity());
                        productVariantRepository.save(pv);
                    }
                }
            }
            order.setStatus(newStatus);
            return mapOrderToOrderResponse(orderRepository.save(order));
        });
    }

    @Override // Bắt buộc phải override các phương thức từ interface
    @Transactional
    public void deleteOrder(Integer orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        for (OrderItem item : order.getItems()) {
            ProductVariant pv = item.getProductVariant();
            if (pv != null) {
                pv.setStockQuantity(pv.getStockQuantity() + item.getQuantity());
                productVariantRepository.save(pv);
            }
        }
        orderRepository.delete(order);
    }
}