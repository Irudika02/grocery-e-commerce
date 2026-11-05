package com.example.groceryecommerce.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private double totalPrice; // මුළු විකුණුම් මිල (Revenue)
    private double totalCost; // මුළු තොග මිල (Cost)
    private double totalProfit; // මුළු ලාභය (Profit)

    private LocalDateTime orderDate = LocalDateTime.now();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }

    public double getTotalCost() { return totalCost; }
    public void setTotalCost(double totalCost) { this.totalCost = totalCost; }

    public double getTotalProfit() { return totalProfit; }
    public void setTotalProfit(double totalProfit) { this.totalProfit = totalProfit; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }
}


