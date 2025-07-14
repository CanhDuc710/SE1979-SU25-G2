package org.example.se1979su25g2be.repository;

import org.example.se1979su25g2be.entity.Role;
import org.example.se1979su25g2be.entity.User;
import org.example.se1979su25g2be.entity.User.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AccountRepository extends JpaRepository<User, Integer> {

    @Query("""
    SELECT u FROM User u
    WHERE (:keyword IS NULL OR LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')))
      AND (:status IS NULL OR u.status = :status)
      AND (:role IS NULL OR u.role = :role)
""")
    Page<User> searchUsers(
            @Param("keyword") String keyword,
            @Param("status") User.Status status,
            @Param("role") Role role,
            Pageable pageable
    );
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByUsernameIgnoreCase(String username);
}
