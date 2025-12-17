# PSYS

Una aplicación moderna basada en React para un sistema de punto de venta (POS), construida con Vite, Tailwind CSS e integrada con un backend Django vía API REST.

## Características

- ✅ Autenticación de usuarios con tokens JWT y refresh automático
- ✅ Gestión completa de productos (CRUD) con paginación
- ✅ Gestión de inventario/stock en tiempo real
- ✅ Registro y seguimiento de ventas con cálculo automático
- ✅ Interfaz de usuario responsiva con Tailwind CSS
- ✅ Tema oscuro/claro dinámico
- ✅ Notificaciones con React Hot Toast
- ✅ Manejo robusto de errores con límites de error
- ✅ Formularios con validación (React Hook Form)
- ✅ Suite completa de pruebas unitarias e integración

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

- Inicia sesión con tus credenciales.
- Navega por las secciones: Productos, Inventario, Ventas.
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
