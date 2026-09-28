import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { ArrowRight, Gamepad2, BarChart3, Trophy, Users, Sun, LockKeyhole } from 'lucide-react'
import CodeGuruLogo from '../components/codeguru/CodeGuruLogo'
import PortalArtwork from '../components/codeguru/PortalArtwork'
import { useCodeGuruStore } from '../store/useCodeGuruStore'

export default function WelcomePage() {
  const navigate = useNavigate()
  const { setAuthPhone } = useCodeGuruStore()
  const [phoneDigits, setPhoneDigits] = useState('')
  const phoneInput = useRef(null)
  const [lightAppearance, setLightAppearance] = useState(false)
  const [isActivating, setIsActivating] = useState(false)

  useEffect(() => {
    if (!isActivating) return undefined
    const transitionTimer = setTimeout(() => navigate('/otp'), 1250)
    return () => clearTimeout(transitionTimer)
  }, [isActivating, navigate])

  const activatePortal = () => {
    if (phoneDigits.length !== 10 || isActivating) return
    setAuthPhone(`+91 ${phoneDigits.slice(0, 5)} ${phoneDigits.slice(5)}`)
    setIsActivating(true)
  }

  const handlePhoneChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10)
    setPhoneDigits(raw)
    setAuthPhone(`+91 ${raw.slice(0, 5)}${raw.length > 5 ? ` ${raw.slice(5)}` : ''}`)
    if (raw.length === 10) setIsActivating(true)
  }

  const handleProceed = (e) => {
    e.preventDefault()
    activatePortal()
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#060807] text-slate-100 selection:bg-primary/30">
      <header className="relative z-20 mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-10">
        <CodeGuruLogo size="md" />
        <nav className="hidden items-center gap-10 text-sm text-slate-300 md:flex" aria-label="Main navigation">
          <a href="#learn" className="hover:text-primary">Learn</a><a href="#learn" className="hover:text-primary">Practice</a><a href="#learn" className="hover:text-primary">Compete</a><a href="#learn" className="hover:text-primary">Grow</a>
        </nav>
        <div className="flex items-center gap-4"><button aria-label="Toggle appearance" aria-pressed={lightAppearance} onClick={() => setLightAppearance((value) => !value)} className="hidden rounded-full p-2 text-slate-300 hover:bg-white/5 sm:block"><Sun size={20}/></button><button onClick={() => phoneInput.current?.focus()} className="rounded-xl border border-primary/70 px-5 py-2.5 text-sm font-semibold hover:bg-primary/10">Sign In</button></div>
      </header>

      <main className={`relative mx-auto grid min-h-[650px] max-w-[1440px] grid-cols-1 items-center px-6 pb-10 pt-4 md:min-h-[690px] md:grid-cols-2 md:px-10 md:pt-0 ${lightAppearance ? 'brightness-125 saturate-[.8]' : ''}`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_74%_60%,rgba(0,255,102,.12),transparent_42%)]" />
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-[560px] py-8 md:py-0">
          <div className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[.26em] text-slate-300"><span>A brighter you. A brighter tomorrow</span><i className="h-[2px] w-9 bg-primary"/></div>
          <h1 className="max-w-[590px] text-4xl font-extrabold leading-[1.03] tracking-tight text-white sm:text-6xl lg:text-[68px]">Your Coding Journey <span className="text-primary">Begins Here.</span></h1>
          <p className="mt-6 text-xl font-semibold text-slate-200">Learn. Play. Practice. Grow.</p>
          <p className="mt-2 max-w-[460px] text-base leading-7 text-slate-400">Turn your curiosity into real skills with a learning experience that feels like a game.</p>
          <form onSubmit={handleProceed} className="mt-8 flex max-w-[500px] flex-col gap-4">
            <label className="flex h-16 items-center rounded-xl border border-slate-600/70 bg-[#0A100D]/85 px-5 focus-within:border-primary">
              <span className="border-r border-slate-700 pr-4 font-semibold text-white">+91⌄</span>
              <input ref={phoneInput} id="phone-number" aria-label="Mobile number" type="tel" inputMode="numeric" value={phoneDigits} onChange={handlePhoneChange} placeholder="Enter your mobile number" maxLength={10} minLength={10} pattern="[0-9]{10}" className="min-w-0 flex-1 bg-transparent px-4 text-base text-white outline-none placeholder:text-slate-500" required disabled={isActivating} />
            </label>
            <button type="submit" disabled={phoneDigits.length !== 10 || isActivating} className="flex h-14 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#00E55C] to-[#00FF66] text-base font-bold text-[#040D07] shadow-[0_8px_30px_rgba(0,255,102,.22)] transition enabled:hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50">{isActivating ? 'Opening your portal…' : 'Begin Your Journey'} <ArrowRight size={19}/></button>
          </form>
          <div className="relative mx-auto mt-1 h-40 w-[calc(100%+3rem)] max-w-[560px] overflow-hidden md:hidden" aria-label={`Portal stairs: ${phoneDigits.length} of 10 steps lit`}>
            <PortalArtwork digitCount={phoneDigits.length} activating={isActivating} className="[mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]" />
            <span className="sr-only" aria-live="polite">{phoneDigits.length} of 10 steps lit</span>
          </div>
          <p className="mt-5 flex items-center gap-2 pl-2 text-sm text-slate-400"><LockKeyhole size={15}/> Your number is safe with us</p>
        </motion.section>
        <motion.div initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: isActivating ? 1.025 : 1, filter: isActivating ? 'brightness(1.35) saturate(1.3)' : 'brightness(1)' }} transition={{ duration: isActivating ? 1 : .7 }} className="pointer-events-none relative hidden h-full min-h-[520px] md:block">
          <PortalArtwork digitCount={phoneDigits.length} activating={isActivating} className="[mask-image:linear-gradient(to_right,transparent,black_12%,black_94%,transparent)]" />
        </motion.div>
      </main>

      <footer id="learn" className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="grid grid-cols-2 gap-4 border-y border-slate-800/80 py-6 md:grid-cols-[1fr_1fr_1fr_1.4fr_auto] md:gap-0">
          {[[Gamepad2,'Gamified Learning','Make learning fun'],[BarChart3,'Track Progress','See real growth'],[Trophy,'Earn Achievements','Be proud'],[Users,'Compete & Collaborate','Grow together']].map(([Icon,title,caption])=><div key={title} className="flex items-center gap-3 border-slate-800 px-2 md:border-r md:px-6"><Icon className="h-7 w-7 shrink-0 text-slate-300"/><div><p className="text-sm font-semibold text-slate-200">{title}</p><p className="mt-1 text-xs text-slate-400">{caption}</p></div></div>)}
          <p className="hidden max-w-40 pl-8 text-sm italic text-slate-300 md:block">“Code today for a better you.”</p>
        </div>
        <div className="flex items-center justify-between py-5 text-xs text-slate-500"><span>© 2026 CodeGuru. All rights reserved.</span><div className="flex gap-6"><a href="#learn">Privacy</a><a href="#learn">Terms</a><a href="#learn">Help</a></div></div>
      </footer>
      <AnimatePresence>{isActivating && <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 0.06, 0.32, 0.96] }} exit={{ opacity: 0 }} transition={{ duration: 1.2, times: [0, 0.28, 0.72, 1], ease: 'easeInOut' }} className="pointer-events-none fixed inset-0 z-40 bg-[radial-gradient(ellipse_at_72%_52%,rgba(85,255,220,.58),rgba(0,229,153,.24)_25%,rgba(5,11,13,.98)_72%)]" />}</AnimatePresence>
    </div>
  )
}
