import React from 'react'

export default function HeroSection({ onOpenSignIn }) {
  const handleCtaClick = () => {
    if (onOpenSignIn) {
      onOpenSignIn()
    }
  }

  return (
    <section className="cg-hero-section">
      {/* Subtle Left Vignette for Typography Contrast */}
      <div className="cg-hero-backdrop-gradient" aria-hidden="true"></div>

      <div className="cg-hero-content-wrapper">
        {/* Left Column: Direct Game World Overlay Typography & CTA */}
        <div className="cg-hero-left">
          {/* Eyebrow Pill */}
          <div className="cg-eyebrow-pill">
            <span className="cg-eyebrow-dot"></span>
            <span className="cg-eyebrow-text">A BRIGHTER YOU, A BRIGHTER TOMORROW</span>
            <span className="cg-eyebrow-symbol">&lt;/&gt;</span>
          </div>

          {/* Dominant Main Heading */}
          <h1 className="cg-hero-title">
            <span className="cg-title-line">Your Coding</span>
            <span className="cg-title-line">
              Journey <span className="cg-text-highlight">Begins</span>
            </span>
            <span className="cg-title-line cg-title-here-wrap">
              <span className="cg-text-highlight">Here.</span>
              {/* Yellow Decorative Swoop matching reference */}
              <svg
                className="cg-title-swoop"
                viewBox="0 0 160 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 14C35 5 110 4 156 16C122 10 50 11 12 18"
                  stroke="#fbbf24"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </h1>

          {/* Supporting Subtitle */}
          <h2 className="cg-hero-subtitle">
            Learn. Play. Practice. Grow.
          </h2>

          {/* Description */}
          <p className="cg-hero-description">
            Turn your curiosity into real skills with a learning experience that feels like a game.
          </p>

          {/* Primary Adventure Game CTA */}
          <div className="cg-cta-container">
            <button
              type="button"
              className="cg-btn-adventure-cta"
              onClick={handleCtaClick}
              id="begin-journey-btn"
            >
              <span className="cg-btn-text">Begin Your Journey</span>
              <span className="cg-btn-arrow">&rarr;</span>
              <div className="cg-btn-shimmer"></div>
            </button>
            {/* Sparkle Glint near the corner */}
            <span className="cg-cta-sparkle" aria-hidden="true">&#x2728;</span>
          </div>
        </div>

        {/* Center & Right Game World Overlays */}
        <div className="cg-game-world-overlays" aria-hidden="true">
          {/* Animated Glowing Portal Ring over Castle Archway */}
          <div className="cg-world-portal-ring">
            <div className="cg-portal-core"></div>
            <div className="cg-portal-outer-ring"></div>
            <div className="cg-portal-waves"></div>
          </div>

          {/* Floating Island Wooden Signs matching Reference */}
          {/* 1. Python Island Sign */}
          <div className="cg-world-sign cg-sign-python">
            <div className="cg-wooden-plank">
              <span className="cg-plank-text">PYTHON</span>
            </div>
          </div>

          {/* 2. DSA Island Sign */}
          <div className="cg-world-sign cg-sign-dsa">
            <div className="cg-wooden-plank">
              <span className="cg-plank-text">DSA</span>
            </div>
          </div>

          {/* 3. Web Dev Island Sign */}
          <div className="cg-world-sign cg-sign-webdev">
            <div className="cg-wooden-plank">
              <span className="cg-plank-text">WEB DEV</span>
            </div>
          </div>

          {/* Ambient Magic Twinkles */}
          <div className="cg-ambient-sparkle cg-sparkle-1">&#x2727;</div>
          <div className="cg-ambient-sparkle cg-sparkle-2">&lt;/&gt;</div>
          <div className="cg-ambient-sparkle cg-sparkle-3">&#x2726;</div>
        </div>
      </div>
    </section>
  )
}
