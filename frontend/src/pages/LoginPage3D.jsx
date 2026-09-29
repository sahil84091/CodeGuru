import { useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { animate, svg } from 'animejs'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { ArrowDown, ArrowRight, LockKeyhole, Shield, ChevronUp } from 'lucide-react'
import CodeGuruLogo from '../components/codeguru/CodeGuruLogo'
import LoginScene3D from '../components/login/LoginScene3D'
import { useCodeGuruStore } from '../store/useCodeGuruStore'
import LoginStory from './LoginStory'
import './LoginPage3D.css'

/* ── Inline SVG Icons for Google & GitHub (avoids extra deps) ────── */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09A6.97 6.97 0 015.47 12c0-.72.13-1.42.37-2.09V7.07H2.18A11.96 11.96 0 001 12c0 1.94.46 3.77 1.18 5.07l3.66-2.98z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"/>
    </svg>
  )
}

function LoginBrandStroke() {
  const strokeRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const path = strokeRef.current?.querySelector('.login3d-brand-path')
    const marker = strokeRef.current?.querySelector('.login3d-brand-runner')
    if (!path || !marker) return undefined

    const pathDraw = animate(svg.createDrawable(path), {
      draw: '0 1',
      ease: 'linear',
      duration: 5000,
      loop: true,
    })
    const pathRunner = animate(marker, {
      ease: 'linear',
      duration: 5000,
      loop: true,
      ...svg.createMotionPath(path),
    })

    return () => {
      pathDraw.revert()
      pathRunner.revert()
    }
  }, [])

  return (
    <svg ref={strokeRef} className="login3d-brand-stroke" viewBox="0 0 240 80" aria-hidden="true">
      <path className="login3d-brand-path" d="M32 7H208C222 7 233 18 233 32V48C233 62 222 73 208 73H32C18 73 7 62 7 48V32C7 18 18 7 32 7Z" />
      <circle className="login3d-brand-runner" cx="0" cy="0" r="3" />
    </svg>
  )
}

/* ── Card 3D Tilt Hook ────────────────────────────────────────────── */
function useCardTilt(cardRef) {
  const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg) translateZ(0px)')

  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 6
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 4
    setTransform(`rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px)`)
  }, [cardRef])

  const handleMouseLeave = useCallback(() => {
    setTransform('rotateX(0deg) rotateY(0deg) translateZ(0px)')
  }, [])

  return { transform, handleMouseMove, handleMouseLeave }
}

const SECTIONS = [
  { id: 'login', label: 'Start' },
  { id: 'learn-by-doing', label: '01 Learn' },
  { id: 'practice-by-playing', label: '02 Practice' },
  { id: 'progress-that-means-something', label: '03 Grow' },
  { id: 'portal-access', label: 'Portal' },
]

/* ═══════════════════════════════════════════════════════════════════
 * LoginPage3D — Immersive 3D Login Page for CodeGuru
 * ═══════════════════════════════════════════════════════════════════ */
