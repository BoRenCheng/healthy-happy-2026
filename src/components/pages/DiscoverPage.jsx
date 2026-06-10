import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Send } from 'lucide-react'
import VideoPlayer from '../ui/VideoPlayer'
import { learningVideos } from '../../data/mockData'

export default function DiscoverPage({
  navigate,
  chatMessages,
  chatInput,
  setChatInput,
  isAiTyping,
  sendChat,
  setModal,
}) {
  const bottomRef = useRef(null)
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, isAiTyping])

  return (
    <div className="flex flex-col h-screen pb-16" style={{ background: '#FAF7F2' }}>
      {/* 頂部 */}
      <div
        className="flex items-center justify-between px-4 pt-4 pb-3 bg-white border-b"
        style={{ borderColor: '#F0EDE8' }}
      >
        <button
          onClick={() => navigate('home')}
          className="flex items-center gap-1 text-sm font-medium"
          style={{ color: '#5BB5A2' }}
        >
          <ArrowLeft size={18} /> 回到儀表板
        </button>
        <div
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
          style={{ background: '#EAF6F3', color: '#5BB5A2' }}
        >
          🧠 AI 導師：活躍中
        </div>
      </div>

      {/* 聊天區 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence>
          {chatMessages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {msg.role === 'user' ? (
                <div className="flex justify-end">
                  <div
                    className="max-w-xs px-4 py-3 rounded-2xl rounded-br-sm text-white text-sm leading-relaxed"
                    style={{ background: '#5BB5A2' }}
                  >
                    {msg.text}
                    <div className="text-xs mt-1 opacity-70 text-right">✓✓</div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2 items-start">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1"
                    style={{ background: '#5BB5A2' }}
                  >
                    AI
                  </div>
                  <div className="flex-1 space-y-2">
                    <div
                      className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed"
                      style={{ color: '#2C2C2C', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
                    >
                      {msg.text}
                    </div>
                    {msg.warning && (
                      <div
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                        style={{ background: '#FDF0E8', color: '#E8916A', border: '1px solid #E8916A' }}
                      >
                        ⚠️ {msg.warning}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {/* 打字動畫 */}
          {isAiTyping && (
            <motion.div
              className="flex gap-2 items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ background: '#5BB5A2' }}
              >
                AI
              </div>
              <div
                className="bg-white px-4 py-3 rounded-2xl flex gap-1"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ background: '#5BB5A2' }}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 推薦學習影片 */}
        <div>
          <p className="text-sm font-bold mb-3 flex items-center gap-1" style={{ color: '#2C2C2C' }}>
            📚 推薦學習影片
          </p>
          {learningVideos.map((v) => (
            <div key={v.id} className="bg-white rounded-2xl p-3 mb-3" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <VideoPlayer video={v} />
            </div>
          ))}
        </div>

        <div ref={bottomRef} />
      </div>

      {/* 輸入框 */}
      <div className="px-4 py-3 bg-white border-t" style={{ borderColor: '#F0EDE8' }}>
        <div className="flex gap-2 items-center">
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendChat()}
            placeholder="問問 AI 導師任何健康問題..."
            className="flex-1 px-4 py-2.5 rounded-full text-sm outline-none"
            style={{ background: '#F5F5F5', color: '#2C2C2C' }}
          />
          <button
            onClick={sendChat}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-90"
            style={{ background: '#5BB5A2' }}
          >
            <Send size={16} color="white" />
          </button>
        </div>
      </div>
    </div>
  )
}
