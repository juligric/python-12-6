import { useEffect, useState } from 'react'
import Modal from '../components/Modal'

const API = '/api'
const EMPTY = { nombre: '', apellido: '', especialidad: '', turno: '' }
const TURNOS = ['Mañana', 'Tarde', 'Noche']
const ESPECIALIDADES = ['Espresso', 'Latte art', 'Cold brew', 'Té y infusiones', 'Barismo general']

export default function Baristas() {
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(null)
  const [form,    setForm]    = useState(EMPTY)
  const [editId,  setEditId]  = useState(null)

  const load = () =>
    fetch(`${API}/baristas`)
      .then(r => r.json())
      .then(data => { setItems(data); setLoading(false) })

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(EMPTY); setEditId(null); setModal('add') }

  const openEdit = (item) => {
    setForm({ nombre: item.nombre, apellido: item.apellido, especialidad: item.especialidad, turno: item.turno })
    setEditId(item.id)
    setModal('edit')
  }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSave = async () => {
    if (modal === 'add') {
      await fetch(`${API}/baristas`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    } else {
      await fetch(`${API}/baristas/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    }
    setModal(null)
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este barista?')) return
    await fetch(`${API}/baristas/${id}`, { method: 'DELETE' })
    load()
  }

  const turnoColor = (t) => {
    if (!t) return 'badge-turno'
    const lower = t.toLowerCase()
    if (lower.includes('mañana')) return 'badge-ok'
    if (lower.includes('tarde'))  return 'badge-cat'
    if (lower.includes('noche'))  return 'badge-turno'
    return 'badge-turno'
  }

  if (loading) return <div className="loading"><div className="spinner" />Cargando baristas...</div>

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">👤 <span>Baristas</span></h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Agregar barista</button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre completo</th>
                <th>Especialidad</th>
                <th>Turno</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{item.nombre} {item.apellido}</div>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{item.especialidad}</td>
                  <td>
                    <span className={`badge ${turnoColor(item.turno)}`}>
                      {item.turno}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn btn-edit" onClick={() => openEdit(item)}>Editar</button>
                      <button className="btn btn-del"  onClick={() => handleDelete(item.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={5}>
                    <div className="empty-state">
                      <div className="icon">👤</div>
                      No hay baristas registrados. ¡Agregá el primero!
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal === 'add' ? '+ Nuevo barista' : '✏ Editar barista'} onClose={() => setModal(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 14px' }}>
            <div className="form-group">
              <label>Nombre</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="ej: Ana" />
            </div>
            <div className="form-group">
              <label>Apellido</label>
              <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="ej: García" />
            </div>
          </div>
          <div className="form-group">
            <label>Especialidad</label>
            <select name="especialidad" value={form.especialidad} onChange={handleChange}>
              <option value="">Seleccioná una especialidad</option>
              {ESPECIALIDADES.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Turno</label>
            <select name="turno" value={form.turno} onChange={handleChange}>
              <option value="">Seleccioná un turno</option>
              {TURNOS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave}>
              {modal === 'add' ? 'Agregar' : 'Guardar'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
