import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Utensils, Camera, FileText, Users, Bell, TrendingUp, Sparkles } from 'lucide-react'
import CapsuleProgress from '../ui/CapsuleProgress'
import TrendChart from '../ui/TrendChart'
import { user, recommendedMeal } from '../../data/mockData'

function RemainingTag({ label, value, unit, color, total }) {
  const isOver = value <= 0
  return (
    <div
      className="flex items-center gap-1 px-2.5 py-1 rounded-full"
      style={{ background: isOver ? '#FDF0E8' : '#F5F5F5', border: `1px solid ${isOver ? '#E8916A' : '#F0EDE8'}` }}
    >
      <span className="text-xs" style={{ color: '#8A8A8A' }}>{label}</span>
      <span className="text-[13px] font-bold" style={{ color: isOver ? '#E8916A' : color }}>
        {isOver ? '已達標 ✓' : `剩 ${value}${unit}`}
      </span>
    </div>
  )
}

function NutrientMini({ label, value }) {
  return (
    <span className="text-[11px] px-1.5 py-0.5 rounded-full" style={{ background: '#F5F5F5', color: '#8A8A8A' }}>
      {label} {value}{label === 'kcal' ? '' : 'g'}
    </span>
  )
}

// 餐點縮圖（真實照片，載入失敗 fallback 到 emoji）
function MealThumb({ meal, size = 52 }) {
  const [err, setErr] = useState(false)
  if (!meal.image || err) {
    return (
      <div className="rounded-xl flex items-center justify-center flex-shrink-0" style={{ width: size, height: size, background: '#EAF6F3', fontSize: size * 0.48 }}>
        {meal.emoji}
      </div>
    )
  }
  return <img src={meal.image} alt={meal.name} onError={() => setErr(true)} className="rounded-xl object-cover flex-shrink-0" style={{ width: size, height: size }} />
}

