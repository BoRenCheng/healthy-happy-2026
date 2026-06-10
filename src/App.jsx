import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import BottomNav from './components/layout/BottomNav'
import Modal from './components/layout/Modal'
import PageWrapper from './components/layout/PageWrapper'

import HomePage from './components/pages/HomePage'
import PlanPage from './components/pages/PlanPage'
import DiscoverPage from './components/pages/DiscoverPage'
import ProfilePage from './components/pages/ProfilePage'
import CommunityPage from './components/pages/CommunityPage'
import MealDetailPage from './components/pages/MealDetailPage'
import FoodLogSheet from './components/pages/FoodLogSheet'
import InbodySyncPage from './components/pages/InbodySyncPage'
import AiAnalysisPage from './components/pages/AiAnalysisPage'
import WelcomePage from './components/pages/WelcomePage'
import CelebrationPage from './components/pages/CelebrationPage'

import { chatResponses, nutrition } from './data/mockData'
import { calcRemaining, getRecommendedMeals, checkGoalAchieved } from './utils/nutritionCalc'

export default function App() {
  // 引導流程：'welcome' → 'inbody-sync' → 'ai-analysis' → 'main'
  const [appFlow, setAppFlow] = useState('welcome')

  const [currentTab, setCurrentTab] = useState('home')
  const [currentPage, setCurrentPage] = useState('main')

  const [mealAdded, setMealAdded] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [advisorAdopted, setAdvisorAdopted] = useState(false)
  const [advisorBudgetAdded, setAdvisorBudgetAdded] = useState(false)
  const [challengeRecorded, setChallengeRecorded] = useState(false)
  const [trendExpanded, setTrendExpanded] = useState(false)
  const [communityExpanded, setCommunityExpanded] = useState(false)
  const [modal, setModal] = useState(null)

  // 記錄飲食 + 營養動態
  const [foodLogOpen, setFoodLogOpen] = useState(false)
  const [currentNutrition, setCurrentNutrition] = useState(nutrition)
  const [nutritionUpdated, setNutritionUpdated] = useState(false)
  const [showNextMealSuggestion, setShowNextMealSuggestion] = useState(false)
  const [remainingNutrition, setRemainingNutrition] = useState({ protein: 40, carbs: 90, fat: 12, calories: 1530 })
  const [recommendedMeals, setRecommendedMeals] = useState(() =>
    getRecommendedMeals({ protein: 40, carbs: 90, fat: 12 })
  )

  // 達標慶祝
  const [showCelebration, setShowCelebration] = useState(false)
  const [shareToast, setShareToast] = useState(false)

  const handleShare = async () => {
    const text =
      `🎉 我今天完成了營養複利計畫的每日目標！\n` +
      `✅ 蛋白質：${currentNutrition.protein.current}g\n` +
      `✅ 碳水：${currentNutrition.carbs.current}g\n` +
      `✅ 脂肪：${currentNutrition.fat.current}g\n` +
      `讓數據有溫度，讓健康可複利！`
    if (navigator.share) {
      try {
        await navigator.share({ title: '營養複利計畫｜今日達標！', text, url: window.location.href })
      } catch (e) {
        void e
      }
    } else {
      try {
        await navigator.clipboard.writeText(text)
      } catch (e) {
        void e
      }
      setShareToast(true)
      setTimeout(() => setShareToast(false), 2000)
    }
  }

  const [chatMessages, setChatMessages] = useState([
    { role: 'user', text: '為什麼今天明明喝了很多水，體重反而增加了？' },
    { role: 'ai', text: chatResponses.water, warning: '偵測到您的細胞外水份偏高' },
  ])
  const [chatInput, setChatInput] = useState('')
  const [isAiTyping, setIsAiTyping] = useState(false)

  const navigate = (tab, page = 'main') => {
    setCurrentTab(tab)
    setCurrentPage(page)
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
  }

  const sendChat = () => {
    if (!chatInput.trim()) return
    const msg = chatInput.trim()
    setChatMessages((prev) => [...prev, { role: 'user', text: msg }])
    setChatInput('')
    setIsAiTyping(true)
    setTimeout(() => {
      let reply = chatResponses.default
      if (msg.includes('蛋白質') || msg.includes('肌肉')) reply = chatResponses.protein
      else if (msg.includes('體脂') || msg.includes('減脂')) reply = chatResponses.fat
      else if (msg.includes('睡眠') || msg.includes('恢復')) reply = chatResponses.sleep
      else if (msg.includes('水') || msg.includes('水分')) reply = chatResponses.water
      setIsAiTyping(false)
      setChatMessages((prev) => [...prev, { role: 'ai', text: reply }])
    }, 1800)
  }

  // 記錄飲食確認 → 動態加總攝取、計算剩餘、選推薦餐點、觸發動畫
  const confirmLog = (source, logged) => {
    const macros = logged || { protein: 30, carbs: 45, fat: 12, calories: 480 }

    const goal = {
      protein: currentNutrition.protein.goal,
      carbs: currentNutrition.carbs.goal,
      fat: currentNutrition.fat.goal,
      calories: currentNutrition.totalCalories,
    }
    const newCurrent = {
      protein: currentNutrition.protein.current + macros.protein,
      carbs: currentNutrition.carbs.current + macros.carbs,
      fat: currentNutrition.fat.current + macros.fat,
      calories: currentNutrition.consumed + macros.calories,
    }
    const remaining = calcRemaining(goal, newCurrent)
    const meals = getRecommendedMeals(remaining)
    const achieved = checkGoalAchieved(newCurrent, goal)

    setFoodLogOpen(false)
    navigate('home', 'main')

    setTimeout(() => {
      setCurrentNutrition((prev) => ({
        ...prev,
        consumed: newCurrent.calories,
        protein: { ...prev.protein, current: newCurrent.protein },
        carbs: { ...prev.carbs, current: newCurrent.carbs },
        fat: { ...prev.fat, current: newCurrent.fat },
      }))
      setRemainingNutrition(remaining)
      setRecommendedMeals(meals)
      setNutritionUpdated(true)
    }, 400)

    if (achieved) {
      // 達標 → 等膠囊瓶灌滿後彈出慶祝頁
      setTimeout(() => setShowCelebration(true), 2000)
    } else {
      setTimeout(() => setShowNextMealSuggestion(true), 2800)
    }
  }

  const showBottomNav = currentPage === 'main'
  const pageKey = currentPage === 'main' ? currentTab : currentPage

  const renderPage = () => {
    if (currentPage === 'meal-detail') {
      return (
        <MealDetailPage
          mealAdded={mealAdded}
          setMealAdded={setMealAdded}
          selectedMeal={selectedMeal}
          setSelectedMeal={setSelectedMeal}
          navigate={navigate}
        />
      )
    }
    if (currentPage === 'community') {
      return (
        <CommunityPage
          navigate={navigate}
          setModal={setModal}
          challengeRecorded={challengeRecorded}
          setChallengeRecorded={setChallengeRecorded}
          communityExpanded={communityExpanded}
          setCommunityExpanded={setCommunityExpanded}
          currentNutrition={currentNutrition}
          nutritionUpdated={nutritionUpdated}
        />
      )
    }
    switch (currentTab) {
      case 'home':
        return (
          <HomePage
            mealAdded={mealAdded}
            navigate={navigate}
            setModal={setModal}
            openFoodLog={() => setFoodLogOpen(true)}
            onReplaySync={() => setAppFlow('inbody-sync')}
            currentNutrition={currentNutrition}
            nutritionUpdated={nutritionUpdated}
            showNextMealSuggestion={showNextMealSuggestion}
            remainingNutrition={remainingNutrition}
            recommendedMeals={recommendedMeals}
          />
        )
      case 'plan':
        return (
          <PlanPage
            navigate={navigate}
            advisorAdopted={advisorAdopted}
            setAdvisorAdopted={setAdvisorAdopted}
            advisorBudgetAdded={advisorBudgetAdded}
            setAdvisorBudgetAdded={setAdvisorBudgetAdded}
            trendExpanded={trendExpanded}
            setTrendExpanded={setTrendExpanded}
          />
        )
      case 'discover':
        return (
          <DiscoverPage
            navigate={navigate}
            chatMessages={chatMessages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            isAiTyping={isAiTyping}
            sendChat={sendChat}
            setModal={setModal}
          />
        )
      case 'profile':
        return <ProfilePage navigate={navigate} setModal={setModal} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen w-full flex justify-center" style={{ background: '#EDEAE3' }}>
      <div className="relative w-full max-w-md min-h-screen overflow-hidden" style={{ background: '#FAF7F2' }}>
        <AnimatePresence mode="wait">
          {appFlow === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <WelcomePage
                onSyncInbody={() => setAppFlow('inbody-sync')}
                onEnterMain={() => setAppFlow('main')}
              />
            </motion.div>
          )}

          {appFlow === 'inbody-sync' && (
            <motion.div
              key="inbody-sync"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
              <InbodySyncPage onBack={() => setAppFlow('welcome')} onNext={() => setAppFlow('ai-analysis')} />
            </motion.div>
          )}

          {appFlow === 'ai-analysis' && (
            <motion.div
              key="ai-analysis"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <AiAnalysisPage onBack={() => setAppFlow('inbody-sync')} onEnter={() => setAppFlow('main')} />
            </motion.div>
          )}

          {appFlow === 'main' && (
            <motion.div
              key="main"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              <AnimatePresence mode="wait">
                <PageWrapper key={pageKey}>{renderPage()}</PageWrapper>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* BottomNav 放在動畫包裝層外，避免 transform 破壞 fixed 定位 */}
        {appFlow === 'main' && showBottomNav && (
          <BottomNav currentTab={currentTab} onChange={(tab) => navigate(tab)} />
        )}
      </div>

      <Modal modal={modal} onClose={() => setModal(null)} />
      <FoodLogSheet open={foodLogOpen} onClose={() => setFoodLogOpen(false)} onConfirm={confirmLog} />

      {/* 今日達標慶祝（全螢幕覆蓋） */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            key="celebration"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-0 flex justify-center"
            style={{ zIndex: 200 }}
          >
            <div className="w-full max-w-md h-full overflow-y-auto">
              <CelebrationPage
                currentNutrition={currentNutrition}
                onClose={() => setShowCelebration(false)}
                onShare={handleShare}
                navigate={navigate}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 分享複製 Toast */}
      <AnimatePresence>
        {shareToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed left-1/2 -translate-x-1/2 font-semibold whitespace-nowrap"
            style={{ bottom: 100, background: 'rgba(255,255,255,0.95)', color: '#2C2C2C', fontSize: 14, padding: '12px 24px', borderRadius: 50, zIndex: 300, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
          >
            ✓ 已複製到剪貼簿
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
