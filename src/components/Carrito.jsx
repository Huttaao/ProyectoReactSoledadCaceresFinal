
import { Container, Row, Col, Button, Table, Badge } from 'react-bootstrap';
import { FaPlus, FaMinus, FaTrash, FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { useCarrito } from '../context/CarritoContext';
import { Card, DangerButton, SectionTitle } from '../styles/StyledComponents';


const Carrito = () => {
  const { estaAutenticado } = useAuth();
  const { carrito, aumentarCantidad, disminuirCantidad, eliminarDelCarrito, calcularTotal, limpiarCarrito } = useCarrito();


  const aumentar = (id) => {
    if (!estaAutenticado) return;
    aumentarCantidad(id);
  };

  const disminuir = (id) => {
    if (!estaAutenticado) return;
    disminuirCantidad(id);
  };

  const eliminar = (id) => {
    if (!estaAutenticado) return;
    eliminarDelCarrito(id);
    toast.info('Producto eliminado del carrito');
  };

  const vaciar = () => {
    if (!estaAutenticado || carrito.length === 0) return;
    limpiarCarrito();
    toast.info('Carrito vaciado');
  };

  const total = calcularTotal();

  if (!estaAutenticado) {
    return (
      <>
        <Helmet>
          <title>Carrito de Compras - Mi Tienda Online</title>
        </Helmet>
        <Container className="py-5">
          <Card className="text-center">
            <FaShoppingCart size={60} className="text-muted mb-3" />
            <h4>Inicia sesión para usar el carrito</h4>
          </Card>
        </Container>
      </>
    );
  }

  return ( 
    <>
      <Helmet>
        <title>Carrito de Compras - Mi Tienda Online</title>
        <meta name="description" content="Revisa los productos en tu carrito de compras" />
      </Helmet>
      
      <Container className="py-4">
        <SectionTitle>
          <FaShoppingCart className="me-2" />
          Carrito de Compras
          {carrito.length > 0 && (
            <Badge bg="primary" className="ms-2">{carrito.length}</Badge>
          )}
        </SectionTitle>

        {carrito.length === 0 ? (
          <Card className="text-center py-5">
            <FaShoppingCart size={60} className="text-muted mb-3" />
            <h4>Tu carrito está vacío</h4>
            <p className="text-muted">Agrega productos para comenzar a comprar</p>
          </Card>
        ) : (
          <>
            <Card>
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th className="text-center">Cantidad</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.title}
                              style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                            />
                          )}
                          <strong>{item.title}</strong>
                        </div>
                      </td>
                      <td>${Number(item.price).toFixed(2)}</td>
                      <td>
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            onClick={() => disminuir(item.id)}
                          >
                            <FaMinus />
                          </Button>
                          <span className="fw-bold mx-2">{item.cantidad}</span>
                          <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            onClick={() => aumentar(item.id)}
                          >
                            <FaPlus />
                          </Button>
                        </div>
                      </td>
                      <td className="fw-bold">${(item.price * item.cantidad).toFixed(2)}</td>
                      <td>
                        <DangerButton 
                          onClick={() => eliminar(item.id)}
                          size="sm"
                        >
                          <FaTrash />
                        </DangerButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card>

            <Card className="mt-4">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                <h5 className="mb-0">Resumen</h5>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={vaciar}
                >
                  Vaciar carrito
                </Button>
              </div>
              <Row className="align-items-center">
                <Col md={8}>
                  <h5 className="mb-0">Total a pagar:</h5>
                </Col>
                <Col md={4} className="text-end">
                  <h3 className="text-primary mb-0">${total.toFixed(2)}</h3>
                </Col>
              </Row>
              <Button variant="success" size="lg" className="w-100 mt-3">
                Proceder al Pago
              </Button>
            </Card>
          </>
        )}
      </Container>
    </>
  );
};

export default Carrito;