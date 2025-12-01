import { Container, Navbar, Nav as BootstrapNav, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaStore, FaHome, FaEnvelope, FaUserCircle, FaSignInAlt, FaPlusCircle, FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';
import styled from 'styled-components';

const StyledHeader = styled(Navbar)`
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 0.75rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const BrandTitle = styled(Navbar.Brand)`
  color: white !important;
  /* Mobile first: tamaño más pequeño */
  font-size: 1.25rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 1rem;
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
    margin-right: 2rem;
  }
  
  &:hover {
    color: #e3f2fd !important;
  }
`;

const StyledNavLink = styled(BootstrapNav.Link)`
  color: white !important;
  padding: 0.5rem 1rem !important;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  /* Mejor área táctil en móvil */
  min-height: 44px;
  display: flex !important;
  align-items: center;
  
  @media (hover: hover) {
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
  }
  
  /* Feedback táctil en móvil */
  &:active {
    background: rgba(255, 255, 255, 0.3);
  }
  
  &.active {
    background: rgba(255, 255, 255, 0.3);
  }
`;

function Header() {
  const { estaAutenticado, usuario } = useAuth();
  const { carrito } = useCarrito();

  const totalProductos = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <StyledHeader expand="lg" variant="dark">
      <Container>
        <BrandTitle as={Link} to="/">
          <FaStore />
          Mi Tienda Online
        </BrandTitle>
        
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        
        <Navbar.Collapse id="main-navbar-nav">
          <BootstrapNav className="me-auto">
            <StyledNavLink as={Link} to="/" className="d-flex align-items-center gap-2">
              <FaHome /> Inicio
            </StyledNavLink>
            <StyledNavLink as={Link} to="/contacto" className="d-flex align-items-center gap-2">
              <FaEnvelope /> Contacto
            </StyledNavLink>
            {estaAutenticado && usuario?.rol === 'admin' && (
              <StyledNavLink as={Link} to="/agregar-producto" className="d-flex align-items-center gap-2">
                <FaPlusCircle /> Agregar Producto
              </StyledNavLink>
            )}
          </BootstrapNav>
          
          <BootstrapNav>
            <StyledNavLink as={Link} to="/carrito" className="d-flex align-items-center gap-2 position-relative">
              <FaShoppingCart /> Carrito
              {totalProductos > 0 && (
                <Badge bg="danger" className="position-absolute top-0 start-100 translate-middle">
                  {totalProductos}
                </Badge>
              )}
            </StyledNavLink>
            <StyledNavLink as={Link} to="/admin" className="d-flex align-items-center gap-2">
              <FaUserCircle /> 
              {estaAutenticado ? (
                <>
                  Mi Perfil {usuario?.rol === 'admin' && <Badge bg="warning" text="dark" className="ms-1">Admin</Badge>}
                </>
              ) : (
                'Perfil'
              )}
            </StyledNavLink>
            {!estaAutenticado && (
              <StyledNavLink as={Link} to="/login" className="d-flex align-items-center gap-2">
                <FaSignInAlt /> Iniciar Sesión
              </StyledNavLink>
            )}
          </BootstrapNav>
        </Navbar.Collapse>
      </Container>
    </StyledHeader>
  );
}

export default Header;