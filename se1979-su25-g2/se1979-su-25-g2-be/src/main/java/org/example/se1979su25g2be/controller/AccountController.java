package org.example.se1979su25g2be.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.se1979su25g2be.dto.Account.AccountDTO;
import org.example.se1979su25g2be.dto.Account.AccountDetailDTO;
import org.example.se1979su25g2be.dto.Account.StaffAccountDTO;
import org.example.se1979su25g2be.dto.AccountOrderHistory.OrderHistoryDTO;
import org.example.se1979su25g2be.entity.Order;
import org.example.se1979su25g2be.service.OrderService;
import org.example.se1979su25g2be.service.account.AccountService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/admin/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;
    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<Page<AccountDTO>> getAllAccounts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String role,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<AccountDTO> accounts = accountService.getAllAccounts(keyword, status, role, page, size);
        return ResponseEntity.ok(accounts);
    }

    @PutMapping("/ban/{id}")
    public ResponseEntity<AccountDTO> banAccount(@PathVariable Integer id) {
        AccountDTO accountDTO = accountService.banAccount(id);
        return ResponseEntity.ok(accountDTO);
    }

    @PutMapping("/unban/{id}")
    public ResponseEntity<AccountDTO> unbanAccount(@PathVariable Integer id) {
        AccountDTO accountDTO = accountService.unbanAccount(id);
        return ResponseEntity.ok(accountDTO);
    }

    @GetMapping("/getDetail/{id}")
    public ResponseEntity<AccountDetailDTO> getAccountDetail(@PathVariable Integer id) {
        AccountDetailDTO accountDetailDTO = accountService.getAccountDetail(id);
        return ResponseEntity.ok(accountDetailDTO);
    }

    @PostMapping("/add")
    public ResponseEntity<Void> createInternalAccount(@Valid @RequestBody StaffAccountDTO dto) {
        System.out.println("RECEIVED: " + dto); // in log
        accountService.createStaffAccount(dto);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/edit/{id}")
    public ResponseEntity<StaffAccountDTO> getInternalAccountById(@PathVariable Integer id) {
        StaffAccountDTO dto = accountService.getStaffAccountById(id);
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<AccountDTO> updateInternalAccount(@Valid @PathVariable Integer id, @RequestBody StaffAccountDTO dto) {
        return ResponseEntity.ok(accountService.updateStaffAccount(id, dto));
    }

    @GetMapping("/{userId}/orders")
    public ResponseEntity<Page<OrderHistoryDTO>> getOrderHistory(
            @PathVariable Integer userId,
            @RequestParam Optional<String> keyword,
            Pageable pageable) {
        Page<OrderHistoryDTO> dtoPage = orderService.getOrdersByUser(
                userId,
                keyword.orElse(null),
                pageable
        );
        return ResponseEntity.ok(dtoPage);
    }
}