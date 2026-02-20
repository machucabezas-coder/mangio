import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Search, X, TrendingUp, Zap, ShoppingBag, Pencil } from 'lucide-react'
import { mockIngresos } from '../data/mockData'
import Drawer from '../components/Drawer'

const formatCurrency = (v) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(v)

const CATEGORIAS = ['Ventas online', 'Marketplace', 'Ventas B2B', 'Servicios', 'Otros']
const FUENTES = [
  { id: 'Shopify', label: 'Shopify', color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.25)', icon: ShoppingBag },
  { id: 'Mercado Libre', label: 'Mercado Libre', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.25)', icon: Zap },
  { id: 'Manual', label: 'Manual', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.25)', icon: Pencil },
]

const CAT_STYLES = {
  'Ventas online': { bg: 'rgba(52,211,153,0.1)', color: '#34d399' },
  Marketplace: { bg: 'rgba(251,191,36,0.1)', color: '#fbbf24' },
  'Ventas B2B': { bg: 'rgba(129,140,248,0.1)', color: '#818cf8' },
  Servicios: { bg: 'rgba(167,139,250,0.1)', color: '#a78bfa' },
  Otros: { bg: 'rgba(107,114,128,0.1)', color: '#6b7280' },
}

const emptyForm = {
  monto: '', descripcion: '', categoria: '',
  fecha: new Date().toISOString().split('T')[0], fuente: '',
}

function CategoryChip({ cat, selected, onClick }) {
  const style = CAT_STYLES[cat] || {}
  return (
    <button
      type="button"
      onClick={() => onClick(cat)}
      className="chip"
      style={{
        background: selected ? style.bg : 'transparent',
        color: selected ? style.color : '#6b7280',
        borderColor: selected ? style.color + '40' : '#1f2937',
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: selected ? style.color : '#374151' }} />
      {cat}
    </button>
  )
}

function FuenteButton({ fuente, selected, onClick }) {
  const Icon = fuente.icon
  return (
    <button
      type="button"
      onClick={() => onClick(fuente.id)}
      className="flex-1 flex flex-col items-center gap-2 py-3 px-2 rounded-xl border transition-all duration-150"
      style={{
        background: selected ? fuente.bg : 'transparent',
        borderColor: selected ? fuente.border : '#1f2937',
        color: selected ? fuente.color : '#6b7280',
        boxShadow: selected ? `0 0 16px ${fuente.bg}` : 'none',
      }}
    >
      <Icon size={18} />
      <span className="text-xs font-semibold">{fuente.label}</span>
    </button>
  )
}

