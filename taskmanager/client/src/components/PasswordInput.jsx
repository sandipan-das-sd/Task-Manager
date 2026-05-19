import { useState } from 'react'

export default function PasswordInput({
  value,
  onChange,
  placeholder,
  autoComplete,
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="password-field">
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        title={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.1 12s3.6-6.5 9.9-6.5S21.9 12 21.9 12 18.3 18.5 12 18.5 2.1 12 2.1 12Z" />
      <circle cx="12" cy="12" r="3.1" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M10.6 5.7A10.6 10.6 0 0 1 12 5.5c6.3 0 9.9 6.5 9.9 6.5a17.5 17.5 0 0 1-3 3.8" />
      <path d="M14.1 14.4A3.1 3.1 0 0 1 9.6 9.9" />
      <path d="M6.7 7.3A17.8 17.8 0 0 0 2.1 12s3.6 6.5 9.9 6.5a10.7 10.7 0 0 0 4.1-.8" />
    </svg>
  )
}
