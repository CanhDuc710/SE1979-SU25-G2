package org.example.se1979su25g2be.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.se1979su25g2be.dto.Account.AccountDetailDTO;
import org.example.se1979su25g2be.dto.Account.UpdateProfileDTO;
import org.example.se1979su25g2be.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @GetMapping("/{userId}")
    public ResponseEntity<AccountDetailDTO> getProfile(@PathVariable Integer userId) {
        return ResponseEntity.ok(profileService.getMyProfile(userId));
    }

    @PutMapping("/{userId}")
    public ResponseEntity<AccountDetailDTO> updateProfile(
            @PathVariable Integer userId,
            @Valid @RequestBody UpdateProfileDTO dto
    ) {
        return ResponseEntity.ok(profileService.updateMyProfile(userId, dto));
    }
}