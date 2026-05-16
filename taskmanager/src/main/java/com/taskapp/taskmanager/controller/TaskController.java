package com.taskapp.taskmanager.controller;

import com.taskapp.taskmanager.dto.TaskDto;
import com.taskapp.taskmanager.service.TaskService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // GET ALL TASKS
    @GetMapping
    public List<TaskDto> getAllTasks() {
        return taskService.getAllTasks();
    }

    // CREATE TASK
    @PostMapping
    public TaskDto createTask(@Valid  @RequestBody TaskDto taskDto) {
        return taskService.createTask(taskDto);
    }

    // UPDATE TASK
    @PutMapping
    public TaskDto updateTask(@RequestBody TaskDto taskDto) {
        return taskService.updateTask(taskDto);
    }

    // UPDATE STATUS
    @PatchMapping
    public TaskDto updateStatus(@RequestBody TaskDto taskDto) {
        return taskService.updateStatus(taskDto);
    }

    // DELETE TASK
    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Long id) {

        taskService.deleteTask(id);

        return "Task deleted successfully";
    }
}