package com.taskapp.taskmanager.service;

import com.taskapp.taskmanager.dto.AuthResponse;
import com.taskapp.taskmanager.dto.LoginRequest;
import com.taskapp.taskmanager.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}