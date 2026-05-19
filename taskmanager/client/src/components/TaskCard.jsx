import { STATUSES } from '../constants/task'
import {
  getPriorityLabel,
  getProjectName,
  getUserLabel,
} from '../utils/taskUtils'

export default function TaskCard({
  task,
  projects,
  users,
  canManageTasks,
  onEditTask,
  onDeleteTask,
  onMoveTask,
}) {
  const statusIndex = STATUSES.findIndex((status) => status.value === task.status)
  const previousStatus = STATUSES[statusIndex - 1]?.value
  const nextStatus = STATUSES[statusIndex + 1]?.value
  const projectName = getProjectName(projects, task.projectId)

  function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', String(task.id))
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <article className="task-card" draggable onDragStart={handleDragStart}>
      <div className="task-card-topline">
        <span className={`priority-pill priority-${task.priority?.toLowerCase()}`}>
          {getPriorityLabel(task.priority)}
        </span>
        {task.dueDate && <time dateTime={task.dueDate}>{task.dueDate}</time>}
      </div>

      <h4>{task.title}</h4>
      <p>{task.description}</p>

      <div className="task-meta">
        <span>{projectName || `Project #${task.projectId}`}</span>
        <span>{getUserLabel(users, task.assignedToId)}</span>
      </div>

      <div className="task-actions">
        <button
          type="button"
          className="icon-btn"
          disabled={!previousStatus}
          onClick={() => onMoveTask(task.id, previousStatus)}
          title="Move left"
        >
          &lt;
        </button>
        {canManageTasks && (
          <button type="button" className="ghost-btn" onClick={() => onEditTask(task)}>
            Edit
          </button>
        )}
        {canManageTasks && (
          <button
            type="button"
            className="danger-text-btn"
            onClick={() => onDeleteTask(task.id)}
          >
            Delete
          </button>
        )}
        <button
          type="button"
          className="icon-btn"
          disabled={!nextStatus}
          onClick={() => onMoveTask(task.id, nextStatus)}
          title="Move right"
        >
          &gt;
        </button>
      </div>
    </article>
  )
}
