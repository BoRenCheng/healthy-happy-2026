import { motion } from 'framer-motion'
import { CheckCircle, Plus, TrendingUp, Activity, Flame } from 'lucide-react'
import HorizontalBar from '../ui/HorizontalBar'
import TrendChart from '../ui/TrendChart'
import { assetReserve, advisorMessage } from '../../data/mockData'

export default function PlanPage({
  navigate,
  advisorAdopted,
  setAdvisorAdopted,
  advisorBudgetAdded,
  setAdvisorBudgetAdded,
  trendExpanded,
  setTrendExpanded,
}) {
  const stagger = (i) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: i * 0.08 },
  })

  return (
    <div className="px-4 pt-4 pb-24 space-y-4">
      <motion.h1 className="text-2xl font-bold" {...stagger(0)}>
        動態營養導航
      </motion.h1>

      {/* 已同步 */}
      <motion.div
        className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm"
        style={{ background: '#EAF6F3' }}
        {...stagger(1)}
      >
        <CheckCircle size={16} color="#5BB5A2" />
        <span className="text-gray-600 flex-1">已同步：今日活動數據（Apple Watch / Garmin）</span>
      </motion.div>

      {/* 活動預警 */}
      <motion.div
        className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
        style={{ background: '#FDF0E8' }}
        {...stagger(2)}
      >
        <Flame size={18} color="#E8916A" />
        <span style={{ color: '#E8916A' }} className="font-medium">
          偵測到額外 {advisorMessage.activityBonus} 活動，動態能量補償已啟動！
        </span>
      </motion.div>

      {/* 生理資產儲備 */}
      <motion.div
        className="bg-white rounded-2xl p-4 space-y-4"
        style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}
        {...stagger(3)}
      >
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">生理資產儲備</p>
          <Activity size={16} color="#5BB5A2" />
        </div>
        <HorizontalBar
          label="今日總熱量配置"
          value={assetReserve.overallPct}
          max={100}
          color="#5BB5A2"
          suffix="%"
        />
        <div className="grid grid-cols-2 gap-4 pt-1">
          <div
            className="rounded-xl p-3"
            style={{ background: 'linear-gradient(135deg, #FDF0E8, #FFF6EE)' }}
          >
            <p
              className="text-3xl font-extrabold leading-none"
              style={{
                background: 'linear-gradient(135deg, #E8916A, #F5C842)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {assetReserve.carbsRemaining}
              <span className="text-base font-bold">g</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">碳水化合物剩餘</p>
          </div>
          <div
            className="rounded-xl p-3"
            style={{ background: 'linear-gradient(135deg, #EAF6F3, #F0F8F6)' }}
          >
            <p
              className="text-3xl font-extrabold leading-none"
              style={{
                background: 'linear-gradient(135deg, #5BB5A2, #7FCBB9)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {assetReserve.proteinRemaining}
              <span className="text-base font-bold">g</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">蛋白質剩餘</p>
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg"
          style={{ background: '#F0F8F6', color: '#5BB5A2' }}
        >
          <TrendingUp size={14} />
          預算增加：+碳水 {assetReserve.budgetAdd.carb}g｜+蛋白 {assetReserve.budgetAdd.protein}g（因活動）
        </div>
      </motion.div>

      {/* 健康顧問建議 */}
      <motion.div
        className="rounded-2xl p-4"
        style={{ background: 'linear-gradient(135deg, #FDF0E8 0%, #FFF6EE 60%, #FFFBEA 100%)', border: '1px solid #FBE2D3' }}
        {...stagger(4)}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">🧑‍⚕️</span>
          <p className="text-sm font-bold" style={{ color: '#2C2C2C' }}>
            健康顧問建議
          </p>
        </div>
        <p className="text-sm leading-relaxed mb-4" style={{ color: '#5A5A5A' }}>
          {advisorMessage.text}
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setAdvisorAdopted(true)}
            className="flex-1 py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-1 transition-all"
            style={{
              background: advisorAdopted ? '#4A9A89' : 'linear-gradient(135deg, #5BB5A2, #4A9A89)',
              color: 'white',
              boxShadow: advisorAdopted ? 'none' : '0 4px 12px rgba(91,181,162,0.35)',
            }}
          >
            <CheckCircle size={15} /> {advisorAdopted ? '已採用' : '確認採用'}
          </button>
          <button
            onClick={() => setAdvisorBudgetAdded(true)}
            className="flex-1 py-2.5 rounded-full text-sm font-semibold flex items-center justify-center gap-1 transition-all"
            style={{
              background: advisorBudgetAdded ? '#FBE2D3' : 'white',
              color: '#E8916A',
              border: '1.5px solid #E8916A',
            }}
          >
            <Plus size={15} /> {advisorBudgetAdded ? '已加入' : '一鍵加入預算'}
          </button>
        </div>
      </motion.div>

      {/* 資產趨勢預覽 */}
      <motion.div
        className="bg-white rounded-2xl p-4"
        style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}
        {...stagger(5)}
      >
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold">資產趨勢預覽</p>
          <TrendingUp size={16} color="#5BB5A2" />
        </div>
        <TrendChart height={trendExpanded ? 200 : 140} />
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setTrendExpanded((v) => !v)}
            className="flex-1 py-2.5 rounded-full text-sm font-medium transition-all"
            style={{ background: '#F0F8F6', color: '#5BB5A2' }}
          >
            {trendExpanded ? '收合趨勢' : '查看詳細趨勢'}
          </button>
          <button
            onClick={() => navigate('home', 'meal-detail')}
            className="flex-1 py-2.5 rounded-full text-sm font-medium text-white transition-all"
            style={{ background: '#5BB5A2' }}
          >
            快速記錄餐點
          </button>
        </div>
      </motion.div>
    </div>
  )
}
