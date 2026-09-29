import { lazy, Suspense, useRef, useState } from 'react'
import { motion } from 'motion/react'
const BowScene3D = lazy(() => import('./BowScene3D'))

export default function OTPBow({ selectedDigit = null, aimingSlot = null, onShoot }) {
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawAmount, setDrawAmount] = useState(0)
  const startY = useRef(0)
  return (
    <div
      role="button"
      tabIndex={selectedDigit === null ? -1 : 0}
      aria-label={selectedDigit === null ? 'Choose a digit to load the bow' : `Loaded digit ${selectedDigit}. Pull the bow down and release to shoot at slot ${aimingSlot + 1}`}
      onPointerDown={(event) => {
        if (selectedDigit === null || aimingSlot < 0) return
        event.preventDefault()
        startY.current = event.clientY
        event.currentTarget.setPointerCapture(event.pointerId)
        setIsDrawing(true)
      }}
      onPointerMove={(event) => {
        if (!isDrawing) return
        setDrawAmount(Math.max(0, Math.min(1, (event.clientY - startY.current) / 100)))
      }}
      onPointerUp={(event) => {
        if (!isDrawing) return
        event.preventDefault()
        const chargedShot = drawAmount >= 0.12
        setIsDrawing(false)
        setDrawAmount(0)
        if (chargedShot) onShoot?.()
      }}
      onPointerCancel={() => { setIsDrawing(false); setDrawAmount(0) }}
      onKeyDown={(event) => { if ((event.key === 'Enter' || event.key === ' ') && selectedDigit !== null) onShoot?.() }}
      className={`relative h-32 w-full max-w-[440px] touch-none select-none sm:h-36 md:h-40 lg:h-48 lg:max-w-lg xl:h-56 xl:max-w-[700px] ${selectedDigit === null ? 'cursor-default' : isDrawing ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      {/* Futuristic Cyber Bow Graphic */}
      <motion.div
        animate={{
          rotate: 0,
          y: selectedDigit !== null ? [-1, 1, -1] : 0,
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 flex flex-col items-center"
      >
        {/* Loaded Digit in glowing energy arrow node / sight */}
        <div className="relative -mb-6 z-20">
          {selectedDigit !== null ? (
            <motion.div
              key={selectedDigit}
              initial={{ scale: 0.4, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#05110a] border-2 border-[#00ff88] shadow-[0_0_25px_rgba(0,255,136,0.7),0_0_10px_rgba(245,158,11,0.3)] flex items-center justify-center text-[#74ffe0] font-mono text-xl sm:text-2xl font-black"
            >
              {/* Outer runic energy halo */}
              <div className="absolute -inset-1.5 rounded-full border border-[#00ff88]/30 pointer-events-none animate-pulse" />
              {/* Sight crosshairs */}
              <div className="absolute top-0 w-1 h-1.5 bg-[#00ff88] -translate-y-0.5 rounded-full" />
              <div className="absolute bottom-0 w-1 h-1.5 bg-[#00ff88] translate-y-0.5 rounded-full" />
              <div className="absolute left-0 h-1 w-1.5 bg-[#00ff88] -translate-x-0.5 rounded-full" />
              <div className="absolute right-0 h-1 w-1.5 bg-[#00ff88] translate-x-0.5 rounded-full" />
              {selectedDigit}
            </motion.div>
          ) : (
            <div className="w-10 h-10 rounded-full border border-dashed border-emerald-900/60 bg-[#06100c]/60 flex items-center justify-center text-emerald-600/70 text-sm font-mono shadow-[inset_0_0_8px_rgba(0,255,136,0.05)]">
              +
            </div>
          )}
        </div>

        <Suspense fallback={<div className="absolute inset-0 animate-pulse bg-gradient-to-b from-transparent via-primary/5 to-transparent" />}>
          <BowScene3D aimingSlot={aimingSlot} drawAmount={drawAmount} />
        </Suspense>
      </motion.div>
      {isDrawing && (
        <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-[#00ff88]/40 bg-[#040e09]/90 px-3.5 py-1 text-[11px] font-mono text-[#00ff88] shadow-[0_0_15px_rgba(0,255,136,0.3)] backdrop-blur-md">
          <div className="h-1.5 w-12 rounded-full bg-emerald-950 overflow-hidden border border-emerald-800/60">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-amber-400 transition-all duration-75"
              style={{ width: `${Math.round(drawAmount * 100)}%` }}
            />
          </div>
          <span>{Math.round(drawAmount * 100)}% DRAW</span>
        </div>
      )}
    </div>
  )
}
