package com.anistreet.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.anistreet.backend.model.Product;

public interface ProductRepository
    extends JpaRepository<Product, Long> {

    List<Product> findByCategory(
        String category
    );

    List<Product> findTop6ByOrderByIdDesc();

    @Query("""
        SELECT p
        FROM Product p
        WHERE LOWER(p.name)
        LIKE LOWER(CONCAT('%', :name, '%'))
    """)
    List<Product> searchByName(
        @Param("name") String name
    );
}