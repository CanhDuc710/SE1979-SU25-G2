package org.example.se1979su25g2be.controller;

import lombok.RequiredArgsConstructor;
import org.example.se1979su25g2be.dto.CollectionDTO;
import org.example.se1979su25g2be.service.CollectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/collections")
@CrossOrigin("*")
public class CollectionController {

    private final CollectionService collectionService;

    public CollectionController(CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    @GetMapping
    public ResponseEntity<List<CollectionDTO>> getAllCollections() {
        return ResponseEntity.ok(
                collectionService.getAllCollections().stream().map(CollectionDTO::fromEntity).toList()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<CollectionDTO> getCollection(@PathVariable Integer id) {
        return ResponseEntity.ok(
                CollectionDTO.fromEntity(collectionService.getById(id))
        );
    }
    @PutMapping("/{id}/banner")
    public ResponseEntity<String> updateBanner(
            @PathVariable Integer id,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            String filename = collectionService.updateBannerImage(id, file);
            return ResponseEntity.ok(filename); // trả về đường dẫn banner mới
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body("Không thể upload ảnh");
        }
    }

}
