package com.taskapp.taskmanager.service.impl;

import com.taskapp.taskmanager.dto.TaskDto;
import com.taskapp.taskmanager.entity.*;
import com.taskapp.taskmanager.repositary.ProjectRepository;
import com.taskapp.taskmanager.repositary.TaskRepository;
import com.taskapp.taskmanager.repositary.UserRepository;
import com.taskapp.taskmanager.service.EmailService;
import com.taskapp.taskmanager.service.TaskService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public TaskServiceImpl(TaskRepository taskRepository,
                           ProjectRepository projectRepository,
                           UserRepository userRepository,
                           EmailService emailService) {
        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    private void sendTaskEmail(User user, String subject, String message) {
        if (user == null || user.getEmail() == null) {
            return;
        }
        emailService.sendEmail(user.getEmail(), subject, message);
    }

    @Override
    public List<TaskDto> getAllTasks() {
        return taskRepository.findAll().stream().map(this::toDto).toList();
    }

    @Override
    public List<TaskDto> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId).stream().map(this::toDto).toList();
    }

    @Override
    public TaskDto createTask(TaskDto taskDto) {

        Project project = projectRepository.findById(taskDto.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found"));

        User assignedUser = null;

        if (taskDto.getAssignedToId() != null) {
            assignedUser = userRepository.findById(taskDto.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
        }

        Task task = Task.builder()
                .title(taskDto.getTitle())
                .description(taskDto.getDescription())
                .status(taskDto.getStatus() == null ? TaskStatus.TODO : taskDto.getStatus())
                .priority(taskDto.getPriority() == null ? TaskPriority.MEDIUM : taskDto.getPriority())
                .dueDate(taskDto.getDueDate())
                .project(project)
                .assignedTo(assignedUser)
                .build();

        Task savedTask = taskRepository.save(task);

        sendTaskEmail(
                assignedUser,
                "New Task Assigned: " + savedTask.getTitle(),
                "Hello " + assignedUser.getName() + ",\n\n"
                        + "A new task has been assigned to you.\n\n"
                        + "Task: " + savedTask.getTitle() + "\n"
                        + "Description: " + savedTask.getDescription() + "\n"
                        + "Priority: " + savedTask.getPriority() + "\n"
                        + "Due Date: " + savedTask.getDueDate() + "\n"
                        + "Status: " + savedTask.getStatus() + "\n\n"
                        + "Please check your dashboard."
        );

        return toDto(savedTask);
    }

    @Override
    public TaskDto updateTask(Long id, TaskDto taskDto) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setTitle(taskDto.getTitle());
        task.setDescription(taskDto.getDescription());
        task.setStatus(taskDto.getStatus());
        task.setPriority(taskDto.getPriority());
        task.setDueDate(taskDto.getDueDate());

        if (taskDto.getAssignedToId() != null) {
            User assignedUser = userRepository.findById(taskDto.getAssignedToId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            task.setAssignedTo(assignedUser);
        }

        Task savedTask = taskRepository.save(task);

        sendTaskEmail(
                savedTask.getAssignedTo(),
                "Task Updated: " + savedTask.getTitle(),
                "Hello,\n\nYour assigned task has been updated.\n\n"
                        + "Task: " + savedTask.getTitle() + "\n"
                        + "Status: " + savedTask.getStatus() + "\n"
                        + "Priority: " + savedTask.getPriority() + "\n"
                        + "Due Date: " + savedTask.getDueDate()
        );

        return toDto(savedTask);
    }

    @Override
    public TaskDto updateStatus(Long id, TaskStatus status) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setStatus(status);

        Task savedTask = taskRepository.save(task);

        sendTaskEmail(
                savedTask.getAssignedTo(),
                "Task Status Changed: " + savedTask.getTitle(),
                "Hello,\n\nTask status has been changed.\n\n"
                        + "Task: " + savedTask.getTitle() + "\n"
                        + "New Status: " + savedTask.getStatus()
        );

        return toDto(savedTask);
    }

    @Override
    public void deleteTask(Long id) {

        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        User assignedUser = task.getAssignedTo();
        String title = task.getTitle();

        taskRepository.delete(task);

        sendTaskEmail(
                assignedUser,
                "Task Deleted: " + title,
                "Hello,\n\nYour assigned task has been deleted.\n\n"
                        + "Task: " + title
        );
    }

    @Override
    public List<TaskDto> filterTasks(TaskStatus status, TaskPriority priority, Long assigneeId) {

        if (status != null) {
            return taskRepository.findByStatus(status).stream().map(this::toDto).toList();
        }

        if (priority != null) {
            return taskRepository.findByPriority(priority).stream().map(this::toDto).toList();
        }

        if (assigneeId != null) {
            return taskRepository.findByAssignedToId(assigneeId).stream().map(this::toDto).toList();
        }

        return getAllTasks();
    }

    private TaskDto toDto(Task task) {
        TaskDto dto = new TaskDto();

        dto.setId(task.getId());
        dto.setTitle(task.getTitle());
        dto.setDescription(task.getDescription());
        dto.setStatus(task.getStatus());
        dto.setPriority(task.getPriority());
        dto.setDueDate(task.getDueDate());

        if (task.getProject() != null) {
            dto.setProjectId(task.getProject().getId());
        }

        if (task.getAssignedTo() != null) {
            dto.setAssignedToId(task.getAssignedTo().getId());
        }

        return dto;
    }
}