export default function LoginPage3D() {
  const navigate = useNavigate()
  const { setAuthPhone } = useCodeGuruStore()
  const [phoneDigits, setPhoneDigits] = useState('')
  const cardRef = useRef(null)
  const journeyRef = useRef(null)
  const orbitRef = useRef({ value: 0 })
  const lenisRef = useRef(null)
  const [activeSectionId, setActiveSectionId] = useState('login')
  const [isActivating, setIsActivating] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  const { transform, handleMouseMove, handleMouseLeave } = useCardTilt(cardRef)

  // ── Smooth Scrolling Engine (Lenis) ──────────────────────────────
  useEffect(() => {
    document.documentElement.classList.add('login-scroll-story')

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      touchMultiplier: 1.6,
      wheelMultiplier: 1.0,
      autoResize: true,
    })
    lenisRef.current = lenis

    let rafId = null
    const raf = (time) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Handle scroll progress and scroll-top visibility
    const handleScroll = (e) => {
      const scrollY = e.scroll || window.scrollY || 0
      setShowScrollTop(scrollY > 400)

      // Determine active section based on scroll offset
      const sectionElements = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean)
      const currentScroll = scrollY + window.innerHeight * 0.35
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i]
        if (el.offsetTop <= currentScroll) {
          setActiveSectionId(SECTIONS[i].id)
          break
        }
      }
    }
    lenis.on('scroll', handleScroll)

    return () => {
      document.documentElement.classList.remove('login-scroll-story')
      if (rafId) cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // Smooth scroll helper for programmatic / link clicks
  const scrollToTarget = useCallback((target) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        duration: 1.4,
        offset: 0,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  // Navigate after activation animation completes
  useEffect(() => {
    if (!isActivating) return undefined
    const timer = setTimeout(() => navigate('/otp'), 1400)
    return () => clearTimeout(timer)
  }, [isActivating, navigate])

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10)
    setPhoneDigits(raw)
    setAuthPhone(`+91 ${raw.slice(0, 5)}${raw.length > 5 ? ` ${raw.slice(5)}` : ''}`)
    if (raw.length === 10) {
      setIsActivating(true)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (phoneDigits.length !== 10 || isActivating) return
    setAuthPhone(`+91 ${phoneDigits.slice(0, 5)} ${phoneDigits.slice(5)}`)
    setIsActivating(true)
  }

  const loginPanel = (
    <div className="login3d-card-perspective">
      <div
        ref={cardRef}
        className="login3d-card"
        style={{ transform }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="login3d-card-inner">
          <div className="login3d-card-intro">
            <div className="login3d-card-badge"><span style={{ fontSize: '0.85rem' }}>⚡</span>Adventurer Portal</div>
            <h2 className="login3d-card-title">Welcome Back, Coder</h2>
            <p className="login3d-card-subtitle">Enter your number to open the portal</p>
          </div>
          <div className="login3d-card-actions">
            <form onSubmit={handleSubmit}>
              <label className="login3d-phone-label">
                <span className="login3d-phone-prefix">+91⌄</span>
                <input
                  id="login-phone-number"
                  aria-label="Mobile number"
                  type="tel"
                  inputMode="numeric"
                  value={phoneDigits}
                  onChange={handlePhoneChange}
                  placeholder="Enter mobile number"
                  maxLength={10}
                  minLength={10}
                  pattern="[0-9]{10}"
                  className="login3d-phone-input"
                  required
                  disabled={isActivating}
                  autoComplete="tel"
                />
              </label>
              <button type="submit" disabled={phoneDigits.length !== 10 || isActivating} className="login3d-submit">
                {isActivating ? <>Opening Portal…</> : <>Begin Your Journey <ArrowRight size={18} /></>}
              </button>
            </form>

            <div className="login3d-social-auth">
              <div className="login3d-divider">or continue with</div>
              <div className="login3d-social-row">
                <button type="button" className="login3d-social-btn" aria-label="Sign in with Google"><GoogleIcon />Google</button>
                <button type="button" className="login3d-social-btn" aria-label="Sign in with GitHub"><GitHubIcon />GitHub</button>
              </div>
            </div>
            <div className="login3d-secure-note"><LockKeyhole size={14} /><span>Your data is encrypted &amp; secure</span></div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="login3d-page" ref={journeyRef}>
      {/* ── 3D Background Scene ─── */}
      <LoginScene3D activating={isActivating} orbitRef={orbitRef} />

      {/* ── Ambient Layers ─── */}
      <div className="login3d-backdrop" />
      <div className="login3d-grid" />

      {/* ── Floating CSS Particles ─── */}
      <div className="login3d-particles" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="login3d-particle" />
        ))}
      </div>

      {/* ── Side Navigation Rail (Smooth Section Indicators) ─── */}
      <nav className="login3d-nav-rail" aria-label="Story navigation">
        {SECTIONS.map((sec) => {
          const isActive = activeSectionId === sec.id
          return (
            <button
              key={sec.id}
              type="button"
              className={`login3d-nav-dot ${isActive ? 'is-active' : ''}`}
              onClick={() => scrollToTarget(`#${sec.id}`)}
              aria-label={`Jump to ${sec.label}`}
              title={sec.label}
            >
              <span className="login3d-nav-label">{sec.label}</span>
              <span className="login3d-nav-bullet" />
            </button>
          )
        })}
      </nav>

      {/* ── Header ─── */}
      <header className="login3d-header">
        <div className="login3d-brand-wrap">
          <LoginBrandStroke />
          <CodeGuruLogo size="md" linkTo="/" />
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="hidden items-center gap-3 text-xs text-slate-400 sm:flex"
        >
          <Shield size={14} />
          <span>Learn · Practice · Grow</span>
        </motion.div>
      </header>

      {/* ── Main Content ─── */}
      <main className="login3d-content" id="login">
        {/* ── Left: Hero Text ─── */}
        <motion.section
          className="login3d-hero"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="login3d-hero-tagline">
            Enter the Code Realm
          </div>
          <h1>
            Level Up Your
            <br />
            <span className="accent">Coding Skills.</span>
          </h1>
          <p className="login3d-hero-sub">Learn. Play. Compete. Conquer.</p>
          <p className="login3d-hero-desc">
            Step through the portal and unlock a gamified coding universe —
            missions, challenges, XP, achievements, and an epic leaderboard
            await your arrival.
          </p>
          <button
            type="button"
            className="login3d-hero-continue"
            onClick={() => scrollToTarget('#learn-by-doing')}
          >
            Explore the journey <ArrowDown size={15} />
          </button>
        </motion.section>
      </main>

      <LoginStory
        journeyRef={journeyRef}
        orbitRef={orbitRef}
        loginPanel={loginPanel}
        scrollToTarget={scrollToTarget}
      />

      {/* ── Floating Scroll-To-Top Button ─── */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            type="button"
            className="login3d-back-to-top"
            onClick={() => scrollToTarget('#login')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            aria-label="Back to top"
          >
            <ChevronUp size={18} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Activation Flash Overlay ─── */}
      <AnimatePresence>
        {isActivating && (
          <motion.div
            className="login3d-activation-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.08, 0.35, 0.95] }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.3,
              times: [0, 0.25, 0.7, 1],
              ease: 'easeInOut',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
