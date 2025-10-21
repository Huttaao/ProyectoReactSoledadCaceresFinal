import React, { useEffect } from 'react';

//recibe array de items, tiene la funcion para actualizar el carrito y el estado de autenticacion (si es falso no deja modificar el carrito y si es true si)
const Carrito = ({ carrito, setCarrito, estaAutenticado }) => {
    //el useEffect guarda el carrito en el localStorage cada vez que cambia el carrito y maneja errores de guardado osea si hay un error al guardar en el localStorage lo muestra por consola como por ejemplo si el almacenamiento esta lleno o si el usuario tiene el modo incognito activado o si el navegador no soporta localStorage, se pone primero el useeffect para que se ejecute al montar el componente y luego cada vez que cambie el carrito asi se mantiene sincronizado con el localStorage
useEffect(() => {
    try {
    localStorage.setItem('carrito', JSON.stringify(carrito));//convierte el carrito a string y lo guarda en el localStorage con la clave 'carrito' se ve como un array de objetos en formato JSON el try sirve para intentar ejecutar el codigo y si hay un error se captura en el catch
    } catch (e) {
    console.error('Error guardando carrito:', e);//muestra el error por consola
    }
}, [carrito]);//el carrito es la dependencia del useEffect osea que se ejecuta cada vez que cambia el carrito



//funciones para aumentar, disminuir y eliminar items del carrito
const aumentar = (id) => {
    if (!estaAutenticado) return;//si no esta autenticado no hace nada
    setCarrito(prev => prev.map(item => item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item));//busca el item por id y aumenta su cantidad en 1, prev es el estado anterior del carrito funciona como un map que recorre cada item del carrito y si el id del item es igual al id pasado por parametro entonces crea un nuevo objeto con las mismas propiedades pero con la cantidad aumentada en 1, si no es igual simplemente devuelve el item sin cambios.
};

const disminuir = (id) => {//disminuye la cantidad del item en 1 pero no permite que sea menor a 1
    if (!estaAutenticado) return;
    setCarrito(prev => prev.map(item => item.id === id ? { ...item, cantidad: Math.max(1, item.cantidad - 1) } : item));//si la cantidad es menor a 1 la deja en 1 usando Math.max que hace que el valor minimo sea 1, funciona igual que aumentar pero en vez de sumar resta 1 a la cantidad.
};

const eliminar = (id) => {//elimina el item del carrito completamente
    if (!estaAutenticado) return;
    setCarrito(prev => prev.filter(item => item.id !== id));//usa filter para crear un nuevo array sin el item cuyo id es igual al id pasado por parametro, osea que elimina el item del carrito.
};

  const total = carrito.reduce((sum, item) => sum + (Number(item.price || 0) * item.cantidad), 0);//calcula el total del carrito, reduce recorre cada item del carrito y suma el precio por la cantidad de cada item, si el precio no es un numero lo convierte a 0 usando Number(item.price || 0), el valor inicial de la suma es 0.

if (!estaAutenticado) {
    return (
    <div style={{ marginTop: 24, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
        <strong>Inicia sesión para usar el carrito.</strong>
    </div>
    ); //si no esta autenticado muestra este mensaje
}

return ( 
    <div style={{ marginTop: 24, padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
    <h3>Carrito</h3>
    {carrito.length === 0 ? (
        <div>El carrito está vacío</div>
    ) : (//si el carrito tiene items los muestra en una lista
        <>
        <ul style={{ listStyle: 'none', padding: 0 }}>
            {carrito.map(item => (
            <li key={item.id} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                <div style={{ fontSize: 13, color: '#555' }}>${item.price}</div>
                </div>
                <div>
                <button onClick={() => disminuir(item.id)} style={{ marginRight: 6 }}>-</button>
                <span>{item.cantidad}</span>
                <button onClick={() => aumentar(item.id)} style={{ marginLeft: 6 }}>+</button>
                </div>
                <div style={{ width: 80, textAlign: 'right' }}>${(item.price * item.cantidad).toFixed(2)}</div>
                <div>
                <button onClick={() => eliminar(item.id)} style={{ marginLeft: 12 }}>Eliminar</button>
                </div>
            </li>
            ))}
        </ul>
        <div style={{ borderTop: '1px solid #eee', paddingTop: 8, marginTop: 8 }}>
            <strong>Total: ${total.toFixed(2)}</strong>
        </div>
        </>
    )}
    </div>
);
};

export default Carrito;