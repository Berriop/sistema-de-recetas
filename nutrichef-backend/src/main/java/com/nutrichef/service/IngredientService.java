package com.nutrichef.service;

import com.nutrichef.model.Ingredient;
import com.nutrichef.repository.IngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class IngredientService {

    private final IngredientRepository ingredientRepository;

    @Autowired
    public IngredientService(IngredientRepository ingredientRepository) {
        this.ingredientRepository = ingredientRepository;
    }

    public Ingredient createIngredient(Ingredient ingredient) {
        Optional<Ingredient> existingIngredient = ingredientRepository.findByNameIgnoreCase(ingredient.getName());
        if (existingIngredient.isPresent()) {
            throw new IllegalArgumentException("Ingredient already exists");
        }
        return ingredientRepository.save(ingredient);
    }

    public List<Ingredient> getAllIngredients() {
        return ingredientRepository.findAll();
    }
}
