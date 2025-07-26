package org.example.se1979su25g2be.controller;

import lombok.RequiredArgsConstructor;
import org.example.se1979su25g2be.dto.CollectionDTO;
import org.example.se1979su25g2be.entity.Collection;
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
    @PostMapping
    public ResponseEntity<CollectionDTO> createCollection(@RequestBody CollectionDTO collectionDTO) {
        Collection created = collectionService.createCollection(collectionDTO);
        return ResponseEntity.ok(CollectionDTO.fromEntity(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CollectionDTO> updateCollection(
            @PathVariable Integer id,
            @RequestBody CollectionDTO collectionDTO
    ) {
        Collection updated = collectionService.updateCollection(id, collectionDTO);
        return ResponseEntity.ok(CollectionDTO.fromEntity(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCollection(@PathVariable Integer id) {
        collectionService.deleteCollection(id);
        return ResponseEntity.noContent().build();
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
    
    @PostMapping("/{id}/products")
    public ResponseEntity<CollectionDTO> addProductToCollection(
            @PathVariable Integer id,
            @RequestBody Integer productId
    ) {
        Collection updated = collectionService.addProductToCollection(id, productId);
        return ResponseEntity.ok(CollectionDTO.fromEntity(updated));
    }
    
    @DeleteMapping("/{id}/products/{productId}")
    public ResponseEntity<CollectionDTO> removeProductFromCollection(
            @PathVariable Integer id,
            @PathVariable Integer productId
    ) {
        Collection updated = collectionService.removeProductFromCollection(id, productId);
        return ResponseEntity.ok(CollectionDTO.fromEntity(updated));
    }

}
