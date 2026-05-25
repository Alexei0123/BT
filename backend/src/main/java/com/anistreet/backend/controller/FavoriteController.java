package com.anistreet.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anistreet.backend.model.Favorite;
import com.anistreet.backend.service.FavoriteService;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(
            FavoriteService favoriteService
    ) {
        this.favoriteService = favoriteService;
    }

    @PostMapping("/toggle")
    public void toggleFavorite(
            @RequestBody Map<String, Object> body
    ) {

        String login =
                (String) body.get("login");

        Long productId =
                Long.valueOf(
                        body.get("productId")
                                .toString()
                );

        favoriteService.toggleFavorite(
                login,
                productId
        );
    }

    @GetMapping("/{login}")
    public List<Favorite> getFavorites(
            @PathVariable String login
    ) {

        return favoriteService.getFavorites(login);
    }
}