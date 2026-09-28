import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { 
  GraduationCap, 
  Flame, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Code, 
  Binary, 
  FunctionSquare
} from 'lucide-react'
import LearningMap from '../components/codeguru/LearningMap'
import { useCodeGuruStore } from '../store/useCodeGuruStore'
import { leaderboardData } from '../data/mockData'

export default function HomePage() {
  const navigate = useNavigate()
  const { player, mapNodes } = useCodeGuruStore()
  const foundationProgress = mapNodes?.[0]?.progress || '0 / 12 Lessons'
  const [completedLessons, lessonTotal] = foundationProgress.match(/\d+/g)?.map(Number) || [0, 12]
  const lessonProgress = lessonTotal ? completedLessons / lessonTotal : 0
  const levelProgress = lessonProgress

  const recommendedCards = [
    {
      title: 'Variables and Data Types',
      subtitle: 'Build your foundation',
      time: '12 min',
      difficulty: 'Beginner',
      icon: Code,
      path: '/mission/1.1',
    },
    {
      title: 'Arrays',
      subtitle: 'Practice with examples',
      time: '18 min',
      difficulty: 'Beginner',
      icon: Binary,
      path: '/mission/1.1',
    },
    {
      title: 'Functions',
      subtitle: 'Level up your logic',
      time: '20 min',
      difficulty: 'Beginner',
      icon: FunctionSquare,
      path: '/mission/1.1',
    },
  ]

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-white flex items-center gap-2">
            <span>Welcome back, {player.name}!</span>
            <span>👋</span>
          </h1>
          <p className="text-xs md:text-sm text-neutral-400 font-sans mt-0.5">
            Same Student. Different Mindset.
          </p>
        </div>

        <div className="hidden md:block text-right">
          <p className="text-xs italic text-neutral-400 font-sans max-w-xs">
            "A little progress each day adds up to big results."
          </p>
        </div>
      </div>

      {/* Main Grid: Left Stage (Map & Recommended) + Right Stage (Dashboard Stats) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Learning Map & Recommended */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Interactive World Learning Map */}
          <LearningMap />

          {/* Recommended for You Row */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-base text-white">
                Recommended for You
              </h2>
              <Link 
                to="/mission/1.1" 
                className="text-xs text-primary hover:underline font-mono flex items-center gap-1"
              >
                <span>See All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {recommendedCards.map((rec, idx) => {
                const Icon = rec.icon

                return (
                  <motion.div
                    key={idx}
                    whileHover={{ y: -3 }}
                    onClick={() => navigate(rec.path)}
                    className="p-4 rounded-2xl bg-[#0E1411] border border-[#1A251F] hover:border-primary/40 transition-all cursor-pointer flex items-center justify-between group shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#142019] text-primary flex items-center justify-center border border-primary/20 group-hover:border-primary transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-heading font-bold text-xs text-white group-hover:text-primary transition-colors">
                          {rec.title}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          {rec.subtitle}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-500 mt-1">
                          {rec.time} • {rec.difficulty}
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-neutral-600 group-hover:text-primary transition-all group-hover:translate-x-1" />
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Player Dashboard Widgets */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* 1. Your Progress Card */}
          <div id="progress" className="p-5 rounded-2xl bg-[#0E1411] border border-[#1B2620] flex flex-col gap-4 shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-sm text-white">Your Progress</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#16231B] text-primary border border-primary/30">
                Level {player.level}
              </span>
            </div>

            <div className="flex items-center gap-4">
              {/* Circular Gauge */}
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="#1A251F"
                    strokeWidth="5"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="#00FF66"
                    strokeWidth="5"
                    strokeDasharray={2 * Math.PI * 26}
                    strokeDashoffset={2 * Math.PI * 26 * (1 - levelProgress)}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <GraduationCap className="w-6 h-6 text-primary absolute" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold font-mono text-white">{completedLessons} / {lessonTotal}</span>
                  <span className="text-xs text-neutral-400 font-mono">Lessons</span>
                </div>
                {/* Horizontal mini bar */}
                <div className="w-32 h-1.5 rounded-full bg-[#1A251F] mt-1 overflow-hidden">
                  <div className="h-full bg-primary rounded-full shadow-[0_0_8px_#00FF66]" style={{ width: `${lessonProgress * 100}%` }} />
                </div>
                <span className="text-[10px] text-neutral-500 font-mono mt-1">{Math.round(lessonProgress * 100)}% complete</span>
              </div>
            </div>

            <p className="text-[11px] text-neutral-400 font-sans border-t border-[#16201A] pt-2">
              Keep going! You're on the right path.
            </p>
          </div>

          {/* 2. Daily Quest Widget */}
          <div className="p-5 rounded-2xl bg-[#0E1411] border border-[#1B2620] flex flex-col gap-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-sm text-white">Daily Quest</span>
              <span className="text-xs font-mono text-neutral-400">
                {player.dailyQuests.filter((q) => q.done).length} / {player.dailyQuests.length}
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {player.dailyQuests.map((quest) => (
                <div
                  key={quest.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#121A15] border border-[#1E2B23]"
                >
                  <div className="flex items-center gap-2.5">
                    {quest.done ? (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    ) : (
                      <Circle className="w-4 h-4 text-neutral-600" />
                    )}
                    <span className={`text-xs ${quest.done ? 'text-neutral-300' : 'text-neutral-400'}`}>
                      {quest.title}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-primary font-semibold">
                    +{quest.xp} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Streak Widget */}
          <div className="p-5 rounded-2xl bg-[#0E1411] border border-[#1B2620] flex flex-col gap-3 shadow-md">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-400 animate-pulse" />
              <span className="font-heading font-bold text-sm text-white">
                {player.streak} Day Streak
              </span>
            </div>

            {/* Week days dot display */}
            <div className="flex items-center justify-between pt-1">
              {player.weekStreakDays.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-1.5">
                  <span className="text-[10px] font-mono text-neutral-500">{item.day}</span>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      item.active
                        ? 'bg-primary text-[#040D07] font-bold shadow-[0_0_8px_#00FF66]'
                        : 'border border-[#223127] bg-[#121A15] text-neutral-600'
                    }`}
                  >
                    {item.active && '✓'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Quote Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#121E17] to-[#0D1511] border border-primary/20 text-xs italic text-neutral-300 font-sans shadow-sm">
            "Code your curiosity into opportunity."
          </div>

          {/* 5. Top Learners (This Week) */}
          <div className="p-5 rounded-2xl bg-[#0E1411] border border-[#1B2620] flex flex-col gap-3 shadow-md">
            <div className="flex items-center justify-between">
              <span className="font-heading font-bold text-sm text-white">Top Learners <span className="text-xs font-normal text-neutral-400 font-sans">(This Week)</span></span>
              <Link to="/leaderboard" className="text-xs text-primary hover:underline font-mono">
                View All
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              {leaderboardData.slice(0, 4).map((entry) => {
                const isUser = entry.isCurrentUser

                return (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-colors ${
                      isUser
                        ? 'bg-[#15271E] border-primary/40 text-primary shadow-[0_0_12px_rgba(0,255,102,0.15)]'
                        : 'bg-[#121915] border-[#1C2821] text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-5 text-center font-mono font-bold text-xs ${
                        entry.rank === 1 ? 'text-amber-400' : entry.rank === 2 ? 'text-slate-300' : entry.rank === 3 ? 'text-amber-600' : 'text-neutral-400'
                      }`}>
                        {entry.rank}
                      </span>
                      <div className="w-6 h-6 rounded-full bg-[#18231C] border border-[#2B3A30] text-xs font-bold flex items-center justify-center text-white">
                        {entry.avatar}
                      </div>
                      <span className="text-xs font-medium">
                        {entry.name} {isUser && '(You)'}
                      </span>
                    </div>

                    <span className="text-xs font-mono font-semibold">
                      {entry.xp.toLocaleString()} XP
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
