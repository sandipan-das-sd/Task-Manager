import { useState } from 'react'
import { authApi } from '../api/taskManagerApi'
import { useAuth } from '../hooks/useAuth'
import PasswordInput from './PasswordInput'

function getResetTokenFromUrl() {
  const params = new URLSearchParams(window.location.search)
  return params.get('token') || ''
}

function getApiMessage(response, fallback) {
  if (typeof response === 'string') {
    return response
  }

  return response?.message || fallback
}

export default function AuthPanel() {
  const { login, register, authLoading, authError, clearAuthError } = useAuth()
  const resetToken = getResetTokenFromUrl()
  const hasLinkToken = Boolean(resetToken)
  const [mode, setMode] = useState(resetToken ? 'reset' : 'login')
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    newPassword: '',
    token: resetToken,
    role: 'MEMBER',
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordNotice, setPasswordNotice] = useState('')

  const isLogin = mode === 'login'
  const isRegister = mode === 'register'
  const isForgot = mode === 'forgot'
  const isReset = mode === 'reset'

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function changeMode(nextMode) {
    setMode(nextMode)
    setPasswordError('')
    setPasswordNotice('')
    clearAuthError()
  }

  async function handleAuthSubmit(event) {
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

    try {
      if (isRegister) {
        await register(payload)
      } else {
        await login(payload)
      }
    } catch {
      // AuthContext stores the user-facing error.
    }
  }

  async function handleForgotSubmit(event) {
    event.preventDefault()
    setPasswordLoading(true)
    setPasswordError('')
    setPasswordNotice('')

    try {
      const response = await authApi.forgotPassword({
        email: form.email.trim(),
      })
      setPasswordNotice(getApiMessage(response, 'Password reset link sent.'))
    } catch (error) {
      setPasswordError(error.message)
    } finally {
      setPasswordLoading(false)
    }
  }

  async function handleResetSubmit(event) {
    event.preventDefault()
    setPasswordLoading(true)
    setPasswordError('')
    setPasswordNotice('')

    try {
      const response = await authApi.resetPassword({
        token: form.token.trim(),
        newPassword: form.newPassword,
      })
      setPasswordNotice(getApiMessage(response, 'Password reset successfully.'))
      setForm((current) => ({ ...current, newPassword: '' }))
    } catch (error) {
      setPasswordError(error.message)
    } finally {
      setPasswordLoading(false)
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
            className={isLogin ? 'active' : ''}
            onClick={() => changeMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={isRegister ? 'active' : ''}
            onClick={() => changeMode('register')}
          >
            Register
          </button>
        </div>

        {(isLogin || isRegister) && (
          <form className="stack-form" onSubmit={handleAuthSubmit}>
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
                autoComplete="email"
                required
              />
            </label>

            <label>
              Password
              <PasswordInput
                value={form.password}
                onChange={(event) => updateField('password', event.target.value)}
                placeholder="Minimum 6 characters"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
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

            {isLogin && (
              <button
                type="button"
                className="link-btn"
                onClick={() => changeMode('forgot')}
              >
                Forgot password?
              </button>
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
        )}

        {isForgot && (
          <form className="stack-form" onSubmit={handleForgotSubmit}>
            <div className="auth-form-heading">
              <h2>Forgot password</h2>
              <p>Enter your account email. The backend will send a reset link.</p>
            </div>

            <label>
              Email
              <input
                type="email"
                value={form.email}
                onChange={(event) => updateField('email', event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            {passwordError && <p className="form-error">{passwordError}</p>}
            {passwordNotice && <p className="form-success">{passwordNotice}</p>}

            <button
              className="primary-btn"
              type="submit"
              disabled={passwordLoading}
            >
              {passwordLoading ? 'Sending...' : 'Send reset link'}
            </button>
            <button
              type="button"
              className="ghost-btn"
              onClick={() => changeMode('login')}
            >
              Back to login
            </button>
          </form>
        )}

        {isReset && (
          <form className="stack-form" onSubmit={handleResetSubmit}>
            <div className="auth-form-heading">
              <h2>Reset password</h2>
              <p>
                {hasLinkToken
                  ? 'Enter a new password for your account.'
                  : 'Paste the token from email and enter a new password.'}
              </p>
            </div>

            {!hasLinkToken && (
              <label>
                Reset token
                <input
                  value={form.token}
                  onChange={(event) => updateField('token', event.target.value)}
                  placeholder="Reset token"
                  required
                />
              </label>
            )}

            <label>
              New password
              <PasswordInput
                value={form.newPassword}
                onChange={(event) =>
                  updateField('newPassword', event.target.value)
                }
                placeholder="New password"
                autoComplete="new-password"
              />
            </label>

            {passwordError && <p className="form-error">{passwordError}</p>}
            {passwordNotice && <p className="form-success">{passwordNotice}</p>}

            <button
              className="primary-btn"
              type="submit"
              disabled={passwordLoading}
            >
              {passwordLoading ? 'Saving...' : 'Reset password'}
            </button>
            <button
              type="button"
              className="ghost-btn"
              onClick={() => changeMode('login')}
            >
              Back to login
            </button>
          </form>
        )}

        {!isReset && (
          <button
            type="button"
            className="link-btn center-link"
            onClick={() => changeMode('reset')}
          >
            Already have a reset token?
          </button>
        )}
      </section>
    </main>
  )
}
