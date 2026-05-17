package com.taskapp.taskmanager.dto;

import com.taskapp.taskmanager.entity.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskDto {
    private Long id;
    @NotBlank(message = "Title is required")
    private String title;
    @NotBlank(message="Description is required")
    private String description;
    private TaskStatus status;
    private LocalDate dueDate;
    private  Long projectId;
    private  Long assignedToId;

}
