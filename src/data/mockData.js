export const user = {
  name: 'Alex',
  avatar: 'A',
  weight: 68.2,
  bodyFat: 22,
  muscleMass: 28.5,
  bmr: 1650,
  inbodyScore: 75,
  metabolicType: '代謝敏感型',
  confidenceIndex: 92,
  communityRank: '前 15%～30%',
  communityPercentile: 70,
}

export const nutrition = {
  totalCalories: 2050,
  consumed: 520,
  protein: { goal: 100, current: 60 },
  carbs: { goal: 120, current: 30 },
  fat: { goal: 32, current: 20 },
}

export const advisorMessage = {
  text: '偵測到額外能量消耗。建議晚餐增加一份雞胸肉沙拉，攝取約 20g 優質蛋白質，以避免肌肉資產流失。',
  proteinBonus: 20,
  carbBonus: 15,
  activityBonus: '5,000 步',
}

// 動態營養導航儀表板用：生理資產儲備（對應簡報「剩餘 40g / 35g」）
export const assetReserve = {
  overallPct: 28,
  carbsRemaining: 40,
  proteinRemaining: 35,
  budgetAdd: { carb: 15, protein: 10 },
}

// 首頁 hero 背景圖
export const heroImage = '/images/hero_food.jpg'

export const recommendedMeal = {
  name: '鮭魚糙米飯佐花椰菜',
  emoji: '🍱',
  image: '/images/salmon.jpg',
  protein: 38,
  carbs: 45,
  fat: 12,
  calories: 480,
  tags: ['鮭魚', '糙米飯', '花椰菜'],
  traits: ['均衡', '高蛋白', '優質', '高纖'],
  reason: '此餐點能補足今日蛋白質與碳水缺口，脂肪控制在合理範圍，非常適合運動後恢復。',
}

export const alternateMeals = [
  {
    name: '雞胸肉藜麥沙拉',
    emoji: '🥗',
    image: '/images/chicken_salad.jpg',
    protein: 42,
    carbs: 35,
    fat: 8,
    calories: 420,
  },
  {
    name: '豆腐蔬菜炒飯',
    emoji: '🍚',
    image: '/images/tofu_rice.jpg',
    protein: 22,
    carbs: 55,
    fat: 10,
    calories: 390,
  },
]

export const radarData = [
  { label: '胰島素敏感性', value: 0.55 },
  { label: '炎症控制', value: 0.7 },
  { label: '營養分配率', value: 0.45 },
  { label: '能量消耗', value: 0.8 },
]

// 代謝個性報告 / 風險檔案
export const metabolicReport = {
  type: '代謝敏感型',
  confidence: 92,
  description:
    '您的代謝對能量攝取極為敏感，這意味著吸收快速，也容易堆積。建議優先關注血糖波動與抗炎管理，建立穩定的代謝節奏。',
  risk: {
    title: '肌肉資本流失風險升高',
    desc: '目前蛋白質攝取可能未能滿足維持肌肉資本的需求，特別是在活動日。長期可能影響代謝率與身體組成。',
  },
  adjustments: [
    {
      icon: '⭐',
      text: '每餐增加一份優質蛋白質來源（如魚、雞胸肉或豆類），以支持肌肉合成。',
    },
    {
      icon: '🔄',
      text: '替代方案：若正餐份量無法增加，可在兩餐之間補充一份高蛋白飲品。',
    },
  ],
}

export const trendData = [
  { day: '週一', protein: 55, carbs: 90 },
  { day: '週二', protein: 62, carbs: 85 },
  { day: '週三', protein: 48, carbs: 100 },
  { day: '週四', protein: 70, carbs: 78 },
  { day: '週五', protein: 65, carbs: 95 },
  { day: '週六', protein: 58, carbs: 88 },
  { day: '週日', protein: 72, carbs: 82 },
]

export const challenge = {
  title: '21 天體脂清償計畫',
  subtitle: '投資健康，複利累積',
  currentDay: 7,
  totalDays: 21,
  progress: 33,
}

