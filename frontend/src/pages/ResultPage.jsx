import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { 
  Check, 
  Target, 
  Clock, 
  Code2, 
  Flame, 
  ArrowRight, 
  BookOpen, 
  Unlock
} from 'lucide-react'
import CodeGuruLogo from '../components/codeguru/CodeGuruLogo'
import { useCodeGuruStore } from '../store/useCodeGuruStore'
import rewardMapAsset from '../assets/foundations_reward_map.png'

export default function ResultPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { lastCompletedMission, missions, player } = useCodeGuruStore()

  const missionInfo = lastCompletedMission?.id === id || !id ? lastCompletedMission : null
  const missionId = missionInfo?.id || id || '1.1'
  const missionIndex = missions.findIndex((mission) => mission.id === missionId)
  const nextMission = missions[missionIndex + 1]
  const levelProgress = Math.min(Math.round((player.xp / player.nextLevelXp) * 100), 100)

  if (!missionInfo) return <Navigate to={`/challenge/${missionId}`} replace />

  return (
    <div className="min-h-screen bg-[#060807] text-neutral-100 flex flex-col justify-between selection:bg-primary/20 select-none">
      {/* Top Header */}
      <header className="px-8 py-5 border-b border-[#141C17] bg-[#0A0D0C]/90 backdrop-blur-md flex items-center justify-between z-20">
        <div className="flex items-center gap-6">
          <CodeGuruLogo size="sm" linkTo="/home" />

          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-neutral-400">
            <span>Chapter 1: Foundations</span>
            <span>&gt;</span>
            <span className="text-primary">Mission {missionId} &gt; {missionInfo?.title || missions[missionIndex]?.title}</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4 text-right">
          <p className="text-xs italic text-neutral-400 font-sans">
            "Small progress builds real skills."
          </p>
        </div>
      </header>

      {/* Main Grid: Left (Mission Complete Card) + Right (Animated Map Unlock) */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Mission Complete Card (5 cols) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-5 p-6 md:p-8 rounded-3xl bg-[#0C120F] border border-[#1C2921] shadow-2xl flex flex-col justify-between gap-5 relative overflow-hidden"
        >
          {/* Subtle glow background */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header Check & Title */}
          <div className="flex flex-col items-center text-center gap-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10, delay: 0.1 }}
              className="w-14 h-14 rounded-full bg-primary text-[#040D07] flex items-center justify-center shadow-[0_0_25px_#00FF66]"
            >
              <Check className="w-8 h-8 stroke-[3]" />
            </motion.div>

            <span className="text-[11px] font-mono tracking-widest text-primary uppercase font-bold mt-1">
              {missionInfo ? 'MISSION COMPLETE' : 'MISSION DEBRIEF'}
            </span>
            <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-white">
              {missionInfo?.title || missions[missionIndex]?.title || 'Mission'}
            </h1>
            <p className="text-xs text-neutral-400 font-sans italic max-w-xs">
              {missionInfo ? 'You found the issue, fixed the logic, and got the output running. Well done!' : 'Complete the challenge to see your mission results and unlock the next step.'}
            </p>
          </div>

          {/* Stats Row: Accuracy, Time Taken, Test Cases */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-[#101814] border border-[#1C2820] flex flex-col items-center text-center gap-1">
              <Target className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-mono text-neutral-400">Accuracy</span>
              <span className="font-mono font-bold text-base text-white">{missionInfo ? `${missionInfo.accuracy}%` : '—'}</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#101814] border border-[#1C2820] flex flex-col items-center text-center gap-1">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-mono text-neutral-400">Time Taken</span>
              <span className="font-mono font-bold text-base text-white">{missionInfo?.timeTaken || '—'}</span>
            </div>

            <div className="p-3 rounded-2xl bg-[#101814] border border-[#1C2820] flex flex-col items-center text-center gap-1">
              <Code2 className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-mono text-neutral-400">Test Cases</span>
              <span className="font-mono font-bold text-base text-white">
                {missionInfo ? `${missionInfo.testCasesPassed} / ${missionInfo.totalTestCases}` : '—'}
              </span>
            </div>
          </div>

          {/* XP and Streak Earned Badges */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-[#111C16] border border-primary/30 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary text-[#040D07] font-bold text-xs flex items-center justify-center shadow-[0_0_10px_#00FF66]">
                XP
              </div>
              <div className="flex flex-col">
                <span className="font-mono font-bold text-sm text-primary">+{missionInfo?.xpEarned || 0} XP</span>
                <span className="text-[10px] font-mono text-neutral-400">XP Earned</span>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#16140D] border border-amber-500/30 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-[#080B09] flex items-center justify-center shadow-[0_0_10px_#F59E0B]">
                <Flame className="w-5 h-5 fill-current" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono font-bold text-sm text-amber-400">{player.streak} Days</span>
                <span className="text-[10px] font-mono text-neutral-400">Current Streak</span>
              </div>
            </div>
          </div>

          {/* Level 1 Progress Bar */}
          <div className="flex flex-col gap-1.5 p-3.5 rounded-2xl bg-[#0F1612] border border-[#1A251E]">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-neutral-300">Level {player.level} Progress</span>
              <span className="text-primary font-bold">{levelProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#18231C] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${levelProgress}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                className="h-full bg-primary rounded-full shadow-[0_0_10px_#00FF66]"
              />
            </div>
            <span className="text-[10px] font-mono text-neutral-500 text-right">
              {Math.max(player.nextLevelXp - player.xp, 0)} XP to Level {player.level + 1}
            </span>
          </div>

          {/* Next Mission Unlocked Banner */}
          {nextMission && !nextMission.isLocked && (
          <div className="p-3.5 rounded-2xl bg-[#101A15] border border-primary/40 flex items-center justify-between shadow-[0_0_15px_rgba(0,255,102,0.2)]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#14251B] text-primary flex items-center justify-center border border-primary/30 shadow-sm">
                <Unlock className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-primary font-semibold uppercase">
                  Next Mission Unlocked
                </span>
                <span className="text-xs font-bold text-white">
                  {nextMission.id} {nextMission.title}
                </span>
                <span className="text-[10px] text-neutral-400">
                  {nextMission.description}
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-primary" />
          </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col gap-2.5 mt-2">
            <button
              onClick={() => navigate(nextMission && !nextMission.isLocked ? `/mission/${nextMission.id}` : '/home')}
              className="w-full py-3.5 px-6 rounded-2xl bg-primary hover:bg-primary-hover text-[#040D07] font-bold text-xs font-mono tracking-wide transition-all shadow-[0_0_25px_rgba(0,255,102,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span>{nextMission && !nextMission.isLocked ? 'Continue to Next Mission' : 'Return to Learning Map'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('/home')}
              className="w-full py-3 px-6 rounded-2xl bg-[#111713] hover:bg-[#161F1A] border border-[#1E2A22] text-neutral-300 hover:text-white font-medium text-xs font-mono flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
              <span>Back to Map</span>
            </button>
          </div>
        </motion.div>

        {/* Right Column: Path Unlock Map Showcase (7 cols) matching Reference Image 5 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-7 rounded-3xl bg-[#090E0B] border border-[#18231C] overflow-hidden shadow-2xl relative"
        >
          {/* Pristine Master Artwork for Foundations Unlock Map */}
          <div className="relative w-full aspect-[950/900] overflow-hidden">
            <img
              src={rewardMapAsset}
              alt="Chapter 1 Foundations Unlocked Map"
              className="w-full h-full object-cover select-none pointer-events-none"
            />

            {/* Glowing animated pulse ring over Node 1.2 (Type Quest Unlocked) */}
            <motion.div
              className="absolute rounded-full border-2 border-cyan-400 pointer-events-none"
              style={{
                left: '46%',
                top: '32%',
                width: '18%',
                height: '18%',
              }}
              animate={{
                scale: [1, 1.25, 1],
                opacity: [0.3, 0.9, 0.3],
                boxShadow: [
                  '0 0 10px rgba(56,189,248,0.4)',
                  '0 0 30px rgba(56,189,248,0.8)',
                  '0 0 10px rgba(56,189,248,0.4)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Interactive click zone over Node 1.2 */}
            <button
              onClick={() => navigate(nextMission && !nextMission.isLocked ? `/mission/${nextMission.id}` : '/home')}
              title={nextMission && !nextMission.isLocked ? `Start ${nextMission.title}` : 'Return to the learning map'}
              className="absolute cursor-pointer rounded-2xl hover:bg-cyan-500/10 transition-colors"
              style={{
                left: '44%',
                top: '30%',
                width: '22%',
                height: '24%',
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
