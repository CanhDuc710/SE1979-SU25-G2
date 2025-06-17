package org.example.se1979su25g2be.service.account;

import org.example.se1979su25g2be.dto.Account.AccountDTO;
import org.example.se1979su25g2be.dto.Account.AccountDetailDTO;
import org.springframework.data.domain.Page;

public interface AccountService {

    Page<AccountDTO> getAllAccounts(String keyword, String status, String role, int page, int size);
    AccountDTO banAccount(Integer id);
    AccountDTO unbanAccount(Integer id);
    AccountDetailDTO getAccountDetail(Integer id);
}
