package org.example.se1979su25g2be.service;

import org.example.se1979su25g2be.dto.auth.JwtResponseDTO;
import org.example.se1979su25g2be.dto.auth.LoginRequestDTO;
import org.example.se1979su25g2be.dto.auth.RegisterRequestDTO;
import org.example.se1979su25g2be.entity.Role;
import org.example.se1979su25g2be.entity.User;
import org.example.se1979su25g2be.repository.RoleRepository;
import org.example.se1979su25g2be.repository.UserRepository;
import org.example.se1979su25g2be.security.jwt.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Transactional
    public ResponseEntity<?> registerUser(RegisterRequestDTO registerRequest) {
        // Check if username exists
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body("Error: Username is already taken!");
        }

        // Check if email exists
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body("Error: Email is already in use!");
        }

        // Get default USER role
        Role userRole = roleRepository.findByRoleNameIgnoreCase("USER")
                .orElseThrow(() -> new RuntimeException("Error: Role USER is not found."));

        // Create new user account
        User user = User.builder()
                .firstName(registerRequest.getFirstName())
                .lastName(registerRequest.getLastName())
                .dob(registerRequest.getDob())
                .email(registerRequest.getEmail())
                .username(registerRequest.getUsername())
                .sex(registerRequest.getSex())
                .passwordHash(passwordEncoder.encode(registerRequest.getPassword()))
                .phoneNumber(registerRequest.getPhoneNumber())
                .role(userRole)
                .status(User.Status.ACTIVE)
                .build();

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok("User registered successfully with ID: " + savedUser.getUserId());
    }

    public ResponseEntity<?> authenticateUser(LoginRequestDTO loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);

        // Get user details from authentication
        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String roleName = user.getRole() != null ? user.getRole().getRoleName() : "USER";

        JwtResponseDTO jwtResponse = new JwtResponseDTO(
                jwt,
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                roleName
        );

        return ResponseEntity.ok(jwtResponse);
    }
}