export default function Ingresos() {
  const [ingresos, setIngresos] = useState(mockIngresos)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [filterFuente, setFilterFuente] = useState('')
  const [filterCat, setFilterCat] = useState('')
  const [search, setSearch] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.monto || isNaN(Number(form.monto)) || Number(form.monto) <= 0) e.monto = 'Ingresá un monto válido'
    if (!form.descripcion.trim()) e.descripcion = 'La descripción es requerida'
    if (!form.categoria) e.categoria = 'Seleccioná una categoría'
    if (!form.fecha) e.fecha = 'La fecha es requerida'
    if (!form.fuente) e.fuente = 'Seleccioná la fuente'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setIngresos([{ id: Date.now(), monto: Number(form.monto), descripcion: form.descripcion, categoria: form.categoria, fecha: form.fecha, fuente: form.fuente }, ...ingresos])
    setForm(emptyForm)
    setErrors({})
    setSubmitted(true)
    setTimeout(() => { setSubmitted(false); setDrawerOpen(false) }, 1500)
  }

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }))
  }

  const filtered = useMemo(() => {
    return ingresos.filter((i) => {
      if (filterFuente && i.fuente !== filterFuente) return false
      if (filterCat && i.categoria !== filterCat) return false
      if (search && !i.descripcion.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [ingresos, filterFuente, filterCat, search])

  const totalIngresos = ingresos.reduce((s, i) => s + i.monto, 0)
  const totalFiltered = filtered.reduce((s, i) => s + i.monto, 0)
  const hasFilters = filterFuente || filterCat || search

  // Per-source totals
  const fuenteTotals = FUENTES.map((f) => ({
    ...f,
    total: ingresos.filter((i) => i.fuente === f.id).reduce((s, i) => s + i.monto, 0),
  }))

  return (
    <div className="space-y-8 max-w-[1200px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Ingresos</h1>
          <p className="text-slate-500 text-sm mt-1">Registrá y gestioná los ingresos de tu empresa</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="card py-3 px-5 text-right">
            <p className="text-slate-500 text-xs">Total ingresos</p>
            <p className="text-emerald-400 text-lg font-bold mt-0.5">{formatCurrency(totalIngresos)}</p>
          </div>
          <button className="btn-primary" onClick={() => setDrawerOpen(true)}>
            <Plus size={16} />
            Nuevo ingreso
          </button>
        </div>
      </motion.div>

      {/* Source cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="grid grid-cols-3 gap-4"
      >
        {fuenteTotals.map((f) => {
          const Icon = f.icon
          return (
            <button
              key={f.id}
              onClick={() => setFilterFuente(filterFuente === f.id ? '' : f.id)}
              className="card-hover text-left cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: f.bg, border: `1px solid ${f.border}` }}>
                  <Icon size={16} style={{ color: f.color }} />
                </div>
                <span className="text-slate-300 text-sm font-semibold">{f.label}</span>
                {filterFuente === f.id && (
                  <span className="ml-auto badge text-xs"
                    style={{ background: f.bg, color: f.color }}>
                    activo
                  </span>
                )}
              </div>
              <p className="text-white text-xl font-bold">{formatCurrency(f.total)}</p>
              <p className="text-slate-600 text-xs mt-1">
                {ingresos.filter((i) => i.fuente === f.id).length} registros
              </p>
            </button>
          )
        })}
      </motion.div>

      {/* Filter bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex items-center gap-3"
      >
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar ingreso..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <select
          value={filterCat}
          onChange={(e) => setFilterCat(e.target.value)}
          className="input-field w-auto"
        >
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {hasFilters && (
          <button
            className="btn-ghost text-slate-500 hover:text-slate-300"
            onClick={() => { setFilterFuente(''); setFilterCat(''); setSearch('') }}
          >
            <X size={14} />
            Limpiar
          </button>
        )}
      </motion.div>

      {/* Table */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-white font-semibold text-sm">Todos los ingresos</h2>
            {hasFilters && (
              <p className="text-slate-500 text-xs mt-0.5">
                {filtered.length} resultados · {formatCurrency(totalFiltered)} total
              </p>
            )}
          </div>
          <span className="text-slate-500 text-xs">{filtered.length} registros</span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.15)' }}>
              <TrendingUp size={24} className="text-emerald-400 opacity-60" />
            </div>
            <p className="text-slate-400 text-sm font-medium">No se encontraron ingresos</p>
            <p className="text-slate-600 text-xs">Probá con otros filtros o registrá un nuevo ingreso</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1f2937]">
                  <th className="table-header pl-6">Descripción</th>
                  <th className="table-header">Categoría</th>
                  <th className="table-header">Fuente</th>
                  <th className="table-header">Fecha</th>
                  <th className="table-header text-right pr-6">Monto</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((ingreso, idx) => {
                    const cat = CAT_STYLES[ingreso.categoria] || CAT_STYLES['Otros']
                    const fuente = FUENTES.find((f) => f.id === ingreso.fuente) || FUENTES[2]
                    const Icon = fuente.icon
                    return (
                      <motion.tr
                        key={ingreso.id}
                        className="table-row-hover border-b border-[#1f2937]/60 last:border-0"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: idx * 0.03 }}
                        layout
                      >
                        <td className="table-cell pl-6 font-medium text-slate-200">{ingreso.descripcion}</td>
                        <td className="table-cell">
                          <span className="badge" style={{ background: cat.bg, color: cat.color }}>
                            {ingreso.categoria}
                          </span>
                        </td>
                        <td className="table-cell">
                          <span className="badge" style={{ background: fuente.bg, color: fuente.color }}>
                            <Icon size={11} />
                            {fuente.label}
                          </span>
                        </td>
                        <td className="table-cell text-slate-500 text-xs">
                          {new Date(ingreso.fecha + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="table-cell text-right font-bold text-emerald-400 pr-6">
                          +{formatCurrency(ingreso.monto)}
                        </td>
                      </motion.tr>
                    )
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Drawer */}
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Registrar nuevo ingreso">
        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 gap-4"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.2)' }}>
                <span className="text-3xl">✓</span>
              </div>
              <p className="text-white font-semibold">¡Ingreso registrado!</p>
              <p className="text-slate-500 text-sm">Cerrando panel...</p>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit}
              noValidate
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Monto */}
              <div>
                <label className="label">Monto (ARS)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">$</span>
                  <input
                    type="number"
                    value={form.monto}
                    onChange={(e) => handleChange('monto', e.target.value)}
                    placeholder="0"
                    min="0"
                    className={`input-field pl-7 text-lg font-semibold ${errors.monto ? 'error' : ''}`}
                  />
                </div>
                {errors.monto && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-1.5">{errors.monto}</motion.p>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label className="label">Descripción</label>
                <input
                  type="text"
                  value={form.descripcion}
                  onChange={(e) => handleChange('descripcion', e.target.value)}
                  placeholder="Ej: Ventas semana 1"
                  className={`input-field ${errors.descripcion ? 'error' : ''}`}
                />
                {errors.descripcion && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-1.5">{errors.descripcion}</motion.p>
                )}
              </div>

              {/* Fuente */}
              <div>
                <label className="label">Fuente</label>
                <div className="flex gap-2 mt-1">
                  {FUENTES.map((f) => (
                    <FuenteButton
                      key={f.id}
                      fuente={f}
                      selected={form.fuente === f.id}
                      onClick={(v) => handleChange('fuente', form.fuente === v ? '' : v)}
                    />
                  ))}
                </div>
                {errors.fuente && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-1.5">{errors.fuente}</motion.p>
                )}
              </div>

              {/* Categoría chips */}
              <div>
                <label className="label">Categoría</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {CATEGORIAS.map((c) => (
                    <CategoryChip
                      key={c}
                      cat={c}
                      selected={form.categoria === c}
                      onClick={(v) => handleChange('categoria', form.categoria === v ? '' : v)}
                    />
                  ))}
                </div>
                {errors.categoria && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-1.5">{errors.categoria}</motion.p>
                )}
              </div>

              {/* Fecha */}
              <div>
                <label className="label">Fecha</label>
                <input
                  type="date"
                  value={form.fecha}
                  onChange={(e) => handleChange('fecha', e.target.value)}
                  className={`input-field ${errors.fecha ? 'error' : ''}`}
                />
                {errors.fecha && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-1.5">{errors.fecha}</motion.p>
                )}
              </div>

              {/* Submit */}
              <button type="submit" className="btn-primary w-full justify-center py-3 mt-2"
                style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
                <TrendingUp size={16} />
                Registrar ingreso
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </Drawer>
    </div>
  )
}
