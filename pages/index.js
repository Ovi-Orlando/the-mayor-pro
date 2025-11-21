import { useEffect, useState } from 'react';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [sel, setSel] = useState(null);

  // admin UI
  const [showAdminButton, setShowAdminButton] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminKey, setAdminKey] = useState('');
  const [adminError, setAdminError] = useState('');

  useEffect(() => {
    fetch('/api/gist')
      .then((r) => r.json())
      .then(d => {
  // Asegura que d sea un arreglo
  if (Array.isArray(d)) setMovies(d)
  else setMovies([])
})
      .catch(() => setMovies([]));
  }, []);

  // keyboard listener: Shift + A toggles the admin button
  useEffect(() => {
    function onKey(e) {
      // Shift + A
      if (e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        setShowAdminButton((s) => !s);
      }
      // Escape closes admin modal
      if (e.key === 'Escape') {
        setShowAdminModal(false);
        setAdminError('');
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  function openAdminModal() {
    setAdminKey('');
    setAdminError('');
    setShowAdminModal(true);
  }

  function submitAdmin(e) {
    e.preventDefault();
    if (adminKey === 'admin_ovi') {
      // redirect to secured admin (same behavior as before)
      window.location.href = '/admin?key=admin_ovi';
    } else {
      setAdminError('Clave incorrecta');
    }
  }

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

        {/* admin button is hidden by default; appears after Shift+A */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {showAdminButton && (
            <button
              onClick={openAdminModal}
              title="Abrir admin"
              style={{
                background: 'rgba(255,255,255,0.06)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.06)',
                padding: '8px 12px',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              Admin
            </button>
          )}
        </div>
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
                    objectFit: 'contain', // muestra toda la imagen sin recortar
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
                <source src={(sel.video || sel.vídeo || '').trim()} type="video/mp4" />
                Tu navegador no soporta video.
              </video>
            </div>
            <p style={{ color: '#d1d5db', marginTop: 12 }}>{sel.descripcion}</p>
          </div>
        </div>
      )}

      {/* Admin password modal (opens when admin button clicked or via secret button) */}
      {showAdminModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
          }}
          onClick={() => {
            setShowAdminModal(false);
            setAdminError('');
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 360,
              padding: 20,
              borderRadius: 10,
              background: '#0b0b0b',
              color: '#fff',
              boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            }}
          >
            <h3 style={{ margin: '0 0 8px 0' }}>Acceso al administrador</h3>
            <form onSubmit={submitAdmin}>
              <input
                autoFocus
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                placeholder="Introduce la clave"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #333',
                  background: '#111',
                  color: '#fff',
                  marginBottom: 10,
                }}
              />
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdminModal(false);
                    setAdminError('');
                  }}
                  style={{
                    background: 'transparent',
                    color: '#aaa',
                    border: 0,
                    padding: '8px 10px',
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    background: '#06b6d4',
                    color: '#000',
                    border: 0,
                    padding: '8px 12px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    fontWeight: '600',
                  }}
                >
                  Entrar
                </button>
              </div>
            </form>
            {adminError && <p style={{ color: '#ff6b6b', marginTop: 10 }}>{adminError}</p>}
          </div>
        </div>
      )}

      {/* Small hint (invisible) to explain combo for you — remove if you want */}
      {/* <div style={{ position: 'fixed', bottom: 12, left: 12, color: '#444', fontSize: 12 }}>
        Presiona Shift+A para ver el botón admin.
      </div> */}
    </div>
  );
}
