package org.example.se1979su25g2be.controller;

import lombok.RequiredArgsConstructor;
import org.example.se1979su25g2be.dto.Account.AccountDTO;
import org.example.se1979su25g2be.dto.Account.AccountDetailDTO;
import org.example.se1979su25g2be.dto.Account.StaffAccountDTO;
import org.example.se1979su25g2be.service.account.AccountService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/admin/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

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

    @PostMapping
    public ResponseEntity<AccountDTO> createStaffAccount(@RequestBody StaffAccountDTO dto) {
        return ResponseEntity.ok(accountService.createStaffAccount(dto));
    }


}
