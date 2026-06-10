import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { calcCompletionRate } from '../../utils/nutritionCalc'

const CONFETTI_COLORS = ['#4ECDC4', '#F4A261', '#F5C842', '#5BB5A2', '#E8916A', '#FFFFFF', '#9B8BF4', '#FF6B9D']
const SHAPES = ['circle', 'square', 'star']

function Confetti() {
  const h = typeof window !== 'undefined' ? window.innerHeight : 800
  const w = typeof window !== 'undefined' ? Math.min(window.innerWidth, 448) : 400
  const particles = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        startX: Math.random() * w,
        dx: (Math.random() - 0.5) * 260,
        dy: -(Math.random() * 0.7 + 0.25) * h,
        rot: Math.random() * 720,
        scale: Math.random() * 0.8 + 0.5,
        duration: Math.random() * 1.5 + 1.6,
        delay: Math.random() * 0.7,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      })),
    [w, h]
  )

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 201 }}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: p.startX, y: h + 20, rotate: 0, scale: p.scale, opacity: 1 }}
          animate={{ x: p.startX + p.dx, y: h + 20 + p.dy, rotate: p.rot, scale: 0, opacity: [1, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: p.shape === 'star' ? 16 : 10,
            height: p.shape === 'star' ? 16 : 10,
            background: p.color,
            borderRadius: p.shape === 'circle' ? '50%' : p.shape === 'square' ? 2 : 0,
            clipPath:
              p.shape === 'star'
                ? 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)'
                : 'none',
          }}
        />
      ))}
    </div>
  )
}

