package org.example.se1979su25g2be.repository;

import org.example.se1979su25g2be.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {
    List<Address> findByUserUserIdOrderByIsDefaultDescAddressIdAsc(Integer userId);
    Optional<Address> findByUserUserIdAndIsDefaultTrue(Integer userId);
    List<Address> findByUserUserId(Integer userId);
}
