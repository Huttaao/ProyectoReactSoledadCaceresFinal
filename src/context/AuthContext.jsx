import React, { createContext, useState, useContext, useEffect } from 'react';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Usuarios simulados para práctica (en producción esto vendría de una API)
const USUARIOS_MOCK = [
  { id: 1, username: 'admin', password: 'admin123', nombre: 'Administrador', rol: 'admin' },
  { id: 2, username: 'usuario', password: 'usuario123', nombre: 'Usuario Demo', rol: 'usuario' }
];

// Función para generar un token simulado
const generarTokenSimulado = (usuario) => {
  const payload = {
    id: usuario.id,
    username: usuario.username,
    nombre: usuario.nombre,
    rol: usuario.rol,
    exp: Date.now() + (24 * 60 * 60 * 1000) // Expira en 24 horas
  };
  // Simular un JWT codificando el payload en base64
  return btoa(JSON.stringify(payload));
};

// Función para verificar si el token es válido
const verificarToken = (token) => {
  try {
    const payload = JSON.parse(atob(token));
    // Verificar si el token no ha expirado
    if (payload.exp && payload.exp > Date.now()) {
      return payload;
    }
    return null;
  } catch (error) {
    return null;
  }
};

// Provider del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [estaAutenticado, setEstaAutenticado] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Verificar si hay una sesión guardada al cargar la aplicación
  useEffect(() => {
    const tokenGuardado = localStorage.getItem('authToken');
    if (tokenGuardado) {
      const datosUsuario = verificarToken(tokenGuardado);
      if (datosUsuario) {
        setToken(tokenGuardado);
        setUsuario(datosUsuario);
        setEstaAutenticado(true);
      } else {
        // Token expirado o inválido
        localStorage.removeItem('authToken');
      }
    }
    setCargando(false);
  }, []);

  // Función para iniciar sesión
  const iniciarSesion = (username, password) => {
    // Buscar usuario en la base de datos simulada
    const usuarioEncontrado = USUARIOS_MOCK.find(
      u => u.username === username && u.password === password
    );

    if (usuarioEncontrado) {
      // Generar token
      const nuevoToken = generarTokenSimulado(usuarioEncontrado);
      
      // Guardar token en localStorage
      localStorage.setItem('authToken', nuevoToken);
      
      // Actualizar estado
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

  // Función para cerrar sesión
  const cerrarSesion = () => {
    // Limpiar localStorage
    localStorage.removeItem('authToken');
    
    // Limpiar estado
    setToken(null);
    setUsuario(null);
    setEstaAutenticado(false);
  };

  // Función para verificar si el usuario tiene un rol específico
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
