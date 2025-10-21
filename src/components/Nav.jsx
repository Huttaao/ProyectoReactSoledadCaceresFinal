
import { Link } from 'react-router-dom';

function Nav() {
return (
    <nav style={{ background: '#15183bff', padding: '8px 16px', borderBottom: '1px solid #000000ff' }}>
    <ul style={{
        listStyle: 'none',
        margin: 0,
        padding: 10,
        display: 'flex',          
        alignItems: 'center',
        width: '100%',
        boxSizing: 'border-box',
    }}>
        <li style={{ flex: 1, textAlign: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#f5ececff', padding: '6px 8px', display: 'inline-block' }}>Inicio</Link>
        </li>
        <li style={{ flex: 1, textAlign: 'center' }}>
        <Link to="/contacto" style={{ textDecoration: 'none', color: '#f5ececff', padding: '6px 8px', display: 'inline-block' }}>Contacto</Link>
        </li>
        <li style={{ flex: 1, textAlign: 'center' }}>
        <Link to="/admin" style={{ textDecoration: 'none', color: '#f5ececff', padding: '6px 8px', display: 'inline-block' }}>Perfil</Link>
        </li>
    </ul>
    </nav>
);
}

export default Nav;