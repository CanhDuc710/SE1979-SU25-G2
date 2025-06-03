package org.example.se1979su25g2be.repository;

import org.example.se1979su25g2be.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Integer> {
        Optional<Role> findByRoleNameIgnoreCase(String roleName);
    }
    //Quang Anh

