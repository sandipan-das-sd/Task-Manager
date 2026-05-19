import { useState } from 'react'
import { PRIORITIES, STATUSES } from '../constants/task'
import { useWorkspace } from '../hooks/useWorkspace'
import { buildTaskPayload, taskToForm } from '../utils/taskUtils'

export default function TaskForm({ editingTask, setEditingTask }) {
  const { projects, selectedProjectId, filters, saveTask } = useWorkspace()
  const fallbackProjectId = selectedProjectId || filters.projectId || projects[0]?.id || ''
  const [form, setForm] = useState(() => taskToForm(editingTask, fallbackProjectId))
  const isEditing = Boolean(editingTask)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function resetForm() {
    setForm(taskToForm(null, fallbackProjectId))
    setEditingTask(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const savedTask = await saveTask(buildTaskPayload(form), editingTask?.id)
    if (savedTask !== null) {
      resetForm()
    }
  }

  return (
    <section className="task-form-panel" aria-label="Task form">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Task editor</p>
          <h2>{isEditing ? 'Update task' : 'Create task'}</h2>
        </div>
        {isEditing && (
          <button type="button" className="ghost-btn" onClick={resetForm}>
            Cancel
          </button>
        )}
      </div>

      <form className="task-form-grid" onSubmit={handleSubmit}>
        <label>
          Title
          <input
            value={form.title}
            onChange={(event) => updateField('title', event.target.value)}
            placeholder="Design dashboard"
            required
          />
        </label>

        <label>
          Project
          <select
            value={form.projectId}
            onChange={(event) => updateField('projectId', event.target.value)}
            required
          >
            <option value="">Select project</option>
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
            value={form.status}
            onChange={(event) => updateField('status', event.target.value)}
          >
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
            value={form.priority}
            onChange={(event) => updateField('priority', event.target.value)}
          >
            {PRIORITIES.map((priority) => (
              <option key={priority.value} value={priority.value}>
                {priority.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Due date
          <input
            type="date"
            value={form.dueDate}
            onChange={(event) => updateField('dueDate', event.target.value)}
          />
        </label>

        <label>
          Assignee ID
          <input
            type="number"
            min="1"
            value={form.assignedToId}
            onChange={(event) => updateField('assignedToId', event.target.value)}
            placeholder="1"
          />
        </label>

        <label className="description-field">
          Description
          <textarea
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="Acceptance notes, context, links"
            rows="3"
            required
          />
        </label>

        <button className="primary-btn" type="submit" disabled={!projects.length}>
          {isEditing ? 'Save task' : 'Add task'}
        </button>
      </form>
    </section>
  )
}
