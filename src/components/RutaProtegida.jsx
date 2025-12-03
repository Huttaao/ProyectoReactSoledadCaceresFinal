import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RutaProtegida = ({ children, rolesPermitidos = [] }) => {
  const { estaAutenticado, usuario, cargando } = useAuth();
  const location = useLocation();


  if (cargando) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div>Verificando acceso...</div>
      </div>
    );
  }


  if (!estaAutenticado) {

    return <Navigate to="/login" state={{ from: location }} replace />;
  }


  if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(usuario?.rol)) {
    return (
      <div style={{ 
        maxWidth: '500px', 
        margin: '40px auto', 
        padding: '30px', 
        border: '1px solid #ffcccc',
        borderRadius: '8px',
        backgroundColor: '#ffe6e6',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#cc0000' }}>Acceso Denegado</h2>
        <p>No tienes permisos para acceder a esta sección.</p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Tu rol: <strong>{usuario?.rol}</strong>
        </p>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Roles permitidos: <strong>{rolesPermitidos.join(', ')}</strong>
        </p>
      </div>
    );
  }
  

  return children;
};

export default RutaProtegida;