package com.nutrichef.config;

import com.nutrichef.model.*;
import com.nutrichef.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private RecipeRepository recipeRepository;

    @Autowired
    private IngredientSubstitutionRepository substitutionRepository;

    @Override
    public void run(String... args) throws Exception {
        if (recipeRepository.count() == 0) {
            seedData();
        }
    }

    private void seedData() {
        Ingredient pollo = getOrCreateIngredient("pollo", "Proteína");
        Ingredient arroz = getOrCreateIngredient("arroz", "Carbohidrato");
        Ingredient tomate = getOrCreateIngredient("tomate", "Vegetal");
        Ingredient cebolla = getOrCreateIngredient("cebolla", "Vegetal");
        Ingredient huevo = getOrCreateIngredient("huevo", "Proteína");
        Ingredient leche = getOrCreateIngredient("leche", "Lácteo");
        Ingredient lecheAlmendras = getOrCreateIngredient("leche de almendras", "Lácteo/Vegano");
        Ingredient banana = getOrCreateIngredient("banana", "Fruta");
        Ingredient avena = getOrCreateIngredient("avena", "Carbohidrato");
        Ingredient espinaca = getOrCreateIngredient("espinaca", "Vegetal");
        Ingredient mantequilla = getOrCreateIngredient("mantequilla", "Grasa");
        Ingredient aceiteOliva = getOrCreateIngredient("aceite de oliva", "Grasa");

        if (substitutionRepository.count() == 0) {
            substitutionRepository.save(new IngredientSubstitution(null, huevo, banana));
            substitutionRepository.save(new IngredientSubstitution(null, leche, lecheAlmendras));
            substitutionRepository.save(new IngredientSubstitution(null, mantequilla, aceiteOliva));
        }

        Recipe r1 = new Recipe();
        r1.setName("Arroz con pollo");
        r1.setDescription("Un plato clásico y nutritivo, alto en proteínas y carbohidratos complejos.");
        r1.setCalories(450);
        r1.setProtein(35.0);
        r1.setCarbs(45.0);
        r1.setFats(12.0);
        r1.setImageUrl("https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
        r1.getRecipeIngredients().add(new RecipeIngredient(null, r1, pollo, 200.0, "g"));
        r1.getRecipeIngredients().add(new RecipeIngredient(null, r1, arroz, 100.0, "g"));
        r1.getRecipeIngredients().add(new RecipeIngredient(null, r1, tomate, 1.0, "unidad"));
        r1.getRecipeIngredients().add(new RecipeIngredient(null, r1, cebolla, 0.5, "unidad"));
        recipeRepository.save(r1);


        Recipe r2 = new Recipe();
        r2.setName("Tortilla saludable");
        r2.setDescription("Perfecta para el desayuno. Llena de proteínas y vitaminas.");
        r2.setCalories(300);
        r2.setProtein(20.0);
        r2.setCarbs(10.0);
        r2.setFats(18.0);
        r2.setImageUrl("https://images.unsplash.com/photo-1510693206972-df098062cb71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
        r2.getRecipeIngredients().add(new RecipeIngredient(null, r2, huevo, 3.0, "unidades"));
        r2.getRecipeIngredients().add(new RecipeIngredient(null, r2, espinaca, 50.0, "g"));
        r2.getRecipeIngredients().add(new RecipeIngredient(null, r2, tomate, 0.5, "unidad"));
        recipeRepository.save(r2);

        Recipe r3 = new Recipe();
        r3.setName("Batido proteico");
        r3.setDescription("Ideal para después de entrenar.");
        r3.setCalories(350);
        r3.setProtein(25.0);
        r3.setCarbs(40.0);
        r3.setFats(8.0);
        r3.setImageUrl("https://images.unsplash.com/photo-1556881286-fc6915169721?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
        r3.getRecipeIngredients().add(new RecipeIngredient(null, r3, leche, 250.0, "ml"));
        r3.getRecipeIngredients().add(new RecipeIngredient(null, r3, banana, 1.0, "unidad"));
        r3.getRecipeIngredients().add(new RecipeIngredient(null, r3, avena, 30.0, "g"));
        recipeRepository.save(r3);

        Recipe r4 = new Recipe();
        r4.setName("Ensalada fitness");
        r4.setDescription("Ligera, fresca y con pechuga de pollo a la plancha.");
        r4.setCalories(280);
        r4.setProtein(30.0);
        r4.setCarbs(15.0);
        r4.setFats(10.0);
        r4.setImageUrl("https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
        r4.getRecipeIngredients().add(new RecipeIngredient(null, r4, pollo, 150.0, "g"));
        r4.getRecipeIngredients().add(new RecipeIngredient(null, r4, espinaca, 100.0, "g"));
        r4.getRecipeIngredients().add(new RecipeIngredient(null, r4, tomate, 1.0, "unidad"));
        r4.getRecipeIngredients().add(new RecipeIngredient(null, r4, aceiteOliva, 1.0, "cda"));
        recipeRepository.save(r4);

        Recipe r5 = new Recipe();
        r5.setName("Avena con frutas");
        r5.setDescription("Energía de lenta absorción para empezar el día.");
        r5.setCalories(320);
        r5.setProtein(12.0);
        r5.setCarbs(55.0);
        r5.setFats(6.0);
        r5.setImageUrl("https://images.unsplash.com/photo-1517673132405-a56a62b18caf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80");
        r5.getRecipeIngredients().add(new RecipeIngredient(null, r5, avena, 50.0, "g"));
        r5.getRecipeIngredients().add(new RecipeIngredient(null, r5, leche, 200.0, "ml"));
        r5.getRecipeIngredients().add(new RecipeIngredient(null, r5, banana, 0.5, "unidad"));
        recipeRepository.save(r5);
    }

    private Ingredient getOrCreateIngredient(String name, String category) {
        Optional<Ingredient> existing = ingredientRepository.findByNameIgnoreCase(name);
        if (existing.isPresent()) {
            return existing.get();
        }
        Ingredient ingredient = new Ingredient();
        ingredient.setName(name);
        ingredient.setCategory(category);
        return ingredientRepository.save(ingredient);
    }
}