export const achievements = [
  {
    icon: '🛡',
    label: '21 天挑戰者',
    points: 150,
    unlocked: false,
    from: '#5BB5A2',
    to: '#4A9A89',
    progress: { current: 7, total: 21, unit: '天' },
    desc: '完成 21 天體脂清償計畫，連續 21 天記錄飲食並達成每日目標。',
  },
  {
    icon: '📅',
    label: '連續打卡 14 天',
    points: 150,
    unlocked: true,
    from: '#F5C842',
    to: '#E8A800',
    desc: '連續 14 天完成飲食記錄，建立穩定的健康習慣。你已解鎖此成就！',
  },
  {
    icon: '🎯',
    label: '目標達成 90%',
    points: 100,
    unlocked: true,
    from: '#E8916A',
    to: '#D4784F',
    desc: '單日三大營養素達成率超過 90%，精準執行你的飲食計畫。你已解鎖此成就！',
  },
  {
    icon: '🧠',
    label: '健康資產達人',
    points: 150,
    unlocked: false,
    from: '#9B8BF4',
    to: '#7B6BD4',
    progress: { current: 3, total: 7, unit: '天' },
    desc: '完整閱讀代謝人格報告，並連續 7 天按照 AI 建議調整飲食。限量成就！',
  },
]

// 健康複利共學社群
export const community = {
  rank: '前 15%～30%',
  percentile: 70,
  distribution: {
    low: { count: 245, pct: 35 },
    mid: { count: 312, pct: 42 },
    high: { count: 168, pct: 23 },
  },
  feed: [
    {
      id: 1,
      type: 'official',
      avatar: '🌿',
      avatarBg: '#5BB5A2',
      name: '健康小助手',
      time: '2 小時前',
      content: '🎉 恭喜！今日已有 168 位夥伴達成 85% 以上的完成率！繼續加油！',
      distBar: true,
    },
    {
      id: 2,
      initial: 'L',
      avatarBg: '#BBBBBB',
      name: 'Lily Wu',
      time: '3 小時前',
      content: '今天感覺超棒！挑戰進行到第 10 天了！💪',
      miniProgress: 88,
    },
    {
      id: 3,
      initial: 'J',
      avatarBg: '#E8916A',
      name: 'Jason Chen',
      time: '5 小時前',
      content: '體重終於突破停滯期！感謝社群支持 💪',
      inbodyBadge: '+3 分',
    },
  ],
}

// 記錄飲食後的「下一餐建議」卡片
export const nextMealSuggestion = {
  remainingCalories: 1072,
  remain: [
    { label: '蛋白質剩餘 2g', color: '#5BB5A2', bg: '#EAF6F3' },
    { label: '碳水剩餘 45g', color: '#E8916A', bg: '#FDF0E8' },
    { label: '脂肪超出 0g', color: '#D9534F', bg: '#FCEAEA', warn: true },
  ],
  title: '🌙 晚餐這樣吃',
  text: '今日蛋白質目標幾乎達成、脂肪已滿，晚餐以補充優質碳水為主。可選擇低脂、高纖的碳水來源。',
  foods: ['🍠 地瓜', '🌾 燕麥', '🍌 香蕉', '🍎 蘋果', '🥦 花椰菜'],
}

// 語音 / 掃描 辨識結果（demo 模擬）
export const voiceResult = {
  transcript: '今晚吃了烤鮭魚一片、糙米飯一碗，還有炒花椰菜',
  rows: [
    { icon: '🥩', label: '蛋白質', value: '+38g', color: '#5BB5A2' },
    { icon: '🍚', label: '碳水化合物', value: '+45g', color: '#E8916A' },
    { icon: '🫒', label: '脂肪', value: '+12g', color: '#C9A882' },
    { icon: '🔥', label: '總熱量', value: '+480 kcal', color: '#F5C842' },
  ],
  warn: '建議今日多補充水分和膳食纖維',
}

