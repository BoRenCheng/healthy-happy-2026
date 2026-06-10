import { motion } from 'framer-motion'
import useCountUp from '../../hooks/useCountUp'

export default function CapsuleProgress({ label, current, goal, color, color2, drop }) {
  const pct = Math.min(100, Math.round((current / goal) * 100))
  const over = current >= goal
  const fillColor = over ? '#E8916A' : color
  const fillTop = over ? '#F5A878' : color2 || color

  const animPct = useCountUp(pct, 1800)
  const animGram = useCountUp(current, 1800)

  const fillDelay = drop ? 0.6 : 0.3

  return (
    <div className="flex flex-col items-center gap-2">
      {/* 膠囊外框（達標會橘色化 + 輕震動） */}
      <motion.div
        className="relative overflow-hidden flex items-end"
        style={{
          width: 56,
          height: 96,
          borderRadius: 28,
          border: `2px solid ${fillColor}`,
          background: 'linear-gradient(180deg, #FFFFFF 0%, #F0FAF8 100%)',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.04)',
        }}
        animate={over ? { x: [0, -2, 2, -2, 2, 0] } : {}}
        transition={over ? { duration: 0.4, delay: 1.9 } : {}}
      >
        {/* 注入水滴 */}
        {drop && (
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 text-base z-10"
            initial={{ top: -18, opacity: 0 }}
            animate={{ top: [-18, 66], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 0.6, ease: 'easeIn' }}
          >
            💧
          </motion.div>
        )}

        {/* 填充液體（漸層） */}
        <motion.div
          className="w-full"
          style={{
            background: `linear-gradient(180deg, ${fillTop} 0%, ${fillColor} 100%)`,
            borderTopLeftRadius: 14,
            borderTopRightRadius: 14,
          }}
          initial={{ height: 0 }}
          animate={{ height: `${pct}%` }}
          transition={{ duration: 1.8, ease: 'easeOut', delay: fillDelay }}
        />
        {/* 液面亮光 */}
        <motion.div
          className="absolute w-full h-1.5"
          style={{ background: 'rgba(255,255,255,0.55)', bottom: `${pct}%` }}
          animate={{ scaleX: [1, 1.1, 0.95, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* 高光 */}
        <div
          className="absolute top-2 left-2 rounded-full"
          style={{ width: 8, height: 30, background: 'rgba(255,255,255,0.4)', filter: 'blur(1px)' }}
        />
        {/* 達標警示 */}
        {over && (
          <motion.div
            className="absolute top-1.5 left-1/2 -translate-x-1/2 text-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0 }}
          >
            ⚠️
          </motion.div>
        )}
      </motion.div>

      {/* 百分比（counter） */}
      <span className="text-lg font-extrabold" style={{ color: fillColor }}>
        {Math.round(animPct)}%
      </span>

      {/* 數值（counter） */}
      <span className="text-xs text-gray-400">
        {Math.round(animGram)}g / {goal}g
      </span>

      {/* 標籤 */}
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
  )
}
