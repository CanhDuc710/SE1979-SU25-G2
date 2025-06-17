package org.example.se1979su25g2be.service;

import lombok.RequiredArgsConstructor;
import org.example.se1979su25g2be.entity.Collection;
import org.example.se1979su25g2be.repository.CollectionRepository;
import org.example.se1979su25g2be.service.CollectionService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class CollectionServiceImpl implements CollectionService {

    private final CollectionRepository collectionRepository;
    private final LocalImageService localImageService;

    public CollectionServiceImpl(CollectionRepository collectionRepository, LocalImageService localImageService) {
        this.collectionRepository = collectionRepository;
        this.localImageService = localImageService;
    }

    @Override
    public List<Collection> getAllCollections() {
        return collectionRepository.findAll();
    }

    @Override
    public Collection getById(Integer id) {
        return collectionRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("Collection not found with id: " + id)
        );
    }
    @Override
    public String updateBannerImage(Integer collectionId, MultipartFile file) throws IOException {
        Collection collection = collectionRepository.findById(collectionId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy bộ sưu tập"));

        // ✅ Dùng service để lưu ảnh và lấy URL
        String imageUrl = localImageService.saveImage(file);

        collection.setBannerUrl(imageUrl);
        collectionRepository.save(collection);

        return imageUrl;
    }

}
