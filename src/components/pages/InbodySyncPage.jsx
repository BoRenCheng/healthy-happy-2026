import { motion } from 'framer-motion'
import { ArrowLeft, Cloud, CheckCircle, Activity, ArrowRight } from 'lucide-react'
import { inbodyHistory, inbodyMetrics } from '../../data/mockData'

// 步驟進度條
function StepBar({ step, onBack }) {
  return (
    <div className="sticky top-0 z-20 bg-white px-4 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid #F0EDE8' }}>
      <button onClick={onBack} style={{ color: '#BBBBBB' }}>
        <ArrowLeft size={20} />
      </button>
      <div className="flex-1">
        <p className="text-xs text-center mb-1" style={{ color: '#8A8A8A' }}>步驟 {step} / 2</p>
        <div className="h-[3px] rounded-full overflow-hidden" style={{ background: '#F0EDE8' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: '#5BB5A2' }}
            initial={{ width: 0 }}
            animate={{ width: `${step * 50}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      <div style={{ width: 20 }} />
    </div>
  )
}

// 分數迷你折線
function ScoreTrend({ data }) {
  const w = 100
  const h = 24
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((v, i) => [(i / (data.length - 1)) * w, h - 2 - ((v - min) / range) * (h - 6)])
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0]} ${p[1]}`).join(' ')
  const last = pts[pts.length - 1]
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <motion.path
        d={path}
        fill="none"
        stroke="#5BB5A2"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
      />
      <circle cx={last[0]} cy={last[1]} r="3.5" fill="#5BB5A2" />
    </svg>
  )
}

export default function InbodySyncPage({ onNext, onBack }) {
  const stagger = (i) => ({
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: 0.3 + i * 0.15 },
  })

  return (
    <div className="min-h-screen pb-2" style={{ background: '#FAF7F2' }}>
      <StepBar step={1} onBack={onBack} />

      <div className="px-4 pt-5 space-y-5">
        {/* 標題 */}
        <div>
          <h1 className="text-xl font-bold" style={{ color: '#2C2C2C' }}>InBody 數據導入</h1>
          <p className="text-sm mt-1" style={{ color: '#8A8A8A' }}>偵測到新的量測數據，正在自動同步</p>
        </div>

        {/* 同步來源 */}
        <motion.div
          className="bg-white rounded-2xl p-5"
          style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            {/* InBody 機台 */}
            <div className="flex flex-col items-center gap-1.5" style={{ width: 72 }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#EAF6F3' }}>
                <Activity size={24} color="#5BB5A2" />
              </div>
              <span className="text-[11px] text-center" style={{ color: '#8A8A8A' }}>InBody 970</span>
            </div>

            {/* 箭頭 1 */}
            <FlowArrow />

            {/* 雲端 */}
            <div className="flex flex-col items-center gap-1.5" style={{ width: 72 }}>
              <div className="relative w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#EAF6F3' }}>
                <Cloud size={24} color="#5BB5A2" />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: '2px solid transparent', borderTopColor: '#5BB5A2' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              <span className="text-[11px] text-center" style={{ color: '#8A8A8A' }}>雲端同步</span>
            </div>

            {/* 箭頭 2 */}
            <FlowArrow />

            {/* 已接收 */}
            <div className="flex flex-col items-center gap-1.5" style={{ width: 72 }}>
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#5BB5A2' }}>
                <CheckCircle size={24} color="white" />
              </div>
              <span className="text-[11px] text-center font-medium" style={{ color: '#5BB5A2' }}>已接收</span>
            </div>
          </div>
          <div className="mt-4 pt-3 text-center text-[13px]" style={{ borderTop: '1px solid #F5F2ED', color: '#5BB5A2' }}>
            ✅ 同步完成・{inbodyHistory.syncTime}
          </div>
        </motion.div>

        {/* 本次量測結果 */}
        <div>
          <h2 className="text-base font-bold" style={{ color: '#2C2C2C' }}>本次量測結果</h2>
          <p className="text-xs mt-0.5 mb-3" style={{ color: '#8A8A8A' }}>
            {inbodyHistory.current.date} 09:41 · {inbodyHistory.location}
          </p>
          <div className="bg-white rounded-2xl p-2" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
            {inbodyMetrics.map((m, i) => (
              <motion.div
                key={m.label}
                className="flex items-center gap-3 px-2 py-3"
                style={{ borderBottom: i < inbodyMetrics.length - 1 ? '1px solid #F5F2ED' : 'none' }}
                {...stagger(i)}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0" style={{ background: m.bg }}>
                  {m.icon}
                </div>
                <span className="text-sm flex-1" style={{ color: '#2C2C2C' }}>{m.label}</span>

                {m.trend && (
                  <div className="mr-1">
                    <ScoreTrend data={inbodyHistory.scoreTrend} />
                  </div>
                )}

                <span className="text-lg font-bold" style={{ color: '#2C2C2C' }}>
                  {m.value}
                  <span className="text-xs font-medium text-gray-400 ml-0.5">{m.unit}</span>
                </span>
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
                  style={{ background: m.good ? '#EAF6F3' : '#FDF0E8', color: m.good ? '#5BB5A2' : '#E8916A' }}
                >
                  {m.delta}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 進步總結 */}
        <motion.div
          className="rounded-2xl p-5 text-white flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #5BB5A2, #4A9A89)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex-1">
            <p className="text-[13px] opacity-80">本次進步評分</p>
            <p className="text-2xl font-bold mb-1">優秀 🎯</p>
            <p className="text-[13px] opacity-80 leading-snug">相比上次量測（14 天前），體組成全面改善</p>
          </div>
          <MiniRing value={inbodyHistory.progressScore} />
        </motion.div>
      </div>

      {/* 底部按鈕（sticky，避免被滑動 transform 影響） */}
      <div className="sticky bottom-0 mt-5 px-4 py-4 bg-white" style={{ borderTop: '1px solid #F0EDE8' }}>
        <button
          onClick={onNext}
          className="w-full py-4 rounded-full text-white font-semibold flex items-center justify-center gap-1"
          style={{ background: 'linear-gradient(135deg, #5BB5A2, #4A9A89)', boxShadow: '0 6px 18px rgba(91,181,162,0.4)' }}
        >
          查看 AI 分析結果 <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}

function FlowArrow() {
  return (
    <svg width="36" height="20" viewBox="0 0 36 20" className="flex-shrink-0">
      <motion.line
        x1="2"
        y1="10"
        x2="28"
        y2="10"
        stroke="#5BB5A2"
        strokeWidth="2"
        strokeDasharray="4 3"
        animate={{ strokeDashoffset: [20, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <path d="M28 5 L34 10 L28 15 Z" fill="#5BB5A2" />
    </svg>
  )
}

function MiniRing({ value }) {
  const r = 30
  const c = 2 * Math.PI * r
  return (
    <div className="relative" style={{ width: 76, height: 76 }}>
      <svg width="76" height="76" viewBox="0 0 76 76">
        <circle cx="38" cy="38" r={r} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="6" />
        <motion.circle
          cx="38"
          cy="38"
          r={r}
          fill="none"
          stroke="white"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c * (1 - value / 100) }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 1.4 }}
          transform="rotate(-90 38 38)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <span className="text-[22px] font-bold leading-none">{value}</span>
        <span className="text-[11px]">分</span>
      </div>
    </div>
  )
}
