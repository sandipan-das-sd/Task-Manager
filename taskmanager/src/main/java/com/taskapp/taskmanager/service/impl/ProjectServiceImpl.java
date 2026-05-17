package com.taskapp.taskmanager.service.impl;

import com.taskapp.taskmanager.dto.ProjectDto;
import com.taskapp.taskmanager.entity.Project;
import com.taskapp.taskmanager.repositary.ProjectRepository;
import com.taskapp.taskmanager.service.ProjectService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;

    public ProjectServiceImpl(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
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
        return dto;
    }
}