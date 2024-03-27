package com.example.ThreadClothingService.model;
import javax.persistence.*;
import java.util.List;

@Entity
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(cascade = CascadeType.ALL)
    private List<CartItem> items;

    private Long userId;
    private double totalPrice;
    // Add other fields as needed

    // Constructors, getters, and setters

    public Order() {
    }

    public Order(List<CartItem> items, Long userId, double totalPrice) {
        this.items = items;
        this.userId = userId;
        this.totalPrice = totalPrice;
    }

    // Getters and Setters for all fields (including id)

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<CartItem> getItems() {
        return items;
    }

    public void setItems(List<CartItem> items) {
        this.items = items;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }
}
