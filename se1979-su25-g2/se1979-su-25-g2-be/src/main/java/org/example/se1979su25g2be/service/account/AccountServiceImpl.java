package org.example.se1979su25g2be.service.account;

import lombok.RequiredArgsConstructor;
import org.example.se1979su25g2be.dto.Account.AccountDTO;
import org.example.se1979su25g2be.dto.Account.AccountDetailDTO;
import org.example.se1979su25g2be.dto.Account.StaffAccountDTO;
import org.example.se1979su25g2be.entity.Role;
import org.example.se1979su25g2be.entity.User;
import org.example.se1979su25g2be.repository.AccountRepository;
import org.example.se1979su25g2be.repository.RoleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {
    private final RoleRepository roleRepository;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Page<AccountDTO> getAllAccounts(String keyword, String status, String role, int page, int size) {
        User.Status statusEnum = (status != null) ? User.Status.valueOf(status.toUpperCase()) : null;
        Pageable pageable = PageRequest.of(page, size);

        Role userRole = null;
        if (role != null && !role.isBlank()) {
            userRole = roleRepository.findByRoleNameIgnoreCase(role).orElse(null);
        }

        return accountRepository.searchUsers(keyword, statusEnum, userRole, pageable)
                .map(this::mapToDTO);
    }

    @Override
    public AccountDTO banAccount(Integer id) {
        User user = accountRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(User.Status.BANNED);
        accountRepository.save(user);
        return mapToDTO(user);
    }

    @Override
    public AccountDTO unbanAccount(Integer id) {
        User user = accountRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(User.Status.ACTIVE);
        accountRepository.save(user);
        return mapToDTO(user);
    }


    @Override
    public AccountDetailDTO getAccountDetail(Integer id) {
        User user = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDetailDTO(user);
    }

    @Override
    public AccountDTO createStaffAccount(StaffAccountDTO dto) {
        try {
            if (accountRepository.existsByEmailIgnoreCase(dto.getEmail())) {
                throw new RuntimeException("Email đã được sử dụng");
            }
            if (accountRepository.existsByUsernameIgnoreCase(dto.getUsername())) {
                throw new RuntimeException("Username đã được sử dụng");
            }

            Role role = roleRepository.findByRoleNameIgnoreCase(dto.getRole())
                    .orElseThrow(() -> new RuntimeException("Role not found: " + dto.getRole()));

            User user = User.builder()
                    .firstName(dto.getFirstName())
                    .lastName(dto.getLastName())
                    .username(dto.getUsername())
                    .email(dto.getEmail())
                    .passwordHash(passwordEncoder.encode(dto.getPassword()))
                    .phoneNumber(dto.getPhone())
                    .sex(User.Sex.valueOf(dto.getGender()))
                    .dob(dto.getDob())
                    .role(role)
                    .status(User.Status.ACTIVE)
                    .build();

            return mapToDTO(accountRepository.save(user));
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi tạo tài khoản: " + e.getMessage());
        }
    }

    @Override
    public StaffAccountDTO getStaffAccountById(Integer id) {
        User user = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản với ID: " + id));

        return StaffAccountDTO.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .username(user.getUsername())
                .email(user.getEmail())
                .phone(user.getPhoneNumber())
                .dob(user.getDob())
                .gender(user.getSex().name())
                .role(user.getRole().getRoleName())
                .build();
    }

    @Override
    public AccountDTO updateStaffAccount(Integer id, StaffAccountDTO dto) {
        User user = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role role = roleRepository.findByRoleNameIgnoreCase(dto.getRole())
                .orElseThrow(() -> new RuntimeException("Role not found: " + dto.getRole()));

        user.setFirstName(dto.getFirstName());
        user.setLastName(dto.getLastName());
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhone());
        user.setSex(User.Sex.valueOf(dto.getGender()));
        user.setDob(dto.getDob());
        user.setRole(role);

        if (dto.getPassword() != null && !dto.getPassword().isBlank()) {
            user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));
        }

        return mapToDTO(accountRepository.save(user));
    }

    private AccountDTO mapToDTO(User u) {
        return AccountDTO.builder()
                .userId(u.getUserId())
                .username(u.getUsername())
                .email(u.getEmail())
                .roleName(u.getRole().getRoleName())
                .status(u.getStatus())
                .build();
    }

    private AccountDetailDTO mapToDetailDTO(User u) {
        return AccountDetailDTO.builder()
                .userId(u.getUserId())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .username(u.getUsername())
                .email(u.getEmail())
                .phoneNumber(u.getPhoneNumber())
//                .address(u.getAddress())
                .sex(String.valueOf(u.getSex()))
                .dob(u.getDob().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                .role(u.getRole().getRoleName())
                .status(u.getStatus().name())
                .fullName(u.getFirstName() + " " + u.getLastName())
                .build();
    }


}


