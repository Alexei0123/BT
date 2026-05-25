package com.anistreet.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;

import com.anistreet.backend.model.CartItem;

import jakarta.transaction.Transactional;

public interface CartRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUserLogin(String userLogin);

    Optional<CartItem> findByUserLoginAndProductId(
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

