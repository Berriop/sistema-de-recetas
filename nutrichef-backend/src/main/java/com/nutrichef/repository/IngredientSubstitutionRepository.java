package com.nutrichef.repository;

import com.nutrichef.model.IngredientSubstitution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IngredientSubstitutionRepository extends JpaRepository<IngredientSubstitution, Long> {
    List<IngredientSubstitution> findByIngredientId(Long ingredientId);
}
