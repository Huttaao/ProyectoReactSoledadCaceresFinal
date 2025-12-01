import { Container, Row, Col, Alert } from 'react-bootstrap';
import { FaUser, FaShieldAlt, FaShoppingCart, FaKey, FaCrown } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';
import GestionProductos from './GestionProductos';
import { Card, Badge, PageTitle } from '../styles/StyledComponents';

const Admin = () => {
  const { usuario, token } = useAuth();
  const { carrito, calcularTotal } = useCarrito();

  return (
    <>
      <Helmet>
        <title>Mi Perfil - Mi Tienda Online</title>
        <meta name="description" content="Panel de administración y perfil de usuario" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <Container className="py-4">
        <PageTitle>
          <FaUser className="me-2" />
          Mi Perfil
          {usuario?.rol === 'admin' && (
            <Badge $variant="warning" className="ms-3">
              <FaCrown /> Administrador
            </Badge>
          )}
        </PageTitle>

        <Row className="g-4">
          {/* Información del usuario */}
          <Col lg={6}>
            <Card>
              <h4 className="mb-3">
                <FaUser className="me-2 text-primary" />
                Información Personal
              </h4>
              <div className="d-flex flex-column gap-2">
                <div><strong>Nombre:</strong> {usuario?.nombre}</div>
                <div><strong>Usuario:</strong> {usuario?.username}</div>
                <div><strong>ID:</strong> {usuario?.id}</div>
                <div>
                  <strong>Rol:</strong>
                  <Badge 
                    $variant={usuario?.rol === 'admin' ? 'warning' : 'success'} 
                    className="ms-2"
                  >
                    {usuario?.rol?.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </Card>
          </Col>

          {/* Resumen del carrito */}
          <Col lg={6}>
            <Card>
              <h4 className="mb-3">
                <FaShoppingCart className="me-2 text-success" />
                Mi Carrito
              </h4>
              {carrito.length > 0 ? (
                <>
                  <p>
                    Tienes <Badge $variant="primary">{carrito.length}</Badge> producto(s) en tu carrito:
                  </p>
                  <ul className="list-unstyled">
                    {carrito.map(item => (
                      <li key={item.id} className="py-1 border-bottom">
                        {item.title} - Cantidad: {item.cantidad} - ${(item.price * item.cantidad).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-3 border-top">
                    <h5 className="text-primary mb-0">Total: ${calcularTotal().toFixed(2)}</h5>
                  </div>
                </>
              ) : (
                <p className="text-muted">Tu carrito está vacío. ¡Empieza a comprar!</p>
              )}
            </Card>
          </Col>

          {/* Token de sesión */}
          <Col xs={12}>
            <Card>
              <h4 className="mb-3">
                <FaKey className="me-2 text-info" />
                Token de Sesión
              </h4>
              <p className="text-muted small">
                Este es tu token de autenticación simulado (en producción sería un JWT real):
              </p>
              <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '1rem', 
                borderRadius: '0.5rem',
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                wordBreak: 'break-all',
                border: '1px solid #dee2e6'
              }}>
                {token}
              </div>
              <p className="text-muted small mt-2 mb-0">
                El token se almacena en localStorage y expira en 24 horas
              </p>
            </Card>
          </Col>
        </Row>

        {/* Gestión de Productos - Solo para Admin */}
        {usuario?.rol === 'admin' && (
          <GestionProductos />
        )}

        {/* Información adicional */}
        <Alert variant="warning" className="mt-4 text-center">
          <Alert.Heading className="h5">
            <FaShieldAlt className="me-2" />
            Sobre esta página protegida
          </Alert.Heading>
          <div className="mb-0 small">
            <p className="mb-1">Esta página solo es accesible para usuarios autenticados</p>
            <p className="mb-1">La autenticación se gestiona mediante Context API</p>
            <p className="mb-1">Los tokens se almacenan de forma segura en localStorage</p>
            <p className="mb-2">La sesión expira automáticamente después de 24 horas</p>
            {usuario?.rol === 'admin' && (
              <p className="mb-0"><strong>Como admin, tienes acceso completo a la gestión de productos</strong></p>
            )}
          </div>
        </Alert>
      </Container>
    </>
  );
};

export default Admin;