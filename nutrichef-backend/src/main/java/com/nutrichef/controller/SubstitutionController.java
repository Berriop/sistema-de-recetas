package com.nutrichef.controller;

import com.nutrichef.dto.SubstitutionDTO;
import com.nutrichef.service.SubstitutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/substitutions")
@CrossOrigin(origins = "http://localhost:5173")
public class SubstitutionController {

    @Autowired
    private SubstitutionService substitutionService;

    @GetMapping("/{ingredientId}")
    public ResponseEntity<List<SubstitutionDTO>> getSubstitutions(@PathVariable Long ingredientId) {
        return ResponseEntity.ok(substitutionService.getSubstitutionsForIngredient(ingredientId));
    }
}
