import { useEffect, useState } from 'react'

const API = '/api'

export default function Estadisticas() {
  const [datos, setDatos] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/estadisticas/productos`)
      .then(r => r.json())
      .then(d => { setDatos(d); setLoading(false) })
  }, [])

  if (loading) return <div className="loading"><div className="spinner" />Calculando estadísticas...</div>

  const { cantidad, media, mediana, moda } = datos
  const modaTexto = moda.length > 1 ? moda.map(v => `$${v.toFixed(2)}`).join(', ') : `$${moda[0].toFixed(2)}`
  const diferencia = Math.abs(media - mediana)
  const sonParecidas = diferencia <= media * 0.1

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📊 <span>Estadísticas</span></h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">Σ</div>
          <div className="stat-info">
            <h3>${media.toFixed(2)}</h3>
            <p>Media</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">↔</div>
          <div className="stat-info">
            <h3>${mediana.toFixed(2)}</h3>
            <p>Mediana</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">★</div>
          <div className="stat-info">
            <h3>{modaTexto}</h3>
            <p>Moda</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '20px 24px' }}>
        <h3 style={{ marginTop: 0 }}>Interpretación</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Se calcularon estas medidas con Pandas sobre el precio de los {cantidad} productos cargados en el menú.
          La media (${media.toFixed(2)}) y la mediana (${mediana.toFixed(2)}) son {sonParecidas ? 'bastante parecidas' : 'notoriamente distintas'},
          lo que sugiere que los precios {sonParecidas ? 'están repartidos de forma bastante pareja, sin valores extremos que distorsionen el promedio' : 'tienen algunos valores atípicos (productos muy baratos o muy caros) que corren el promedio respecto del valor central'}.
          {moda.length === 1
            ? ` Además hay una moda clara en $${moda[0].toFixed(2)}, el precio que más se repite entre los productos del menú.`
            : ` Los precios tienen varias modas (${modaTexto}), lo que indica que no hay un único valor claramente más frecuente y que el menú está armado con varios "escalones" de precio.`}
        </p>
      </div>
    </div>
  )
}
