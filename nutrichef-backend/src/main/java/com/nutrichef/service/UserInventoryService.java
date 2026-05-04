package com.nutrichef.service;

import com.nutrichef.model.Ingredient;
import com.nutrichef.model.User;
import com.nutrichef.model.UserInventory;
import com.nutrichef.repository.IngredientRepository;
import com.nutrichef.repository.UserInventoryRepository;
import com.nutrichef.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserInventoryService {

    private final UserInventoryRepository userInventoryRepository;
    private final UserRepository userRepository;
    private final IngredientRepository ingredientRepository;

    @Autowired
    public UserInventoryService(UserInventoryRepository userInventoryRepository, 
                                UserRepository userRepository,
                                IngredientRepository ingredientRepository) {
        this.userInventoryRepository = userInventoryRepository;
        this.userRepository = userRepository;
        this.ingredientRepository = ingredientRepository;
    }

    public UserInventory addIngredientToInventory(UserInventory userInventory) {
        if (userInventory.getUser() == null || userInventory.getUser().getId() == null) {
            throw new IllegalArgumentException("User ID is required");
        }
        if (userInventory.getIngredient() == null || userInventory.getIngredient().getId() == null) {
            throw new IllegalArgumentException("Ingredient ID is required");
        }

        User user = userRepository.findById(userInventory.getUser().getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        
        Ingredient ingredient = ingredientRepository.findById(userInventory.getIngredient().getId())
                .orElseThrow(() -> new IllegalArgumentException("Ingredient not found"));

        userInventory.setUser(user);
        userInventory.setIngredient(ingredient);

        // Check if ingredient already in inventory
        Optional<UserInventory> existing = userInventoryRepository
                .findByUserIdAndIngredientId(user.getId(), ingredient.getId());
        
        if (existing.isPresent()) {
            UserInventory toUpdate = existing.get();
            toUpdate.setQuantity(toUpdate.getQuantity() + userInventory.getQuantity());
            return userInventoryRepository.save(toUpdate);
        }

        return userInventoryRepository.save(userInventory);
    }

    public List<UserInventory> getUserInventory(Long userId) {
        return userInventoryRepository.findByUserId(userId);
    }

    public void removeIngredientFromInventory(Long id) {
        userInventoryRepository.deleteById(id);
    }
}
