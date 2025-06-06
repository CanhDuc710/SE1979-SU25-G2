package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.entity.Collection;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface CollectionService {
    List<Collection> getAllCollections();
    Collection getById(Integer id);

    String updateBannerImage(Integer collectionId, MultipartFile file) throws IOException;
}
