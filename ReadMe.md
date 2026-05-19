# Task Management App

A full-stack Trello-inspired task management application where users can manage projects, assign tasks, and track work visually on a Kanban board.

The project uses:

- Backend: Java, Spring Boot, Spring Security, JWT
- Frontend: React + Vite, HTML/CSS
- Database: PostgreSQL hosted on Supabase
- Frontend deployment target: Vercel
- Backend deployment target: Render

## Project Location

The actual application code is inside the nested folder:

```text
taskmanager/
```

From this repository root, backend and frontend paths look like this:

```text
taskmanager/
  src/        Backend source code
  client/     React frontend source code
  pom.xml     Backend Maven configuration
  Dockerfile  Backend Docker deployment file
```

## Main Features

- User registration and login with JWT authentication
- Role-based access control with `ADMIN` and `MEMBER`
- Admin project CRUD
- Admin task CRUD
- Member read-only dashboard access
- Member task status update only
- Kanban board with To Do, In Progress, Done columns
- Task priority, due date, project, and assignee support
- Dashboard stats for projects, tasks, progress, high priority, and overdue tasks
- Filters by project, status, priority, and assignee
- Forgot password and reset password flow
- Password visibility toggle on login/register/reset forms
- Safe user list endpoint for member selection without exposing passwords
- Supabase pooler fix for PostgreSQL prepared statement errors

## Role Permissions

### Admin

Admin users can:

- View dashboard
- Create projects
- Edit projects
- Delete projects
- Assign members to projects
- Create tasks
- Edit tasks
- Delete tasks
- Assign tasks to users
- Move tasks between Kanban columns
- Filter all tasks

### Member

Member users can:

- View dashboard
- View projects
- View tasks
- Filter tasks
- Move task status between To Do, In Progress, and Done

Member users cannot:

- Create projects
- Edit projects
- Delete projects
- Create tasks
- Edit task details
- Delete tasks

This rule is enforced in both places:

- Backend: `SecurityConfig.java`
- Frontend: role-aware React UI

## Backend Structure

Backend path:

```text
taskmanager/src/main/java/com/taskapp/taskmanager/
```

### Backend Folder Tree

```text
src/main/java/com/taskapp/taskmanager/
  TaskmanagerApplication.java

  config/
    CorsConfig.java
    SwaggerConfig.java

  controller/
    AuthController.java
    ForgotPasswordController.java
    HealthController.java
    ProjectController.java
    TaskController.java
    UserController.java

  dto/
    AuthResponse.java
    ForgetPasswordRequest.java
    LoginRequest.java
    ProjectDto.java
    RegisterRequest.java
    ResetPasswordRequest.java
    TaskDto.java
    UserDto.java

  entity/
    PasswordResetToken.java
    Project.java
    Role.java
    Task.java
    TaskPriority.java
    TaskStatus.java
    User.java

  exception/
    GlobalExceptionHandler.java

  repositary/
    PasswordResetTokenRepository.java
    ProjectRepository.java
    TaskRepository.java
    UserRepository.java

  security/
    JwtAuthFilter.java
    JwtUtil.java
    SecurityConfig.java

  service/
    AuthService.java
    EmailService.java
    ForgotPasswordService.java
    ProjectService.java
    TaskService.java

  service/impl/
    AuthServiceImpl.java
    EmailServiceImpl.java
    ForgotPasswordServiceImpl.java
    ProjectServiceImpl.java
    TaskServiceImpl.java
```

## Backend File Details

### `TaskmanagerApplication.java`

Spring Boot application entry point. Starts the backend application.

### `config/CorsConfig.java`

Configures Cross-Origin Resource Sharing so the React frontend can call the Java backend.

Used for:

- Local frontend URL, such as `http://localhost:5173`
- Deployed Vercel frontend URL

### `config/SwaggerConfig.java`

Swagger/OpenAPI configuration. Used to expose API documentation during development.

### `controller/AuthController.java`

Handles authentication routes:

- `POST /api/auth/register`
- `POST /api/auth/login`

Uses:

- `RegisterRequest`
- `LoginRequest`
- `AuthResponse`
- `AuthService`

### `controller/ForgotPasswordController.java`

Handles password recovery routes:

- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

Returns JSON response messages like:

```json
{
  "message": "Password reset successfully"
}
```

### `controller/HealthController.java`

Health check endpoint:

- `GET /health`

Used to confirm:

- Backend is running
- Database connection works
- Database product/version

### `controller/ProjectController.java`

Project REST API:

