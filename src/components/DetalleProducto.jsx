import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Alert, Badge } from 'react-bootstrap';
import { FaArrowLeft, FaStar, FaShoppingCart, FaTag } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { useProductos } from '../context/ProductosContext';
import { useCarrito } from '../context/CarritoContext';
import { Card, ProductImage, ProductPrice, PrimaryButton, SecondaryButton, Spinner } from '../styles/StyledComponents';

const DetalleProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { productos } = useProductos();
  const { agregarAlCarrito } = useCarrito();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    if (!id) {
      setError('ID de producto inválido');
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const cargar = async () => {
      setLoading(true);
      setError(null);
      
      try {
        
        const productoLocal = productos.find(p => p.id === parseInt(id));
        
        if (productoLocal) {
          setProducto(productoLocal);
          setLoading(false);
          return;
        }

        
        const res = await fetch(`https://fakestoreapi.com/products/${id}`, { 
          signal: controller.signal 
        });
        
        if (!res.ok) {
          throw new Error(`Error en la respuesta (${res.status})`);
        }

        
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('La respuesta no es JSON válido');
        }

        const text = await res.text();
        if (!text) {
          throw new Error('Respuesta vacía del servidor');
        }

        const data = JSON.parse(text);
        setProducto(data);
      } catch (err) {
        if (err.name === 'AbortError') return;
        console.error('Error cargando producto:', err);
        setError(err.message || 'Error al cargar el producto');
      } finally {
        setLoading(false);
      }
    };

    cargar();

    return () => controller.abort();
  }, [id, productos]);

  if (loading) {
    return (
      <>
        <Helmet>
          <title>Cargando... - Mi Tienda Online</title>
        </Helmet>
        <Container className="py-5 text-center">
          <Spinner />
          <p className="mt-3">Cargando detalle del producto...</p>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Error - Mi Tienda Online</title>
        </Helmet>
        <Container className="py-5">
          <Alert variant="danger" className="text-center" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <h3>Error al cargar producto</h3>
            <p>{error}</p>
            <SecondaryButton onClick={() => navigate('/')}>
              <FaArrowLeft className="me-2" />
              Volver al Inicio
            </SecondaryButton>
          </Alert>
        </Container>
      </>
    );
  }

  if (!producto) {
    return (
      <>
        <Helmet>
          <title>Producto no encontrado - Mi Tienda Online</title>
        </Helmet>
        <Container className="py-5 text-center">
          <h3>Producto no encontrado</h3>
          <SecondaryButton onClick={() => navigate('/')} className="mt-3">
            <FaArrowLeft className="me-2" />
            Volver al Inicio
          </SecondaryButton>
        </Container>
      </>
    );
  }

  const handleAgregarAlCarrito = useCallback(() => {
    const productoConCantidad = {
      ...producto,
      cantidad: cantidad
    };
    agregarAlCarrito(productoConCantidad);
    
    queueMicrotask(() => {
      toast.success(`${cantidad} ${cantidad === 1 ? 'unidad agregada' : 'unidades agregadas'} al carrito`);
      setTimeout(() => navigate('/carrito'), 1500);
    });
  }, [producto, cantidad, agregarAlCarrito, navigate]);

  return (
    <>
      <Helmet>
        <title>{producto.title} - Mi Tienda Online</title>
        <meta name="description" content={producto.description} />
        <meta name="keywords" content={`${producto.category}, producto, tienda online`} />
      </Helmet>

      <Container className="py-5" style={{ maxWidth: '1000px' }}>
        <SecondaryButton onClick={() => navigate('/')} className="mb-4">
          <FaArrowLeft className="me-2" />
          Volver
        </SecondaryButton>

        <Row className="g-4">
          <Col md={5}>
            <Card className="text-center">
              <ProductImage
                src={producto.image}
                alt={producto.title}
                loading="lazy"
                onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/300?text=No+img'; }}
                style={{ maxHeight: '400px', objectFit: 'contain', width: '100%' }}
              />
            </Card>
          </Col>

          <Col md={7}>
            <h2 className="mb-3">{producto.title}</h2>
            
            {producto.category && (
              <div className="mb-3">
                <Badge bg="primary" className="me-2">
                  <FaTag className="me-1" />
                  {producto.category}
                </Badge>
                {producto.rating && (
                  <Badge bg="warning" text="dark">
                    <FaStar className="me-1" />
                    {producto.rating.rate} / 5 ({producto.rating.count} reseñas)
                  </Badge>
                )}
              </div>
            )}

            <Card className="mb-3">
              <h5 className="text-primary mb-3">Descripción</h5>
              <p style={{ lineHeight: '1.8' }}>{producto.description}</p>
            </Card>

            <Card className="bg-light">
              <ProductPrice>${Number(producto.price).toFixed(2)}</ProductPrice>
              
              <div className="d-flex align-items-center gap-3 mb-3">
                <label className="mb-0">Cantidad:</label>
                <input
                  type="number"
                  min="1"
                  max="99"
                  value={cantidad}
                  onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                  className="form-control"
                  style={{ width: '80px' }}
                />
              </div>

              <PrimaryButton onClick={handleAgregarAlCarrito} className="w-100">
                <FaShoppingCart className="me-2" />
                Agregar al Carrito
              </PrimaryButton>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DetalleProducto;