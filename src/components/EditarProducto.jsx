import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { FaSave, FaTimes, FaEdit } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { useProductos } from '../context/ProductosContext';
import { useAuth } from '../context/AuthContext';
import { Card, PageTitle, PrimaryButton, SecondaryButton, ErrorMessage, Spinner } from '../styles/StyledComponents';

const EditarProducto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { productos, actualizarProducto } = useProductos();
  const { estaAutenticado, usuario } = useAuth();

  // Estado del formulario
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    image: ''
  });

  // Estado para errores de validación
  const [errores, setErrores] = useState({});
  
  // Estado para el envío del formulario
  const [enviando, setEnviando] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });

  // Categorías disponibles
  const categorias = [
    'electronics',
    'jewelery',
    'men\'s clothing',
    'women\'s clothing',
    'books',
    'toys',
    'sports',
    'home'
  ];

  // Cargar datos del producto
  useEffect(() => {
    const cargarProducto = async () => {
      setCargando(true);
      
      // Buscar en productos cargados
      const productoLocal = productos.find(p => p.id === parseInt(id));
      
      if (productoLocal) {
        setFormData({
          title: productoLocal.title || '',
          price: productoLocal.price || '',
          description: productoLocal.description || '',
          category: productoLocal.category || '',
          image: productoLocal.image || ''
        });
        setCargando(false);
        return;
      }

      // Si no está en el contexto, cargar desde API
      try {
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!res.ok) throw new Error('Producto no encontrado');
        
        const data = await res.json();
        setFormData({
          title: data.title || '',
          price: data.price || '',
          description: data.description || '',
          category: data.category || '',
          image: data.image || ''
        });
      } catch (error) {
        setMensaje({ 
          tipo: 'error', 
          texto: 'Error al cargar el producto: ' + error.message 
        });
      } finally {
        setCargando(false);
      }
    };

    if (id) {
      cargarProducto();
    }
  }, [id, productos]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validar el formulario
  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar título
    if (!formData.title.trim()) {
      nuevosErrores.title = 'El título es obligatorio';
    } else if (formData.title.trim().length < 3) {
      nuevosErrores.title = 'El título debe tener al menos 3 caracteres';
    } else if (formData.title.trim().length > 100) {
      nuevosErrores.title = 'El título no puede exceder 100 caracteres';
    }

    // Validar precio
    if (!formData.price) {
      nuevosErrores.price = 'El precio es obligatorio';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      nuevosErrores.price = 'El precio debe ser un número mayor a 0';
    } else if (parseFloat(formData.price) > 999999) {
      nuevosErrores.price = 'El precio es demasiado alto';
    }

    // Validar descripción
    if (!formData.description.trim()) {
      nuevosErrores.description = 'La descripción es obligatoria';
    } else if (formData.description.trim().length < 10) {
      nuevosErrores.description = 'La descripción debe tener al menos 10 caracteres';
    } else if (formData.description.trim().length > 500) {
      nuevosErrores.description = 'La descripción no puede exceder 500 caracteres';
    }

    // Validar categoría
    if (!formData.category) {
      nuevosErrores.category = 'Debes seleccionar una categoría';
    }

    // Validar URL de imagen
    if (!formData.image.trim()) {
      nuevosErrores.image = 'La URL de la imagen es obligatoria';
    } else if (!isValidURL(formData.image)) {
      nuevosErrores.image = 'Debes ingresar una URL válida';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Validar URL
  const isValidURL = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });

    // Validar formulario
    if (!validarFormulario()) {
      setMensaje({ 
        tipo: 'error', 
        texto: 'Por favor corrige los errores en el formulario' 
      });
      return;
    }

    setEnviando(true);

    // Preparar datos del producto
    const productoActualizado = {
      title: formData.title.trim(),
      price: parseFloat(formData.price),
      description: formData.description.trim(),
      category: formData.category,
      image: formData.image.trim()
    };

    // Enviar a la API
    const resultado = await actualizarProducto(parseInt(id), productoActualizado);

    setEnviando(false);

    if (resultado.success) {
      setMensaje({ 
        tipo: 'success', 
        texto: resultado.mensaje 
      });

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      setMensaje({ 
        tipo: 'error', 
        texto: resultado.mensaje 
      });
    }
  };

  // Verificar autenticación y rol
  if (!estaAutenticado) {
    return (
      <>
        <Helmet>
          <title>Acceso Restringido - Mi Tienda Online</title>
        </Helmet>
        <Container className="py-5" style={{ maxWidth: '600px' }}>
          <Card className="text-center">
            <h2>Acceso Restringido</h2>
            <p>Debes iniciar sesión para editar productos.</p>
            <PrimaryButton onClick={() => navigate('/login')}>
              Ir al Login
            </PrimaryButton>
          </Card>
        </Container>
      </>
    );
  }

  if (usuario?.rol !== 'admin') {
    return (
      <>
        <Helmet>
          <title>Acceso Denegado - Mi Tienda Online</title>
        </Helmet>
        <Container className="py-5" style={{ maxWidth: '600px' }}>
          <Card className="text-center">
            <h2>Acceso Denegado</h2>
            <p>Solo los administradores pueden editar productos.</p>
            <p className="text-muted">Tu rol actual: <strong>{usuario?.rol}</strong></p>
            <PrimaryButton onClick={() => navigate('/')}>
              Volver al Inicio
            </PrimaryButton>
          </Card>
        </Container>
      </>
    );
  }

  if (cargando) {
    return (
      <>
        <Helmet>
          <title>Cargando... - Mi Tienda Online</title>
        </Helmet>
        <Container className="py-5 text-center">
          <Spinner />
          <p className="mt-3">Cargando producto...</p>
        </Container>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Editar Producto - Mi Tienda Online</title>
        <meta name="description" content="Editar producto existente en la tienda" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <Container className="py-5" style={{ maxWidth: '800px' }}>
        <PageTitle>
          <FaEdit className="me-2" />
          Editar Producto
        </PageTitle>
        <p className="text-muted mb-4">
          Usuario: <strong>{usuario?.nombre}</strong> | ID del Producto: <strong>{id}</strong>
        </p>

        {mensaje.texto && (
          <Alert variant={mensaje.tipo === 'success' ? 'success' : 'danger'} className="mb-4">
            {mensaje.texto}
          </Alert>
        )}

        <Card>
          <Form onSubmit={handleSubmit}>
            {/* Título */}
            <Form.Group className="mb-3">
              <Form.Label>Título del Producto <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej: Laptop HP 15.6 pulgadas"
                disabled={enviando}
                isInvalid={!!errores.title}
              />
              {errores.title && <ErrorMessage>{errores.title}</ErrorMessage>}
              <Form.Text className="text-muted">
                {formData.title.length}/100 caracteres
              </Form.Text>
            </Form.Group>

            {/* Precio */}
            <Form.Group className="mb-3">
              <Form.Label>Precio (USD) <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Ej: 599.99"
                step="0.01"
                min="0"
                disabled={enviando}
                isInvalid={!!errores.price}
              />
              {errores.price && <ErrorMessage>{errores.price}</ErrorMessage>}
            </Form.Group>

            {/* Categoría */}
            <Form.Group className="mb-3">
              <Form.Label>Categoría <span className="text-danger">*</span></Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                disabled={enviando}
                isInvalid={!!errores.category}
              >
                <option value="">Selecciona una categoría</option>
                {categorias.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Form.Select>
              {errores.category && <ErrorMessage>{errores.category}</ErrorMessage>}
            </Form.Group>

            {/* Descripción */}
            <Form.Group className="mb-3">
              <Form.Label>Descripción <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe el producto en detalle..."
                rows={5}
                disabled={enviando}
                isInvalid={!!errores.description}
              />
              {errores.description && <ErrorMessage>{errores.description}</ErrorMessage>}
              <Form.Text className="text-muted">
                {formData.description.length}/500 caracteres
              </Form.Text>
            </Form.Group>

            {/* URL de imagen */}
            <Form.Group className="mb-3">
              <Form.Label>URL de la Imagen <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
                disabled={enviando}
                isInvalid={!!errores.image}
              />
              {errores.image && <ErrorMessage>{errores.image}</ErrorMessage>}
              {formData.image && isValidURL(formData.image) && (
                <div className="text-center mt-3">
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', border: '1px solid #ddd' }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}
            </Form.Group>

            {/* Botones */}
            <div className="d-flex gap-2 mt-4">
              <PrimaryButton type="submit" disabled={enviando} className="flex-fill">
                <FaSave className="me-2" />
                {enviando ? 'Guardando...' : 'Guardar Cambios'}
              </PrimaryButton>
              <SecondaryButton type="button" onClick={() => navigate('/')} disabled={enviando}>
                <FaTimes className="me-2" />
                Cancelar
              </SecondaryButton>
            </div>
          </Form>
        </Card>

        {/* Información adicional */}
        <Alert variant="info" className="mt-4">
          <strong>Información:</strong>
          <ul className="mt-2 mb-0">
            <li>Todos los campos marcados con <span className="text-danger">*</span> son obligatorios</li>
            <li>Los cambios se envían a FakeStoreAPI para simular la actualización</li>
            <li>Las validaciones son las mismas que en el formulario de agregar</li>
            <li>El producto se actualizará en la lista local</li>
          </ul>
        </Alert>
      </Container>
    </>
  );
};

export default EditarProducto;
