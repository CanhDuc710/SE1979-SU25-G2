package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.entity.Role;
import org.example.se1979su25g2be.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializationService implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        initializeRoles();
    }

    private void initializeRoles() {
        // Create USER role if it doesn't exist
        if (roleRepository.findByRoleNameIgnoreCase("USER").isEmpty()) {
            Role userRole = Role.builder()
                    .roleName("USER")
                    .build();
            roleRepository.save(userRole);
            System.out.println("USER role created successfully");
        }

        // Create ADMIN role if it doesn't exist
        if (roleRepository.findByRoleNameIgnoreCase("ADMIN").isEmpty()) {
            Role adminRole = Role.builder()
                    .roleName("ADMIN")
                    .build();
            roleRepository.save(adminRole);
            System.out.println("ADMIN role created successfully");
        }

        if (roleRepository.findByRoleNameIgnoreCase("STAFF").isEmpty()) {
            Role adminRole = Role.builder()
                    .roleName("STAFF")
                    .build();
            roleRepository.save(adminRole);
            System.out.println("STAFF role created successfully");
        }
    }
}
