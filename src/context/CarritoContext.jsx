import React, { createContext, useState, useEffect, useContext } from 'react';

// Crear el contexto del carrito
const CarritoContext = createContext();

// Hook personalizado para usar el contexto del carrito
export const useCarrito = () => {
  const context = useContext(CarritoContext);
  if (!context) {
    throw new Error('useCarrito debe ser usado dentro de un CarritoProvider');
  }
  return context;
};

// Provider del contexto del carrito
export const CarritoProvider = ({ children }) => {
  // Estado del carrito inicializado desde localStorage
  const [carrito, setCarrito] = useState(() => {
    try {
      const raw = localStorage.getItem('carrito');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    // Escribir en localStorage puede bloquear el hilo principal si el objeto
    // es grande. Usamos requestIdleCallback cuando esté disponible o un
    // pequeño debounce con setTimeout para evitar freezes al agregar items.
    const save = () => {
      try {
        localStorage.setItem('carrito', JSON.stringify(carrito));
      } catch (e) {
        console.error('Error guardando carrito:', e);
      }
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = window.requestIdleCallback(save);
      return () => window.cancelIdleCallback && window.cancelIdleCallback(id);
    }

    const timeoutId = setTimeout(save, 120);
    return () => clearTimeout(timeoutId);
  }, [carrito]);

  // Agregar producto al carrito
  const agregarAlCarrito = (producto) => {
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
            cantidad: Number(producto.cantidad) || 1,
            image: producto.image || ''
          }
        ];
      });
    } catch (e) {
      console.error('Error al agregar al carrito:', e);
      alert('No se pudo agregar el producto. Intenta de nuevo.');
    }
  };

  // Aumentar cantidad de un producto
  const aumentarCantidad = (id) => {
    setCarrito(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, cantidad: item.cantidad + 1 } 
          : item
      )
    );
  };

  // Disminuir cantidad de un producto
  const disminuirCantidad = (id) => {
    setCarrito(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, cantidad: Math.max(1, item.cantidad - 1) } 
          : item
      )
    );
  };

  // Eliminar producto del carrito
  const eliminarDelCarrito = (id) => {
    setCarrito(prev => prev.filter(item => item.id !== id));
  };

  // Calcular total del carrito
  const calcularTotal = () => {
    return carrito.reduce((sum, item) => sum + (Number(item.price || 0) * item.cantidad), 0);
  };

  // Limpiar carrito
  const limpiarCarrito = () => {
    setCarrito([]);
  };

  const value = {
    carrito,
    agregarAlCarrito,
    aumentarCantidad,
    disminuirCantidad,
    eliminarDelCarrito,
    calcularTotal,
    limpiarCarrito
  };

  return (
    <CarritoContext.Provider value={value}>
      {children}
    </CarritoContext.Provider>
  );
};
