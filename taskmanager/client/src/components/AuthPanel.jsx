import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function AuthPanel() {
  const { login, register, authLoading, authError, clearAuthError } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'MEMBER',
  })

  const isRegister = mode === 'register'

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function changeMode(nextMode) {
    setMode(nextMode)
    clearAuthError()
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const payload = isRegister
      ? {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
        }
      : {
          email: form.email.trim(),
          password: form.password,
        }

    if (isRegister) {
      await register(payload)
    } else {
      await login(payload)
    }
  }

  return (
    <main className="auth-layout">
      <section className="auth-hero" aria-labelledby="auth-title">
        <p className="eyebrow">Task Manager</p>
        <h1 id="auth-title">Plan, assign, and ship work from one board.</h1>
        <p>
          A focused React client wired to the Java API for auth, projects,
          filters, and Kanban task updates.
        </p>
      </section>

      <section className="auth-panel" aria-label="Authentication">
        <div className="segmented" role="tablist" aria-label="Auth mode">
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => changeMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === 'register' ? 'active' : ''}
            onClick={() => changeMode('register')}
          >
            Register
          </button>
        </div>

        <form className="stack-form" onSubmit={handleSubmit}>
          {isRegister && (
            <label>
              Name
              <input
                value={form.name}
                onChange={(event) => updateField('name', event.target.value)}
                placeholder="Sandipan Das"
                required
              />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => updateField('email', event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={(event) => updateField('password', event.target.value)}
              placeholder="Minimum 6 characters"
              required
            />
          </label>

          {isRegister && (
            <label>
              Role
              <select
                value={form.role}
                onChange={(event) => updateField('role', event.target.value)}
              >
                <option value="MEMBER">Member</option>
                <option value="ADMIN">Admin</option>
              </select>
            </label>
          )}

          {authError && <p className="form-error">{authError}</p>}

          <button className="primary-btn" type="submit" disabled={authLoading}>
            {authLoading
              ? 'Please wait...'
              : isRegister
                ? 'Create account'
                : 'Login'}
          </button>
        </form>
      </section>
    </main>
  )
}
