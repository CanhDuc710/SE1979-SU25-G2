package org.example.se1979su25g2be.controller;

import lombok.RequiredArgsConstructor;
import org.example.se1979su25g2be.dto.AddressDTO;
import org.example.se1979su25g2be.service.AddressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user-addresses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserAddressController {

    private final AddressService addressService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AddressDTO>> getUserAddresses(@PathVariable Integer userId) {
        List<AddressDTO> addresses = addressService.getUserAddresses(userId);
        return ResponseEntity.ok(addresses);
    }

    @PostMapping("/user/{userId}")
    public ResponseEntity<AddressDTO> createAddress(
            @PathVariable Integer userId,
            @RequestBody AddressDTO addressDTO) {
        AddressDTO createdAddress = addressService.createAddress(userId, addressDTO);
        return ResponseEntity.ok(createdAddress);
    }

    @PutMapping("/user/{userId}/{addressId}")
    public ResponseEntity<AddressDTO> updateAddress(
            @PathVariable Integer userId,
            @PathVariable Integer addressId,
            @RequestBody AddressDTO addressDTO) {
        AddressDTO updatedAddress = addressService.updateAddress(userId, addressId, addressDTO);
        return ResponseEntity.ok(updatedAddress);
    }

    @DeleteMapping("/user/{userId}/{addressId}")
    public ResponseEntity<Void> deleteAddress(
            @PathVariable Integer userId,
            @PathVariable Integer addressId) {
        addressService.deleteAddress(userId, addressId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/user/{userId}/{addressId}/default")
    public ResponseEntity<Void> setDefaultAddress(
            @PathVariable Integer userId,
            @PathVariable Integer addressId) {
        addressService.setDefaultAddress(userId, addressId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/user/{userId}/default")
    public ResponseEntity<AddressDTO> getDefaultAddress(@PathVariable Integer userId) {
        AddressDTO defaultAddress = addressService.getDefaultAddress(userId);
        if (defaultAddress != null) {
            return ResponseEntity.ok(defaultAddress);
        }
        return ResponseEntity.noContent().build();
    }
}
