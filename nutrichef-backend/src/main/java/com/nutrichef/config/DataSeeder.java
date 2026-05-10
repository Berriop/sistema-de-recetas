package com.nutrichef.config;

import com.nutrichef.model.*;
import com.nutrichef.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * Puebla la BD con datos iniciales usando SOLO unidades del AllowedUnits.
 * Solo se ejecuta si no hay recetas en la BD.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired private IngredientRepository ingredientRepository;
    @Autowired private RecipeRepository recipeRepository;
    @Autowired private IngredientSubstitutionRepository substitutionRepository;

    @Override
    public void run(String... args) throws Exception {
        if (recipeRepository.count() == 0) {
            seedData();
        }
    }

    private void seedData() {
        // --- Ingredientes ---
        Ingredient pollo         = ing("Pechuga de pollo", "Proteína");
        Ingredient arroz         = ing("Arroz", "Carbohidrato");
        Ingredient tomate        = ing("Tomate", "Vegetal");
        Ingredient cebolla       = ing("Cebolla", "Vegetal");
        Ingredient huevo         = ing("Huevo", "Proteína");
        Ingredient leche         = ing("Leche", "Lácteo");
        Ingredient lecheAlm      = ing("Leche de almendras", "Lácteo/Vegano");
        Ingredient banana        = ing("Banana", "Fruta");
        Ingredient avena         = ing("Avena", "Carbohidrato");
        Ingredient espinaca      = ing("Espinaca", "Vegetal");
        Ingredient mantequilla   = ing("Mantequilla", "Grasa");
        Ingredient aceiteOliva   = ing("Aceite de oliva", "Grasa");
        Ingredient ajo           = ing("Ajo", "Vegetal");
        Ingredient zanahoria     = ing("Zanahoria", "Vegetal");
        Ingredient yogurt        = ing("Yogurt griego", "Lácteo");

        // --- Sustituciones ---
        if (substitutionRepository.count() == 0) {
            substitutionRepository.save(new IngredientSubstitution(null, huevo, banana));
            substitutionRepository.save(new IngredientSubstitution(null, leche, lecheAlm));
            substitutionRepository.save(new IngredientSubstitution(null, mantequilla, aceiteOliva));
            substitutionRepository.save(new IngredientSubstitution(null, yogurt, leche));
        }

        // --- Receta 1: Arroz con pollo ---
        Recipe r1 = recipe("Arroz con pollo",
                "Plato clásico y nutritivo, alto en proteínas y carbohidratos complejos.",
                450, 35.0, 45.0, 12.0,
                "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&w=800&q=80");
        r1.getRecipeIngredients().add(ri(r1, pollo,   2.0,  "piezas"));
        r1.getRecipeIngredients().add(ri(r1, arroz,   2.0,  "tazas"));
        r1.getRecipeIngredients().add(ri(r1, tomate,  1.0,  "unidad"));
        r1.getRecipeIngredients().add(ri(r1, cebolla, 1.0,  "unidad"));
        r1.getRecipeIngredients().add(ri(r1, ajo,     2.0,  "dientes"));
        recipeRepository.save(r1);

        // --- Receta 2: Tortilla saludable ---
        Recipe r2 = recipe("Tortilla saludable",
                "Perfecta para el desayuno. Llena de proteínas y vitaminas.",
                300, 20.0, 10.0, 18.0,
                "https://images.unsplash.com/photo-1510693206972-df098062cb71?auto=format&fit=crop&w=800&q=80");
        r2.getRecipeIngredients().add(ri(r2, huevo,    3.0, "unidades"));
        r2.getRecipeIngredients().add(ri(r2, espinaca, 1.0, "manojo"));
        r2.getRecipeIngredients().add(ri(r2, tomate,   1.0, "unidad"));
        r2.getRecipeIngredients().add(ri(r2, aceiteOliva, 1.0, "cda"));
        recipeRepository.save(r2);

        // --- Receta 3: Batido proteico ---
        Recipe r3 = recipe("Batido proteico",
                "Ideal para después de entrenar. Energía rápida y proteína.",
                350, 25.0, 40.0, 8.0,
                "https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80");
        r3.getRecipeIngredients().add(ri(r3, leche,  2.0, "tazas"));
        r3.getRecipeIngredients().add(ri(r3, banana, 1.0, "unidad"));
        r3.getRecipeIngredients().add(ri(r3, avena,  1.0, "taza"));
        recipeRepository.save(r3);

        // --- Receta 4: Ensalada fitness ---
        Recipe r4 = recipe("Ensalada fitness",
                "Ligera, fresca y con pechuga de pollo a la plancha.",
                280, 30.0, 15.0, 10.0,
                "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80");
        r4.getRecipeIngredients().add(ri(r4, pollo,      2.0, "piezas"));
        r4.getRecipeIngredients().add(ri(r4, espinaca,   2.0, "tazas"));
        r4.getRecipeIngredients().add(ri(r4, tomate,     1.0, "unidad"));
        r4.getRecipeIngredients().add(ri(r4, aceiteOliva,1.0, "cda"));
        r4.getRecipeIngredients().add(ri(r4, zanahoria,  1.0, "unidad"));
        recipeRepository.save(r4);

        // --- Receta 5: Avena con frutas ---
        Recipe r5 = recipe("Avena con frutas",
                "Energía de lenta absorción para empezar el día con fuerza.",
                320, 12.0, 55.0, 6.0,
                "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=800&q=80");
        r5.getRecipeIngredients().add(ri(r5, avena,  1.0, "taza"));
        r5.getRecipeIngredients().add(ri(r5, leche,  1.0, "taza"));
        r5.getRecipeIngredients().add(ri(r5, banana, 1.0, "unidad"));
        recipeRepository.save(r5);

        // --- Receta 6: Pollo al ajillo ---
        Recipe r6 = recipe("Pollo al ajillo",
                "Sabor intenso con ajo y aceite de oliva, listo en 20 minutos.",
                380, 40.0, 5.0, 20.0,
                "https://images.unsplash.com/photo-1598103442097-8b74394b95c1?auto=format&fit=crop&w=800&q=80");
        r6.getRecipeIngredients().add(ri(r6, pollo,      3.0, "piezas"));
        r6.getRecipeIngredients().add(ri(r6, ajo,        4.0, "dientes"));
        r6.getRecipeIngredients().add(ri(r6, aceiteOliva,2.0, "cda"));
        recipeRepository.save(r6);
    }

    // ---- Helpers ----

    private Ingredient ing(String name, String category) {
        return ingredientRepository.findByNameIgnoreCase(name).orElseGet(() -> {
            Ingredient i = new Ingredient();
            i.setName(name);
            i.setCategory(category);
            return ingredientRepository.save(i);
        });
    }

    private Recipe recipe(String name, String desc, int cal,
                          double prot, double carbs, double fats, String img) {
        Recipe r = new Recipe();
        r.setName(name);
        r.setDescription(desc);
        r.setCalories(cal);
        r.setProtein(prot);
        r.setCarbs(carbs);
        r.setFats(fats);
        r.setImageUrl(img);
        return r;
    }

    private RecipeIngredient ri(Recipe r, Ingredient ing, double qty, String unit) {
        return new RecipeIngredient(null, r, ing, qty, unit);
    }
}
