package com.taskapp.taskmanager.dto;

import com.taskapp.taskmanager.entity.User;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Set;

@Data

public class ProjectDto {

    private  Long id;
    @NotBlank
    private  String name;
    private String description;
    private Long createdById;
    private String createdByName;
    private Set<Long> memberIds;




}
