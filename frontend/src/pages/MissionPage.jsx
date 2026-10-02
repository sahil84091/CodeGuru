import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Code, 
  Lock, 
  Star, 
  Clock, 
  Zap, 
  CheckCircle2, 
  Key, 
  BookMarked,
  Brain,
  Gamepad2,
  Trophy,
  TrendingUp
} from 'lucide-react'
import { useCodeGuruStore } from '../store/useCodeGuruStore'
import shrineAsset from '../assets/shrine_cube_art.webp'

export default function MissionPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { missions } = useCodeGuruStore()
  
  const missionId = id || '1.1'
  const [showResources, setShowResources] = useState(false)

  const requestedMission = missions.find((m) => m.id === missionId)
  const activeMission = requestedMission && !requestedMission.isLocked
    ? requestedMission
    : missions.find((m) => !m.isLocked) || missions[0]

  const chapterSteps = [
    { num: 1, name: 'Variables & Data Types', active: true },
    { num: 2, name: 'Operators', active: false },
    { num: 3, name: 'Control Flow', active: false },
    { num: 4, name: 'Loops', active: false },
    { num: 5, name: 'Functions', active: false },
    { num: 6, name: 'Arrays', active: false },
  ]

  const gainCards = [
    { title: 'Stronger Fundamentals', desc: 'Build a solid coding base', icon: Brain },
    { title: 'Learn by Doing', desc: 'Hands-on practice', icon: Gamepad2 },
    { title: 'Track Progress', desc: 'Earn XP and badges', icon: Trophy },
    { title: 'Unlock Bigger Challenges', desc: 'New missions and projects', icon: TrendingUp },
  ]

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Top Breadcrumb & Chapter Header */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Map</span>
        </button>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#132219] border border-primary/30 text-primary flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-heading font-extrabold text-white">
                Chapter 1: Foundations
              </h1>
              <p className="text-xs text-neutral-400 font-sans">
                Build your base. Master the fundamentals.
              </p>
            </div>
          </div>

          <div className="hidden md:block text-right">
            <p className="text-xs italic text-neutral-400 font-sans">
              "Choose a mission, not just a problem."
            </p>
          </div>
        </div>

        {/* Chapter Path Stepper Bar */}
        <div className="flex items-center gap-2 overflow-x-auto py-2 border-y border-[#16211B] scrollbar-none">
          {chapterSteps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-2 flex-shrink-0">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                  step.active
                    ? 'bg-[#15251C] border-primary text-primary shadow-[0_0_12px_rgba(0,255,102,0.2)]'
                    : 'bg-[#0E1411] border-[#1C2720] text-neutral-400'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    step.active ? 'bg-primary text-[#040D07]' : 'bg-[#18231C] text-neutral-400'
                  }`}
                >
                  {step.num}
                </div>
                <span>{step.name}</span>
              </div>
              {idx < chapterSteps.length - 1 && (
                <div className="w-4 h-0.5 bg-[#1B2720]" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main 3-Column Layout: Mission List | Hero Card | Mission Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Mission List (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-2.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 px-1">
            Missions in this Chapter
          </span>

          <div className="flex flex-col gap-2">
            {missions.map((m) => {
              const isSelected = activeMission.id === m.id
              const isLocked = m.isLocked

              return (
                <motion.div
                  key={m.id}
                  whileHover={!isLocked ? { x: 3 } : {}}
                  onClick={() => {
                    if (!isLocked) {
                      navigate(`/mission/${m.id}`, { replace: true })
                    }
                  }}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#14231A] border-primary shadow-[0_0_18px_rgba(0,255,102,0.2)] text-white'
                      : isLocked
                      ? 'bg-[#0B0F0D] border-[#18221C] text-neutral-400 opacity-60 cursor-not-allowed'
                      : 'bg-[#0E1511] border-[#1A251E] hover:border-[#2A3B30] text-neutral-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                        isSelected
                          ? 'bg-primary text-[#080B09] border-primary'
                          : isLocked
                          ? 'bg-[#111714] text-neutral-600 border-[#1B2520]'
                          : 'bg-[#141E18] text-primary border-primary/20'
                      }`}
                    >
                      {isLocked ? (
                        <Lock className="w-4 h-4" />
                      ) : (
                        <Code className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex flex-col">
                      <span className="font-heading font-bold text-xs">
                        {m.title}
                      </span>
                      {/* Star rating */}
                      <div className="flex items-center gap-0.5 mt-0.5">
                        {[1, 2, 3].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= m.stars
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-neutral-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {!isLocked && (
                    <ArrowRight className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-neutral-600'}`} />
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Center Column: Mission Visual Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="relative flex min-h-[520px] flex-col justify-end overflow-hidden rounded-3xl border border-[#1C2921] bg-[#0D1410] p-5 shadow-xl sm:p-6">
            <img src={shrineAsset} alt="The Foundations coding shrine" className="absolute inset-0 h-full w-full scale-[1.25] object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#070b09] via-[#07100cb3]/75 to-transparent" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 sm:p-6">
              <span className="rounded-full border border-primary/30 bg-[#0b1712]/85 px-3 py-1 text-xs font-mono font-semibold text-primary">Mission {activeMission.id}</span>
              <span className="rounded-full border border-primary/20 bg-[#0b1712]/85 px-3 py-1 text-xs font-mono text-primary">{activeMission.difficulty}</span>
            </div>
            <div className="relative z-10 flex flex-col gap-2">
              <h2 className="text-xl md:text-2xl font-heading font-extrabold text-white">
                {activeMission.title}
              </h2>
              <p className="text-xs md:text-sm text-neutral-400 font-sans leading-relaxed">
                {activeMission.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="relative z-10 mt-4 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => !activeMission.isLocked && navigate(`/challenge/${activeMission.id}`)}
                disabled={activeMission.isLocked}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-primary hover:bg-primary-hover text-[#040D07] font-bold text-sm tracking-wide transition-all shadow-[0_0_25px_rgba(0,255,102,0.35)] flex items-center justify-center gap-2 group cursor-pointer active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span>Start Mission</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => setShowResources((show) => !show)}
                aria-expanded={showResources}
                className="py-3.5 px-4 rounded-2xl bg-[#121A15] hover:bg-[#18231C] border border-[#223027] text-neutral-300 hover:text-white font-medium text-xs font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <BookMarked className="w-4 h-4 text-neutral-400" />
                <span>View Resources</span>
              </button>
            </div>
            {showResources && (
              <div className="mt-4 rounded-2xl border border-[#1D2A21] bg-[#0A100C] p-4" role="region" aria-label="Mission learning resources">
                <p className="text-xs font-semibold text-white">Quick review</p>
                <p className="mt-1 text-xs leading-relaxed text-neutral-400">{activeMission.description}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {activeMission.skills.map((skill) => (
                    <li key={skill} className="rounded-full border border-[#24352A] bg-[#111A14] px-2.5 py-1 text-[11px] text-primary">{skill}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Mission Details & Unlock Info (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-6 rounded-3xl bg-[#0E1511] border border-[#1C2820] flex flex-col gap-5 shadow-xl">
            <div className="flex items-center gap-2 border-b border-[#18241D] pb-3">
              <span className="font-mono text-primary font-bold text-sm">&lt;/&gt;</span>
              <h3 className="font-heading font-bold text-base text-white">Mission Details</h3>
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-[#152019]">
                <span className="text-neutral-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Difficulty
                </span>
                <span className="font-mono font-semibold text-primary">
                  {activeMission.difficulty}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#152019]">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-neutral-500" />
                  Estimated Time
                </span>
                <span className="font-mono text-neutral-200">
                  {activeMission.estimatedTime}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-[#152019]">
                <span className="text-neutral-400 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                  XP Reward
                </span>
                <span className="font-mono font-bold text-primary">
                  +{activeMission.xpReward} XP
                </span>
              </div>
            </div>

            {/* Skills You'll Learn */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono font-semibold text-neutral-300">
                Skills You'll Learn
              </span>
              <ul className="flex flex-col gap-1.5">
                {activeMission.skills.map((skill, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-neutral-400 font-sans">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prerequisites */}
            <div className="flex flex-col gap-1.5 p-3 rounded-2xl bg-[#121A15] border border-[#1D2A21]">
              <div className="flex items-center gap-2 text-xs text-primary font-mono font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Prerequisites</span>
              </div>
              <span className="text-[11px] text-neutral-400 font-sans">
                {activeMission.prerequisites}
              </span>
            </div>

            {/* Completion Unlocks */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#101713] border border-[#1E2922]">
              <div className="w-10 h-10 rounded-xl bg-[#16251E] border border-cyan-500/30 text-cyan-400 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
                <Key className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wide">
                  Completion Unlocks
                </span>
                <span className="text-xs font-semibold text-neutral-200">
                  {activeMission.unlocks}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: What You'll Gain Cards */}
      <div className="flex flex-col gap-3 pt-2">
        <div className="flex items-center justify-between">
          <span className="font-heading font-bold text-sm text-neutral-200">
            What You'll Gain
          </span>
          <span className="text-xs font-sans italic text-neutral-500">
            Small Steps. Big Results.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {gainCards.map((card, idx) => {
            const Icon = card.icon

            return (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#0E1411] border border-[#1A251F] flex items-center gap-3.5 shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-[#142019] text-primary flex items-center justify-center border border-primary/20 flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-heading font-bold text-xs text-white">
                    {card.title}
                  </span>
                  <span className="text-[11px] text-neutral-400 mt-0.5">
                    {card.desc}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
