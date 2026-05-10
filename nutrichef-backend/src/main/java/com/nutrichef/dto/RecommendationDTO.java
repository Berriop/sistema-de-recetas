package com.nutrichef.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationDTO {
    private RecipeDTO recipe;
    private Double matchPercentage;
    private Integer matchedIngredientsCount;
    private Integer totalIngredientsCount;
}
