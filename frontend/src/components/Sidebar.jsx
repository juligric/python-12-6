const NAV = [
  { id: 'dashboard', label: 'Dashboard',  icon: '▦' },
  { id: 'insumos',   label: 'Insumos',    icon: '📦' },
  { id: 'productos', label: 'Productos',  icon: '☕' },
  { id: 'baristas',  label: 'Baristas',   icon: '👤' },
]

const sidebarStyle = {
  position: 'fixed',
  top: 0, left: 0, bottom: 0,
  width: 'var(--sidebar-width)',
  background: 'var(--bg-sidebar)',
  borderRight: '1px solid var(--border)',
  display: 'flex',
  flexDirection: 'column',
  zIndex: 10,
}

const logoStyle = {
  padding: '24px 20px 20px',
  borderBottom: '1px solid var(--border)',
}

const logoTitleStyle = {
  fontSize: '1.1rem',
  fontWeight: 800,
  color: 'var(--primary)',
  letterSpacing: '-0.02em',
  lineHeight: 1.2,
}

const logoSubStyle = {
  fontSize: '0.7rem',
  color: 'var(--text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  marginTop: 2,
}

const navStyle = {
  flex: 1,
  padding: '16px 12px',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
}

export default function Sidebar({ active, onNav }) {
  return (
    <nav style={sidebarStyle}>
      <div style={logoStyle}>
        <div style={logoTitleStyle}>Brew & Byte</div>
        <div style={logoSubStyle}>Manager</div>
      </div>

      <div style={navStyle}>
        {NAV.map(item => (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: active === item.id ? 'var(--primary-dim)' : 'transparent',
              color: active === item.id ? 'var(--primary)' : 'var(--text-sidebar)',
              fontWeight: active === item.id ? 700 : 400,
              fontSize: '0.9rem',
              cursor: 'pointer',
              textAlign: 'left',
              width: '100%',
              transition: 'all 0.15s',
              borderLeft: active === item.id ? '3px solid var(--primary)' : '3px solid transparent',
            }}
          >
            <span style={{ fontSize: '1rem' }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid var(--border)',
        fontSize: '0.72rem',
        color: 'var(--text-muted)',
        lineHeight: 1.6,
      }}>
        <div>FastAPI + React</div>
        <div>Bimestre 2 — 2026</div>
      </div>
    </nav>
  )
}
