# Finanzio — Frontend

Aplicación web de gestión de finanzas personales desarrollada en **Next.js 14** con TypeScript y Tailwind CSS.

---

## Stack tecnológico

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Estado global:** Zustand
- **Gráficos:** Recharts
- **Iconos:** Lucide React
- **Notificaciones:** React Hot Toast

---

## Requisitos previos

- [Node.js 18+](https://nodejs.org/)
- El backend de Finanzio corriendo en `http://localhost:7232`

---

## Instalación y configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd gestorFinanzas
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Creá un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:7232/api
```

### 4. Correr el proyecto

```bash
npm run dev
```

La app queda disponible en `http://localhost:3000`.

---

## Estructura del proyecto

```
app/
├── (dashboard)/               # Rutas protegidas (requieren auth)
│   ├── layout.tsx             # Layout con Sidebar
│   ├── dashboard/
│   │   └── page.tsx           # Dashboard con totales y últimos movimientos
│   ├── movimientos/
│   │   └── page.tsx           # CRUD de movimientos con filtros
│   ├── categorias/
│   │   └── page.tsx           # CRUD de categorías
│   ├── reportes/
│   │   └── page.tsx           # Gráfico ingresos vs gastos por mes
│   └── metas/
│       └── page.tsx           # CRUD de metas con progreso
├── login/
│   └── page.tsx               # Login y registro
├── components/
│   ├── Sidebar.tsx            # Navegación lateral + logout
│   └── Topbar.tsx             # Barra superior + modal nuevo movimiento
├── store/
│   ├── useFinanzasStore.ts    # Estado global: movimientos, categorías, metas
│   └── useAuthStore.ts        # Estado global: auth, token, usuario
lib/
└── categoryConfig.ts          # Configuración compartida de categorías e iconos
middleware.ts                  # Protección de rutas con JWT
```

---

## Funcionalidades

### Dashboard
- Balance total, ingresos y gastos del mes actual calculados desde movimientos reales
- Últimos 4 movimientos
- Distribución de gastos por categoría con barras de progreso

### Movimientos
- Listado con filtro por tipo (todos / ingresos / gastos)
- Crear, editar y eliminar movimientos con confirmación
- Campos: tipo, descripción, monto, categoría, fecha

### Categorías
- Crear, editar y eliminar categorías personalizadas
- Selector de ícono y color

### Reportes
- Gráfico de barras (Recharts) con ingresos vs gastos por mes
- Resumen anual dinámico: total ingresos, gastos y ahorro neto
- Año calculado automáticamente desde los datos reales

### Metas
- Crear, editar y eliminar metas de ahorro con confirmación
- Barra de progreso visual
- Campos: nombre, monto objetivo, monto actual, fecha límite, ícono y color

### Autenticación
- Login y registro con validaciones en tiempo real
- Token JWT almacenado en localStorage y cookie
- Middleware de Next.js que protege todas las rutas del dashboard
- Logout desde el sidebar

---

## Estado global (Zustand)

### `useAuthStore`

| Estado / Acción | Descripción |
|---|---|
| `token` | JWT del usuario autenticado |
| `usuario` | `{ nombre, email }` |
| `initAuth()` | Recupera sesión desde localStorage |
| `login(email, password)` | Llama a `/api/auth/login` |
| `register(nombre, email, password)` | Llama a `/api/auth/register` |
| `logout()` | Limpia token y redirige a `/login` |

### `useFinanzasStore`

| Estado / Acción | Descripción |
|---|---|
| `movimientos` | Lista de movimientos |
| `categorias` | Lista de categorías |
| `metas` | Lista de metas |
| `loading` | Estado de carga global |
| `fetch*()` | Carga datos desde la API |
| `add*()` | Crea un registro nuevo |
| `update*()` | Edita un registro existente |
| `remove*()` | Elimina un registro |

Todos los fetch incluyen el header `Authorization: Bearer <token>` automáticamente. Los errores se notifican con toasts.

---

## Autenticación y rutas protegidas

El archivo `middleware.ts` intercepta todas las rutas del dashboard. Si no hay cookie `token`, redirige a `/login`. Si hay token y se intenta acceder a `/login`, redirige al dashboard.

```
/login          → público
/dashboard      → requiere token
/movimientos    → requiere token
/categorias     → requiere token
/reportes       → requiere token
/metas          → requiere token
```

---

## Validaciones del formulario de auth

| Campo | Regla |
|---|---|
| Nombre | Mínimo 2 caracteres (solo en registro) |
| Email | Formato válido (regex) |
| Contraseña | Mínimo 6 caracteres |

Los errores se muestran por campo con borde rojo y se limpian al corregir.