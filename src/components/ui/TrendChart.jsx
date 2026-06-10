import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Area,
  AreaChart,
} from 'recharts'
import { trendData } from '../../data/mockData'

export default function TrendChart({ height = 140 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={trendData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gProtein" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#5BB5A2" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#5BB5A2" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gCarbs" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#E8916A" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#E8916A" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
        <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#8A8A8A' }} />
        <YAxis tick={{ fontSize: 11, fill: '#8A8A8A' }} />
        <Tooltip
          contentStyle={{
            background: '#fff',
            border: '1px solid #F0EDE8',
            borderRadius: 10,
            fontSize: 12,
          }}
        />
        <Area
          type="monotone"
          dataKey="protein"
          stroke="#5BB5A2"
          strokeWidth={2}
          fill="url(#gProtein)"
          name="蛋白質(g)"
        />
        <Area
          type="monotone"
          dataKey="carbs"
          stroke="#E8916A"
          strokeWidth={2}
          fill="url(#gCarbs)"
          name="碳水(g)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
