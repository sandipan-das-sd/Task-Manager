import { useCallback, useEffect, useMemo, useState } from 'react'
import { createTaskManagerApi } from '../api/taskManagerApi'
import { EMPTY_FILTERS } from '../constants/task'
import { useAuth } from '../hooks/useAuth'
import { getStatusLabel } from '../utils/taskUtils'
import { WorkspaceContext } from './workspace-context-value'

function shouldUseProjectEndpoint(filters) {
  return (
    filters.projectId &&
    !filters.status &&
    !filters.priority &&
    !filters.assigneeId
  )
}

function hasTaskFilters(filters) {
  return Boolean(filters.status || filters.priority || filters.assigneeId)
}

export function WorkspaceProvider({ children }) {
  const { session } = useAuth()
  const [users, setUsers] = useState([])
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [selectedProjectId, setSelectedProjectId] = useState('')
  const [loading, setLoading] = useState(false)
  const [health, setHealth] = useState('checking')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  const api = useMemo(() => createTaskManagerApi(session?.token), [session?.token])

  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => {
      const selectedProjectMatch =
        !selectedProjectId || String(task.projectId) === String(selectedProjectId)
      const filterProjectMatch =
        !filters.projectId || String(task.projectId) === String(filters.projectId)
      const statusMatch = !filters.status || task.status === filters.status
      const priorityMatch = !filters.priority || task.priority === filters.priority
      const assigneeMatch =
        !filters.assigneeId ||
        String(task.assignedToId) === String(filters.assigneeId)

      return (
        selectedProjectMatch &&
        filterProjectMatch &&
        statusMatch &&
        priorityMatch &&
        assigneeMatch
      )
    })
  }, [tasks, selectedProjectId, filters])

  const runAction = useCallback(async (action, successMessage = '') => {
    setLoading(true)
    setError('')
    setNotice('')

    try {
      const result = await action()
      if (successMessage) {
        setNotice(successMessage)
      }
      return result
    } catch (actionError) {
      setError(actionError.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshWorkspace = useCallback(async () => {
    const [userData, projectData, taskData] = await Promise.all([
      api.users.list(),
      api.projects.list(),
      api.tasks.list(),
    ])
    setUsers(userData)
    setProjects(projectData)
    setTasks(taskData)
  }, [api])

  const loadWorkspace = useCallback(
    () => runAction(refreshWorkspace),
    [refreshWorkspace, runAction],
  )

  const checkHealth = useCallback(async () => {
    try {
      const response = await api.health()
      setHealth(response.databaseStatus === 'Connected' ? 'online' : 'partial')
    } catch {
      setHealth('offline')
    }
  }, [api])

  const applyFilters = useCallback(
    async (nextFilters = filters) => {
      await runAction(async () => {
        let taskData

        if (shouldUseProjectEndpoint(nextFilters)) {
          taskData = await api.tasks.byProject(nextFilters.projectId)
        } else if (hasTaskFilters(nextFilters)) {
          taskData = await api.tasks.filter(nextFilters)
        } else {
          taskData = await api.tasks.list()
        }

        setTasks(taskData)
      })
    },
    [api, filters, runAction],
  )

  const clearFilters = useCallback(async () => {
    const resetFilters = { ...EMPTY_FILTERS }
    setFilters(resetFilters)
    setSelectedProjectId('')
    await applyFilters(resetFilters)
  }, [applyFilters])

  const selectProject = useCallback((projectId) => {
    setSelectedProjectId(projectId)
  }, [])

  const saveProject = useCallback(
    async (payload, projectId = null) => {
      return runAction(async () => {
        const savedProject = projectId
          ? await api.projects.update(projectId, payload)
          : await api.projects.create(payload)

        await refreshWorkspace()
        return savedProject
      }, projectId ? 'Project updated.' : 'Project created.')
    },
    [api, refreshWorkspace, runAction],
  )

  const deleteProject = useCallback(
    async (projectId) => {
      return runAction(async () => {
        await api.projects.delete(projectId)
        if (String(selectedProjectId) === String(projectId)) {
          setSelectedProjectId('')
        }
        await refreshWorkspace()
        return true
      }, 'Project deleted.')
    },
    [api, refreshWorkspace, runAction, selectedProjectId],
  )

  const saveTask = useCallback(
    async (payload, taskId = null) => {
      return runAction(async () => {
        if (!payload.projectId) {
          throw new Error('Please select a project before saving the task.')
        }

        let savedTask
        if (taskId) {
          savedTask = await api.tasks.update(taskId, payload)
        } else {
          savedTask = await api.tasks.create(payload)
        }

        await refreshWorkspace()
        return savedTask
      }, taskId ? 'Task updated.' : 'Task created.')
    },
    [api, refreshWorkspace, runAction],
  )

  const deleteTask = useCallback(
    async (taskId) => {
      return runAction(async () => {
        await api.tasks.delete(taskId)
        await refreshWorkspace()
        return true
      }, 'Task deleted.')
    },
    [api, refreshWorkspace, runAction],
  )

  const moveTask = useCallback(
    async (taskId, status) => {
      if (!status) {
        return
      }

      return runAction(async () => {
        await api.tasks.updateStatus(taskId, status)
        await refreshWorkspace()
        return true
      }, `Moved to ${getStatusLabel(status)}.`)
    },
    [api, refreshWorkspace, runAction],
  )

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      checkHealth()
    }, 0)

    return () => window.clearTimeout(timerId)
  }, [checkHealth])

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      if (session?.token) {
        loadWorkspace()
      }
    }, 0)

    return () => window.clearTimeout(timerId)
  }, [session?.token, loadWorkspace])

  const value = useMemo(
    () => ({
      projects,
      users,
      tasks,
      visibleTasks,
      filters,
      selectedProjectId,
      loading,
      health,
      notice,
      error,
      setFilters,
      selectProject,
      loadWorkspace,
      applyFilters,
      clearFilters,
      saveProject,
      deleteProject,
      saveTask,
      deleteTask,
      moveTask,
    }),
    [
      projects,
      users,
      tasks,
      visibleTasks,
      filters,
      selectedProjectId,
      loading,
      health,
      notice,
      error,
      setFilters,
      selectProject,
      loadWorkspace,
      applyFilters,
      clearFilters,
      saveProject,
      deleteProject,
      saveTask,
      deleteTask,
      moveTask,
    ],
  )

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  )
}
