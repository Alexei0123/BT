package com.anistreet.backend.controller;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.anistreet.backend.model.User;
import com.anistreet.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;

    @PostMapping("/register")
    public String register(@RequestBody User user) {

        if (userRepository.findByLogin(user.getLogin()).isPresent()) {
            return "LOGIN_TAKEN";
        }

        if (user.getLogin().length() < 3) {
            return "LOGIN_TOO_SHORT";
        }

        if (user.getKeyWord() == null || user.getKeyWord().isEmpty()) {
            return "KEYWORD_REQUIRED";
        }

        user.setPasswordHash(encoder.encode(user.getPasswordHash()));

        userRepository.save(user);

        return "REGISTERED";
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {

        User dbUser = userRepository.findByLogin(user.getLogin())
                .orElse(null);

        if (dbUser == null) {
            return "USER NOT FOUND";
        }

        if (encoder.matches(user.getPasswordHash(), dbUser.getPasswordHash())) {
            return "OK";
        }

        return "INVALID PASSWORD";
    }

    @PostMapping("/forgot")
    public String forgot(@RequestBody User user) {

        User dbUser = userRepository.findByLogin(user.getLogin())
                .orElse(null);

        if (dbUser == null) {
            return "NOT_FOUND";
        }

        if (!dbUser.getKeyWord().equals(user.getKeyWord())) {
            return "WRONG_KEYWORD";
        }

        dbUser.setPasswordHash(encoder.encode(user.getPasswordHash()));
        userRepository.save(dbUser);

        return "PASSWORD_CHANGED";
    }
}