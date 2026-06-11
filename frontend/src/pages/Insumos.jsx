import { useEffect, useState } from 'react'
import Modal from '../components/Modal'

const API = '/api'
const EMPTY = { nombre_insumo: '', stock_actual: '', proveedor: '' }

export default function Insumos() {
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(null)  // null | 'add' | 'edit'
  const [form,    setForm]    = useState(EMPTY)
  const [editId,  setEditId]  = useState(null)

  const load = () =>
    fetch(`${API}/insumos`)
      .then(r => r.json())
      .then(data => { setItems(data); setLoading(false) })

  useEffect(() => { load() }, [])

  const openAdd = () => {
    setForm(EMPTY)
    setEditId(null)
    setModal('add')
  }

  const openEdit = (item) => {
    setForm({ nombre_insumo: item.nombre_insumo, stock_actual: item.stock_actual, proveedor: item.proveedor })
    setEditId(item.id)
    setModal('edit')
  }

  const closeModal = () => setModal(null)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSave = async () => {
    const body = { ...form, stock_actual: Number(form.stock_actual) }
    if (modal === 'add') {
      await fetch(`${API}/insumos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    } else {
      await fetch(`${API}/insumos/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    }
    closeModal()
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este insumo?')) return
    await fetch(`${API}/insumos/${id}`, { method: 'DELETE' })
    load()
  }

  if (loading) return <div className="loading"><div className="spinner" />Cargando insumos...</div>

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📦 <span>Insumos</span></h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Agregar insumo</button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nombre</th>
                <th>Stock actual</th>
                <th>Estado</th>
                <th>Proveedor</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item.id}</td>
                  <td style={{ fontWeight: 600 }}>{item.nombre_insumo}</td>
                  <td>{item.stock_actual}</td>
                  <td>
                    <span className={`badge ${item.stock_actual < 10 ? 'badge-warn' : 'badge-ok'}`}>
                      {item.stock_actual < 10 ? '⚠ Reponer' : '✓ OK'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-muted)' }}>{item.proveedor}</td>
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
                  <td colSpan={6}>
                    <div className="empty-state">
                      <div className="icon">📦</div>
                      No hay insumos registrados. ¡Agregá el primero!
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal === 'add' ? '+ Nuevo insumo' : '✏ Editar insumo'} onClose={closeModal}>
          <div className="form-group">
            <label>Nombre del insumo</label>
            <input name="nombre_insumo" value={form.nombre_insumo} onChange={handleChange} placeholder="ej: Café molido" />
          </div>
          <div className="form-group">
            <label>Stock actual</label>
            <input name="stock_actual" type="number" min="0" value={form.stock_actual} onChange={handleChange} placeholder="ej: 50" />
          </div>
          <div className="form-group">
            <label>Proveedor</label>
            <input name="proveedor" value={form.proveedor} onChange={handleChange} placeholder="ej: CaféImport SA" />
          </div>
          <div className="modal-actions">
            <button className="btn btn-ghost" onClick={closeModal}>Cancelar</button>
            <button className="btn btn-primary" onClick={handleSave}>
              {modal === 'add' ? 'Agregar' : 'Guardar'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
