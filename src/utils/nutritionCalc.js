import { foodDatabase } from '../data/foodDatabase'

// 解析語音文字 → 比對食物庫 → 加總營養（失敗時回傳 status:'failed'）
export const parseVoiceInput = (transcript) => {
  // 情境：完全沒說話 / 太短
  if (!transcript || transcript.trim().length < 2) {
    return { status: 'failed', reason: 'empty' }
  }

  let totalProtein = 0
  let totalCarbs = 0
  let totalFat = 0
  let totalCalories = 0
  const matched = []

  foodDatabase.forEach((food) => {
    if (food.keywords.some((kw) => transcript.includes(kw))) {
      totalProtein += food.protein
      totalCarbs += food.carbs
      totalFat += food.fat
      totalCalories += food.calories
      matched.push(food.keywords[0])
    }
  })

  // 情境：辨識到文字但比對不到食物
  if (matched.length === 0) {
    return { status: 'failed', reason: 'no_match', transcript }
  }

  return {
    status: 'success',
    matched,
    protein: Math.round(totalProtein),
    carbs: Math.round(totalCarbs),
    fat: Math.round(totalFat),
    calories: Math.round(totalCalories),
  }
}

// 解析營養標示 OCR 文字 → 提取數值
export const parseNutritionLabel = (text) => {
  const normalized = text
    .replace(/，/g, ',')
    .replace(/：/g, ':')
    .replace(/（/g, '(')
    .replace(/）/g, ')')
    .replace(/\s+/g, ' ')

  const extract = (patterns) => {
    for (const p of patterns) {
      const m = normalized.match(p)
      if (m) return parseFloat(m[1])
    }
    return null
  }

  const calories = extract([/熱量[^\d]*(\d+\.?\d*)/, /Energy[^\d]*(\d+\.?\d*)/i, /calories[^\d]*(\d+\.?\d*)/i])
  const protein = extract([/蛋白質[^\d]*(\d+\.?\d*)/, /Protein[^\d]*(\d+\.?\d*)/i])
  const carbs = extract([/碳水化合物[^\d]*(\d+\.?\d*)/, /醣類[^\d]*(\d+\.?\d*)/, /Carbohydrate[^\d]*(\d+\.?\d*)/i])
  const fat = extract([/脂肪[^\d]*(\d+\.?\d*)/, /Fat[^\d]*(\d+\.?\d*)/i])
  const sodium = extract([/鈉[^\d]*(\d+\.?\d*)/, /Sodium[^\d]*(\d+\.?\d*)/i])

  // 回傳原始值（找不到為 null），交給 validateOCRResult 判斷
  return { calories, protein, carbs, fat, sodium }
}

// 驗證 OCR 結果：完全失敗 / 部分成功 / 數值異常 / 成功
export const validateOCRResult = (result) => {
  const { calories, protein, carbs, fat } = result
  const foundCount = [calories, protein, carbs, fat].filter((v) => v !== null).length

  if (foundCount === 0) {
    return { status: 'failed', reason: 'no_data' }
  }

  if (foundCount < 3) {
    return {
      status: 'partial',
      reason: 'incomplete',
      found: { calories, protein, carbs, fat },
      missing: { calories: calories === null, protein: protein === null, carbs: carbs === null, fat: fat === null },
    }
  }

  const isAbnormal =
    (calories && (calories < 10 || calories > 2000)) ||
    (protein && (protein < 0 || protein > 200)) ||
    (carbs && (carbs < 0 || carbs > 300)) ||
    (fat && (fat < 0 || fat > 150))

  if (isAbnormal) {
    return {
      status: 'partial',
      reason: 'abnormal_values',
      found: { calories, protein, carbs, fat },
      missing: { calories: false, protein: false, carbs: false, fat: false },
    }
  }

  return { status: 'success', found: { calories, protein, carbs, fat } }
}

// 計算剩餘預算
export const calcRemaining = (goal, current) => ({
  protein: Math.max(Math.round(goal.protein - current.protein), 0),
  carbs: Math.max(Math.round(goal.carbs - current.carbs), 0),
  fat: Math.max(Math.round(goal.fat - current.fat), 0),
  calories: Math.max(Math.round(goal.calories - current.calories), 0),
})

