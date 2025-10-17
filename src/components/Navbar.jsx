import { Link } from 'react-router-dom'
export default function Navbar(){return (
  <header className="header">
    <div className="container" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      <div style={{fontWeight:700}}>The Mayor</div>
      <nav>
        <Link to="/" style={{color:'#fff',marginRight:12}}>Inicio</Link>
      </nav>
    </div>
  </header>
)}