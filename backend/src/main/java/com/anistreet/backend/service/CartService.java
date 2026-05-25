package com.anistreet.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.anistreet.backend.model.CartItem;
import com.anistreet.backend.repository.CartRepository;

@Service
public class CartService {

    private final CartRepository cartRepository;

    public CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    public void addToCart(String login, Long productId) {

        Optional<CartItem> existing =
                cartRepository.findByUserLoginAndProductId(
                        login,
                        productId
                );

        if (existing.isPresent()) {
            CartItem item = existing.get();
            item.setQuantity((item.getQuantity() == null ? 0 : item.getQuantity()) + 1);
            cartRepository.save(item);
        } else {
            CartItem item =
                    new CartItem(login, productId, 1);
            cartRepository.save(item);
        }
    }

    public List<CartItem> getCart(String login) {
        return cartRepository.findByUserLogin(login);
    }

    public void removeFromCart(String login, Long productId) {

        cartRepository.deleteByUserLoginAndProductId(
                login,
                productId
        );
    }


    public void increase(String login, Long productId) {

    CartItem item =
            cartRepository
                    .findByUserLoginAndProductId(
                            login,
                            productId
                    )
                    .orElseThrow();

    item.setQuantity(item.getQuantity() + 1);

    cartRepository.save(item);
    }

    public void decrease(String login, Long productId) {

    CartItem item =
            cartRepository
                    .findByUserLoginAndProductId(
                            login,
                            productId
                    )
                    .orElseThrow();

    item.setQuantity(item.getQuantity() - 1);

    if (item.getQuantity() <= 0) {
        cartRepository.delete(item);
    } else {
        cartRepository.save(item);
    }
    }
}