import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Alert } from 'react-bootstrap';
import { FaSave, FaTimes, FaImage } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { useProductos } from '../context/ProductosContext';
import { useAuth } from '../context/AuthContext';
import { Card, PageTitle, PrimaryButton, SecondaryButton, SuccessButton, DangerButton, ErrorMessage } from '../styles/StyledComponents';

const AgregarProducto = () => {
  const navigate = useNavigate();
  const { agregarProducto } = useProductos();
  const { estaAutenticado, usuario } = useAuth();


  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    category: '',
    image: ''
  });


  const [errores, setErrores] = useState({});
  

  const [enviando, setEnviando] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: '', texto: '' });


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


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    

    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };


  const validarFormulario = () => {
    const nuevosErrores = {};


    if (!formData.title.trim()) {
      nuevosErrores.title = 'El título es obligatorio';
    } else if (formData.title.trim().length < 3) {
      nuevosErrores.title = 'El título debe tener al menos 3 caracteres';
    } else if (formData.title.trim().length > 100) {
      nuevosErrores.title = 'El título no puede exceder 100 caracteres';
    }


    if (!formData.price) {
      nuevosErrores.price = 'El precio es obligatorio';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      nuevosErrores.price = 'El precio debe ser un número mayor a 0';
    } else if (parseFloat(formData.price) > 999999) {
      nuevosErrores.price = 'El precio es demasiado alto';
    }


    if (!formData.description.trim()) {
      nuevosErrores.description = 'La descripción es obligatoria';
    } else if (formData.description.trim().length < 10) {
      nuevosErrores.description = 'La descripción debe tener al menos 10 caracteres';
    } else if (formData.description.trim().length > 500) {
      nuevosErrores.description = 'La descripción no puede exceder 500 caracteres';
    }


    if (!formData.category) {
      nuevosErrores.category = 'Debes seleccionar una categoría';
    }


    if (!formData.image.trim()) {
      nuevosErrores.image = 'La URL de la imagen es obligatoria';
    } else if (!isValidURL(formData.image)) {
      nuevosErrores.image = 'Debes ingresar una URL válida';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };


  const isValidURL = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje({ tipo: '', texto: '' });


    if (!validarFormulario()) {
      setMensaje({ tipo: 'danger', texto: 'Por favor corrige los errores en el formulario' });
      toast.error('Por favor corrige los errores en el formulario');
      return;
    }

    setEnviando(true);


    const nuevoProducto = {
      title: formData.title.trim(),
      price: parseFloat(formData.price),
      description: formData.description.trim(),
      category: formData.category,
      image: formData.image.trim()
    };


    const resultado = await agregarProducto(nuevoProducto);

    setEnviando(false);

    if (resultado.success) {
      setMensaje({ tipo: 'success', texto: resultado.mensaje });
      toast.success(resultado.mensaje);
      

      setFormData({
        title: '',
        price: '',
        description: '',
        category: '',
        image: ''
      });


      setTimeout(() => {
        navigate('/');
      }, 2000);
    } else {
      setMensaje({ tipo: 'danger', texto: resultado.mensaje });
      toast.error(resultado.mensaje);
    }
  };


  const handleReset = () => {
    setFormData({
      title: '',
      price: '',
      description: '',
      category: '',
      image: ''
    });
    setErrores({});
    setMensaje({ tipo: '', texto: '' });
  };


  if (!estaAutenticado) {
    return (
      <>
        <Helmet>
          <title>Acceso Restringido - Mi Tienda Online</title>
        </Helmet>
        <Container className="py-5" style={{ maxWidth: '600px' }}>
          <Card className="text-center">
            <h2>Acceso Restringido</h2>
            <p>Debes iniciar sesión para agregar productos.</p>
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
            <p>Solo los administradores pueden agregar productos.</p>
            <p className="text-muted">Tu rol actual: <strong>{usuario?.rol}</strong></p>
            <PrimaryButton onClick={() => navigate('/')}>
              Volver al Inicio
            </PrimaryButton>
          </Card>
        </Container>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Agregar Producto - Mi Tienda Online</title>
        <meta name="description" content="Agregar nuevo producto a la tienda" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <Container className="py-5" style={{ maxWidth: '800px' }}>
        <PageTitle>
          <FaImage className="me-2" />
          Agregar Nuevo Producto
        </PageTitle>
        <p className="text-muted mb-4">
          Usuario: <strong>{usuario?.nombre}</strong> | Completa todos los campos para agregar un producto
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


            <div className="d-flex gap-2 mt-4">
              <SuccessButton type="submit" disabled={enviando} className="flex-fill">
                <FaSave className="me-2" />
                {enviando ? 'Agregando...' : 'Agregar Producto'}
              </SuccessButton>
              <SecondaryButton type="button" onClick={handleReset} disabled={enviando}>
                <FaTimes className="me-2" />
                Limpiar
              </SecondaryButton>
              <DangerButton type="button" onClick={() => navigate('/')} disabled={enviando}>
                <FaTimes className="me-2" />
                Cancelar
              </DangerButton>
            </div>
          </Form>
        </Card>


        <Alert variant="info" className="mt-4">
          <strong>Información:</strong>
          <ul className="mt-2 mb-0">
            <li>Todos los campos marcados con <span className="text-danger">*</span> son obligatorios</li>
          <li>El título debe tener entre 3 y 100 caracteres</li>
          <li>La descripción debe tener entre 10 y 500 caracteres</li>
            <li>El precio debe ser un número positivo</li>
            <li>La imagen debe ser una URL válida</li>
            <li>Los datos se envían a MockAPI para persistencia</li>
          </ul>
        </Alert>
      </Container>
    </>
  );
};

export default AgregarProducto;
