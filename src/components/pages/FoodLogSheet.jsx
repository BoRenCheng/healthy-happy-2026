import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Camera, X, ArrowLeft, ChevronRight, Image as ImageIcon, RotateCcw, Check, AlertTriangle } from 'lucide-react'
import { parseVoiceInput, parseNutritionLabel, validateOCRResult } from '../../utils/nutritionCalc'
import ManualForm from './ManualForm'

const WAVE = [6, 18, 10, 24, 14, 20, 8, 16, 12]
const SR = typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null
const VOICE_EXAMPLES = [
  '我吃了雞胸肉和糙米飯',
  '午餐吃了一碗白飯加兩顆水煮蛋',
  '吃了烤鮭魚、花椰菜還有地瓜',
  '早餐是燕麥加香蕉',
  '吃了豆腐、生菜沙拉跟牛奶',
  '一個雞腿便當',
]

function ResultRows({ rows }) {
  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center rounded-lg overflow-hidden" style={{ background: '#FAFAFA' }}>
          <div style={{ width: 3, alignSelf: 'stretch', background: r.color, borderRadius: 2 }} />
          <div className="flex items-center justify-between flex-1 pl-3 pr-3 py-2.5">
            <span className="text-sm" style={{ color: '#2C2C2C' }}>{r.icon} {r.label}</span>
            <span className="text-sm font-bold" style={{ color: r.warn ? '#D9534F' : '#2C2C2C' }}>{r.value}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function FailButtons({ onRetry, retryLabel, onManual }) {
  return (
    <div className="flex gap-2 pt-1">
      <button onClick={onRetry} className="flex-1 py-3 rounded-full text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #5BB5A2, #4A9A89)' }}>
        {retryLabel}
      </button>
      <button onClick={onManual} className="flex-1 py-3 rounded-full text-sm font-semibold" style={{ background: 'white', color: '#8A8A8A', border: '1.5px solid #E0E0E0' }}>
        手動輸入
      </button>
    </div>
  )
}

// OCR 部分辨識：補填欄位
function OcrPartial({ validate, onConfirm }) {
  const fields = [
    { key: 'calories', label: '熱量', unit: 'kcal' },
    { key: 'protein', label: '蛋白質', unit: 'g' },
    { key: 'carbs', label: '碳水化合物', unit: 'g' },
    { key: 'fat', label: '脂肪', unit: 'g' },
  ]
  const [vals, setVals] = useState(() =>
    fields.reduce((a, f) => {
      const v = validate.found?.[f.key]
      a[f.key] = v != null ? String(v) : ''
      return a
    }, {})
  )
  const allFilled = fields.every((f) => vals[f.key] !== '' && Number(vals[f.key]) >= 0)
  const abnormal = validate.reason === 'abnormal_values'

  return (
    <div className="rounded-2xl p-4 space-y-3" style={{ background: 'white', border: '1.5px solid #F5C842' }}>
      <div>
        <p className="text-[15px] font-bold flex items-center gap-1.5" style={{ color: '#8A6A00' }}>
          <AlertTriangle size={16} /> 部分辨識成功，需要補充
        </p>
        <p className="text-[13px] mt-1" style={{ color: '#8A8A8A' }}>
          {abnormal ? '部分數值可能辨識有誤，請確認後再記錄' : '以下標示 ❓ 的數值未能辨識，請手動填寫後再確認記錄'}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        {fields.map((f) => {
          const known = !abnormal && !validate.missing?.[f.key]
          return (
            <div key={f.key} className="rounded-xl p-2.5" style={{ background: known ? '#EAF6F3' : '#FDF0E8' }}>
              <p className="text-[10px] mb-1" style={{ color: known ? '#5BB5A2' : '#E8916A' }}>
                {known ? '✓ 已辨識' : '❓ 請填寫'} · {f.label}
              </p>
              <div className="flex items-baseline gap-1">
                <input
                  type="number"
                  value={vals[f.key]}
                  onChange={(e) => setVals((v) => ({ ...v, [f.key]: e.target.value }))}
                  placeholder="請輸入"
                  className="w-full bg-transparent outline-none font-bold"
                  style={{ fontSize: 20, color: '#2C2C2C', borderBottom: `2px solid ${known ? '#5BB5A2' : '#E8916A'}` }}
                />
                <span className="text-xs" style={{ color: '#8A8A8A' }}>{f.unit}</span>
              </div>
            </div>
          )
        })}
      </div>
      {!allFilled && <p className="text-xs" style={{ color: '#E8916A' }}>請先填寫所有 ❓ 欄位</p>}
      <button
        onClick={() =>
          allFilled &&
          onConfirm({ calories: Number(vals.calories), protein: Number(vals.protein), carbs: Number(vals.carbs), fat: Number(vals.fat) })
        }
        disabled={!allFilled}
        className="w-full py-3 rounded-full text-sm font-semibold text-white"
        style={{ background: allFilled ? 'linear-gradient(135deg, #5BB5A2, #4A9A89)' : '#CCCCCC' }}
      >
        確認記錄
      </button>
    </div>
  )
}

export default function FoodLogSheet({ open, onClose, onConfirm }) {
  const [mode, setMode] = useState('select') // select | voice | scan | manual

  const [voiceState, setVoiceState] = useState('idle') // idle|listening|processing|done|failed|denied|unsupported
  const [interimText, setInterimText] = useState('')
  const [finalText, setFinalText] = useState('')
  const [vResult, setVResult] = useState(null)
  const [vFail, setVFail] = useState(null)
  const recognitionRef = useRef(null)
  const finalRef = useRef('')

  const [scanState, setScanState] = useState('choose') // choose|processing|done
  const [imagePreview, setImagePreview] = useState(null)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [sRaw, setSRaw] = useState(null)
  const [sValidate, setSValidate] = useState(null)
  const cameraInputRef = useRef(null)
  const fileInputRef = useRef(null)

  const resetAll = () => {
    setMode('select')
    setVoiceState(SR ? 'idle' : 'unsupported')
    setInterimText('')
    setFinalText('')
    finalRef.current = ''
    setVResult(null)
    setVFail(null)
    setScanState('choose')
    setImagePreview(null)
    setOcrProgress(0)
    setSRaw(null)
    setSValidate(null)
  }

  useEffect(() => {
    if (open) resetAll()
    return () => {
      try {
        recognitionRef.current?.abort?.()
      } catch (e) {
        void e
      }
    }
  }, [open])

  // ===== 語音 =====
  const startListening = () => {
    if (!SR) return setVoiceState('unsupported')
    const recognition = new SR()
    recognition.lang = 'zh-TW'
    recognition.continuous = false
    recognition.interimResults = true
    finalRef.current = ''
    setInterimText('')
    setFinalText('')
    setVFail(null)

    recognition.onresult = (event) => {
      let interim = ''
      let final = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript
        else interim += event.results[i][0].transcript
      }
      if (interim) setInterimText(interim)
      if (final) {
        finalRef.current += final
        setFinalText(finalRef.current)
        setInterimText('')
      }
    }
    recognition.onerror = (e) => {
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') setVoiceState('denied')
      else if (finalRef.current.trim().length === 0) {
        setVFail({ reason: 'empty' })
        setVoiceState('failed')
      }
    }
    recognition.onend = () => {
      if (voiceStateRef.current === 'denied') return
      const text = finalRef.current.trim()
      setVoiceState('processing')
      setTimeout(() => {
        const r = parseVoiceInput(text)
        if (r.status === 'success') {
          setVResult(r)
          setVoiceState('done')
        } else {
          setVFail(r)
          setVoiceState('failed')
        }
      }, 700)
    }

    recognitionRef.current = recognition
    recognition.start()
    setVoiceState('listening')
  }

  // 追蹤 voiceState 供 onend 判斷
  const voiceStateRef = useRef(voiceState)
  useEffect(() => {
    voiceStateRef.current = voiceState
  }, [voiceState])

  const stopListening = () => {
    try {
      recognitionRef.current?.stop?.()
    } catch (e) {
      void e
    }
  }

  // ===== OCR =====
  const runOCR = async (url) => {
    setScanState('processing')
    setOcrProgress(0)
    let raw
    try {
      const { createWorker } = await import('tesseract.js')
      const worker = await createWorker('chi_tra+eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') setOcrProgress(Math.round(m.progress * 100))
        },
      })
      const { data } = await worker.recognize(url)
      await worker.terminate()
      raw = parseNutritionLabel(data.text || '')
    } catch (e) {
      void e
      raw = { calories: null, protein: null, carbs: null, fat: null, sodium: null }
    }
    setSRaw(raw)
    setSValidate(validateOCRResult(raw))
    setScanState('done')
  }

  const onPickFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setImagePreview(url)
    runOCR(url)
  }

  const goManual = () => setMode('manual')

  const voiceRows = vResult
    ? [
        { icon: '🥩', label: '蛋白質', value: `+${vResult.protein}g`, color: '#5BB5A2' },
        { icon: '🍚', label: '碳水化合物', value: `+${vResult.carbs}g`, color: '#E8916A' },
        { icon: '🫒', label: '脂肪', value: `+${vResult.fat}g`, color: '#C9A882' },
        { icon: '🔥', label: '總熱量', value: `+${vResult.calories} kcal`, color: '#F5C842' },
      ]
    : []

  const scanRows = sValidate?.status === 'success'
    ? [
        { icon: '🔥', label: '熱量', value: `${sValidate.found.calories} kcal`, color: '#F5C842' },
        { icon: '🥩', label: '蛋白質', value: `${sValidate.found.protein}g`, color: '#5BB5A2' },
        { icon: '🍚', label: '碳水化合物', value: `${sValidate.found.carbs}g`, color: '#E8916A' },
        { icon: '🫒', label: '脂肪', value: `${sValidate.found.fat}g`, color: '#C9A882' },
        ...(sRaw?.sodium != null ? [{ icon: '🧂', label: '鈉', value: `${sRaw.sodium}mg`, color: '#D9534F', warn: sRaw.sodium > 600 }] : []),
      ]
    : []

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] flex items-end justify-center" style={{ background: 'rgba(0,0,0,0.5)' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            className="w-full max-w-md bg-white relative"
            style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '92vh' }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div style={{ width: 40, height: 4, borderRadius: 2, background: '#E0E0E0' }} />
            </div>

            <div className="overflow-y-auto px-5 pb-7" style={{ maxHeight: 'calc(92vh - 24px)' }}>
              <div className="flex items-center justify-between py-2 border-b" style={{ borderColor: '#F0EDE8' }}>
                <div className="flex items-center gap-2">
                  {mode !== 'select' && (
                    <button onClick={() => setMode('select')} style={{ color: '#5BB5A2' }}>
                      <ArrowLeft size={20} />
                    </button>
                  )}
                  <h3 className="text-[18px] font-bold" style={{ color: '#2C2C2C' }}>
                    {mode === 'voice' ? '語音輸入' : mode === 'scan' ? '掃描營養標示' : mode === 'manual' ? '手動輸入' : '記錄飲食'}
                  </h3>
                </div>
                <button onClick={onClose} style={{ color: '#8A8A8A' }}>
                  <X size={22} />
                </button>
              </div>

              <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={onPickFile} style={{ display: 'none' }} />
              <input ref={fileInputRef} type="file" accept="image/*" onChange={onPickFile} style={{ display: 'none' }} />

              <AnimatePresence mode="wait">
                {/* ===== 選擇 ===== */}
                {mode === 'select' && (
                  <motion.div key="select" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="pt-4">
                    <div className="flex items-center gap-3 rounded-xl px-4 py-3 mb-5" style={{ background: '#EAF6F3' }}>
                      <span>✅</span>
                      <div className="flex-1">
                        <p className="text-sm font-bold" style={{ color: '#2C2C2C' }}>今日午餐已記錄</p>
                        <p className="text-xs" style={{ color: '#8A8A8A' }}>12:30 · 雞腿便當 · 680 kcal</p>
                      </div>
                      <span className="text-xs" style={{ color: '#5BB5A2' }}>編輯</span>
                    </div>
                    <p className="text-[15px] text-center mb-3" style={{ color: '#8A8A8A' }}>選擇記錄方式</p>
                    <button onClick={() => setMode('voice')} className="w-full flex items-center gap-4 rounded-2xl p-5 mb-3" style={{ border: '2px solid #5BB5A2', background: 'white' }}>
                      <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#EAF6F3' }}><Mic size={24} color="#5BB5A2" /></div>
                      <div className="flex-1 text-left">
                        <p className="text-base font-bold" style={{ color: '#2C2C2C' }}>語音輸入</p>
                        <p className="text-[13px] leading-snug" style={{ color: '#8A8A8A' }}>直接說出食物名稱與份量，AI 自動解析蛋白質、碳水、脂肪克數</p>
                      </div>
                      <ChevronRight size={18} color="#BBBBBB" />
                    </button>
                    <button onClick={() => setMode('scan')} className="w-full flex items-center gap-4 rounded-2xl p-5 mb-4" style={{ border: '2px solid #E8916A', background: 'white' }}>
                      <div className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#FDF0E8' }}><Camera size={24} color="#E8916A" /></div>
                      <div className="flex-1 text-left">
                        <p className="text-base font-bold" style={{ color: '#2C2C2C' }}>掃描營養標示</p>
                        <p className="text-[13px] leading-snug" style={{ color: '#8A8A8A' }}>拍攝食品包裝上的營養標示，OCR 技術自動擷取所有數值</p>
                      </div>
                      <ChevronRight size={18} color="#BBBBBB" />
                    </button>
                    <div className="flex items-center gap-3 my-3">
                      <div className="flex-1 h-px" style={{ background: '#F0EDE8' }} />
                      <span className="text-xs" style={{ color: '#BBBBBB' }}>或</span>
                      <div className="flex-1 h-px" style={{ background: '#F0EDE8' }} />
                    </div>
                    <button onClick={goManual} className="w-full py-3.5 rounded-full text-sm font-semibold" style={{ background: 'white', color: '#5BB5A2', border: '1.5px solid #5BB5A2' }}>
                      ✏️ 手動輸入
                    </button>
                  </motion.div>
                )}

                {/* ===== 手動 ===== */}
                {mode === 'manual' && (
                  <motion.div key="manual" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}>
                    <ManualForm onSubmit={(m) => onConfirm('manual', m)} />
                  </motion.div>
                )}

                {/* ===== 語音 ===== */}
                {mode === 'voice' && (
                  <motion.div key="voice" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} className="pt-5">
                    {voiceState === 'unsupported' && (
                      <div className="rounded-xl p-4 text-center" style={{ background: '#FDF0E8' }}>
                        <p className="text-sm font-medium" style={{ color: '#E8916A' }}>⚠️ 此瀏覽器不支援語音輸入</p>
                        <p className="text-[13px] mt-2 mb-4" style={{ color: '#8A8A8A' }}>建議使用 Chrome 瀏覽器，或改用手動輸入</p>
                        <button onClick={goManual} className="w-full py-3 rounded-full text-white text-sm font-semibold" style={{ background: '#5BB5A2' }}>改用手動輸入</button>
                      </div>
                    )}

                    {voiceState === 'denied' && (
                      <div className="rounded-2xl p-6 text-center" style={{ background: '#FDF0E8' }}>
                        <div className="text-4xl mb-3">🎙️</div>
                        <p className="text-[15px] font-bold mb-2" style={{ color: '#E8916A' }}>麥克風存取被拒絕</p>
                        <p className="text-[13px] leading-relaxed mb-4" style={{ color: '#8A8A8A' }}>請至瀏覽器設定中允許此網站存取麥克風，或改用「手動輸入」記錄今日飲食。</p>
                        <div className="rounded-lg px-3.5 py-2.5 mb-4 text-left" style={{ background: '#F5F5F5' }}>
                          <p className="text-xs leading-relaxed" style={{ color: '#8A8A8A' }}>Chrome 設定方式：<br />網址列左側 🔒 圖示 → 網站設定 → 麥克風 → 允許</p>
                        </div>
                        <button onClick={goManual} className="w-full py-3.5 rounded-full text-white text-sm font-semibold" style={{ background: '#5BB5A2' }}>改用手動輸入</button>
                      </div>
                    )}

                    {voiceState === 'failed' && (
                      <div className="rounded-2xl p-5" style={{ background: '#FDF0E8', border: '1.5px solid #E8916A' }}>
                        <div className="flex items-start gap-2 mb-3">
                          <AlertTriangle size={22} color="#E8916A" className="flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[15px] font-bold" style={{ color: '#E8916A' }}>無法辨識食物內容</p>
                            <p className="text-[13px]" style={{ color: '#8A8A8A' }}>
                              {vFail?.reason === 'empty' ? '未偵測到有效語音，請重新錄製' : '已辨識你的語音，但無法解析食物營養素'}
                            </p>
                          </div>
                        </div>
                        {vFail?.reason === 'no_match' && vFail.transcript && (
                          <div className="mb-3">
                            <p className="text-xs mb-1" style={{ color: '#8A8A8A' }}>語音辨識結果：</p>
                            <div className="rounded-lg px-3.5 py-2.5" style={{ background: '#F5F5F5' }}>
                              <p className="text-sm italic" style={{ color: '#2C2C2C' }}>{vFail.transcript}</p>
                            </div>
                          </div>
                        )}
                        <div className="h-px my-3" style={{ background: '#F3D9C8' }} />
                        <p className="text-[13px] font-semibold mb-3" style={{ color: '#2C2C2C' }}>📋 請參考以下說法重新錄製</p>
                        <div className="space-y-2 mb-3">
                          {VOICE_EXAMPLES.map((ex) => (
                            <div key={ex} className="rounded-lg px-3.5 py-2.5 text-sm" style={{ background: 'white', borderLeft: '3px solid #5BB5A2', color: '#2C2C2C' }}>
                              {ex}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-center leading-relaxed mb-4" style={{ color: '#8A8A8A' }}>
                          💡 說出具體食物名稱效果最佳<br />支援：雞胸肉、鮭魚、糙米飯、白飯、花椰菜、豆腐、蛋、地瓜、香蕉、牛奶、便當、燕麥、沙拉等
                        </p>
                        <FailButtons onRetry={() => { setVFail(null); setVoiceState('idle') }} retryLabel="重新錄製" onManual={goManual} />
                      </div>
                    )}

                    {voiceState === 'done' && vResult && (
                      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                        <div className="flex items-center gap-1.5 text-sm font-bold" style={{ color: '#5BB5A2' }}><Check size={16} /> 語音辨識完成</div>
                        <div className="rounded-lg px-3 py-2.5" style={{ background: '#F5F5F5' }}>
                          <p className="text-sm italic" style={{ color: '#2C2C2C' }}>「{finalText}」</p>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {vResult.matched.map((m) => (
                            <span key={m} className="text-xs px-2.5 py-1 rounded-full" style={{ background: '#EAF6F3', color: '#5BB5A2' }}>辨識：{m}</span>
                          ))}
                        </div>
                        <ResultRows rows={voiceRows} />
                        <div className="flex gap-2 pt-1">
                          <button onClick={() => { setVResult(null); setVoiceState('idle') }} className="flex-1 py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-1" style={{ background: 'white', color: '#8A8A8A', border: '1.5px solid #E0E0E0' }}>
                            <RotateCcw size={15} /> 重新錄製
                          </button>
                          <button onClick={() => onConfirm('voice', { protein: vResult.protein, carbs: vResult.carbs, fat: vResult.fat, calories: vResult.calories })} className="flex-1 py-3 rounded-full text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #5BB5A2, #4A9A89)', boxShadow: '0 4px 14px rgba(91,181,162,0.4)' }}>
                            確認記錄
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {(voiceState === 'idle' || voiceState === 'listening' || voiceState === 'processing') && (
                      <div className="flex flex-col items-center pb-4">
                        <div className="w-full rounded-xl px-4 py-3 mb-5 text-[15px] leading-relaxed" style={{ background: '#F5F5F5', minHeight: 60 }}>
                          {finalText && <span style={{ color: '#2C2C2C' }}>{finalText}</span>}
                          {interimText && <span style={{ color: '#BBBBBB' }}>{interimText}</span>}
                          {!finalText && !interimText && <span style={{ color: '#BBBBBB' }}>請說出你吃了什麼，例如：「我吃了一碗牛肉麵和一顆茶葉蛋」</span>}
                        </div>
                        <div className="flex items-end gap-[5px] h-8 mb-6">
                          {WAVE.map((h, i) => (
                            <motion.div key={i} style={{ width: 3, borderRadius: 2, background: '#5BB5A2', height: 6 }} animate={voiceState === 'listening' ? { height: [6, h, 6] } : { height: 6 }} transition={voiceState === 'listening' ? { duration: 0.3 + (i % 4) * 0.1, repeat: Infinity, delay: i * 0.05 } : {}} />
                          ))}
                        </div>
                        <div className="relative flex items-center justify-center mb-5" style={{ width: 140, height: 140 }}>
                          {voiceState === 'listening' && [0, 1, 2].map((i) => (
                            <motion.div key={i} className="absolute rounded-full" style={{ width: 100, height: 100, border: '2px solid #5BB5A2' }} animate={{ scale: [1, 2], opacity: [0.6, 0] }} transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.4, ease: 'easeOut' }} />
                          ))}
                          <button onClick={voiceState === 'idle' ? startListening : undefined} className="rounded-full flex items-center justify-center relative" style={{ width: 100, height: 100, background: voiceState === 'idle' ? '#EAF6F3' : '#5BB5A2', border: voiceState === 'idle' ? '3px solid #5BB5A2' : 'none' }}>
                            {voiceState === 'processing' ? (
                              <motion.div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(255,255,255,0.4)', borderTopColor: 'white' }} animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} />
                            ) : (
                              <Mic size={40} color={voiceState === 'idle' ? '#5BB5A2' : 'white'} />
                            )}
                          </button>
                        </div>
                        {voiceState === 'idle' && <p className="text-sm" style={{ color: '#8A8A8A' }}>點擊開始錄音（請允許麥克風權限）</p>}
                        {voiceState === 'listening' && (
                          <>
                            <p className="text-sm font-medium mb-3" style={{ color: '#5BB5A2' }}>正在聆聽...</p>
                            <button onClick={stopListening} className="px-8 py-2.5 rounded-full text-sm font-semibold text-white" style={{ background: '#E8916A' }}>停止</button>
                          </>
                        )}
                        {voiceState === 'processing' && (
                          <div className="flex items-center gap-2">
                            <p className="text-sm" style={{ color: '#5BB5A2' }}>AI 正在解析營養成分</p>
                            <div className="flex gap-1">
                              {[0, 1, 2].map((i) => (
                                <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: '#5BB5A2' }} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ===== 掃描 ===== */}
                {mode === 'scan' && (
                  <motion.div key="scan" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} className="pt-4">
                    {scanState === 'choose' && (
                      <div>
                        <div className="rounded-2xl mb-4 flex flex-col items-center justify-center" style={{ height: 150, background: 'linear-gradient(135deg, #1f2d2a, #2c4640)' }}>
                          <Camera size={40} color="rgba(255,255,255,0.85)" />
                          <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.7)' }}>拍攝或選取營養標示照片</p>
                        </div>
                        <button onClick={() => cameraInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 py-4 rounded-full text-white font-semibold mb-3" style={{ background: 'linear-gradient(135deg, #E8916A, #F5C842)', boxShadow: '0 4px 14px rgba(232,145,106,0.4)' }}>
                          <Camera size={18} /> 開啟相機拍攝
                        </button>
                        <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 py-4 rounded-full font-semibold" style={{ background: 'white', color: '#E8916A', border: '1.5px solid #E8916A' }}>
                          <ImageIcon size={18} /> 從相簿選取圖片
                        </button>
                        <p className="text-xs text-center mt-4" style={{ color: '#8A8A8A' }}>建議拍攝清晰、光線充足的營養標示，確保數字清晰可辨識</p>
                      </div>
                    )}

                    {scanState === 'processing' && (
                      <div className="pt-2">
                        {imagePreview && (
                          <div className="rounded-xl overflow-hidden mb-4 flex justify-center" style={{ maxHeight: 240, background: '#F5F5F5' }}>
                            <img src={imagePreview} alt="preview" style={{ maxHeight: 240, objectFit: 'contain' }} />
                          </div>
                        )}
                        <p className="text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>正在辨識營養標示...</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: '#F0EDE8' }}>
                            <div className="h-full rounded-full" style={{ width: `${ocrProgress}%`, background: '#5BB5A2', transition: 'width 0.3s ease' }} />
                          </div>
                          <span className="text-sm font-semibold" style={{ color: '#5BB5A2' }}>{ocrProgress}%</span>
                        </div>
                        <p className="text-xs mt-2" style={{ color: '#BBBBBB' }}>Tesseract OCR 辨識中，請稍候...</p>
                      </div>
                    )}

                    {scanState === 'done' && sValidate?.status === 'failed' && (
                      <div className="rounded-2xl p-5" style={{ background: '#FDF0E8', border: '1.5px solid #E8916A' }}>
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-start gap-2">
                            <span className="text-2xl">📷</span>
                            <div>
                              <p className="text-[15px] font-bold" style={{ color: '#E8916A' }}>無法辨識營養標示</p>
                              <p className="text-[13px]" style={{ color: '#8A8A8A' }}>圖片中未找到有效的營養素數值</p>
                            </div>
                          </div>
                          {imagePreview && <img src={imagePreview} alt="thumb" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />}
                        </div>
                        <p className="text-[13px] mb-1" style={{ color: '#8A8A8A' }}>可能的原因</p>
                        <div className="text-[13px] mb-3" style={{ color: '#2C2C2C', lineHeight: 2 }}>
                          <p>• 圖片模糊或光線不足</p>
                          <p>• 拍攝角度傾斜，文字變形</p>
                          <p>• 非標準格式的營養標示</p>
                          <p>• 圖片解析度過低</p>
                        </div>
                        <p className="text-[13px] font-semibold mb-2" style={{ color: '#2C2C2C' }}>📋 正確拍攝方式</p>
                        <div className="space-y-2 mb-3">
                          {['正面平拍，避免側角', '確保整張營養標示在畫面內', '光線充足，無反光或陰影', '文字清晰可見，不模糊'].map((t) => (
                            <div key={t} className="rounded-lg px-3.5 py-2.5 text-[13px]" style={{ background: 'white', color: '#2C2C2C' }}>✓ {t}</div>
                          ))}
                        </div>
                        <div className="rounded-lg px-3.5 py-2.5 mb-4 text-xs leading-relaxed" style={{ background: '#EAF6F3', color: '#5BB5A2' }}>
                          💡 建議對象：食品包裝背面的黑白營養標示表格效果最佳，通常包含 熱量 / 蛋白質 / 脂肪 / 碳水化合物 / 鈉
                        </div>
                        <FailButtons onRetry={() => { setSValidate(null); setImagePreview(null); setScanState('choose') }} retryLabel="重新拍攝" onManual={goManual} />
                      </div>
                    )}

                    {scanState === 'done' && sValidate?.status === 'partial' && (
                      <OcrPartial validate={sValidate} onConfirm={(m) => onConfirm('scan', m)} />
                    )}

                    {scanState === 'done' && sValidate?.status === 'success' && (
                      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-sm font-bold" style={{ color: '#5BB5A2' }}><Check size={16} /> 營養標示辨識完成</div>
                          {imagePreview && <img src={imagePreview} alt="thumb" style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />}
                        </div>
                        <ResultRows rows={scanRows} />
                        {sRaw?.sodium > 600 && (
                          <div className="rounded-lg px-3 py-2.5 text-sm" style={{ background: '#FDF0E8', color: '#C2683F' }}>
                            ⚠️ 鈉含量偏高（{sRaw.sodium}mg），建議今日減少其他高鈉食物攝取
                          </div>
                        )}
                        <div className="flex gap-2 pt-1">
                          <button onClick={() => { setSValidate(null); setImagePreview(null); setScanState('choose') }} className="flex-1 py-3 rounded-full text-sm font-semibold flex items-center justify-center gap-1" style={{ background: 'white', color: '#8A8A8A', border: '1.5px solid #E0E0E0' }}>
                            <RotateCcw size={15} /> 重新掃描
                          </button>
                          <button onClick={() => onConfirm('scan', { protein: sValidate.found.protein, carbs: sValidate.found.carbs, fat: sValidate.found.fat, calories: sValidate.found.calories })} className="flex-1 py-3 rounded-full text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #5BB5A2, #4A9A89)', boxShadow: '0 4px 14px rgba(91,181,162,0.4)' }}>
                            確認記錄
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
