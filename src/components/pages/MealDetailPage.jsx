import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { recommendedMeal, alternateMeals } from '../../data/mockData'

export default function MealDetailPage({
  mealAdded,
  setMealAdded,
  selectedMeal,
  setSelectedMeal,
  navigate,
}) {
  const handleAdd = () => {
    setMealAdded(true)
    setTimeout(() => navigate('home', 'main'), 2000)
  }

  return (
    <div className="min-h-screen pb-8" style={{ background: '#FAF7F2' }}>
      {/* ===== 全幅照片 Hero ===== */}
      <div className="relative h-64">
        <img
          src={recommendedMeal.image}
          alt={recommendedMeal.name}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgba(20,30,28,0.88) 0%, rgba(20,30,28,0.2) 50%, rgba(20,30,28,0.35) 100%)',
          }}
        />
        {/* 返回 */}
        <button
          onClick={() => navigate('home', 'main')}
          className="absolute top-4 left-4 flex items-center gap-1 text-sm font-medium text-white px-3 py-1.5 rounded-full"
          style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)' }}
        >
          <ArrowLeft size={16} />
          返回
        </button>
        <span
          className="absolute top-4 right-4 flex items-center gap-1 text-xs font-semibold text-white px-2.5 py-1 rounded-full"
          style={{ background: 'linear-gradient(135deg, #E8916A, #F5C842)' }}
        >
          <Sparkles size={12} /> AI 為你精選
        </span>
        {/* 標題 */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h2 className="text-2xl font-bold mb-1 drop-shadow">{recommendedMeal.name}</h2>
          <p className="text-sm opacity-90">依據你的剩餘營養缺口，精準配對</p>
        </div>
      </div>

      <div className="px-4 -mt-4 relative space-y-4">
        {/* macro 卡片 */}
        <motion.div
          className="bg-white rounded-2xl p-4"
          style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { l: '蛋白質', v: `${recommendedMeal.protein}g`, c: '#5BB5A2', bg: '#EAF6F3' },
              { l: '碳水', v: `${recommendedMeal.carbs}g`, c: '#E8916A', bg: '#FDF0E8' },
              { l: '脂肪', v: `${recommendedMeal.fat}g`, c: '#C9A882', bg: '#F7F1E8' },
              { l: '熱量', v: `${recommendedMeal.calories}`, c: '#6FA8DC', bg: '#EAF2FB' },
            ].map((m) => (
              <div key={m.l} className="rounded-xl py-2.5 text-center" style={{ background: m.bg }}>
                <p className="text-base font-extrabold" style={{ color: m.c }}>
                  {m.v}
                </p>
                <p className="text-[11px] text-gray-400">{m.l}</p>
              </div>
            ))}
          </div>

          {/* AI 推薦理由 */}
          <div
            className="rounded-xl p-3 mb-4"
            style={{ background: 'linear-gradient(135deg, #EAF6F3, #F0F8F6)' }}
          >
            <p className="text-sm leading-relaxed" style={{ color: '#2C2C2C' }}>
              🧠 <span className="font-semibold">AI 建議：</span>
              {recommendedMeal.reason}
            </p>
          </div>

          {/* 加入按鈕 */}
          <motion.button
            onClick={handleAdd}
            disabled={mealAdded}
            className="w-full py-4 rounded-full text-white font-semibold text-base transition-all duration-300"
            style={{
              background: mealAdded
                ? '#4A9A89'
                : 'linear-gradient(135deg, #5BB5A2, #4A9A89)',
              boxShadow: mealAdded ? 'none' : '0 6px 18px rgba(91,181,162,0.45)',
            }}
            whileTap={{ scale: 0.97 }}
          >
            {mealAdded ? '✓ 已加入餐盤！' : '加入我的餐盤'}
          </motion.button>
        </motion.div>

        {/* 替代餐點 */}
        <h3 className="text-sm font-bold" style={{ color: '#2C2C2C' }}>
          其他推薦選項
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {alternateMeals.map((meal, i) => {
            const active = selectedMeal === meal.name
            const dimmed = selectedMeal && !active
            return (
              <motion.div
                key={meal.name}
                className="bg-white rounded-2xl overflow-hidden transition-all"
                style={{
                  boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                  opacity: dimmed ? 0.55 : 1,
                  border: active ? '2px solid #5BB5A2' : '2px solid transparent',
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: dimmed ? 0.55 : 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="relative h-24">
                  <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
                  {active && (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ background: 'rgba(91,181,162,0.45)' }}
                    >
                      <span className="text-white text-2xl">✓</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold mb-0.5" style={{ color: '#2C2C2C' }}>
                    {meal.name}
                  </p>
                  <p className="text-xs mb-2.5" style={{ color: '#8A8A8A' }}>
                    {meal.protein}g 蛋白 · {meal.calories} kcal
                  </p>
                  <button
                    onClick={() => setSelectedMeal(meal.name)}
                    className="w-full py-2 rounded-full text-sm font-medium transition-all duration-200"
                    style={{
                      background: active ? 'linear-gradient(135deg, #5BB5A2, #4A9A89)' : 'white',
                      color: active ? 'white' : '#5BB5A2',
                      border: '1.5px solid #5BB5A2',
                    }}
                  >
                    {active ? '✓ 已選擇' : '選擇這道'}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
