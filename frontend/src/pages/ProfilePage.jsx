import { 
  Flame, 
  Zap, 
  Target, 
  Clock, 
  CheckCircle2, 
  Trophy, 
  Award, 
  Code, 
  Bug, 
} from 'lucide-react'
import { useCodeGuruStore } from '../store/useCodeGuruStore'

export default function ProfilePage() {
  const { player } = useCodeGuruStore()

  const achievementIcons = {
    zap: Zap,
    bug: Bug,
    flame: Flame,
    code: Code,
    award: Award,
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto">
      {/* Profile Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#0D1310] border border-[#1A261F] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5 z-10">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#16271D] to-[#0E1712] border-2 border-primary shadow-[0_0_20px_rgba(0,255,102,0.3)] flex items-center justify-center text-primary font-bold text-3xl font-heading">
            {player.avatar || 'G'}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-white">
                {player.fullName || 'Gurjant Singh'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#15241C] text-primary border border-primary/30 text-xs font-mono">
                Level {player.level}
              </span>
            </div>
            <span className="text-xs font-mono text-neutral-400 mt-0.5">
              {player.handle || '@gurjant'} • Primary Track: <span className="text-primary font-semibold">{player.selectedLanguage}</span>
            </span>
            <div className="flex items-center gap-3 mt-3 text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Flame className="w-4 h-4 fill-current" />
                <span>{player.streak} Day Streak</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-primary">
                <Zap className="w-4 h-4" />
                <span>{player.xp.toLocaleString()} Total XP</span>
              </span>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="w-full md:w-64 p-4 rounded-2xl bg-[#111713] border border-[#1E2B22] flex flex-col gap-2 z-10">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-neutral-400">Progress to Level {player.level + 1}</span>
            <span className="text-primary font-bold">
              {Math.round((player.xp / player.nextLevelXp) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-[#18231C] overflow-hidden">
            <div
              className="h-full bg-primary rounded-full shadow-[0_0_8px_#00FF66]"
              style={{ width: `${Math.min((player.xp / player.nextLevelXp) * 100, 100)}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-neutral-500 text-right">
            {player.nextLevelXp - player.xp} XP remaining
          </span>
        </div>
      </div>

      {/* Core Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0E1411] border border-[#1A251F] flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <Target className="w-4 h-4 text-primary" />
            <span>Coding Accuracy</span>
          </div>
          <span className="text-2xl font-mono font-extrabold text-white mt-1">
            {player.accuracy}%
          </span>
          <span className="text-[10px] text-neutral-500 font-mono">Across all test runs</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0E1411] border border-[#1A251F] flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <span>Problems Solved</span>
          </div>
          <span className="text-2xl font-mono font-extrabold text-white mt-1">
            {player.solvedCount}
          </span>
          <span className="text-[10px] text-neutral-500 font-mono">Verified solutions</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0E1411] border border-[#1A251F] flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <Clock className="w-4 h-4 text-primary" />
            <span>Hours Learned</span>
          </div>
          <span className="text-2xl font-mono font-extrabold text-white mt-1">
            {player.timeSpentHours}h
          </span>
          <span className="text-[10px] text-neutral-500 font-mono">Active workspace time</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#0E1411] border border-[#1A251F] flex flex-col gap-1">
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Global Rank</span>
          </div>
          <span className="text-2xl font-mono font-extrabold text-amber-400 mt-1">
            #4
          </span>
          <span className="text-[10px] text-neutral-500 font-mono">Top 5% of all students</span>
        </div>
      </div>

      {/* Main Grid: Skills Matrix + Verified Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Skills Matrix (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0E1411] border border-[#1A251F] flex flex-col gap-4 shadow-md">
          <h2 className="font-heading font-bold text-base text-white">
            Skill Proficiencies
          </h2>

          <div className="flex flex-col gap-4">
            {player.skills.map((skill, idx) => (
              <div key={idx} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-neutral-200 font-semibold">{skill.name}</span>
                  <span className="text-primary">Level {skill.level}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#18231C] overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#0E1411] border border-[#1A251F] flex flex-col gap-4 shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-base text-white">
              Accomplishments & Badges
            </h2>
            <span className="text-xs font-mono text-primary">
              {player.achievements.filter((a) => a.unlocked).length} / {player.achievements.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {player.achievements.map((ach) => {
              const Icon = achievementIcons[ach.icon] || Award

              return (
                <div
                  key={ach.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                    ach.unlocked
                      ? 'bg-[#121B16] border-primary/30 text-white shadow-sm'
                      : 'bg-[#0B0F0D] border-[#18221C] text-neutral-500 opacity-60'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      ach.unlocked
                        ? 'bg-primary text-[#040D07] shadow-[0_0_10px_#00FF66]'
                        : 'bg-[#131915] text-neutral-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-heading font-bold text-xs">
                      {ach.title}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-sans mt-0.5">
                      {ach.desc}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
