package com.example.groceryecommerce.model;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // උදා: අල, පරිප්පු, සීනි
    private double weight; // උදා: 1kg, 500g (weight එක කිලෝ ග්‍රෑම් හෝ ග්‍රෑම් වලින්)
    private double price; // අදාළ බරට අදාළ මිල

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getWeight() { return weight; }
    public void setWeight(double weight) { this.weight = weight; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
}
