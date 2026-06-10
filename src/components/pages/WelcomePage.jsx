import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Home, ChevronRight, ArrowRight } from 'lucide-react'

const FULL_TEXT = '早安，Alex 👋'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 1.4 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function WelcomePage({ onSyncInbody, onEnterMain }) {
  const [typed, setTyped] = useState('')
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    let i = 0
    const start = setTimeout(() => {
      const timer = setInterval(() => {
        i += 1
        setTyped(FULL_TEXT.slice(0, i))
        if (i >= FULL_TEXT.length) clearInterval(timer)
      }, 80)
    }, 300)
    return () => clearTimeout(start)
  }, [])

  const handleSync = () => {
    if (syncing) return
    setSyncing(true)
    setTimeout(() => onSyncInbody(), 800)
  }

  return (
    <div className="min-h-screen" style={{ background: '#FAF7F2' }}>
      {/* 區塊一：品牌列 */}
      <motion.div
        className="flex items-center justify-between px-5 bg-white"
        style={{ height: 56, borderBottom: '0.5px solid #F0EDE8' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: '#5BB5A2' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 13 L6 9 L9 11 L16 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 4 L16 4 L16 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-sm font-bold" style={{ color: '#2C2C2C' }}>營養複利計畫</span>
        </div>
        <div className="relative">
          <Bell size={20} color="#8A8A8A" />
          <span className="absolute -top-0.5 -right-0.5 rounded-full" style={{ width: 8, height: 8, background: '#E8916A' }} />
        </div>
      </motion.div>

      {/* 區塊二：問候 */}
      <div className="px-6 pt-10">
        <h1 className="text-3xl font-extrabold" style={{ color: '#2C2C2C', minHeight: 40 }}>
          {typed}
          <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.6, repeat: Infinity }} style={{ color: '#5BB5A2' }}>
            {typed.length < FULL_TEXT.length ? '|' : ''}
          </motion.span>
        </h1>
        <motion.p
          className="text-base mt-2 leading-relaxed"
          style={{ color: '#8A8A8A' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.4 }}
        >
          今天是你健康複利計畫的 <span className="font-bold" style={{ color: '#E8916A' }}>第 7 天</span>，繼續保持！🌱
        </motion.p>
        <motion.p
          className="text-[13px] mt-2 flex items-center gap-1"
          style={{ color: '#BBBBBB' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.3 }}
        >
          📅 2026年6月6日・星期六・09:41
        </motion.p>
      </div>

      {/* 區塊三~五：staggered */}
      <motion.div className="px-6 pt-6 space-y-5" variants={container} initial="hidden" animate="show">
        {/* 今日狀態速覽 */}
        <motion.div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }} variants={item}>
          <p className="text-sm font-bold mb-4" style={{ color: '#2C2C2C' }}>昨日成果回顧</p>
          <div className="flex items-stretch">
            {[
              { big: '7', unit: '天', label: '連續記錄', color: '#5BB5A2' },
              { big: '85', unit: '%', label: '昨日完成率', color: '#E8916A' },
              { big: '前15%', unit: '', label: '社群排名', color: '#5BB5A2' },
            ].map((s, i) => (
              <div key={s.label} className="flex-1 text-center relative">
                {i > 0 && <div className="absolute left-0 top-1 bottom-1" style={{ width: '0.5px', background: '#F0EDE8' }} />}
                <p className="leading-none">
                  <span className="font-bold" style={{ color: s.color, fontSize: s.unit ? 28 : 20 }}>{s.big}</span>
                  {s.unit && <span className="text-sm ml-0.5" style={{ color: '#8A8A8A' }}>{s.unit}</span>}
                </p>
                <p className="text-xs mt-1.5" style={{ color: '#BBBBBB' }}>{s.label}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '0.5px solid #F0EDE8' }}>
            <span className="text-[13px]" style={{ color: '#2C2C2C' }}>🔥 本週連續達標 5 天</span>
            <span className="text-xs" style={{ color: '#5BB5A2' }}>查看詳情 ›</span>
          </div>
        </motion.div>

        {/* InBody 通知橫幅 */}
        <motion.div
          className="rounded-2xl p-4 flex items-center justify-between"
          style={{ background: 'linear-gradient(135deg, #EAF6F3, #D4F0E8)', borderLeft: '4px solid #5BB5A2' }}
          variants={item}
        >
          <div className="flex-1">
            <span className="text-[11px] font-bold text-white px-2 py-1 rounded-md" style={{ background: '#5BB5A2' }}>InBody</span>
            <p className="text-[15px] font-bold mt-2" style={{ color: '#2C2C2C' }}>偵測到新的量測數據</p>
            <p className="text-xs" style={{ color: '#8A8A8A' }}>今日 09:35・東吳大學健身中心</p>
            <span className="inline-block mt-2 text-xs px-3 py-1 rounded-full bg-white" style={{ color: '#5BB5A2', border: '1px solid #5BB5A2' }}>
              ✓ 數據已就緒，等待導入
            </span>
          </div>
          <div className="relative flex items-center justify-center" style={{ width: 24, height: 24 }}>
            <motion.div
              className="absolute rounded-full"
              style={{ width: 24, height: 24, background: '#5BB5A2' }}
              animate={{ scale: [1, 2], opacity: [0.25, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
            />
            <div className="rounded-full" style={{ width: 12, height: 12, background: '#5BB5A2' }} />
          </div>
        </motion.div>

        {/* 行動按鈕區 */}
        <motion.div variants={item}>
          <p className="text-[13px] text-center mb-4" style={{ color: '#8A8A8A' }}>選擇今日開始方式</p>

          {/* 按鈕一：同步 */}
          <motion.button
            onClick={handleSync}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-[20px] p-5 text-left transition-colors duration-300"
            style={{
              background: syncing ? '#5BB5A2' : 'white',
              border: '2px solid #5BB5A2',
              boxShadow: '0 4px 20px rgba(91,181,162,0.2)',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-base font-bold" style={{ color: syncing ? 'white' : '#2C2C2C' }}>
                🔗 從 InBody 雲端自動同步
              </span>
              {!syncing && (
                <span className="text-[11px] font-medium text-white px-2.5 py-1 rounded-full" style={{ background: '#5BB5A2' }}>推薦</span>
              )}
            </div>
            <p className="text-[13px] mt-2 leading-relaxed" style={{ color: syncing ? 'rgba(255,255,255,0.85)' : '#8A8A8A' }}>
              InBody 量測完成後，數據自動傳輸至雲端，一鍵同步，無需手動輸入任何數值。
            </p>
            <div className="flex items-center justify-between mt-3">
              <div className="flex gap-1.5">
                {['⚡ 自動', '🔒 加密', '✓ 即時'].map((b) => (
                  <span
                    key={b}
                    className="text-[11px] px-2 py-0.5 rounded-full"
                    style={{ background: syncing ? 'rgba(255,255,255,0.2)' : '#EAF6F3', color: syncing ? 'white' : '#5BB5A2' }}
                  >
                    {b}
                  </span>
                ))}
              </div>
              {syncing ? (
                <motion.div
                  style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white' }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                />
              ) : (
                <span className="text-[13px] font-semibold flex items-center gap-0.5" style={{ color: '#5BB5A2' }}>
                  立即同步 <ArrowRight size={14} />
                </span>
              )}
            </div>
          </motion.button>

          {/* 分隔 */}
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1" style={{ height: '0.5px', background: '#F0EDE8' }} />
            <span className="text-[13px]" style={{ color: '#BBBBBB' }}>或</span>
            <div className="flex-1" style={{ height: '0.5px', background: '#F0EDE8' }} />
          </div>

          {/* 按鈕二：直接進入 */}
          <motion.button
            onClick={onEnterMain}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-[20px] px-6 py-4 flex items-center justify-between"
            style={{ background: 'white', border: '1.5px solid #F0EDE8' }}
          >
            <div className="flex items-center gap-3">
              <Home size={20} color="#8A8A8A" />
              <div className="text-left">
                <p className="text-[15px] font-semibold" style={{ color: '#2C2C2C' }}>直接進入主頁面</p>
                <p className="text-xs mt-0.5" style={{ color: '#BBBBBB' }}>使用上次同步的數據繼續</p>
              </div>
            </div>
            <ChevronRight size={20} color="#BBBBBB" />
          </motion.button>
        </motion.div>

        {/* 底部說明 */}
        <motion.div className="text-center pb-10" variants={item}>
          <p className="text-xs" style={{ color: '#BBBBBB' }}>🔐 你的健康數據受到端對端加密保護</p>
          <p className="text-[11px] mt-1" style={{ color: '#BBBBBB' }}>數據來源：InBody 官方 API・Apple Health・Garmin Connect</p>
        </motion.div>
      </motion.div>
    </div>
  )
}
