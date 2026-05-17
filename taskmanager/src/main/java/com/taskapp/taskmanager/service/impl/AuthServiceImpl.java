package com.taskapp.taskmanager.service.impl;

import com.taskapp.taskmanager.dto.AuthResponse;
import com.taskapp.taskmanager.dto.LoginRequest;
import com.taskapp.taskmanager.dto.RegisterRequest;
import com.taskapp.taskmanager.entity.Role;
import com.taskapp.taskmanager.entity.User;
import com.taskapp.taskmanager.repositary.UserRepository;
import com.taskapp.taskmanager.security.JwtUtil;
import com.taskapp.taskmanager.service.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {


    private final UserRepository userRepository;

    // password hashing
    private final PasswordEncoder passwordEncoder;


    private final JwtUtil jwtUtil;



    public AuthServiceImpl(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }



    // REGISTER USER

    @Override
    public AuthResponse register(RegisterRequest request) {

        // check email already exists or not
        if (userRepository.existsByEmail(request.getEmail())) {

            throw new RuntimeException("Email already exists");
        }

        // if role is null then default MEMBER
        Role role = request.getRole() == null
                ? Role.MEMBER
                : request.getRole();


        // create user object
        User user = User.builder()

                .name(request.getName())

                .email(request.getEmail())

                // hash password before saving
                .password(
                        passwordEncoder.encode(request.getPassword())
                )

                .role(role)

                .build();


        // save user in database
        userRepository.save(user);


        // generate JWT token
        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );


        // return response
        return new AuthResponse(
                token,
                user.getEmail(),
                user.getRole().name()
        );
    }



    // LOGIN USER

    @Override
    public AuthResponse login(LoginRequest request) {

        // find user by email
        User user = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );


        // check password correct or not
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )) {

            throw new RuntimeException("Invalid password");
        }


        // generate token
        String token = jwtUtil.generateToken(
                user.getEmail(),
                user.getRole().name()
        );


        // return auth response
        return new AuthResponse(
                token,
                user.getEmail(),
                user.getRole().name()
        );
    }
}