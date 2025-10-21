import Header from './components/Header'
import Nav from './components/Nav'
import Footer from './components/Footer'
import { Routes, Route } from 'react-router-dom'
import React, { useState } from 'react';
import './App.css'
import Inicio from './components/Inicio'
import Contacto from './components/Contacto'
import DetalleProducto from './components/DetalleProducto'
import RutaProtegida from './components/RutaProtegida'
import Admin from './components/Admin'
import Login from './components/Login'


function App() {
  const [estaAutenticado, setEstaAutenticado] = useState(false);

  const iniciarSesion = () => setEstaAutenticado(true);
  const cerrarSesion = () => setEstaAutenticado(false);

  return (
    <>
      <Header />
      <Nav />
      {estaAutenticado ? (
        <button onClick={cerrarSesion}>Cerrar sesión</button>
      ) : (
        <button onClick={iniciarSesion}>Iniciar sesión</button>
      )}

      <Routes>
        <Route path="/" element={<Inicio estaAutenticado={estaAutenticado} />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route
          path="/admin"
          element={
            <RutaProtegida estaAutenticado={estaAutenticado}>
              <Admin />
            </RutaProtegida>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
