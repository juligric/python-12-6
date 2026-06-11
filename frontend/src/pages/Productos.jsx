import { useEffect, useState } from 'react'
import Modal from '../components/Modal'

const API = '/api'
const EMPTY = { nombre_plato: '', categoria: '', precio: '', id_insumo_principal: '' }
const CATEGORIAS = ['Bebida caliente', 'Bebida fría', 'Comida', 'Postre', 'Snack']

export default function Productos() {
  const [items,   setItems]   = useState([])
  const [insumos, setInsumos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(null)
  const [form,    setForm]    = useState(EMPTY)
  const [editId,  setEditId]  = useState(null)

  const load = () =>
    Promise.all([
      fetch(`${API}/productos`).then(r => r.json()),
      fetch(`${API}/insumos`).then(r => r.json()),
    ]).then(([p, i]) => { setItems(p); setInsumos(i); setLoading(false) })

  useEffect(() => { load() }, [])

  const openAdd = () => { setForm(EMPTY); setEditId(null); setModal('add') }

  const openEdit = (item) => {
    setForm({
      nombre_plato: item.nombre_plato,
      categoria: item.categoria,
      precio: item.precio,
      id_insumo_principal: item.id_insumo_pricipal ?? item.id_insumo_principal ?? '',
    })
    setEditId(item.id)
    setModal('edit')
  }

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSave = async () => {
    const body = { ...form, precio: Number(form.precio), id_insumo_principal: Number(form.id_insumo_principal) }
    if (modal === 'add') {
      await fetch(`${API}/productos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    } else {
      await fetch(`${API}/productos/${editId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    }
    setModal(null)
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return
    await fetch(`${API}/productos/${id}`, { method: 'DELETE' })
    load()
  }

  const insumoNombre = (id) => insumos.find(i => i.id === id)?.nombre_insumo ?? '—'

  if (loading) return <div className="loading"><div className="spinner" />Cargando productos...</div>

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">☕ <span>Productos</span></h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Agregar producto</button>
      </div>

      <div className="card">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Plato / Bebida</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Precio c/ IVA</th>
                <th>Insumo principal</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item.id}</td>
                  <td style={{ fontWeight: 600 }}>{item.nombre_plato}</td>
                  <td><span className="badge badge-cat">{item.categoria}</span></td>
                  <td style={{ color: 'var(--primary)', fontWeight: 600 }}>${Number(item.precio).toFixed(2)}</td>
                  <td style={{ color: 'var(--text-muted)' }}>${(Number(item.precio) * 1.21).toFixed(2)}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    {insumoNombre(item.id_insumo_pricipal ?? item.id_insumo_principal)}
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
                  <td colSpan={7}>
                    <div className="empty-state">
                      <div className="icon">☕</div>
                      No hay productos en el menú. ¡Agregá el primero!
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal === 'add' ? '+ Nuevo producto' : '✏ Editar producto'} onClose={() => setModal(null)}>
          <div className="form-group">
            <label>Nombre del plato / bebida</label>
            <input name="nombre_plato" value={form.nombre_plato} onChange={handleChange} placeholder="ej: Cappuccino" />
          </div>
          <div className="form-group">
            <label>Categoría</label>
            <select name="categoria" value={form.categoria} onChange={handleChange}>
              <option value="">Seleccioná una categoría</option>
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Precio (sin IVA)</label>
            <input name="precio" type="number" step="0.01" min="0" value={form.precio} onChange={handleChange} placeholder="ej: 850.00" />
          </div>
          <div className="form-group">
            <label>Insumo principal</label>
            <select name="id_insumo_principal" value={form.id_insumo_principal} onChange={handleChange}>
              <option value="">Seleccioná un insumo</option>
              {insumos.map(i => <option key={i.id} value={i.id}>{i.nombre_insumo}</option>)}
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
