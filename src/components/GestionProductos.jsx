import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useProductos } from '../context/ProductosContext';

const GestionProductos = () => {
  const navigate = useNavigate();
  const { productos, loading, error, cargarProductos, eliminarProducto } = useProductos();
  const [eliminando, setEliminando] = useState(null);

  const handleEliminar = async (id, titulo) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${titulo}"?`)) {
      return;
    }
    
    setEliminando(id);
    const resultado = await eliminarProducto(id);
    
    if (resultado.success) {
      toast.success('Producto eliminado exitosamente');
    } else {
      toast.error('Error al eliminar: ' + resultado.mensaje);
    }
    setEliminando(null);
  };

  const handleResetearProductos = () => {
    if (!window.confirm('¿Estás seguro de resetear todos los productos a los originales de la API? Esto eliminará todos los cambios locales.')) {
      return;
    }
    localStorage.removeItem('productos');
    cargarProductos();
    toast.success('Productos reseteados exitosamente');
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', width: 36, height: 36, border: '4px solid #ddd', borderTop: '4px solid #333', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <div style={{ marginTop: 8 }}>Cargando productos...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'crimson' }}>
        <div>Error: {error}</div>
        <button onClick={cargarProductos} style={{ marginTop: 12 }}>Reintentar</button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '30px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '2px solid #0066cc'
      }}>
        <h3 style={{ margin: 0 }}>Gestión de Productos</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => navigate('/agregar-producto')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            + Agregar Producto
          </button>
          <button
            onClick={handleResetearProductos}
            style={{
              padding: '8px 16px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Resetear Productos
          </button>
        </div>
      </div>

      <div style={{
        backgroundColor: '#f9f9f9',
        padding: '15px',
        borderRadius: '8px',
        border: '1px solid #ddd',
        marginBottom: '15px'
      }}>
        <strong>Total de productos:</strong> {productos.length}
      </div>

      {productos.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
          No hay productos disponibles
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gap: '15px',
          maxHeight: '500px',
          overflowY: 'auto',
          padding: '10px'
        }}>
          {productos.map(p => (
            <div 
              key={p.id} 
              style={{ 
                display: 'flex',
                gap: '15px',
                padding: '15px',
                backgroundColor: '#fff',
                border: '1px solid #ddd',
                borderRadius: '8px',
                alignItems: 'center'
              }}
            >
              <img
                src={p.image}
                alt={p.title}
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/80x80?text=No+img'; }}
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  objectFit: 'contain',
                  borderRadius: '6px',
                  border: '1px solid #eee'
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{p.title}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  Precio: <strong>${Number(p.price).toFixed(2)}</strong>
                </div>
                <div style={{ fontSize: '12px', color: '#999' }}>
                  ID: {p.id} | Categoría: {p.category}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                <button
                  onClick={() => navigate(`/producto/${p.id}`)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#17a2b8',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Ver Detalle
                </button>
                <button
                  onClick={() => navigate(`/editar-producto/${p.id}`)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#ffc107',
                    color: '#333',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap'
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleEliminar(p.id, p.title)}
                  disabled={eliminando === p.id}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: eliminando === p.id ? '#ccc' : '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: eliminando === p.id ? 'not-allowed' : 'pointer',
                    fontSize: '13px',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {eliminando === p.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ 
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#e7f3ff',
        borderRadius: '6px',
        border: '1px solid #b3d9ff',
        fontSize: '13px'
      }}>
        <strong>Información:</strong>
        <ul style={{ marginTop: '10px', paddingLeft: '20px', marginBottom: 0 }}>
          <li>Los productos se almacenan en localStorage para persistir los cambios</li>
          <li>Puedes agregar, editar y eliminar productos</li>
          <li>Usa "Resetear Productos" para volver a cargar los productos originales de la API</li>
        </ul>
      </div>
    </div>
  );
};

export default GestionProductos;
