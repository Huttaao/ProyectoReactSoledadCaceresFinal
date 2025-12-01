# ProyectoReactSoledadCaceres

Aplicación de e-commerce desarrollada con React 18 y Vite que cumple con los requerimientos de la entrega final: carrito de compras con Context API, autenticación simulada, CRUD de productos contra MockAPI/FakeStoreAPI, toasts de feedback, diseño responsivo y paginación del catálogo.

## Requisitos Previos
- Node.js 18+
- pnpm (se recomienda npm `npm install -g pnpm` si no está instalado)

## Instalación
```powershell
pnpm install
```

## Ejecutar en Desarrollo
```powershell
pnpm run dev
```
La aplicación estará disponible en `http://localhost:5173/`.

## Scripts Disponibles
- `pnpm run dev`: inicia Vite en modo desarrollo.
- `pnpm run build`: genera el build de producción.
- `pnpm run preview`: sirve el build generado.
- `pnpm run lint`: ejecuta ESLint.

## Tecnologías Principales
- React 18 + Vite
- React Router DOM 6
- Context API (auth, productos, carrito)
- React Bootstrap + styled-components
- React Toastify y React Icons
- React Helmet Async

## Requerimientos Cubiertos
1. **Carrito y Autenticación**: rutas protegidas, contexto global, persistencia en `localStorage`.
2. **CRUD de Productos**: formularios validados, peticiones a FakeStore/MockAPI, modal de confirmación al eliminar.
3. **Diseño Responsivo**: grid de Bootstrap, componentes adaptativos con styled-components.
4. **Búsqueda y Paginación**: filtrado en vivo por nombre/categoría y paginación móvil-friendly.
5. **Preparación para Deploy**: estructura optimizada, manejo de errores y estados de carga.

## Credenciales de Demostración
- Admin: `admin / admin123`
- Usuario: `usuario / usuario123`

## Licencia
Proyecto académico, sin licencia específica.
