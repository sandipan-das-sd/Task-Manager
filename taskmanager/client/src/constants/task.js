export const STORAGE_KEY = 'task-manager-session'

export const STATUSES = [
  { value: 'TODO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
]

export const PRIORITIES = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
]

export const EMPTY_PROJECT_FORM = {
  name: '',
  description: '',
  createdById: '',
  memberIds: [],
}

export const EMPTY_TASK_FORM = {
  title: '',
  description: '',
  projectId: '',
  assignedToId: '',
  status: 'TODO',
  priority: 'MEDIUM',
  dueDate: '',
}

export const EMPTY_FILTERS = {
  status: '',
  priority: '',
  assigneeId: '',
  projectId: '',
}
