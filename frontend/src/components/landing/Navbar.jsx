import React from 'react'
import logoImg from '../../assets/codeguru_logo_transparent.png'

export default function Navbar({ onOpenSignIn }) {
  const handleSignInClick = (e) => {
    e.preventDefault()
    if (onOpenSignIn) {
      onOpenSignIn()
    }
  }

  return (
    <header className="cg-navbar">
      <div className="cg-navbar-container">
        {/* Brand Logo */}
        <a href="/" className="cg-brand">
          <div className="cg-logo-wrapper">
            <img src={logoImg} alt="CodeGuru" className="cg-logo-img" />
          </div>
        </a>

        {/* Center Navigation Links */}
        <nav className="cg-nav-links">
          <a href="#learn" className="cg-nav-item">
            <span>Learn</span>
          </a>
          <a href="#practice" className="cg-nav-item">
            <span>Practice</span>
          </a>
          <a href="#compete" className="cg-nav-item cg-nav-item-compete">
            <span>Compete</span>
            <span className="cg-nav-badge-pvp">PvP</span>
          </a>
          <a href="#grow" className="cg-nav-item">
            <span>Grow</span>
          </a>
        </nav>

        {/* Right Sign In Button */}
        <div className="cg-nav-actions">
          <button
            type="button"
            className="cg-btn-signin"
            onClick={handleSignInClick}
            aria-label="Sign In"
            id="nav-signin-btn"
          >
            <svg
              className="cg-signin-icon"
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="cg-signin-text">Sign In</span>
          </button>
        </div>
      </div>
    </header>
  )
}
