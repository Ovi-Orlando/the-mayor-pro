import { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard'

export default function Home(){
  const [items,setItems] = useState([])
  const [selected,setSelected] = useState(null)
  const [bannerIndex,setBannerIndex] = useState(0)
  const [categories,setCategories] = useState(['Todos'])
  const [activeCat,setActiveCat] = useState('Todos')
  const GIST_RAW = import.meta.env.VITE_GIST_RAW || ''

  useEffect(()=>{
    if(!GIST_RAW) return setItems([])
    fetch(GIST_RAW).then(r=>r.json()).then(d=>{ setItems(d||[]); const cats = new Set((d||[]).map(i=>i.genero||'Sin categoría')); setCategories(['Todos',...Array.from(cats)]) }).catch(e=>console.error(e))
  },[GIST_RAW])

  useEffect(()=>{
    if(items.length===0) return
    const t = setInterval(()=> setBannerIndex(i=> (i+1)%items.length),5000)
    return ()=> clearInterval(t)
  },[items])

  const banner = items[bannerIndex] || null
  const filtered = items.filter(i=> activeCat==='Todos' ? true : (i.genero===activeCat))

  return (
    <main style={{minHeight:'100vh',background:'#000',color:'#fff'}}>
      {banner && <div className='banner'><img src={(banner.imagen||'').trim()} alt={banner.titulo} /></div>}

      <div style={{maxWidth:1200,margin:'0 auto',padding:20}}>
        <h2 style={{marginTop:12}}>Categorías</h2>
        <div style={{display:'flex',gap:8,overflow:'auto',paddingBottom:8,marginBottom:12}}>
          {categories.map(cat=> (
            <div key={cat} onClick={()=>setActiveCat(cat)} style={{padding:'6px 10px',borderRadius:999,background: cat===activeCat ? '#e50914' : '#111',cursor:'pointer'}}>{cat}</div>
          ))}
        </div>

        <h2 style={{marginTop:6}}>Catálogo</h2>
        <div className='grid'>
          {filtered.map(it=> <MovieCard key={it.id} item={it} onClick={setSelected} />)}
        </div>
      </div>

      {selected && (
        <div className='modal-bg' onClick={()=>setSelected(null)}>
          <div className='modal' onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <h3 style={{margin:0}}>{selected.titulo}</h3>
                <small style={{color:'#9ca3af'}}>{selected.genero} • {selected.anio}</small>
              </div>
              <button style={{background:'#e50914',border:'none',color:'#fff',padding:'8px 12px',borderRadius:8}} onClick={()=>setSelected(null)}>Cerrar</button>
            </div>
            <div style={{marginTop:12,aspectRatio:'16/9'}}>
              <video controls autoPlay className="video">
                <source src={(selected.video||selected.vídeo||'').trim()} type='video/mp4' />
                Tu navegador no soporta reproducción de video.
              </video>
            </div>
            <p style={{color:'#d1d5db',marginTop:12}}>{selected.descripcion}</p>
          </div>
        </div>
      )}
    </main>
  )
}
