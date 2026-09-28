import { useId } from 'react'
import { motion } from 'motion/react'
import portalArtwork from '../../assets/welcome_portal_art.png'

const stairFaces = [
  { d: 'M 198 516 L 491 529 L 490 557 L 194 543 Z', start: 1, end: 4 },
  { d: 'M 178 563 L 491 578 L 490 615 L 175 598 Z', start: 4, end: 7 },
  { d: 'M 153 611 L 491 630 L 490 674 L 148 653 Z', start: 7, end: 10 },
]

function progressBetween(value, start, end) {
  return Math.max(0, Math.min(1, (value - start) / (end - start)))
}

export default function PortalArtwork({ digitCount = 0, activating = false, className = '' }) {
  const litCount = activating ? 10 : digitCount
  const artworkId = useId().replace(/:/g, '')

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <img
        src={portalArtwork}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[center_76%] opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#070b0c]/55 via-transparent to-[#070b0c]/20" />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 840 840"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <radialGradient id={`${artworkId}-portal-bloom`} cx="50%" cy="72%" r="60%">
            <stop offset="0%" stopColor="#65ffe0" stopOpacity="0.62" />
            <stop offset="58%" stopColor="#00e6a3" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#00e6a3" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${artworkId}-stair-glow`} x1="0" x2="0.25" y1="0" y2="1">
            <stop offset="0%" stopColor="#9ffff0" stopOpacity="0.48" />
            <stop offset="100%" stopColor="#00d99b" stopOpacity="0.08" />
          </linearGradient>
          <filter id={`${artworkId}-portal-soft-glow`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <filter id={`${artworkId}-stair-edge-glow`} x="-30%" y="-50%" width="160%" height="200%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        <motion.ellipse
          cx="420"
          cy="340"
          rx="205"
          ry="255"
          fill={`url(#${artworkId}-portal-bloom)`}
          filter={`url(#${artworkId}-portal-soft-glow)`}
          initial={false}
          animate={{ opacity: activating ? [0.05, 0.9, 0.6] : 0 }}
          transition={{ duration: activating ? 0.9 : 0.35, ease: 'easeOut' }}
        />

        {stairFaces.map((step, index) => {
          const progress = progressBetween(litCount, step.start, step.end)
          const active = progress > 0
          return (
            <g key={step.start}>
              <motion.path
                d={step.d}
                fill={`url(#${artworkId}-stair-glow)`}
                initial={false}
                animate={{ opacity: active ? 0.12 + progress * 0.5 : 0 }}
                transition={{ duration: 0.3, delay: active ? index * 0.06 : 0 }}
              />
              <motion.path
                d={step.d}
                fill="none"
                stroke="#7affdf"
                strokeWidth="5"
                strokeLinejoin="round"
                filter={`url(#${artworkId}-stair-edge-glow)`}
                initial={false}
                animate={{ opacity: active ? 0.16 + progress * 0.72 : 0 }}
                transition={{ duration: 0.34, delay: active ? index * 0.06 : 0 }}
              />
              <motion.path
                d={step.d}
                fill="none"
                stroke="#9affeb"
                strokeWidth="1.7"
                strokeLinejoin="round"
                initial={false}
                animate={{ opacity: active ? 0.24 + progress * 0.76 : 0 }}
                transition={{ duration: 0.34, delay: active ? index * 0.06 : 0 }}
              />
            </g>
          )
        })}

        <motion.path
          d="M 283 505 L 283 259 C 283 164 335 112 420 112 C 505 112 557 164 557 259 L 557 505"
          fill="none"
          stroke="#5dffdc"
          strokeWidth="7"
          strokeLinejoin="round"
          filter={`url(#${artworkId}-portal-soft-glow)`}
          initial={false}
          animate={{ opacity: activating ? [0.05, 1, 0.72] : 0 }}
          transition={{ duration: activating ? 0.85 : 0.3, ease: 'easeOut' }}
        />
      </svg>
      {activating && (
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_48%,rgba(89,255,220,.42),transparent_55%)]"
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: [0.2, 0.95, 0.45], scale: [0.88, 1.1, 1.25] }}
          transition={{ duration: 1.05, ease: 'easeOut' }}
        />
      )}
    </div>
  )
}
