package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.entity.Store;
import org.example.se1979su25g2be.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StoreServiceImpl implements StoreService {

    @Autowired
    private StoreRepository storeRepository;

    @Override
    public Store saveStore(Store store) {
        return storeRepository.save(store);
    }

    @Override
    public Store getStore() {
        return storeRepository.findById(1L).orElse(null);
    }
}
