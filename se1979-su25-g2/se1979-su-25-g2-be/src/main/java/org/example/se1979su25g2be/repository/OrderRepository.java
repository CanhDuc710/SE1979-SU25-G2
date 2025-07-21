package org.example.se1979su25g2be.repository;

import org.example.se1979su25g2be.dto.OrdersByPeriodDTO;
import org.example.se1979su25g2be.dto.RevenueByPeriodDTO;
import org.example.se1979su25g2be.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

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
}
