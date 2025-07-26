package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.dto.AddressDTO;

import java.util.List;

public interface AddressService {
    List<AddressDTO> getUserAddresses(Integer userId);
    AddressDTO createAddress(Integer userId, AddressDTO addressDTO);
    AddressDTO updateAddress(Integer userId, Integer addressId, AddressDTO addressDTO);
    void deleteAddress(Integer userId, Integer addressId);
    void setDefaultAddress(Integer userId, Integer addressId);
    AddressDTO getDefaultAddress(Integer userId);
    List<AddressDTO> getAllAddresses(); // Thêm method này nếu cần cho admin
}