export const scanResult = {
  source: '統一麥香雞腿堡 100g',
  rows: [
    { icon: '🥩', label: '蛋白質', value: '+24.5g', color: '#5BB5A2' },
    { icon: '🍚', label: '碳水化合物', value: '+8.3g', color: '#E8916A' },
    { icon: '🫒', label: '脂肪', value: '+6.2g', color: '#C9A882' },
    { icon: '🔥', label: '總熱量', value: '+185 kcal', color: '#F5C842' },
    { icon: '🧂', label: '鈉', value: '380mg', color: '#D9534F', warn: true },
  ],
  warn: '鈉含量 380mg 偏高（建議每日上限 2000mg），建議今日多補充水分，並減少其他高鈉食物。',
  label: [
    ['熱量', '185 大卡'],
    ['蛋白質', '24.5g'],
    ['脂肪', '6.2g'],
    ['碳水化合物', '8.3g'],
    ['鈉', '380mg'],
  ],
}

// ===== Alex 的一天：引導流程資料 =====
export const inbodyHistory = {
  last: { date: '2025-05-23', weight: 69.1, bodyFat: 23.2, muscleMass: 27.8, bmr: 1620, inbodyScore: 71 },
  current: { date: '2025-06-06', weight: 68.2, bodyFat: 22.0, muscleMass: 28.5, bmr: 1650, inbodyScore: 75 },
  scoreTrend: [68, 70, 71, 73, 75],
  location: '東吳大學健身中心',
  syncTime: '2025/06/06 09:41',
  progressScore: 82,
}

// Step 1 量測結果列（綠色＝改善）
export const inbodyMetrics = [
  { label: '體重', icon: '⚖️', bg: '#F0EDE8', value: '68.2', unit: 'kg', delta: '▼ 0.9kg', good: true },
  { label: '體脂率', icon: '💧', bg: '#FDF0E8', value: '22.0', unit: '%', delta: '▼ 1.2%', good: true },
  { label: '骨骼肌量', icon: '💪', bg: '#EAF6F3', value: '28.5', unit: 'kg', delta: '▲ 0.7kg', good: true },
  { label: '基礎代謝率', icon: '🔥', bg: '#FFFBEA', value: '1,650', unit: 'kcal', delta: '▲ 30kcal', good: true },
  { label: 'InBody 分數', icon: '⭐', bg: '#EAF6F3', value: '75', unit: '/ 100', delta: '▲ 4分', good: true, trend: true },
]

// Step 2 對比表
export const inbodyCompare = [
  { label: '體重', last: '69.1 kg', now: '68.2 kg', delta: '▼ 0.9', good: true },
  { label: '體脂率', last: '23.2 %', now: '22.0 %', delta: '▼ 1.2%', good: true },
  { label: '骨骼肌量', last: '27.8 kg', now: '28.5 kg', delta: '▲ 0.7kg', good: true },
  { label: '基礎代謝率', last: '1,620 kcal', now: '1,650 kcal', delta: '▲ 30', good: true },
  { label: 'InBody 分數', last: '71 分', now: '75 分', delta: '▲ 4分', good: true, highlight: true },
]

// Step 2 雙欄對比圖（取體重/體脂/肌肉，量級相近較易讀）
export const compareChartData = [
  { name: '體重', last: 69.1, now: 68.2 },
  { name: '體脂率', last: 23.2, now: 22.0 },
  { name: '肌肉量', last: 27.8, now: 28.5 },
]

