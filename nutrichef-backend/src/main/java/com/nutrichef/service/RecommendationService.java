package com.nutrichef.service;

import com.nutrichef.dto.RecommendationDTO;
import com.nutrichef.dto.RecipeDTO;
import com.nutrichef.model.Recipe;
import com.nutrichef.model.RecipeIngredient;
import com.nutrichef.model.UserInventory;
import com.nutrichef.repository.RecipeRepository;
import com.nutrichef.repository.UserInventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private UserInventoryRepository userInventoryRepository;

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private RecipeService recipeService;

    public List<RecommendationDTO> getRecommendationsForUser(Long userId) {
        List<UserInventory> userInventory = userInventoryRepository.findByUserId(userId);
        Set<Long> userIngredientIds = userInventory.stream()
                .map(ui -> ui.getIngredient().getId())
                .collect(Collectors.toSet());

        List<Recipe> allRecipes = recipeRepository.findAll();
        List<RecommendationDTO> recommendations = new ArrayList<>();

        for (Recipe recipe : allRecipes) {
            List<RecipeIngredient> recipeIngredients = recipe.getRecipeIngredients();
            if (recipeIngredients == null || recipeIngredients.isEmpty()) {
                continue; // Skip recipes with no ingredients
            }

            int matchCount = 0;
            for (RecipeIngredient ri : recipeIngredients) {
                if (userIngredientIds.contains(ri.getIngredient().getId())) {
                    matchCount++;
                }
            }

            double matchPercentage = (double) matchCount / recipeIngredients.size() * 100.0;

            RecipeDTO recipeDTO = recipeService.convertToDTO(recipe);
            RecommendationDTO recDTO = new RecommendationDTO(
                    recipeDTO,
                    matchPercentage,
                    matchCount,
                    recipeIngredients.size()
            );

            recommendations.add(recDTO);
        }

        // Sort by match percentage descending
        recommendations.sort(Comparator.comparing(RecommendationDTO::getMatchPercentage).reversed());

        return recommendations;
    }
}
