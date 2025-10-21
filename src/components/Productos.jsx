import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Productos = ({ onAgregar }) => {
const [productos, setProductos] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [cantidades, setCantidades] = useState({});

const fetchProductos = async () => {
    setLoading(true);
    setError(null);
    try {
    const res = await fetch('https://fakestoreapi.com/products');
    if (!res.ok) throw new Error(`Respuesta no válida (${res.status})`);
    const data = await res.json();
    setProductos(data);
    } catch (e) {
    setError(e.message || 'Error al cargar productos');
    } finally {
    setLoading(false);
    }
};

useEffect(() => {
    fetchProductos();
}, []);

const handleCantidadChange = (id, value) => {
    const num = Math.max(1, parseInt(value || '1', 10) || 1);
    setCantidades(prev => ({ ...prev, [id]: num }));
};

const handleAgregar = (producto) => {
    const qty = cantidades[producto.id] || 1;
    if (typeof onAgregar === 'function') onAgregar({ ...producto, cantidad: qty });
};

if (loading) {
    return (
    <div style={{ padding: 16, textAlign: 'center' }}>
        <div style={{ display: 'inline-block', width: 36, height: 36, border: '4px solid #ddd', borderTop: '4px solid #333', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <div style={{ marginTop: 8 }}>Cargando productos...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
    );
}

if (error) {
    return (
    <div style={{ padding: 16, textAlign: 'center', color: 'crimson' }}>
        <div>Error al cargar productos: {error}</div>
        <button onClick={fetchProductos} style={{ marginTop: 12 }}>Reintentar</button>
    </div>
    );
}

if (!productos.length) {
    return (
    <div style={{ padding: 16, textAlign: 'center' }}>
        No hay productos disponibles.
    </div>
    );
}

return (
    <div style={{ marginTop: 12 }}>
    <h2>Productos</h2>
    <ul style={{ listStyle: 'none', padding: 0 }}>
        {productos.map(p => (
        <li key={p.id} style={{ marginBottom: 12, borderBottom: '1px solid #eee', paddingBottom: 8, textAlign: 'left' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <img
                src={p.image}
                alt={p.title}
                loading="lazy"
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/120x120?text=No+img'; }}
                style={{ width: 120, height: 120, objectFit: 'contain', borderRadius: 6, background: '#fff' }}
            />
            <div style={{ flex: 1 }}>
                <Link to={`/producto/${p.id}`} style={{ textDecoration: 'none', color: '#333' }}>
                <strong>{p.title}</strong>
                </Link>
                <div>Precio: ${Number(p.price).toFixed(2)}</div>
                <div style={{ marginTop: 6 }}>
                <input
                    type="number"
                    min="1"
                    value={cantidades[p.id] || 1}
                    onChange={(e) => handleCantidadChange(p.id, e.target.value)}
                    style={{ width: 60, marginRight: 8 }}
                />
                <button onClick={() => handleAgregar(p)}>Agregar</button>
                </div>
            </div>
            </div>
        </li>
        ))}
    </ul>
    </div>
);
};

export default Productos;