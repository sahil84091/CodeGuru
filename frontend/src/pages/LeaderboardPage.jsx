import { useSearchParams } from 'react-router-dom'
import { Trophy } from 'lucide-react'
import { leaderboardData } from '../data/mockData'

export default function LeaderboardPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = ['global', 'friends'].includes(searchParams.get('tab')) ? searchParams.get('tab') : 'weekly'

  const demoFriendNames = new Set(['Priya', 'Kabir', 'Rohan'])
  const visiblePlayers = activeTab === 'friends'
    ? leaderboardData
        .filter((player) => player.isCurrentUser || demoFriendNames.has(player.name))
        .map((player, index) => ({ ...player, rank: index + 1 }))
    : activeTab === 'weekly'
      ? leaderboardData.slice(0, 5)
      : leaderboardData
  const topThree = visiblePlayers.slice(0, 3)

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-white flex items-center gap-2.5">
            <Trophy className="w-7 h-7 text-amber-400" />
            <span>Realm Leaderboard</span>
          </h1>
          <p className="text-xs text-neutral-400 font-sans mt-0.5">
            {activeTab === 'friends' ? 'See how you rank among your friends.' : activeTab === 'global' ? 'Compare your progress with learners across CodeGuru.' : 'Compete with students globally and climb the weekly ranks.'}
          </p>
        </div>

        {/* Filter Tabs */}
        <div role="tablist" aria-label="Leaderboard view" className="flex items-center p-1 rounded-2xl bg-[#0E1511] border border-[#1C2820]">
          {[
            { id: 'weekly', label: 'Weekly' },
            { id: 'global', label: 'Global' },
            { id: 'friends', label: 'Friends' },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setSearchParams(tab.id === 'weekly' ? {} : { tab: tab.id })}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-primary text-[#040D07] font-bold shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Rank 2 (Silver) */}
        {topThree[1] && (
          <div className="p-5 rounded-3xl bg-[#0E1411] border border-[#1E2922] flex flex-col items-center text-center gap-3 order-2 md:order-1 shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-[#141C17] border border-slate-400 text-slate-300 font-bold text-xl flex items-center justify-center shadow-[0_0_15px_rgba(203,213,225,0.2)]">
              {topThree[1].avatar}
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-base text-white">{topThree[1].name}</span>
              <span className="text-xs font-mono text-slate-400">Rank #2 • Silver</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#131A15] border border-[#233128] text-xs font-mono font-bold text-primary">
              {topThree[1].xp.toLocaleString()} XP
            </span>
          </div>
        )}

        {/* Rank 1 (Gold) */}
        {topThree[0] && (
          <div className="p-6 rounded-3xl bg-gradient-to-b from-[#16251C] to-[#0F1813] border-2 border-amber-500/50 flex flex-col items-center text-center gap-3 order-1 md:order-2 shadow-2xl relative">
            <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-amber-500 text-[#080B09] font-mono font-bold text-[10px] tracking-wider uppercase shadow-md">
              👑 Champion
            </div>
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border-2 border-amber-400 text-amber-400 font-bold text-2xl flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              {topThree[0].avatar}
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-lg text-white">{topThree[0].name}</span>
              <span className="text-xs font-mono text-amber-400 font-semibold">Rank #1 • Gold Master</span>
            </div>
            <span className="px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/40 text-xs font-mono font-bold text-amber-400">
              {topThree[0].xp.toLocaleString()} XP
            </span>
          </div>
        )}

        {/* Rank 3 (Bronze) */}
        {topThree[2] && (
          <div className="p-5 rounded-3xl bg-[#0E1411] border border-[#1E2922] flex flex-col items-center text-center gap-3 order-3 md:order-3 shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-[#141C17] border border-amber-700 text-amber-600 font-bold text-xl flex items-center justify-center shadow-[0_0_15px_rgba(180,83,9,0.2)]">
              {topThree[2].avatar}
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-base text-white">{topThree[2].name}</span>
              <span className="text-xs font-mono text-amber-600">Rank #3 • Bronze</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#131A15] border border-[#233128] text-xs font-mono font-bold text-primary">
              {topThree[2].xp.toLocaleString()} XP
            </span>
          </div>
        )}
      </div>

      {/* Main Table */}
      <div role="tabpanel" aria-label={`${activeTab} leaderboard`} className="rounded-3xl bg-[#0D1410] border border-[#1A261F] overflow-hidden shadow-xl">
        <div className="p-4 px-6 border-b border-[#18231C] flex items-center justify-between text-xs font-mono uppercase tracking-wider text-neutral-400">
          <div className="flex items-center gap-8">
            <span className="w-8 text-center">Rank</span>
            <span>Player</span>
          </div>
          <div className="flex items-center gap-12">
            <span className="hidden sm:inline">Level</span>
            <span className="w-24 text-right">XP Earned</span>
          </div>
        </div>

        <div className="flex flex-col divide-y divide-[#151F19]">
          {visiblePlayers.map((player) => {
            const isUser = player.isCurrentUser

            return (
              <div
                key={player.rank}
                className={`p-4 px-6 flex items-center justify-between transition-colors ${
                  isUser
                    ? 'bg-[#15261D] border-l-4 border-l-primary text-white shadow-inner'
                    : 'hover:bg-[#101713] text-neutral-300'
                }`}
              >
                <div className="flex items-center gap-8">
                  {/* Rank number badge */}
                  <span
                    className={`w-8 text-center font-mono font-bold text-sm ${
                      player.rank === 1
                        ? 'text-amber-400'
                        : player.rank === 2
                        ? 'text-slate-300'
                        : player.rank === 3
                        ? 'text-amber-600'
                        : isUser
                        ? 'text-primary'
                        : 'text-neutral-500'
                    }`}
                  >
                    #{player.rank}
                  </span>

                  {/* Player Name & Avatar */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isUser
                          ? 'bg-primary text-[#040D07]'
                          : 'bg-[#141C17] border border-[#202E24] text-neutral-200'
                      }`}
                    >
                      {player.avatar}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-heading font-bold text-sm text-white flex items-center gap-2">
                        {player.name}
                        {isUser && (
                          <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-mono">
                            YOU
                          </span>
                        )}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-400">
                        {player.streak} day streak • {player.solved} solved
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-12 font-mono text-xs">
                  <span className="hidden sm:inline px-2.5 py-0.5 rounded-lg bg-[#111A15] border border-[#1E2C22] text-neutral-300">
                    Lvl {player.level}
                  </span>
                  <span
                    className={`w-24 text-right font-bold text-sm ${
                      isUser ? 'text-primary' : 'text-neutral-200'
                    }`}
                  >
                    {player.xp.toLocaleString()} XP
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
