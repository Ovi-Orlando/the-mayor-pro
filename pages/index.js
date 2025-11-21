import { useEffect, useState } from 'react';

export default function Home() { 
  const [movies, setMovies] = useState([]);
  const [sel, setSel] = useState(null);

  useEffect(() => {
    fetch('/api/gist')
      .then(r => r.json())
      .then(d => {
        if (Array.isArray(d)) setMovies(d);
        else setMovies([]);
      })
      .catch(() => setMovies([]));
  }, []);

  return (
    <div style={{background:'#000',color:'#fff',minHeight:'100vh'}}>
      <header style={{padding:16,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <img src='/logo.png' style={{height:48}} alt='logo'/>
          <h1 style={{margin:0}}>The Mayor</h1>
        </div>

        {/* OCULTAR EN PRODUCCIÓN, BORRAR DESPUÉS DE TERMINAR */}
        <a href='/admin?key=admin_ovi' style={{color:'#fff'}}>Admin</a>
      </header>

      <main style={{maxWidth:1100,margin:'24px auto',padding:'0 16px'}}>
        <h2>Catálogo</h2>

        {movies.length === 0 ? (
          <p>No hay películas.</p>
        ) : (
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',
            gap:16
          }}>
            {movies.map(m => (
              <div key={m.id} style={{ background:'#0b1220', borderRadius:8 }}>
                <img 
                  src={(m.imagen || '/logo.png').trim()} 
                  style={{width:'100%', height:260, objectFit:'contain', background:'#000'}}
                  alt=''
                />
                <div style={{padding:10}}>
                  <strong>{m.titulo}</strong>
                  <div style={{color:'#9ca3af'}}>{m.genero} • {m.anio}</div>
                  <p>{m.descripcion}</p>

                  <button 
                    onClick={() => setSel(m)} 
                    style={{background:'#e50914',color:'#fff',border:0,padding:8,borderRadius:8}}
                  >
                    Ver
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {sel && (
        <div 
          style={{
            position:'fixed',
            inset:0,
            background:'rgba(0,0,0,0.85)',
            display:'flex',
            alignItems:'center',
            justifyContent:'center'
          }}
          onClick={() => setSel(null)}
        >
          <div style={{width:'90%',maxWidth:1000}} onClick={e => e.stopPropagation()}>
            <h3 style={{margin:0}}>{sel.titulo}</h3>

            <div style={{aspectRatio:'16/9'}}>
              <video controls autoPlay style={{width:'100%',height:'100%'}}>
                <source 
                  src={(sel.video || sel.vídeo || '').trim()} 
                  type='video/mp4'
                />
                Tu navegador no soporta video.
              </video>
            </div>

            <p style={{color:'#d1d5db'}}>{sel.descripcion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