// Step 2 營養預算調整
export const budgetAdjustment = {
  reason: '根據本次 InBody 數據分析，骨骼肌量提升導致基礎代謝率上升，AI 已自動調整今日的三大營養素目標：',
  items: [
    { icon: '🔥', name: '每日總熱量', old: '1,950 kcal', new: '2,050 kcal', delta: '▲ +100 kcal' },
    { icon: '🥩', name: '蛋白質', old: '92g', new: '100g', delta: '▲ +8g' },
    { icon: '🍚', name: '碳水化合物', old: '108g', new: '120g', delta: '▲ +12g' },
    { icon: '🫒', name: '脂肪', old: '30g', new: '32g', delta: '▲ +2g' },
  ],
  tips: [
    '增加蛋白質攝取至 100g，建議午晚餐各補充一份雞胸肉或豆腐',
    '碳水化合物調升至 120g，運動前可適度補充地瓜或燕麥',
    '維持現有訓練強度，骨骼肌量正在穩定增長中',
  ],
}

// ===== 代謝個性報告（三層架構：WHO / WHY / WHAT NOW）=====
export const metabolicProfile = {
  name: '代謝敏感型',
  en: 'Metabolic Sensitive Type',
  confidence: 92,
  percentile: '前 8% 人格',
  traits: [
    { icon: '⚡', label: '高效代謝', bg: '#EAF6F3', color: '#5BB5A2', border: '#5BB5A2' },
    { icon: '🔥', label: '易燃脂型', bg: '#FDF0E8', color: '#E8916A', border: '#E8916A' },
    { icon: '⚖️', label: '血糖敏感', bg: '#FFFBEA', color: '#8A6A00', border: '#F5C842' },
    { icon: '💪', label: '肌肉保留型', bg: '#EAF6F3', color: '#5BB5A2', border: '#5BB5A2' },
    { icon: '🌊', label: '水分代謝佳', bg: '#EEF0FF', color: '#6B7AE8', border: '#6B7AE8' },
  ],
  plain:
    '你的身體對食物反應極度靈敏——吃對了，肌肉合成速度比一般人快 20%；吃錯了，脂肪囤積也比別人明顯。這種體質需要的不是少吃，而是「精準吃」。',
  radar: [
    { label: '胰島素敏感性', value: 0.55, score: 55, color: '#F5C842' },
    { label: '炎症控制', value: 0.7, score: 70, color: '#5BB5A2' },
    { label: '營養分配率', value: 0.45, score: 45, color: '#E8916A' },
    { label: '能量消耗', value: 0.8, score: 80, color: '#5BB5A2' },
  ],
  sources: [
    { name: '胰島素敏感性', score: 55, ring: '#F5C842', text: '#8A6A00', desc: '14 天碳水攝取標準差 ±23g（偏高），精製碳水佔比 42%，建議降低至 30% 以下。' },
    { name: '炎症控制', score: 70, ring: '#5BB5A2', text: '#5BB5A2', desc: '蔬菜攝取達標 9/14 天（64%），Omega-3 食物出現頻率每週 2.3 次，表現良好。' },
    { name: '營養分配率', score: 45, ring: '#E8916A', text: '#E8916A', desc: '早餐蛋白質平均僅 12g（建議 ≥20g），三餐蛋白質分配不均是主要扣分原因。' },
    { name: '能量消耗', score: 80, ring: '#5BB5A2', text: '#5BB5A2', desc: '日均步數 7,240 步，運動日 vs 休息日攝取熱量差異適當（+285 kcal），代謝效率優。' },
  ],
  risks: [
    {
      name: '肌肉流失風險',
      level: '需注意',
      color: '#E8916A',
      badgeBg: '#FDF0E8',
      pct: 65,
      desc: '蛋白質攝取 14 天平均 72g，低於建議的 100g，長期恐影響肌肉合成。',
      action: '每餐確保至少 25g 蛋白質來源',
    },
    {
      name: '血糖波動風險',
      level: '中等',
      color: '#F5C842',
      badgeBg: '#FFFBEA',
      badgeText: '#8A6A00',
      pct: 45,
      desc: '碳水攝取時間集中於晚餐（佔全日 52%），建議分散至三餐均勻攝取。',
      action: '早午餐各補充 30-40g 複合碳水',
    },
    {
      name: '炎症風險',
      level: '良好',
      color: '#5BB5A2',
      badgeBg: '#EAF6F3',
      pct: 20,
      desc: '蔬菜攝取與 Omega-3 頻率表現良好，繼續維持現有飲食習慣。',
      action: '維持目前模式，可嘗試增加深色蔬菜',
    },
  ],
  actions: [
    { title: '早餐加一顆水煮蛋', effect: '蛋白質早餐化，提升全日代謝效率', diff: '⭐ 簡單', diffColor: '#5BB5A2' },
    { title: '午晚餐各補充一掌心蛋白質', effect: '三餐均勻分配，減少肌肉流失風險 40%', diff: '⭐⭐ 中等', diffColor: '#E8916A' },
    { title: '晚餐碳水減少 1/3，改在午餐攝取', effect: '改善血糖波動，提升胰島素敏感性分數', diff: '⭐⭐ 中等', diffColor: '#E8916A' },
  ],
  unlocks: [
    { title: '月度代謝趨勢報告', need: '需累積 30 天數據', cur: 14, total: 30 },
    { title: '飲食模式相似者比較', need: '需累積 21 天數據', cur: 14, total: 21 },
  ],
}

