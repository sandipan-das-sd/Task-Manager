# Task Manager Client

React + Vite frontend for the Java Task Manager API.

## Local Setup

```bash
npm install
npm run dev
```

Create `.env` from `.env.example` and point it at your backend:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

For Vercel, add the same `VITE_API_BASE_URL` environment variable with your Render backend URL.

## Implemented Screens

- Login and registration with JWT session storage
- Dashboard stats for projects, tasks, progress, high priority, and overdue work
- Project create, update, delete, and member ID assignment
- Task create, update, delete, status movement, priority, due date, assignee ID
- Kanban board with native drag-and-drop status updates
- Task filters for project, status, priority, and assignee ID

## Frontend Structure

- `src/api/taskManagerApi.js` keeps backend endpoint paths, fetch/JWT handling, and readable auth/project/task API methods in one place
- `src/context/AuthContext.jsx` stores JWT session state
- `src/context/WorkspaceContext.jsx` stores project/task/filter dashboard state
- `src/hooks` exposes `useAuth` and `useWorkspace`
- `src/components` contains the page UI pieces
- `src/utils/taskUtils.js` contains payload builders and formatting helpers

## Backend Endpoints Used

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /health`
- `GET /api/projects`
- `POST /api/projects`
- `PUT /api/projects/{id}`
- `DELETE /api/projects/{id}`
- `GET /api/tasks`
- `GET /api/tasks/project/{projectId}`
- `GET /api/tasks/filter`
- `POST /api/tasks`
- `PUT /api/tasks/{id}`
- `PATCH /api/tasks/{id}/status`
- `DELETE /api/tasks/{id}`

## Current Limitation

The backend does not expose a users API or return the logged-in user's numeric ID, so the UI accepts `createdById`, `memberIds`, and `assignedToId` as manual numeric inputs.
