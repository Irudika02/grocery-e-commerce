package com.example.groceryecommerce.service;

import com.example.groceryecommerce.model.User;
import com.example.groceryecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // අලුත් User කෙනෙක්ව Register කරගැනීම
    public User registerUser(User user) {
// Email එක කලින් එකතු කරලා තියෙනවද බලනවා
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("මේ Email එකෙන් user කෙනෙක් දැනටමත් ඉන්නවා!");
        }
        return userRepository.save(user);
    }

    // Login වීම සඳහා User කෙනෙක්ව සොයාගැනීම
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}

