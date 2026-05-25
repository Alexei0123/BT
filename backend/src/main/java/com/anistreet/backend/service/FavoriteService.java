package com.anistreet.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.anistreet.backend.model.Favorite;
import com.anistreet.backend.repository.FavoriteRepository;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;

    public FavoriteService(
            FavoriteRepository favoriteRepository
    ) {
        this.favoriteRepository = favoriteRepository;
    }

    public void toggleFavorite(
            String login,
            Long productId
    ) {

        Optional<Favorite> existing =
                favoriteRepository
                        .findByUserLoginAndProductId(
                                login,
                                productId
                        );

        if (existing.isPresent()) {
            favoriteRepository.delete(existing.get());
        } else {
            Favorite favorite =
                    new Favorite(
                            login,
                            productId
                    );
                    
            favoriteRepository.save(favorite);
        }
    }

    public List<Favorite> getFavorites(
            String login
    ) {

        return favoriteRepository
                .findByUserLogin(login);
    }

    public void removeFavorite(
            String login,
            Long productId
    ) {

        favoriteRepository
                .deleteByUserLoginAndProductId(
                        login,
                        productId
                );
    }
}