export default function CelebrationPage({ currentNutrition, onClose, onShare, navigate }) {
  const goal = { protein: currentNutrition.protein.goal, carbs: currentNutrition.carbs.goal, fat: currentNutrition.fat.goal }
  const cur = { protein: currentNutrition.protein.current, carbs: currentNutrition.carbs.current, fat: currentNutrition.fat.current }
  const rate = calcCompletionRate(cur, goal)
  const beat = Math.min(96, Math.round(rate * 0.95))
  const rankText = `前 ${Math.max(4, 100 - beat)}%`
  const C = 2 * Math.PI * 72

  const macros = [
    { label: '蛋白質', icon: '🥩', current: cur.protein, goal: goal.protein, color: '#4ECDC4' },
    { label: '碳水化合物', icon: '🍚', current: cur.carbs, goal: goal.carbs, color: '#F4A261' },
    { label: '脂肪', icon: '🫒', current: cur.fat, goal: goal.fat, color: '#C9A882' },
  ]

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #0D2B26 0%, #1A4A42 40%, #0D2B26 100%)', overflowY: 'auto' }}>
      <Confetti />

      {/* 頂部圓環 */}
      <div className="flex flex-col items-center" style={{ paddingTop: 56 }}>
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.3 }} style={{ position: 'relative', width: 180, height: 180 }}>
          <svg width="180" height="180" viewBox="0 0 180 180">
            <circle cx="90" cy="90" r="82" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4,4" />
            <circle cx="90" cy="90" r="72" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
            <motion.circle cx="90" cy="90" r="72" fill="none" stroke="#4ECDC4" strokeWidth="10" strokeLinecap="round" strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }} transform="rotate(-90 90 90)" style={{ filter: 'drop-shadow(0 0 8px rgba(78,205,196,0.8))' }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10, stiffness: 300, delay: 1.2 }} style={{ fontSize: 44 }}>✅</motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} style={{ color: '#4ECDC4', fontSize: 13, fontWeight: 700, margin: '4px 0 0', letterSpacing: 1 }}>達標！</motion.p>
          </div>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.6 }} className="text-center text-white" style={{ fontSize: 28, fontWeight: 800, margin: '20px 0 8px', lineHeight: 1.3 }}>
          今日目標完成！🎉
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="text-center" style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)' }}>
          你的健康複利正在累積中
        </motion.p>
      </div>

      {/* 今日成績卡 */}
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8, duration: 0.6 }} style={{ margin: '24px 16px 0', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: 24 }}>
        <p className="text-center" style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', letterSpacing: 2, margin: '0 0 20px' }}>今日營養達成紀錄</p>
        <div className="flex gap-3">
          {macros.map((item, i) => {
            const pct = Math.min(Math.round((item.current / item.goal) * 100), 100)
            return (
              <motion.div key={item.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.0 + i * 0.15 }} className="flex-1 text-center" style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: '14px 8px', border: `1px solid ${item.color}40` }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: item.color }}>{pct}%</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', margin: '2px 0 6px' }}>{item.label}</div>
                <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 2.2 + i * 0.15, duration: 1 }} style={{ height: '100%', borderRadius: 2, background: item.color }} />
                </div>
                {pct >= 90 && (
                  <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.8 + i * 0.1, type: 'spring' }} style={{ marginTop: 6, fontSize: 11, color: item.color, fontWeight: 700 }}>✓ 達標</motion.div>
                )}
              </motion.div>
            )
          })}
        </div>
        <div style={{ height: '0.5px', background: 'rgba(255,255,255,0.15)', margin: '20px 0' }} />
        <div className="flex justify-between items-center">
          <div>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: '0 0 2px' }}>今日總熱量</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: 'white', margin: 0 }}>{currentNutrition.consumed} kcal</p>
          </div>
          <div className="text-right">
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: '0 0 2px' }}>目標</p>
            <p style={{ fontSize: 20, fontWeight: 800, color: '#4ECDC4', margin: 0 }}>{currentNutrition.totalCalories} kcal</p>
          </div>
        </div>
      </motion.div>

      {/* 社群排名 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.5 }} style={{ margin: '16px 16px 0', background: 'linear-gradient(135deg, rgba(78,205,196,0.2), rgba(91,181,162,0.1))', border: '1px solid rgba(78,205,196,0.4)', borderRadius: 20, padding: 20 }}>
        <div className="flex justify-between items-center" style={{ marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', margin: '0 0 4px', letterSpacing: 1 }}>🏆 今日社群排名</p>
            <p style={{ fontSize: 26, fontWeight: 800, color: '#F5C842', margin: 0 }}>{rankText}</p>
          </div>
          <motion.div animate={{ rotate: [-5, 5, -5], y: [0, -4, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} style={{ fontSize: 52 }}>🏆</motion.div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 14px' }}>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: 1.7 }}>
            今日完成率 <span style={{ color: '#4ECDC4', fontWeight: 800, fontSize: 18 }}>{rate}%</span>，表現優於 <span style={{ color: '#F5C842', fontWeight: 700 }}>{beat}%</span> 的今日挑戰夥伴！
          </p>
        </div>
        <div className="flex" style={{ marginTop: 14, borderRadius: 50, overflow: 'hidden', height: 32 }}>
          {[
            { label: '低增值區', width: '30%', bg: 'rgba(255,255,255,0.1)' },
            { label: rate >= 85 ? '高值區' : '成長區', width: '40%', bg: '#4ECDC4', active: true },
            { label: '頂尖區', width: '30%', bg: 'rgba(255,255,255,0.05)' },
          ].map((zone, i) => (
            <div key={i} className="flex items-center justify-center" style={{ width: zone.width, background: zone.bg, fontSize: 11, fontWeight: zone.active ? 700 : 400, color: zone.active ? '#0D2B26' : 'rgba(255,255,255,0.5)' }}>
              {zone.active && '你 · '}{zone.label}
            </div>
          ))}
        </div>
      </motion.div>

      {/* 今日解鎖成就 */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.8, type: 'spring' }} style={{ margin: '16px 16px 0', background: 'rgba(245,200,66,0.1)', border: '1px solid rgba(245,200,66,0.3)', borderRadius: 20, padding: 20 }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: '0 0 14px', letterSpacing: 1 }}>🎖 今日解鎖成就</p>
        <div className="flex gap-2.5">
          {[
            { icon: '🎯', title: '今日達標', desc: '三大營養素達成 90%+', color: '#F5C842' },
            { icon: '🔥', title: '連續第 7 天', desc: '連續記錄達標！', color: '#E8916A' },
            { icon: '💪', title: '蛋白質精準', desc: `達成 ${Math.round((cur.protein / goal.protein) * 100)}%`, color: '#4ECDC4' },
          ].map((b, i) => (
            <motion.div key={b.title} initial={{ opacity: 0, y: 20, rotate: -10 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ delay: 3.0 + i * 0.15, type: 'spring', damping: 12 }} className="flex-1 text-center" style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: '12px 6px', border: `1px solid ${b.color}40` }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{b.icon}</div>
              <p style={{ fontSize: 11, fontWeight: 700, color: b.color, margin: '0 0 2px' }}>{b.title}</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', margin: 0 }}>{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 明日建議 */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.2 }} style={{ margin: '16px 16px 0', background: 'rgba(255,255,255,0.06)', borderRadius: 20, padding: 20 }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: '0 0 12px', letterSpacing: 1 }}>🌙 明日建議</p>
        <div className="flex gap-2.5">
          {[
            { emoji: '🥚', text: '早餐補充蛋白質', sub: '建議 ≥ 20g' },
            { emoji: '🏃', text: '活動量維持', sub: '目標 8,000 步' },
            { emoji: '💧', text: '充足水分', sub: '每日 2,000ml' },
          ].map((tip, i) => (
            <div key={i} className="flex-1 text-center" style={{ padding: '10px 4px' }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{tip.emoji}</div>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)', margin: '0 0 2px' }}>{tip.text}</p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{tip.sub}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 底部按鈕 */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3.4 }} style={{ margin: '24px 16px', paddingBottom: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button onClick={onShare} className="flex items-center justify-center gap-2" style={{ width: '100%', padding: 16, background: 'linear-gradient(135deg, #4ECDC4, #5BB5A2)', color: 'white', border: 'none', borderRadius: 50, fontSize: 16, fontWeight: 700, boxShadow: '0 4px 20px rgba(78,205,196,0.4)' }}>
          🎉 分享今日成果
        </button>
        <button onClick={() => { onClose(); navigate('profile') }} style={{ width: '100%', padding: 16, background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 50, fontSize: 15, fontWeight: 600 }}>
          查看代謝分析報告 →
        </button>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 14, padding: '8px 0', width: '100%' }}>
          返回首頁
        </button>
      </motion.div>
    </div>
  )
}