- `GET /api/projects`
- `POST /api/projects`
- `PUT /api/projects/{id}`
- `DELETE /api/projects/{id}`

Role behavior:

- Admin can create, update, delete
- Admin and Member can view

### `controller/TaskController.java`

Task REST API:

- `GET /api/tasks`
- `GET /api/tasks/project/{projectId}`
- `GET /api/tasks/filter`
- `POST /api/tasks`
- `PUT /api/tasks/{id}`
- `PATCH /api/tasks/{id}/status`
- `DELETE /api/tasks/{id}`

Role behavior:

- Admin can create, update, delete tasks
- Admin and Member can view tasks
- Admin and Member can update task status

### `controller/UserController.java`

Safe user list API:

- `GET /api/users`

Returns only:

- `id`
- `name`
- `email`
- `role`

It does not return passwords.

Frontend uses this endpoint for:

- Project creator dropdown
- Project member checklist
- Task assignee dropdown
- Assignee filter dropdown

## DTO Files

DTO means Data Transfer Object. These classes define the JSON shape sent between frontend and backend.

### `AuthResponse.java`

Returned after login/register.

Contains:

- `token`
- `email`
- `role`

### `RegisterRequest.java`

Payload for registration.

Contains:

- `name`
- `email`
- `password`
- `role`

### `LoginRequest.java`

Payload for login.

Contains:

- `email`
- `password`

### `ForgetPasswordRequest.java`

Payload for forgot password.

Contains:

- `email`

### `ResetPasswordRequest.java`

Payload for password reset.

Contains:

- `token`
- `newPassword`

### `ProjectDto.java`

Payload/response for projects.

Contains:

- `id`
- `name`
- `description`
- `createdById`
- `createdByName`
- `memberIds`

### `TaskDto.java`

Payload/response for tasks.

Contains:

- `id`
- `title`
- `description`
- `status`
- `priority`
- `dueDate`
- `projectId`
- `assignedToId`

### `UserDto.java`

Safe response for user selection.

Contains:

- `id`
- `name`
- `email`
- `role`

Does not expose password.

## Entity Files

Entity files map Java objects to PostgreSQL database tables.

### `User.java`

Database table: `users`

Fields:

- `id`
- `name`
- `email`
- `password`
- `role`

The password is stored as a BCrypt hash.

### `Role.java`

Enum values:

- `ADMIN`
- `MEMBER`

### `Project.java`

Represents a project.

Fields:

- `id`
- `name`
- `description`
- `createdBy`
- `members`

Relationships:

- Many projects can be created by one user
- Projects can have many members

### `Task.java`

Represents a task.

Fields:

- `id`
- `title`
- `description`
- `status`
- `priority`
- `dueDate`
- `project`
- `assignedTo`

Relationships:

- Many tasks belong to one project
- Many tasks can be assigned to one user

### `TaskStatus.java`

Enum values:

- `TODO`
- `IN_PROGRESS`
- `DONE`

### `TaskPriority.java`

Enum values:

- `LOW`
- `MEDIUM`
- `HIGH`

### `PasswordResetToken.java`

Stores password reset tokens.

Fields:

- `id`
- `token`
- `user`
- `expiryDate`
- `used`

## Repository Files

Repositories connect the service layer to PostgreSQL using Spring Data JPA.

### `UserRepository.java`

Used for:

- Find user by email
- Check duplicate email
- Find users by ID
- List users

### `ProjectRepository.java`

Used for project database operations.

### `TaskRepository.java`

Used for:

- List tasks
- Find tasks by project
- Find tasks by status
- Find tasks by priority
- Find tasks by assignee

### `PasswordResetTokenRepository.java`

Used to find password reset tokens by token string.

## Service Files

Service interfaces define business logic contracts.

### `AuthService.java`

Defines:

- Register
- Login

### `ProjectService.java`

Defines:

- Get all projects
- Create project
- Update project
- Delete project

### `TaskService.java`

Defines:

- Get all tasks
- Get tasks by project
- Create task
- Update task
- Update status
- Delete task
- Filter tasks

### `ForgotPasswordService.java`

Defines:

- Forgot password
- Reset password

### `EmailService.java`

Defines email sending methods.

## Service Implementation Files

### `AuthServiceImpl.java`

Handles:

- User registration
- Duplicate email validation
- Password hashing with BCrypt
- Login password check
- JWT creation
- Welcome/login email notification

### `ProjectServiceImpl.java`

Handles:

- Project creation
- Project update
- Project deletion
- Assigning members
- Project email notifications
- Mapping Project entity to ProjectDto

### `TaskServiceImpl.java`

