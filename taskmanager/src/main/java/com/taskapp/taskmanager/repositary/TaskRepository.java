package com.taskapp.taskmanager.repositary;
import com.taskapp.taskmanager.entity.Task;
import com.taskapp.taskmanager.entity.TaskPriority;
import com.taskapp.taskmanager.entity.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
List<Task> findByProjectId(Long id);
List<Task> findByStatus(TaskStatus status);
List<Task> findByPriority(TaskPriority priority);
List<Task> findByAssignedToId(Long assignedToId);
}