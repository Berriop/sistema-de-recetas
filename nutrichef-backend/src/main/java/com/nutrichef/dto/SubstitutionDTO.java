package com.nutrichef.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubstitutionDTO {
    private Long id;
    private IngredientDTO originalIngredient;
    private IngredientDTO substituteIngredient;
}
