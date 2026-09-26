import React from 'react'

export default function CodingPortal() {
  return (
    <div className="cg-portal-wrapper">
      {/* Background Volumetric Lighting & Ambient Energy */}
      <div className="cg-portal-backglow"></div>
      <div className="cg-portal-lightbeam"></div>

      {/* Floating Track Badges (Orbiting the Portal) */}
      <div className="cg-track-pill pill-python">
        <span className="pill-dot"></span>
        <span className="pill-code">def</span>
        <span className="pill-name">Python</span>
        <span className="pill-xp">+50 XP</span>
      </div>

      <div className="cg-track-pill pill-cpp">
        <span className="pill-dot"></span>
        <span className="pill-code">#include</span>
        <span className="pill-name">C++</span>
        <span className="pill-xp">FAST</span>
      </div>

      <div className="cg-track-pill pill-dsa">
        <span className="pill-dot"></span>
        <span className="pill-code">O(log N)</span>
        <span className="pill-name">DSA Tree</span>
      </div>

      <div className="cg-track-pill pill-web">
        <span className="pill-dot"></span>
        <span className="pill-code">&lt;React /&gt;</span>
        <span className="pill-name">Web Dev</span>
      </div>

      <div className="cg-track-pill pill-java">
        <span className="pill-dot"></span>
        <span className="pill-code">class</span>
        <span className="pill-name">Java</span>
      </div>

      {/* Central Gaming Portal Structure */}
      <div className="cg-portal-structure">
        {/* Monolith Archway Frame */}
        <div className="cg-portal-arch">
          {/* Inner Energy Vortex Ring */}
          <div className="cg-vortex-ring ring-outer"></div>
          <div className="cg-vortex-ring ring-mid"></div>
          <div className="cg-vortex-ring ring-inner"></div>

          {/* Glowing Event Horizon Core */}
          <div className="cg-portal-core">
            <div className="cg-core-plasma"></div>
            
            {/* Holographic Center Code Symbol */}
            <div className="cg-core-symbol">
              <span className="sym-bracket">&lt;</span>
              <span className="sym-slash">/</span>
              <span className="sym-bracket">&gt;</span>
            </div>

            {/* Drifting Code Streams inside portal */}
            <div className="cg-plasma-stream stream-1">for (int i=0; i&lt;N; i++)</div>
            <div className="cg-plasma-stream stream-2">fn solve(realm): yield victory</div>
            <div className="cg-plasma-stream stream-3">const level = xp &gt; 1000</div>
          </div>

          {/* Sci-fi Rune Pillars Left & Right */}
          <div className="cg-pillar pillar-left">
            <div className="cg-rune">λ</div>
            <div className="cg-rune">01</div>
            <div className="cg-rune">&#123; &#125;</div>
            <div className="cg-rune">&lt;&gt;</div>
          </div>
          <div className="cg-pillar pillar-right">
            <div className="cg-rune">=&gt;</div>
            <div className="cg-rune">*ptr</div>
            <div className="cg-rune">[]</div>
            <div className="cg-rune">++</div>
          </div>
        </div>

        {/* Isometric Platform & Steps Leading Into Portal */}
        <div className="cg-portal-pedestal">
          {/* Top Step */}
          <div className="cg-step step-3">
            <div className="cg-step-top">
              <span className="cg-step-tag">DISCIPLINE BUILDS TOMORROW</span>
            </div>
            <div className="cg-step-front"></div>
          </div>

          {/* Middle Step */}
          <div className="cg-step step-2">
            <div className="cg-step-top">
              <span className="cg-step-tag">SMALL STEPS • BIG DEVELOPERS</span>
            </div>
            <div className="cg-step-front"></div>
          </div>

          {/* Bottom Ground Step */}
          <div className="cg-step step-1">
            <div className="cg-step-top">
              <div className="cg-step-grid"></div>
              <span className="cg-step-tag">START YOUR ADVENTURE TODAY</span>
            </div>
            <div className="cg-step-front"></div>
          </div>
        </div>

        {/* Floating Sparks & Runes */}
        <div className="cg-particle p1">&#x2727;</div>
        <div className="cg-particle p2">&lt;/&gt;</div>
        <div className="cg-particle p3">&#x2726;</div>
        <div className="cg-particle p4">&#123;&#125;</div>
        <div className="cg-particle p5">&#x25C6;</div>
      </div>
    </div>
  )
}
