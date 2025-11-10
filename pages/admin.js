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
                objectFit: 'contain', // <-- cambio clave
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
                style={{ background: '#b91c1c', color: '#fff', border: 0, padding: 8 }}
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
