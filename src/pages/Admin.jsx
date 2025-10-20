import { useEffect, useState } from 'react';

const ADMIN_KEY = "admin_ovi";

export default function Admin(){
  const [allowed,setAllowed] = useState(false)
  const [items,setItems] = useState([])
  const [loading,setLoading] = useState(true)
  const GIST_RAW = import.meta.env.VITE_GIST_RAW || ''

  useEffect(()=>{
    const params = new URLSearchParams(window.location.search)
    if(params.get('key') === ADMIN_KEY) setAllowed(true)
  },[])

  useEffect(()=>{
    if(!GIST_RAW) return setLoading(false)
    fetch(GIST_RAW).then(r=>r.json()).then(d=>{ setItems(d||[]); setLoading(false)}).catch(()=>setLoading(false))
  },[GIST_RAW])

  if(!allowed) return <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#000',color:'#fff'}}>Acceso restringido</div>

  async function saveAll(newItems){
    const res = await fetch('/api/gist', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ items: newItems })})
    if(!res.ok){ alert('Error al guardar'); console.error(await res.text()); return false }
    alert('Guardado con éxito')
    setItems(newItems)
    return true
  }

  function add(){
    setItems([{ id: Date.now(), titulo:'Nuevo título', genero:'Sin categoría', anio:new Date().getFullYear(), descripcion:'', imagen:'', video:'', tipo:'Película' }, ...items])
  }

  function update(idx, field, value){
    const copy = JSON.parse(JSON.stringify(items))
    copy[idx][field] = value
    setItems(copy)
  }

  async function remove(idx){
    if(!confirm('Eliminar?')) return
    const copy = items.filter((_,i)=>i!==idx)
    await saveAll(copy)
  }

  return (
    <div style={{minHeight:'100vh',background:'#000',color:'#fff',padding:20}}>
      <div style={{maxWidth:1200,margin:'0 auto'}}>
        <h2>Admin</h2>
        <div style={{display:'flex',gap:8,marginBottom:12}}>
          <button onClick={add} className="btn">+ Agregar</button>
          <button onClick={()=>saveAll(items)} style={{background:'#06b6d4',border:'none',padding:'8px 12px',borderRadius:8}}>Guardar</button>
        </div>

        {loading? <p>Cargando…</p> : items.map((it,idx)=> (
          <div key={it.id} style={{background:'#0b0b0b',padding:12,borderRadius:8,display:'grid',gridTemplateColumns:'120px 1fr 120px',gap:12,alignItems:'center',marginBottom:12}}>
            <img src={(it.imagen||'/logo.png')} alt="" style={{width:120,height:68,objectFit:'cover',borderRadius:6}}/>
            <div>
              <input className="input" value={it.titulo||''} onChange={e=>update(idx,'titulo',e.target.value)} placeholder="Título" style={{width:'100%',marginBottom:8}}/>
              <div style={{display:'flex',gap:8}}>
                <input className="input small" value={it.genero||''} onChange={e=>update(idx,'genero',e.target.value)} placeholder="Género" />
                <input className="input small" value={it.anio||''} onChange={e=>update(idx,'anio',e.target.value)} placeholder="Año" />
              </div>
              <input className="input" style={{marginTop:8}} value={it.descripcion||''} onChange={e=>update(idx,'descripcion',e.target.value)} placeholder="Descripción" />
              <input className="input" style={{marginTop:8}} value={it.imagen||''} onChange={e=>update(idx,'imagen',e.target.value)} placeholder="URL imagen" />
              <input className="input" style={{marginTop:8}} value={it.video||''} onChange={e=>update(idx,'video',e.target.value)} placeholder="URL video (mp4)" />
            </div>
            <div style={{textAlign:'right'}}>
              <button onClick={()=>remove(idx)} style={{background:'#b91c1c',border:'none',padding:'8px 10px',borderRadius:6}}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
