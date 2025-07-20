package org.example.se1979su25g2be.service;


import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.example.se1979su25g2be.dto.Account.AccountDetailDTO;
import org.example.se1979su25g2be.dto.Account.UpdateProfileDTO;
import org.example.se1979su25g2be.entity.User;
import org.example.se1979su25g2be.repository.AccountRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {
    private final AccountRepository accountRepository;

    @Override
    public AccountDetailDTO getMyProfile(Integer userId) {
        User u = accountRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User không tồn tại: " + userId));
        return mapToDetailDTO(u);
    }

    @Override
    public AccountDetailDTO updateMyProfile(Integer userId, UpdateProfileDTO dto) {
        User u = accountRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User không tồn tại: " + userId));

        u.setFirstName(dto.getFirstName());
        u.setLastName(dto.getLastName());
        u.setEmail(dto.getEmail());
        u.setPhoneNumber(dto.getPhoneNumber());
        u.setSex(User.Sex.valueOf(dto.getSex().toUpperCase()));
        u.setDob(LocalDate.parse(dto.getDob()));

        accountRepository.save(u);
        return mapToDetailDTO(u);
    }

    private AccountDetailDTO mapToDetailDTO(User u) {
        return AccountDetailDTO.builder()
                .userId(u.getUserId())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .username(u.getUsername())
                .email(u.getEmail())
                .phoneNumber(u.getPhoneNumber())
                .sex(u.getSex().name())
                .dob(u.getDob().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                .role(u.getRole().getRoleName())
                .status(u.getStatus().name())
                .fullName(u.getFirstName() + " " + u.getLastName())
                .build();
    }

}