package com.taskapp.taskmanager.dto;

import com.taskapp.taskmanager.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank
    private  String name;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;
    private Role role;

}
