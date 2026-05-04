package com.nutrichef.controller;

import com.nutrichef.dto.RecipeDTO;
import com.nutrichef.model.FavoriteRecipe;
import com.nutrichef.model.Recipe;
import com.nutrichef.model.User;
import com.nutrichef.repository.FavoriteRecipeRepository;
import com.nutrichef.repository.RecipeRepository;
import com.nutrichef.repository.UserRepository;
import com.nutrichef.service.RecipeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteRecipeController {

    @Autowired
    private FavoriteRecipeRepository favoriteRecipeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private RecipeService recipeService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<RecipeDTO>> getFavorites(@PathVariable Long userId) {
        List<FavoriteRecipe> favorites = favoriteRecipeRepository.findByUserId(userId);
        List<RecipeDTO> recipes = favorites.stream()
                .map(f -> recipeService.convertToDTO(f.getRecipe()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(recipes);
    }

    @PostMapping("/{userId}/{recipeId}")
    public ResponseEntity<?> addFavorite(@PathVariable Long userId, @PathVariable Long recipeId) {
        Optional<FavoriteRecipe> existing = favoriteRecipeRepository.findByUserIdAndRecipeId(userId, recipeId);
        if (existing.isPresent()) {
            return ResponseEntity.ok(existing.get()); // Already favorite
        }

        User user = userRepository.findById(userId).orElseThrow();
        Recipe recipe = recipeRepository.findById(recipeId).orElseThrow();

        FavoriteRecipe fav = new FavoriteRecipe();
        fav.setUser(user);
        fav.setRecipe(recipe);

        return new ResponseEntity<>(favoriteRecipeRepository.save(fav), HttpStatus.CREATED);
    }

    @DeleteMapping("/{userId}/{recipeId}")
    public ResponseEntity<?> removeFavorite(@PathVariable Long userId, @PathVariable Long recipeId) {
        Optional<FavoriteRecipe> existing = favoriteRecipeRepository.findByUserIdAndRecipeId(userId, recipeId);
        existing.ifPresent(favoriteRecipeRepository::delete);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
