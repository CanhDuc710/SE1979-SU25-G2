package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.dto.CollectionDTO;
import org.example.se1979su25g2be.entity.Collection;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface CollectionService {
    List<Collection> getAllCollections();
    Collection getById(Integer id);
    Collection createCollection(CollectionDTO collectionDTO);
    Collection updateCollection(Integer id, CollectionDTO collectionDTO);
    void deleteCollection(Integer id);
    String updateBannerImage(Integer collectionId, MultipartFile file) throws IOException;
    Collection addProductToCollection(Integer collectionId, Integer productId);
    Collection removeProductFromCollection(Integer collectionId, Integer productId);
}
