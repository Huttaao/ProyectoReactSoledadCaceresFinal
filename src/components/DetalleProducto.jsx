import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const DetalleProducto = () => {//componente para mostrar el detalle de un producto
const { id } = useParams();//obtiene el id del producto de la url, funciona haciendo uso del hook useParams de react-router-dom que hace que podamos acceder a los parametros de la url definidos en las rutas.
const [producto, setProducto] = useState(null);//estado para almacenar el detalle del producto
const [loading, setLoading] = useState(true);//estado para manejar la carga del producto
const [error, setError] = useState(null);//estado para manejar errores

useEffect(() => {
    if (!id) {
    setError('ID de producto inválido');
    setLoading(false);
    return;//si no hay id muestra error y termina la ejecucion del useEffect
    }

    const controller = new AbortController();//para cancelar la peticion fetch si el componente se desmonta, osea si el usuario navega a otra pagina antes de que la peticion termine.

    const cargar = async () => { //funcion asincrona para cargar el detalle del producto
    setLoading(true);//indica que se esta cargando
    setError(null);//resetea el error
    try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`, { signal: controller.signal });
        if (!res.ok) throw new Error(`Error en la respuesta (${res.status})`);//si la respuesta no es ok lanza un error
        const data = await res.json();
        setProducto(data);//almacena el detalle del producto en el estado
    } catch (err) {
        if (err.name === 'AbortError') return; // petición cancelada
        setError(err.message || 'Error al cargar el producto');//almacena el mensaje de error en el estado
    } finally {
        setLoading(false);//indica que ya no se esta cargando
    }
    };

    cargar();//llama a la funcion para cargar el detalle del producto

    return () => controller.abort();
}, [id]);

if (loading) return <div>Cargando detalle del producto...</div>;
if (error) return <div style={{ color: 'crimson' }}>Error: {error}</div>;
if (!producto) return <div>Producto no encontrado</div>;

return (
    <>
    <h2>{producto.title}</h2>
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <img
        src={producto.image}
        alt={producto.title}
        loading="lazy"
        onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/150?text=No+img'; }}
        style={{ width: 180, height: 180, objectFit: 'contain', borderRadius: 6, background: '#fff' }}
        />
        <div style={{ maxWidth: 600, textAlign: 'left' }}>
        <p style={{ marginTop: 0 }}>{producto.description}</p>
        <p><strong>Precio:</strong> ${Number(producto.price).toFixed(2)}</p>
        {producto.category && <p><em>Categoría:</em> {producto.category}</p>}
        </div>
    </div>
    </>
);
};

export default DetalleProducto;