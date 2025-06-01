package org.example.se1979su25g2be.service.account;

import lombok.RequiredArgsConstructor;
import org.example.se1979su25g2be.dto.Account.AccountDTO;
import org.example.se1979su25g2be.dto.Account.AccountDetailDTO;
import org.example.se1979su25g2be.entity.Role;
import org.example.se1979su25g2be.entity.User;
import org.example.se1979su25g2be.repository.AccountRepository;
import org.example.se1979su25g2be.repository.RoleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {
    private final RoleRepository roleRepository;
    private final AccountRepository accountRepository;

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
        return null;
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
}


