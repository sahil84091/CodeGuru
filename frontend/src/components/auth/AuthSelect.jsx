import React from 'react'

export default function AuthSelect({
  id,
  value,
  onChange,
  options = [],
  placeholder = 'Select option',
  leftIcon = null,
  error = null
}) {
  return (
    <div className="cg-auth-select-wrapper">
      <div className={`cg-auth-select-field ${error ? 'cg-input-error' : ''} ${value ? 'has-value' : 'is-placeholder'}`}>
        {leftIcon && (
          <span className="cg-select-left-icon" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <select
          id={id}
          value={value}
          onChange={onChange}
          className="cg-select-element"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => {
            const optVal = typeof opt === 'string' ? opt : opt.value
            const optLabel = typeof opt === 'string' ? opt : opt.label
            return (
              <option key={optVal} value={optVal}>
                {optLabel}
              </option>
            )
          })}
        </select>
        <span className="cg-select-arrow" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>
      {error && <span className="cg-input-error-msg">{error}</span>}
    </div>
  )
}
