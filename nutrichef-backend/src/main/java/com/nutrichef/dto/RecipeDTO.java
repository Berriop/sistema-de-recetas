package com.nutrichef.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecipeDTO {
    private Long id;
    private String name;
    private String description;
    private Integer calories;
    private Double protein;
    private Double carbs;
    private Double fats;
    private String imageUrl;
    private List<RecipeIngredientDTO> ingredients;
}
