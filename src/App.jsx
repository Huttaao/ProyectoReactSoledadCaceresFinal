import Header from './components/Header'
import Footer from './components/Footer'
import { Routes, Route } from 'react-router-dom'
import { Container, Button } from 'react-bootstrap';
import { FaSignOutAlt } from 'react-icons/fa';
import './App.css'
import Inicio from './components/Inicio'
import Contacto from './components/Contacto'
import Carrito from './components/Carrito'
import DetalleProducto from './components/DetalleProducto'
import RutaProtegida from './components/RutaProtegida'
import Admin from './components/Admin'
import Login from './components/Login'
import AgregarProducto from './components/AgregarProducto'
import EditarProducto from './components/EditarProducto'
import { useAuth } from './context/AuthContext'
import { Spinner } from './styles/StyledComponents'


function AppContent() {
  const { estaAutenticado, usuario, cerrarSesion, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="text-center">
          <Spinner center size="60px" />
          <p className="mt-3">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      
      {estaAutenticado && (
        <div style={{ 
          backgroundColor: '#f8f9fa', 
          borderBottom: '1px solid #dee2e6',
          padding: '0.5rem 0'
        }}>
          <Container>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center gap-2">
                <span className="fw-bold">
                  {usuario?.nombre || usuario?.username}
                </span>
                <span className="badge bg-primary">
                  {usuario?.rol}
                </span>
              </div>
              <Button 
                variant="outline-danger" 
                size="sm"
                onClick={cerrarSesion}
              >
                <FaSignOutAlt className="me-1" />
                Cerrar Sesión
              </Button>
            </div>
          </Container>
        </div>
      )}

      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route
          path="/carrito"
          element={
            <RutaProtegida>
              <Carrito />
            </RutaProtegida>
          }
        />
        <Route
          path="/admin"
          element={
            <RutaProtegida>
              <Admin />
            </RutaProtegida>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/agregar-producto" element={<AgregarProducto />} />
        <Route path="/editar-producto/:id" element={<EditarProducto />} />
      </Routes>

      <Footer />
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;