// 精準營養學堂｜推薦學習影片（YouTube 嵌入；youtubeId 可替換成你們選定的繁中健康影片）
export const learningVideos = [
  {
    id: 'v1',
    title: '消水腫全攻略｜30 秒自測水腫體質、去水腫食物',
    duration: '影片教學',
    youtubeId: '8iFjUxYIDCE',
    thumbnail: 'https://img.youtube.com/vi/8iFjUxYIDCE/mqdefault.jpg',
    topic: '水分代謝',
  },
  {
    id: 'v2',
    title: '蛋白質沒吃夠，減脂等於白忙一場！超詳盡解析',
    duration: '14:02',
    youtubeId: 'RH1Z0WJ_tXc',
    thumbnail: 'https://img.youtube.com/vi/RH1Z0WJ_tXc/mqdefault.jpg',
    topic: '蛋白質攝取',
  },
  {
    id: 'v3',
    title: '低 GI 與抗性澱粉：碳水化合物選對種類才重要',
    duration: '影片教學',
    youtubeId: 'puP7k6qVULw',
    thumbnail: 'https://img.youtube.com/vi/puP7k6qVULw/mqdefault.jpg',
    topic: '碳水選擇',
  },
]

export const chatResponses = {
  protein:
    '根據您的 InBody 數據，骨骼肌量 28.5kg 對您的體重來說偏低。建議每公斤體重攝取 1.6g 蛋白質，也就是每天約 109g。目前您還差約 49g，可以在晚餐補充一份雞胸肉或希臘優格。',
  fat:
    '您目前體脂率 22%，對一般成年男性來說屬於正常偏高範圍。以您的基礎代謝率 1,650 kcal 計算，建議每日熱量赤字控制在 300-500 kcal 之間，約 1,250-1,350 kcal 的攝取量，搭配阻力訓練效果最佳。',
  sleep:
    '睡眠對代謝影響非常大！根據研究，睡眠不足 7 小時會導致皮質醇升高，增加肌肉分解風險。建議您睡前 2 小時避免大量進食，可以補充一小份含有色胺酸的食物，例如溫牛奶或少量堅果，有助於提升睡眠品質。',
  water:
    '別擔心，這很常見！根據您最新的 InBody 數據，您的細胞外水份比例偏高。這通常是因為體內鹽分攝取較多，導致身體暫時保留了更多水份，而不是脂肪增加。多喝水其實有助於代謝多餘的鈉，繼續保持水分補充是正確的喔！',
  default:
    '感謝您的問題！根據您目前的生理數據，建議您持續保持均衡飲食，特別注意蛋白質的補充。如果有更具體的健康疑問，歡迎繼續提問，我會根據您的 InBody 數據給出個人化建議。',
}
