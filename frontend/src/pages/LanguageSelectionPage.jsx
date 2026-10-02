import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { ArrowRight, Check, Code2, BarChart3, Trophy, Gamepad2 } from 'lucide-react'
import CodeGuruLogo from '../components/codeguru/CodeGuruLogo'
import { useCodeGuruStore } from '../store/useCodeGuruStore'
import podiumArt from '../assets/language_podium_art.webp'

export default function LanguageSelectionPage() {
  const navigate = useNavigate()
  const { interfaceLanguage = 'English', setInterfaceLanguage } = useCodeGuruStore()
  const [currentChoice, setCurrentChoice] = useState(interfaceLanguage)

  const handleConfirm = () => {
    setInterfaceLanguage(currentChoice)
    navigate('/home')
  }

  const options = [{ code: 'English', label: 'English', sub: 'Most popular' }, { code: 'Hindi', label: 'हिंदी', sub: 'हिंदी में सीखें' }]
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#060807] text-slate-100">
      <aside className="hidden w-[280px] shrink-0 flex-col justify-between border-r border-slate-800 bg-[#080C0A] px-10 py-8 lg:flex"><CodeGuruLogo size="md"/><div className="space-y-7"><Step done label="Enter Number" status="Done"/><div className="ml-3 h-8 w-px bg-primary/40"/><Step done label="Verify OTP" status="Done"/><div className="ml-3 h-8 w-px bg-primary/40"/><Step active label="Welcome" status="You're In!"/></div><div><p className="text-lg text-slate-400">“Same Student.<br/>Different Mindset.”</p><p className="mt-8 text-xs uppercase tracking-[.24em] leading-7 text-slate-500">Learn<br/>Practice<br/>Grow</p><div className="mt-3 h-1 w-12 bg-primary"/></div></aside>
      <main className="relative flex min-w-0 flex-1 flex-col items-center px-5 pb-10 pt-7 md:px-10">
        <header className="flex w-full max-w-[1080px] items-center justify-between lg:justify-end"><span className="lg:hidden"><CodeGuruLogo size="sm"/></span><nav className="hidden items-center gap-3 text-[11px] uppercase tracking-[.2em] text-slate-400 md:flex">Learn <b>•</b> Play <b>•</b> Practice <b>•</b> Grow</nav><span className="ml-8 flex items-center gap-2 text-sm"><span className="grid h-10 w-10 place-items-center rounded-full border border-primary/60 text-xl font-bold text-primary">G</span>Guest</span></header>
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="z-10 mt-5 flex w-full max-w-[970px] flex-col items-center text-center">
          <p className="text-xs uppercase tracking-[.28em] text-slate-400">Step 3 of 3</p><h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">You’re <span className="text-primary">In!</span></h1><p className="mt-3 font-semibold">Welcome to CodeGuru</p><p className="mt-1 text-sm text-slate-400 sm:text-base">Let’s set up your learning space to get you started.</p>
          <div className="relative mt-1 h-[260px] w-full max-w-[690px] sm:h-[330px]"><img src={podiumArt} alt="A glowing CodeGuru learning podium" className="h-full w-full object-contain" style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, transparent 15%, black 22%, black 100%)', WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, transparent 15%, black 22%, black 100%)' }}/><div className="absolute left-[5%] top-[22%] hidden -rotate-6 rounded-xl border border-primary/50 bg-[#071511]/80 p-4 text-primary sm:block"><Code2 size={29}/><span className="mt-2 block text-xs text-slate-200">Learn</span></div><div className="absolute right-[5%] top-[22%] hidden rotate-6 rounded-xl border border-primary/50 bg-[#071511]/80 p-4 text-primary sm:block"><BarChart3 size={29}/><span className="mt-2 block text-xs text-slate-200">Compete</span></div><div className="absolute bottom-[10%] left-[4%] hidden -rotate-3 rounded-xl border border-primary/50 bg-[#071511]/80 p-4 text-emerald-200 sm:block"><Gamepad2 size={29}/><span className="mt-2 block text-xs text-slate-200">Practice</span></div><div className="absolute bottom-[10%] right-[4%] hidden rotate-3 rounded-xl border border-primary/50 bg-[#071511]/80 p-4 text-amber-200 sm:block"><Trophy size={29}/><span className="mt-2 block text-xs text-slate-200">Grow</span></div></div>
          <div className="w-full max-w-[760px] rounded-2xl bg-[#0A100D]/85 p-5 sm:p-6"><h2 className="text-lg font-bold sm:text-xl">Choose Your Preferred Language</h2><p className="mt-1 text-sm text-slate-400">You can always change this later in settings.</p><div className="mt-6 grid grid-cols-1 gap-4 text-left sm:grid-cols-2">{options.map((option)=><button type="button" key={option.code} onClick={()=>setCurrentChoice(option.code)} aria-pressed={currentChoice===option.code} className={`flex min-h-[84px] items-center gap-4 rounded-xl border px-5 text-left transition ${currentChoice===option.code?'border-primary bg-primary/10':'border-slate-700 bg-[#0D1411] hover:border-slate-500'}`}><span className={`grid h-12 w-12 place-items-center rounded-lg font-bold ${option.code==='English'?'bg-primary/15 text-primary':'bg-slate-800 text-xl'}`}>{option.code==='English'?'EN':'हि'}</span><span className="flex-1"><span className="block font-bold">{option.label}</span><span className="mt-1 block text-xs text-slate-400">{option.sub}</span></span><span className={`grid h-7 w-7 place-items-center rounded-full border ${currentChoice===option.code?'border-primary bg-primary text-[#040D07]':'border-slate-600'}`}>{currentChoice===option.code&&<Check size={17}/>}</span></button>)}</div></div>
          <button onClick={handleConfirm} className="mt-5 flex h-14 w-full max-w-[430px] items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#00E55C] to-[#00FF66] font-bold text-[#040D07] shadow-[0_8px_28px_rgba(0,255,102,.25)] hover:brightness-110">Enter CodeGuru <ArrowRight size={19}/></button>
        </motion.section>
        <p className="absolute bottom-3 right-7 hidden max-w-[150px] -rotate-6 text-right text-lg italic text-slate-500 md:block">“Discipline today builds a better tomorrow.”</p>
      </main>
    </div>
  )
}

function Step({ done, active, label, status }) {
  return <div className="flex items-center gap-3"><span className={`grid h-10 w-10 place-items-center rounded-full border ${done?'border-primary/50 bg-primary/15 text-primary':active?'border-primary bg-primary text-[#040D07] shadow-[0_0_18px_rgba(0,255,102,.4)]':'border-slate-700 text-slate-400'}`}>{done?<Check size={18}/>:3}</span><span><b className={`block text-sm ${active?'text-white':'text-slate-300'}`}>{label}</b><small className="text-slate-400">{status}</small></span></div>
}
