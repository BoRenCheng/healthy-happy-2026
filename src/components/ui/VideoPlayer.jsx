import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play } from 'lucide-react'

export default function VideoPlayer({ video }) {
  const [isOpen, setIsOpen] = useState(false)
  const [thumbErr, setThumbErr] = useState(false)

  return (
    <>
      {/* 縮圖卡片 */}
      <div onClick={() => setIsOpen(true)} className="relative cursor-pointer rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
        {!thumbErr ? (
          <img src={video.thumbnail} alt={video.title} onError={() => setThumbErr(true)} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EAF6F3, #D4F0E8)' }}>
            <span className="text-3xl">🎬</span>
          </div>
        )}
        <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.25)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center" style={{ width: 52, height: 52, background: 'rgba(255,255,255,0.95)', boxShadow: '0 4px 16px rgba(0,0,0,0.3)' }}>
          <Play size={20} color="#E8916A" fill="#E8916A" style={{ marginLeft: 3 }} />
        </div>
        <span className="absolute" style={{ bottom: 8, right: 8, background: 'rgba(0,0,0,0.7)', color: 'white', fontSize: 11, padding: '2px 6px', borderRadius: 4 }}>
          {video.duration}
        </span>
      </div>

      {/* 標題 + 主題 */}
      <div className="mt-2">
        <p className="text-sm font-semibold mb-1" style={{ color: '#2C2C2C' }}>{video.title}</p>
        <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: '#EAF6F3', color: '#5BB5A2' }}>{video.topic}</span>
      </div>

      {/* 播放 Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.9)' }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full px-4"
              style={{ maxWidth: 480 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-white flex-1 pr-2">{video.title}</p>
                <button onClick={() => setIsOpen(false)} className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.15)' }}>
                  <X size={18} color="white" />
                </button>
              </div>
              <div className="relative rounded-xl overflow-hidden" style={{ paddingBottom: '56.25%', height: 0, background: '#000' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ border: 'none' }}
                />
              </div>
              <p className="text-center mt-3" style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>點擊外部區域關閉影片</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
