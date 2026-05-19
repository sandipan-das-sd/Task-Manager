import {
  EMPTY_PROJECT_FORM,
  EMPTY_TASK_FORM,
  PRIORITIES,
  STATUSES,
} from '../constants/task'

export function parseId(value) {
  const trimmed = String(value || '').trim()
  return trimmed ? Number(trimmed) : null
}

export function parseMemberIds(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map(Number)
    .filter((item) => Number.isFinite(item))
}

export function formatMemberIds(memberIds) {
  return Array.isArray(memberIds) ? memberIds.join(', ') : ''
}

export function getProjectName(projects, projectId) {
  return projects.find((project) => String(project.id) === String(projectId))
    ?.name
}

export function getStatusLabel(status) {
  return STATUSES.find((item) => item.value === status)?.label || status
}

export function getPriorityLabel(priority) {
  return PRIORITIES.find((item) => item.value === priority)?.label || priority
}

export function safeJsonParse(value) {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

export function buildProjectPayload(form) {
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    createdById: parseId(form.createdById),
    memberIds: parseMemberIds(form.memberIds),
  }
}

export function buildTaskPayload(form) {
  return {
    title: form.title.trim(),
    description: form.description.trim(),
    status: form.status,
    priority: form.priority,
    dueDate: form.dueDate || null,
    projectId: parseId(form.projectId),
    assignedToId: parseId(form.assignedToId),
  }
}

export function projectToForm(project) {
  return project
    ? {
        name: project.name || '',
        description: project.description || '',
        createdById: project.createdById || '',
        memberIds: formatMemberIds(project.memberIds),
      }
    : EMPTY_PROJECT_FORM
}

export function taskToForm(task, fallbackProjectId = '') {
  return task
    ? {
        title: task.title || '',
        description: task.description || '',
        projectId: task.projectId || '',
        assignedToId: task.assignedToId || '',
        status: task.status || 'TODO',
        priority: task.priority || 'MEDIUM',
        dueDate: task.dueDate || '',
      }
    : {
        ...EMPTY_TASK_FORM,
        projectId: fallbackProjectId,
      }
}

export function getUpcomingTasks(tasks) {
  const now = new Date()
  const nextWeek = new Date()
  nextWeek.setDate(now.getDate() + 7)

  return tasks.filter((task) => {
    if (!task.dueDate || task.status === 'DONE') {
      return false
    }

    const due = new Date(`${task.dueDate}T00:00:00`)
    return due >= new Date(now.toDateString()) && due <= nextWeek
  })
}

export function getOverdueTasks(tasks) {
  const today = new Date(new Date().toDateString())

  return tasks.filter((task) => {
    if (!task.dueDate || task.status === 'DONE') {
      return false
    }

    return new Date(`${task.dueDate}T00:00:00`) < today
  })
}
