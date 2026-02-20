import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Filter, X, TrendingDown, User, Search } from 'lucide-react'
import { mockGastos } from '../data/mockData'
import Drawer from '../components/Drawer'

const formatCurrency = (v) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(v)

const CATEGORIAS = ['Publicidad', 'Embalaje', 'Diseño', 'Logística', 'Microgastos']
const SOCIOS = [
  { id: 'Socio 1', label: 'Machu', initials: 'MA', color: '#7c3aed', bg: 'rgba(124,58,237,0.15)' },
  { id: 'Socio 2', label: 'Socio 2', initials: 'S2', color: '#60a5fa', bg: 'rgba(96,165,250,0.15)' },
]

const CAT_STYLES = {
  Publicidad: { bg: 'rgba(129,140,248,0.12)', color: '#818cf8', border: 'rgba(129,140,248,0.25)' },
  Embalaje: { bg: 'rgba(52,211,153,0.12)', color: '#34d399', border: 'rgba(52,211,153,0.25)' },
  Diseño: { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.25)' },
  Logística: { bg: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: 'rgba(96,165,250,0.25)' },
  Microgastos: { bg: 'rgba(248,113,113,0.12)', color: '#f87171', border: 'rgba(248,113,113,0.25)' },
}

const emptyForm = {
  monto: '', descripcion: '', categoria: '',
  fecha: new Date().toISOString().split('T')[0], registrado_por: '',
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
        borderColor: selected ? style.border : '#1f2937',
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: selected ? style.color : '#374151' }} />
      {cat}
    </button>
  )
}

function SocioButton({ socio, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={() => onClick(socio.id)}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-150"
      style={{
        background: selected ? socio.bg : 'transparent',
        borderColor: selected ? socio.color + '50' : '#1f2937',
        color: selected ? socio.color : '#6b7280',
      }}
    >
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
        style={{ background: selected ? socio.color : '#1f2937', color: selected ? '#fff' : '#6b7280' }}>
        {socio.initials}
      </div>
      <span className="text-sm font-medium">{socio.label}</span>
    </button>
  )
}

