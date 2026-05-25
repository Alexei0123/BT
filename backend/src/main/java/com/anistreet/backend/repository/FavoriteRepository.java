package com.anistreet.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import com.anistreet.backend.model.Favorite;

import jakarta.transaction.Transactional;


public interface FavoriteRepository
    extends JpaRepository<Favorite, Long> {

    List<Favorite> findByUserLogin(String userLogin);

    Optional<Favorite> findByUserLoginAndProductId(
        String userLogin,
        Long productId
    );

    void deleteByUserLoginAndProductId(
        String userLogin,
        Long productId
    );
    
    @Transactional
    @Modifying
    void deleteByProductId(Long productId);

    @Transactional
    @Modifying
    void deleteByUserLogin(String userLogin);
}
