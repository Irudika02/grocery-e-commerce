package com.example.groceryecommerce.controller;

import com.example.groceryecommerce.model.Order;
import com.example.groceryecommerce.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    // 1. සියලුම Orders ලබා ගැනීම
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // 2. අලුත් Order එකක් Save කිරීම (විකුණුමක් සිදු වූ විට)
    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        double profit = order.getTotalPrice() - order.getTotalCost();
        order.setTotalProfit(profit);

        return orderRepository.save(order);
    }


}
