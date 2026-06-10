export default function NutrientTag({ label, color = '#5BB5A2', bg = '#F0F8F6' }) {
  return (
    <span
      className="text-sm px-3 py-1 rounded-full font-medium"
      style={{ background: bg, color }}
    >
      {label}
    </span>
  )
}
