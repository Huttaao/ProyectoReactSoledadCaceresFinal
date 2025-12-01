import { Container, Nav as BootstrapNav, Navbar, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHome, FaEnvelope, FaUserCircle, FaSignInAlt, FaPlusCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { StyledNavbar } from '../styles/StyledComponents';

function Nav() {
  const { estaAutenticado, usuario } = useAuth();

  return (
    <StyledNavbar expand="lg" variant="dark">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <BootstrapNav className="me-auto">
            <BootstrapNav.Link as={Link} to="/" className="d-flex align-items-center gap-2">
              <FaHome /> Inicio
            </BootstrapNav.Link>
            <BootstrapNav.Link as={Link} to="/contacto" className="d-flex align-items-center gap-2">
              <FaEnvelope /> Contacto
            </BootstrapNav.Link>
            {estaAutenticado && usuario?.rol === 'admin' && (
              <BootstrapNav.Link as={Link} to="/agregar-producto" className="d-flex align-items-center gap-2 text-success fw-bold">
                <FaPlusCircle /> Agregar Producto
              </BootstrapNav.Link>
            )}
          </BootstrapNav>
          <BootstrapNav className="ms-auto">
            <BootstrapNav.Link as={Link} to="/admin" className="d-flex align-items-center gap-2">
              <FaUserCircle /> 
              {estaAutenticado ? (
                <>
                  Mi Perfil {usuario?.rol === 'admin' && <Badge bg="warning" text="dark">Admin</Badge>}
                </>
              ) : (
                'Perfil'
              )}
            </BootstrapNav.Link>
            {!estaAutenticado && (
              <BootstrapNav.Link as={Link} to="/login" className="d-flex align-items-center gap-2 text-success fw-bold">
                <FaSignInAlt /> Iniciar Sesión
              </BootstrapNav.Link>
            )}
          </BootstrapNav>
        </Navbar.Collapse>
      </Container>
    </StyledNavbar>
  );
}

export default Nav;