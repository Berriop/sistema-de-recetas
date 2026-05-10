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
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired private UserInventoryRepository userInventoryRepository;
    @Autowired private RecipeRepository recipeRepository;
    @Autowired private RecipeService recipeService;

    /**
     * Calcula recomendaciones por PRESENCIA de ingredientes (no compara cantidades).
     * El score = ingredientes_match / total_ingredientes_receta × 100.
     * Mejora futura: comparar también las cantidades disponibles vs requeridas.
     */
    @Transactional(readOnly = true)
    public List<RecommendationDTO> getRecommendationsForUser(Long userId) {
        List<UserInventory> userInventory = userInventoryRepository.findByUserId(userId);

        // Solo IDs de ingredientes que el usuario tiene
        Set<Long> userIngredientIds = userInventory.stream()
                .map(ui -> ui.getIngredient().getId())
                .collect(Collectors.toSet());

        List<Recipe> allRecipes = recipeRepository.findAll();
        List<RecommendationDTO> recommendations = new ArrayList<>();

        for (Recipe recipe : allRecipes) {
            List<RecipeIngredient> recipeIngredients = recipe.getRecipeIngredients();
            if (recipeIngredients == null || recipeIngredients.isEmpty()) continue;

            long matchCount = recipeIngredients.stream()
                    .filter(ri -> userIngredientIds.contains(ri.getIngredient().getId()))
                    .count();

            double matchPct = (double) matchCount / recipeIngredients.size() * 100.0;

            RecipeDTO recipeDTO = recipeService.convertToDTO(recipe);
            recommendations.add(new RecommendationDTO(
                    recipeDTO,
                    matchPct,
                    (int) matchCount,
                    recipeIngredients.size()
            ));
        }

        // Mayor coincidencia primero; si hay empate, menos ingredientes faltantes primero
        recommendations.sort(Comparator
                .comparingDouble(RecommendationDTO::getMatchPercentage).reversed()
                .thenComparingInt(r -> r.getTotalIngredientsCount() - r.getMatchedIngredientsCount()));

        return recommendations;
    }
}
