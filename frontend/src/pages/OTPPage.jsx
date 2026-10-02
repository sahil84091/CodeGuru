import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Check, Clock, RotateCcw, ShieldCheck, Delete, ArrowLeft, GraduationCap } from 'lucide-react'
import CodeGuruLogo from '../components/codeguru/CodeGuruLogo'
import OTPBow from '../components/codeguru/OTPBow'
import { useCodeGuruStore } from '../store/useCodeGuruStore'
import otpFantasyLandscape from '../assets/otp_fantasy_landscape.jpg'
import './OTPPage.css'

export default function OTPPage() {
  const navigate = useNavigate()
  const { authPhone, otpCode, enteredOtp, addOtpDigit, setEnteredOtp, clearOtp } = useCodeGuruStore()
  
  const [selectedDigit, setSelectedDigit] = useState(null)
  const [aimingSlot, setAimingSlot] = useState(0)
  const [timeLeft, setTimeLeft] = useState(45)
  const [isVerifying, setIsVerifying] = useState(false)
  const [flyingDigit, setFlyingDigit] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [otpError, setOtpError] = useState('')
  const [sparkSlot, setSparkSlot] = useState(null)
  const arenaRef = useRef(null)
  const bowStageRef = useRef(null)
  const slotRefs = useRef([])
  const [aimGeometry, setAimGeometry] = useState(null)

  useLayoutEffect(() => {
    const arena = arenaRef.current
    const bowStage = bowStageRef.current
    const targetSlot = slotRefs.current[aimingSlot]
    if (!arena || !bowStage || !targetSlot || aimingSlot < 0) {
      setAimGeometry(null)
      return undefined
    }

    const measure = () => {
      const arenaRect = arena.getBoundingClientRect()
      const bowRect = bowStage.getBoundingClientRect()
      const slotRect = targetSlot.getBoundingClientRect()
      const bowAspect = bowRect.width / Math.max(bowRect.height, 1)
      const cameraDistance = Math.max(2.55, 7.35 / bowAspect)
      const pixelsPerWorldUnit = bowRect.height / (2 * cameraDistance * Math.tan((34 * Math.PI) / 360))
      const arrowAimAngle = (aimingSlot - 2.5) * 0.13
      const arrowTipX = Math.sin(arrowAimAngle) * 0.9
      const arrowTipY = -0.48 + Math.cos(arrowAimAngle) * 0.9
      const nextGeometry = {
        width: arenaRect.width,
        height: arenaRect.height,
        from: {
          x: bowRect.left - arenaRect.left + bowRect.width / 2 + arrowTipX * pixelsPerWorldUnit,
          y: bowRect.top - arenaRect.top + bowRect.height / 2 - arrowTipY * pixelsPerWorldUnit,
        },
        to: {
          x: slotRect.left - arenaRect.left + slotRect.width / 2,
          y: slotRect.top - arenaRect.top + slotRect.height / 2,
        },
      }

      setAimGeometry((previous) => {
        if (previous && Object.keys(nextGeometry).every((key) => {
          if (key === 'from' || key === 'to') return Math.abs(previous[key].x - nextGeometry[key].x) < 0.5 && Math.abs(previous[key].y - nextGeometry[key].y) < 0.5
          return Math.abs(previous[key] - nextGeometry[key]) < 0.5
        })) return previous
        return nextGeometry
      })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(arena)
    observer.observe(bowStage)
    observer.observe(targetSlot)
    return () => observer.disconnect()
  }, [aimingSlot, enteredOtp.length])

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const triggerVerification = () => {
    if (enteredOtp.join('') !== otpCode) {
      setOtpError('That code does not match. Check the digits and try again.')
      return
    }
    setOtpError('')
    setIsVerifying(true)
    setTimeout(() => {
      setIsSuccess(true)
      setTimeout(() => {
        navigate('/welcome')
      }, 900)
    }, 600)
  }

  // Bow Shoot Action
  const shootDigitIntoSlot = (digit, slotIndex) => {
    if (slotIndex < 0 || slotIndex >= 6 || flyingDigit || isVerifying || isSuccess) return
    const targetSlot = slotIndex !== null && slotIndex !== undefined ? slotIndex : aimingSlot

    setFlyingDigit({
      digit,
      targetSlot,
      start: aimGeometry?.from,
      end: aimGeometry?.to,
      id: Date.now(),
    })

    setTimeout(() => {
      addOtpDigit(digit, targetSlot)
      setSparkSlot(targetSlot)
      setTimeout(() => setSparkSlot(null), 550)
      const nextSlot = enteredOtp.map((value, index) => index === targetSlot ? String(digit) : value).findIndex((value) => value === '')
      setAimingSlot(nextSlot)
      setFlyingDigit(null)
    }, 340)
  }

  const releaseDigit = () => {
    if (selectedDigit === null || aimingSlot < 0) return
    setOtpError('')
    shootDigitIntoSlot(selectedDigit, aimingSlot)
  }

  // Handle digit selection
  const handleSelectDigit = (digit) => {
    setSelectedDigit(digit)
  }

  // Handle keyboard typing for accessibility
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (/^[0-9]$/.test(e.key) && !['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
        handleSelectDigit(e.key)
      } else if (e.key === 'Backspace') {
        const lastFilled = enteredOtp.map((d, i) => (d !== '' ? i : -1)).filter((i) => i !== -1).pop()
        if (lastFilled !== undefined) {
          const updated = [...enteredOtp]
          updated[lastFilled] = ''
          setEnteredOtp(updated)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [enteredOtp, selectedDigit, aimingSlot, flyingDigit, isVerifying, isSuccess, setEnteredOtp])

  const handleSlotClick = (index) => {
    setAimingSlot(index)
    setOtpError('')
  }

  const handleBackspace = () => {
    const lastFilled = enteredOtp.map((d, i) => (d !== '' ? i : -1)).filter((i) => i !== -1).pop()
    if (lastFilled !== undefined) {
      const updated = [...enteredOtp]
      updated[lastFilled] = ''
      setEnteredOtp(updated)
    }
  }

  const formatTimer = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="otp-fantasy-root min-h-screen text-neutral-100 flex flex-col md:flex-row relative select-none">
      {/* ── 1. Full Fantasy Landscape Background Image (Cover & Centered) ── */}
      <div
        className="otp-bg-image-layer"
        style={{ backgroundImage: `url(${otpFantasyLandscape})` }}
        aria-hidden="true"
      />

      {/* ── 2. Subtle Dark Atmospheric Overlay (Preserves Moon, Castle, Valley & UI Contrast) ── */}
      <div className="otp-bg-overlay" aria-hidden="true" />

      {/* ── 3. Living World Ambient Animations (Pure CSS, Behind UI, pointer-events-none) ── */}
      <div className="otp-living-world-layer pointer-events-none absolute inset-0 overflow-hidden z-[2]" aria-hidden="true">
        {/* A. Moon Halo Pulse & Drifting Cloud */}
        <div className="otp-moon-halo" />
        <div className="otp-moon-cloud" />

        {/* B. Distant Castle Window Lights (Subtle warm amber flickers) */}
        <div className="otp-castle-light otp-castle-light-1" />
        <div className="otp-castle-light otp-castle-light-2" />
        <div className="otp-castle-light otp-castle-light-3" />
        <div className="otp-castle-light otp-castle-light-4" />

        {/* C. Waterfall & River Chute Shimmer */}
        <div className="otp-waterfall-shimmer" />
        <div className="otp-river-shimmer" />

        {/* D. Stone Steps Lantern Breathing Glow (Left & Right) */}
        <div className="otp-lantern-glow-left" />
        <div className="otp-lantern-glow-right" />

        {/* E. Multi-Layer Depth Mountain Mist / Fog */}
        <div className="otp-fog-layer">
          <div className="otp-fog-deep" />
          <div className="otp-fog-mid" />
          <div className="otp-fog-front" />
        </div>

        {/* F. Emerald Ground / Altar Caustic Glow */}
        <div className="otp-ground-glow" />

        {/* G. Ambient Floating Particles (Emerald, Soft White, Warm Gold) */}
        {[
          { id: 'p1', left: '12%', size: 2.5, duration: '22s', delay: '0s', color: 'rgba(0, 255, 136, 0.45)' },
          { id: 'p2', left: '22%', size: 2, duration: '28s', delay: '4s', color: 'rgba(255, 255, 255, 0.4)' },
          { id: 'p3', left: '34%', size: 3, duration: '25s', delay: '9s', color: 'rgba(245, 158, 11, 0.4)' },
          { id: 'p4', left: '46%', size: 2, duration: '29s', delay: '2s', color: 'rgba(0, 255, 136, 0.4)' },
          { id: 'p5', left: '58%', size: 2.5, duration: '24s', delay: '7s', color: 'rgba(255, 255, 255, 0.45)' },
          { id: 'p6', left: '68%', size: 2, duration: '27s', delay: '12s', color: 'rgba(0, 255, 136, 0.35)' },
          { id: 'p7', left: '80%', size: 3, duration: '23s', delay: '3s', color: 'rgba(245, 158, 11, 0.35)' },
          { id: 'p8', left: '92%', size: 2, duration: '26s', delay: '8s', color: 'rgba(0, 255, 136, 0.4)' },
          { id: 'p9', left: '18%', size: 1.5, duration: '32s', delay: '14s', color: 'rgba(255, 255, 255, 0.35)' },
          { id: 'p10', left: '74%', size: 2.5, duration: '21s', delay: '6s', color: 'rgba(0, 255, 136, 0.4)' },
          { id: 'p11', left: '88%', size: 2, duration: '26s', delay: '1s', color: 'rgba(245, 158, 11, 0.35)' },
          { id: 'p12', left: '28%', size: 2, duration: '30s', delay: '16s', color: 'rgba(0, 255, 136, 0.4)' },
        ].map((m) => (
          <span
            key={m.id}
            className="otp-ambient-mote"
            style={{
              left: m.left,
              width: `${m.size}px`,
              height: `${m.size}px`,
              backgroundColor: m.color,
              boxShadow: `0 0 6px ${m.color}`,
              animationDuration: m.duration,
              animationDelay: m.delay,
            }}
          />
        ))}

        {/* H. Faint CodeGuru Environmental Energy Traces */}
        {[
          { id: 'c1', symbol: '</>', left: '15%', duration: '30s', delay: '0s', size: '10px' },
          { id: 'c2', symbol: '{ }', left: '84%', duration: '34s', delay: '6s', size: '11px' },
          { id: 'c3', symbol: '01', left: '27%', duration: '38s', delay: '12s', size: '9px' },
          { id: 'c4', symbol: 'λ', left: '72%', duration: '32s', delay: '3s', size: '10px' },
          { id: 'c5', symbol: '::', left: '91%', duration: '36s', delay: '15s', size: '9px' },
        ].map((glyph) => (
          <span
            key={glyph.id}
            className="otp-code-energy-trace"
            style={{
              left: glyph.left,
              fontSize: glyph.size,
              animationDuration: glyph.duration,
              animationDelay: glyph.delay,
            }}
          >
            {glyph.symbol}
          </span>
        ))}
      </div>
      {/* Top Header */}
      <header className="otp-navbar absolute top-0 left-0 md:left-[280px] w-full md:w-[calc(100%-280px)] h-16 px-5 md:px-8 flex items-center justify-between z-20 backdrop-blur-md">
        <span className="md:hidden"><CodeGuruLogo size="sm" /></span>

        <div className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-widest text-emerald-300/70 font-mono">
          <span>Learn</span>
          <span className="text-emerald-800">•</span>
          <span>Play</span>
          <span className="text-emerald-800">•</span>
          <span>Practice</span>
          <span className="text-emerald-800">•</span>
          <span>Grow</span>
        </div>

        {/* Right user & timer info */}
        <div className="flex items-center gap-3">
          <div className="otp-timer-badge flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl text-xs font-mono text-neutral-300">
            <Clock className="w-3.5 h-3.5 text-[#00ff88] drop-shadow-[0_0_6px_#00ff88]" />
            <span className="font-bold text-[#00ff88] tracking-wider">{formatTimer(timeLeft)}</span>
            <span className="text-emerald-800/80">|</span>
            <button 
              onClick={() => { setTimeLeft(45); clearOtp(); setOtpError(''); setIsVerifying(false); }}
              className="text-neutral-400 hover:text-[#00ff88] flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
              title="Resend verification code"
            >
              <RotateCcw className="w-3 h-3 text-emerald-400/80" />
              <span>Resend Code</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="otp-user-badge w-8 h-8 rounded-full text-[#00ff88] font-mono font-bold text-xs flex items-center justify-center">
              G
            </div>
            <span className="hidden sm:inline text-xs font-mono text-neutral-400 font-medium">Guest</span>
          </div>
        </div>
      </header>

      {/* Main Body with Left Stepper & Center Bow Arena */}
      <div className="flex-1 flex flex-col md:flex-row relative z-10 w-full px-0 pt-16 md:pt-0">
        {/* Left Side Stepper (Fantasy RPG HUD Progression Panel) */}
        <aside className="otp-sidebar relative w-full md:w-[280px] shrink-0 flex flex-col justify-start px-4 py-4 md:px-6 md:py-6 border-b md:border-b-0 backdrop-blur-xl z-20 select-none">
          {/* Right Edge HUD Geometric Bracket Notch (Desktop) */}
          <div className="hidden md:block absolute top-0 right-0 bottom-0 w-3 pointer-events-none z-30" aria-hidden="true">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 12 800" preserveAspectRatio="none">
              <defs>
                <linearGradient id="sidebar-border-gold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#c5a059" stopOpacity="0.4" />
                  <stop offset="20%" stopColor="#f3d489" stopOpacity="0.8" />
                  <stop offset="45%" stopColor="#c5a059" stopOpacity="0.9" />
                  <stop offset="70%" stopColor="#8c6a2c" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#c5a059" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              {/* Outer Metallic Gold Line with Chamfered Jog-Out Bracket */}
              <path
                d="M 1,0 L 1,170 L 7,180 L 7,270 L 1,280 L 1,800"
                fill="none"
                stroke="url(#sidebar-border-gold)"
                strokeWidth="1.2"
              />
              {/* Inner Glowing Emerald Trace */}
              <path
                d="M 3,0 L 3,168 L 9,178 L 9,272 L 3,282 L 3,800"
                fill="none"
                stroke="#00ff88"
                strokeWidth="0.8"
                strokeOpacity="0.55"
              />
            </svg>
          </div>

          {/* 1. CodeGuru Logo Area: Clean Modern Game Panel */}
          <div className="hidden md:flex flex-col mb-4">
            <div className="otp-sidebar-logo-card flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl select-none group">
              <div className="w-8 h-8 rounded-lg bg-[#062016]/90 border border-emerald-500/40 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,255,136,0.2)]">
                <GraduationCap className="w-5 h-5 text-[#00ff88]" />
              </div>
              <span className="font-heading font-extrabold text-xl tracking-tight text-white leading-tight">
                Code<span className="text-[#00ff88]">Guru</span>
              </span>
            </div>

            {/* 2. Modern Clean Back Button */}
            <button
              type="button"
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1)
                } else {
                  navigate('/login')
                }
              }}
              className="otp-sidebar-back-btn mt-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 transition-all hover:text-white group cursor-pointer w-fit"
              aria-label="Go back to previous page"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#00ff88] transition-transform group-hover:-translate-x-0.5" />
              <span>Back</span>
            </button>
          </div>


          {/* 3. Progress Steps with 8-Pointed Fantasy Rune Medallions (Desktop) */}
          <div className="hidden md:flex flex-col gap-1 mt-3 relative z-10">
            {/* Step 1: Completed */}
            <div className="flex items-center gap-3.5">
              <div className="otp-medallion-wrapper relative w-11 h-11 shrink-0 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 44 44" aria-hidden="true">
                  <defs>
                    <filter id="medallion-emerald-glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="1.5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  {/* 8-Pointed Emerald Star Spire */}
                  <polygon
                    points="22,2 27.5,8 35.5,8.5 35.8,16.5 42,22 35.8,27.5 35.5,35.5 27.5,35.8 22,42 16.5,35.8 8.5,35.5 8.2,27.5 2,22 8.2,16.5 8.5,8.5 16.5,8.2"
                    fill="#062217"
                    stroke="#00ff88"
                    strokeWidth="1.5"
                    filter="url(#medallion-emerald-glow)"
                  />
                  {/* Inner Circular Core */}
                  <circle cx="22" cy="22" r="14.5" fill="#041810" stroke="#00ff88" strokeWidth="1" strokeOpacity="0.75" />
                  {/* Top & Bottom Accent Diamonds */}
                  <polygon points="22,0.5 24,2 22,3.5 20,2" fill="#00ffcc" />
                  <polygon points="22,40.5 24,42 22,43.5 20,42" fill="#00ffcc" />
                </svg>
                <Check className="relative z-10 w-5 h-5 text-[#00ff88] stroke-[2.8] drop-shadow-[0_0_6px_rgba(0,255,136,0.85)]" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm text-white tracking-wide">Enter Number</span>
                <span className="text-[#00ff88] font-mono text-xs font-semibold">Done</span>
              </div>
            </div>

            {/* Connecting Line: Step 1 -> Step 2 (Glowing Energy Flow) */}
            <div className="relative w-11 flex justify-center py-0.5">
              <div className="otp-step-energy-line relative w-0.5 h-8 flex flex-col items-center">
                <div className="w-full h-full bg-gradient-to-b from-[#00ff88] via-[#00ffaa] to-[#00ff88]/50 shadow-[0_0_8px_#00ff88]" />
                {/* Downward Indicator Arrow Notch */}
                <div className="absolute top-1/2 -translate-y-1/2 w-0 h-0 border-l-[3.5px] border-l-transparent border-r-[3.5px] border-r-transparent border-t-[5px] border-t-[#00ff88] filter drop-shadow-[0_0_4px_#00ff88]" />
                {/* Animated Pulse Light Stream */}
                <span className="otp-energy-stream-dot" />
              </div>
            </div>

            {/* Step 2: Active / In Progress */}
            <div className="flex items-center gap-3.5">
              <div className="otp-medallion-wrapper otp-medallion-active relative w-11 h-11 shrink-0 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 44 44" aria-hidden="true">
                  <defs>
                    <linearGradient id="medallion-gold-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#fae09a" />
                      <stop offset="35%" stopColor="#d4af37" />
                      <stop offset="70%" stopColor="#8c6a2c" />
                      <stop offset="100%" stopColor="#f3d489" />
                    </linearGradient>
                  </defs>
                  {/* 8-Pointed Ornate Gold Spire Ring */}
                  <polygon
                    points="22,1 28,7.5 36.5,8 37,16.5 43,22 37,27.5 36.5,36 28,36.5 22,43 16,36.5 7.5,36 7,27.5 1,22 7,16.5 7.5,8 16,7.5"
                    fill="#08281c"
                    stroke="url(#medallion-gold-grad)"
                    strokeWidth="1.8"
                    className="otp-gold-spires"
                  />
                  {/* Emerald-Lined Inner Circular Core */}
                  <circle cx="22" cy="22" r="15" fill="#03160e" stroke="#00ff88" strokeWidth="1.2" />
                  <circle cx="22" cy="22" r="12" fill="none" stroke="url(#medallion-gold-grad)" strokeWidth="0.75" strokeOpacity="0.8" />
                  {/* Cardinal Diamond Jewel Accents */}
                  <polygon points="22,-0.5 24.5,1.5 22,3.5 19.5,1.5" fill="#00ffcc" stroke="url(#medallion-gold-grad)" strokeWidth="0.5" />
                  <polygon points="22,40.5 24.5,42.5 22,44.5 19.5,42.5" fill="#00ffcc" stroke="url(#medallion-gold-grad)" strokeWidth="0.5" />
                  <polygon points="-0.5,22 1.5,19.5 3.5,22 1.5,24.5" fill="#00ffcc" stroke="url(#medallion-gold-grad)" strokeWidth="0.5" />
                  <polygon points="40.5,22 42.5,19.5 44.5,22 42.5,24.5" fill="#00ffcc" stroke="url(#medallion-gold-grad)" strokeWidth="0.5" />
                </svg>
                <span className="relative z-10 font-heading font-black text-lg text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                  2
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base text-white tracking-wide drop-shadow-[0_0_8px_rgba(0,255,136,0.4)]">
                  Verify OTP
                </span>
                <span className="text-[#fbbf24] font-medium text-xs tracking-wide">
                  In Progress
                </span>
              </div>
            </div>

            {/* Connecting Line: Step 2 -> Step 3 (Dark Metallic / Inactive) */}
            <div className="relative w-11 flex justify-center py-0.5">
              <div className="relative w-0.5 h-8 flex flex-col items-center">
                <div className="w-full h-full bg-[#163426] border-l border-[#0e241a]" />
                {/* Center Diamond Notch */}
                <div className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rotate-45 bg-[#1a4332] border border-[#0e251a]" />
              </div>
            </div>

            {/* Step 3: Inactive / Welcome */}
            <div className="flex items-center gap-3.5 opacity-65">
              <div className="otp-medallion-wrapper relative w-11 h-11 shrink-0 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 44 44" aria-hidden="true">
                  {/* 8-Pointed Dark Metallic Iron Spire Star */}
                  <polygon
                    points="22,2 27.5,8 35.5,8.5 35.8,16.5 42,22 35.8,27.5 35.5,35.5 27.5,35.8 22,42 16.5,35.8 8.5,35.5 8.2,27.5 2,22 8.2,16.5 8.5,8.5 16.5,8.2"
                    fill="#06120e"
                    stroke="#264536"
                    strokeWidth="1.2"
                  />
                  {/* Inner Dark Slate Circle */}
                  <circle cx="22" cy="22" r="14.5" fill="#030c09" stroke="#183226" strokeWidth="1" />
                  {/* Cardinal Diamond Accents */}
                  <polygon points="22,0.5 23.5,2 22,3.5 20.5,2" fill="#133628" />
                  <polygon points="22,40.5 23.5,42 22,43.5 20.5,42" fill="#133628" />
                </svg>
                <span className="relative z-10 font-heading font-bold text-sm text-neutral-400">
                  3
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-sm text-neutral-300">Welcome</span>
                <span className="text-neutral-500 font-mono text-xs">Next</span>
              </div>
            </div>

            {/* Subtle Trail Line below Step 3 */}
            <div className="relative w-11 flex justify-center py-0.5">
              <div className="relative w-0.5 h-4 flex flex-col items-center">
                <div className="w-full h-full bg-gradient-to-b from-[#163426] to-transparent" />
              </div>
            </div>
          </div>

          {/* 4. Fantasy Quote Inscription Panel (Desktop) */}
          <div className="hidden md:flex flex-col gap-2 pt-6 mt-2 relative z-10">
            {/* Top Filigree Antique Gold & Emerald Divider */}
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-14 bg-gradient-to-r from-transparent via-[#c5a059]/60 to-transparent" />
              <span className="w-2 h-2 rotate-45 border border-[#c5a059] bg-[#00ff88]/40 shadow-[0_0_6px_#00ff88]" />
              <div className="h-px w-14 bg-gradient-to-r from-transparent via-[#c5a059]/60 to-transparent" />
            </div>

            {/* Quote Inscription */}
            <div className="flex items-start gap-3 px-2 py-1.5">
              <div className="w-1 h-9 rounded-full bg-[#00ff88] shadow-[0_0_10px_#00ff88] shrink-0 mt-0.5" />
              <p className="text-xs italic text-neutral-100 font-sans tracking-wide leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                &ldquo;Same Student.<br />Different Mindset.&rdquo;
              </p>
            </div>

            {/* Bottom Filigree Antique Gold & Emerald Divider */}
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-14 bg-gradient-to-r from-transparent via-[#c5a059]/60 to-transparent" />
              <span className="w-2 h-2 rotate-45 border border-[#c5a059] bg-[#00ff88]/40 shadow-[0_0_6px_#00ff88]" />
              <div className="h-px w-14 bg-gradient-to-r from-transparent via-[#c5a059]/60 to-transparent" />
            </div>
          </div>

          {/* 5. Bottom Environment Artwork & Subtle Ambient Particles */}
          <div className="hidden md:block mt-auto pt-6 relative pointer-events-none" aria-hidden="true">
            {/* Faint Emerald Banner Watermark */}
            <div className="w-full flex justify-center opacity-25">
              <svg viewBox="0 0 100 70" className="w-24 h-auto">
                <path d="M 20,0 L 80,0 L 80,50 L 50,70 L 20,50 Z" fill="none" stroke="#00ff88" strokeWidth="1" />
                <path d="M 25,5 L 75,5 L 75,46 L 50,63 L 25,46 Z" fill="rgba(0,255,136,0.06)" />
                <polygon points="50,18 64,26 50,34 36,26" fill="none" stroke="#00ff88" strokeWidth="1" />
                <path d="M 39,28 L 39,38 Q 50,44 61,38 L 61,28" fill="none" stroke="#00ff88" strokeWidth="1" />
              </svg>
            </div>

            {/* Rising Ember Motes from Lantern Area */}
            <div className="absolute inset-0 overflow-hidden">
              <span className="otp-sidebar-mote" style={{ left: '20%', bottom: '15px', animationDelay: '0s', width: '3px', height: '3px', backgroundColor: '#fbbf24', boxShadow: '0 0 6px #fbbf24' }} />
              <span className="otp-sidebar-mote" style={{ left: '55%', bottom: '25px', animationDelay: '1.8s', width: '2px', height: '2px', backgroundColor: '#00ff88', boxShadow: '0 0 6px #00ff88' }} />
              <span className="otp-sidebar-mote" style={{ left: '75%', bottom: '8px', animationDelay: '3.2s', width: '2.5px', height: '2.5px', backgroundColor: '#fbbf24', boxShadow: '0 0 6px #fbbf24' }} />
            </div>
          </div>

          {/* Mobile Stepper (Clean & Responsive for small screens) */}
          <div className="relative grid grid-cols-3 items-start gap-2 md:hidden" aria-label="Onboarding progress">
            <div className="absolute left-[17%] right-[17%] top-3.5 h-px bg-emerald-950" />
            <div className="absolute left-[17%] top-3.5 h-px w-[33%] bg-[#00ff88]/80 shadow-[0_0_8px_#00ff88]" />
            {[
              { number: '✓', label: 'Enter Number', state: 'done' },
              { number: '2', label: 'Verify OTP', state: 'active' },
              { number: '3', label: 'Welcome', state: 'next' },
            ].map((step) => (
              <div key={step.label} className="relative z-10 flex flex-col items-center gap-1.5 text-center">
                <span className={`grid h-7 w-7 place-items-center rounded-full border text-[10px] font-bold ${
                  step.state === 'done' 
                    ? 'border-[#00ff88]/70 bg-[#0d261a] text-[#00ff88] shadow-[0_0_10px_rgba(0,255,136,0.3)]' 
                    : step.state === 'active' 
                    ? 'border-[#7effba] bg-[#00ff88] text-[#021308] shadow-[0_0_14px_#00ff88]' 
                    : 'border-emerald-950 bg-[#07100c] text-neutral-600'
                }`}>
                  {step.number}
                </span>
                <span className={`text-[10px] leading-tight ${step.state === 'active' ? 'font-bold text-[#00ff88]' : step.state === 'done' ? 'text-neutral-300' : 'text-neutral-500'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* Center Stage: Verification Target & Bow Arena */}
        <div className="flex-1 min-w-0 flex flex-col items-center gap-3 py-3 px-4 md:gap-2 md:px-8 md:pt-14 lg:gap-4 lg:pt-20">
          {/* Headline & Subtitle */}
          <div className="text-center flex flex-col items-center gap-1.5 mt-2">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              Verify Your <span className="text-[#00ff88] drop-shadow-[0_0_18px_rgba(0,255,136,0.65)]">Identity</span>
            </h1>
            <p className="text-xs md:text-sm text-neutral-300 font-sans">
              We&apos;ve sent a 6-digit code to <span className="text-white font-mono font-bold tracking-wide">{authPhone}</span>
            </p>
            <p className="text-[11px] md:text-xs text-neutral-400 max-w-md font-sans">
              Select the correct number, load your bow, aim and release it into the slots below.
            </p>
          </div>

          <div ref={arenaRef} className="relative w-full max-w-5xl">
            {/* Trajectory Guide Beam */}
            {aimGeometry && selectedDigit !== null && aimingSlot >= 0 && (
              <svg
                className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
                viewBox={`0 0 ${aimGeometry.width} ${aimGeometry.height}`}
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <defs>
                  <marker id="otp-shot-arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto" markerUnits="strokeWidth">
                    <path d="M 0 0 L 8 4 L 0 8" fill="none" stroke="#00ff88" strokeWidth="1.5" />
                  </marker>
                </defs>
                <motion.path
                  d={`M ${aimGeometry.from.x} ${aimGeometry.from.y} Q ${(aimGeometry.from.x + aimGeometry.to.x) / 2} ${Math.min(aimGeometry.from.y, aimGeometry.to.y) - 28} ${aimGeometry.to.x} ${aimGeometry.to.y}`}
                  fill="none"
                  stroke="#00ff88"
                  strokeWidth="2"
                  strokeDasharray="7 7"
                  markerEnd="url(#otp-shot-arrowhead)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.45, 0.95, 0.65] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ filter: 'drop-shadow(0 0 6px rgba(0,255,136,0.8))' }}
                />
                <motion.circle
                  cx={aimGeometry.to.x}
                  cy={aimGeometry.to.y}
                  r="9"
                  fill="none"
                  stroke="#00ff88"
                  strokeWidth="1.5"
                  initial={{ opacity: 0.35, r: 7 }}
                  animate={{ opacity: [0.35, 0.9, 0.35], r: [7, 12, 7] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ filter: 'drop-shadow(0 0 4px #00ff88)' }}
                />
              </svg>
            )}

            {/* Flying Digit Projectile */}
            <AnimatePresence>
              {flyingDigit && (
                <motion.div
                  key={flyingDigit.id}
                  initial={{ x: (flyingDigit.start?.x ?? 0) - 18, y: (flyingDigit.start?.y ?? 0) - 18, scale: 0.9, opacity: 1 }}
                  animate={{ x: (flyingDigit.end?.x ?? 0) - 18, y: (flyingDigit.end?.y ?? 0) - 18, scale: 1.2, opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.34, ease: 'easeOut' }}
                  className="pointer-events-none absolute left-0 top-0 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-b from-[#00ff88] to-[#10b981] font-mono text-xl font-black text-[#021308] shadow-[0_0_24px_#00ff88,0_0_10px_#f59e0b]"
                >
                  {flyingDigit.digit}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Six Fantasy Rune Slots (Matches Attached Reference Image) */}
            <div className="relative z-10 mx-auto my-1 flex w-full max-w-xl flex-col items-center lg:max-w-2xl">
              <div className="grid grid-cols-6 gap-2.5 md:gap-4 w-full px-2">
                {enteredOtp.map((digit, index) => {
                  const isTarget = aimingSlot === index
                  const isFilled = digit !== ''

                  return (
                    <motion.button
                      key={index}
                      ref={(node) => { slotRefs.current[index] = node }}
                      onClick={() => handleSlotClick(index)}
                      aria-label={`OTP slot ${index + 1}${digit ? `, digit ${digit}` : ', empty'}`}
                      aria-pressed={isTarget}
                      whileHover={{ y: -2 }}
                      className={`otp-rune-slot relative h-22 md:h-28 lg:h-36 rounded-lg flex flex-col items-center justify-center cursor-pointer ${
                        isFilled ? 'is-filled' : isTarget ? 'is-active' : 'is-empty'
                      }`}
                    >
                      {/* Clipped Dark Emerald / Black Translucent Interior */}
                      <div className="otp-rune-interior absolute inset-0 pointer-events-none" />

                      {/* SVG Layered Border: Antique Gold Metallic Frame + Emerald Inner Trace + Top/Bottom Diamonds */}
                      <svg
                        className="otp-rune-svg absolute inset-0 w-full h-full pointer-events-none"
                        viewBox="0 0 100 130"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <defs>
                          <linearGradient id={`gold-frame-${index}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f3d489" />
                            <stop offset="25%" stopColor="#c5a059" />
                            <stop offset="50%" stopColor="#8c6a2c" />
                            <stop offset="75%" stopColor="#d4b067" />
                            <stop offset="100%" stopColor="#9a7428" />
                          </linearGradient>
                          <filter id={`emerald-glow-${index}`} x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="1.2" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                          </filter>
                        </defs>

                        {/* Outer Antique Gold Metallic Border */}
                        <polygon
                          points="2,23 16,10 50,1 84,10 98,23 98,107 84,120 50,129 16,120 2,107"
                          fill="none"
                          stroke={`url(#gold-frame-${index})`}
                          strokeWidth={isTarget ? "2.2" : "1.6"}
                          className="otp-gold-rim"
                        />

                        {/* Inner Glowing Emerald Highlight Trace */}
                        <polygon
                          points="6,25 18,14 50,6 82,14 94,25 94,105 82,116 50,124 18,116 6,105"
                          fill="none"
                          stroke={isFilled ? "#00ffaa" : isTarget ? "#38ef7d" : "#1a4633"}
                          strokeWidth={isTarget || isFilled ? "1.2" : "0.75"}
                          strokeOpacity={isFilled ? "0.9" : isTarget ? "1" : "0.45"}
                          filter={isTarget || isFilled ? `url(#emerald-glow-${index})` : undefined}
                          className="otp-emerald-trace"
                        />

                        {/* Top Decorative Diamond / Rune Ornament */}
                        <g className="otp-diamond-ornament">
                          <polygon
                            points="50,-3.5 55,1.5 50,6.5 45,1.5"
                            fill="#0b2419"
                            stroke={`url(#gold-frame-${index})`}
                            strokeWidth="1.2"
                          />
                          <polygon
                            points="50,-1.5 53,1.5 50,4.5 47,1.5"
                            fill={isFilled || isTarget ? "#00ffcc" : "#145237"}
                            className="otp-jewel-core"
                          />
                        </g>

                        {/* Bottom Decorative Diamond / Rune Ornament */}
                        <g className="otp-diamond-ornament">
                          <polygon
                            points="50,123.5 55,128.5 50,133.5 45,128.5"
                            fill="#0b2419"
                            stroke={`url(#gold-frame-${index})`}
                            strokeWidth="1.2"
                          />
                          <polygon
                            points="50,125.5 53,128.5 50,131.5 47,128.5"
                            fill={isFilled || isTarget ? "#00ffcc" : "#145237"}
                            className="otp-jewel-core"
                          />
                        </g>
                      </svg>

                      {/* Digit: Centered, Bold, Pale Mint / Cyan-Emerald Glow */}
                      {isFilled ? (
                        <motion.span
                          initial={{ scale: 0.35, y: -4, opacity: 0 }}
                          animate={{ scale: 1, y: 0, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 24 }}
                          className="otp-digit-text font-mono text-3xl md:text-5xl lg:text-6xl font-black relative z-10 select-none"
                        >
                          {digit}
                        </motion.span>
                      ) : (
                        <div className="relative z-10 flex items-center justify-center">
                          {isTarget ? (
                            <span className="otp-rune-target-dot" />
                          ) : null}
                        </div>
                      )}

                      {/* Arrow Arrival Spark Particle Burst */}
                      {sparkSlot === index && (
                        <div className="otp-spark-burst inset-0 flex items-center justify-center pointer-events-none z-30">
                          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, pi) => {
                            const rad = (angle * Math.PI) / 180
                            const dist = 32
                            const tx = `${Math.cos(rad) * dist}px`
                            const ty = `${Math.sin(rad) * dist}px`
                            return (
                              <span
                                key={pi}
                                className="otp-spark-particle"
                                style={{ '--tx': tx, '--ty': ty }}
                              />
                            )
                          })}
                        </div>
                      )}
                    </motion.button>
                  )
                })}
              </div>

              {/* Pedestal Altar Dais with Rune Inscription matching reference banner */}
              <div className="otp-altar-banner relative w-full mt-4 py-2.5 px-6 flex items-center justify-center">
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                  viewBox="0 0 600 40"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <defs>
                    <linearGradient id="banner-gold-grad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#c5a059" />
                      <stop offset="10%" stopColor="#f3d489" />
                      <stop offset="50%" stopColor="#8c6a2c" />
                      <stop offset="90%" stopColor="#f3d489" />
                      <stop offset="100%" stopColor="#c5a059" />
                    </linearGradient>
                  </defs>
                  {/* Outer Banner Border with Pointed Ends */}
                  <polygon
                    points="12,20 22,4 578,4 588,20 578,36 22,36"
                    fill="rgba(4, 16, 12, 0.88)"
                    stroke="url(#banner-gold-grad)"
                    strokeWidth="1.2"
                  />
                  {/* Left End Diamond Notch */}
                  <polygon points="12,20 16,17 20,20 16,23" fill="#00ffcc" stroke="#c5a059" strokeWidth="0.8" />
                  {/* Right End Diamond Notch */}
                  <polygon points="588,20 584,17 580,20 584,23" fill="#00ffcc" stroke="#c5a059" strokeWidth="0.8" />
                </svg>
                <span className="relative z-10 text-[10px] md:text-xs font-mono font-bold tracking-[0.24em] uppercase text-[#c5a059] drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                  A BRIGHTER YOU, A BRIGHTER TOMORROW
                </span>
              </div>
            </div>

            {/* The Bow Visual Stage */}
            <div ref={bowStageRef} className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center">
              <OTPBow selectedDigit={selectedDigit} aimingSlot={aimingSlot} onShoot={releaseDigit} />
            </div>
          </div>

          {/* Digits Dock 0-9 & Actions */}
          <div className="w-full max-w-xl xl:max-w-5xl flex flex-col items-center gap-3 mb-2">
            <div className="flex items-center justify-between w-full px-2">
              <span className="text-[11px] font-mono text-emerald-400/80">
                Pick a digit · aim at a slot · pull and release:
              </span>
              <button
                onClick={handleBackspace}
                className="text-xs text-neutral-400 hover:text-[#00ff88] flex items-center gap-1.5 font-mono transition-colors cursor-pointer"
                title="Backspace"
              >
                <Delete className="w-3.5 h-3.5 text-emerald-400/70" />
                <span>Backspace</span>
              </button>
            </div>

            {/* 0-9 Digit Dock Buttons */}
            <div className="otp-numpad-dock w-full p-2.5 rounded-2xl flex items-center justify-between gap-1">
              {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => {
                const isSelected = selectedDigit === digit

                return (
                  <button
                    key={digit}
                    onClick={() => handleSelectDigit(digit)}
                    aria-pressed={isSelected}
                    aria-label={`Select digit ${digit}`}
                    className={`otp-num-token w-9 h-11 md:w-11 md:h-12 xl:w-14 xl:h-14 rounded-xl font-mono text-base md:text-lg xl:text-xl font-bold cursor-pointer flex items-center justify-center ${
                      isSelected ? 'is-selected' : ''
                    }`}
                  >
                    {digit}
                  </button>
                )
              })}
            </div>

            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
              <p className="text-[11px] text-neutral-400 font-mono" aria-live="polite">
                {selectedDigit === null
                  ? 'Choose a digit, then aim at an empty slot.'
                  : aimingSlot < 0
                    ? `Digit ${selectedDigit} is loaded. Choose a slot to aim.`
                    : `Digit ${selectedDigit} is loaded and aimed at slot ${aimingSlot + 1}.`}
              </p>
              <div className="flex items-center gap-2">
                {enteredOtp.every(Boolean) && (
                  <button
                    onClick={triggerVerification}
                    disabled={isVerifying || isSuccess}
                    className="otp-verify-btn px-6 py-2.5 rounded-xl font-bold text-xs tracking-wider cursor-pointer disabled:opacity-50"
                  >
                    {isVerifying ? 'Verifying…' : 'Verify OTP'}
                  </button>
                )}
              </div>
            </div>
            {otpError && <p role="alert" className="text-xs text-rose-400 self-start px-1 font-mono">{otpError}</p>}

            {/* Quick action helper buttons */}
            <div className="flex items-center gap-3 text-xs pt-1">
              <button
                onClick={() => {
                  // Autofill demo code 742918
                  setEnteredOtp(['7', '4', '2', '9', '1', '8'])
                }}
                className="text-neutral-500 hover:text-[#00ff88] transition-colors font-mono underline cursor-pointer"
              >
                Fill Demo OTP (742918)
              </button>
              <span className="text-emerald-950">•</span>
              <button
                onClick={() => navigate('/welcome')}
                className="text-neutral-500 hover:text-white transition-colors font-mono cursor-pointer"
              >
                Skip to Language Selection &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal / Pulse */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#020604]/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="p-8 rounded-3xl bg-gradient-to-b from-[#0f241a] to-[#07130e] border-2 border-[#00ff88] shadow-[0_0_60px_rgba(0,255,136,0.5),0_0_20px_rgba(245,158,11,0.25)] flex flex-col items-center text-center max-w-sm"
            >
              <div className="w-16 h-16 rounded-full bg-[#00ff88] text-[#021308] flex items-center justify-center mb-4 shadow-[0_0_25px_#00ff88]">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-heading font-extrabold text-white">
                Identity Verified
              </h2>
              <p className="text-xs text-emerald-300/80 font-sans mt-2 mb-4">
                Access granted. Welcome to CodeGuru.
              </p>
              <div className="w-6 h-6 border-2 border-[#00ff88] border-t-transparent rounded-full animate-spin" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
