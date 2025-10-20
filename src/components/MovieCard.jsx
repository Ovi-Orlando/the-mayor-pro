export default function MovieCard({item,onClick}){
  return (
    <div className='card' onClick={()=>onClick(item)} style={{minWidth:180}}>
      <img src={(item.imagen||'').trim()} alt={item.titulo} style={{width:'100%',height:260,objectFit:'cover'}} />
      <div style={{padding:10}}>
        <strong>{item.titulo}</strong>
        <div style={{color:'#9ca3af',fontSize:13}}>{item.genero} • {item.anio}</div>
      </div>
    </div>
  )
}