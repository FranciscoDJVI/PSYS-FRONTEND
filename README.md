# PSYS

Una aplicación moderna basada en React para un sistema de punto de venta (POS), construida con Vite, Tailwind CSS e integrada con un API REST construida con DRF.

## Características

### 🔐 Autenticación y Seguridad
- Autenticación JWT con refresh automático de tokens
- Control de acceso basado en roles (Admin, Administrador_tienda, Vendedor)
- Rutas protegidas y gestión de sesiones persistente
- Refresco silencioso de tokens en recarga de página

### 📦 Gestión de Productos
- Operaciones CRUD completas para inventario de productos
- Listado paginado con búsqueda y filtros
- Indicadores visuales de stock (verde >10, amarillo 1-10, rojo 0)
- Permisos basados en roles (Admin/Administrador_tienda pueden gestionar)

### 💰 Procesamiento de Ventas
- Sistema de carrito interactivo para construcción de ventas
- Búsqueda y selección de productos
- Cálculo automático de IVA (19%) y totales
- Soporte para múltiples tipos de pago (efectivo, tarjetas, transferencias)
- Historial de ventas con registros detallados

### 👥 Administración de Usuarios
- Gestión de cuentas de usuario con asignación de roles
- Creación y edición de usuarios con validación
- Manejo seguro de contraseñas (opcional en actualizaciones)
- Indicadores visuales de roles y estado de staff

### 🎨 Experiencia de Usuario
- Alternancia de tema oscuro/claro con persistencia
- Diseño responsivo para todos los tamaños de dispositivo
- Notificaciones toast para feedback del usuario
- Límites de error para manejo robusto de fallos
- Formularios con validación usando React Hook Form
- Suite completa de pruebas unitarias e integración

## Módulos Principales

### Dashboard (Home)
- Página principal con accesos directos a módulos principales
- Componente Sections con cards responsivos
- Navegación intuitiva basada en roles

### Productos
- Listado paginado de productos con vistas de tabla (desktop) y cards (móvil)
- Formularios de creación/edición con validación completa
- Campos: nombre, marca, modelo, dimensiones, descripción, precio, stock

### Ventas
- Formulario de venta con carrito dinámico y búsqueda de productos
- Cálculos automáticos de subtotal, IVA y cambio
- Historial paginado de transacciones

### Usuarios
- Listado de usuarios con roles visuales (Admin, Administrador_tienda, Vendedor)
- Formularios de registro y actualización con manejo de grupos

### Navegación y Tema
- Barra de navegación con menú de usuario y toggle de tema
- Contexto de tema con persistencia en localStorage

## Tecnologías Utilizadas

- **React 18**: Framework principal
- **Vite**: Bundler y servidor de desarrollo
- **Tailwind CSS**: Framework de estilos
- **React Router DOM**: Navegación
- **Axios**: Cliente HTTP con interceptores para autenticación
- **React Hook Form**: Manejo de formularios
- **React Hot Toast**: Notificaciones
- **FontAwesome**: Iconos

## Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn
- Servidor backend ejecutándose en `http://example.com`

## Instalación

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd psys-frotend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre tu navegador y navega a `http://localhost:5173`

## Uso

- Inicia sesión con tus credenciales (dependiendo del rol: Admin, Administrador_tienda o Vendedor).
- Navega por las secciones disponibles según permisos: Dashboard, Productos, Ventas, Usuarios.
- Admin: Acceso completo a todos los módulos.
- Administrador_tienda: Gestión de productos y ventas.
- Vendedor: Solo ventas.
- Agrega, actualiza o visualiza elementos según sea necesario.

## Integración con API

La aplicación se comunica con una API backend Django. Configura la URL base en las variables de entorno:

```bash
# Copia el archivo de ejemplo
cp .env.example .env

# Edita .env con la URL correcta del backend
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1.0/
```

## 🧪 Testing

Este proyecto incluye una suite completa de pruebas:

### Ejecutar Pruebas
```bash
npm run test           # Modo watch
npm run test:run       # Una vez
npm run test:coverage  # Con cobertura
```

### Cobertura de Pruebas
- **Componentes**: Login, ErrorBoundary, formularios
- **Context**: AuthContext, ThemeContext
- **Hooks**: useProducts, useSells
- **Utilidades**: CurrencyFormatter, apiLogger
- **Enfoque**: Manejo de errores, casos edge, integración API

Las pruebas usan Vitest + React Testing Library con mocks completos de APIs externas.

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye para producción
- `npm run preview`: Vista previa del build de producción
- `npm run lint`: Ejecuta ESLint
- `npm run test`: Ejecuta pruebas en modo watch
- `npm run test:run`: Ejecuta todas las pruebas una vez
- `npm run test:coverage`: Ejecuta pruebas con reporte de cobertura

## Contribución

1. Haz un fork del proyecto.
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`).
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`).
4. Push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

## Licencia

Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más detalles.
