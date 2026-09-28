import { useEffect, useState } from 'react'
import { Search, Flame, Bell, ChevronDown } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCodeGuruStore } from '../../store/useCodeGuruStore'

export default function TopNav() {
  const { player, missions } = useCodeGuruStore()
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const destinations = [
    { label: 'Learning map', detail: 'Browse your coding journey', path: '/home' },
    ...missions.filter((mission) => !mission.isLocked).map((mission) => ({
      label: mission.title,
      detail: `Mission ${mission.id} · ${mission.chapterTitle}`,
      path: `/mission/${mission.id}`,
    })),
    { label: 'Player profile', detail: 'Skills, progress, and achievements', path: '/profile' },
    { label: 'Leaderboard', detail: 'See this week’s rankings', path: '/leaderboard' },
  ]
  const filteredDestinations = destinations.filter((item) =>
    `${item.label} ${item.detail}`.toLowerCase().includes(query.toLowerCase()),
  )

  useEffect(() => {
    const handleShortcut = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
      if (event.key === 'Escape') {
        setSearchOpen(false)
        setNotificationsOpen(false)
      }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  return (
    <header className="h-16 px-4 md:px-8 border-b border-[#18211C] bg-[#0A0D0C]/90 backdrop-blur-md flex items-center justify-between gap-3 sticky top-0 z-20">
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <button
          onClick={() => setSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#111613] border border-[#1C2520] hover:border-[#2B3931] text-neutral-400 hover:text-neutral-300 text-xs transition-colors group text-left"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-neutral-500 group-hover:text-primary transition-colors" />
            <span className="sm:hidden">Search…</span>
            <span className="hidden sm:inline">Search topics, problems, or skills...</span>
          </div>
          <kbd className="hidden sm:inline px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#161D19] border border-[#222E27] text-neutral-400">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Right User Stats & Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Streak Indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#16140E] border border-[#3A2B12] text-amber-400 text-xs font-semibold shadow-sm">
          <Flame className="w-4 h-4 fill-amber-400 text-amber-500 animate-pulse" />
          <span>{player.streak}</span>
        </div>

        {/* Notifications */}
        <div className="relative">
        <button 
          aria-label="Notifications"
          aria-expanded={notificationsOpen}
          onClick={() => setNotificationsOpen((open) => !open)}
          className="relative p-2 rounded-xl bg-[#111613] border border-[#1C2520] hover:border-neutral-700 text-neutral-400 hover:text-white transition-colors"
        >
          <Bell className="w-4 h-4" />
        </button>
        {notificationsOpen && (
          <div className="absolute right-0 top-12 z-40 w-64 rounded-2xl border border-[#243229] bg-[#0E1411] p-4 shadow-2xl" role="status">
            <p className="text-sm font-semibold text-white">You’re all caught up</p>
            <p className="mt-1 text-xs text-neutral-400">New mission updates will appear here.</p>
          </div>
        )}
        </div>

        {/* User Profile Pill */}
        <Link
          to="/profile"
          className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-xl bg-[#111613] border border-[#1C2520] hover:border-[#2C3B32] transition-colors group"
        >
          <div className="w-7 h-7 rounded-lg bg-[#182B21] border border-primary/30 text-primary font-bold text-xs flex items-center justify-center group-hover:border-primary transition-colors">
            {player.avatar || 'G'}
          </div>
          <span className="hidden sm:inline text-xs font-medium text-neutral-200 group-hover:text-white">
            {player.name || 'Gurjant'}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300 transition-colors" />
        </Link>
      </div>
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-sm" onMouseDown={(event) => event.target === event.currentTarget && setSearchOpen(false)}>
          <section role="dialog" aria-modal="true" aria-label="Search CodeGuru" className="w-full max-w-xl overflow-hidden rounded-2xl border border-[#29372E] bg-[#0D1310] shadow-2xl">
            <div className="flex items-center gap-3 border-b border-[#1D2821] px-4">
              <Search className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search missions, topics, or pages…" className="h-14 w-full bg-transparent text-sm text-white outline-none placeholder:text-neutral-500" aria-label="Search missions, topics, or pages" />
              <button onClick={() => setSearchOpen(false)} className="rounded-md border border-[#29372E] px-2 py-1 text-[10px] text-neutral-400">Esc</button>
            </div>
            <div className="max-h-72 overflow-y-auto p-2">
              {filteredDestinations.length ? filteredDestinations.map((item) => (
                <button key={item.path} onClick={() => { setSearchOpen(false); setQuery(''); navigate(item.path) }} className="flex w-full flex-col rounded-xl px-3 py-2.5 text-left hover:bg-[#17211B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
                  <span className="text-sm font-medium text-neutral-100">{item.label}</span>
                  <span className="text-xs text-neutral-500">{item.detail}</span>
                </button>
              )) : <p className="px-3 py-6 text-center text-sm text-neutral-500">No matching destinations.</p>}
            </div>
          </section>
        </div>
      )}
    </header>
  )
}
