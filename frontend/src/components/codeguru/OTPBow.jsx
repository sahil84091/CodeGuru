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
        {/* Loaded Digit in glowing energy arrow node */}
        <div className="relative -mb-6 z-20">
          {selectedDigit !== null ? (
            <motion.div
              key={selectedDigit}
              initial={{ scale: 0.4, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="w-12 h-12 rounded-full bg-[#08120D] border-2 border-primary shadow-[0_0_20px_#00FF66] flex items-center justify-center text-primary font-mono text-xl font-bold"
            >
              {selectedDigit}
            </motion.div>
          ) : (
            <div className="w-9 h-9 rounded-full border border-dashed border-neutral-700/60 flex items-center justify-center text-neutral-600 text-xs font-mono">
              +
            </div>
          )}
        </div>

        <Suspense fallback={<div className="absolute inset-0 animate-pulse bg-gradient-to-b from-transparent via-primary/5 to-transparent" />}>
          <BowScene3D aimingSlot={aimingSlot} drawAmount={drawAmount} />
        </Suspense>
      </motion.div>
      {isDrawing && <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-primary/30 bg-[#06100d]/80 px-3 py-1 text-[10px] text-primary">{Math.round(drawAmount * 100)}% draw</div>}
    </div>
  )
}
