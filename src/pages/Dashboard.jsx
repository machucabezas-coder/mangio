import { mockGastos, mockIngresos, mockMonthlyData } from '../data/mockData'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value)

function MetricCard({ title, value, subtitle, color, icon }) {
  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color === 'text-emerald-400' ? 'bg-emerald-400/10' : color === 'text-red-400' ? 'bg-red-400/10' : color === 'text-indigo-400' ? 'bg-indigo-400/10' : 'bg-amber-400/10'}`}>
          {icon}
        </div>
      </div>
      {subtitle && <p className="text-slate-500 text-xs">{subtitle}</p>}
    </div>
  )
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-3 shadow-xl">
        <p className="text-slate-300 text-sm font-medium mb-2">{label}</p>
        {payload.map((entry) => (
          <p key={entry.name} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function getCategoryBadgeStyle(categoria) {
  const map = {
    Publicidad: 'bg-indigo-400/10 text-indigo-300',
    Embalaje: 'bg-emerald-400/10 text-emerald-300',
    Diseño: 'bg-amber-400/10 text-amber-300',
    Logística: 'bg-blue-400/10 text-blue-300',
    Microgastos: 'bg-red-400/10 text-red-300',
    'Ventas online': 'bg-emerald-400/10 text-emerald-300',
    Marketplace: 'bg-blue-400/10 text-blue-300',
    'Ventas B2B': 'bg-indigo-400/10 text-indigo-300',
    Servicios: 'bg-amber-400/10 text-amber-300',
  }
  return map[categoria] || 'bg-slate-400/10 text-slate-300'
}

export default function Dashboard() {
  const totalIngresos = mockIngresos.reduce((s, i) => s + i.monto, 0)
  const totalGastos = mockGastos.reduce((s, g) => s + g.monto, 0)
  const gananciaNeta = totalIngresos - totalGastos

  const currentMonth = '2024-03'
  const gastosEsteMes = mockGastos
    .filter((g) => g.fecha.startsWith(currentMonth))
    .reduce((s, g) => s + g.monto, 0)

  const allMovimientos = [
    ...mockIngresos.map((i) => ({ ...i, tipo: 'ingreso' })),
    ...mockGastos.map((g) => ({ ...g, tipo: 'gasto' })),
  ]
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
    .slice(0, 5)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Resumen financiero de tu empresa</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Ingresos Totales"
          value={formatCurrency(totalIngresos)}
          color="text-emerald-400"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
            </svg>
          }
        />
        <MetricCard
          title="Gastos Totales"
          value={formatCurrency(totalGastos)}
          color="text-red-400"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
            </svg>
          }
        />
        <MetricCard
          title="Ganancia Neta"
          value={formatCurrency(gananciaNeta)}
          color="text-indigo-400"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <MetricCard
          title="Gastos este mes"
          value={formatCurrency(gastosEsteMes)}
          subtitle="Marzo 2024"
          color="text-amber-400"
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
      </div>

      {/* Chart */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-6">Ingresos vs Gastos por mes</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={mockMonthlyData} barCategoryGap="30%" barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="mes" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
            <Legend
              formatter={(value) => <span className="text-slate-400 text-xs capitalize">{value}</span>}
            />
            <Bar dataKey="ingresos" name="Ingresos" fill="#34d399" radius={[4, 4, 0, 0]} />
            <Bar dataKey="gastos" name="Gastos" fill="#f87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent movements */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-4">Últimos movimientos</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#334155]">
                <th className="table-header">Tipo</th>
                <th className="table-header">Descripción</th>
                <th className="table-header">Categoría</th>
                <th className="table-header">Fecha</th>
                <th className="table-header text-right">Monto</th>
              </tr>
            </thead>
            <tbody>
              {allMovimientos.map((mov, idx) => (
                <tr key={`${mov.tipo}-${mov.id}`} className={idx < allMovimientos.length - 1 ? 'border-b border-[#334155]/50' : ''}>
                  <td className="table-cell">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${mov.tipo === 'ingreso' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${mov.tipo === 'ingreso' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                      {mov.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
                    </span>
                  </td>
                  <td className="table-cell font-medium text-slate-200">{mov.descripcion}</td>
                  <td className="table-cell">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getCategoryBadgeStyle(mov.categoria)}`}>
                      {mov.categoria}
                    </span>
                  </td>
                  <td className="table-cell text-slate-400">{new Date(mov.fecha + 'T00:00:00').toLocaleDateString('es-AR')}</td>
                  <td className={`table-cell text-right font-semibold ${mov.tipo === 'ingreso' ? 'text-emerald-400' : 'text-red-400'}`}>
                    {mov.tipo === 'ingreso' ? '+' : '-'}{formatCurrency(mov.monto)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
