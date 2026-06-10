export default function Badge({ children, color = '#5BB5A2', bg = '#EAF6F3' }) {
  return (
    <span
      className="text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap"
      style={{ background: bg, color }}
    >
      {children}
    </span>
  )
}
