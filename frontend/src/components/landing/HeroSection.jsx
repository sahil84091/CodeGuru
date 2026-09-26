import React, { useState } from 'react'
import GameWorldCenterpiece from './GameWorldCenterpiece'

export default function HeroSection() {
  const [mobileNumber, setMobileNumber] = useState('')

  const handleStart = (e) => {
    e.preventDefault()
    if (!mobileNumber.trim()) {
      alert('Please enter your mobile number to begin your adventure!')
      return
    }
    alert(`Welcome, Adventurer! Verification flow will be unlocked in the next phase for ${mobileNumber}.`)
  }

  return (
    <section className="cg-hero-section">
      <div className="cg-hero-container">
        {/* Left Column: Glass HUD Content Card */}
        <div className="cg-hero-left-card">
          {/* Eyebrow Badge */}
          <div className="cg-eyebrow-badge">
            <span className="cg-pulse-dot"></span>
            <span className="cg-eyebrow-text">A BRIGHTER YOU, A BRIGHTER TOMORROW</span>
            <span className="cg-eyebrow-code">&lt;/&gt;</span>
          </div>

          {/* Main Heading with Gaming Typography */}
          <h1 className="cg-hero-title">
            Your Coding<br />
            Journey <span className="cg-highlight-green">Begins</span><br />
            <span className="cg-highlight-green">Here.</span>
          </h1>

          {/* Supporting Heading */}
          <h2 className="cg-hero-subtitle">
            Learn. Play. Practice. Grow.
          </h2>

          {/* Supporting Description */}
          <p className="cg-hero-desc">
            Turn your curiosity into real skills with a learning experience that feels like a game.
          </p>

          {/* Mobile Number Input & Primary Game CTA */}
          <form className="cg-cta-form" onSubmit={handleStart}>
            <div className="cg-input-wrapper">
              <div className="cg-country-badge">
                <span className="cg-flag">🇮🇳</span>
                <span className="cg-prefix">+91</span>
                <svg className="cg-caret" width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path d="M1 1L5 5L9 1" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <input
                type="tel"
                className="cg-phone-input"
                placeholder="Enter your mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                maxLength={10}
              />
            </div>
            
            <button type="submit" className="cg-btn-game-cta">
              <span className="cg-btn-label">Begin Your Journey</span>
              <span className="cg-btn-arrow">&rarr;</span>
              <div className="cg-btn-glow-sheen"></div>
            </button>
          </form>

          {/* Security & Access Information */}
          <div className="cg-security-notice">
            <div className="cg-sec-item">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>Instant free access</span>
            </div>
            <span className="cg-sec-bullet">&bull;</span>
            <div className="cg-sec-item">
              <span>Zero spam, ever</span>
            </div>
            <span className="cg-sec-bullet">&bull;</span>
            <div className="cg-sec-item">
              <span>Built for college engineers</span>
            </div>
          </div>
        </div>

        {/* Right Column: Game World Centerpiece Showcase */}
        <div className="cg-hero-right-visual">
          <GameWorldCenterpiece />
        </div>
      </div>
    </section>
  )
}
