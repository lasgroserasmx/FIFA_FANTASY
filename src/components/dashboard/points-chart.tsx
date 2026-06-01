'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const mockData = [
  { week: 'W1', fantasy: 42, prediction: 15 },
  { week: 'W2', fantasy: 78, prediction: 28 },
  { week: 'W3', fantasy: 95, prediction: 41 },
  { week: 'W4', fantasy: 120, prediction: 56 },
  { week: 'W5', fantasy: 145, prediction: 71 },
  { week: 'W6', fantasy: 168, prediction: 89 },
  { week: 'W7', fantasy: 190, prediction: 102 },
]

export function PointsChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Points Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={mockData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradFantasy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.65 0.22 145)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.65 0.22 145)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradPrediction" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="oklch(0.60 0.20 220)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="oklch(0.60 0.20 220)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 8%)" />
            <XAxis dataKey="week" tick={{ fontSize: 12, fill: 'oklch(0.65 0.02 265)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: 'oklch(0.65 0.02 265)' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: 'oklch(0.15 0.025 265)', border: '1px solid oklch(1 0 0 / 10%)', borderRadius: '8px' }}
              labelStyle={{ color: 'oklch(0.97 0 0)' }}
            />
            <Area type="monotone" dataKey="fantasy" name="Fantasy" stroke="oklch(0.65 0.22 145)" strokeWidth={2} fill="url(#gradFantasy)" />
            <Area type="monotone" dataKey="prediction" name="Prediction" stroke="oklch(0.60 0.20 220)" strokeWidth={2} fill="url(#gradPrediction)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
