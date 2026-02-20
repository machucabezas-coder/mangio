import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, Sector,
} from 'recharts'
import {
  TrendingUp, TrendingDown, Wallet, CalendarDays,
  ArrowUpRight, ArrowDownRight, Sparkles,
} from 'lucide-react'
import { mockGastos, mockIngresos, mockMonthlyData, categoryColors } from '../data/mockData'

const formatCurrency = (v) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(v)

// Count-up hook
function useCountUp(target, duration = 1400, start = true) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!start) return
    const startTime = performance.now()
    const update = (now) => {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(update)
    }
    requestAnimationFrame(update)
  }, [target, duration, start])
  return value
}

// Skeleton block
function Skeleton({ className }) {
  return <div className={`skeleton ${className}`} />
}

// Custom bar chart tooltip
const BarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="rounded-xl border border-[#2d3748] p-4 shadow-2xl"
      style={{ background: '#111827', minWidth: 180 }}
    >
      <p className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-3">{label}</p>
      {payload.map((e) => (
        <div key={e.name} className="flex items-center justify-between gap-6 mb-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: e.color }} />
            <span className="text-slate-400 text-xs">{e.name}</span>
          </div>
          <span className="text-white text-xs font-bold">{formatCurrency(e.value)}</span>
        </div>
      ))}
    </motion.div>
  )
}

// Custom pie tooltip
const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="rounded-xl border border-[#2d3748] px-4 py-3 shadow-2xl"
      style={{ background: '#111827' }}>
      <p className="text-white text-xs font-semibold mb-1">{item.name}</p>
      <p className="text-slate-300 text-xs">{formatCurrency(item.value)}</p>
    </div>
  )
}

