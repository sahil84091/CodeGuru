import { GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CodeGuruLogo({ size = 'md', linkTo = '/home', showTagline = false }) {
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  return (
    <Link to={linkTo} className="flex items-center gap-2.5 group select-none transition-transform hover:scale-[1.01]">
      <div className="relative flex items-center justify-center p-2 rounded-xl bg-surface border border-surface-border group-hover:border-primary/50 transition-colors shadow-sm">
        <GraduationCap className={`${iconSizes[size]} text-primary transition-transform group-hover:rotate-[-4deg]`} />
        <div className="absolute inset-0 rounded-xl bg-primary/10 blur-sm pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
      </div>
      <div className="flex flex-col">
        <span className={`font-heading font-bold tracking-tight text-white ${textSizes[size]}`}>
          Code<span className="text-primary">Guru</span>
        </span>
        {showTagline && (
          <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-mono -mt-1">
            Learning Realm
          </span>
        )}
      </div>
    </Link>
  )
}
