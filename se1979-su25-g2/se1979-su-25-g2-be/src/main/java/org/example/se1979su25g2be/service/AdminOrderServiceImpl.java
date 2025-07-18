package org.example.se1979su25g2be.service;

import jakarta.transaction.Transactional;
import org.example.se1979su25g2be.dto.*;
import org.example.se1979su25g2be.entity.*;
import org.example.se1979su25g2be.entity.Order.Status;
import org.example.se1979su25g2be.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AdminOrderServiceImpl implements AdminOrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductVariantRepository productVariantRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private ProvinceRepository provinceRepository;
    @Autowired
    private DistrictRepository districtRepository;
    @Autowired
    private WardRepository wardRepository;
    private OrderSummaryResponse mapOrderToOrderSummaryResponse(Order order) {
        if (order == null) return null;

        UserDTO customerInfo = null;
        if (order.getUser() != null) {
            String fullName = (order.getUser().getFirstName() != null ? order.getUser().getFirstName() : "") +
                    (order.getUser().getLastName() != null ? " " + order.getUser().getLastName() : "");
            fullName = fullName.trim();

            customerInfo = new UserDTO(
                    order.getUser().getUserId(),
                    order.getUser().getUsername(),
                    fullName,
                    order.getUser().getEmail(),
                    order.getUser().getPhoneNumber()
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
            String fullName = (order.getUser().getFirstName() != null ? order.getUser().getFirstName() : "") +
                    (order.getUser().getLastName() != null ? " " + order.getUser().getLastName() : "");
            fullName = fullName.trim();

            userDTO = new UserDTO(
                    order.getUser().getUserId(),
                    order.getUser().getUsername(),
                    fullName,
                    order.getUser().getEmail(),
                    order.getUser().getPhoneNumber()
            );
        }

        List<OrderItemResponse> itemResponses = order.getItems().stream()
                .map(this::mapOrderItemToOrderItemResponse)
                .collect(Collectors.toList());

        AddressDTO provinceDTO = order.getProvince() != null ? new AddressDTO(order.getProvince().getProvinceId(), order.getProvince().getName()) : null;
        AddressDTO districtDTO = order.getDistrict() != null ? new AddressDTO(order.getDistrict().getDistrictId(), order.getDistrict().getName()) : null;
        AddressDTO wardDTO = order.getWard() != null ? new AddressDTO(order.getWard().getWardId(), order.getWard().getName()) : null;
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

        Product product = pv.getProduct();

        String productName = (product != null) ? product.getName() : null;
        Double unitPrice = (product != null && product.getPrice() != null) ? product.getPrice().doubleValue() : null;
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
    @Override
    public Page<OrderSummaryResponse> getAllOrders(Pageable pageable) {
        Page<Order> orders = orderRepository.findAll(pageable);
        return orders.map(this::mapOrderToOrderSummaryResponse);
    }

    @Override
    public Page<OrderSummaryResponse> searchOrders(String status, String searchTerm, String searchBy, int page, int size, String sortBy, String direction) {
        org.springframework.data.domain.Sort sort = org.springframework.data.domain.Sort.by(
            "desc".equalsIgnoreCase(direction) ? 
                org.springframework.data.domain.Sort.Direction.DESC : 
                org.springframework.data.domain.Sort.Direction.ASC, 
            sortBy
        );
        Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size, sort);
        
        Page<Order> orders;
        
        if ((status == null || status.equals("all")) && 
            (searchTerm == null || searchTerm.trim().isEmpty())) {
            orders = orderRepository.findAll(pageable);
        } else {
            Order.Status statusEnum = null;
            if (status != null && !status.equals("all")) {
                try {
                    statusEnum = Order.Status.valueOf(status.toUpperCase());
                } catch (IllegalArgumentException e) {
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
                    orders = orderRepository.findByStatusAndAllFields(statusEnum, searchPattern, pageable);
                }
            } else {
                orders = orderRepository.findByStatus(statusEnum, pageable);
            }
        }
        
        return orders.map(this::mapOrderToOrderSummaryResponse);
    }

    @Override
    public Optional<OrderResponse> getOrderById(Integer orderId) {
        return orderRepository.findById(orderId)
                .map(this::mapOrderToOrderResponse);
    }

    @Override
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

    @Override
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