import { motion, AnimatePresence } from 'framer-motion'

export default function Modal({ modal, onClose }) {
  return (
    <AnimatePresence>
      {modal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl p-6 mx-6 w-full max-w-sm"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }}
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.88, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {modal.type === 'scanner' && (
              <>
                <h3 className="text-lg font-bold text-center mb-1">AI 食物辨識</h3>
                <p className="text-xs text-center text-gray-400 mb-4">將食物置於框內，自動估算份量與營養</p>
                <div
                  className="relative rounded-2xl h-52 mb-4 overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #1f2d2a, #2c4640)' }}
                >
                  <img
                    src="/images/chicken_salad.jpg"
                    alt="scan"
                    className="w-full h-full object-cover opacity-90"
                  />
                  {/* 取景框四角 */}
                  {[
                    { t: 12, l: 12, b: 'border-t-2 border-l-2' },
                    { t: 12, r: 12, b: 'border-t-2 border-r-2' },
                    { btm: 12, l: 12, b: 'border-b-2 border-l-2' },
                    { btm: 12, r: 12, b: 'border-b-2 border-r-2' },
                  ].map((c, i) => (
                    <div
                      key={i}
                      className={`absolute w-7 h-7 ${c.b}`}
                      style={{
                        top: c.t,
                        left: c.l,
                        right: c.r,
                        bottom: c.btm,
                        borderColor: '#5BB5A2',
                        borderRadius: 4,
                      }}
                    />
                  ))}
                  {/* 掃描線 */}
                  <motion.div
                    className="absolute left-3 right-3 h-0.5"
                    style={{ background: 'linear-gradient(90deg, transparent, #5BFFD8, transparent)', boxShadow: '0 0 10px #5BFFD8' }}
                    initial={{ top: '12%' }}
                    animate={{ top: ['12%', '85%', '12%'] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  {/* 辨識結果 */}
                  <motion.div
                    className="absolute bottom-3 left-3 right-3 rounded-xl px-3 py-2 flex items-center justify-between"
                    style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(4px)' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <div>
                      <p className="text-sm font-bold" style={{ color: '#2C2C2C' }}>
                        繽紛蔬菜碗
                      </p>
                      <p className="text-[11px] text-gray-400">辨識信心 96%</p>
                    </div>
                    <span
                      className="text-xs font-semibold px-2 py-1 rounded-full text-white"
                      style={{ background: 'linear-gradient(135deg, #5BB5A2, #4A9A89)' }}
                    >
                      約 420 kcal
                    </span>
                  </motion.div>
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-full text-white font-medium"
                  style={{ background: 'linear-gradient(135deg, #5BB5A2, #4A9A89)' }}
                >
                  加入記錄
                </button>
              </>
            )}

            {modal.type === 'achievement' && (
              <>
                <div className="text-center text-5xl mb-3" style={{ opacity: modal.data.unlocked ? 1 : 0.4, filter: modal.data.unlocked ? 'none' : 'grayscale(1)' }}>
                  {modal.data.icon}
                </div>
                <h3 className="text-lg font-bold text-center mb-1">{modal.data.label}</h3>
                <div className="text-center mb-3">
                  <span
                    className="text-sm px-3 py-1 rounded-full font-medium"
                    style={{ background: '#EAF6F3', color: '#5BB5A2' }}
                  >
                    {modal.data.points} 點
                  </span>
                </div>
                <p className="text-sm text-gray-500 text-center leading-relaxed mb-4">
                  {modal.data.desc}
                </p>

                {/* 未解鎖：顯示解鎖進度 */}
                {!modal.data.unlocked && modal.data.progress && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-400">
                        距離解鎖還差 {modal.data.progress.total - modal.data.progress.current}{' '}
                        {modal.data.progress.unit}
                      </span>
                      <span className="text-xs font-semibold" style={{ color: '#E8916A' }}>
                        {modal.data.progress.current}/{modal.data.progress.total}
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: '#F0EDE8' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #E8916A, #F5C842)' }}
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(modal.data.progress.current / modal.data.progress.total) * 100}%`,
                        }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                )}

                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-full text-white font-medium"
                  style={{ background: 'linear-gradient(135deg, #5BB5A2, #4A9A89)' }}
                >
                  關閉
                </button>
              </>
            )}

            {modal.type === 'video' && (
              <>
                <h3 className="text-lg font-bold text-center mb-4">影片播放</h3>
                <div
                  className="rounded-xl h-40 flex items-center justify-center mb-4"
                  style={{ background: '#EAF6F3' }}
                >
                  <div className="text-center text-gray-400">
                    <div className="text-4xl mb-2">▶</div>
                    <p className="text-sm">鹽分、水腫與體重波動的關係</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-full text-white font-medium"
                  style={{ background: '#5BB5A2' }}
                >
                  關閉
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
