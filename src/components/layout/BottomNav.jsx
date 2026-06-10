import { Home, Calendar, Compass, User } from 'lucide-react'

const tabs = [
  { id: 'home', icon: Home, label: '首頁' },
  { id: 'plan', icon: Calendar, label: '計畫' },
  { id: 'discover', icon: Compass, label: '發現' },
  { id: 'profile', icon: User, label: '我的' },
]

export default function BottomNav({ currentTab, onChange }) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t flex z-40"
      style={{ borderColor: '#F0EDE8', height: 64 }}
    >
      {tabs.map(({ id, icon: Icon, label }) => {
        const active = currentTab === id
        return (
          <button
            key={id}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-all duration-200"
            style={{ color: active ? '#5BB5A2' : '#BBBBBB' }}
            onClick={() => onChange(id)}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span className="text-xs font-medium">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
