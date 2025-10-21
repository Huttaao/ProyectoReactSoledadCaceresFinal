

function Footer() {
const year = new Date().getFullYear();
return (
    <footer style={{
    background: '#f5f5f5',
    padding: '12px 20px',
    textAlign: 'center',
    borderTop: '1px solid #e0e0e0',
    marginTop: '24px'
    }}>
    <div style={{ color: '#333', fontSize: '14px' }}>
        © {year} Mi Aplicación React
    </div>
    <div style={{ marginTop: '6px' }}>
        <a href="/" style={{ margin: '0 8px', color: '#007bff', textDecoration: 'none' }}>Inicio</a>
        <a href="/contacto" style={{ margin: '0 8px', color: '#007bff', textDecoration: 'none' }}>Contacto</a>
    </div>
    </footer>
);
}

export default Footer;