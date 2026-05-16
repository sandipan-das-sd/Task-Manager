package com.taskapp.taskmanager.service;
import java.util.List;
import com.taskapp.taskmanager.dto.TaskDto;

public interface TaskService {

    List<TaskDto> getAllTasks();
    TaskDto createTask(TaskDto taskDto);
    TaskDto updateTask(TaskDto taskDto);
    TaskDto updateStatus(TaskDto taskDto);
    void deleteTask(Long id);
}
