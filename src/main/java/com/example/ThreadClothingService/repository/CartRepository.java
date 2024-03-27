package com.example.ThreadClothingService.repository;
import com.example.ThreadClothingService.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
public interface CartRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(Long userId);
    boolean existsByIdAndUserId(Long cartItemId, Long userId);
}
