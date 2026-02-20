import { useState } from 'react'
import { mockGastos } from '../data/mockData'

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value)

const CATEGORIAS = ['Publicidad', 'Embalaje', 'Diseño', 'Logística', 'Microgastos']
const SOCIOS = ['Socio 1', 'Socio 2']

const categoryBadge = {
  Publicidad: 'bg-indigo-400/10 text-indigo-300',
  Embalaje: 'bg-emerald-400/10 text-emerald-300',
  Diseño: 'bg-amber-400/10 text-amber-300',
  Logística: 'bg-blue-400/10 text-blue-300',
  Microgastos: 'bg-red-400/10 text-red-300',
}

const emptyForm = {
  monto: '',
  descripcion: '',
  categoria: '',
  fecha: new Date().toISOString().split('T')[0],
  registrado_por: '',
}

export default function Gastos() {
  const [gastos, setGastos] = useState(mockGastos)
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
    if (!form.registrado_por) errs.registrado_por = 'Seleccioná quién registra'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    const newGasto = {
      id: gastos.length + 1,
      monto: Number(form.monto),
      descripcion: form.descripcion,
      categoria: form.categoria,
      fecha: form.fecha,
      registrado_por: form.registrado_por,
    }
    setGastos([newGasto, ...gastos])
    setForm(emptyForm)
    setErrors({})
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: undefined })
  }

  const totalGastos = gastos.reduce((s, g) => s + g.monto, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gastos</h1>
          <p className="text-slate-400 text-sm mt-1">Registrá y gestioná los gastos de tu empresa</p>
        </div>
        <div className="card text-right py-3 px-5 min-w-[180px]">
          <p className="text-slate-400 text-xs uppercase tracking-wide">Total gastos</p>
          <p className="text-red-400 text-xl font-bold mt-0.5">{formatCurrency(totalGastos)}</p>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <h2 className="text-base font-semibold text-white mb-5">Registrar nuevo gasto</h2>

        {showSuccess && (
          <div className="mb-4 flex items-center gap-2 bg-emerald-400/10 border border-emerald-400/20 text-emerald-300 text-sm px-4 py-3 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Gasto registrado correctamente
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
                placeholder="Ej: Campaña Facebook Ads"
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

            {/* Registrado por */}
            <div>
              <label className="label">Registrado por</label>
              <select
                name="registrado_por"
                value={form.registrado_por}
                onChange={handleChange}
                className={`input-field ${errors.registrado_por ? 'border-red-500 focus:ring-red-500' : ''}`}
              >
                <option value="">Seleccioná un socio</option>
                {SOCIOS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.registrado_por && <p className="text-red-400 text-xs mt-1">{errors.registrado_por}</p>}
            </div>

            {/* Submit */}
            <div className="flex items-end">
              <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 py-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Registrar gasto
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-white">Todos los gastos</h2>
          <span className="text-slate-400 text-sm">{gastos.length} registros</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#334155]">
                <th className="table-header">Descripción</th>
                <th className="table-header">Categoría</th>
                <th className="table-header">Fecha</th>
                <th className="table-header">Registrado por</th>
                <th className="table-header text-right">Monto</th>
              </tr>
            </thead>
            <tbody>
              {gastos.map((gasto, idx) => (
                <tr key={gasto.id} className={idx < gastos.length - 1 ? 'border-b border-[#334155]/50' : ''}>
                  <td className="table-cell font-medium text-slate-200">{gasto.descripcion}</td>
                  <td className="table-cell">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${categoryBadge[gasto.categoria] || 'bg-slate-400/10 text-slate-300'}`}>
                      {gasto.categoria}
                    </span>
                  </td>
                  <td className="table-cell text-slate-400">
                    {new Date(gasto.fecha + 'T00:00:00').toLocaleDateString('es-AR')}
                  </td>
                  <td className="table-cell">
                    <span className="inline-flex items-center gap-1.5 text-slate-400">
                      <span className="w-5 h-5 rounded-full bg-[#334155] flex items-center justify-center text-xs text-slate-300 font-medium">
                        {gasto.registrado_por === 'Socio 1' ? '1' : '2'}
                      </span>
                      {gasto.registrado_por}
                    </span>
                  </td>
                  <td className="table-cell text-right font-semibold text-red-400">
                    -{formatCurrency(gasto.monto)}
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
