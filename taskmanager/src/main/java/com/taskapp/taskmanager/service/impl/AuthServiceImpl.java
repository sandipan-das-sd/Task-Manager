package com.taskapp.taskmanager.service.impl;

import com.taskapp.taskmanager.dto.AuthResponse;
import com.taskapp.taskmanager.dto.LoginRequest;
import com.taskapp.taskmanager.dto.RegisterRequest;
import com.taskapp.taskmanager.entity.Role;
import com.taskapp.taskmanager.entity.User;
import com.taskapp.taskmanager.repositary.UserRepository;
import com.taskapp.taskmanager.security.JwtUtil;
import com.taskapp.taskmanager.service.AuthService;
import com.taskapp.taskmanager.service.EmailService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtUtil jwtUtil;

    private final EmailService emailService;

    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil,
                           EmailService emailService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Role role = request.getRole() == null
                ? Role.MEMBER
                : request.getRole();

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        userRepository.save(user);

        // send welcome email
        sendWelcomeEmail(user);

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getRole().name()
        );
    }

    @Override
    public AuthResponse login(LoginRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {

            throw new RuntimeException("Invalid password");
        }

        // login notification email
        sendLoginEmail(user);

        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getRole().name()
        );
    }

    // welcome email
    private void sendWelcomeEmail(User user) {

        String subject = "Welcome to Task Manager";

        String message = "Hello " + user.getName() + ",\n\n"
                + "Your account has been created successfully.\n\n"
                + "Email: " + user.getEmail() + "\n"
                + "Role: " + user.getRole() + "\n\n"
                + "Welcome to Task Manager App.";

        emailService.sendEmail(
                user.getEmail(),
                subject,
                message
        );
    }

    // login email
    private void sendLoginEmail(User user) {

        String subject = "Login Alert";

        String message = "Hello " + user.getName() + ",\n\n"
                + "Your account was logged in successfully.\n\n"
                + "If this was not you, please reset your password immediately.";

        emailService.sendEmail(
                user.getEmail(),
                subject,
                message
        );
    }
}