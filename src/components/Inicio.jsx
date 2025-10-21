import React, { useState, useEffect } from 'react';
import Productos from './Productos';
import Carrito from './Carrito';

const Inicio = ({ estaAutenticado }) => {
const [carrito, setCarrito] = useState(() => {
    try {
    const raw = localStorage.getItem('carrito');
    return raw ? JSON.parse(raw) : [];
    } catch {
    return [];
    }
});

useEffect(() => {
    try {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    } catch (e) {
    console.error('Error guardando carrito:', e);
    }
}, [carrito]);

const agregarAlCarrito = (producto) => {
    if (!estaAutenticado) {
    alert('Debes iniciar sesión para agregar productos.');
    return;
    }

    try {
    setCarrito(prev => {
        const existe = prev.find(item => item.id === producto.id);
        if (existe) {
        return prev.map(item =>
            item.id === producto.id
            ? { ...item, cantidad: item.cantidad + Number(producto.cantidad || 1) }
            : item
        );
        }
        return [
        ...prev,
        {
            id: producto.id,
            title: producto.title,
            price: Number(producto.price) || 0,
            cantidad: Number(producto.cantidad) || 1
        }
        ];
    });
    } catch (e) {
    console.error('Error al agregar al carrito:', e);
    alert('No se pudo agregar el producto. Intenta de nuevo.');
    }
};

return (
    <div style={{ padding: 24 }}>
    <h1>🏠 Bienvenido a Nuestra Tienda</h1>
    <p>Explora nuestros productos abajo y agrégalos al carrito.</p>

    <Productos onAgregar={agregarAlCarrito} />

    <Carrito carrito={carrito} setCarrito={setCarrito} estaAutenticado={estaAutenticado} />
    </div>
);
};

export default Inicio;