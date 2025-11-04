# 🎓 Sistema Académico UNSA - Frontend

Sistema web académico desarrollado con React + Vite para la gestión de estudiantes y docentes.

## 🚀 Inicio Rápido

### 1. Instalación

```bash
# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env
```

### 2. Configuración

Edita el archivo `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK_DATA=true  # Cambiar a false cuando el backend esté listo
```

### 3. Ejecutar

```bash
# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 📁 Estructura del Proyecto

```
src/
├── api/              # Configuración de Axios y endpoints
├── components/       # Componentes reutilizables
│   ├── shared/      # Componentes compartidos (Layout, Navbar)
│   ├── student/     # Componentes específicos de estudiante
│   └── teacher/     # Componentes específicos de docente
├── config/          # Configuraciones (React Query)
├── context/         # Contextos de React (AuthContext)
├── hooks/           # Custom hooks
├── mocks/           # Datos mock para desarrollo
├── pages/           # Páginas de la aplicación
│   ├── student/    # Páginas de estudiante
│   └── teacher/    # Páginas de docente
├── routes/          # Configuración de rutas
├── services/        # Servicios de API (con toggle mock/real)
└── utils/           # Utilidades y constantes
```

## 🔐 Usuarios de Prueba (Modo Mock)

### Estudiante
- **Email:** alumno@unsa.edu.pe
- **Password:** 123456
- **Acceso a:**
  - Ver horario
  - Ver notas
  - Matrícula de laboratorios

### Docente
- **Email:** docente@unsa.edu.pe
- **Password:** 123456
- **Acceso a:**
  - Tomar asistencia
  - Ingresar notas y estadísticas
  - Ver horario
  - Reserva de ambientes

## 🛠️ Tecnologías Utilizadas

- **React 18** - Librería UI
- **Vite** - Build tool
- **React Router v6** - Enrutamiento
- **React Query (TanStack Query)** - Manejo de estado del servidor
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Estilos
- **Lucide React** - Iconos

## 🎯 Funcionalidades Implementadas

### Módulo Estudiante ✅
- [x] Ver horario semanal
- [x] Ver notas y evaluaciones
- [x] Matrícula a laboratorios
- [x] Dashboard con resumen

### Módulo Docente ✅
- [x] Tomar asistencia
- [x] Ingresar notas
- [x] Ver estadísticas (promedio, máximo, mínimo)
- [x] Ver horario
- [x] Reserva de ambientes

## 🔄 Cambiar de Modo Mock a API Real

### Paso 1: Actualizar `.env`
```env
VITE_USE_MOCK_DATA=false
VITE_API_BASE_URL=https://tu-backend.com/api
```

### Paso 2: Verificar Endpoints
Los endpoints ya están configurados en `src/api/endpoints.js`. Ajusta si es necesario.

### Paso 3: Actualizar Servicios (si necesario)
Los servicios en `src/services/` ya tienen la lógica para cambiar entre mock y real:

```javascript
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

async getSchedule() {
  if (USE_MOCK) {
    return mockGetSchedule();
  }
  return await axiosClient.get(ENDPOINTS.STUDENT.SCHEDULE);
}
```

## 📝 Crear Nuevas Páginas

### 1. Crear el componente de página

```jsx
// src/pages/student/NewPage.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';

const NewPage = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['key'],
    queryFn: () => Service.getData(),
  });

  return <div>Tu contenido</div>;
};

export default NewPage;
```

### 2. Agregar la ruta

```jsx
// src/routes/AppRoutes.jsx
<Route
  path="/student/new-page"
  element={
    <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
      <Layout>
        <NewPage />
      </Layout>
    </ProtectedRoute>
  }
/>
```

### 3. Agregar al menú (si aplica)

```jsx
// src/components/shared/Navbar.jsx
const menuItems = [
  // ... otros items
  { path: '/student/new-page', label: 'Nueva Página', icon: Icon },
];
```

## 🎨 Guía de Estilos

### Clases Utilitarias Personalizadas

```jsx
// Botones
<button className="btn-primary">Primario</button>
<button className="btn-secondary">Secundario</button>
<button className="btn-danger">Peligro</button>

// Cards
<div className="card">Contenido</div>

// Badges
<span className="badge badge-success">Éxito</span>
<span className="badge badge-warning">Advertencia</span>
<span className="badge badge-danger">Error</span>
```

## 🔍 React Query DevTools

En modo desarrollo, las DevTools están activadas. Presiona el ícono flotante en la esquina inferior para abrir.

## 🐛 Debugging

### Ver datos mock activos
```javascript
console.log('Usando mocks:', import.meta.env.VITE_USE_MOCK_DATA);
```

### Verificar autenticación
```javascript
import AuthService from './services/auth.service';
console.log('Usuario actual:', AuthService.getCurrentUser());
```

## 📦 Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run preview    # Preview del build
npm run lint       # Linter
```

## 🚧 Próximos Pasos

1. ✅ Estructura base del proyecto
2. ✅ Sistema de autenticación
3. ✅ Módulo de estudiante (horario, notas, labs)
4. ✅ Módulo de docente (asistencia, notas, reservas)
5. ⏳ Integración con backend real
6. ⏳ Testing (opcional)
7. ⏳ Despliegue

## 📞 Soporte

Para preguntas o problemas, contactar al equipo de desarrollo.

---

**Desarrollado para:** Universidad Nacional de San Agustín  
**Curso:** Trabajo Interdisciplinar II  
**Año:** 2024