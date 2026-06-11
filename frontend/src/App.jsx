import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Insumos from './pages/Insumos'
import Productos from './pages/Productos'
import Baristas from './pages/Baristas'

const PAGES = {
  dashboard: Dashboard,
  insumos:   Insumos,
  productos: Productos,
  baristas:  Baristas,
}

export default function App() {
  const [page, setPage] = useState('dashboard')
  const Page = PAGES[page]

  return (
    <div className="layout">
      <Sidebar active={page} onNav={setPage} />
      <main className="main-content">
        <Page />
      </main>
    </div>
  )
}
