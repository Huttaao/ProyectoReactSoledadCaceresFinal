import { createContext, useState, useContext, useEffect } from 'react';


const AuthContext = createContext();


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

const USUARIOS_MOCK = [
  { id: 1, username: 'admin', password: 'admin123', nombre: 'Administrador', rol: 'admin' },
  { id: 2, username: 'usuario', password: 'usuario123', nombre: 'Usuario Demo', rol: 'usuario' }
];


const generarTokenSimulado = (usuario) => {
  const payload = {
    id: usuario.id,
    username: usuario.username,
    nombre: usuario.nombre,
    rol: usuario.rol,
    exp: Date.now() + (24 * 60 * 60 * 1000)
  };

  return btoa(JSON.stringify(payload));
};


const verificarToken = (token) => {
  try {
    const payload = JSON.parse(atob(token));
    
    if (payload.exp && payload.exp > Date.now()) {
      return payload;
    }
    return null;
  } catch (error) {
    return null;
  }
};


export const AuthProvider = ({ children }) => {
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);


  useEffect(() => {
    const tokenGuardado = localStorage.getItem('authToken');
    if (tokenGuardado) {
      const datosUsuario = verificarToken(tokenGuardado);
      if (datosUsuario) {
        setToken(tokenGuardado);
        setUsuario(datosUsuario);
        setEstaAutenticado(true);
      } else {

        localStorage.removeItem('authToken');
      }
    }
    setCargando(false);
  }, []);


  const iniciarSesion = (username, password) => {

    const usuarioEncontrado = USUARIOS_MOCK.find(
      u => u.username === username && u.password === password
    );

    if (usuarioEncontrado) {

      const nuevoToken = generarTokenSimulado(usuarioEncontrado);
      

      localStorage.setItem('authToken', nuevoToken);
      

      setToken(nuevoToken);
      setUsuario({
        id: usuarioEncontrado.id,
        username: usuarioEncontrado.username,
        nombre: usuarioEncontrado.nombre,
        rol: usuarioEncontrado.rol
      });
      setEstaAutenticado(true);
      
      return { success: true, mensaje: 'Inicio de sesión exitoso' };
    } else {
      return { success: false, mensaje: 'Usuario o contraseña incorrectos' };
    }
  };


  const cerrarSesion = () => {
    
    localStorage.removeItem('authToken');
    
    
    setToken(null);
    setUsuario(null);
    setEstaAutenticado(false);
  };


  const tieneRol = (rolRequerido) => {
    return usuario?.rol === rolRequerido;
  };

  const value = {
    estaAutenticado,
    usuario,
    token,
    cargando,
    iniciarSesion,
    cerrarSesion,
    tieneRol
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
