package org.example.se1979su25g2be.repository;

import org.example.se1979su25g2be.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Integer> {
}