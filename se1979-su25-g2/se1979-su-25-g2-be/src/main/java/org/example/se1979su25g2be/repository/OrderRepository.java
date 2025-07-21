package org.example.se1979su25g2be.repository;

import org.example.se1979su25g2be.dto.OrdersByPeriodDTO;
import org.example.se1979su25g2be.dto.RevenueByPeriodDTO;
import org.example.se1979su25g2be.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Integer> {

    // Total revenue for current month
    @Query("""
        SELECT COALESCE(SUM(o.totalAmount), 0.0)
        FROM Order o
        WHERE o.status = 'DELIVERED'
        AND YEAR(o.createdAt) = YEAR(CURRENT_DATE)
        AND MONTH(o.createdAt) = MONTH(CURRENT_DATE)
    """)
    Double findMonthlyRevenue();

    // Total revenue for current year
    @Query("""
        SELECT COALESCE(SUM(o.totalAmount), 0.0)
        FROM Order o
        WHERE o.status = 'DELIVERED'
        AND YEAR(o.createdAt) = YEAR(CURRENT_DATE)
    """)
    Double findYearlyRevenue();

    // Total completed orders for current month
    @Query("""
        SELECT COUNT(o)
        FROM Order o
        WHERE o.status = 'DELIVERED'
        AND YEAR(o.createdAt) = YEAR(CURRENT_DATE)
        AND MONTH(o.createdAt) = MONTH(CURRENT_DATE)
    """)
    Long findMonthlyCompletedOrdersCount();

    // Total completed orders for current year
    @Query("""
        SELECT COUNT(o)
        FROM Order o
        WHERE o.status = 'DELIVERED'
        AND YEAR(o.createdAt) = YEAR(CURRENT_DATE)
    """)
    Long findYearlyCompletedOrdersCount();

    // Revenue grouped by month (native query)
    @Query(value = """
        SELECT 
            DATE_FORMAT(o.created_at, '%Y-%m') AS period,
            COALESCE(SUM(o.total_amount), 0.0) AS revenue
        FROM orders o
        WHERE o.status = 'DELIVERED'
        GROUP BY DATE_FORMAT(o.created_at, '%Y-%m')
        ORDER BY DATE_FORMAT(o.created_at, '%Y-%m')
    """, nativeQuery = true)
    List<RevenueByPeriodDTO> findMonthlyRevenueGrouped();

    // Revenue grouped by year (native query)
    @Query(value = """
        SELECT 
            DATE_FORMAT(o.created_at, '%Y') AS period,
            COALESCE(SUM(o.total_amount), 0.0) AS revenue
        FROM orders o
        WHERE o.status = 'DELIVERED'
        GROUP BY DATE_FORMAT(o.created_at, '%Y')
        ORDER BY DATE_FORMAT(o.created_at, '%Y')
    """, nativeQuery = true)
    List<RevenueByPeriodDTO> findYearlyRevenueGrouped();

    // Completed orders grouped by month (native query)
    @Query(value = """
        SELECT 
            DATE_FORMAT(o.created_at, '%Y-%m') AS period,
            COUNT(*) AS count
        FROM orders o
        WHERE o.status = 'DELIVERED'
        GROUP BY DATE_FORMAT(o.created_at, '%Y-%m')
        ORDER BY DATE_FORMAT(o.created_at, '%Y-%m')
    """, nativeQuery = true)
    List<OrdersByPeriodDTO> findMonthlyCompletedOrders();

    // Completed orders grouped by year (native query)
    @Query(value = """
        SELECT 
            DATE_FORMAT(o.created_at, '%Y') AS period,
            COUNT(*) AS count
        FROM orders o
        WHERE o.status = 'DELIVERED'
        GROUP BY DATE_FORMAT(o.created_at, '%Y')
        ORDER BY DATE_FORMAT(o.created_at, '%Y')
    """, nativeQuery = true)
    List<OrdersByPeriodDTO> findYearlyCompletedOrders();


    @Query(
            value = """
      SELECT DISTINCT o
      FROM Order o
      LEFT JOIN FETCH o.items oi
      LEFT JOIN FETCH oi.productVariant pv
      LEFT JOIN FETCH pv.product p
      WHERE o.user.userId = :userId
        AND (
          :kw IS NULL
          OR CAST(o.orderId AS string) LIKE CONCAT('%', :kw, '%')
          OR LOWER(p.name) LIKE LOWER(CONCAT('%', :kw, '%'))
        )
      ORDER BY o.orderDate DESC
    """,
            countQuery = """
      SELECT COUNT(o)
      FROM Order o
      WHERE o.user.userId = :userId
        AND (
          :kw IS NULL
          OR CAST(o.orderId AS string) LIKE CONCAT('%', :kw, '%')
          OR EXISTS (
            SELECT 1 
            FROM OrderItem oi2
            JOIN oi2.productVariant pv2
            JOIN pv2.product p2
            WHERE oi2.order = o
              AND LOWER(p2.name) LIKE LOWER(CONCAT('%', :kw, '%'))
          )
        )
    """
    )
    Page<Order> findByUserIdAndKeyword(
            @Param("userId") Integer userId,
            @Param("kw") String keyword,
            Pageable pageable
    );

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
