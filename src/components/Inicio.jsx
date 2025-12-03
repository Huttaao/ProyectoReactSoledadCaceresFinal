import { useCallback } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaStore, FaShieldAlt, FaTruck, FaHeadset } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import Productos from './Productos';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';
import { PageTitle, Card } from '../styles/StyledComponents';

const Inicio = () => {
  const { estaAutenticado } = useAuth();
  const { agregarAlCarrito } = useCarrito();

  const handleAgregarAlCarrito = useCallback((producto) => {
    if (!estaAutenticado) {
      queueMicrotask(() => {
        toast.warning('Debes iniciar sesión para agregar productos al carrito');
      });
      return;
    }
    agregarAlCarrito(producto);
  }, [estaAutenticado, agregarAlCarrito]);

  return (
    <>
      <Helmet>
        <title>Inicio - Mi Tienda Online | Las mejores ofertas</title>
        <meta name="description" content="Bienvenido a Mi Tienda Online. Encuentra los mejores productos con envío rápido y seguro." />
        <meta name="keywords" content="tienda online, productos, ofertas, compras, e-commerce" />
      </Helmet>

      
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        color: 'white',
        padding: '4rem 0'
      }}>
        <Container>
          <Row className="align-items-center">
            <Col lg={8} className="mx-auto text-center">
              <PageTitle style={{ color: 'white', fontSize: '3rem', marginBottom: '1rem' }}>
                <FaStore className="me-3" />
                Bienvenido a Mi Tienda Online
              </PageTitle>
              <p className="lead" style={{ fontSize: '1.3rem' }}>
                Descubre productos increíbles con la mejor calidad y precio del mercado
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      
      <Container className="py-5">
        <Row className="g-4 mb-5">
          <Col md={3} sm={6}>
            <Card className="text-center h-100">
              <FaTruck size={40} className="text-primary mb-3" />
              <h5>Envío Rápido</h5>
              <p className="text-muted mb-0">Entrega en 24-48 horas</p>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="text-center h-100">
              <FaShieldAlt size={40} className="text-success mb-3" />
              <h5>Compra Segura</h5>
              <p className="text-muted mb-0">Pago 100% protegido</p>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="text-center h-100">
              <FaHeadset size={40} className="text-info mb-3" />
              <h5>Soporte 24/7</h5>
              <p className="text-muted mb-0">Atención personalizada</p>
            </Card>
          </Col>
          <Col md={3} sm={6}>
            <Card className="text-center h-100">
              <FaStore size={40} className="text-warning mb-3" />
              <h5>Mejor Precio</h5>
              <p className="text-muted mb-0">Garantía de precio bajo</p>
            </Card>
          </Col>
        </Row>
      </Container>

      
      <Productos onAgregar={handleAgregarAlCarrito} />
    </>
  );
};

export default Inicio;