import React from 'react'
import logoTitle from '../../assets/codeguru_full_title.png'

export default function Navbar() {
  return (
    <header className="cg-navbar">
      <div className="cg-navbar-container">
        {/* Brand Logo & Wordmark */}
        <a href="/" className="cg-brand">
          <div className="cg-logo-3d-wrapper">
            <img src={logoTitle} alt="CodeGuru" className="cg-logo-3d-img" />
          </div>
          <div className="cg-brand-badge-pill">
            <span className="cg-brand-badge-dot"></span>
            <span className="cg-brand-badge-text">PLAY • LEARN • LEVEL UP</span>
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
          <a href="#compete" className="cg-nav-item">
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
            onClick={() => alert('Sign In flow is reserved for the next phase!')}
          >
            <span className="cg-signin-text">Sign In</span>
          </button>
        </div>
      </div>
    </header>
  )
}
