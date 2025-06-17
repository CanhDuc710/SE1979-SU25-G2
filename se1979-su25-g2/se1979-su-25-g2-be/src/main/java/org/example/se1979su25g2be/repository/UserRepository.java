package org.example.se1979su25g2be.repository;

import org.example.se1979su25g2be.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    //List<User> findByAuthorities_Authority(String role);

    List<User> findByEmailContaining(String email);

    //List<User> findByAuthorities_AuthorityAndEmailContaining(String role, String email);
}
//Quang Anh