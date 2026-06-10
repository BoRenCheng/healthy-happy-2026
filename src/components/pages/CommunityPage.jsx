import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, CheckCircle, ChevronDown, Heart, MessageCircle } from 'lucide-react'
import RingProgress from '../ui/RingProgress'
import SemiGauge from '../ui/SemiGauge'
import AchievementBadge from '../ui/AchievementBadge'
import { challenge, achievements, community } from '../../data/mockData'

const pctOf = (n) => Math.min(100, (n.current / n.goal) * 100)

function DistBar({ height = 6 }) {
  const d = community.distribution
  return (
    <div className="flex rounded-full overflow-hidden" style={{ height }}>
      <div style={{ width: `${d.low.pct}%`, background: '#E0E0E0' }} />
      <div style={{ width: `${d.mid.pct}%`, background: '#E8916A' }} />
      <div style={{ width: `${d.high.pct}%`, background: '#5BB5A2' }} />
    </div>
  )
}

export default function CommunityPage({
  navigate,
  setModal,
  challengeRecorded,
  setChallengeRecorded,
  communityExpanded,
  setCommunityExpanded,
  currentNutrition,
  nutritionUpdated,
}) {
  const stagger = (i) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: i * 0.06 },
  })

  const rate = Math.round(
    pctOf(currentNutrition.protein) * 0.4 +
      pctOf(currentNutrition.carbs) * 0.35 +
      pctOf(currentNutrition.fat) * 0.25
  )
  const myZone = rate >= 85 ? 'high' : rate >= 60 ? 'mid' : 'low'
  const triLeft = myZone === 'low' ? 17.5 : myZone === 'mid' ? 56 : 88.5

  const [explainOpen, setExplainOpen] = useState(false)
  const [showNotif, setShowNotif] = useState(false)
  useEffect(() => {
    if (nutritionUpdated) {
      setShowNotif(true)
      const t = setTimeout(() => setShowNotif(false), 2500)
      return () => clearTimeout(t)
    }
  }, [nutritionUpdated])

  const feed = communityExpanded ? community.feed : community.feed.slice(0, 2)

  return (
    <div className="min-h-screen pb-10" style={{ background: '#FAF7F2' }}>
      <div className="flex items-center px-4 pt-4 pb-2">
        <button onClick={() => navigate('home', 'main')} className="flex items-center gap-1 text-sm font-medium" style={{ color: '#5BB5A2' }}>
          <ArrowLeft size={18} /> 返回
        </button>
      </div>

      <div className="px-4 space-y-4">
        <motion.div className="flex items-center gap-2" {...stagger(0)}>
          <span className="text-lg">🏆</span>
          <h1 className="text-xl font-bold">社群挑戰</h1>
        </motion.div>

        {/* ===== 區塊一：21 天挑戰橫幅 ===== */}
        <motion.div
          className="rounded-2xl p-5 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #5BB5A2 0%, #4A9A89 60%, #3D8B7A 100%)' }}
          {...stagger(1)}
        >
          {/* 裝飾：植物 */}
          <svg width="80" height="80" viewBox="0 0 80 80" className="absolute" style={{ top: 6, right: 8, opacity: 0.15 }}>
            <path d="M40 78 C40 55 40 40 40 30" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M40 44 C26 40 20 28 22 18 C34 20 42 30 40 44 Z" fill="white" />
            <path d="M40 36 C54 32 60 20 58 10 C46 12 38 22 40 36 Z" fill="white" />
            <path d="M40 56 C30 54 24 46 25 38 C35 40 42 48 40 56 Z" fill="white" />
            <line x1="30" y1="78" x2="50" y2="78" stroke="white" strokeWidth="2" />
          </svg>
          {/* 裝飾：金幣 */}
          <div className="absolute" style={{ bottom: 8, left: 10 }}>
            {[0, 1, 2].map((i) => (
              <div key={i} className="absolute rounded-full" style={{ width: 34, height: 34, background: '#F5C842', opacity: 0.12, left: i * 14, bottom: i * 5 }} />
            ))}
          </div>

          <div className="relative flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-lg font-bold mb-0.5">{challenge.title}</p>
              <p className="text-sm opacity-90 mb-3">{challenge.subtitle}</p>
              <span className="text-xs px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>
                已參與 · 進行中
              </span>
            </div>
            <div className="flex-shrink-0">
              <RingProgress value={challenge.currentDay} total={challenge.totalDays} percentage={challenge.progress} size={96} color="#F5C842" ticks glow light />
            </div>
          </div>
          <button
            onClick={() => setChallengeRecorded(true)}
            className="w-full mt-4 py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-1.5"
            style={{ background: 'white', color: '#5BB5A2' }}
          >
            <CheckCircle size={16} /> {challengeRecorded ? '今日已記錄 ✓' : '繼續記錄'}
          </button>
        </motion.div>

        {/* ===== 區塊二：健康資產增值區間 ===== */}
        <motion.div className="bg-white rounded-2xl p-4 relative overflow-hidden" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }} {...stagger(2)}>
          {/* 完成率提升通知 */}
          <AnimatePresence>
            {showNotif && (
              <motion.div
                className="mb-3 rounded-xl px-3 py-2.5 text-xs leading-relaxed"
                style={{ background: '#EAF6F3', color: '#3E8C7C' }}
                initial={{ opacity: 0, y: -12, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -12, height: 0 }}
              >
                🎉 記錄飲食後完成率提升至 {rate}%！{rate >= 85 ? '排名躍升至前 15% 高值區！' : '繼續努力衝刺高值區！'}
              </motion.div>
            )}
          </AnimatePresence>

          {/* 完成率 + 半圓儀表 */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs" style={{ color: '#8A8A8A' }}>今日完成率</p>
              <p className="text-[40px] font-extrabold leading-none" style={{ color: '#E8916A' }}>{rate}%</p>
              <p className="text-[11px] mt-1" style={{ color: '#BBBBBB' }}>加權：蛋白40% + 碳水35% + 脂肪25%</p>
            </div>
            <SemiGauge value={rate} size={90} />
          </div>

          {/* 三格位置條 */}
          <div className="relative mt-6 mb-3">
            <motion.div
              className="absolute -top-5 z-10"
              initial={{ left: '0%' }}
              animate={{ left: '50%' }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
              style={{ transform: 'translateX(-50%)' }}
            >
              <span className="text-[11px] px-2.5 py-1 rounded-full text-white font-medium whitespace-nowrap" style={{ background: '#E8916A' }}>
                你 ▼
              </span>
            </motion.div>
            <div className="flex rounded-full overflow-hidden" style={{ height: 48 }}>
              <div className="flex items-center justify-center gap-1" style={{ width: '30%', background: '#F0EDE8' }}>
                <span className="text-xs" style={{ color: '#8A8A8A' }}>📉 低增值區</span>
              </div>
              <div className="flex items-center justify-center gap-1" style={{ width: '40%', background: '#5BB5A2' }}>
                <span className="text-[13px] font-bold text-white">📈 成長區</span>
              </div>
              <div className="flex items-center justify-center gap-1" style={{ width: '30%', background: '#FFFBEA', border: '1px solid #F5C842' }}>
                <span className="text-xs" style={{ color: '#9A8420' }}>⭐ 高值區</span>
              </div>
            </div>
          </div>

          {/* 排名說明 */}
          <p className="text-xs leading-relaxed mb-3" style={{ color: '#8A8A8A' }}>
            你的健康資產表現領先 <span className="font-bold" style={{ color: '#E8916A' }}>{community.percentile}%</span> 的同期夥伴
            <br />
            目前位於 <span className="font-bold" style={{ color: '#5BB5A2' }}>{community.rank} 成長區</span>，保持優勢！
          </p>

          {/* 競爭者分布 */}
          <p className="text-xs mb-2" style={{ color: '#8A8A8A' }}>今日挑戰者分布</p>
          <div className="relative">
            <div className="flex text-[11px] mb-1">
              <div className="text-center" style={{ width: `${community.distribution.low.pct}%`, color: '#8A8A8A' }}>{community.distribution.low.count}人</div>
              <div className="text-center" style={{ width: `${community.distribution.mid.pct}%`, color: '#E8916A' }}>{community.distribution.mid.count}人</div>
              <div className="text-center" style={{ width: `${community.distribution.high.pct}%`, color: '#5BB5A2' }}>{community.distribution.high.count}人</div>
            </div>
            <DistBar />
            <motion.div
              className="absolute"
              style={{ top: '100%', transform: 'translateX(-50%)', color: '#E8916A', fontSize: 10 }}
              initial={{ left: '17.5%', opacity: 0 }}
              animate={{ left: `${triLeft}%`, opacity: 1 }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
            >
              ▲
            </motion.div>
          </div>

          {/* 計算方式 accordion */}
          <button onClick={() => setExplainOpen((v) => !v)} className="mt-5 text-xs font-medium underline flex items-center gap-1" style={{ color: '#5BB5A2' }}>
            了解計算方式 <ChevronDown size={13} style={{ transform: explainOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
          <AnimatePresence>
            {explainOpen && (
              <motion.p
                className="text-[11px] leading-relaxed mt-2 rounded-lg p-3"
                style={{ background: '#FAFAFA', color: '#8A8A8A' }}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                完成率 = 蛋白質達成率×40% + 碳水化合物達成率×35% + 脂肪達成率×25%。每日 23:59 結算，與今日所有參賽者即時比較排名。超過目標值 cap 在 100%。
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ===== 區塊三：健康成就收藏館 ===== */}
        <motion.div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }} {...stagger(3)}>
          <p className="text-sm font-bold mb-4">健康成就收藏館</p>
          <div className="grid grid-cols-4 gap-2">
            {achievements.map((a, i) => (
              <AchievementBadge key={i} achievement={a} onLockedClick={(ach) => setModal({ type: 'achievement', data: ach })} />
            ))}
          </div>
          <p className="text-[11px] text-center mt-3" style={{ color: '#BBBBBB' }}>點擊已解鎖徽章慶祝一下 🎉</p>
        </motion.div>

        {/* ===== 區塊四：群組動態 ===== */}
        <motion.div {...stagger(4)}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold">群組動態 & 挑戰更新</p>
            <span className="text-xs" style={{ color: '#5BB5A2' }}>全部 ›</span>
          </div>
          <div className="space-y-3">
            {feed.map((f) => (
              <div key={f.id} className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div className="flex gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0" style={{ background: f.avatarBg }}>
                    {f.avatar || f.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold" style={{ color: '#2C2C2C' }}>{f.name}</span>
                      <span className="text-xs" style={{ color: '#BBBBBB' }}>{f.time}</span>
                    </div>
                    <p className="text-sm leading-relaxed mt-0.5" style={{ color: '#5A5A5A' }}>{f.content}</p>

                    {/* 官方：迷你分布圖 */}
                    {f.distBar && (
                      <div className="mt-2.5">
                        <DistBar height={32} />
                      </div>
                    )}
                    {/* Lily：迷你進度 */}
                    {f.miniProgress && (
                      <div className="mt-2.5 flex items-center gap-2">
                        <div className="rounded-full overflow-hidden" style={{ width: 80, height: 12, background: '#F0EDE8' }}>
                          <div className="h-full rounded-full" style={{ width: `${f.miniProgress}%`, background: 'linear-gradient(90deg, #5BB5A2, #7FCBB9)' }} />
                        </div>
                        <span className="text-xs font-medium" style={{ color: '#5BB5A2' }}>{f.miniProgress}%</span>
                      </div>
                    )}
                    {/* Jason：InBody 分數 */}
                    {f.inbodyBadge && (
                      <span className="inline-block mt-2.5 text-xs px-3 py-1 rounded-full" style={{ background: '#EAF6F3', color: '#5BB5A2' }}>
                        InBody 分數 {f.inbodyBadge} 🎯
                      </span>
                    )}

                    <div className="flex items-center gap-4 mt-3 pt-2 border-t" style={{ borderColor: '#F5F2ED' }}>
                      <span className="flex items-center gap-1 text-xs" style={{ color: '#8A8A8A' }}><Heart size={14} /> 讚</span>
                      <span className="flex items-center gap-1 text-xs" style={{ color: '#8A8A8A' }}><MessageCircle size={14} /> 留言</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setCommunityExpanded((v) => !v)} className="w-full mt-3 py-2 text-sm font-medium" style={{ color: '#5BB5A2' }}>
            {communityExpanded ? '收合 ↑' : '查看更多'}
          </button>
        </motion.div>
      </div>
    </div>
  )
}
