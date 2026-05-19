import { useWorkspace } from '../hooks/useWorkspace'
import { getProjectName, getUpcomingTasks } from '../utils/taskUtils'

export default function DueSoonList() {
  const { projects, visibleTasks } = useWorkspace()
  const upcomingTasks = getUpcomingTasks(visibleTasks)

  return (
    <section className="due-panel" aria-label="Upcoming tasks">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Next 7 days</p>
          <h2>Due soon</h2>
        </div>
      </div>

      <div className="due-list">
        {upcomingTasks.slice(0, 6).map((task) => (
          <div className="due-row" key={task.id}>
            <div>
              <strong>{task.title}</strong>
              <span>{getProjectName(projects, task.projectId) || 'Project'}</span>
            </div>
            <time dateTime={task.dueDate}>{task.dueDate}</time>
          </div>
        ))}
        {!upcomingTasks.length && (
          <div className="empty-column">Nothing due this week</div>
        )}
      </div>
    </section>
  )
}
