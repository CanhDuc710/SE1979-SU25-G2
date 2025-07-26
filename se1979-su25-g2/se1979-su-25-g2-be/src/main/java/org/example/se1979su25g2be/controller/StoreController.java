package org.example.se1979su25g2be.controller;

import org.example.se1979su25g2be.entity.Store;
import org.example.se1979su25g2be.service.StoreService;
import org.example.se1979su25g2be.service.LocalImageService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid; // Import này để sử dụng @Valid
import java.util.Map; // Import này để dùng Map.of

@RestController
@RequestMapping("/api/admin/setting/storeInformation")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StoreController {

    private final StoreService storeService;
    private final LocalImageService localImageService;

    @GetMapping
    public Store getStore() {
        return storeService.getStore();
    }

    @PutMapping
    public ResponseEntity<?> updateStore(@Valid @RequestBody Store store) {
        try {
            Store existingStore = storeService.getStore();
            if (existingStore != null) {
                // Update existing store
                existingStore.setStoreName(store.getStoreName());
                existingStore.setEmail(store.getEmail());
                existingStore.setPhone(store.getPhone());
                existingStore.setAddress(store.getAddress());
                existingStore.setDescription(store.getDescription());
                existingStore.setFanpage(store.getFanpage());
                storeService.saveStore(existingStore);
                return ResponseEntity.ok(Map.of("message", "Thông tin cửa hàng đã được cập nhật thành công."));
            } else {
                // Create new store if none exists
                Store newStore = new Store();
                newStore.setStoreName(store.getStoreName());
                newStore.setEmail(store.getEmail());
                newStore.setPhone(store.getPhone());
                newStore.setAddress(store.getAddress());
                newStore.setDescription(store.getDescription());
                newStore.setFanpage(store.getFanpage());
                storeService.saveStore(newStore);
                return ResponseEntity.ok(Map.of("message", "Thông tin cửa hàng đã được tạo thành công."));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Cập nhật thông tin cửa hàng thất bại: " + e.getMessage()));
        }
    }

    @PutMapping("/upload-logo")
    public ResponseEntity<?> updateLogo(@RequestParam("logo") MultipartFile logoFile) {
        try {
            String imagePath = localImageService.saveImage(logoFile);
            Store store = storeService.getStore();
            if (store != null) {
                store.setLogo(imagePath);
                storeService.saveStore(store);
                return ResponseEntity.ok(Map.of("message", "Logo đã được tải lên và cập nhật thành công.", "logoUrl", imagePath));
            } else {
                // Create new store with logo if none exists
                Store newStore = Store.builder()
                        .storeName("My Store") // Set tên mặc định để tránh validation error
                        .logo(imagePath)
                        .build();
                storeService.saveStore(newStore);
                return ResponseEntity.ok(Map.of("message", "Cửa hàng đã được tạo và logo đã được tải lên thành công.", "logoUrl", imagePath));
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Tải lên logo thất bại: " + e.getMessage()));
        }
    }
}