export default function HomePage({
  mealAdded,
  navigate,
  setModal,
  openFoodLog,
  onReplaySync,
  currentNutrition,
  nutritionUpdated,
  showNextMealSuggestion,
  remainingNutrition,
  recommendedMeals = [],
}) {
  const [addedMeals, setAddedMeals] = useState([])
  const stagger = (i) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: i * 0.08 },
  })

  return (
    <div className="pb-24">
      {/* ===== 漸層 Hero ===== */}
      <motion.div
        className="relative overflow-hidden px-5 pt-5 pb-6 text-white"
        style={{
          background: 'linear-gradient(140deg, #4A9A89 0%, #5BB5A2 55%, #7FCBB9 100%)',
          borderBottomLeftRadius: 28,
          borderBottomRightRadius: 28,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="absolute rounded-full" style={{ width: 180, height: 180, top: -60, right: -40, background: 'rgba(255,255,255,0.16)', filter: 'blur(8px)' }} />
        <div className="absolute rounded-full" style={{ width: 120, height: 120, bottom: -50, left: -30, background: 'rgba(255,255,255,0.10)' }} />

        <div className="relative flex items-center justify-between mb-5">
          <div>
            <p className="text-sm opacity-90">2026 年 6 月 6 日 · 週六</p>
            <h1 className="text-2xl font-bold">早安，{user.name} 👋</h1>
          </div>
          <div className="flex items-center gap-3">
            <Bell size={22} color="rgba(255,255,255,0.9)" />
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: 'rgba(255,255,255,0.25)', border: '1.5px solid rgba(255,255,255,0.5)' }}>
              {user.avatar}
            </div>
          </div>
        </div>

        <div className="relative flex items-end justify-between mb-4">
          <div>
            <p className="text-xs opacity-85 mb-0.5">InBody 健康分數</p>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-extrabold leading-none">{user.inbodyScore}</span>
              <span className="text-sm opacity-85 mb-1">/ 100</span>
              <span className="flex items-center gap-0.5 text-xs font-semibold mb-1.5 px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.22)' }}>
                <TrendingUp size={12} /> +3
              </span>
            </div>
          </div>
        </div>

        <div className="relative grid grid-cols-3 gap-2 mb-4">
          {[
            { k: '體脂率', v: `${user.bodyFat}%` },
            { k: '骨骼肌量', v: `${user.muscleMass}kg` },
            { k: '基礎代謝', v: `${user.bmr}` },
          ].map((s) => (
            <div key={s.k} className="rounded-xl px-3 py-2 text-center" style={{ background: 'rgba(255,255,255,0.18)' }}>
              <p className="text-base font-bold leading-tight">{s.v}</p>
              <p className="text-[11px] opacity-85">{s.k}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onReplaySync}
          className="relative w-full flex items-center gap-2 px-3 py-2 rounded-full text-xs active:scale-[0.98] transition-transform"
          style={{ background: 'rgba(255,255,255,0.2)' }}
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-white opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
          <span className="flex-1 text-left">InBody & 穿戴裝置同步中 · 已更新</span>
          <span className="opacity-80">查看 ›</span>
        </button>
      </motion.div>

      <div className="px-4 pt-5 space-y-4">
        {/* 今日營養預算 */}
        <motion.div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }} {...stagger(2)}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold" style={{ color: '#2C2C2C' }}>今日營養預算</p>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#EAF6F3', color: '#5BB5A2' }}>生理資產總覽</span>
          </div>
          <div className="flex justify-around">
            <CapsuleProgress key={`${nutritionUpdated}-p`} label="蛋白質" current={currentNutrition.protein.current} goal={currentNutrition.protein.goal} color="#5BB5A2" color2="#7FCBB9" drop={nutritionUpdated} />
            <CapsuleProgress key={`${nutritionUpdated}-c`} label="碳水化合物" current={currentNutrition.carbs.current} goal={currentNutrition.carbs.goal} color="#E8916A" color2="#F5C842" drop={nutritionUpdated} />
            <CapsuleProgress key={`${nutritionUpdated}-f`} label="脂肪" current={currentNutrition.fat.current} goal={currentNutrition.fat.goal} color="#C9A882" color2="#E0C9A8" drop={nutritionUpdated} />
          </div>
        </motion.div>

        {/* 記錄飲食後：剩餘預算 + 動態下一餐建議 */}
        <AnimatePresence>
          {showNextMealSuggestion && (
            <motion.div
              className="bg-white rounded-2xl p-4"
              style={{ boxShadow: '0 4px 20px rgba(91,181,162,0.18)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold" style={{ color: '#2C2C2C' }}>🍽 剩餘預算下一餐建議</p>
                <span className="text-xs font-semibold" style={{ color: '#5BB5A2' }}>
                  剩餘 {remainingNutrition.calories.toLocaleString()} kcal
                </span>
              </div>

              <div className="flex gap-2 flex-wrap mb-4">
                <RemainingTag label="蛋白質" value={remainingNutrition.protein} unit="g" color="#5BB5A2" total={currentNutrition.protein.goal} />
                <RemainingTag label="碳水" value={remainingNutrition.carbs} unit="g" color="#E8916A" total={currentNutrition.carbs.goal} />
                <RemainingTag label="脂肪" value={remainingNutrition.fat} unit="g" color="#C9A882" total={currentNutrition.fat.goal} />
              </div>

              {recommendedMeals.map((meal, i) => {
                const added = addedMeals.includes(meal.name)
                return (
                  <motion.div
                    key={meal.name}
                    className="flex items-center gap-3 py-3"
                    style={{ borderBottom: i < recommendedMeals.length - 1 ? '0.5px solid #F0EDE8' : 'none' }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.15 }}
                  >
                    <MealThumb meal={meal} size={52} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold" style={{ color: '#2C2C2C' }}>{meal.name}</p>
                      <div className="flex gap-1.5 my-1 flex-wrap">
                        <NutrientMini label="蛋白" value={meal.protein} />
                        <NutrientMini label="碳水" value={meal.carbs} />
                        <NutrientMini label="脂肪" value={meal.fat} />
                        <NutrientMini label="kcal" value={meal.calories} />
                      </div>
                      <p className="text-xs leading-snug" style={{ color: '#8A8A8A' }}>{meal.reason}</p>
                    </div>
                    <button
                      onClick={() => setAddedMeals((prev) => (prev.includes(meal.name) ? prev : [...prev, meal.name]))}
                      className="text-xs font-semibold px-3.5 py-1.5 rounded-full flex-shrink-0 transition-colors"
                      style={{ background: added ? '#EAF6F3' : '#5BB5A2', color: added ? '#5BB5A2' : 'white' }}
                    >
                      {added ? '✓ 已加入' : '加入'}
                    </button>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 下一餐建議（真實照片） */}
        <motion.div {...stagger(3)}>
          <p className="text-sm font-bold mb-2" style={{ color: '#2C2C2C' }}>下一餐建議</p>
          <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 4px 20px rgba(91,181,162,0.18)' }}>
            <div className="relative h-44">
              <img src={recommendedMeal.image} alt={recommendedMeal.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(20,30,28,0.82) 0%, rgba(20,30,28,0.25) 45%, rgba(20,30,28,0) 100%)' }} />
              <span className="absolute top-3 left-3 flex items-center gap-1 text-xs font-semibold text-white px-2.5 py-1 rounded-full" style={{ background: 'linear-gradient(135deg, #E8916A, #F5C842)' }}>
                <Sparkles size={12} /> AI 為你精選
              </span>
              <span className="absolute top-3 right-3 text-xs font-bold text-white px-2.5 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.35)' }}>
                {recommendedMeal.calories} kcal
              </span>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-lg font-bold mb-1.5 drop-shadow">{recommendedMeal.name}</p>
                <div className="flex gap-1.5">
                  {[`蛋白 ${recommendedMeal.protein}g`, `碳水 ${recommendedMeal.carbs}g`, `脂肪 ${recommendedMeal.fat}g`].map((m) => (
                    <span key={m} className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.22)' }}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {recommendedMeal.traits.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#F0F8F6', color: '#5BB5A2' }}>#{t}</span>
                ))}
              </div>
              <button
                onClick={() => navigate('home', 'meal-detail')}
                className="w-full py-3 rounded-full text-sm font-semibold transition-all duration-200 active:scale-95"
                style={{
                  background: mealAdded ? '#EAF6F3' : 'linear-gradient(135deg, #5BB5A2, #4A9A89)',
                  color: mealAdded ? '#5BB5A2' : 'white',
                  boxShadow: mealAdded ? 'none' : '0 4px 14px rgba(91,181,162,0.4)',
                }}
              >
                {mealAdded ? '✓ 已記錄' : '查看完整餐點細節'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* 提醒條 */}
        <motion.div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm" style={{ background: 'linear-gradient(135deg, #FDF0E8, #FFF6EE)' }} {...stagger(4)}>
          <span>⚠️</span>
          <span style={{ color: '#E8916A' }}>提醒：昨日數據未完全同步，請檢查設備。</span>
        </motion.div>

        {/* 趨勢卡片 */}
        <motion.div className="bg-white rounded-2xl p-4 cursor-pointer" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }} onClick={() => navigate('plan')} {...stagger(5)}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold" style={{ color: '#2C2C2C' }}>肌肉 / 恢復趨勢</p>
            <span className="text-xs" style={{ color: '#8A8A8A' }}>7 天趨勢 ›</span>
          </div>
          <TrendChart height={100} />
        </motion.div>

        {/* 快捷功能 */}
        <motion.div className="grid grid-cols-4 gap-3" {...stagger(6)}>
          {[
            { icon: Utensils, label: '記錄飲食', g: 'linear-gradient(135deg, #5BB5A2, #7FCBB9)', onClick: openFoodLog },
            { icon: Camera, label: '掃描食物', g: 'linear-gradient(135deg, #E8916A, #F5C842)', onClick: () => setModal({ type: 'scanner' }) },
            { icon: FileText, label: '健康報告', g: 'linear-gradient(135deg, #6FA8DC, #5BB5A2)', onClick: () => navigate('profile') },
            { icon: Users, label: '社區挑戰', g: 'linear-gradient(135deg, #C9A882, #E0C9A8)', onClick: () => navigate('home', 'community') },
          ].map(({ icon: Icon, label, g, onClick }) => (
            <button key={label} onClick={onClick} className="flex flex-col items-center gap-1.5 transition-transform active:scale-95">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: g, boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}>
                <Icon size={22} color="white" strokeWidth={2} />
              </div>
              <span className="text-xs" style={{ color: '#8A8A8A' }}>{label}</span>
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
