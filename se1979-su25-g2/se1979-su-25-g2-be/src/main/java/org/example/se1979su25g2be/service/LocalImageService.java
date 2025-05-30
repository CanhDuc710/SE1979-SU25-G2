package org.example.se1979su25g2be.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class LocalImageService {

    private final String uploadDir = "uploads/images";

    public String saveImage(MultipartFile file) throws IOException {
        Files.createDirectories(Paths.get(uploadDir));

        String fileName = UUID.randomUUID().toString() + "-" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadDir, fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Trả về URL truy cập
        return "/images/" + fileName;
    }
}

