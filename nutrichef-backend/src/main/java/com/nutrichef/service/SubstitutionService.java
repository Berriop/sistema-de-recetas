package com.nutrichef.service;

import com.nutrichef.dto.IngredientDTO;
import com.nutrichef.dto.SubstitutionDTO;
import com.nutrichef.model.IngredientSubstitution;
import com.nutrichef.repository.IngredientSubstitutionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubstitutionService {

    @Autowired
    private IngredientSubstitutionRepository substitutionRepository;

    public List<SubstitutionDTO> getSubstitutionsForIngredient(Long ingredientId) {
        List<IngredientSubstitution> substitutions = substitutionRepository.findByIngredientId(ingredientId);

        return substitutions.stream().map(sub -> {
            IngredientDTO original = new IngredientDTO(
                    sub.getIngredient().getId(),
                    sub.getIngredient().getName(),
                    sub.getIngredient().getCategory()
            );
            IngredientDTO substitute = new IngredientDTO(
                    sub.getSubstituteIngredient().getId(),
                    sub.getSubstituteIngredient().getName(),
                    sub.getSubstituteIngredient().getCategory()
            );
            return new SubstitutionDTO(sub.getId(), original, substitute);
        }).collect(Collectors.toList());
    }
}
