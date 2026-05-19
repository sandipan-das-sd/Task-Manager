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
- Password visibility toggle on auth and reset forms
- Forgot password and reset password flows
- Dashboard stats for projects, tasks, progress, high priority, and overdue work
- Admin-only project and task create, update, delete controls
- Member read-only dashboard with task status updates only
- Project create, update, delete, and member assignment with user selection
- Task create, update, delete, status movement, priority, due date, and assignee selection
- Kanban board with native drag-and-drop status updates
- Task filters for project, status, priority, and assignee

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
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /health`
- `GET /api/users`
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
