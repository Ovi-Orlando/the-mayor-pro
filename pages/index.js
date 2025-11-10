import { useEffect, useState } from 'react';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [sel, setSel] = useState(null);

  useEffect(() => {
    fetch('/api/gist')
      .then((r) => r.json())
      .then((d) => setMovies(d || []))
      .catch(() => setMovies([]));
  }, []);

  return (
    <div style={{ background: '#000', color: '#fff', minHeight: '100vh' }}>
      {/* Encabezado sin enlace visible al admin */}
      <header
        style={{
          padding: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="/logo.png" style={{ height: 48 }} alt="logo" />
          <h1 style={{ margin: 0 }}>The Mayor</h1>
        </div>
        {/* Enlace oculto para acceder al admin manualmente */}
        <a
          href="/admin?key=admin_ovi"
          style={{
            color: '#000', // 🔒 invisible para el usuario común
            textDecoration: 'none',
            pointerEvents: 'none', // evita clics accidentales
          }}
        >
          Admin
        </a>
      </header>

      {/* Catálogo principal */}
      <main style={{ maxWidth: 1100, margin: '24px auto', padding: '0 16px' }}>
        <h2>Catálogo</h2>
        {movies.length === 0 ? (
          <p>No hay películas disponibles.</p>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
              gap: 16,
            }}
          >
            {movies.map((m) => (
              <div
                key={m.id}
                style={{
                  background: '#0b1220',
                  borderRadius: 8,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <img
                  src={(m.imagen || '/logo.png').trim()}
                  style={{
                    width: '100%',
                    height: 260,
                    objectFit: 'contain', // ✅ muestra toda la imagen
                    backgroundColor: '#111',
                  }}
                  alt={m.titulo}
                />
                <div style={{ padding: 10 }}>
                  <strong>{m.titulo}</strong>
                  <div style={{ color: '#9ca3af' }}>
                    {m.genero} • {m.anio}
                  </div>
                  <p style={{ marginTop: 8 }}>{m.descripcion}</p>
                  <button
                    onClick={() => setSel(m)}
                    style={{
                      background: '#e50914',
                      color: '#fff',
                      border: 0,
                      padding: 8,
                      borderRadius: 8,
                      width: '100%',
                    }}
                  >
                    Ver
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Reproductor modal */}
      {sel && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setSel(null)}
        >
          <div
            style={{
              width: '90%',
              maxWidth: 1000,
              background: '#000',
              padding: 16,
              borderRadius: 8,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 12px 0' }}>{sel.titulo}</h3>
            <div style={{ aspectRatio: '16/9' }}>
              <video
                controls
                autoPlay
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 8,
                  background: '#000',
                }}
              >
                <source
                  src={(sel.video || sel.vídeo || '').trim()}
                  type="video/mp4"
                />
                Tu navegador no soporta video.
              </video>
            </div>
            <p style={{ color: '#d1d5db', marginTop: 12 }}>{sel.descripcion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
