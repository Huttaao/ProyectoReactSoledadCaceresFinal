
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './context/AuthContext'
import { ProductosProvider } from './context/ProductosContext'
import { CarritoProvider } from './context/CarritoContext'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <AuthProvider>
          <ProductosProvider>
            <CarritoProvider>
              <App />
            </CarritoProvider>
          </ProductosProvider>
        </AuthProvider>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick={true}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
          theme="colored"
          limit={2}
          closeButton={false}
        />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)