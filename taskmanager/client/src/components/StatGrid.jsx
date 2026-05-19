import { useWorkspace } from '../hooks/useWorkspace'
import { getOverdueTasks } from '../utils/taskUtils'

export default function StatGrid() {
  const { projects, tasks } = useWorkspace()
  const doneCount = tasks.filter((task) => task.status === 'DONE').length
  const highCount = tasks.filter((task) => task.priority === 'HIGH').length
  const overdueCount = getOverdueTasks(tasks).length
  const progress = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0

  return (
    <section className="stat-grid" aria-label="Dashboard overview">
      <div className="stat-card">
        <span>Projects</span>
        <strong>{projects.length}</strong>
      </div>
      <div className="stat-card">
        <span>Tasks</span>
        <strong>{tasks.length}</strong>
      </div>
      <div className="stat-card">
        <span>Done</span>
        <strong>{progress}%</strong>
      </div>
      <div className="stat-card alert">
        <span>High Priority</span>
        <strong>{highCount}</strong>
      </div>
      <div className="stat-card danger">
        <span>Overdue</span>
        <strong>{overdueCount}</strong>
      </div>
    </section>
  )
}
