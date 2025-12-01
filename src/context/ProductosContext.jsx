import React, { createContext, useState, useContext, useEffect } from 'react';

// Crear el contexto de productos
const ProductosContext = createContext();

// Hook personalizado para usar el contexto de productos
export const useProductos = () => {
  const context = useContext(ProductosContext);
  if (!context) {
    throw new Error('useProductos debe ser usado dentro de un ProductosProvider');
  }
  return context;
};

// URL de MockAPI - Puedes crear tu propia MockAPI en https://mockapi.io/
// Por ahora usaremos la FakeStoreAPI como fallback y simularemos el POST
const MOCKAPI_URL = 'https://fakestoreapi.com/products';

// Provider del contexto de productos
export const ProductosProvider = ({ children }) => {
  const [productos, setProductos] = useState(() => {
    // Cargar productos del localStorage al iniciar
    try {
      const productosGuardados = localStorage.getItem('productos');
      return productosGuardados ? JSON.parse(productosGuardados) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Guardar productos en localStorage cada vez que cambien
  useEffect(() => {
    if (productos.length > 0) {
      try {
        localStorage.setItem('productos', JSON.stringify(productos));
      } catch (e) {
        console.error('Error guardando productos:', e);
      }
    }
  }, [productos]);

  // Cargar productos al inicio solo si no hay en localStorage
  useEffect(() => {
    if (productos.length === 0) {
      cargarProductos();
    }
  }, []);

  // Función para cargar productos desde la API
  const cargarProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(MOCKAPI_URL);
      if (!res.ok) throw new Error(`Error al cargar productos (${res.status})`);
      const data = await res.json();
      setProductos(data);
      // Guardar en localStorage
      localStorage.setItem('productos', JSON.stringify(data));
    } catch (e) {
      setError(e.message || 'Error al cargar productos');
      console.error('Error cargando productos:', e);
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar un nuevo producto
  const agregarProducto = async (nuevoProducto) => {
    try {
      // Hacer POST a la API
      const res = await fetch(MOCKAPI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoProducto)
      });

      if (!res.ok) throw new Error(`Error al agregar producto (${res.status})`);
      
      const productoCreado = await res.json();
      
      // Agregar el producto al estado local
      setProductos(prev => [productoCreado, ...prev]);
      
      return { success: true, mensaje: 'Producto agregado exitosamente', producto: productoCreado };
    } catch (e) {
      console.error('Error agregando producto:', e);
      return { success: false, mensaje: e.message || 'Error al agregar producto' };
    }
  };

  // Función para actualizar un producto
  const actualizarProducto = async (id, datosActualizados) => {
    try {
      const res = await fetch(`${MOCKAPI_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosActualizados)
      });

      if (!res.ok) throw new Error(`Error al actualizar producto (${res.status})`);
      
      const productoActualizado = await res.json();
      
      // Actualizar el producto en el estado local
      setProductos(prev => 
        prev.map(p => p.id === id ? productoActualizado : p)
      );
      
      return { success: true, mensaje: 'Producto actualizado exitosamente' };
    } catch (e) {
      console.error('Error actualizando producto:', e);
      return { success: false, mensaje: e.message || 'Error al actualizar producto' };
    }
  };

  // Función para eliminar un producto
  const eliminarProducto = async (id) => {
    try {
      const res = await fetch(`${MOCKAPI_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error(`Error al eliminar producto (${res.status})`);
      
      // Eliminar el producto del estado local
      setProductos(prev => prev.filter(p => p.id !== id));
      
      return { success: true, mensaje: 'Producto eliminado exitosamente' };
    } catch (e) {
      console.error('Error eliminando producto:', e);
      return { success: false, mensaje: e.message || 'Error al eliminar producto' };
    }
  };

  const value = {
    productos,
    loading,
    error,
    cargarProductos,
    agregarProducto,
    actualizarProducto,
    eliminarProducto
  };

  return (
    <ProductosContext.Provider value={value}>
      {children}
    </ProductosContext.Provider>
  );
};
