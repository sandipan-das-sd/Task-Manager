package com.taskapp.taskmanager.service.impl;

import com.taskapp.taskmanager.dto.TaskDto;
import com.taskapp.taskmanager.entity.Task;
import com.taskapp.taskmanager.repositary.TaskRepository;
import com.taskapp.taskmanager.service.TaskService;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskServiceImplementation implements TaskService {

    private final TaskRepository taskRepository;

    public TaskServiceImplementation(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public List<TaskDto> getAllTasks() {

        List<Task> tasks = taskRepository.findAll();

        return tasks.stream()
                .map(task -> new TaskDto(
                        task.getId(),
                        task.getTitle(),
                        task.getDescription(),
                        task.getStatus()
                ))
                .collect(Collectors.toList());
    }

    @Override
    public TaskDto createTask(TaskDto taskDto) {

        Task task = new Task();

        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setStatus(taskDto.getStatus());

        Task savedTask = taskRepository.save(task);

        return new TaskDto(
                savedTask.getId(),
                savedTask.getTitle(),
                savedTask.getDescription(),
                savedTask.getStatus()
        );
    }

    @Override
    public TaskDto updateTask(TaskDto taskDto) {
        return taskDto;
    }

    @Override
    public TaskDto updateStatus(TaskDto taskDto) {
        return taskDto;
    }

    @Override
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}