Handles:

- Task creation
- Task update
- Task deletion
- Task status update
- Task filtering
- Assignment notification emails
- Mapping Task entity to TaskDto

### `ForgotPasswordServiceImpl.java`

Handles:

- Creating password reset token
- Token expiry
- Sending reset email
- Validating reset token
- Updating password
- Marking token as used

### `EmailServiceImpl.java`

Handles SMTP email sending.

Used for:

- Welcome email
- Login alert
- Project assignment/update/delete emails
- Task assignment/update/status/delete emails
- Password reset email

## Security Files

### `JwtUtil.java`

Handles:

- JWT token generation
- Extract email from token
- Extract role from token
- Token expiry validation

### `JwtAuthFilter.java`

Runs on every protected API request.

It:

- Reads `Authorization: Bearer <token>`
- Validates JWT
- Loads user by email
- Adds Spring Security authentication with role

### `SecurityConfig.java`

Main Spring Security configuration.

Allows public access to:

- `/api/auth/**`
- `/health`
- Swagger docs

Protects role-based routes:

- Admin and Member can view projects/tasks/users
- Admin can create/update/delete projects
- Admin can create/update/delete tasks
- Admin and Member can update task status

## Exception Handling

### `GlobalExceptionHandler.java`

Returns JSON error responses for:

- Runtime exceptions
- Validation errors

Example:

```json
{
  "message": "User not found"
}
```

## Backend Resource Files

### `src/main/resources/application.properties`

Stores Spring Boot configuration.

Contains settings for:

- Database connection
- Hibernate/JPA
- Server port
- JWT secret and expiry
- Frontend reset-password URL
- SMTP email settings
- Supabase prepared statement fix

Important security note:

Do not publish real database passwords, JWT secrets, or email app passwords in a public GitHub repository. Use environment variables on Render.

Recommended production variables:

```text
SPRING_DATASOURCE_URL=jdbc:postgresql://.../postgres?sslmode=require&prepareThreshold=0
SPRING_DATASOURCE_USERNAME=your_database_username
SPRING_DATASOURCE_PASSWORD=your_database_password
JWT_SECRET=your_long_secret_key
JWT_EXPIRATION=86400000
FRONTEND_URL=https://your-vercel-app.vercel.app
SPRING_MAIL_USERNAME=your_email
SPRING_MAIL_PASSWORD=your_email_app_password
```

## Supabase PostgreSQL Note

When using the Supabase pooler on port `6543`, PostgreSQL JDBC prepared statements can cause errors like:

```text
prepared statement "S_2" already exists
prepared statement "S_1" does not exist
current transaction is aborted
```

This project disables server-side prepared statements with:

```properties
prepareThreshold=0
spring.datasource.hikari.data-source-properties.prepareThreshold=0
spring.datasource.hikari.data-source-properties.preparedStatementCacheQueries=0
```

## Frontend Structure

Frontend path:

```text
taskmanager/client/
```

### Frontend Folder Tree

```text
client/
  index.html
  package.json
  package-lock.json
  vite.config.js
  eslint.config.js
  vercel.json
  README.md
  .env.example

  public/
    favicon.svg
    icons.svg

  src/
    main.jsx
    App.jsx
    App.css
    index.css

    api/
      taskManagerApi.js

    assets/
      hero.png
      react.svg
      vite.svg

    components/
      AuthPanel.jsx
      Dashboard.jsx
      DueSoonList.jsx
      FilterBar.jsx
      KanbanBoard.jsx
      PasswordInput.jsx
      ProjectPanel.jsx
      StatGrid.jsx
      StatusLine.jsx
      TaskCard.jsx
      TaskForm.jsx
      Topbar.jsx

    constants/
      task.js

    context/
      AuthContext.jsx
      WorkspaceContext.jsx
      auth-context-value.js
      workspace-context-value.js

    hooks/
      useAuth.js
      useWorkspace.js

    utils/
      taskUtils.js
```

## Frontend File Details

### `client/package.json`

Defines frontend dependencies and scripts.

Important scripts:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### `client/vite.config.js`

Vite configuration for React.

Includes:

- React plugin
- Tailwind plugin
- React compiler preset

### `client/vercel.json`

Vercel rewrite configuration.

Used so routes like:

```text
/reset-password?token=...
```

load the React app correctly instead of returning a 404.

### `client/.env.example`

Example frontend environment file.

```text
VITE_API_BASE_URL=http://localhost:8080
```

For deployment, set this to the Render backend URL.

### `client/src/main.jsx`

React entry point.

