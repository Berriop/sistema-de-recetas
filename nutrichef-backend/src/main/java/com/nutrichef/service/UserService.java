package com.nutrichef.service;

import com.nutrichef.model.User;
import com.nutrichef.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(User user) {
        // Validaciones básicas
        if (user.getName() == null || user.getName().isBlank()) {
            throw new IllegalArgumentException("El nombre es requerido");
        }
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalArgumentException("El email es requerido");
        }
        if (user.getPassword() == null || user.getPassword().length() < 6) {
            throw new IllegalArgumentException("La contraseña debe tener al menos 6 caracteres");
        }

        String normalizedEmail = user.getEmail().trim().toLowerCase();
        user.setEmail(normalizedEmail);

        if (userRepository.findByEmail(normalizedEmail).isPresent()) {
            throw new IllegalArgumentException("Ya existe una cuenta con ese email");
        }

        // En producción se haría BCrypt; por ahora guardamos en plano para el MVP
        return userRepository.save(user);
    }

    /**
     * Verifica credenciales y retorna el usuario.
     * Lanza IllegalArgumentException si no coinciden.
     */
    public User login(String email, String password) {
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("El email es requerido");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("La contraseña es requerida");
        }

        String normalizedEmail = email.trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(normalizedEmail);

        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("Credenciales incorrectas");
        }

        User user = userOpt.get();
        if (!user.getPassword().equals(password)) {
            throw new IllegalArgumentException("Credenciales incorrectas");
        }

        return user;
    }
}
