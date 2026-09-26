import React from 'react'

export default function FeatureStrip() {
  const features = [
    {
      id: 'gamified',
      title: 'Gamified Learning',
      subtitle: 'Make learning fun',
      accentColor: '#10b981',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="6" width="20" height="12" rx="4" />
          <path d="M6 12h4m-2-2v4m7-2h.01m3 0h.01" />
        </svg>
      )
    },
    {
      id: 'progress',
      title: 'Track Progress',
      subtitle: 'See real growth',
      accentColor: '#f59e0b',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      )
    },
    {
      id: 'achievements',
      title: 'Earn Achievements',
      subtitle: 'Be proud of your skills',
      accentColor: '#c084fc',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.45 1-1 1H8v2h8v-2h-1c-.55 0-1-.45-1-1v-2.34" />
          <path d="M6 4h12v7a6 6 0 0 1-12 0V4z" />
        </svg>
      )
    },
    {
      id: 'compete',
      title: 'Compete & Collaborate',
      subtitle: 'Grow together',
      accentColor: '#38bdf8',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      )
    }
  ]

  return (
    <footer className="cg-bottom-hud-strip">
      <div className="cg-bottom-hud-container">
        {/* Left 4 Feature Items */}
        <div className="cg-hud-features-list">
          {features.map((item) => (
            <div key={item.id} className="cg-hud-feature-item">
              <div
                className="cg-hud-icon-box"
                style={{ color: item.accentColor }}
              >
                {item.icon}
              </div>
              <div className="cg-hud-text-group">
                <span className="cg-hud-item-title">{item.title}</span>
                <span className="cg-hud-item-subtitle">{item.subtitle}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Quote Item Matching Reference */}
        <div className="cg-hud-quote-item">
          <div className="cg-hud-quote-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#f59e0b">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div className="cg-hud-quote-content">
            <span className="cg-quote-line-1">"Better Coders</span>
            <span className="cg-quote-line-2">A Brighter Tomorrow"</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
