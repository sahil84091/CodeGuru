import { useRef, useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowRight, LockKeyhole, Shield } from 'lucide-react'
import CodeGuruLogo from '../components/codeguru/CodeGuruLogo'
import LoginScene3D from '../components/login/LoginScene3D'
import { useCodeGuruStore } from '../store/useCodeGuruStore'
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

/* ═══════════════════════════════════════════════════════════════════
 * LoginPage3D — Immersive 3D Login Page for CodeGuru
 * ═══════════════════════════════════════════════════════════════════ */
export default function LoginPage3D() {
  const navigate = useNavigate()
  const { setAuthPhone } = useCodeGuruStore()
  const [phoneDigits, setPhoneDigits] = useState('')
  const phoneInput = useRef(null)
  const cardRef = useRef(null)
  const [isActivating, setIsActivating] = useState(false)

  const { transform, handleMouseMove, handleMouseLeave } = useCardTilt(cardRef)

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

  return (
    <div className="login3d-page">
      {/* ── 3D Background Scene ─── */}
      <LoginScene3D activating={isActivating} />

      {/* ── Ambient Layers ─── */}
      <div className="login3d-backdrop" />
      <div className="login3d-grid" />

      {/* ── Floating CSS Particles ─── */}
      <div className="login3d-particles" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="login3d-particle" />
        ))}
      </div>

      {/* ── Header ─── */}
      <header className="login3d-header">
        <CodeGuruLogo size="md" linkTo="/" />
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="hidden items-center gap-3 text-xs text-slate-400 sm:flex"
        >
          <Shield size={14} />
          <span>Secure Login</span>
        </motion.div>
      </header>

      {/* ── Main Content ─── */}
      <div className="login3d-content">
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
        </motion.section>

        {/* ── Right: 3D Login Card ─── */}
        <motion.div
          className="login3d-card-perspective"
          initial={{ opacity: 0, scale: 0.92, rotateY: -8 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
        >
          <div
            ref={cardRef}
            className="login3d-card"
            style={{ transform }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="login3d-card-inner">
              {/* Badge */}
              <div className="login3d-card-badge">
                <span style={{ fontSize: '0.85rem' }}>⚡</span>
                Adventurer Portal
              </div>

              {/* Title */}
              <h2 className="login3d-card-title">Welcome Back, Coder</h2>
              <p className="login3d-card-subtitle">
                Enter your number to open the portal
              </p>

              {/* Phone Form */}
              <form onSubmit={handleSubmit}>
                <label className="login3d-phone-label">
                  <span className="login3d-phone-prefix">+91⌄</span>
                  <input
                    ref={phoneInput}
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

                <button
                  type="submit"
                  disabled={phoneDigits.length !== 10 || isActivating}
                  className="login3d-submit"
                >
                  {isActivating ? (
                    <>Opening Portal…</>
                  ) : (
                    <>
                      Begin Your Journey
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="login3d-divider">or continue with</div>

              {/* Social Auth */}
              <div className="login3d-social-row">
                <button type="button" className="login3d-social-btn" aria-label="Sign in with Google">
                  <GoogleIcon />
                  Google
                </button>
                <button type="button" className="login3d-social-btn" aria-label="Sign in with GitHub">
                  <GitHubIcon />
                  GitHub
                </button>
              </div>

              {/* Security Note */}
              <div className="login3d-secure-note">
                <LockKeyhole size={14} />
                <span>Your data is encrypted & secure</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

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
