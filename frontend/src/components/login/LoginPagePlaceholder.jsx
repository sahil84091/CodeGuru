import React from 'react'
import logo from '../../assets/codeguru_logo_transparent.png'

export default function LoginPagePlaceholder({ onNavigate }) {
  return (
    <div className="cg-login-placeholder-page">
      <div className="cg-login-placeholder-card">
        <div className="cg-login-logo-wrap">
          <img src={logo} alt="CodeGuru" className="cg-login-logo" />
        </div>
        <div className="cg-login-badge">ADVENTURER PORTAL</div>
        <h2 className="cg-login-title">Sign In / Join Adventure</h2>
        <p className="cg-login-subtitle">
          Authentication and user account setup are scheduled for the next milestone.
        </p>
        <button
          type="button"
          className="cg-btn-adventure-cta cg-btn-back"
          onClick={() => onNavigate('/')}
        >
          <span>&larr; Return to Adventure Realm</span>
        </button>
      </div>
    </div>
  )
}
