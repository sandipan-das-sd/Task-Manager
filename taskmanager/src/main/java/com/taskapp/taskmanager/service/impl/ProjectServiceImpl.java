package com.taskapp.taskmanager.service.impl;

import com.taskapp.taskmanager.dto.ProjectDto;
import com.taskapp.taskmanager.entity.Project;
import com.taskapp.taskmanager.entity.User;
import com.taskapp.taskmanager.repositary.ProjectRepository;
import com.taskapp.taskmanager.repositary.UserRepository;
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
    public ProjectServiceImpl(ProjectRepository projectRepository,
                              UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
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

        Project project = new Project();
        project.setName(projectDto.getName());
        project.setDescription(projectDto.getDescription());
        //if no creator
        if (projectDto.getCreatedById() != null) {

            //create creator
            User creator = userRepository.findById(projectDto.getCreatedById())
                    .orElseThrow(() -> new RuntimeException("Creator not found"));
            project.setCreatedBy(creator);
        }

        if (projectDto.getMemberIds() != null) {
            Set<User> members = new HashSet<>(userRepository.findAllById(projectDto.getMemberIds()));
            project.setMembers(members);
        }

        return toDto(projectRepository.save(project));
    }


    @Override
    public ProjectDto updateProject(Long id, ProjectDto projectDto) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        project.setName(projectDto.getName());
        project.setDescription(projectDto.getDescription());

        return toDto(projectRepository.save(project));
    }

    @Override
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
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