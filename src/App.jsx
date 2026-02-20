import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Gastos from './pages/Gastos'
import Ingresos from './pages/Ingresos'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/gastos" element={<Gastos />} />
        <Route path="/ingresos" element={<Ingresos />} />
      </Routes>
    </Layout>
  )
}
