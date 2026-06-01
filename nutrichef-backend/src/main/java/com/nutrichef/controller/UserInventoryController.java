package com.nutrichef.controller;

import com.nutrichef.model.UserInventory;
import com.nutrichef.service.UserInventoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/inventory")
public class UserInventoryController {

    private final UserInventoryService userInventoryService;

    @Autowired
    public UserInventoryController(UserInventoryService userInventoryService) {
        this.userInventoryService = userInventoryService;
    }

    @PostMapping
    public ResponseEntity<?> addIngredientToInventory(@Valid @RequestBody UserInventory userInventory) {
        try {
            UserInventory saved = userInventoryService.addIngredientToInventory(userInventory);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<UserInventory>> getUserInventory(@PathVariable Long userId) {
        return ResponseEntity.ok(userInventoryService.getUserInventory(userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeIngredientFromInventory(@PathVariable Long id) {
        try {
            userInventoryService.removeIngredientFromInventory(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeIngredientFromInventory(@PathVariable Long id) {
        userInventoryService.removeIngredientFromInventory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
