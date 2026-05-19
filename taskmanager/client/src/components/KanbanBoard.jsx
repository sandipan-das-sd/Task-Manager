import { STATUSES } from '../constants/task'
import { useAuth } from '../hooks/useAuth'
import { useWorkspace } from '../hooks/useWorkspace'
import TaskCard from './TaskCard'

export default function KanbanBoard({ onEditTask, onDeleteTask }) {
  const { isAdmin } = useAuth()
  const { projects, users, visibleTasks, moveTask } = useWorkspace()

  async function handleDropTask(event, status) {
    const taskId = event.dataTransfer.getData('text/plain')
    if (taskId) {
      await moveTask(taskId, status)
    }
  }

  return (
    <section className="kanban-board" aria-label="Kanban board">
      {STATUSES.map((status) => {
        const columnTasks = visibleTasks.filter(
          (task) => task.status === status.value,
        )

        return (
          <div
            className="kanban-column"
            key={status.value}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => handleDropTask(event, status.value)}
          >
            <div className="column-heading">
              <h3>{status.label}</h3>
              <span>{columnTasks.length}</span>
            </div>
            <div className="task-stack">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  projects={projects}
                  users={users}
                  canManageTasks={isAdmin}
                  onEditTask={onEditTask}
                  onDeleteTask={onDeleteTask}
                  onMoveTask={moveTask}
                />
              ))}
              {!columnTasks.length && (
                <div className="empty-column">No tasks here</div>
              )}
            </div>
          </div>
        )
      })}
    </section>
  )
}
