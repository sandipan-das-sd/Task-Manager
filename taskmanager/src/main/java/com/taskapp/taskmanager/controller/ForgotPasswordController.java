package com.taskapp.taskmanager.controller;

import com.taskapp.taskmanager.dto.ForgetPasswordRequest;
import com.taskapp.taskmanager.dto.ResetPasswordRequest;
import com.taskapp.taskmanager.service.ForgotPasswordService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class ForgotPasswordController {

    private final ForgotPasswordService forgotPasswordService;

    public ForgotPasswordController(ForgotPasswordService forgotPasswordService) {
        this.forgotPasswordService = forgotPasswordService;
    }

    @PostMapping("/forgot-password")
    public String forgotPassword(@Valid @RequestBody ForgetPasswordRequest request) {
        return forgotPasswordService.forgotPassword(request);
    }

    @PostMapping("/reset-password")
    public String resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return forgotPasswordService.resetPassword(request);
    }
    
}