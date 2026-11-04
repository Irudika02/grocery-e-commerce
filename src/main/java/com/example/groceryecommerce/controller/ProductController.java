package com.example.groceryecommerce.controller;

import com.example.groceryecommerce.model.Product;
import com.example.groceryecommerce.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productRepository.save(product);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        if (productRepository.existsById(id)) {
            productRepository.deleteById(id);
            return ResponseEntity.ok("Product deleted successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found!");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        return productRepository.findById(id)
                .map(product -> {
                    product.setName(updatedProduct.getName());
                    product.setWeight(updatedProduct.getWeight());
                    product.setCostPrice(updatedProduct.getCostPrice());
                    product.setSellingPrice(updatedProduct.getSellingPrice());
                    product.setStockQuantity(updatedProduct.getStockQuantity());
                    Product savedProduct = productRepository.save(product);
                    return ResponseEntity.ok(savedProduct);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

}

