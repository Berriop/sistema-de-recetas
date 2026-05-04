package com.nutrichef.repository;

import com.nutrichef.model.FavoriteRecipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRecipeRepository extends JpaRepository<FavoriteRecipe, Long> {
    List<FavoriteRecipe> findByUserId(Long userId);
    Optional<FavoriteRecipe> findByUserIdAndRecipeId(Long userId, Long recipeId);
}
