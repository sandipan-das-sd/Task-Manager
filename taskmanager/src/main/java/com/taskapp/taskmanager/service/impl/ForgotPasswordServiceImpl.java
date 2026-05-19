package com.taskapp.taskmanager.service.impl;

import com.taskapp.taskmanager.dto.ForgetPasswordRequest;
import com.taskapp.taskmanager.dto.ResetPasswordRequest;
import com.taskapp.taskmanager.entity.PasswordResetToken;
import com.taskapp.taskmanager.entity.User;
import com.taskapp.taskmanager.repositary.PasswordResetTokenRepository;
import com.taskapp.taskmanager.repositary.UserRepository;
import com.taskapp.taskmanager.service.EmailService;
import com.taskapp.taskmanager.service.ForgotPasswordService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ForgotPasswordServiceImpl implements ForgotPasswordService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Value("${frontend.url}")
    private String frontendUrl;

    public ForgotPasswordServiceImpl(UserRepository userRepository,
                                     PasswordResetTokenRepository tokenRepository,
                                     PasswordEncoder passwordEncoder,
                                     EmailService emailService) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService = emailService;
    }

    @Override
    public String forgotPassword(ForgetPasswordRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(LocalDateTime.now().plusMinutes(15))
                .used(false)
                .build();

        tokenRepository.save(resetToken);

        String resetLink = frontendUrl + "/reset-password?token=" + token;

        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);

        return "Password reset link sent to your email";
    }

    @Override
    public String resetPassword(ResetPasswordRequest request) {

        PasswordResetToken resetToken = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (resetToken.isUsed()) {
            throw new RuntimeException("Token already used");
        }

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        userRepository.save(user);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);

        return "Password reset successfully";
    }
}