package com.anistreet.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anistreet.backend.model.User;
import com.anistreet.backend.repository.CartRepository;
import com.anistreet.backend.repository.FavoriteRepository;
import com.anistreet.backend.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin
public class UserController {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final FavoriteRepository favoriteRepository;
   
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id,@RequestBody Map<String, String> body ) {

    User user =
            userRepository.findById(id)
                    .orElseThrow();

    String currentUser =
            SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getName();

    //Нельзя менять себе роль
    if (user.getLogin().equals(currentUser)) {

        return ResponseEntity
                .badRequest()
                .body("Нельзя менять свою роль");
    }

    user.setName(body.get("name"));
    user.setRole(body.get("role"));

    return ResponseEntity.ok( userRepository.save(user)
    );
    }

    @Transactional
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {

    User user =
            userRepository.findById(id)
                    .orElseThrow();

    String currentUser =
            SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getName();

    //Нельзя удалить себя
    if (user.getLogin().equals(currentUser)) {
        return ResponseEntity.badRequest().body("Нельзя удалить самого себя");
    }

    //Удаляем корзину
    cartRepository.deleteByUserLogin( user.getLogin());
    //Удаляем избранное
    favoriteRepository.deleteByUserLogin(user.getLogin() );
    //Удаляем пользователя
    userRepository.delete(user);

    return ResponseEntity.ok().build();
}
}