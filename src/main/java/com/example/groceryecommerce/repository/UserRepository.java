package com.example.groceryecommerce.repository;

import com.example.groceryecommerce.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Email එකෙන් User කෙනෙක්ව සොයාගැනීමට (Login එකේදී අවශ්‍ය වේ)
    Optional<User> findByEmail(String email);
}
