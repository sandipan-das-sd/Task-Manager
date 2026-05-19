package com.taskapp.taskmanager.controller;

import com.taskapp.taskmanager.dto.UserDto;
import com.taskapp.taskmanager.entity.User;
import com.taskapp.taskmanager.repositary.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<UserDto> getUsers() {
        return userRepository.findAll(Sort.by(Sort.Direction.ASC, "name"))
                .stream()
                .map(this::toDto)
                .toList();
    }

    private UserDto toDto(User user) {
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }
}
