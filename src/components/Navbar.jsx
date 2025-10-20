import { Link } from 'react-router-dom';
export default function Navbar(){return (
  <header className='header'>
    <div className='container' style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <img src='/logo.png' alt='The Mayor' className='logo-small' />
        <div style={{fontWeight:800,fontSize:18}}>The Mayor</div>
      </div>
      <nav><Link to='/' style={{color:'#fff',textDecoration:'none'}}>Inicio</Link></nav>
    </div>
  </header>
)}