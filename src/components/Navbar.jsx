import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header style={{background:"#050505",borderBottom:"1px solid #111",position:"sticky",top:0,zIndex:50}}>
      <div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,cursor:"pointer"}}>
          <img src="/logo.png" alt="The Mayor" style={{height:36}} />
          <div style={{fontWeight:800,fontSize:18}}>The Mayor</div>
        </div>
        <nav>
          <Link to="/" style={{color:"#fff",textDecoration:"none",opacity:0.95}}>Inicio</Link>
        </nav>
      </div>
    </header>
  );
}
