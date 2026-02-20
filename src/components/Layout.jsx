import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopProgressBar from './TopProgressBar'

export default function Layout({ children }) {
  const location = useLocation()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [location.pathname])

  return (
    <div className="flex min-h-screen" style={{ background: '#080d16' }}>
      <TopProgressBar loading={loading} />
      <Sidebar />
      <main className="ml-64 flex-1 p-8 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
