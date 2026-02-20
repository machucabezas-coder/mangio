import Sidebar from './Sidebar'

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      <Sidebar />
      <main className="ml-60 flex-1 p-8 min-h-screen">
        {children}
      </main>
    </div>
  )
}
