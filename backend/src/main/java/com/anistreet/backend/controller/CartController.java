package com.anistreet.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anistreet.backend.model.CartItem;
import com.anistreet.backend.service.CartService;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @PostMapping("/add")
    public void addToCart(
            @RequestBody Map<String, Object> body
    ) {

        String login = (String) body.get("login");

        Long productId =
                Long.valueOf(body.get("productId").toString());

        cartService.addToCart(login, productId);
    }

    @GetMapping("/{login}")
    public List<CartItem> getCart(
            @PathVariable String login
    ) {

        return cartService.getCart(login);
    }

    @DeleteMapping("/remove")
    public void removeFromCart(
            @RequestBody Map<String, Object> body
    ) {

        String login = (String) body.get("login");

        Long productId =
                Long.valueOf(body.get("productId").toString());

        cartService.removeFromCart(login, productId);
    }


    @PostMapping("/increase")
    public void increase(
        @RequestBody Map<String, Object> body
    ) {

    String login = (String) body.get("login");

    Long productId =
            Long.valueOf(body.get("productId").toString());

    cartService.increase(login, productId);
    }
    @PostMapping("/decrease")
    public void decrease(
        @RequestBody Map<String, Object> body
    ) {

    String login = (String) body.get("login");

    Long productId =
            Long.valueOf(body.get("productId").toString());

    cartService.decrease(login, productId);
    }

}


