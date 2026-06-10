import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { BarChart, Bar, XAxis, ResponsiveContainer, LabelList } from 'recharts'
import { inbodyCompare, compareChartData, budgetAdjustment } from '../../data/mockData'

const LINES = [
  '🔍 讀取本次 InBody 數據...',
  '📊 載入上次量測記錄（14 天前）...',
  '🧠 SLM 代謝模型比對分析中...',
  '📈 計算體組成變化趨勢...',
  '🍽 重新計算個人化營養預算...',
]

function StepBar({ onBack }) {
  return (
    <div className="sticky top-0 z-20 bg-white px-4 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid #F0EDE8' }}>
      <button onClick={onBack} className="flex items-center gap-1 text-sm font-medium" style={{ color: '#5BB5A2' }}>
        <ArrowLeft size={18} /> 返回
      </button>
      <div className="flex-1">
        <p className="text-xs text-center mb-1" style={{ color: '#8A8A8A' }}>步驟 2 / 2</p>
        <div className="h-[3px] rounded-full overflow-hidden" style={{ background: '#F0EDE8' }}>
          <motion.div className="h-full rounded-full" style={{ background: '#5BB5A2' }} initial={{ width: '50%' }} animate={{ width: '100%' }} transition={{ duration: 0.5 }} />
        </div>
      </div>
      <div style={{ width: 40 }} />
    </div>
  )
}