export default function Gastos() {
  const [gastos, setGastos] = useState(mockGastos)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [filterCat, setFilterCat] = useState('')
  const [filterSocio, setFilterSocio] = useState('')
  const [search, setSearch] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.monto || isNaN(Number(form.monto)) || Number(form.monto) <= 0) e.monto = 'Ingresá un monto válido'
    if (!form.descripcion.trim()) e.descripcion = 'La descripción es requerida'
    if (!form.categoria) e.categoria = 'Seleccioná una categoría'
    if (!form.fecha) e.fecha = 'La fecha es requerida'
    if (!form.registrado_por) e.registrado_por = 'Seleccioná quién registra'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setGastos([{ id: Date.now(), monto: Number(form.monto), descripcion: form.descripcion, categoria: form.categoria, fecha: form.fecha, registrado_por: form.registrado_por }, ...gastos])
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
    return gastos.filter((g) => {
      if (filterCat && g.categoria !== filterCat) return false
      if (filterSocio && g.registrado_por !== filterSocio) return false
      if (search && !g.descripcion.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [gastos, filterCat, filterSocio, search])

  const totalGastos = gastos.reduce((s, g) => s + g.monto, 0)
  const totalFiltered = filtered.reduce((s, g) => s + g.monto, 0)

  // Category totals
  const catTotals = CATEGORIAS.map((c) => ({
    cat: c,
    total: gastos.filter((g) => g.categoria === c).reduce((s, g) => s + g.monto, 0),
  })).filter((c) => c.total > 0)

  const hasFilters = filterCat || filterSocio || search

  return (
    <div className="space-y-8 max-w-[1200px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Gastos</h1>
          <p className="text-slate-500 text-sm mt-1">Registrá y gestioná los gastos de tu empresa</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="card py-3 px-5 text-right">
            <p className="text-slate-500 text-xs">Total gastos</p>
            <p className="text-red-400 text-lg font-bold mt-0.5">{formatCurrency(totalGastos)}</p>
          </div>
          <button className="btn-primary" onClick={() => setDrawerOpen(true)}>
            <Plus size={16} />
            Nuevo gasto
          </button>
        </div>
      </motion.div>

      {/* Category totals badges */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2"
      >
        {catTotals.map((c) => {
          const style = CAT_STYLES[c.cat] || {}
          return (
            <button
              key={c.cat}
              onClick={() => setFilterCat(filterCat === c.cat ? '' : c.cat)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150"
              style={{
                background: filterCat === c.cat ? style.bg : 'rgba(255,255,255,0.03)',
                color: filterCat === c.cat ? style.color : '#6b7280',
                borderColor: filterCat === c.cat ? style.border : '#1f2937',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: style.color }} />
              {c.cat}
              <span className="opacity-70">{formatCurrency(c.total)}</span>
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
            placeholder="Buscar gasto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-9"
          />
        </div>
        <select
          value={filterSocio}
          onChange={(e) => setFilterSocio(e.target.value)}
          className="input-field w-auto"
        >
          <option value="">Todos los socios</option>
          {SOCIOS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        {hasFilters && (
          <button
            className="btn-ghost text-slate-500 hover:text-slate-300"
            onClick={() => { setFilterCat(''); setFilterSocio(''); setSearch('') }}
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
            <h2 className="text-white font-semibold text-sm">Todos los gastos</h2>
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
              style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.15)' }}>
              <TrendingDown size={24} className="text-red-400 opacity-60" />
            </div>
            <p className="text-slate-400 text-sm font-medium">No se encontraron gastos</p>
            <p className="text-slate-600 text-xs">Probá con otros filtros o registrá un nuevo gasto</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-6">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1f2937]">
                  <th className="table-header pl-6">Descripción</th>
                  <th className="table-header">Categoría</th>
                  <th className="table-header">Registrado por</th>
                  <th className="table-header">Fecha</th>
                  <th className="table-header text-right pr-6">Monto</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((gasto, idx) => {
                    const catStyle = CAT_STYLES[gasto.categoria] || {}
                    const socio = SOCIOS.find((s) => s.id === gasto.registrado_por) || SOCIOS[0]
                    return (
                      <motion.tr
                        key={gasto.id}
                        className="table-row-hover border-b border-[#1f2937]/60 last:border-0"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: idx * 0.03 }}
                        layout
                      >
                        <td className="table-cell pl-6 font-medium text-slate-200">{gasto.descripcion}</td>
                        <td className="table-cell">
                          <span className="badge" style={{ background: catStyle.bg, color: catStyle.color }}>
                            {gasto.categoria}
                          </span>
                        </td>
                        <td className="table-cell">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                              style={{ background: socio.bg, color: socio.color }}>
                              {socio.initials}
                            </div>
                            <span className="text-slate-400 text-xs">{socio.label}</span>
                          </div>
                        </td>
                        <td className="table-cell text-slate-500 text-xs">
                          {new Date(gasto.fecha + 'T00:00:00').toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="table-cell text-right font-bold text-red-400 pr-6">
                          −{formatCurrency(gasto.monto)}
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
      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title="Registrar nuevo gasto">
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
              <p className="text-white font-semibold">¡Gasto registrado!</p>
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
                  placeholder="Ej: Campaña Facebook Ads"
                  className={`input-field ${errors.descripcion ? 'error' : ''}`}
                />
                {errors.descripcion && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-1.5">{errors.descripcion}</motion.p>
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

              {/* Socio */}
              <div>
                <label className="label">Registrado por</label>
                <div className="flex gap-3 mt-1">
                  {SOCIOS.map((s) => (
                    <SocioButton
                      key={s.id}
                      socio={s}
                      selected={form.registrado_por === s.id}
                      onClick={(v) => handleChange('registrado_por', form.registrado_por === v ? '' : v)}
                    />
                  ))}
                </div>
                {errors.registrado_por && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs mt-1.5">{errors.registrado_por}</motion.p>
                )}
              </div>

              {/* Submit */}
              <button type="submit" className="btn-primary w-full justify-center py-3 mt-2">
                <TrendingDown size={16} />
                Registrar gasto
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </Drawer>
    </div>
  )
}
