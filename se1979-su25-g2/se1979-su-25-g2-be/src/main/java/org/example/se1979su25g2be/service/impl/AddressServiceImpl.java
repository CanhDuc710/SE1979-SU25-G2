package org.example.se1979su25g2be.service.impl;

import lombok.RequiredArgsConstructor;
import org.example.se1979su25g2be.dto.AddressDTO;
import org.example.se1979su25g2be.entity.*;
import org.example.se1979su25g2be.repository.*;
import org.example.se1979su25g2be.service.AddressService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressServiceImpl implements AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final ProvinceRepository provinceRepository;
    private final DistrictRepository districtRepository;
    private final WardRepository wardRepository;

    @Override
    public List<AddressDTO> getUserAddresses(Integer userId) {
        List<Address> addresses = addressRepository.findByUserUserIdOrderByIsDefaultDescAddressIdAsc(userId);
        return addresses.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @Override
    public AddressDTO createAddress(Integer userId, AddressDTO addressDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Province province = provinceRepository.findById(addressDTO.getProvinceId())
                .orElseThrow(() -> new RuntimeException("Province not found"));

        District district = districtRepository.findById(addressDTO.getDistrictId())
                .orElseThrow(() -> new RuntimeException("District not found"));

        Ward ward = wardRepository.findById(addressDTO.getWardId())
                .orElseThrow(() -> new RuntimeException("Ward not found"));

        // If this is the first address or marked as default, set as default
        boolean isDefault = addressDTO.getIsDefault() != null ? addressDTO.getIsDefault() : false;
        List<Address> existingAddresses = addressRepository.findByUserUserId(userId);

        if (existingAddresses.isEmpty()) {
            isDefault = true; // First address is always default
        } else if (isDefault) {
            // Remove default from other addresses
            existingAddresses.forEach(addr -> {
                addr.setIsDefault(false);
                addressRepository.save(addr);
            });
        }

        Address address = Address.builder()
                .user(user)
                .province(province)
                .district(district)
                .ward(ward)
                .addressLine(addressDTO.getAddressLine())
                .postalCode(addressDTO.getPostalCode())
                .recipientName(addressDTO.getRecipientName())
                .recipientPhone(addressDTO.getRecipientPhone())
                .isDefault(isDefault)
                .build();

        Address savedAddress = addressRepository.save(address);
        return convertToDTO(savedAddress);
    }

    @Override
    public AddressDTO updateAddress(Integer userId, Integer addressId, AddressDTO addressDTO) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to address");
        }

        Province province = provinceRepository.findById(addressDTO.getProvinceId())
                .orElseThrow(() -> new RuntimeException("Province not found"));

        District district = districtRepository.findById(addressDTO.getDistrictId())
                .orElseThrow(() -> new RuntimeException("District not found"));

        Ward ward = wardRepository.findById(addressDTO.getWardId())
                .orElseThrow(() -> new RuntimeException("Ward not found"));

        // Handle default setting
        if (addressDTO.getIsDefault() != null && addressDTO.getIsDefault() && !address.getIsDefault()) {
            // Remove default from other addresses
            List<Address> otherAddresses = addressRepository.findByUserUserId(userId);
            otherAddresses.forEach(addr -> {
                if (!addr.getAddressId().equals(addressId)) {
                    addr.setIsDefault(false);
                    addressRepository.save(addr);
                }
            });
        }

        address.setProvince(province);
        address.setDistrict(district);
        address.setWard(ward);
        address.setAddressLine(addressDTO.getAddressLine());
        address.setPostalCode(addressDTO.getPostalCode());
        address.setRecipientName(addressDTO.getRecipientName());
        address.setRecipientPhone(addressDTO.getRecipientPhone());
        address.setIsDefault(addressDTO.getIsDefault() != null ? addressDTO.getIsDefault() : address.getIsDefault());

        Address savedAddress = addressRepository.save(address);
        return convertToDTO(savedAddress);
    }

    @Override
    public void deleteAddress(Integer userId, Integer addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to address");
        }

        boolean wasDefault = address.getIsDefault();
        addressRepository.delete(address);

        // If deleted address was default, set another address as default
        if (wasDefault) {
            List<Address> remainingAddresses = addressRepository.findByUserUserId(userId);
            if (!remainingAddresses.isEmpty()) {
                Address newDefault = remainingAddresses.get(0);
                newDefault.setIsDefault(true);
                addressRepository.save(newDefault);
            }
        }
    }

    @Override
    public void setDefaultAddress(Integer userId, Integer addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (!address.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to address");
        }

        // Remove default from all user addresses
        List<Address> userAddresses = addressRepository.findByUserUserId(userId);
        userAddresses.forEach(addr -> {
            addr.setIsDefault(addr.getAddressId().equals(addressId));
            addressRepository.save(addr);
        });
    }

    @Override
    public AddressDTO getDefaultAddress(Integer userId) {
        return addressRepository.findByUserUserIdAndIsDefaultTrue(userId)
                .map(this::convertToDTO)
                .orElse(null);
    }

    @Override
    public List<AddressDTO> getAllAddresses() {
        List<Address> addresses = addressRepository.findAll();
        return addresses.stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    private AddressDTO convertToDTO(Address address) {
        return AddressDTO.builder()
                .addressId(address.getAddressId())
                .addressLine(address.getAddressLine())
                .provinceId(address.getProvince().getProvinceId())
                .provinceName(address.getProvince().getName())
                .districtId(address.getDistrict().getDistrictId())
                .districtName(address.getDistrict().getName())
                .wardId(address.getWard().getWardId())
                .wardName(address.getWard().getName())
                .postalCode(address.getPostalCode())
                .recipientName(address.getRecipientName())
                .recipientPhone(address.getRecipientPhone())
                .isDefault(address.getIsDefault())
                .build();
    }
}
