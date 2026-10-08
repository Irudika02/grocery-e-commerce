package com.example.groceryecommerce.controller;

import com.example.groceryecommerce.model.User;
import com.example.groceryecommerce.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Register වෙන්න API Endpoint එක: POST http://localhost:8080/api/users/register
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User savedUser = userService.registerUser(user);
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginData) {
        return userService.findByEmail(loginData.getEmail())
                .map(user -> {
                    if (user.getPassword().equals(loginData.getPassword())) {
                        return ResponseEntity.ok("Login successful!");
                    } else {
                        return ResponseEntity.badRequest().body("Invalid password!");
                    }
                })
                .orElse(ResponseEntity.badRequest().body("User not found!"));
    }

}