Renders `<App />` into the HTML root element.

### `client/src/App.jsx`

Top-level app composition.

It:

- Wraps the app with `AuthProvider`
- Shows `AuthPanel` when logged out
- Shows `Dashboard` inside `WorkspaceProvider` when logged in

### `client/src/App.css`

Main app styling.

Contains:

- Auth page layout
- Dashboard layout
- Project panel styling
- Task board styling
- Task card styling
- Form styling
- Password eye button styling
- Responsive mobile styles

### `client/src/index.css`

Global CSS entry.

Currently imports Tailwind:

```css
@import "tailwindcss";
```

## Frontend API Layer

### `client/src/api/taskManagerApi.js`

Single frontend API file.

Contains:

- Backend base URL
- API endpoint paths
- Fetch helper
- JSON/plain-text response parser
- JWT Authorization header handling
- Auth API methods
- Project API methods
- Task API methods
- User API methods

Important methods:

```js
authApi.login(payload)
authApi.register(payload)
authApi.forgotPassword(payload)
authApi.resetPassword(payload)
createTaskManagerApi(token).projects.list()
createTaskManagerApi(token).tasks.updateStatus(id, status)
createTaskManagerApi(token).users.list()
```

## Frontend Context Files

### `context/AuthContext.jsx`

Stores authentication state.

Handles:

- Current session
- JWT token
- User email
- User role
- Login
- Register
- Logout
- Auth loading state
- Auth error state
- `isAdmin`
- `isMember`

Session is stored in:

```text
localStorage
```

### `context/auth-context-value.js`

Creates the React auth context object.

Separated from `AuthContext.jsx` for React Fast Refresh compatibility.

### `context/WorkspaceContext.jsx`

Stores dashboard/workspace state.

Handles:

- Projects
- Users
- Tasks
- Visible filtered tasks
- Selected project
- Filters
- Loading state
- Backend health
- Success/error messages
- Project save/delete
- Task save/delete
- Task status movement

### `context/workspace-context-value.js`

Creates the React workspace context object.

Separated from `WorkspaceContext.jsx` for React Fast Refresh compatibility.

## Frontend Hook Files

### `hooks/useAuth.js`

Helper hook to access auth context.

Used by:

- `AuthPanel`
- `Topbar`
- `Dashboard`
- `ProjectPanel`
- `KanbanBoard`

### `hooks/useWorkspace.js`

Helper hook to access workspace context.

Used by dashboard components that need projects, users, tasks, filters, or actions.

## Frontend Component Files

### `components/AuthPanel.jsx`

Authentication screen.

Handles:

- Login
- Register
- Forgot password
- Reset password
- Reading reset token from URL
- Hiding reset token field when token comes from email link

Uses:

- `authApi`
- `useAuth`
- `PasswordInput`

### `components/PasswordInput.jsx`

Reusable password input component.

Provides:

- Password field
- Eye icon show/hide toggle
- Accessible label/title

Used in:

- Login form
- Register form
- Reset password form

### `components/Dashboard.jsx`

Main logged-in page.

Composes:

- `Topbar`
- `StatusLine`
- `ProjectPanel`
- `StatGrid`
- `FilterBar`
- `TaskForm`
- `KanbanBoard`
- `DueSoonList`

Role behavior:

- Admin sees `TaskForm`
- Member does not see `TaskForm`

### `components/Topbar.jsx`

Top header.

Shows:

- App name
- Backend health status
- Logged-in email
- User role
- Refresh button
- Logout button

### `components/StatusLine.jsx`

Shows workspace loading, success, or error messages.

Examples:

- `Syncing with backend...`
- `Task updated.`
- Backend error messages

### `components/ProjectPanel.jsx`

Sidebar project panel.

Admin can:

- Create project
- Edit project
- Delete project
- Select creator
- Select members

Member can:

- View project list
- Select project

### `components/StatGrid.jsx`

Dashboard summary cards.

Shows:

- Total projects
- Total tasks
- Done percentage
- High priority count
- Overdue count

### `components/FilterBar.jsx`

Task filters.

Filters by:

- Project
- Status
- Priority
- Assignee

Uses user names from `/api/users` instead of manual IDs.

### `components/TaskForm.jsx`

Admin-only task form.

Used for:

- Creating tasks
- Editing tasks
- Selecting project
- Selecting status
- Selecting priority
- Selecting due date
- Selecting assignee
- Writing task description

### `components/KanbanBoard.jsx`

Kanban board layout.

Columns:

- To Do
- In Progress
- Done

Supports drag-and-drop status updates.

