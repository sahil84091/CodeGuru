import React from 'react'
import worldArt from '../../assets/clean_adventure_world.jpg'

export default function GameWorldCenterpiece() {
  return (
    <div className="cg-game-world-container">
      {/* Background Volumetric Aura & Glowing Sky Halo */}
      <div className="cg-world-sky-aura"></div>
      <div className="cg-world-portal-glow"></div>

      {/* Main Fantasy Game Realm Frame */}
      <div className="cg-world-frame">
        {/* Living Artwork Layer */}
        <div className="cg-art-canvas-wrapper">
          <img
            src={worldArt}
            alt="CodeGuru Adventure Realm"
            className="cg-world-base-art"
          />
          {/* Subtle Dynamic Gradients over the artwork for depth */}
          <div className="cg-art-ambient-vignette"></div>
          <div className="cg-art-waterfall-mist"></div>
        </div>

        {/* ==========================================================
            Interactive Game UI Elements & Floating Skill Island HUDs
           ========================================================== */}

        {/* 1. Floating Python Island Card */}
        <div className="cg-island-hud hud-python">
          <div className="cg-hud-indicator dot-python"></div>
          <div className="cg-hud-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 6 4.45 6 6.5V9H12V10.5H4C2 10.5 1 12 1 15C1 18 2.5 19 4.5 19H7V16.5C7 14.5 8.5 13 10.5 13H15C16.5 13 17.5 12 17.5 10.5V6.5C17.5 4.5 16 2 12 2Z" fill="#38bdf8" />
              <circle cx="8.5" cy="5" r="1" fill="#ffffff" />
              <path d="M12 22C17.52 22 18 19.55 18 17.5V15H12V13.5H20C22 13.5 23 12 23 9C23 6 21.5 5 19.5 5H17V7.5C17 9.5 15.5 11 13.5 11H9C7.5 11 6.5 12 6.5 13.5V17.5C6.5 19.5 8 22 12 22Z" fill="#facc15" />
              <circle cx="15.5" cy="19" r="1" fill="#ffffff" />
            </svg>
          </div>
          <div className="cg-hud-info">
            <span className="cg-hud-title">Python Citadel</span>
            <span className="cg-hud-xp">+50 XP • Start</span>
          </div>
        </div>

        {/* 2. Floating DSA Island Card */}
        <div className="cg-island-hud hud-dsa">
          <div className="cg-hud-indicator dot-dsa"></div>
          <div className="cg-hud-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2">
              <circle cx="12" cy="5" r="3" />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="18" r="3" />
              <path d="M12 8v3M7.5 15.5l3-4.5M16.5 15.5l-3-4.5" />
            </svg>
          </div>
          <div className="cg-hud-info">
            <span className="cg-hud-title">DSA Network</span>
            <span className="cg-hud-xp">O(log N) Mastery</span>
          </div>
        </div>

        {/* 3. Floating Web Dev Island Card */}
        <div className="cg-island-hud hud-web">
          <div className="cg-hud-indicator dot-web"></div>
          <div className="cg-hud-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
          <div className="cg-hud-info">
            <span className="cg-hud-title">Web Realm</span>
            <span className="cg-hud-xp">&lt;React /&gt; Fullstack</span>
          </div>
        </div>

        {/* 4. Locked More Island Card */}
        <div className="cg-island-hud hud-more">
          <div className="cg-hud-icon lock-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div className="cg-hud-info">
            <span className="cg-hud-title">Next Realms</span>
            <span className="cg-hud-locked">Locked</span>
          </div>
        </div>

        {/* 5. Explorer Character Telemetry Badge */}
        <div className="cg-character-hud">
          <div className="cg-char-badge-dot"></div>
          <div className="cg-char-badge-text">
            <span className="cg-char-name">EXPLORER LEVEL 1</span>
            <span className="cg-char-code">&lt;/&gt; BACKPACK ACTIVE</span>
          </div>
        </div>

        {/* 6. Robot Companion Telemetry Badge */}
        <div className="cg-robot-hud">
          <div className="cg-robot-orb"></div>
          <span className="cg-robot-text">"Small Steps, Big Developers"</span>
        </div>

        {/* 7. Castle Spires Quest Goal Indicator */}
        <div className="cg-castle-hud">
          <span className="cg-castle-star">&#x2728;</span>
          <span className="cg-castle-title">A BRIGHTER YOU CITADEL</span>
        </div>

        {/* Floating Sparks & Runes */}
        <div className="cg-world-spark spark-1">&#x2727;</div>
        <div className="cg-world-spark spark-2">&lt;/&gt;</div>
        <div className="cg-world-spark spark-3">&#x25C6;</div>
        <div className="cg-world-spark spark-4">&#x2726;</div>
      </div>
    </div>
  )
}
