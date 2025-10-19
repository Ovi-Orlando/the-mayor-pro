import { useEffect, useState } from "react";

export default function Home() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);
  const GIST_RAW = import.meta.env.VITE_GIST_RAW || "";

  useEffect(() => {
    if (!GIST_RAW) return;
    fetch(GIST_RAW)
      .then(r => r.json())
      .then(d => setItems(d || []))
      .catch(e => console.error("Error fetch catalog:", e));
  }, [GIST_RAW]);

  return (
    <main style={{background:"#000",minHeight:"100vh",color:"#fff",paddingTop:80}}>
      <div style={{maxWidth:1200,margin:"0 auto",padding:"24px"}}>
        <h1 style={{textAlign:"left",marginBottom:18}}>🎬 Recomendado</h1>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:16}}>
          {items.map(it => (
            <div key={it.id} style={{cursor:"pointer"}} onClick={() => setSelected(it)}>
              <div style={{borderRadius:10,overflow:"hidden",boxShadow:"0 6px 18px rgba(0,0,0,.6)"}}>
                <img src={(it.imagen||"").trim()} alt={it.titulo} style={{width:"100%",height:270,objectFit:"cover",display:"block"}}/>
              </div>
              <div style={{marginTop:8}}>
                <strong style={{display:"block"}}>{it.titulo}</strong>
                <small style={{color:"#9ca3af"}}>{it.genero} • {it.anio}</small>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.86)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:90}}>
          <div style={{width:"90%",maxWidth:1100,background:"#0b0b0b",borderRadius:12,overflow:"hidden"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:12}}>
              <div>
                <h2 style={{margin:0}}>{selected.titulo}</h2>
                <div style={{color:"#9ca3af",fontSize:13}}>{selected.genero} • {selected.anio}</div>
              </div>
              <button onClick={()=>setSelected(null)} style={{background:"#e50914",border:"none",color:"#fff",padding:"8px 12px",borderRadius:8}}>Cerrar</button>
            </div>

            <div style={{aspectRatio:"16/9",background:"#000"}}>
              <video controls autoPlay style={{width:"100%",height:"100%",display:"block"}} >
                <source src={(selected.video||"").trim()} type="video/mp4" />
                Tu navegador no soporta reproducción de video.
              </video>
            </div>

            <div style={{padding:16,color:"#d1d5db"}}>{selected.descripcion}</div>
          </div>
        </div>
      )}
    </main>
  );
}
