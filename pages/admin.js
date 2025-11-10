import { useEffect, useState } from 'react';

export default function AdminPage() {
  const [ok, setOk] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Verifica la clave del administrador
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get('key') === 'admin_ovi') setOk(true);
  }, []);

  // Carga las películas desde el API
  useEffect(() => {
    fetch('/api/gist')
      .then((r) => r.json())
      .then((d) => {
        setItems(d || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Guardar cambios
  async function saveAll(newItems) {
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ movies: newItems }),
    });
    if (!res.ok) {
      alert('Error al guardar');
      return false;
    }
    alert('Guardado correctamente');
    setItems(newItems);
    return true;
  }

  // Agregar una nueva película
  function add() {
    setItems([
      {
        id: Date.now(),
        titulo: 'Nuevo',
        genero: 'Sin categoría',
        anio: new Date().getFullYear(),
        descripcion: '',
        imagen: '',
        video: '',
      },
      ...items,
    ]);
  }

  // Actualizar campo
  function update(i, f, v) {
    const c = JSON.parse(JSON.stringify(items));
    c[i][f] = v;
    setItems(c);
  }

  // Eliminar película
  async function remove(i) {
    if (!confirm('¿Eliminar este elemento?')) return;
    const c = items.filter((_, idx) => idx !== i);
    await saveAll(c);
  }

  // Vista si no tiene acceso
  if (!ok)
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000',
          color: '#fff',
          fontSize: '1.2rem',
        }}
      >
        Acceso restringido
      </div>
    );

  // Panel de administración
  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', padding: 20 }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ marginBottom: 12 }}>Panel de administración</h2>

        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button
            onClick={add}
            style={{ background: '#e50914', color: '#fff', border: 0, padding: 8 }}
          >
            + Agregar
          </button>
          <button
            onClick={() => saveAll(items)}
            style={{ background: '#06b6d4', color: '#fff', border: 0, padding: 8 }}
          >
            Guardar
          </button>
        </div>

        {loading ? (
          <p>Cargando…</p>
        ) : (
          items.map((it, idx) => (
            <div
              key={it.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '180px 1fr 120px',
                gap: 12,
                background: '#071018',
                padding: 12,
                borderRadius: 8,
                marginBottom: 12,
              }}
            >
              <img
                src={it.imagen || '/logo.png'}
                style={{
                  width: 180,
                  height: 110,
                  objectFit: 'contain', // ✅ imagen completa
                  backgroundColor: '#111',
                  borderRadius: 8,
                }}
                alt=""
              />
              <div>
                <input
                  value={it.titulo || ''}
                  onChange={(e) => update(idx, 'titulo', e.target.value)}
                  placeholder="Título"
                  style={{ width: '100%', marginBottom: 8 }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={it.genero || ''}
                    onChange={(e) => update(idx, 'genero', e.target.value)}
                    placeholder="Género"
                    style={{ width: '50%' }}
                  />
                  <input
                    value={it.anio || ''}
                    onChange={(e) => update(idx, 'anio', e.target.value)}
                    placeholder="Año"
                    style={{ width: '50%' }}
                  />
                </div>
                <input
                  value={it.descripcion || ''}
                  onChange={(e) => update(idx, 'descripcion', e.target.value)}
                  placeholder="Descripción"
                  style={{ marginTop: 8 }}
                />
                <input
                  value={it.imagen || ''}
                  onChange={(e) => update(idx, 'imagen', e.target.value)}
                  placeholder="URL imagen"
                  style={{ marginTop: 8 }}
                />
                <input
                  value={it.video || ''}
                  onChange={(e) => update(idx, 'video', e.target.value)}
                  placeholder="URL video"
                  style={{ marginTop: 8 }}
                />
              </div>
              <div style={{ textAlign: 'right' }}>
                <button
                  onClick={() => remove(idx)}
                  style={{
                    background: '#b91c1c',
                    color: '#fff',
                    border: 0,
                    padding: 8,
                    borderRadius: 4,
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
