import { useAuth } from '../hooks/useAuth'
import { useWorkspace } from '../hooks/useWorkspace'

export default function Topbar() {
  const { session, logout } = useAuth()
  const { health, loadWorkspace } = useWorkspace()

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Task Management App</p>
        <h1>Kanban Dashboard</h1>
      </div>

      <div className="topbar-actions">
        <span className={`health-dot ${health}`}>{health}</span>
        <div className="user-chip">
          <strong>{session.email}</strong>
          <span>{session.role}</span>
        </div>
        <button type="button" className="secondary-btn" onClick={loadWorkspace}>
          Refresh
        </button>
        <button type="button" className="ghost-btn" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  )
}
