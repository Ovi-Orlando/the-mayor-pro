import { useEffect, useState } from 'react'

export default function Home(){
  const [items,setItems] = useState([])
  const [selected,setSelected] = useState(null)
  const [bannerIndex,setBannerIndex] = useState(0)
  const GIST_RAW = import.meta.env.VITE_GIST_RAW || ''

  useEffect(()=>{
    if(!GIST_RAW) return setItems([])
    fetch(GIST_RAW).then(r=>r.json()).then(d=>setItems(d||[])).catch(e=>console.error(e))
  },[GIST_RAW])

  useEffect(()=>{
    if(items.length===0) return
    const t = setInterval(()=> setBannerIndex(i=> (i+1)%items.length),5000)
    return ()=> clearInterval(t)
  },[items])

  const banner = items[bannerIndex]

  return (
    <main style={{minHeight:'100vh',background:'#000',color:'#fff'}}>
      {banner && <div className="banner"><img src={(banner.imagen||'').trim()} alt={banner.titulo} /></div>}

      <div style={{maxWidth:1200,margin:'0 auto',padding:20}}>
        <h2 style={{marginTop:12}}>Catálogo</h2>
        <div className="grid">
          {items.map(it=> (
            <div key={it.id} className="card" onClick={()=>setSelected(it)}>
              <img src={(it.imagen||'').trim()} alt={it.titulo} style={{width:'100%',height:260,objectFit:'cover'}}/>
              <div style={{padding:12}}>
                <strong>{it.titulo}</strong>
                <div style={{color:'#9ca3af',fontSize:13}}>{it.genero} • {it.anio}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="modal-bg" onClick={()=>setSelected(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <h3 style={{margin:0}}>{selected.titulo}</h3>
                <small style={{color:'#9ca3af'}}>{selected.genero} • {selected.anio}</small>
              </div>
              <button className="btn" onClick={()=>setSelected(null)}>Cerrar</button>
            </div>
            <div style={{marginTop:12,aspectRatio:'16/9'}}>
              <video controls autoPlay>
                <source src={(selected.video||selected.vídeo||'').trim()} type="video/mp4" />
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
