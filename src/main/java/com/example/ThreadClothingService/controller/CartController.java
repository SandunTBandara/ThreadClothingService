package com.example.ThreadClothingService.controller;
import com.example.ThreadClothingService.model.CartItem;
import com.example.ThreadClothingService.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;

    @Autowired
    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // Endpoint to get items in the cart for a specific user
    @GetMapping("/{userId}")
    public ResponseEntity<List<CartItem>> getCartItemsByUserId(@PathVariable("userId") Long userId) {
        List<CartItem> cartItems = cartService.getCartItemsByUserId(userId);
        return new ResponseEntity<>(cartItems, HttpStatus.OK);
    }

    // Endpoint to add an item to the cart
    @PostMapping("/{userId}/add")
    public ResponseEntity<CartItem> addItemToCart(@PathVariable("userId") Long userId, @RequestBody CartItem cartItem) {
        CartItem addedCartItem = cartService.addItemToCart(userId, cartItem);
        return new ResponseEntity<>(addedCartItem, HttpStatus.CREATED);
    }

    // Endpoint to remove an item from the cart
    @DeleteMapping("/{userId}/remove/{cartItemId}")
    public ResponseEntity<Void> removeItemFromCart(@PathVariable("userId") Long userId, @PathVariable("cartItemId") Long cartItemId) {
        boolean removed = cartService.removeItemFromCart(userId, cartItemId);
        if (removed) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint to update quantity of an item in the cart
    @PutMapping("/{userId}/update/{cartItemId}")
    public ResponseEntity<CartItem> updateCartItemQuantity(@PathVariable("userId") Long userId, @PathVariable("cartItemId") Long cartItemId, @RequestParam("quantity") int quantity) {
        CartItem updatedCartItem = cartService.updateCartItemQuantity(userId, cartItemId, quantity);
        if (updatedCartItem != null) {
            return new ResponseEntity<>(updatedCartItem, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
