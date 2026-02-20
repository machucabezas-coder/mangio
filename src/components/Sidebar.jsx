import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, TrendingDown, TrendingUp, Building2 } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/gastos', label: 'Gastos', icon: TrendingDown },
  { to: '/ingresos', label: 'Ingresos', icon: TrendingUp },
]

function Logo() {
  return (
    <div className="px-5 py-5 border-b border-[#1f2937]">
      <div className="flex items-center gap-3">
        {/* Geometric icon */}
        <div className="w-8 h-8 rounded-xl flex items-center justify-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)', boxShadow: '0 0 16px rgba(124,58,237,0.35)' }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="9" width="4" height="7" rx="1" fill="white" fillOpacity="0.9" />
            <rect x="7" y="5" width="4" height="11" rx="1" fill="white" />
            <rect x="12" y="2" width="4" height="14" rx="1" fill="white" fillOpacity="0.7" />
          </svg>
        </div>
        <div>
          <p className="text-white font-bold text-base leading-none tracking-tight">Mangio</p>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">Finanzas</p>
        </div>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const location = useLocation()

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 flex flex-col z-20 border-r border-[#1f2937]"
      style={{ background: '#0d1424' }}>
      <Logo />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-slate-600 text-xs font-semibold uppercase tracking-widest px-3 mb-3 mt-1">
          Principal
        </p>
        {navItems.map((item) => {
          const isActive = item.end
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to)
          const Icon = item.icon

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 group"
              style={{
                color: isActive ? '#fff' : '#6b7280',
              }}
            >
              {/* Animated background pill */}
              {isActive && (
                <motion.div
                  layoutId="activePill"
                  className="absolute inset-0 rounded-xl"
                  style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(76,29,149,0.15))' }}
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                />
              )}
              {/* Active left border indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeBorder"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                  style={{ background: '#8b5cf6' }}
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                />
              )}

              <Icon
                size={17}
                className="relative z-10 flex-shrink-0 transition-colors duration-150"
                style={{ color: isActive ? '#a78bfa' : '#4b5563' }}
              />
              <span className="relative z-10 transition-colors duration-150">
                {item.label}
              </span>

              {/* Hover glow on inactive */}
              {!isActive && (
                <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  style={{ background: 'rgba(255,255,255,0.03)' }} />
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Separator */}
      <div className="mx-5 border-t border-[#1f2937]" />

      {/* User avatar */}
      <div className="px-4 py-4">
        <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/5 transition-colors duration-150 cursor-pointer">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #1e3a5f, #0d1f3c)' }}>
            <Building2 size={15} className="text-slate-400" />
          </div>
          <div className="min-w-0">
            <p className="text-slate-200 text-xs font-semibold truncate">Machu & Co.</p>
            <p className="text-slate-600 text-xs truncate">PyME · Argentina</p>
          </div>
          <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
            style={{ boxShadow: '0 0 6px #34d399' }} />
        </div>
      </div>
    </aside>
  )
}
