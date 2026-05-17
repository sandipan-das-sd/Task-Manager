package com.taskapp.taskmanager.service;

import com.taskapp.taskmanager.dto.TaskDto;
import com.taskapp.taskmanager.entity.TaskPriority;
import com.taskapp.taskmanager.entity.TaskStatus;

import java.util.List;

public interface TaskService {

    List<TaskDto> getAllTasks();

    List<TaskDto> getTasksByProject(Long projectId);

    TaskDto createTask(TaskDto taskDto);

    TaskDto updateTask(Long id, TaskDto taskDto);

    TaskDto updateStatus(Long id, TaskStatus status);

    void deleteTask(Long id);

    List<TaskDto> filterTasks(TaskStatus status, TaskPriority priority, Long assigneeId);
}