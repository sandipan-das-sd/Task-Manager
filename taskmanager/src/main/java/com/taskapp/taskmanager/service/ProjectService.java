package com.taskapp.taskmanager.service;

import com.taskapp.taskmanager.dto.ProjectDto;

import java.util.List;

public interface ProjectService {

    List<ProjectDto> getAllProjects();

    ProjectDto createProject(ProjectDto projectDto);

    ProjectDto updateProject(Long id, ProjectDto projectDto);

    void deleteProject(Long id);
}