import { motion } from 'framer-motion'

// 半圓儀表盤（0-100），分段色：灰 / 橘 / 綠，指針指向 value
export default function SemiGauge({ value = 0, size = 90 }) {
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 7
  const sw = 7

  // value -> 點座標（上半圓，0%在左、100%在右）
  const pt = (v) => {
    const a = Math.PI * (1 - v / 100)
    return [cx + r * Math.cos(a), cy - r * Math.sin(a)]
  }
  const seg = (v1, v2) => {
    const [x1, y1] = pt(v1)
    const [x2, y2] = pt(v2)
    return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`
  }
  const [nx, ny] = pt(value)

  return (
    <svg width={size} height={cy + 8} viewBox={`0 0 ${size} ${cy + 8}`}>
      <path d={seg(0, 60)} fill="none" stroke="#E0E0E0" strokeWidth={sw} strokeLinecap="round" />
      <path d={seg(60, 85)} fill="none" stroke="#E8916A" strokeWidth={sw} strokeLinecap="round" />
      <path d={seg(85, 100)} fill="none" stroke="#5BB5A2" strokeWidth={sw} strokeLinecap="round" />
      {/* 指針 */}
      <motion.line
        x1={cx}
        y1={cy}
        x2={nx}
        y2={ny}
        stroke="#2C2C2C"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ x2: pt(0)[0], y2: pt(0)[1] }}
        animate={{ x2: nx, y2: ny }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
      />
      <circle cx={cx} cy={cy} r="4" fill="#2C2C2C" />
    </svg>
  )
}
