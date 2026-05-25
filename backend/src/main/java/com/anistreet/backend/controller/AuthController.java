package com.anistreet.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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

        //Проверка логина
        if (userRepository.findByLogin(user.getLogin()).isPresent()) {
            return "LOGIN_TAKEN";
        }

        //Проверка длины логина
        if (user.getLogin() == null || user.getLogin().length() < 3) {
            return "LOGIN_TOO_SHORT";
        }

        //Проверка имени
        if (user.getName() == null || user.getName().isEmpty()) {
            return "NAME_REQUIRED";
        }

        //Проверка ключевого слова
        if (user.getKeyWord() == null || user.getKeyWord().isEmpty()) {
            return "KEYWORD_REQUIRED";
        }

        //Проверка пароля
        if (user.getPasswordHash() == null || user.getPasswordHash().isEmpty()) {
            return "PASSWORD_REQUIRED";
        }

        //Хэшируем пароль
        user.setPasswordHash(
                encoder.encode(user.getPasswordHash())
        );

        //Сохраняем пользователя
        userRepository.save(user);

        return "REGISTERED";
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {

        User dbUser = userRepository.findByLogin(user.getLogin()).orElse(null);

        if (dbUser == null) {
            return "USER_NOT_FOUND";
        }

        //Проверка пароля
        if (encoder.matches(user.getPasswordHash(),dbUser.getPasswordHash())) {
            return dbUser.getRole();
        }

        return "INVALID_PASSWORD";
    }

    @PostMapping("/forgot")
    public String forgot(@RequestBody User user) {

        User dbUser = userRepository.findByLogin(user.getLogin()).orElse(null);

        if (dbUser == null) {
            return "NOT_FOUND";
        }

        //Проверка ключевого слова
        if (!dbUser.getKeyWord().equals(user.getKeyWord())) {
            return "WRONG_KEYWORD";
        }

        //Новый пароль
        if (user.getPasswordHash() == null ||
                user.getPasswordHash().isEmpty()) {

            return "PASSWORD_REQUIRED";
        }

        //Обновляем пароль
        dbUser.setPasswordHash(encoder.encode(user.getPasswordHash()));

        userRepository.save(dbUser);

        return "PASSWORD_CHANGED";
    }

    @GetMapping("/me")
    public ResponseEntity<?> getUserInfo(@RequestParam String login) {

        User user = userRepository.findByLogin(login).orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).body("USER_NOT_FOUND");
        }

        return ResponseEntity.ok(
                new UserInfo(
                        user.getLogin(),
                        user.getName(),
                        user.getKeyWord(),
                        user.getRole()
                )
        );
    }

    public static class UserInfo {
        public String login;
        public String name;
        public String keyWord;
        public String role;

        public UserInfo(
                String login,
                String name,
                String keyWord,
                String role
        ) {
            this.login = login;
            this.name = name;
            this.keyWord = keyWord;
            this.role = role;
        }
    }
}
