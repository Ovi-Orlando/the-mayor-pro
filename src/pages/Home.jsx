import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

export default function Home(){
  const [items,setItems] = useState([])
  const [loading,setLoading] = useState(true)
  const [selected,setSelected] = useState(null)
  const [bannerIndex,setBannerIndex] = useState(0)
  const videoRef = useRef(null)

  useEffect(()=>{
    const url = import.meta.env.VITE_GIST_RAW || ''
    if(!url){ setLoading(false); return }
    fetch(url).then(r=>r.json()).then(d=>{ setItems(d || []); setLoading(false) }).catch(e=>{ console.error(e); setLoading(false) })
  },[])

  useEffect(()=>{
    if(items.length===0) return
    const t = setInterval(()=> setBannerIndex(i=> (i+1)%items.length),5000)
    return ()=> clearInterval(t)
  },[items])

  useEffect(()=>{
    if(!selected) return
    if(videoRef.current){ videoRef.current.pause(); videoRef.current.load(); videoRef.current.play().catch(()=>{}) }
  },[selected])

  if(loading) return <div className="container" style={{paddingTop:120}}>Cargando catálogo…</div>

  const banner = items[bannerIndex]

  return (
    <div>
      {banner && <motion.div key={banner.id} className="banner">
        <img src={banner.imagen} alt={banner.titulo} />
        <div style={{position:'absolute',left:24,bottom:40,maxWidth:700}}>
          <h1 style={{fontSize:32,margin:0}}>{banner.titulo}</h1>
          <p style={{maxWidth:600,opacity:0.9}}>{banner.descripcion?.slice(0,220)}...</p>
          <button className="btn" onClick={()=>setSelected(banner)} style={{marginTop:12}}>▶ Ver ahora</button>
        </div>
      </motion.div>}

      <div className="container" style={{paddingTop:24}}>
        <h2 style={{marginTop:0}}>Catálogo</h2>
        <div className="grid">
          {items.map(it=> (
            <div key={it.id} className="card" onClick={()=>setSelected(it)} style={{cursor:'pointer'}}>
              <img src={it.imagen} alt="" style={{width:'100%',height:260,objectFit:'cover'}}/>
              <div style={{padding:12}}>
                <h3 style={{margin:0}}>{it.titulo}</h3>
                <p style={{margin:'6px 0 0',color:'#9ca3af',fontSize:13}}>{it.genero} • {it.anio}</p>
                <p style={{marginTop:8,fontSize:13,color:'#d1d5db'}}>{it.descripcion?.slice(0,120)}...</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="modal-bg" onClick={()=>setSelected(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <button style={{float:'right'}} onClick={()=>setSelected(null)}>✕</button>
            <h3>{selected.titulo}</h3>
            <p style={{color:'#9ca3af'}}>{selected.descripcion}</p>
            <div style={{marginTop:12,aspectRatio:'16/9'}}>
              <video ref={videoRef} controls playsInline>
                <source src={ (selected.video||selected.vídeo||'').trim() } type="video/mp4" />
                Tu navegador no soporta reproducción de video.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
