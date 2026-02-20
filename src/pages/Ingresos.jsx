import { useState } from 'react'
import { mockIngresos } from '../data/mockData'

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value)

const CATEGORIAS = ['Ventas online', 'Marketplace', 'Ventas B2B', 'Servicios', 'Otros']
const FUENTES = ['Shopify', 'Mercado Libre', 'Manual']

const fuenteBadge = {
  Shopify: 'bg-emerald-400/10 text-emerald-300',
  'Mercado Libre': 'bg-blue-400/10 text-blue-300',
  Manual: 'bg-amber-400/10 text-amber-300',
}

const categoriaBadge = {
  'Ventas online': 'bg-emerald-400/10 text-emerald-300',
  Marketplace: 'bg-blue-400/10 text-blue-300',
  'Ventas B2B': 'bg-indigo-400/10 text-indigo-300',
  Servicios: 'bg-amber-400/10 text-amber-300',
  Otros: 'bg-slate-400/10 text-slate-300',
}

const emptyForm = {
  monto: '',
  descripcion: '',
  categoria: '',
  fecha: new Date().toISOString().split('T')[0],
  fuente: '',
}

export default function Ingresos() {
  const [ingresos, setIngresos] = useState(mockIngresos)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [showSuccess, setShowSuccess] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.monto || isNaN(Number(form.monto)) || Number(form.monto) <= 0)
      errs.monto = 'Ingresá un monto válido'
    if (!form.descripcion.trim()) errs.descripcion = 'La descripción es requerida'
    if (!form.categoria) errs.categoria = 'Seleccioná una categoría'
    if (!form.fecha) errs.fecha = 'La fecha es requerida'
    if (!form.fuente) errs.fuente = 'Seleccioná la fuente'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    const newIngreso = {
      id: ingresos.length + 1,
      monto: Number(form.monto),
      descripcion: form.descripcion,
      categoria: form.categoria,
      fecha: form.fecha,
      fuente: form.fuente,
    }
    setIngresos([newIngreso, ...ingresos])
    setForm(emptyForm)
    setErrors({})
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: undefined })
  }

  const totalIngresos = ingresos.reduce((s, i) => s + i.monto, 0)

  const byFuente = FUENTES.map((f) => ({
    fuente: f,
    total: ingresos.filter((i) => i.fuente === f).reduce((s, i) => s + i.monto, 0),
  }))

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Ingresos</h1>
          <p className="text-slate-400 text-sm mt-1">Registrá y gestioná los ingresos de tu empresa</p>
        </div>
        <div className="card text-right py-3 px-5 min-w-[180px]">
          <p className="text-slate-400 text-xs uppercase tracking-wide">Total ingresos</p>
          <p className="text-emerald-400 text-xl font-bold mt-0.5">{formatCurrency(totalIngresos)}</p>
        </div>
      </div>

      {/* Mini summary by source */}
      <div className="grid grid-cols-3 gap-4">
        {byFuente.map((item) => (
          <div key={item.fuente} className="card py-3">
            <div className="flex items-center gap-2 mb-2">
              <span className={`w-2 h-2 rounded-full ${item.fuente === 'Shopify' ? 'bg-emerald-400' : item.fuente === 'Mercado Libre' ? 'bg-blue-400' : 'bg-amber-400'}`} />
              <span className="text-slate-400 text-xs font-medium">{item.fuente}</span>
            </div>
            <p className="text-white font-semibold text-base">{formatCurrency(item.total)}</p>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-5">Registrar nuevo ingreso</h2>

        {showSuccess && (
          <div className="mb-4 flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 text-sm px-4 py-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Ingreso registrado correctamente
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {/* Monto */}
            <div>
              <label className="label">Monto ($)</label>
              <input
                type="number"
                name="monto"
                value={form.monto}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className={`input-field ${errors.monto ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.monto && <p className="text-red-400 text-xs mt-1">{errors.monto}</p>}
            </div>

            {/* Descripción */}
            <div>
              <label className="label">Descripción</label>
              <input
                type="text"
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Ej: Ventas semana 1"
                className={`input-field ${errors.descripcion ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.descripcion && <p className="text-red-400 text-xs mt-1">{errors.descripcion}</p>}
            </div>

            {/* Categoría */}
            <div>
              <label className="label">Categoría</label>
              <select
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                className={`input-field ${errors.categoria ? 'border-red-500 focus:ring-red-500' : ''}`}
              >
                <option value="">Seleccioná una categoría</option>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.categoria && <p className="text-red-400 text-xs mt-1">{errors.categoria}</p>}
            </div>

            {/* Fecha */}
            <div>
              <label className="label">Fecha</label>
              <input
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                className={`input-field ${errors.fecha ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.fecha && <p className="text-red-400 text-xs mt-1">{errors.fecha}</p>}
            </div>

            {/* Fuente */}
            <div>
              <label className="label">Fuente</label>
              <select
                name="fuente"
                value={form.fuente}
                onChange={handleChange}
                className={`input-field ${errors.fuente ? 'border-red-500 focus:ring-red-500' : ''}`}
              >
                <option value="">Seleccioná la fuente</option>
                {FUENTES.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
              {errors.fuente && <p className="text-red-400 text-xs mt-1">{errors.fuente}</p>}
            </div>

            {/* Submit */}
            <div className="flex items-end">
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Registrar ingreso
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Todos los ingresos</h2>
          <span className="text-slate-400 text-sm">{ingresos.length} registros</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#334155]">
                <th className="table-header">Descripción</th>
                <th className="table-header">Categoría</th>
                <th className="table-header">Fuente</th>
                <th className="table-header">Fecha</th>
                <th className="table-header text-right">Monto</th>
              </tr>
            </thead>
            <tbody>
              {ingresos.map((ingreso, idx) => (
                <tr key={ingreso.id} className={idx < ingresos.length - 1 ? 'border-b border-[#334155]/50' : ''}>
                  <td className="table-cell font-medium text-slate-200">{ingreso.descripcion}</td>
                  <td className="table-cell">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${categoriaBadge[ingreso.categoria] || 'bg-slate-400/10 text-slate-300'}`}>
                      {ingreso.categoria}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${fuenteBadge[ingreso.fuente] || 'bg-slate-400/10 text-slate-300'}`}>
                      {ingreso.fuente}
                    </span>
                  </td>
                  <td className="table-cell text-slate-400">
                    {new Date(ingreso.fecha + 'T00:00:00').toLocaleDateString('es-AR')}
                  </td>
                  <td className="table-cell text-right font-semibold text-emerald-400">
                    +{formatCurrency(ingreso.monto)}
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
