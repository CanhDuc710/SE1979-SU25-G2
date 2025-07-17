package org.example.se1979su25g2be.repository;

import org.example.se1979su25g2be.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    
    // Find by status only
    @Query("SELECT o FROM Order o WHERE (:status IS NULL OR o.status = :status) ORDER BY o.orderDate DESC")
    Page<Order> findByStatus(@Param("status") Order.Status status, Pageable pageable);
    
    // Search by customer name (both registered user and shipping name)
    @Query("SELECT o FROM Order o WHERE " +
           "(:status IS NULL OR o.status = :status) AND " +
           "(LOWER(CONCAT(COALESCE(o.user.firstName, ''), ' ', COALESCE(o.user.lastName, ''))) LIKE :searchPattern OR " +
           "LOWER(o.shippingName) LIKE :searchPattern) " +
           "ORDER BY o.orderDate DESC")
    Page<Order> findByStatusAndCustomerName(@Param("status") Order.Status status, 
                                          @Param("searchPattern") String searchPattern, 
                                          Pageable pageable);
    
    // Search by phone number (both user phone and shipping phone)
    @Query("SELECT o FROM Order o WHERE " +
           "(:status IS NULL OR o.status = :status) AND " +
           "(LOWER(o.shippingPhone) LIKE :searchPattern OR " +
           "LOWER(COALESCE(o.user.phoneNumber, '')) LIKE :searchPattern) " +
           "ORDER BY o.orderDate DESC")
    Page<Order> findByStatusAndPhone(@Param("status") Order.Status status, 
                                   @Param("searchPattern") String searchPattern, 
                                   Pageable pageable);
    
    // Search by address
    @Query("SELECT o FROM Order o WHERE " +
           "(:status IS NULL OR o.status = :status) AND " +
           "LOWER(o.shippingAddress) LIKE :searchPattern " +
           "ORDER BY o.orderDate DESC")
    Page<Order> findByStatusAndAddress(@Param("status") Order.Status status, 
                                     @Param("searchPattern") String searchPattern, 
                                     Pageable pageable);
    
    // Search all fields
    @Query("SELECT o FROM Order o WHERE " +
           "(:status IS NULL OR o.status = :status) AND " +
           "(LOWER(CONCAT('ORD-', CAST(o.orderId AS string))) LIKE :searchPattern OR " +
           "LOWER(CONCAT(COALESCE(o.user.firstName, ''), ' ', COALESCE(o.user.lastName, ''))) LIKE :searchPattern OR " +
           "LOWER(COALESCE(o.user.email, '')) LIKE :searchPattern OR " +
           "LOWER(o.shippingName) LIKE :searchPattern OR " +
           "LOWER(o.shippingPhone) LIKE :searchPattern OR " +
           "LOWER(COALESCE(o.user.phoneNumber, '')) LIKE :searchPattern OR " +
           "LOWER(o.shippingAddress) LIKE :searchPattern) " +
           "ORDER BY o.orderDate DESC")
    Page<Order> findByStatusAndAllFields(@Param("status") Order.Status status, 
                                       @Param("searchPattern") String searchPattern, 
                                       Pageable pageable);
}