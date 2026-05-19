package com.taskapp.taskmanager.controller;

import com.taskapp.taskmanager.dto.ForgetPasswordRequest;
import com.taskapp.taskmanager.dto.ResetPasswordRequest;
import com.taskapp.taskmanager.service.ForgotPasswordService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class ForgotPasswordController {

    private final ForgotPasswordService forgotPasswordService;

    public ForgotPasswordController(ForgotPasswordService forgotPasswordService) {
        this.forgotPasswordService = forgotPasswordService;
    }

    @PostMapping("/forgot-password")
    public Map<String, String> forgotPassword(@Valid @RequestBody ForgetPasswordRequest request) {
        return Map.of("message", forgotPasswordService.forgotPassword(request));
    }

    @PostMapping("/reset-password")
    public Map<String, String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return Map.of("message", forgotPasswordService.resetPassword(request));
    }
    
}
