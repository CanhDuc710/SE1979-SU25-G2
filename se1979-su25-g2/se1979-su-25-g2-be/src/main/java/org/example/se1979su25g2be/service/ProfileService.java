package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.dto.Account.AccountDetailDTO;
import org.example.se1979su25g2be.dto.Account.UpdateProfileDTO;

public interface ProfileService {
    AccountDetailDTO getMyProfile(Integer userId);
    AccountDetailDTO updateMyProfile(Integer userId, UpdateProfileDTO dto);
}