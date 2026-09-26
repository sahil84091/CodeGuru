import React, { useState } from 'react'

export default function AuthInput({
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  isPassword = false,
  leftIcon = null
}) {
  const [showPassword, setShowPassword] = useState(false)

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

  return (
    <div className="cg-auth-input-wrapper">
      <div className={`cg-auth-input-field ${error ? 'cg-input-error' : ''} ${leftIcon ? 'has-left-icon' : ''}`}>
        {leftIcon && <span className="cg-input-left-icon" aria-hidden="true">{leftIcon}</span>}
        <input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="cg-input-element"
          autoComplete={isPassword ? 'new-password' : (type === 'email' ? 'email' : 'off')}
        />
        {isPassword && (
          <button
            type="button"
            className="cg-password-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? (
              /* Eye open icon */
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              /* Eye slashed/closed icon matching reference */
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <span className="cg-input-error-msg">{error}</span>}
    </div>
  )
}