Role behavior:

- Admin can move status, edit, delete
- Member can move status only

### `components/TaskCard.jsx`

Individual task card.

Shows:

- Priority
- Due date
- Title
- Description
- Project name
- Assignee name
- Move left/right buttons
- Admin-only Edit/Delete buttons

### `components/DueSoonList.jsx`

Shows tasks due in the next 7 days.

Does not show completed tasks.

## Frontend Constants and Utils

### `constants/task.js`

Stores reusable constants:

- Storage key
- Task statuses
- Task priorities
- Empty project form state
- Empty task form state
- Empty filter state

### `utils/taskUtils.js`

Helper functions for:

- Parsing IDs
- Parsing member selections
- Formatting member IDs
- Getting project name
- Getting user display name
- Building project payloads
- Building task payloads
- Converting API project/task data to form state
- Finding upcoming tasks
- Finding overdue tasks

## Backend API Endpoints

### Auth

```text
POST /api/auth/register
POST /api/auth/login
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

### Health

```text
GET /health
```

### Users

```text
GET /api/users
```

### Projects

```text
GET /api/projects
POST /api/projects
PUT /api/projects/{id}
DELETE /api/projects/{id}
```

### Tasks

```text
GET /api/tasks
GET /api/tasks/project/{projectId}
GET /api/tasks/filter?status=TODO
GET /api/tasks/filter?priority=HIGH
GET /api/tasks/filter?assigneeId=1
POST /api/tasks
PUT /api/tasks/{id}
PATCH /api/tasks/{id}/status?status=DONE
DELETE /api/tasks/{id}
```

## Request Examples

### Register

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "role": "ADMIN"
}
```

### Login

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Create Project

```json
{
  "name": "Task Management App",
  "description": "Spring Boot and React board",
  "createdById": 1,
  "memberIds": [1, 2]
}
```

### Create Task

```json
{
  "title": "Build dashboard",
  "description": "Create Kanban dashboard UI",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-05-21",
  "projectId": 1,
  "assignedToId": 2
}
```

### Update Task Status

```text
PATCH /api/tasks/1/status?status=DONE
```

## Local Backend Setup

From the backend folder:

```bash
cd taskmanager
```

Run backend:

```bash
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

If Maven wrapper needs Java path on Windows:

```powershell
$env:JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-25.0.2.10-hotspot"
.\mvnw.cmd spring-boot:run
```

Default backend URL:

```text
http://localhost:8081
```

## Local Frontend Setup

From the frontend folder:

```bash
cd taskmanager/client
npm install
npm run dev
```

Default frontend URL:

```text
http://localhost:5173
```

Create a frontend `.env` file:

```text
VITE_API_BASE_URL=http://localhost:8081
```

## Build and Test

### Frontend

```bash
cd taskmanager/client
npm run lint
npm run build
```

### Backend

```bash
cd taskmanager
./mvnw test
```

Windows:

```powershell
cd taskmanager
.\mvnw.cmd test
```

## Deployment Notes

### Frontend on Vercel

Use:

```text
Root Directory: taskmanager/client
Build Command: npm run build
Output Directory: dist
```

Set environment variable:

```text
VITE_API_BASE_URL=https://your-render-backend.onrender.com
```

### Backend on Render

Use Docker deployment with:

```text
taskmanager/Dockerfile
```

Set environment variables on Render instead of hardcoding secrets:

```text
SPRING_DATASOURCE_URL=jdbc:postgresql://.../postgres?sslmode=require&prepareThreshold=0
SPRING_DATASOURCE_USERNAME=your_database_username
SPRING_DATASOURCE_PASSWORD=your_database_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=86400000
FRONTEND_URL=https://your-vercel-app.vercel.app
SPRING_MAIL_USERNAME=your_email
SPRING_MAIL_PASSWORD=your_email_app_password
```

## Important Security Checklist Before Public GitHub

- Do not commit real database password
- Do not commit real Gmail app password
- Do not commit production JWT secret
- Use `.env` or Render environment variables
- Keep `.env` files ignored
- Use strong JWT secret in production
- Use HTTPS Render/Vercel URLs in deployed setup

## Current Known Limitations

- No real-time collaboration updates
- No comments per task
- No file attachments
- Email delivery depends on configured SMTP credentials
- Member users can update task status but cannot edit full task details
- Task assignment is based on user list from backend

## Project Status

The application is ready for review with a working Spring Boot API, React dashboard, JWT authentication, Admin/Member permissions, Supabase PostgreSQL integration, and deployment configuration for Render and Vercel.
