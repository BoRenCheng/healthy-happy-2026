import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Lock, Check } from 'lucide-react'
import RadarChart from '../ui/RadarChart'
import { metabolicProfile as P } from '../../data/mockData'

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

// 火焰 + 閃電 人格符號
function PersonaSymbol() {
  return (
    <div className="relative" style={{ width: 80, height: 80 }}>
      <div className="absolute left-1/2 -translate-x-1/2" style={{ bottom: 4, width: 60, height: 20, background: 'rgba(245,200,66,0.4)', borderRadius: '50%', filter: 'blur(8px)' }} />
      <svg width="80" height="80" viewBox="0 0 80 80">
        <defs>
          <linearGradient id="flame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F5C842" />
            <stop offset="100%" stopColor="#E8916A" />
          </linearGradient>
        </defs>
        <path d="M40 8 C50 24 64 30 60 48 C58 64 46 72 40 72 C34 72 22 64 20 48 C16 32 30 26 34 20 C36 28 34 34 40 34 C44 34 44 24 40 8 Z" fill="url(#flame)" />
        <path d="M42 30 L33 46 L40 46 L36 60 L50 40 L42 40 L46 30 Z" fill="white" />
      </svg>
    </div>
  )
}

export default function ProfilePage({ navigate }) {
  const [checked, setChecked] = useState([])
  const toggle = (i) => setChecked((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]))

  return (
    <div className="pb-24" style={{ background: '#FAF7F2' }}>
      {/* ============ 第一層 WHO：英雄橫幅 ============ */}
      <motion.div className="relative overflow-hidden" style={{ height: 220, background: 'linear-gradient(145deg, #3D8B7A 0%, #5BB5A2 45%, #7DCFBF 100%)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        {/* 裝飾圓 */}
        <div className="absolute rounded-full" style={{ width: 180, height: 180, top: -40, right: -40, background: 'rgba(255,255,255,0.06)' }} />
        <div className="absolute rounded-full" style={{ width: 120, height: 120, bottom: -30, left: -20, background: 'rgba(255,255,255,0.04)' }} />
        <div className="absolute rounded-full" style={{ width: 60, height: 60, top: 60, right: 40, background: 'rgba(255,255,255,0.08)' }} />

        <div className="relative flex h-full px-6 pt-6">
          <div className="flex-1">
            <motion.span className="inline-block text-[11px] text-white px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              🔬 AI 代謝分析報告
            </motion.span>
            <motion.h1 className="text-[28px] font-extrabold text-white mt-3" style={{ letterSpacing: '-0.5px' }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              {P.name}
            </motion.h1>
            <motion.p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.7)', letterSpacing: '1px' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              {P.en}
            </motion.p>
            <motion.div className="mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.8)' }}>信心指數</p>
              <div className="flex items-center gap-1.5 mt-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className="rounded-full" style={{ width: 8, height: 8, background: i < 4 ? 'white' : 'transparent', border: '1.5px solid white' }} />
                ))}
                <span className="text-[13px] font-bold text-white ml-1">{P.confidence}%</span>
              </div>
            </motion.div>
          </div>

          <div className="relative flex items-center justify-center" style={{ width: 120 }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.4 }}>
              <PersonaSymbol />
            </motion.div>
            <span className="absolute text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ bottom: 24, right: 0, background: '#F5C842', color: '#2C2C2C' }}>{P.percentile}</span>
          </div>
        </div>

        {/* 底部波浪 */}
        <svg className="absolute bottom-0 left-0 w-full" height="24" viewBox="0 0 400 24" preserveAspectRatio="none">
          <path d="M0 24 L0 12 Q100 0 200 12 T400 12 L400 24 Z" fill="#FAF7F2" />
        </svg>
      </motion.div>

      {/* 特質標籤 */}
      <motion.div className="flex flex-wrap gap-2 px-6 pt-2 pb-4" variants={{ show: { transition: { staggerChildren: 0.08 } } }} initial="hidden" animate="show">
        {P.traits.map((t) => (
          <motion.span key={t.label} variants={item} className="text-xs font-semibold px-3.5 py-1.5 rounded-full" style={{ background: t.bg, color: t.color, border: `1px solid ${t.border}` }}>
            {t.icon} {t.label}
          </motion.span>
        ))}
      </motion.div>

      {/* 白話解釋 */}
      <div className="px-6 pb-5">
        <motion.div className="relative bg-white rounded-2xl p-5 overflow-hidden" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)', borderLeft: '4px solid #5BB5A2' }} variants={item} initial="hidden" animate="show">
          <span className="absolute text-[60px] leading-none font-serif" style={{ top: 4, right: 12, color: '#EAF6F3' }}>”</span>
          <p className="text-xs mb-2" style={{ color: '#8A8A8A' }}>💬 用白話說</p>
          <p className="text-[16px] leading-loose relative" style={{ color: '#2C2C2C' }}>{P.plain}</p>
        </motion.div>
      </div>

      {/* ============ 第二層 WHY ============ */}
      <div className="px-6 pb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold" style={{ color: '#2C2C2C' }}>📊 代謝能力雷達分析</h2>
          <span className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: '#EAF6F3', color: '#5BB5A2' }}>基於 14 天數據</span>
        </div>
        <motion.div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }} variants={item} initial="hidden" animate="show">
          <div className="flex justify-center">
            <RadarChart data={P.radar} size={260} />
          </div>
          <div className="grid grid-cols-4 gap-1 mt-2">
            {P.radar.map((d) => (
              <div key={d.label} className="flex flex-col items-center text-center">
                <span className="rounded-full mb-1" style={{ width: 6, height: 6, background: d.color }} />
                <span className="text-[10px] leading-tight" style={{ color: '#2C2C2C' }}>{d.label}</span>
                <span className="text-[11px] font-bold" style={{ color: '#5BB5A2' }}>{d.score}分</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 數據來源時間軸 */}
      <div className="px-6 pb-5">
        <h2 className="text-base font-bold" style={{ color: '#2C2C2C' }}>📅 分析數據來源</h2>
        <p className="text-[13px] mt-0.5 mb-3" style={{ color: '#8A8A8A' }}>以下指標構成你的代謝人格評分</p>
        <motion.div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }} variants={item} initial="hidden" animate="show">
          <div className="relative pl-6">
            <div className="absolute top-2 bottom-2" style={{ left: 3, width: 2, background: '#EAF6F3' }} />
            {P.sources.map((s, i) => (
              <motion.div key={s.name} className="relative pb-4 last:pb-0" initial={{ opacity: 0, x: 12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <span className="absolute rounded-full" style={{ left: -22, top: 4, width: 8, height: 8, background: s.ring }} />
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-bold" style={{ color: '#2C2C2C' }}>{s.name}</p>
                    <p className="text-[13px] leading-relaxed mt-0.5" style={{ color: '#8A8A8A' }}>{s.desc}</p>
                  </div>
                  <div className="flex items-center justify-center rounded-full flex-shrink-0 text-[13px] font-bold" style={{ width: 32, height: 32, border: `2px solid ${s.ring}`, color: s.text }}>
                    {s.score}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="rounded-lg px-3.5 py-2.5 mt-2 text-xs leading-relaxed" style={{ background: '#EAF6F3', color: '#5BB5A2' }}>
            ⏱ 持續記錄越久，分析精準度越高。目前數據量：14 天，建議 30 天以上（可解鎖月度趨勢報告）。
          </div>
        </motion.div>
      </div>

      {/* ============ 第三層 WHAT NOW ============ */}
      <div className="px-6 pb-5">
        <h2 className="text-base font-bold mb-3" style={{ color: '#2C2C2C' }}>⚠️ 生理資本風險評估</h2>
        <div className="space-y-3">
          {P.risks.map((rk, i) => (
            <motion.div key={rk.name} className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)', borderLeft: `4px solid ${rk.color}` }} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-sm font-bold" style={{ color: '#2C2C2C' }}>{rk.name}</span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: rk.badgeBg, color: rk.badgeText || rk.color }}>{rk.level}</span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden mb-2.5" style={{ background: '#F0EDE8' }}>
                <motion.div className="h-full rounded-full" style={{ background: rk.color }} initial={{ width: 0 }} whileInView={{ width: `${rk.pct}%` }} viewport={{ once: true }} transition={{ duration: 1.2, ease: 'easeOut' }} />
              </div>
              <p className="text-[13px] leading-relaxed mb-2.5" style={{ color: '#8A8A8A' }}>{rk.desc}</p>
              <div className="rounded-lg px-3 py-2 text-[13px] font-medium" style={{ background: rk.badgeBg, color: rk.color }}>→ {rk.action}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 本週行動清單 */}
      <div className="px-6 pb-5">
        <h2 className="text-base font-bold mb-3" style={{ color: '#2C2C2C' }}>🎯 本週行動清單</h2>
        <motion.div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }} variants={item} initial="hidden" animate="show">
          {P.actions.map((a, i) => {
            const done = checked.includes(i)
            return (
              <div key={a.title} className="flex items-start gap-3 py-3" style={{ borderBottom: i < P.actions.length - 1 ? '0.5px solid #F0EDE8' : 'none' }}>
                <button onClick={() => toggle(i)} className="flex items-center justify-center rounded-full flex-shrink-0 mt-0.5 transition-colors" style={{ width: 24, height: 24, background: done ? '#5BB5A2' : 'white', border: done ? 'none' : '2px solid #E0E0E0' }}>
                  {done && <Check size={14} color="white" />}
                </button>
                <div className="flex-1">
                  <p className="text-sm font-bold" style={{ color: done ? '#BBBBBB' : '#2C2C2C', textDecoration: done ? 'line-through' : 'none' }}>{a.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#8A8A8A' }}>{a.effect}</p>
                </div>
                <span className="text-[11px] font-medium whitespace-nowrap mt-0.5" style={{ color: a.diffColor }}>{a.diff}</span>
              </div>
            )
          })}
          <p className="text-[13px] text-center mt-2" style={{ color: '#5BB5A2' }}>完成行動可提升代謝人格分數 🔼</p>
        </motion.div>
      </div>

      {/* 解鎖預覽 */}
      <div className="px-6 pb-5">
        <motion.div className="rounded-2xl p-5" style={{ border: '1.5px dashed #5BB5A2', background: '#FCFBF8' }} variants={item} initial="hidden" animate="show">
          <p className="text-sm font-bold mb-3" style={{ color: '#2C2C2C' }}>🔓 繼續記錄，解鎖更多分析</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {P.unlocks.map((u) => {
              const pct = Math.round((u.cur / u.total) * 100)
              return (
                <div key={u.title} className="rounded-xl p-3" style={{ background: 'white', border: '1px solid #F0EDE8' }}>
                  <Lock size={16} color="#BBBBBB" />
                  <p className="text-[13px] font-medium mt-1.5" style={{ color: '#8A8A8A' }}>{u.title}</p>
                  <p className="text-[11px] mb-2" style={{ color: '#BBBBBB' }}>{u.need}</p>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F0EDE8' }}>
                    <motion.div className="h-full rounded-full" style={{ background: '#5BB5A2' }} initial={{ width: 0 }} whileInView={{ width: `${pct}%` }} viewport={{ once: true }} transition={{ duration: 1 }} />
                  </div>
                  <p className="text-[10px] mt-1 text-right" style={{ color: '#5BB5A2' }}>{u.cur}/{u.total} 天 · {pct}%</p>
                </div>
              )
            })}
          </div>
          <button onClick={() => navigate('discover')} className="w-full py-3.5 rounded-full text-white font-semibold flex items-center justify-center gap-2" style={{ background: 'linear-gradient(135deg, #5BB5A2, #4A9A89)', boxShadow: '0 6px 18px rgba(91,181,162,0.4)' }}>
            <BookOpen size={18} /> 查看精準營養學堂
          </button>
        </motion.div>
      </div>
    </div>
  )
}