// 旋轉 AI 六邊形 + 繞行圓點
function AiOrb({ small }) {
  const size = small ? 56 : 120
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      >
        <polygon points="50,8 88,29 88,71 50,92 12,71 12,29" fill="none" stroke="#5BB5A2" strokeWidth="2" />
      </motion.svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-bold" style={{ color: '#5BB5A2', fontSize: small ? 16 : 22 }}>AI</span>
      </div>
      {!small && (
        <motion.div className="absolute inset-0" animate={{ rotate: -360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 6,
                height: 6,
                background: '#5BB5A2',
                top: '50%',
                left: '50%',
                transform: `rotate(${i * 60}deg) translateY(-${size / 2 - 2}px)`,
                transformOrigin: '0 0',
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default function AiAnalysisPage({ onBack, onEnter }) {
  const [phase, setPhase] = useState('analyzing')
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => setVisible((v) => Math.min(LINES.length, v + 1)), 450)
    const t = setTimeout(() => setPhase('done'), 2600)
    return () => {
      clearInterval(iv)
      clearTimeout(t)
    }
  }, [])

  const stagger = (i, base = 0) => ({
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: base + i * 0.1 },
  })

  return (
    <div className="min-h-screen pb-2" style={{ background: '#FAF7F2' }}>
      <StepBar onBack={onBack} />

      <AnimatePresence mode="wait">
        {phase === 'analyzing' ? (
          <motion.div
            key="analyzing"
            className="flex flex-col items-center justify-center px-6"
            style={{ minHeight: '70vh' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8">
              <AiOrb />
            </div>
            <div className="space-y-1 w-full max-w-xs">
              {LINES.map((line, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2"
                  style={{ lineHeight: 2.2, opacity: i < visible ? 1 : 0.25, transition: 'opacity 0.3s' }}
                >
                  <span className="text-sm flex-1" style={{ color: '#2C2C2C' }}>{line}</span>
                  {i < visible && (
                    <motion.span initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} style={{ color: '#5BB5A2' }}>
                      <Check size={16} />
                    </motion.span>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-4 pt-4 space-y-4">
            {/* 標題 + 小 AI */}
            <div className="flex items-center gap-3">
              <AiOrb small />
              <div>
                <h1 className="text-lg font-bold" style={{ color: '#2C2C2C' }}>AI 分析完成</h1>
                <p className="text-xs" style={{ color: '#8A8A8A' }}>基於本次與 14 天前的 InBody 數據</p>
              </div>
            </div>

            {/* 對比表 */}
            <motion.div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold">📊 體組成變化比較</p>
                <span className="text-xs" style={{ color: '#8A8A8A' }}>vs 14 天前</span>
              </div>
              <div className="flex text-xs mb-2" style={{ color: '#8A8A8A' }}>
                <span className="flex-1">指標</span>
                <span className="w-20 text-right">上次 (5/23)</span>
                <span className="w-24 text-right">本次 (6/6)</span>
              </div>
              {inbodyCompare.map((r, i) => (
                <motion.div
                  key={r.label}
                  className="flex items-center py-2.5"
                  style={{ borderTop: '1px solid #F5F2ED' }}
                  {...stagger(i, 0.1)}
                >
                  <span className="flex-1 text-sm" style={{ color: '#2C2C2C' }}>{r.label}</span>
                  <span className="w-20 text-right text-sm" style={{ color: '#BBBBBB' }}>{r.last}</span>
                  <span className="w-24 text-right text-sm font-bold flex items-center justify-end gap-1" style={{ color: r.highlight ? '#5BB5A2' : '#2C2C2C' }}>
                    {r.now}
                  </span>
                  <span className="ml-1 text-[11px] font-medium px-1.5 py-0.5 rounded-full whitespace-nowrap" style={{ background: '#EAF6F3', color: '#5BB5A2' }}>
                    {r.delta}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* 雙欄圖 */}
            <motion.div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <p className="text-sm font-bold mb-3">體組成變化視覺化</p>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={compareChartData} margin={{ top: 20, right: 8, left: 8, bottom: 0 }} barGap={4}>
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#8A8A8A' }} axisLine={false} tickLine={false} />
                  <Bar dataKey="last" fill="#D7D2C9" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="last" position="top" style={{ fontSize: 10, fill: '#BBBBBB' }} />
                  </Bar>
                  <Bar dataKey="now" fill="#5BB5A2" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="now" position="top" style={{ fontSize: 10, fill: '#5BB5A2', fontWeight: 700 }} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex items-center justify-center gap-4 text-xs" style={{ color: '#8A8A8A' }}>
                <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm" style={{ background: '#D7D2C9' }} /> 上次 (5/23)</span>
                <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded-sm" style={{ background: '#5BB5A2' }} /> 本次 (6/6)</span>
              </div>
            </motion.div>

            {/* AI 解讀 */}
            <motion.div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #EAF6F3, #F0FAF8)' }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-white px-3 py-1 rounded-full" style={{ background: '#5BB5A2' }}>🧠 AI 代謝分析</span>
                <span className="text-xs" style={{ color: '#8A8A8A' }}>信心指數 92%</span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#2C2C2C' }}>
                相較於 14 天前的量測，你的骨骼肌量提升了 0.7kg，體脂率下降 1.2%，代謝效率持續改善。基礎代謝率上升至 1,650 kcal，代表你的身體每日靜態消耗增加，這是增肌的關鍵正向指標。
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {['💪 增肌有效', '🔥 代謝提升', '📉 減脂進行'].map((t) => (
                  <span key={t} className="text-xs px-3.5 py-1.5 rounded-full bg-white" style={{ border: '1px solid #5BB5A2', color: '#5BB5A2' }}>
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* 營養預算調整 */}
            <motion.div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold">🍽 AI 調整後的今日營養預算</p>
                <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: '#EAF6F3', color: '#5BB5A2' }}>已自動更新</span>
              </div>
              <p className="text-[13px] mb-4" style={{ color: '#8A8A8A' }}>{budgetAdjustment.reason}</p>

              {budgetAdjustment.items.map((it, i) => (
                <motion.div
                  key={it.name}
                  className="flex items-center gap-3 py-3"
                  style={{ borderTop: i > 0 ? '1px solid #F5F2ED' : 'none' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.12 }}
                >
                  <span className="text-xl flex-shrink-0">{it.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm font-bold" style={{ color: '#2C2C2C' }}>{it.name}</p>
                    <p className="text-xs" style={{ color: '#BBBBBB', textDecoration: 'line-through' }}>{it.old}</p>
                  </div>
                  <motion.span className="text-xl font-bold mr-1" style={{ color: '#2C2C2C' }} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 + i * 0.12 }}>
                    {it.new}
                  </motion.span>
                  <motion.span
                    className="text-[13px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
                    style={{ background: '#EAF6F3', color: '#5BB5A2' }}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.15, 1] }}
                    transition={{ delay: 0.9 + i * 0.12 }}
                  >
                    {it.delta}
                  </motion.span>
                </motion.div>
              ))}
            </motion.div>

            {/* 今日重點 */}
            <motion.div className="p-4" style={{ background: '#FFFBEA', borderLeft: '3px solid #F5C842', borderRadius: '0 12px 12px 0' }} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <p className="text-sm font-bold mb-2" style={{ color: '#2C2C2C' }}>💡 今日重點</p>
              <div className="space-y-2">
                {budgetAdjustment.tips.map((t, i) => (
                  <p key={i} className="text-[13px] leading-relaxed" style={{ color: '#2C2C2C' }}>
                    <span style={{ color: '#F5C842' }}>★</span> {t}
                  </p>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 底部按鈕（sticky） */}
      {phase === 'done' && (
        <motion.div
          className="sticky bottom-0 mt-4 px-4 py-3 bg-white flex gap-3"
          style={{ borderTop: '1px solid #F0EDE8' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <button className="py-3.5 rounded-full text-sm font-semibold" style={{ flex: 1, background: 'white', border: '1.5px solid #5BB5A2', color: '#5BB5A2' }}>
            完整分析報告
          </button>
          <button
            onClick={onEnter}
            className="py-3.5 rounded-full text-sm font-semibold text-white flex items-center justify-center gap-1"
            style={{ flex: 1.5, background: 'linear-gradient(135deg, #5BB5A2, #4A9A89)', boxShadow: '0 6px 18px rgba(91,181,162,0.4)' }}
          >
            開始今日計畫 <ArrowRight size={16} />
          </button>
        </motion.div>
      )}
    </div>
  )
}
