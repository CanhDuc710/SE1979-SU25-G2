// AddressSyncController.java
package org.example.se1979su25g2be.controller;

import org.example.se1979su25g2be.service.AddressSyncService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/address-sync")
public class AddressSyncController {

    private final AddressSyncService addressSyncService;

    public AddressSyncController(AddressSyncService addressSyncService) {
        this.addressSyncService = addressSyncService;
    }

    @PostMapping("/provinces-districts")
    public String syncProvincesAndDistricts() {
        addressSyncService.syncProvincesAndDistricts();
        return "Sync completed";
    }
}