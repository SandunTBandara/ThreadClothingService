package com.example.ThreadClothingService.service;
import com.example.ThreadClothingService.model.CartItem;
import com.example.ThreadClothingService.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {
    private final CartRepository cartRepository;

    @Autowired
    public CartService(CartRepository cartRepository) {
        this.cartRepository = cartRepository;
    }

    // Get items in the cart for a specific user
    public List<CartItem> getCartItemsByUserId(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    // Add an item to the cart
    public CartItem addItemToCart(Long userId, CartItem cartItem) {
        cartItem.setUserId(userId);
        return cartRepository.save(cartItem);
    }

    // Remove an item from the cart
    public boolean removeItemFromCart(Long userId, Long cartItemId) {
        if (cartRepository.existsByIdAndUserId(cartItemId, userId)) {
            cartRepository.deleteById(cartItemId);
            return true;
        }
        return false;
    }

    // Update quantity of an item in the cart
    public CartItem updateCartItemQuantity(Long userId, Long cartItemId, int quantity) {
        if (cartRepository.existsByIdAndUserId(cartItemId, userId)) {
            CartItem cartItem = cartRepository.findById(cartItemId).orElse(null);
            if (cartItem != null) {
                cartItem.setQuantity(quantity);
                return cartRepository.save(cartItem);
            }
        }
        return null;
    }
}
