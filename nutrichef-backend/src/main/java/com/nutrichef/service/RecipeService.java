package com.nutrichef.service;

import com.nutrichef.dto.IngredientDTO;
import com.nutrichef.dto.RecipeDTO;
import com.nutrichef.dto.RecipeIngredientDTO;
import com.nutrichef.model.Recipe;
import com.nutrichef.repository.RecipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecipeService {

    @Autowired
    private RecipeRepository recipeRepository;

    public List<RecipeDTO> getAllRecipes() {
        return recipeRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public RecipeDTO getRecipeById(Long id) {
        Recipe recipe = recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
        return convertToDTO(recipe);
    }

    public RecipeDTO createRecipe(Recipe recipe) {
        Recipe savedRecipe = recipeRepository.save(recipe);
        return convertToDTO(savedRecipe);
    }

    public RecipeDTO convertToDTO(Recipe recipe) {
        RecipeDTO dto = new RecipeDTO();
        dto.setId(recipe.getId());
        dto.setName(recipe.getName());
        dto.setDescription(recipe.getDescription());
        dto.setCalories(recipe.getCalories());
        dto.setProtein(recipe.getProtein());
        dto.setCarbs(recipe.getCarbs());
        dto.setFats(recipe.getFats());
        dto.setImageUrl(recipe.getImageUrl());

        if (recipe.getRecipeIngredients() != null) {
            List<RecipeIngredientDTO> ingredientDTOs = recipe.getRecipeIngredients().stream()
                    .map(ri -> {
                        IngredientDTO ingDTO = new IngredientDTO(
                                ri.getIngredient().getId(),
                                ri.getIngredient().getName(),
                                ri.getIngredient().getCategory()
                        );
                        return new RecipeIngredientDTO(ri.getId(), ingDTO, ri.getQuantity(), ri.getUnit());
                    })
                    .collect(Collectors.toList());
            dto.setIngredients(ingredientDTOs);
        }
        return dto;
    }
}
