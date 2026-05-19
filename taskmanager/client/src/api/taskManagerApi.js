const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(
  /\/$/,
  '',
)

const endpoints = {
  health: '/health',
  register: '/api/auth/register',
  login: '/api/auth/login',
  projects: '/api/projects',
  projectById: (id) => `/api/projects/${id}`,
  tasks: '/api/tasks',
  tasksByProject: (projectId) => `/api/tasks/project/${projectId}`,
  taskById: (id) => `/api/tasks/${id}`,
  taskStatus: (id, status) =>
    `/api/tasks/${id}/status?status=${encodeURIComponent(status)}`,
  taskFilter: ({ status, priority, assigneeId }) => {
    const params = new URLSearchParams()
    if (status) params.set('status', status)
    if (priority) params.set('priority', priority)
    if (assigneeId) params.set('assigneeId', assigneeId)

    const query = params.toString()
    return query ? `/api/tasks/filter?${query}` : '/api/tasks'
  },
}

async function request(path, options = {}, token = null) {
  const headers = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  const contentType = response.headers.get('content-type') || ''
  const body = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message =
      typeof body === 'string'
        ? body
        : body?.message || body?.error || 'Backend request failed'
    throw new Error(message)
  }

  return body
}

export const authApi = {
  register: (payload) =>
    request(endpoints.register, {
      method: 'POST',
      body: payload,
    }),
  login: (payload) =>
    request(endpoints.login, {
      method: 'POST',
      body: payload,
    }),
}

export function createTaskManagerApi(token) {
  const withAuth = (path, options = {}) => request(path, options, token)

  return {
    health: () => request(endpoints.health),
    projects: {
      list: () => withAuth(endpoints.projects),
      create: (payload) =>
        withAuth(endpoints.projects, {
          method: 'POST',
          body: payload,
        }),
      update: (id, payload) =>
        withAuth(endpoints.projectById(id), {
          method: 'PUT',
          body: payload,
        }),
      delete: (id) =>
        withAuth(endpoints.projectById(id), {
          method: 'DELETE',
        }),
    },
    tasks: {
      list: () => withAuth(endpoints.tasks),
      byProject: (projectId) => withAuth(endpoints.tasksByProject(projectId)),
      filter: (filters) => withAuth(endpoints.taskFilter(filters)),
      create: (payload) =>
        withAuth(endpoints.tasks, {
          method: 'POST',
          body: payload,
        }),
      update: (id, payload) =>
        withAuth(endpoints.taskById(id), {
          method: 'PUT',
          body: payload,
        }),
      delete: (id) =>
        withAuth(endpoints.taskById(id), {
          method: 'DELETE',
        }),
      updateStatus: (id, status) =>
        withAuth(endpoints.taskStatus(id, status), {
          method: 'PATCH',
        }),
    },
  }
}
