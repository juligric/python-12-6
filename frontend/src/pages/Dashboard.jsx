import { useEffect, useState } from 'react'

const API = '/api'

export default function Dashboard() {
  const [insumos,   setInsumos]   = useState([])
  const [productos, setProductos] = useState([])
  const [baristas,  setBaristas]  = useState([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API}/insumos`).then(r => r.json()),
      fetch(`${API}/productos`).then(r => r.json()),
      fetch(`${API}/baristas`).then(r => r.json()),
    ]).then(([i, p, b]) => {
      setInsumos(i)
      setProductos(p)
      setBaristas(b)
      setLoading(false)
    })
  }, [])

  const bajoStock = insumos.filter(i => i.stock_actual < 10)

  if (loading) return (
    <div className="loading">
      <div className="spinner" />
      Cargando datos...
    </div>
  )

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard <span>General</span></h1>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {bajoStock.length > 0 && (
        <div className="alert-banner">
          ⚠️ {bajoStock.length} insumo{bajoStock.length > 1 ? 's' : ''} con stock bajo:{' '}
          {bajoStock.map(i => i.nombre_insumo).join(', ')}
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>{insumos.length}</h3>
            <p>Insumos</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">☕</div>
          <div className="stat-info">
            <h3>{productos.length}</h3>
            <p>Productos</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👤</div>
          <div className="stat-info">
            <h3>{baristas.length}</h3>
            <p>Baristas</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: bajoStock.length ? 'rgba(192,57,43,0.15)' : 'var(--primary-dim)' }}>
            ⚠️
          </div>
          <div className="stat-info">
            <h3 style={{ color: bajoStock.length ? 'var(--danger)' : 'var(--success)' }}>
              {bajoStock.length}
            </h3>
            <p>Stock bajo</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="preview-card">
          <div className="preview-card-header">
            <h3>📦 Últimos insumos</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Stock</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {insumos.slice(0, 5).map(i => (
                <tr key={i.id}>
                  <td>{i.nombre_insumo}</td>
                  <td>{i.stock_actual}</td>
                  <td>
                    <span className={`badge ${i.stock_actual < 10 ? 'badge-warn' : 'badge-ok'}`}>
                      {i.stock_actual < 10 ? 'Reponer' : 'OK'}
                    </span>
                  </td>
                </tr>
              ))}
              {insumos.length === 0 && (
                <tr><td colSpan={3} style={{ color: 'var(--text-muted)', padding: '20px', textAlign: 'center' }}>Sin datos</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="preview-card">
          <div className="preview-card-header">
            <h3>☕ Últimos productos</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Plato</th>
                <th>Categoría</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {productos.slice(0, 5).map(p => (
                <tr key={p.id}>
                  <td>{p.nombre_plato}</td>
                  <td><span className="badge badge-cat">{p.categoria}</span></td>
                  <td style={{ color: 'var(--primary)', fontWeight: 600 }}>
                    ${Number(p.precio).toFixed(2)}
                  </td>
                </tr>
              ))}
              {productos.length === 0 && (
                <tr><td colSpan={3} style={{ color: 'var(--text-muted)', padding: '20px', textAlign: 'center' }}>Sin datos</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="preview-card" style={{ gridColumn: '1 / -1' }}>
          <div className="preview-card-header">
            <h3>👤 Baristas activos</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Especialidad</th>
                <th>Turno</th>
              </tr>
            </thead>
            <tbody>
              {baristas.map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 600 }}>{b.nombre} {b.apellido}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{b.especialidad}</td>
                  <td><span className="badge badge-turno">{b.turno}</span></td>
                </tr>
              ))}
              {baristas.length === 0 && (
                <tr><td colSpan={3} style={{ color: 'var(--text-muted)', padding: '20px', textAlign: 'center' }}>Sin datos</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
