package com.nutrichef.repository;

import com.nutrichef.model.UserInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserInventoryRepository extends JpaRepository<UserInventory, Long> {
    List<UserInventory> findByUserId(Long userId);
    Optional<UserInventory> findByUserIdAndIngredientId(Long userId, Long ingredientId);
}
