package org.example.se1979su25g2be.controller;

import jakarta.validation.Valid;
import org.example.se1979su25g2be.dto.auth.JwtResponseDTO;
import org.example.se1979su25g2be.dto.auth.LoginRequestDTO;
import org.example.se1979su25g2be.dto.auth.RegisterRequestDTO;
import org.example.se1979su25g2be.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequestDTO loginRequest) {
        return authService.authenticateUser(loginRequest);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        return authService.registerUser(registerRequest);
    }
}

