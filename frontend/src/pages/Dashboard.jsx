import { useEffect, useState } from 'react'
import { insightsApi } from '../api/client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { TrendingUp, TrendingDown, AlertTriangle, IndianRupee, Wallet } from 'lucide-react'

const CATEGORY_COLORS = {
  Food: '#3b82f6',
  Transport: '#8b5cf6',
  Entertainment: '#f59e0b',
  Utilities: '#10b981',
  Healthcare: '#ef4444',
  Shopping: '#ec4899',
  Other: '#6b7280'
}

const SeverityColors = {
  High: 'border-red-700 bg-red-900/20 text-red-400',
  Medium: 'border-yellow-700 bg-yellow-900/20 text-yellow-400',
  Low: 'border-blue-700 bg-blue-900/20 text-blue-400'
}

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    insightsApi.get()
      .then(res => setData(res.data))
      .catch(() => setError('Failed to load insights'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <PageLoader />
  if (error) return <ErrorState message={error} />

  const { summary, alerts } = data
  const chartData = Object.entries(summary.thisMonthByCategory).map(([name, value]) => ({
    name,
    value: Math.round(value),
    color: CATEGORY_COLORS[name] ?? '#6b7280'
  }))

  const monthDelta = summary.totalLastMonth > 0
    ? ((summary.totalThisMonth - summary.totalLastMonth) / summary.totalLastMonth * 100).toFixed(1)
    : null

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Your spending overview for this month</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          label="Total This Month"
          value={`₹${summary.totalThisMonth.toLocaleString('en-IN')}`}
          icon={<IndianRupee size={18} />}
          sub={monthDelta !== null
            ? `${monthDelta > 0 ? '+' : ''}${monthDelta}% vs last month`
            : 'No previous data'}
          trend={monthDelta > 0 ? 'up' : 'down'}
        />
        <StatCard
          label="Last Month"
          value={`₹${summary.totalLastMonth.toLocaleString('en-IN')}`}
          icon={<Wallet size={18} />}
          sub="Previous month total"
        />
        <StatCard
          label="Top Category"
          value={summary.topCategory}
          icon={<TrendingUp size={18} />}
          sub={`₹${(summary.thisMonthByCategory[summary.topCategory] ?? 0).toLocaleString('en-IN')} spent`}
          accent="blue"
        />
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="card space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={16} className="text-yellow-400" />
            <h2 className="text-sm font-semibold text-white">Active Alerts</h2>
          </div>
          {alerts.map((alert, i) => (
            <div
              key={i}
              className={`border rounded-lg px-4 py-3 text-sm ${SeverityColors[alert.severity]}`}
            >
              <span className="font-medium">{alert.category}: </span>
              {alert.message}
            </div>
          ))}
        </div>
      )}

      {/* Chart */}
      <div className="card">
        <h2 className="text-sm font-semibold text-white mb-4">Spending by Category</h2>
        {chartData.length === 0 ? (
          <p className="text-gray-500 text-sm">No transactions this month yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} barSize={36}>
              <XAxis
                dataKey="name"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 8 }}
                labelStyle={{ color: '#f9fafb' }}
                formatter={v => [`₹${v.toLocaleString('en-IN')}`, 'Spent']}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Month comparison table */}
      <div className="card">
        <h2 className="text-sm font-semibold text-white mb-4">Month-on-Month Comparison</h2>
        <div className="space-y-3">
          {Object.entries(summary.thisMonthByCategory).map(([cat, current]) => {
            const prev = summary.lastMonthByCategory[cat] ?? 0
            const delta = summary.percentageDeltas[cat] ?? 0
            return (
              <div key={cat} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: CATEGORY_COLORS[cat] ?? '#6b7280' }}
                  />
                  <span className="text-gray-300">{cat}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-gray-500 text-xs">₹{prev.toLocaleString('en-IN')}</span>
                  <span className="text-white font-medium">₹{current.toLocaleString('en-IN')}</span>
                  <span className={`flex items-center gap-1 text-xs font-medium w-16 justify-end ${
                    delta > 0 ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {delta > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(delta)}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, sub, trend }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">{label}</span>
        <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && (
        <p className={`text-xs mt-1 ${trend === 'up' ? 'text-red-400' : trend === 'down' ? 'text-green-400' : 'text-gray-500'}`}>
          {sub}
        </p>
      )}
    </div>
  )
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

function ErrorState({ message }) {
  return (
    <div className="flex items-center justify-center h-full">
      <p className="text-red-400 text-sm">{message}</p>
    </div>
  )
}
