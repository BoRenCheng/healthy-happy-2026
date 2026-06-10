import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FIELDS = [
  { key: 'calories', label: '熱量', unit: 'kcal', hint: '一般餐點約 400-700', max: 3000 },
  { key: 'protein', label: '蛋白質', unit: 'g', hint: '一份肉約 25-35g', max: 500 },
  { key: 'carbs', label: '碳水化合物', unit: 'g', hint: '一碗飯約 45-55g', max: 500 },
  { key: 'fat', label: '脂肪', unit: 'g', hint: '一般餐點約 10-20g', max: 500 },
]

const REF = [
  { name: '雞胸肉100g', protein: 31, carbs: 0, fat: 3.6, calories: 165 },
  { name: '白飯一碗', protein: 2.7, carbs: 40, fat: 0.3, calories: 180 },
  { name: '水煮蛋一顆', protein: 6, carbs: 0.6, fat: 5, calories: 72 },
  { name: '地瓜一條', protein: 1.6, carbs: 27, fat: 0.1, calories: 114 },
  { name: '豆腐半盒', protein: 8, carbs: 2, fat: 4, calories: 76 },
]

const validateField = (key, raw, max) => {
  if (raw === '' || raw == null) return '此欄位必填'
  const n = Number(raw)
  if (Number.isNaN(n)) return '請輸入數字'
  if (key === 'calories') {
    if (n <= 0 || n >= 3000) return '請輸入有效熱量（1-2999 kcal）'
  } else if (n < 0 || n >= max) {
    return `請輸入有效數值（0-${max - 1}g）`
  }
  return ''
}

export default function ManualForm({ onSubmit }) {
  const [values, setValues] = useState({ calories: '', protein: '', carbs: '', fat: '' })
  const [touched, setTouched] = useState({})
  const [showRef, setShowRef] = useState(false)

  const errors = FIELDS.reduce((acc, f) => {
    acc[f.key] = validateField(f.key, values[f.key], f.max)
    return acc
  }, {})
  const allValid = FIELDS.every((f) => !errors[f.key])

  const fillFromRef = (row) => {
    setValues({
      calories: String(row.calories),
      protein: String(row.protein),
      carbs: String(row.carbs),
      fat: String(row.fat),
    })
  }

  return (
    <div className="pt-4">
      <h3 className="text-base font-bold mb-4" style={{ color: '#2C2C2C' }}>✏️ 手動輸入營養素</h3>

      <div className="space-y-3">
        {FIELDS.map((f) => {
          const err = touched[f.key] && errors[f.key]
          return (
            <div key={f.key}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs" style={{ color: '#8A8A8A' }}>{f.label}（{f.unit}）</label>
                <span className="text-[11px]" style={{ color: '#BBBBBB' }}>{f.hint}</span>
              </div>
              <input
                type="number"
                min="0"
                inputMode="numeric"
                value={values[f.key]}
                onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                onBlur={() => setTouched((t) => ({ ...t, [f.key]: true }))}
                className="w-full text-center font-semibold outline-none"
                style={{
                  height: 52,
                  borderRadius: 12,
                  border: `1.5px solid ${err ? '#E24B4A' : '#F0EDE8'}`,
                  background: '#FAFAFA',
                  fontSize: 18,
                  color: '#2C2C2C',
                }}
              />
              {err && <p className="text-xs mt-1" style={{ color: '#E24B4A' }}>{err}</p>}
            </div>
          )
        })}
      </div>

      {/* 參考表 */}
      <button onClick={() => setShowRef((v) => !v)} className="mt-4 text-[13px] font-medium flex items-center gap-1" style={{ color: '#5BB5A2' }}>
        參考常見食物 <ChevronDown size={14} style={{ transform: showRef ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>
      {showRef && (
        <div className="mt-2 rounded-xl overflow-hidden" style={{ border: '1px solid #F0EDE8' }}>
          <div className="grid grid-cols-5 text-[12px] font-medium" style={{ background: '#EAF6F3', color: '#5BB5A2' }}>
            {['食物', '蛋白質', '碳水', '脂肪', '熱量'].map((h) => (
              <span key={h} className="px-2 py-1.5 text-center">{h}</span>
            ))}
          </div>
          {REF.map((r, i) => (
            <button
              key={r.name}
              onClick={() => fillFromRef(r)}
              className="grid grid-cols-5 text-[12px] w-full active:opacity-70"
              style={{ background: i % 2 ? '#FAFAFA' : 'white', color: '#2C2C2C' }}
            >
              <span className="px-2 py-1.5 text-center">{r.name}</span>
              <span className="px-2 py-1.5 text-center">{r.protein}g</span>
              <span className="px-2 py-1.5 text-center">{r.carbs}g</span>
              <span className="px-2 py-1.5 text-center">{r.fat}g</span>
              <span className="px-2 py-1.5 text-center">{r.calories}</span>
            </button>
          ))}
          <p className="text-[11px] text-center py-1.5" style={{ color: '#BBBBBB', background: 'white' }}>點選任一列可自動帶入</p>
        </div>
      )}

      <button
        onClick={() => {
          if (!allValid) {
            setTouched({ calories: true, protein: true, carbs: true, fat: true })
            return
          }
          onSubmit({
            calories: Number(values.calories),
            protein: Number(values.protein),
            carbs: Number(values.carbs),
            fat: Number(values.fat),
          })
        }}
        disabled={!allValid}
        className="w-full mt-5 py-3.5 rounded-full text-sm font-semibold text-white"
        style={{ background: allValid ? 'linear-gradient(135deg, #5BB5A2, #4A9A89)' : '#CCCCCC' }}
      >
        確認記錄
      </button>
    </div>
  )
}
