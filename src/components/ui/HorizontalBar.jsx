import { motion } from 'framer-motion'

export default function HorizontalBar({
  label,
  value,
  max,
  color = '#5BB5A2',
  suffix = '',
}) {
  const pct = Math.min(100, Math.round((value / max) * 100))

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-gray-500">{label}</span>
        <span className="text-xs font-semibold" style={{ color }}>
          {value}
          {suffix}
        </span>
      </div>
      <div className="h-3 rounded-full overflow-hidden" style={{ background: '#F0EDE8' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </div>
  )
}
