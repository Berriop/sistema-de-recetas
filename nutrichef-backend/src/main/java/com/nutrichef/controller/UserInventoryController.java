package com.nutrichef.controller;

import com.nutrichef.model.UserInventory;
import com.nutrichef.service.UserInventoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
            UserInventory savedEntry = userInventoryService.addIngredientToInventory(userInventory);
            return new ResponseEntity<>(savedEntry, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<UserInventory>> getUserInventory(@PathVariable Long userId) {
        return new ResponseEntity<>(userInventoryService.getUserInventory(userId), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> removeIngredientFromInventory(@PathVariable Long id) {
        userInventoryService.removeIngredientFromInventory(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
