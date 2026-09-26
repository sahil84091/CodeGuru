import React from 'react'

export default function FeatureStrip() {
  const features = [
    {
      id: 'gamified',
      title: 'Gamified Learning',
      subtitle: 'Make learning fun',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="6" width="20" height="12" rx="4" />
          <path d="M6 12h4m-2-2v4m7-2h.01m3 0h.01" />
        </svg>
      ),
      accent: 'var(--accent-green)'
    },
    {
      id: 'progress',
      title: 'Track Progress',
      subtitle: 'See real growth',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      ),
      accent: 'var(--accent-cyan)'
    },
    {
      id: 'achievements',
      title: 'Earn Achievements',
      subtitle: 'Be proud',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.45 1-1 1H8v2h8v-2h-1c-.55 0-1-.45-1-1v-2.34" />
          <path d="M6 4h12v7a6 6 0 0 1-12 0V4z" />
        </svg>
      ),
      accent: 'var(--accent-gold)'
    },
    {
      id: 'compete',
      title: 'Compete & Collaborate',
      subtitle: 'Grow together',
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m14.5 17.5 3 3 3.5-3.5-3-3" />
          <path d="m8.5 7.5-3-3L2 8l3 3" />
          <path d="m14 14-8.5-8.5" />
          <path d="m17.5 6.5 3 3-9 9-3-3 9-9Z" />
        </svg>
      ),
      accent: '#a855f7'
    }
  ]

  return (
    <section className="cg-features-hud-strip">
      <div className="cg-features-hud-container">
        {/* Feature Cards Grid */}
        <div className="cg-features-hud-grid">
          {features.map((item) => (
            <div key={item.id} className="cg-feature-hud-card">
              <div
                className="cg-feat-hud-icon-box"
                style={{ color: item.accent, borderColor: item.accent }}
              >
                {item.icon}
              </div>
              <div className="cg-feat-hud-text">
                <h4 className="cg-feat-hud-title">{item.title}</h4>
                <p className="cg-feat-hud-desc">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Quote Card Matching Reference */}
        <div className="cg-quote-hud-card">
          <div className="cg-quote-hud-badge">
            <span className="cg-quote-hud-gem">💎</span>
            <div className="cg-quote-hud-content">
              <span className="cg-quote-hud-main">"Better Coders</span>
              <span className="cg-quote-hud-sub">A Brighter Tomorrow"</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
