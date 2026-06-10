import { motion } from 'framer-motion'

export default function RadarChart({ data, size = 260 }) {
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.3
  const n = data.length
  const angle = (i) => (i * 2 * Math.PI) / n - Math.PI / 2

  const toXY = (i, val) => ({
    x: cx + r * val * Math.cos(angle(i)),
    y: cy + r * val * Math.sin(angle(i)),
  })

  const gridLevels = [1, 0.75, 0.5, 0.25] // 外→內，越內越濃
  const polyPath = (val) =>
    data.map((_, i) => { const p = toXY(i, val); return `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}` }).join(' ') + ' Z'

  const dataPoints = data.map((d, i) => toXY(i, d.value))
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* 同心多邊形（漸層填充） */}
      {gridLevels.map((lv) => (
        <path key={lv} d={polyPath(lv)} fill={`rgba(91,181,162,${(0.15 - lv * 0.12).toFixed(3)})`} stroke="#E8E8E8" strokeWidth="0.6" />
      ))}

      {/* 軸線 */}
      {data.map((_, i) => {
        const o = toXY(i, 1)
        return <line key={i} x1={cx} y1={cy} x2={o.x} y2={o.y} stroke="#E0E0E0" strokeWidth="0.8" />
      })}

      {/* 資料多邊形 */}
      <motion.path
        d={dataPath}
        fill="#5BB5A2"
        fillOpacity="0.2"
        stroke="#5BB5A2"
        strokeWidth="2.5"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* 頂點（雙環）+ 分數 */}
      {dataPoints.map((p, i) => {
        const sp = toXY(i, data[i].value + 0.16)
        return (
          <motion.g key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 + i * 0.1 }}>
            <circle cx={p.x} cy={p.y} r="9" fill="white" stroke="#5BB5A2" strokeWidth="1.5" />
            <circle cx={p.x} cy={p.y} r="5" fill="#5BB5A2" />
            <text x={sp.x} y={sp.y} textAnchor="middle" dominantBaseline="middle" fontSize="12" fontWeight="700" fill="#5BB5A2">
              {data[i].score ?? Math.round(data[i].value * 100)}
            </text>
          </motion.g>
        )
      })}

      {/* 軸標籤（兩行） */}
      {data.map((d, i) => {
        const pos = toXY(i, 1.34)
        return (
          <text key={i} x={pos.x} y={pos.y} textAnchor="middle" dominantBaseline="middle" fontFamily="Noto Sans TC">
            <tspan x={pos.x} dy="-0.3em" fontSize="11" fontWeight="700" fill="#2C2C2C">{d.label}</tspan>
            <tspan x={pos.x} dy="1.3em" fontSize="10" fill="#5BB5A2">{d.score ?? Math.round(d.value * 100)} 分</tspan>
          </text>
        )
      })}
    </svg>
  )
}