// Metric Card
function MetricCard({ title, value, icon: Icon, iconColor, iconBg, trend, trendValue, delay = 0, loaded }) {
  const animated = useCountUp(value, 1200, loaded)

  return (
    <motion.div
      className="card-hover relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 rounded-xl opacity-30"
        style={{ background: `radial-gradient(ellipse at top right, ${iconBg}30, transparent 70%)` }} />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: iconBg }}>
            <Icon size={18} style={{ color: iconColor }} />
          </div>
          {trendValue !== undefined && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
              trend === 'up' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'
            }`}>
              {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {trendValue}%
            </div>
          )}
        </div>

        {loaded ? (
          <p className="text-2xl font-bold text-white tracking-tight">
            {formatCurrency(animated)}
          </p>
        ) : (
          <Skeleton className="h-8 w-36 mb-1" />
        )}
        <p className="text-slate-500 text-xs font-medium mt-1.5">{title}</p>
      </div>
    </motion.div>
  )
}

// Category distribution for pie chart
function buildPieData() {
  const totals = {}
  mockGastos.forEach((g) => {
    totals[g.categoria] = (totals[g.categoria] || 0) + g.monto
  })
  return Object.entries(totals).map(([name, value]) => ({ name, value }))
}

const pieColors = {
  Publicidad: '#818cf8',
  Embalaje: '#34d399',
  Diseño: '#f59e0b',
  Logística: '#60a5fa',
  Microgastos: '#f87171',
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Buenos días'
  if (h < 18) return 'Buenas tardes'
  return 'Buenas noches'
}

function getDate() {
  return new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

function getCategoryBadge(cat) {
  const map = {
    Publicidad: { bg: 'rgba(129,140,248,0.1)', color: '#818cf8' },
    Embalaje: { bg: 'rgba(52,211,153,0.1)', color: '#34d399' },
    Diseño: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
    Logística: { bg: 'rgba(96,165,250,0.1)', color: '#60a5fa' },
    Microgastos: { bg: 'rgba(248,113,113,0.1)', color: '#f87171' },
    'Ventas online': { bg: 'rgba(52,211,153,0.1)', color: '#34d399' },
    Marketplace: { bg: 'rgba(96,165,250,0.1)', color: '#60a5fa' },
    'Ventas B2B': { bg: 'rgba(129,140,248,0.1)', color: '#818cf8' },
    Servicios: { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b' },
  }
  return map[cat] || { bg: 'rgba(107,114,128,0.1)', color: '#6b7280' }
}

export default function Dashboard() {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 800)
    return () => clearTimeout(t)
  }, [])

  const totalIngresos = mockIngresos.reduce((s, i) => s + i.monto, 0)
  const totalGastos = mockGastos.reduce((s, g) => s + g.monto, 0)
  const gananciaNeta = totalIngresos - totalGastos
  const gastosEsteMes = mockGastos.filter((g) => g.fecha.startsWith('2024-03')).reduce((s, g) => s + g.monto, 0)

  const allMovimientos = [
    ...mockIngresos.map((i) => ({ ...i, tipo: 'ingreso' })),
    ...mockGastos.map((g) => ({ ...g, tipo: 'gasto' })),
  ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 6)

  const pieData = buildPieData()

  const metrics = [
    { title: 'Ingresos Totales', value: totalIngresos, icon: TrendingUp, iconColor: '#34d399', iconBg: 'rgba(52,211,153,0.12)', trend: 'up', trendValue: 6.8, delay: 0 },
    { title: 'Gastos Totales', value: totalGastos, icon: TrendingDown, iconColor: '#f87171', iconBg: 'rgba(248,113,113,0.12)', trend: 'down', trendValue: 12.4, delay: 0.05 },
    { title: 'Ganancia Neta', value: gananciaNeta, icon: Wallet, iconColor: '#a78bfa', iconBg: 'rgba(167,139,250,0.12)', trend: 'up', trendValue: 18.2, delay: 0.1 },
    { title: 'Gastos este Mes', value: gastosEsteMes, icon: CalendarDays, iconColor: '#fbbf24', iconBg: 'rgba(251,191,36,0.12)', trend: 'up', trendValue: 14.1, delay: 0.15 },
  ]

  return (
    <div className="space-y-8 max-w-[1400px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-start justify-between"
      >
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Sparkles size={16} className="text-violet-400" />
            <p className="text-slate-400 text-sm font-medium">{getGreeting()}, Machu 👋</p>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard</h1>
        </div>
        <div className="text-right">
          <p className="text-slate-500 text-xs font-medium capitalize">{getDate()}</p>
          <div className="flex items-center justify-end gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ boxShadow: '0 0 5px #34d399' }} />
            <p className="text-emerald-400 text-xs font-medium">Datos actualizados</p>
          </div>
        </div>
      </motion.div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loaded
          ? metrics.map((m, i) => <MetricCard key={m.title} {...m} loaded={loaded} />)
          : Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card space-y-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <motion.div
          className="card xl:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white font-semibold text-sm">Ingresos vs Gastos</h2>
              <p className="text-slate-500 text-xs mt-0.5">Últimos 6 meses</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#34d399' }} />
                <span className="text-slate-400 text-xs">Ingresos</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: '#f87171' }} />
                <span className="text-slate-400 text-xs">Gastos</span>
              </div>
            </div>
          </div>
          {loaded ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={mockMonthlyData} barCategoryGap="35%" barGap={3}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.7} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f87171" stopOpacity={1} />
                    <stop offset="100%" stopColor="#dc2626" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: '#4b5563', fontSize: 11, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={{ fill: '#4b5563', fontSize: 11, fontFamily: 'Inter' }} axisLine={false} tickLine={false} />
                <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(139,92,246,0.05)', radius: 6 }} />
                <Bar dataKey="ingresos" name="Ingresos" fill="url(#incomeGrad)" radius={[5, 5, 0, 0]} />
                <Bar dataKey="gastos" name="Gastos" fill="url(#expenseGrad)" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="space-y-3">
              <div className="flex items-end gap-3 h-[260px]">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex-1 flex items-end gap-1">
                    <Skeleton className="flex-1" style={{ height: `${40 + Math.random() * 150}px` }} />
                    <Skeleton className="flex-1" style={{ height: `${30 + Math.random() * 100}px` }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Donut Chart */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="mb-6">
            <h2 className="text-white font-semibold text-sm">Distribución de Gastos</h2>
            <p className="text-slate-500 text-xs mt-0.5">Por categoría</p>
          </div>
          {loaded ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                    animationBegin={400}
                    animationDuration={800}
                  >
                    {pieData.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={pieColors[entry.name] || '#6b7280'}
                        stroke="transparent"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {pieData.map((entry) => {
                  const pct = Math.round((entry.value / totalGastos) * 100)
                  return (
                    <div key={entry.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: pieColors[entry.name] }} />
                        <span className="text-slate-400 text-xs">{entry.name}</span>
                      </div>
                      <span className="text-slate-300 text-xs font-semibold">{pct}%</span>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <Skeleton className="w-36 h-36 rounded-full" />
              <div className="w-full space-y-2">
                {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-4" />)}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Movements */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-white font-semibold text-sm">Últimos movimientos</h2>
            <p className="text-slate-500 text-xs mt-0.5">Ingresos y gastos recientes</p>
          </div>
          <span className="badge" style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa' }}>
            {allMovimientos.length} registros
          </span>
        </div>

        {loaded ? (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1f2937]">
                  <th className="table-header pl-6">Tipo</th>
                  <th className="table-header">Descripción</th>
                  <th className="table-header">Categoría</th>
                  <th className="table-header">Fecha</th>
                  <th className="table-header text-right pr-6">Monto</th>
                </tr>
              </thead>
              <tbody>
                {allMovimientos.map((mov, idx) => {
                  const cat = getCategoryBadge(mov.categoria)
                  return (
                    <tr
                      key={`${mov.tipo}-${mov.id}`}
                      className="table-row-hover border-b border-[#1f2937]/60 last:border-0"
                    >
                      <td className="table-cell pl-6">
                        <span className="badge" style={{
                          background: mov.tipo === 'ingreso' ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)',
                          color: mov.tipo === 'ingreso' ? '#34d399' : '#f87171',
                        }}>
                          {mov.tipo === 'ingreso' ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
                          {mov.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
                        </span>
                      </td>
                      <td className="table-cell font-medium text-slate-200">{mov.descripcion}</td>
                      <td className="table-cell">
                        <span className="badge" style={{ background: cat.bg, color: cat.color }}>
                          {mov.categoria}
                        </span>
                      </td>
                      <td className="table-cell text-slate-500 text-xs">
                        {new Date(mov.fecha + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className={`table-cell text-right font-bold pr-6 ${mov.tipo === 'ingreso' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {mov.tipo === 'ingreso' ? '+' : '−'}{formatCurrency(mov.monto)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24 ml-auto" />
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
