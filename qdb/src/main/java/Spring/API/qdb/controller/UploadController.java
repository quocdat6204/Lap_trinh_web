package Spring.API.qdb.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api")
public class UploadController {
    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("image") MultipartFile file) throws IOException {
        String uploadsDir = "uploads/";
        File dir = new File(uploadsDir);
        if (!dir.exists()) dir.mkdirs();

        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadsDir, fileName);
        Files.copy(file.getInputStream(), filePath);

        String imageUrl = "/uploads/" + fileName;
        return ResponseEntity.ok().body(java.util.Map.of("imageUrl", imageUrl));
    }
} 