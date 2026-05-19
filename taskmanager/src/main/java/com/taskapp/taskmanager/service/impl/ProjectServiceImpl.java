package com.taskapp.taskmanager.service.impl;

import com.taskapp.taskmanager.dto.ProjectDto;
import com.taskapp.taskmanager.entity.Project;
import com.taskapp.taskmanager.entity.User;
import com.taskapp.taskmanager.repositary.ProjectRepository;
import com.taskapp.taskmanager.repositary.UserRepository;
import com.taskapp.taskmanager.service.EmailService;
import com.taskapp.taskmanager.service.ProjectService;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public ProjectServiceImpl(ProjectRepository projectRepository,
                              UserRepository userRepository,
                              EmailService emailService) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @Override
    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll()
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Override
    public ProjectDto createProject(ProjectDto projectDto) {

        User creator = null;
        Set<User> members = new HashSet<>();

        if (projectDto.getCreatedById() != null) {
            creator = userRepository.findById(projectDto.getCreatedById())
                    .orElseThrow(() -> new RuntimeException("Creator not found"));
        }

        if (projectDto.getMemberIds() != null) {
            members = new HashSet<>(userRepository.findAllById(projectDto.getMemberIds()));
        }

        Project project = Project.builder()
                .name(projectDto.getName())
                .description(projectDto.getDescription())
                .createdBy(creator)
                .members(members)
                .build();

        Project savedProject = projectRepository.save(project);

        sendProjectEmail(
                members,
                "New Project Assigned: " + savedProject.getName(),
                "You have been added to a new project.\n\n"
                        + "Project: " + savedProject.getName() + "\n"
                        + "Description: " + savedProject.getDescription()
        );

        return toDto(savedProject);
    }

    @Override
    public ProjectDto updateProject(Long id, ProjectDto projectDto) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setName(projectDto.getName());
        project.setDescription(projectDto.getDescription());

        if (projectDto.getMemberIds() != null) {
            Set<User> members = new HashSet<>(userRepository.findAllById(projectDto.getMemberIds()));
            project.setMembers(members);
        }

        Project savedProject = projectRepository.save(project);

        sendProjectEmail(
                savedProject.getMembers(),
                "Project Updated: " + savedProject.getName(),
                "Project details have been updated.\n\n"
                        + "Project: " + savedProject.getName() + "\n"
                        + "Description: " + savedProject.getDescription()
        );

        return toDto(savedProject);
    }

    @Override
    public void deleteProject(Long id) {

        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        Set<User> members = project.getMembers();
        String projectName = project.getName();

        projectRepository.delete(project);

        sendProjectEmail(
                members,
                "Project Deleted: " + projectName,
                "A project assigned to you has been deleted.\n\n"
                        + "Project: " + projectName
        );
    }

    private void sendProjectEmail(Set<User> users, String subject, String message) {

        if (users == null || users.isEmpty()) {
            return;
        }

        for (User user : users) {
            if (user != null && user.getEmail() != null) {
                emailService.sendEmail(user.getEmail(), subject, message);
            }
        }
    }

    private ProjectDto toDto(Project project) {
        ProjectDto dto = new ProjectDto();

        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());

        if (project.getCreatedBy() != null) {
            dto.setCreatedById(project.getCreatedBy().getId());
            dto.setCreatedByName(project.getCreatedBy().getName());
        }

        if (project.getMembers() != null) {
            dto.setMemberIds(
                    project.getMembers()
                            .stream()
                            .map(User::getId)
                            .collect(Collectors.toSet())
            );
        }

        return dto;
    }
}