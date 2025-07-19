package org.example.se1979su25g2be.repository;

import org.example.se1979su25g2be.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, Integer> {


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
