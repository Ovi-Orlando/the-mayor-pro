import { useEffect, useState } from 'react'

const ADMIN_KEY = 'admin_ovi'

export default function Admin(){
  const [unlocked,setUnlocked] = useState(false)
  const [pass,setPass] = useState('')
  const [items,setItems] = useState([])
  const [loading,setLoading] = useState(true)
  const [toast,setToast] = useState('')

  useEffect(()=> load(),[])

  async function load(){
    setLoading(true)
    try{
      const r = await fetch(import.meta.env.VITE_GIST_RAW || '')
      const j = await r.json()
      setItems(j || [])
    }catch(e){ console.error(e); alert('Error cargando catálogo') }
    setLoading(false)
  }

  function check(e){ e.preventDefault(); if(pass===ADMIN_KEY) setUnlocked(true); else alert('Clave incorrecta') }

  function show(msg){ setToast(msg); setTimeout(()=>setToast(''),3000) }

  async function saveAll(newItems){
    const res = await fetch('/api/gist', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ items:newItems }) })
    if(!res.ok){ show('Error al guardar'); console.error(await res.text()); return false }
    show('Guardado con éxito')
    await load()
    return true
  }

  function add(){
    const t = { id: Date.now(), titulo:'Nuevo título', genero:'Sin género', anio:new Date().getFullYear(), descripcion:'', imagen:'', video:'', tipo:'Película' }
    setItems([t,...items])
  }

  function edit(idx,field,value){
    const copy = JSON.parse(JSON.stringify(items))
    copy[idx][field]= value
    setItems(copy)
  }

  async function remove(idx){
    if(!confirm('Eliminar este elemento?')) return
    const copy = items.filter((_,i)=>i!==idx)
    await saveAll(copy)
  }

  async function saveEdits(){ await saveAll(items) }

  if(!unlocked) return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#000'}}>
      <div style={{background:'#0f1720',padding:24,borderRadius:12,width:420}}>
        <h3>Acceso Admin</h3>
        <form onSubmit={check}>
          <input className="input" value={pass} onChange={e=>setPass(e.target.value)} placeholder="Clave" />
          <div style={{display:'flex',justifyContent:'flex-end',marginTop:12}}>
            <button className="btn" type="submit">Entrar</button>
          </div>
        </form>
      </div>
    </div>
  )

  return (
    <div style={{minHeight:'100vh',background:'#000',padding:20}}>
      <div className="container">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <h2>Panel Admin</h2>
          <div>
            <button className="btn" onClick={add}>+ Agregar</button>
            <button className="btn" onClick={saveEdits} style={{marginLeft:8}}>Guardar</button>
          </div>
        </div>

        {loading? <p>Cargando...</p> : items.map((it,idx)=> (
          <div key={it.id} className="card" style={{display:'grid',gridTemplateColumns:'140px 1fr 120px',gap:12,alignItems:'center',padding:12,marginTop:12}}>
            <img src={it.imagen||'/placeholder.jpg'} style={{width:140,height:86,objectFit:'cover',borderRadius:6}} alt="" />
            <div>
              <input className="input" value={it.titulo||''} onChange={e=>edit(idx,'titulo',e.target.value)} placeholder="Título" />
              <div className="form-row" style={{marginTop:8}}>
                <input className="input small" value={it.genero||''} onChange={e=>edit(idx,'genero',e.target.value)} placeholder="Género" />
                <input className="input small" value={it.anio||''} onChange={e=>edit(idx,'anio',e.target.value)} placeholder="Año" />
              </div>
              <input className="input" style={{marginTop:8}} value={it.descripcion||''} onChange={e=>edit(idx,'descripcion',e.target.value)} placeholder="Descripción" />
              <input className="input" style={{marginTop:8}} value={it.imagen||''} onChange={e=>edit(idx,'imagen',e.target.value)} placeholder="URL póster" />
              <input className="input" style={{marginTop:8}} value={it.video||it.vídeo||''} onChange={e=>edit(idx,'video',e.target.value)} placeholder="URL video (direct mp4 preferred)" />
            </div>
            <div style={{textAlign:'right'}}>
              <button className="btn" onClick={()=>remove(idx)} style={{background:'#b91c1c'}}>Eliminar</button>
            </div>
          </div>
        ))}

        {toast && <div className="modal-bg" style={{position:'fixed',right:20,bottom:20,background:'#111',padding:12,borderRadius:8}}>{toast}</div>}
      </div>
    </div>
  )
}
