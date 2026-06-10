import { useEffect, useState } from 'react'

// 數字從 0 平滑跳動到 target（每次掛載重新播放，搭配 key 可重新觸發）
export default function useCountUp(target, duration = 1500) {
  const [val, setVal] = useState(0)

  useEffect(() => {
    let raf
    let start
    const to = Number(target) || 0
    const step = (t) => {
      if (start === undefined) start = t
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setVal(to * eased)
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return val
}