// 判斷下一餐主要補充方向
export const getMealDirection = (remaining) => {
  const proteinPct = remaining.protein / 100
  const carbsPct = remaining.carbs / 120
  const fatPct = remaining.fat / 32

  if (proteinPct > carbsPct && proteinPct > fatPct) return 'protein'
  if (carbsPct > proteinPct && carbsPct > fatPct) return 'carbs'
  if (fatPct > 0.3) return 'fat'
  return 'balanced'
}

const mealOptions = {
  protein: [
    { name: '雞胸肉佐花椰菜', emoji: '🍗', image: '/images/meals/chicken_broccoli.jpg', protein: 35, carbs: 8, fat: 5, calories: 220, reason: '高蛋白低碳水，完美補足今日蛋白質缺口' },
    { name: '希臘優格水果碗', emoji: '🥣', image: '/images/meals/yogurt_fruit.jpg', protein: 20, carbs: 25, fat: 3, calories: 210, reason: '優質蛋白搭配天然糖分，輕盈補充' },
    { name: '水煮蛋 + 毛豆', emoji: '🥚', image: '/images/meals/egg_edamame.jpg', protein: 18, carbs: 10, fat: 8, calories: 180, reason: '完整胺基酸組合，蛋白質吸收效率高' },
  ],
  carbs: [
    { name: '地瓜燕麥粥', emoji: '🍠', image: '/images/meals/sweetpotato_oat.jpg', protein: 5, carbs: 45, fat: 2, calories: 220, reason: '優質複合碳水，緩慢釋放能量，避免血糖波動' },
    { name: '香蕉 + 全麥吐司', emoji: '🍌', image: '/images/meals/banana_toast.jpg', protein: 6, carbs: 40, fat: 3, calories: 210, reason: '天然糖分 + 膳食纖維，補充活動後能量' },
    { name: '糙米飯 + 蔬菜', emoji: '🍱', image: '/images/meals/brownrice_veg.jpg', protein: 8, carbs: 50, fat: 3, calories: 260, reason: '高纖維碳水，飽足感強，血糖穩定' },
  ],
  fat: [
    { name: '酪梨鮭魚沙拉', emoji: '🥑', image: '/images/meals/avocado_salmon.jpg', protein: 22, carbs: 10, fat: 18, calories: 290, reason: '富含 Omega-3 與健康不飽和脂肪' },
    { name: '堅果優格碗', emoji: '🌰', image: '/images/meals/nut_yogurt.jpg', protein: 12, carbs: 20, fat: 15, calories: 260, reason: '堅果提供優質脂肪，搭配蛋白質促進吸收' },
    { name: '酪梨蛋吐司', emoji: '🥑', image: '/images/meals/avocado_salmon.jpg', protein: 14, carbs: 22, fat: 16, calories: 280, reason: '健康脂肪搭配蛋白質，飽足又營養' },
  ],
  balanced: [
    { name: '鮭魚糙米飯佐花椰菜', emoji: '🍱', image: '/images/salmon.jpg', protein: 35, carbs: 42, fat: 12, calories: 420, reason: '三大營養素均衡配比，接近今日剩餘缺口' },
    { name: '豆腐蔬菜炒飯', emoji: '🍳', image: '/images/tofu_rice.jpg', protein: 18, carbs: 38, fat: 8, calories: 300, reason: '植物蛋白搭配碳水，清淡易消化' },
    { name: '雞腿便當（少油）', emoji: '🍱', image: '/images/meals/chicken_bento.jpg', protein: 28, carbs: 55, fat: 10, calories: 480, reason: '台灣常見、方便取得的均衡餐點' },
  ],
}

export const getRecommendedMeals = (remaining) => {
  const direction = getMealDirection(remaining)
  return mealOptions[direction].slice(0, 3)
}

// 三大營養素是否同時達標（≥ 90%）
export const checkGoalAchieved = (current, goal) =>
  current.protein / goal.protein >= 0.9 &&
  current.carbs / goal.carbs >= 0.9 &&
  current.fat / goal.fat >= 0.9

// 加權完成率（蛋白40% + 碳水35% + 脂肪25%，各 cap 100）
export const calcCompletionRate = (current, goal) =>
  Math.round(
    Math.min(100, (current.protein / goal.protein) * 100) * 0.4 +
      Math.min(100, (current.carbs / goal.carbs) * 100) * 0.35 +
      Math.min(100, (current.fat / goal.fat) * 100) * 0.25
  )
