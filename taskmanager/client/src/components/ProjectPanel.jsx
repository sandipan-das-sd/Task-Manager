import { useState } from 'react'
import { EMPTY_PROJECT_FORM } from '../constants/task'
import { useWorkspace } from '../hooks/useWorkspace'
import { buildProjectPayload, projectToForm } from '../utils/taskUtils'

export default function ProjectPanel({ editingProject, setEditingProject }) {
  const {
    projects,
    selectedProjectId,
    selectProject,
    saveProject,
    deleteProject,
  } = useWorkspace()
  const [form, setForm] = useState(() => projectToForm(editingProject))
  const isEditing = Boolean(editingProject)

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function startNewProject() {
    setEditingProject(null)
    setForm(EMPTY_PROJECT_FORM)
  }

  function startEditProject(project) {
    setEditingProject(project)
    setForm(projectToForm(project))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const savedProject = await saveProject(
      buildProjectPayload(form),
      editingProject?.id,
    )

    if (savedProject?.id) {
      setForm(EMPTY_PROJECT_FORM)
      setEditingProject(null)
      selectProject(String(savedProject.id))
    }
  }

  async function handleDeleteProject() {
    if (!editingProject?.id) {
      return
    }

    const deleted = await deleteProject(editingProject.id)
    if (deleted !== null) {
      setEditingProject(null)
      setForm(EMPTY_PROJECT_FORM)
    }
  }

  return (
    <aside className="project-panel" aria-label="Projects">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Workspace</p>
          <h2>Projects</h2>
        </div>
        <button type="button" className="ghost-btn" onClick={startNewProject}>
          New
        </button>
      </div>

      <div className="project-list">
        <button
          type="button"
          className={!selectedProjectId ? 'project-row active' : 'project-row'}
          onClick={() => selectProject('')}
        >
          <span>All projects</span>
          <small>{projects.length}</small>
        </button>

        {projects.map((project) => (
          <div
            key={project.id}
            className={
              String(selectedProjectId) === String(project.id)
                ? 'project-item active'
                : 'project-item'
            }
          >
            <button
              type="button"
              className="project-row"
              onClick={() => selectProject(String(project.id))}
            >
              <span>{project.name}</span>
              <small>#{project.id}</small>
            </button>
            <button
              type="button"
              className="mini-btn"
              onClick={() => startEditProject(project)}
            >
              Edit
            </button>
          </div>
        ))}
      </div>

      <form className="stack-form compact-form" onSubmit={handleSubmit}>
        <h3>{isEditing ? 'Update project' : 'Create project'}</h3>

        <label>
          Name
          <input
            value={form.name}
            onChange={(event) => updateField('name', event.target.value)}
            placeholder="Task Management App"
            required
          />
        </label>

        <label>
          Description
          <textarea
            value={form.description}
            onChange={(event) => updateField('description', event.target.value)}
            placeholder="Spring Boot and React board"
            rows="3"
          />
        </label>

        <div className="two-column">
          <label>
            Creator ID
            <input
              type="number"
              min="1"
              value={form.createdById}
              onChange={(event) => updateField('createdById', event.target.value)}
              placeholder="1"
            />
          </label>
          <label>
            Member IDs
            <input
              value={form.memberIds}
              onChange={(event) => updateField('memberIds', event.target.value)}
              placeholder="1, 2, 3"
            />
          </label>
        </div>

        <div className="button-row">
          <button className="primary-btn" type="submit">
            {isEditing ? 'Save project' : 'Add project'}
          </button>
          {isEditing && (
            <button
              type="button"
              className="danger-btn"
              onClick={handleDeleteProject}
            >
              Delete
            </button>
          )}
        </div>
      </form>
    </aside>
  )
}
