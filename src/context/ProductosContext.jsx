import { createContext, useState, useContext, useEffect } from 'react';


const ProductosContext = createContext();


export const useProductos = () => {
  const context = useContext(ProductosContext);
  if (!context) {
    throw new Error('useProductos debe ser usado dentro de un ProductosProvider');
  }
  return context;
};


const MOCKAPI_URL = 'https://fakestoreapi.com/products';


export const ProductosProvider = ({ children }) => {
  const [productos, setProductos] = useState(() => {
    
    try {
      const productosGuardados = localStorage.getItem('productos');
      return productosGuardados ? JSON.parse(productosGuardados) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    if (productos.length === 0) return;
    
    const save = () => {
      try {
        localStorage.setItem('productos', JSON.stringify(productos));
      } catch (e) {
        console.error('Error guardando productos:', e);
      }
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = window.requestIdleCallback(save);
      return () => window.cancelIdleCallback && window.cancelIdleCallback(id);
    }

    const timeoutId = setTimeout(save, 200);
    return () => clearTimeout(timeoutId);
  }, [productos]);

  
  useEffect(() => {
    if (productos.length === 0) {
      cargarProductos();
    }
    
  }, []);

  
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

  
  const agregarProducto = async (nuevoProducto) => {
    try {
      
      const res = await fetch(MOCKAPI_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoProducto)
      });

      if (!res.ok) throw new Error(`Error al agregar producto (${res.status})`);
      
      const productoCreado = await res.json();
      
      
      setProductos(prev => [productoCreado, ...prev]);
      
      return { success: true, mensaje: 'Producto agregado exitosamente', producto: productoCreado };
    } catch (e) {
      console.error('Error agregando producto:', e);
      return { success: false, mensaje: e.message || 'Error al agregar producto' };
    }
  };

  
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
      
      
      setProductos(prev => 
        prev.map(p => p.id === id ? productoActualizado : p)
      );
      
      return { success: true, mensaje: 'Producto actualizado exitosamente' };
    } catch (e) {
      console.error('Error actualizando producto:', e);
      return { success: false, mensaje: e.message || 'Error al actualizar producto' };
    }
  };

  
  const eliminarProducto = async (id) => {
    try {
      const res = await fetch(`${MOCKAPI_URL}/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error(`Error al eliminar producto (${res.status})`);
      
      
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
