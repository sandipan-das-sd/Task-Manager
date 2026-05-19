import { PRIORITIES, STATUSES } from '../constants/task'
import { useWorkspace } from '../hooks/useWorkspace'

export default function FilterBar() {
  const { projects, filters, setFilters, applyFilters, clearFilters } =
    useWorkspace()

  function updateField(field, value) {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  return (
    <section className="filter-bar" aria-label="Task filters">
      <label>
        Project
        <select
          value={filters.projectId}
          onChange={(event) => updateField('projectId', event.target.value)}
        >
          <option value="">All</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Status
        <select
          value={filters.status}
          onChange={(event) => updateField('status', event.target.value)}
        >
          <option value="">All</option>
          {STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Priority
        <select
          value={filters.priority}
          onChange={(event) => updateField('priority', event.target.value)}
        >
          <option value="">All</option>
          {PRIORITIES.map((priority) => (
            <option key={priority.value} value={priority.value}>
              {priority.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        Assignee ID
        <input
          type="number"
          min="1"
          value={filters.assigneeId}
          onChange={(event) => updateField('assigneeId', event.target.value)}
          placeholder="Any"
        />
      </label>
      <div className="filter-actions">
        <button type="button" className="secondary-btn" onClick={() => applyFilters()}>
          Apply
        </button>
        <button type="button" className="ghost-btn" onClick={clearFilters}>
          Clear
        </button>
      </div>
    </section>
  )
}
