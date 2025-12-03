import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Form, Alert, Card } from 'react-bootstrap';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { PrimaryButton, SecondaryButton } from '../styles/StyledComponents';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mostrarCredenciales, setMostrarCredenciales] = useState(true);

  const { iniciarSesion, estaAutenticado } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  
  const from = location.state?.from?.pathname || '/';

  
  useEffect(() => {
    if (estaAutenticado) {
      navigate(from, { replace: true });
    }
  }, [estaAutenticado, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    
    if (!username.trim() || !password.trim()) {
      setError('Por favor, completa todos los campos');
      setCargando(false);
      return;
    }

    
    setTimeout(() => {
      const resultado = iniciarSesion(username, password);
      
      if (resultado.success) {
        toast.success('¡Inicio de sesión exitoso!');
        
        navigate(from, { replace: true });
      } else {
        setError(resultado.mensaje);
        toast.error(resultado.mensaje);
      }
      setCargando(false);
    }, 500);
  };

  const autoCompletar = (user, pass) => {
    setUsername(user);
    setPassword(pass);
    setError('');
  };

  return (
    <>
      <Helmet>
        <title>Iniciar Sesión - Mi Tienda Online</title>
        <meta name="description" content="Inicia sesión en Mi Tienda Online para acceder a tu cuenta" />
      </Helmet>
      
      <Container className="py-5" style={{ maxWidth: '500px' }}>
        <Card className="shadow-lg border-0">
          <Card.Body className="p-4">
            <h2 className="text-center mb-4">
              <FaSignInAlt className="me-2" />
              Iniciar Sesión
            </h2>

            {mostrarCredenciales && (
              <Alert variant="info" dismissible onClose={() => setMostrarCredenciales(false)}>
                <Alert.Heading className="h6">Credenciales de prueba:</Alert.Heading>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <SecondaryButton 
                    onClick={() => autoCompletar('admin', 'admin123')}
                    size="sm"
                  >
                    Admin
                  </SecondaryButton>
                  <SecondaryButton 
                    onClick={() => autoCompletar('usuario', 'usuario123')}
                    size="sm"
                  >
                    Usuario
                  </SecondaryButton>
                </div>
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  <FaUser className="me-2" />
                  Usuario
                </Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  disabled={cargando}
                  className="py-2"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">
                  <FaLock className="me-2" />
                  Contraseña
                </Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  disabled={cargando}
                  className="py-2"
                />
              </Form.Group>

              {error && (
                <Alert variant="danger" className="py-2">
                  {error}
                </Alert>
              )}

              <PrimaryButton
                type="submit"
                disabled={cargando}
                className="w-100 py-2"
              >
                <FaSignInAlt className="me-2" />
                {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </PrimaryButton>
            </Form>

            <div className="text-center mt-4 text-muted">
              <small>Autenticación segura con tokens</small>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Login;