import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Check, Clock, RotateCcw, ShieldCheck, Delete } from 'lucide-react'
import CodeGuruLogo from '../components/codeguru/CodeGuruLogo'
import OTPBow from '../components/codeguru/OTPBow'
import { useCodeGuruStore } from '../store/useCodeGuruStore'

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
    <div className="min-h-screen bg-[#060807] text-neutral-100 flex flex-col md:flex-row relative overflow-x-hidden select-none">
      {/* Top Header */}
      <header className="absolute top-0 left-0 md:left-[280px] w-full md:w-[calc(100%-280px)] h-16 px-5 md:px-8 border-b border-[#141C17] bg-[#0A0D0C]/65 backdrop-blur-md flex items-center justify-between z-20">
        <span className="md:hidden"><CodeGuruLogo size="sm" /></span>

        <div className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-widest text-neutral-400 font-mono">
          <span>Learn</span>
          <span className="text-neutral-700">•</span>
          <span>Play</span>
          <span className="text-neutral-700">•</span>
          <span>Practice</span>
          <span className="text-neutral-700">•</span>
          <span>Grow</span>
        </div>

        {/* Right user & timer info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0F1612] border border-[#1C2720] text-xs font-mono text-neutral-300">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span className="font-semibold text-primary">{formatTimer(timeLeft)}</span>
            <span className="text-neutral-600">|</span>
            <button 
                    onClick={() => { setTimeLeft(45); clearOtp(); setOtpError(''); setIsVerifying(false); }}
              className="text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Resend</span>
            </button>
          </div>

          <div className="w-8 h-8 rounded-xl bg-[#131D17] border border-[#223126] text-primary font-bold text-xs flex items-center justify-center">
            G
          </div>
        </div>
      </header>

      {/* Main Body with Left Stepper & Center Bow Arena */}
      <div className="flex-1 flex flex-col md:flex-row relative z-10 w-full px-0 pt-16 md:pt-0">
        {/* Left Side Stepper */}
        <div className="w-full md:w-[280px] shrink-0 flex flex-col justify-start px-4 py-3 md:px-10 md:py-8 border-b md:border-b-0 md:border-r border-[#151D18] bg-[#080d10]/75">
          <div className="hidden md:block mb-12"><CodeGuruLogo size="md" /></div>
          <div className="hidden md:flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              {/* Step 1 */}
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#13231A] border border-primary/40 text-primary flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-xs">
                  <span className="font-semibold text-neutral-300">Enter Number</span>
                  <span className="text-neutral-500 font-mono text-[10px]">Done</span>
                </div>
              </div>

              {/* Step line */}
              <div className="w-0.5 h-6 bg-primary/40 ml-3.5" />

              {/* Step 2 (Active) */}
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-primary text-[#040D07] font-bold text-xs flex items-center justify-center shadow-[0_0_12px_#00FF66]">
                  2
                </div>
                <div className="flex flex-col text-xs">
                  <span className="font-bold text-primary">Verify OTP</span>
                  <span className="text-primary/70 font-mono text-[10px]">In Progress</span>
                </div>
              </div>

              {/* Step line */}
              <div className="w-0.5 h-6 bg-neutral-800 ml-3.5" />

              {/* Step 3 */}
              <div className="flex items-center gap-3 opacity-50">
                <div className="w-7 h-7 rounded-full bg-[#111714] border border-neutral-700 text-neutral-400 font-bold text-xs flex items-center justify-center">
                  3
                </div>
                <div className="flex flex-col text-xs">
                  <span className="font-medium text-neutral-400">Welcome</span>
                  <span className="text-neutral-600 font-mono text-[10px]">Next</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative grid grid-cols-3 items-start gap-2 md:hidden" aria-label="Onboarding progress">
            <div className="absolute left-[17%] right-[17%] top-3.5 h-px bg-[#26352d]" />
            <div className="absolute left-[17%] top-3.5 h-px w-[33%] bg-primary/70" />
            {[
              { number: '✓', label: 'Enter Number', state: 'done' },
              { number: '2', label: 'Verify OTP', state: 'active' },
              { number: '3', label: 'Welcome', state: 'next' },
            ].map((step) => (
              <div key={step.label} className="relative z-10 flex flex-col items-center gap-1.5 text-center">
                <span className={`grid h-7 w-7 place-items-center rounded-full border text-[10px] font-bold ${step.state === 'done' ? 'border-primary/50 bg-[#13231A] text-primary' : step.state === 'active' ? 'border-primary bg-primary text-[#040D07] shadow-[0_0_12px_#00FF66]' : 'border-neutral-700 bg-[#111714] text-neutral-500'}`}>{step.number}</span>
                <span className={`text-[10px] leading-tight ${step.state === 'active' ? 'font-semibold text-primary' : step.state === 'done' ? 'text-neutral-300' : 'text-neutral-500'}`}>{step.label}</span>
              </div>
            ))}
          </div>

          <div className="hidden md:flex flex-col gap-2 pt-6 md:mt-20">
            <p className="text-xs italic text-neutral-500 font-sans">
              "Same Student. Different Mindset."
            </p>
          </div>
          <div className="hidden md:block mt-auto pt-12 text-[10px] uppercase font-mono tracking-widest text-neutral-600">
            Learn • Practice • Grow
          </div>
        </div>

        {/* Center Stage: Verification Target & Bow Arena */}
        <div className="flex-1 min-w-0 flex flex-col items-center gap-3 py-3 px-4 md:gap-2 md:px-8 md:pt-14 lg:gap-4 lg:pt-20">
          {/* Headline & Subtitle */}
          <div className="text-center flex flex-col items-center gap-1.5 mt-2">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-heading font-extrabold tracking-tight text-white">
              Verify Your <span className="text-primary text-glow-primary">Identity</span>
            </h1>
            <p className="text-xs md:text-sm text-neutral-400 font-sans">
              We've sent a 6-digit code to <span className="text-white font-mono font-medium">{authPhone}</span>
            </p>
            <p className="text-[11px] md:text-xs text-neutral-500 max-w-md font-sans">
              Choose a digit, select its slot, then pull back the bow and release to shoot.
            </p>
          </div>

          <div ref={arenaRef} className="relative w-full max-w-5xl">
          {aimGeometry && selectedDigit !== null && aimingSlot >= 0 && (
            <svg
              className="pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible"
              viewBox={`0 0 ${aimGeometry.width} ${aimGeometry.height}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <marker id="otp-shot-arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto" markerUnits="strokeWidth">
                  <path d="M 0 0 L 8 4 L 0 8" fill="none" stroke="#74ffe0" strokeWidth="1.5" />
                </marker>
              </defs>
              <motion.path
                d={`M ${aimGeometry.from.x} ${aimGeometry.from.y} Q ${(aimGeometry.from.x + aimGeometry.to.x) / 2} ${Math.min(aimGeometry.from.y, aimGeometry.to.y) - 28} ${aimGeometry.to.x} ${aimGeometry.to.y}`}
                fill="none"
                stroke="#74ffe0"
                strokeWidth="2"
                strokeDasharray="7 7"
                markerEnd="url(#otp-shot-arrowhead)"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.45, 0.95, 0.65] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                style={{ filter: 'drop-shadow(0 0 4px rgba(80,255,215,.7))' }}
              />
              <motion.circle
                cx={aimGeometry.to.x}
                cy={aimGeometry.to.y}
                r="9"
                fill="none"
                stroke="#74ffe0"
                strokeWidth="1.5"
                initial={{ opacity: 0.35, r: 7 }}
                animate={{ opacity: [0.35, 0.9, 0.35], r: [7, 12, 7] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              />
            </svg>
          )}
          <AnimatePresence>
            {flyingDigit && (
              <motion.div
                key={flyingDigit.id}
                initial={{ x: (flyingDigit.start?.x ?? 0) - 18, y: (flyingDigit.start?.y ?? 0) - 18, scale: 0.9, opacity: 1 }}
                animate={{ x: (flyingDigit.end?.x ?? 0) - 18, y: (flyingDigit.end?.y ?? 0) - 18, scale: 1.2, opacity: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.34, ease: 'easeOut' }}
                className="pointer-events-none absolute left-0 top-0 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-primary font-mono text-lg font-bold text-[#040D07] shadow-[0_0_18px_#00FF66]"
              >
                {flyingDigit.digit}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Six Tall Pedestal Slabs */}
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
                    whileHover={{ y: -4 }}
                    className={`relative h-20 md:h-24 lg:h-32 rounded-xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${
                      isFilled
                        ? 'bg-gradient-to-b from-[#14261C] to-[#0D1812] border-2 border-primary shadow-[0_0_20px_rgba(0,255,102,0.35)]'
                        : isTarget
                        ? 'bg-gradient-to-b from-[#151D19] to-[#0E1511] border-2 border-primary/50 shadow-[0_0_12px_rgba(0,255,102,0.2)]'
                        : 'bg-gradient-to-b from-[#111713] to-[#0A0E0C] border border-[#1E2A23] hover:border-[#2D3F34]'
                    }`}
                  >
                    {/* Top Notch of Ancient Obsidian Slab */}
                    <div className="absolute top-1.5 w-6 h-1 rounded-full bg-neutral-800/80" />

                    {/* Digit or Dash */}
                    {isFilled ? (
                      <motion.span
                        initial={{ scale: 0.5, y: -10 }}
                        animate={{ scale: 1, y: 0 }}
                        className="font-mono text-2xl md:text-4xl font-extrabold text-primary"
                      >
                        {digit}
                      </motion.span>
                    ) : (
                      <span className="font-mono text-lg text-neutral-600">
                        {isTarget ? '•' : '—'}
                      </span>
                    )}

                    {/* Target highlight ring */}
                    {isTarget && !isFilled && (
                      <motion.div
                        className="absolute inset-0 rounded-xl border border-primary/40 pointer-events-none"
                        animate={{ opacity: [0.3, 0.9, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    )}
                  </motion.button>
                )
              })}
            </div>

            {/* Pedestal Base with Engraved Inscription */}
            <div className="w-full mt-3 py-2 px-4 rounded-xl bg-[#0D1310] border border-[#19241E] text-center">
              <span className="text-[10px] md:text-xs font-mono tracking-widest uppercase text-neutral-500">
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
              <span className="text-[11px] font-mono text-neutral-500">
                Pick a digit · aim at a slot · pull and release:
              </span>
              <button
                onClick={handleBackspace}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 font-mono transition-colors"
                title="Backspace"
              >
                <Delete className="w-3.5 h-3.5" />
                <span>Backspace</span>
              </button>
            </div>

            {/* 0-9 Digit Dock Buttons */}
            <div className="w-full p-2.5 rounded-2xl bg-[#0D1410] border border-[#1C2720] flex items-center justify-between gap-1 shadow-xl">
              {['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => {
                const isSelected = selectedDigit === digit

                return (
                  <button
                    key={digit}
                    onClick={() => handleSelectDigit(digit)}
                    aria-pressed={isSelected}
                    aria-label={`Select digit ${digit}`}
                    className={`w-9 h-11 md:w-11 md:h-12 xl:w-14 xl:h-14 rounded-xl font-mono text-base md:text-lg xl:text-xl font-bold transition-all cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? 'bg-primary text-[#040D07] shadow-[0_0_15px_#00FF66] scale-105'
                        : 'bg-[#121A15] hover:bg-[#18231C] text-neutral-300 hover:text-white border border-[#202C24]'
                    }`}
                  >
                    {digit}
                  </button>
                )
              })}
            </div>

            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[11px] text-neutral-500 font-mono" aria-live="polite">
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
                    className="px-5 py-2.5 rounded-xl bg-[#14231A] border border-primary/40 text-primary font-bold text-xs tracking-wide disabled:opacity-50"
                  >
                    {isVerifying ? 'Verifying…' : 'Verify code'}
                  </button>
                )}
              </div>
            </div>
            {otpError && <p role="alert" className="text-xs text-rose-300 self-start">{otpError}</p>}

            {/* Quick action helper buttons */}
            <div className="flex items-center gap-3 text-xs">
              <button
                onClick={() => {
                  // Autofill demo code 742918
                  setEnteredOtp(['7', '4', '2', '9', '1', '8'])
                }}
                className="text-neutral-500 hover:text-primary transition-colors font-mono underline"
              >
                Fill Demo OTP (742918)
              </button>
              <span className="text-neutral-700">•</span>
              <button
                onClick={() => navigate('/welcome')}
                className="text-neutral-500 hover:text-white transition-colors font-mono"
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
            className="fixed inset-0 z-50 bg-[#060807]/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="p-8 rounded-3xl bg-[#0E1612] border-2 border-primary shadow-[0_0_50px_rgba(0,255,102,0.4)] flex flex-col items-center text-center max-w-sm"
            >
              <div className="w-16 h-16 rounded-full bg-primary text-[#040D07] flex items-center justify-center mb-4 shadow-[0_0_20px_#00FF66]">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-heading font-extrabold text-white">
                Identity Verified
              </h2>
              <p className="text-xs text-neutral-400 font-sans mt-2 mb-4">
                Access granted. Welcome to CodeGuru.
              </p>
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
