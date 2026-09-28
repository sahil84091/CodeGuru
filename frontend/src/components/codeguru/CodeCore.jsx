import { motion } from 'motion/react'
import { Code, Sparkles } from 'lucide-react'

export default function CodeCore({ digitCount = 0, maxDigits = 10 }) {
  const activationRatio = Math.min(digitCount / maxDigits, 1)

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center select-none">
      {/* Outer ambient glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/10 blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.3 + activationRatio * 0.4, 0.5 + activationRatio * 0.5, 0.3 + activationRatio * 0.4],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Outer rotating circuit ring */}
      <motion.div
        className="absolute inset-4 rounded-full border border-dashed border-primary/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 35, repeat: Infinity, ease: 'linear' }}
      />

      {/* Secondary reverse rotating ring */}
      <motion.div
        className="absolute inset-10 rounded-full border border-[#1E2922]"
        style={{
          borderColor: activationRatio > 0 ? 'rgba(0, 255, 102, 0.4)' : 'rgba(30, 41, 34, 0.6)',
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
      />

      {/* Orbiting energy nodes corresponding to typed digits */}
      {Array.from({ length: 10 }).map((_, index) => {
        const isLit = index < digitCount
        const angle = (index / 10) * 2 * Math.PI
        const radius = 110 // distance from center in px
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius

        return (
          <motion.div
            key={index}
            className={`absolute w-3.5 h-3.5 rounded-full flex items-center justify-center transition-all duration-500 ${
              isLit
                ? 'bg-primary shadow-[0_0_12px_#00FF66] scale-110'
                : 'bg-[#151D19] border border-[#233028] scale-75'
            }`}
            style={{
              left: `calc(50% + ${x}px - 7px)`,
              top: `calc(50% + ${y}px - 7px)`,
            }}
            animate={
              isLit
                ? {
                    scale: [1.1, 1.35, 1.1],
                  }
                : {}
            }
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.15 }}
          >
            {isLit && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
          </motion.div>
        )
      })}

      {/* The Central Code Core Cube */}
      <motion.div
        className="relative z-10 w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-gradient-to-br from-[#121915] via-[#0E1411] to-[#0A0D0C] border flex flex-col items-center justify-center shadow-2xl transition-colors duration-500"
        style={{
          borderColor: activationRatio > 0 ? '#00FF66' : '#1C2721',
          boxShadow: activationRatio > 0 
            ? `0 0 ${20 + activationRatio * 40}px rgba(0, 255, 102, ${0.2 + activationRatio * 0.3})`
            : '0 10px 30px rgba(0, 0, 0, 0.8)',
        }}
        animate={{
          y: [-4, 4, -4],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="relative">
          <Code 
            className="w-10 h-10 transition-colors duration-500"
            style={{ color: activationRatio > 0 ? '#00FF66' : '#4B5563' }}
          />
          {activationRatio >= 1 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 text-primary"
            >
              <Sparkles className="w-5 h-5 fill-primary text-primary animate-spin" style={{ animationDuration: '8s' }} />
            </motion.div>
          )}
        </div>

        <span className="text-[10px] font-mono tracking-widest uppercase mt-2 text-neutral-400">
          {digitCount === 0 ? 'Core Dormant' : `${Math.round(activationRatio * 100)}% Active`}
        </span>
      </motion.div>
    </div>
  )
}
