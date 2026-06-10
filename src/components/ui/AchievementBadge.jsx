import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock } from 'lucide-react'

const CONFETTI = ['#5BB5A2', '#F5C842', '#E8916A', '#9B8BF4', '#7FCBB9']

export default function AchievementBadge({ achievement, onLockedClick }) {
  const [burst, setBurst] = useState(0)
  const { unlocked, from, to, icon, label, points } = achievement

  const handle = () => {
    if (unlocked) setBurst((b) => b + 1)
    else onLockedClick?.(achievement)
  }

  return (
    <button onClick={handle} className="relative flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: 64, height: 72 }}>
        {/* 慶祝粒子 */}
        <AnimatePresence>
          {burst > 0 &&
            Array.from({ length: 12 }).map((_, i) => {
              const ang = (i / 12) * 2 * Math.PI
              const dist = 32 + (i % 3) * 8
              return (
                <motion.div
                  key={`${burst}-${i}`}
                  className="absolute left-1/2 top-1/2"
                  style={{ width: 6, height: 6, borderRadius: 1, background: CONFETTI[i % CONFETTI.length] }}
                  initial={{ x: -3, y: -3, opacity: 1, rotate: 0 }}
                  animate={{ x: Math.cos(ang) * dist, y: Math.sin(ang) * dist, opacity: 0, rotate: 360 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              )
            })}
        </AnimatePresence>

        {/* 六角徽章 */}
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            background: unlocked ? `linear-gradient(135deg, ${from}, ${to})` : '#F5F5F5',
            border: unlocked ? 'none' : '2px solid #E0E0E0',
            boxShadow: unlocked ? `0 4px 12px ${from}55` : 'none',
          }}
        >
          <span
            className="text-2xl"
            style={{ opacity: unlocked ? 1 : 0.4, filter: unlocked ? 'none' : 'grayscale(1)' }}
          >
            {icon}
          </span>
        </div>

        {/* 鎖頭 */}
        {!unlocked && (
          <div
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white flex items-center justify-center"
            style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
          >
            <Lock size={11} color="#BBBBBB" />
          </div>
        )}
      </div>

      <span
        className="text-[11px] font-medium text-center leading-tight"
        style={{ color: unlocked ? '#2C2C2C' : '#BBBBBB' }}
      >
        {label}
      </span>
      <span className="text-[11px]" style={{ color: unlocked ? '#5BB5A2' : '#CCCCCC' }}>
        {points} 點
      </span>
    </button>
  )
}
