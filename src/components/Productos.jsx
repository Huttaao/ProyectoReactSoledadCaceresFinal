import { useState, useMemo, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Button, Form, InputGroup, Pagination, Modal } from 'react-bootstrap';
import { FaShoppingCart, FaEdit, FaTrash, FaPlus, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { useProductos } from '../context/ProductosContext';
import { useAuth } from '../context/AuthContext';
import BarraBusqueda from './BarraBusqueda';
import { 
  ProductCard, 
  ProductImage, 
  ProductInfo, 
  ProductTitle, 
  ProductPrice,
  ProductDescription,
  PrimaryButton,
  DangerButton,
  WarningButton,
  Grid,
  Spinner,
  Badge,
  SectionTitle
} from '../styles/StyledComponents';

const Productos = ({ onAgregar }) => {
const navigate = useNavigate();
const { productos, loading, error, cargarProductos, eliminarProducto } = useProductos();
const { estaAutenticado, usuario } = useAuth();
const [cantidades, setCantidades] = useState({});
const [eliminando, setEliminando] = useState(null);
const [busqueda, setBusqueda] = useState('');
const [mostrarModal, setMostrarModal] = useState(false);
const [productoSeleccionado, setProductoSeleccionado] = useState(null);


const [paginaActual, setPaginaActual] = useState(1);
const productosPorPagina = 8; 

const productosFiltrados = useMemo(() => {
  return productos.filter(p => 
    p.title.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.category?.toLowerCase().includes(busqueda.toLowerCase())
  );
}, [productos, busqueda]);


const totalPaginas = Math.ceil(productosFiltrados.length / productosPorPagina);
const indiceInicio = (paginaActual - 1) * productosPorPagina;
const indiceFin = indiceInicio + productosPorPagina;
const productosActuales = productosFiltrados.slice(indiceInicio, indiceFin);

useEffect(() => {
  setPaginaActual(1);
}, [busqueda]);

const handleCantidadChange = useCallback((id, value) => {
    const num = Math.max(1, parseInt(value || '1', 10) || 1);
    setCantidades(prev => ({ ...prev, [id]: num }));
}, []);

const handleAgregar = useCallback((producto) => {
    const qty = cantidades[producto.id] || 1;
    if (typeof onAgregar === 'function') onAgregar({ ...producto, cantidad: qty });
    
    queueMicrotask(() => {
      toast.success('🛒 Producto agregado al carrito');
    });
}, [cantidades, onAgregar]);

const handleAbrirModal = useCallback((producto) => {
    setProductoSeleccionado(producto);
    setMostrarModal(true);
}, []);

const handleCancelarEliminacion = useCallback(() => {
    setMostrarModal(false);
    setProductoSeleccionado(null);
    setEliminando(null);
}, []);

const handleConfirmarEliminacion = useCallback(async () => {
    if (!productoSeleccionado) return;
    const { id } = productoSeleccionado;
    setEliminando(id);
    const resultado = await eliminarProducto(id);

    if (resultado.success) {
      toast.success('✅ Producto eliminado exitosamente');
    } else {
      toast.error('❌ Error al eliminar: ' + resultado.mensaje);
    }

    setEliminando(null);
    setMostrarModal(false);
    setProductoSeleccionado(null);
}, [productoSeleccionado, eliminarProducto]);

if (loading) {
    return (
      <>
        <Helmet>
          <title>Cargando Productos - Mi Tienda Online</title>
        </Helmet>
        <Container className="text-center py-5">
          <Spinner center size="60px" />
          <p className="mt-3">Cargando productos...</p>
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
        <Container className="text-center py-5">
          <div className="alert alert-danger">
            <h4>Error al cargar productos</h4>
            <p>{error}</p>
            <DangerButton onClick={cargarProductos} className="mt-3">
              Reintentar
            </DangerButton>
          </div>
        </Container>
      </>
    );
}

if (!productos.length) {
    return (
      <>
        <Helmet>
          <title>Sin Productos - Mi Tienda Online</title>
        </Helmet>
        <Container className="text-center py-5">
          <div className="alert alert-info">
            <h4>No hay productos disponibles</h4>
            {estaAutenticado && usuario?.rol === 'admin' && (
              <PrimaryButton onClick={() => navigate('/agregar-producto')} className="mt-3">
                <FaPlus /> Agregar Primer Producto
              </PrimaryButton>
            )}
          </div>
        </Container>
      </>
    );
}

return (
    <>
      <Helmet>
        <title>Productos - Mi Tienda Online</title>
        <meta name="description" content="Descubre nuestra amplia selección de productos de calidad a los mejores precios" />
        <meta name="keywords" content="productos, tienda online, compras, ofertas" />
      </Helmet>
      
      <Container className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <SectionTitle className="mb-0">Catálogo de Productos</SectionTitle>
          {estaAutenticado && usuario?.rol === 'admin' && (
            <PrimaryButton onClick={() => navigate('/agregar-producto')}>
              <FaPlus /> Agregar Producto
            </PrimaryButton>
          )}
        </div>

        <BarraBusqueda busqueda={busqueda} setBusqueda={setBusqueda} />

        {productosFiltrados.length === 0 && busqueda && (
          <div className="alert alert-warning text-center">
            No se encontraron productos que coincidan con "{busqueda}"
          </div>
        )}

        {productosFiltrados.length > 0 && (
          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <small className="text-muted">
              Mostrando {indiceInicio + 1}-{Math.min(indiceFin, productosFiltrados.length)} de {productosFiltrados.length} productos
            </small>
            {totalPaginas > 1 && (
              <small className="text-muted">Página {paginaActual} de {totalPaginas}</small>
            )}
          </div>
        )}

        <Grid>
          {productosActuales.map(p => (
            <ProductCard key={p.id}>
              <Link to={`/producto/${p.id}`} style={{ textDecoration: 'none' }}>
                <ProductImage
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/250?text=Sin+Imagen'; }}
                />
              </Link>
              <ProductInfo>
                <Link to={`/producto/${p.id}`} style={{ textDecoration: 'none' }}>
                  <ProductTitle>{p.title}</ProductTitle>
                </Link>
                
                {p.category && (
                  <Badge $variant="info" className="mb-2">{p.category}</Badge>
                )}
                
                <ProductDescription>{p.description}</ProductDescription>
                
                <ProductPrice>${Number(p.price).toFixed(2)}</ProductPrice>
                
                <InputGroup className="mb-2" size="sm">
                  <Form.Control
                    type="number"
                    min="1"
                    value={cantidades[p.id] || 1}
                    onChange={(e) => handleCantidadChange(p.id, e.target.value)}
                    style={{ maxWidth: '60px', fontSize: '0.875rem' }}
                  />
                  <Button 
                    variant="success"
                    size="sm"
                    onClick={() => handleAgregar(p)}
                    style={{ fontSize: '0.8rem', padding: '0.4rem 0.6rem' }}
                  >
                    <FaShoppingCart className="d-md-inline d-none" /> 
                    <span className="d-md-none">+</span>
                    <span className="d-none d-md-inline"> Agregar</span>
                  </Button>
                </InputGroup>

                {estaAutenticado && usuario?.rol === 'admin' && (
                  <div className="d-flex gap-1 mt-2">
                    <WarningButton 
                      onClick={() => navigate(`/editar-producto/${p.id}`)}
                      style={{ 
                        flex: 1, 
                        fontSize: '0.75rem', 
                        padding: '0.4rem 0.5rem',
                        minHeight: '36px'
                      }}
                    >
                      <FaEdit /> <span className="d-none d-sm-inline">Editar</span>
                    </WarningButton>
                    <DangerButton 
                      onClick={() => handleAbrirModal({ id: p.id, titulo: p.title })}
                      disabled={eliminando === p.id}
                      style={{ 
                        flex: 1, 
                        fontSize: '0.75rem', 
                        padding: '0.4rem 0.5rem',
                        minHeight: '36px'
                      }}
                    >
                      <FaTrash /> <span className="d-none d-sm-inline">{eliminando === p.id ? '...' : 'Eliminar'}</span>
                    </DangerButton>
                  </div>
                )}
              </ProductInfo>
            </ProductCard>
          ))}
        </Grid>

        
        {totalPaginas > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination className="flex-wrap">
              <Pagination.Prev 
                onClick={() => setPaginaActual(prev => Math.max(1, prev - 1))}
                disabled={paginaActual === 1}
              >
                <FaChevronLeft /> Anterior
              </Pagination.Prev>
              
              
              {[...Array(totalPaginas)].map((_, index) => {
                const numeroPagina = index + 1;
                
                const mostrarEnMovil = window.innerWidth < 768 
                  ? Math.abs(numeroPagina - paginaActual) <= 1
                  : true;
                
                if (!mostrarEnMovil && (numeroPagina !== 1 && numeroPagina !== totalPaginas)) {
                  return null;
                }

                return (
                  <Pagination.Item
                    key={numeroPagina}
                    active={numeroPagina === paginaActual}
                    onClick={() => setPaginaActual(numeroPagina)}
                  >
                    {numeroPagina}
                  </Pagination.Item>
                );
              })}
              
              <Pagination.Next 
                onClick={() => setPaginaActual(prev => Math.min(totalPaginas, prev + 1))}
                disabled={paginaActual === totalPaginas}
              >
                Siguiente <FaChevronRight />
              </Pagination.Next>
            </Pagination>
          </div>
        )}
      </Container>

      <Modal
        show={mostrarModal}
        onHide={handleCancelarEliminacion}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productoSeleccionado ? (
            <p>
              ¿Estás seguro de eliminar "{productoSeleccionado.titulo}"? Esta acción no se puede deshacer.
            </p>
          ) : (
            <p>¿Deseas eliminar este producto?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleCancelarEliminacion}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmarEliminacion}
            disabled={eliminando === productoSeleccionado?.id}
          >
            {eliminando === productoSeleccionado?.id ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Productos;