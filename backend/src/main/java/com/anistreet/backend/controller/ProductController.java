package com.anistreet.backend.controller;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.anistreet.backend.model.Product;
import com.anistreet.backend.repository.CartRepository;
import com.anistreet.backend.repository.FavoriteRepository;
import com.anistreet.backend.repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin
public class ProductController {
    
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final FavoriteRepository favoriteRepository;

    @GetMapping
    public List<Product> getAll() {
        return productRepository.findAll();
    }

    @GetMapping("/search")
    public List<Product> search(@RequestParam String name) {
        return productRepository.searchByName(name);
    }

    @GetMapping("/category/{category}")
    public List<Product> byCategory(@PathVariable String category) {
        return productRepository.findByCategory(category);
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @GetMapping("/new")
    public List<Product> getNewProducts() {
        return productRepository.findTop6ByOrderByIdDesc();
    }

@Transactional
@DeleteMapping("/{id}")
public ResponseEntity<?> deleteProduct(@PathVariable Long id) {

    if (!productRepository.existsById(id)) {
        return ResponseEntity.notFound().build();
    }

    cartRepository.deleteByProductId(id);

    favoriteRepository.deleteByProductId(id);

    productRepository.deleteById(id);

    return ResponseEntity.ok().build();
}
    
@PutMapping("/{id}")
public ResponseEntity<?> updateProduct(

        @PathVariable Long id,

        @RequestParam String name,

        @RequestParam String description,

        @RequestParam Double price,

        @RequestParam String category,

        @RequestParam(required = false)
        MultipartFile image
) {

    try {

        Product product =
                productRepository.findById(id)
                .orElse(null);

        if (product == null) {

            return ResponseEntity
                    .notFound()
                    .build();
        }

        product.setName(name);

        product.setDescription(description);

        product.setPrice(price);

        product.setCategory(category);

        // новая картинка
        if (image != null && !image.isEmpty()) {

            String uploadDir =
                    System.getProperty("user.dir")
                    + "/uploads/images/";

            File dir = new File(uploadDir);

            if (!dir.exists()) {
                dir.mkdirs();
            }

            String fileName =
                    System.currentTimeMillis()
                    + "_"
                    + image.getOriginalFilename();

            Path filePath =
                    Paths.get(uploadDir, fileName);

            Files.copy(
                    image.getInputStream(),
                    filePath
            );

            product.setImageUrl(
                    "/images/" + fileName
            );
        }

        productRepository.save(product);

        return ResponseEntity.ok(
                "Товар обновлён"
        );

    } catch (Exception e) {

        e.printStackTrace();

        return ResponseEntity
                .status(500)
                .body("Ошибка");
    }
}


    @PostMapping
    public ResponseEntity<?> createProduct(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam Double price,
            @RequestParam String category,
            @RequestParam(required = false) MultipartFile image
    ) {

        try {
            Product product = new Product();

            product.setName(name);
            product.setDescription(description);
            product.setPrice(price);
            product.setCategory(category);

            if (image != null && !image.isEmpty()) {
                String uploadDir = System.getProperty("user.dir") + "/uploads/images/";
                File dir = new File(uploadDir);

                if (!dir.exists()) {
                    dir.mkdirs();
                }

                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path filePath = Paths.get(uploadDir, fileName);
                Files.copy(image.getInputStream(), filePath);
                product.setImageUrl("/images/" + fileName);
            }
            productRepository.save(product);
            return ResponseEntity.ok("Товар добавлен");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ошибка загрузки");
        }
    }
}