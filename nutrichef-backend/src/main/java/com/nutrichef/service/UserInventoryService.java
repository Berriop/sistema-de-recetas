package com.nutrichef.service;

import com.nutrichef.model.Ingredient;
import com.nutrichef.model.User;
import com.nutrichef.model.UserInventory;
import com.nutrichef.repository.IngredientRepository;
import com.nutrichef.repository.UserInventoryRepository;
import com.nutrichef.repository.UserRepository;
import com.nutrichef.util.AllowedUnits;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserInventoryService {

    private final UserInventoryRepository userInventoryRepository;
    private final UserRepository userRepository;
    private final IngredientRepository ingredientRepository;

    @Autowired
    public UserInventoryService(UserInventoryRepository userInventoryRepository,
                                UserRepository userRepository,
                                IngredientRepository ingredientRepository) {
        this.userInventoryRepository = userInventoryRepository;
        this.userRepository = userRepository;
        this.ingredientRepository = ingredientRepository;
    }

    public UserInventory addIngredientToInventory(UserInventory userInventory) {
        // -- Validar usuario e ingrediente --
        if (userInventory.getUser() == null || userInventory.getUser().getId() == null) {
            throw new IllegalArgumentException("Se requiere el ID del usuario");
        }
        if (userInventory.getIngredient() == null || userInventory.getIngredient().getId() == null) {
            throw new IllegalArgumentException("Se requiere el ID del ingrediente");
        }

        User user = userRepository.findById(userInventory.getUser().getId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        Ingredient ingredient = ingredientRepository.findById(userInventory.getIngredient().getId())
                .orElseThrow(() -> new IllegalArgumentException("Ingrediente no encontrado"));

        // -- Validar cantidad --
        if (userInventory.getQuantity() == null || userInventory.getQuantity() < 1) {
            throw new IllegalArgumentException("La cantidad debe ser al menos 1");
        }

        // -- Validar y normalizar unidad --
        String rawUnit = userInventory.getUnit();
        if (rawUnit == null || rawUnit.isBlank()) {
            // Default razonable para MVP
            rawUnit = "unidades";
        }
        String normalizedUnit = AllowedUnits.normalize(rawUnit);
        if (!AllowedUnits.isAllowed(normalizedUnit)) {
            throw new IllegalArgumentException(
                "Unidad '" + rawUnit + "' no permitida. Use: " + AllowedUnits.ALLOWED);
        }

        userInventory.setUser(user);
        userInventory.setIngredient(ingredient);
        userInventory.setUnit(normalizedUnit);

        // -- Fusión: solo sumar si existe la MISMA unidad --
        Optional<UserInventory> existing = userInventoryRepository
                .findByUserIdAndIngredientId(user.getId(), ingredient.getId());

        if (existing.isPresent()) {
            UserInventory toUpdate = existing.get();
            String existingUnit = AllowedUnits.normalize(toUpdate.getUnit());

            if (!existingUnit.equals(normalizedUnit)) {
                throw new IllegalArgumentException(
                    "Ya tienes este ingrediente registrado en '" + toUpdate.getUnit() +
                    "'. No se puede combinar con '" + normalizedUnit + "'. " +
                    "Elimina la entrada anterior si deseas cambiar la unidad.");
            }

            toUpdate.setQuantity(toUpdate.getQuantity() + userInventory.getQuantity());
            return userInventoryRepository.save(toUpdate);
        }

        return userInventoryRepository.save(userInventory);
    }

    public List<UserInventory> getUserInventory(Long userId) {
        return userInventoryRepository.findByUserId(userId);
    }

    public void removeIngredientFromInventory(Long id) {
        if (!userInventoryRepository.existsById(id)) {
            throw new IllegalArgumentException("Entrada de inventario no encontrada con ID: " + id);
        }
        userInventoryRepository.deleteById(id);
    }
}
