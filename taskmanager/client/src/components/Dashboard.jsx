import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useWorkspace } from '../hooks/useWorkspace'
import DueSoonList from './DueSoonList'
import FilterBar from './FilterBar'
import KanbanBoard from './KanbanBoard'
import ProjectPanel from './ProjectPanel'
import StatGrid from './StatGrid'
import StatusLine from './StatusLine'
import TaskForm from './TaskForm'
import Topbar from './Topbar'

export default function Dashboard() {
  const { isAdmin } = useAuth()
  const { deleteTask, selectedProjectId, filters, projects } = useWorkspace()
  const [editingProject, setEditingProject] = useState(null)
  const [editingTask, setEditingTask] = useState(null)

  async function handleDeleteTask(taskId) {
    const deleted = await deleteTask(taskId)
    if (deleted !== null && String(editingTask?.id) === String(taskId)) {
      setEditingTask(null)
    }
  }

  const taskFormKey = `${editingTask?.id || 'new'}-${
    selectedProjectId || filters.projectId || projects[0]?.id || 'none'
  }`

  return (
    <div className="app-shell">
      <Topbar />
      <StatusLine />

      <div className="workspace-grid">
        <ProjectPanel
          editingProject={editingProject}
          setEditingProject={setEditingProject}
        />

        <main className="main-workspace">
          <StatGrid />
          <FilterBar />
          {isAdmin && (
            <TaskForm
              key={taskFormKey}
              editingTask={editingTask}
              setEditingTask={setEditingTask}
            />
          )}

          <div className="content-grid">
            <KanbanBoard
              onEditTask={setEditingTask}
              onDeleteTask={handleDeleteTask}
            />
            <DueSoonList />
          </div>
        </main>
      </div>
    </div>
  )
}
