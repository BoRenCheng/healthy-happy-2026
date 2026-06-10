import { motion } from 'framer-motion'

export default function RingProgress({
  value,
  total,
  percentage,
  size = 100,
  color = '#E8916A',
  ticks = false,
  glow = false,
  light = false,
}) {
  const r = 38
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - percentage / 100)
  const textColor = light ? 'rgba(255,255,255,0.85)' : '#8A8A8A'

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        {/* 刻度 */}
        {ticks &&
          Array.from({ length: 20 }).map((_, i) => {
            const a = (i / 20) * 2 * Math.PI - Math.PI / 2
            const r1 = 46
            const r2 = 49
            return (
              <line
                key={i}
                x1={50 + r1 * Math.cos(a)}
                y1={50 + r1 * Math.sin(a)}
                x2={50 + r2 * Math.cos(a)}
                y2={50 + r2 * Math.sin(a)}
                stroke={light ? 'rgba(255,255,255,0.45)' : '#E0E0E0'}
                strokeWidth="0.8"
              />
            )
          })}
        {/* 背景圓 */}
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={light ? 'rgba(255,255,255,0.25)' : '#F0EDE8'}
          strokeWidth="8"
        />
        {/* 進度圓 */}
        <motion.circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          transform="rotate(-90 50 50)"
          style={glow ? { filter: `drop-shadow(0 0 4px ${color})` } : {}}
        />
      </svg>
      {/* 中心文字 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[9px] leading-tight text-center" style={{ color: textColor }}>
          第 {value} 天<br />共 {total} 天
        </span>
        <span className="text-[22px] font-bold leading-none" style={{ color }}>
          {percentage}%
        </span>
        <span className="text-[9px]" style={{ color: textColor }}>
          進度
        </span>
      </div>
    </div>
  )
}
