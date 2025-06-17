package org.example.se1979su25g2be.repository;

import org.example.se1979su25g2be.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
// Correct ID type is Integer, matching the User entity's `userId`
public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    /**
     * CORRECTED: Finds users by the `roleName` of their associated Role entity.
     */
    List<User> findByRole_RoleName(String roleName);

    List<User> findByEmailContaining(String email);

    /**
     * CORRECTED: Finds users by role name AND a partial email match.
     */
    List<User> findByRole_RoleNameAndEmailContaining(String roleName, String email);
}