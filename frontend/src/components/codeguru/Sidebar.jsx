import { NavLink, useLocation } from 'react-router-dom'
import { 
  Home, 
  BookOpen, 
  Code2, 
  Trophy, 
  BarChart3, 
  Users, 
  User
} from 'lucide-react'
import CodeGuruLogo from './CodeGuruLogo'
import robotCard from '../../assets/companion_bot_card.png'

export default function Sidebar() {
  const location = useLocation()

  const activeLabel = location.pathname === '/home'
    ? (location.hash === '#progress' ? 'Progress' : 'Home')
    : location.pathname.startsWith('/mission')
      ? 'Learn'
      : location.pathname.startsWith('/challenge')
        ? 'Practice'
        : location.pathname === '/leaderboard'
          ? (new URLSearchParams(location.search).get('tab') === 'friends' ? 'Community' : 'Compete')
          : location.pathname === '/profile'
            ? 'Profile'
            : null

  const navItems = [
    { label: 'Home', path: '/home', icon: Home },
    { label: 'Learn', path: '/mission/1.1', icon: BookOpen, matchPrefix: '/mission' },
    { label: 'Practice', path: '/challenge/1.1', icon: Code2, matchPrefix: '/challenge' },
    { label: 'Compete', path: '/leaderboard', icon: Trophy },
    { label: 'Progress', path: '/home#progress', icon: BarChart3 },
    { label: 'Community', path: '/leaderboard?tab=friends', icon: Users },
    { label: 'Profile', path: '/profile', icon: User },
  ]

  const isActive = (item) => item.label === activeLabel

  return (
    <>
    <aside className="hidden md:flex w-64 flex-shrink-0 bg-[#0B0E0D] border-r border-[#19221D] flex-col justify-between p-5 min-h-screen select-none sticky top-0 z-30">
      <div className="flex flex-col gap-8">
        {/* Brand Header */}
        <div className="px-2 pt-1">
          <CodeGuruLogo size="md" />
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5" aria-label="Main Navigation">
          {navItems.map((item, idx) => {
            const Icon = item.icon
            const active = isActive(item)

            return (
              <NavLink
                key={`${item.label}-${idx}`}
                to={item.path}
                aria-current={active ? 'page' : undefined}
                className={`group flex items-center gap-3.5 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  active
                    ? 'bg-[#15231C] text-primary border border-primary/20 shadow-[0_0_15px_rgba(0,255,102,0.15)]'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#121714] border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${active ? 'text-primary' : 'text-neutral-400 group-hover:text-neutral-300'}`} />
                <span>{item.label}</span>
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#00FF66]" />
                )}
              </NavLink>
            )
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-5 pt-6 border-t border-[#17201B]">
        {/* Subtle Motivational Tagline */}
        <div className="px-2">
          <p className="text-[12px] italic text-neutral-500 font-sans tracking-wide">
            "Discipline today builds a better tomorrow."
          </p>
        </div>

        {/* Bot Companion Card */}
        <div className="rounded-2xl overflow-hidden border border-[#1E2922] hover:border-primary/40 transition-colors shadow-sm cursor-pointer">
          <img 
            src={robotCard} 
            alt="Keep going! You're doing great." 
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </aside>
    <nav aria-label="Main navigation" className="md:hidden fixed bottom-0 inset-x-0 z-40 grid grid-cols-4 border-t border-[#1B2821] bg-[#0A0D0C]/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      {[
        { label: 'Home', path: '/home', icon: Home },
        { label: 'Learn', path: '/mission/1.1', icon: BookOpen, matchPrefix: '/mission' },
        { label: 'Rank', path: '/leaderboard', icon: Trophy },
        { label: 'Profile', path: '/profile', icon: User },
      ].map((item) => {
        const Icon = item.icon
        const activeLabel = location.pathname === '/home'
          ? (location.hash === '#progress' ? 'Progress' : 'Home')
          : location.pathname.startsWith('/mission')
            ? 'Learn'
            : location.pathname === '/leaderboard'
              ? (new URLSearchParams(location.search).get('tab') === 'friends' ? 'Community' : 'Compete')
              : location.pathname === '/profile'
                ? 'Profile'
                : null
        const active = item.label === 'Rank'
          ? ['Compete', 'Community'].includes(activeLabel)
          : item.label === activeLabel
        return (
          <NavLink key={item.label} to={item.path} aria-current={active ? 'page' : undefined} className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[10px] font-medium ${active ? 'text-primary' : 'text-neutral-400'}`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
            <span>{item.label}</span>
          </NavLink>
        )
      })}
    </nav>
    </>
  )
}
