# Guía de Implementación: App React del Portafolio con CSS puro

> Consume la **API del portafolio** de `guia-nodejs-express-prisma-swagger.md` (Proyectos · Tecnologías · Mensajes)
>
> Stack: React 19 · Vite 8 · TypeScript · React Router 7 · React Hook Form · Axios · **CSS puro** (variables, BEM, Grid y Flexbox)

Es la misma app que `guia-react-gestion-proyectos.md`, pero **sin Tailwind**: los estilos se escriben en archivos `.css`, igual que en las sesiones 1, 2 y 3 del curso. La lógica (services, hooks, rutas, formularios) es idéntica.

---

## Tabla de Contenidos

0. [Tailwind vs CSS puro: qué cambia](#0-tailwind-vs-css-puro-qué-cambia)
1. [Requisitos previos](#1-requisitos-previos)
2. [Inicialización del proyecto](#2-inicialización-del-proyecto)
3. [Estructura de carpetas](#3-estructura-de-carpetas)
4. [Cómo se organiza el CSS](#4-cómo-se-organiza-el-css)
5. [Estilos globales — `index.css`](#5-estilos-globales--indexcss)
6. [Interfaces TypeScript](#6-interfaces-typescript)
7. [Etiquetas y constantes](#7-etiquetas-y-constantes)
8. [Configuración de Axios](#8-configuración-de-axios)
9. [Services por entidad](#9-services-por-entidad)
10. [Sesión de administrador (Context)](#10-sesión-de-administrador-context)
11. [Custom Hooks de datos](#11-custom-hooks-de-datos)
12. [Componentes de UI](#12-componentes-de-ui)
13. [Layout](#13-layout)
14. [Componentes del portafolio](#14-componentes-del-portafolio)
15. [Formularios](#15-formularios)
16. [Tablas del panel](#16-tablas-del-panel)
17. [Páginas públicas](#17-páginas-públicas)
18. [Panel de administración](#18-panel-de-administración)
19. [Rutas y punto de entrada](#19-rutas-y-punto-de-entrada)
20. [Variables de entorno](#20-variables-de-entorno)
21. [Ejecución y prueba](#21-ejecución-y-prueba)
22. [Ejercicios propuestos](#22-ejercicios-propuestos)

---

## 0. Tailwind vs CSS puro: qué cambia

| | Versión Tailwind | Esta versión (CSS puro) |
|---|---|---|
| Dónde están los estilos | En el `className` del JSX: `className="px-4 py-2 rounded-xl bg-indigo-600"` | En archivos `.css`: `className="btn btn--primary"` |
| Nombres de clases | Utilidades de Tailwind | **BEM** (`bloque__elemento--modificador`), como en la sesión 2 |
| Colores y medidas | Paleta de Tailwind (`indigo-600`) | **Variables CSS** (`var(--accent)`), las mismas de `sesion3.css` |
| Instalación | `tailwindcss` + `@tailwindcss/vite` | Nada extra: Vite ya entiende `import './Button.css'` |
| Clases según datos | Hay que escribirlas completas (`COLOR_CATEGORIA`) porque Tailwind busca el texto en el código | Se pueden armar: `` `badge--${categoria.toLowerCase()}` `` |
| Estado activo | `className={({ isActive }) => …}` en `NavLink` | `NavLink` agrega la clase `active` sola: `.navbar__enlace.active { … }` |
| Tamaño del CSS final | ~27 kB | ~14 kB (solo lo que escribimos) |

Archivos que **no cambian** respecto de la versión Tailwind: interfaces, services, `axiosInstance`, contexto, hooks, `RequireAdmin`, `AppRouter`, `App.tsx` y `main.tsx`. Cambian todos los componentes y páginas (solo su `className` y el `import` de su CSS) y `utils/etiquetas.ts` (se quita `COLOR_CATEGORIA`).

---

## 1. Requisitos previos

| Herramienta | Versión | Verificar con |
|---|---|---|
| Node.js | **20.19 o superior** (recomendado 22 LTS) | `node -v` |
| API del portafolio | Corriendo en `http://localhost:3000` | Abrir `http://localhost:3000/health` |

> La API debe tener `http://localhost:5173` en `CORS_ORIGIN` (su `.env`). Si no, el navegador bloquea las peticiones de React.

---

## 2. Inicialización del proyecto

```bash
# Crear el proyecto con Vite + React + TypeScript
npm create vite@9.3.1 portafolio-app -- --template react-ts
cd portafolio-app
npm install

# Dependencias de la app (sin Tailwind)
npm install axios@1.20.0 react-router-dom@7.18.4 react-hook-form@7.90.0 lucide-react@1.61.0

# Borrar los archivos de ejemplo de Vite
rm src/App.css
rm -r src/assets
```

| Paquete | Rol |
|---|---|
| `axios` | Cliente HTTP para llamar a la API |
| `react-router-dom` | Rutas: varias "páginas" dentro de la misma app |
| `react-hook-form` | Formularios con validación |
| `lucide-react` | Íconos como componentes (`<Mail />`, `<Lock />`…). La versión 1.x no trae íconos de marcas (`Github`): se usa `CodeXml` |

`vite.config.ts` queda como lo crea la plantilla (solo el plugin de React):

```typescript
// vite.config.ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
});
```

`index.html`, con idioma y título:

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Portafolio de Hebert Cussi, Desarrollador Full Stack." />
    <title>Hebert Cussi – Desarrollador Full Stack</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 3. Estructura de carpetas

Cada componente tiene su `.css` **al lado** de su `.tsx`:

```
src/
├── api/axiosInstance.ts
├── interfaces/              Proyecto.ts · Tecnologia.ts · Mensaje.ts
├── utils/etiquetas.ts
├── services/                proyectoService.ts · tecnologiaService.ts · mensajeService.ts
├── context/                 adminContext.ts · AdminProvider.tsx
├── hooks/                   useAdmin · useProyectos · useTecnologias · useMensajes · usePaginacion
├── components/
│   ├── layout/
│   │   ├── Layout.tsx  + Layout.css        ← también estilos de Navbar y Footer
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── AdminLayout.tsx + AdminLayout.css
│   ├── ui/
│   │   ├── Button.tsx      + Button.css
│   │   ├── Modal.tsx       + Modal.css
│   │   ├── Badge.tsx       + Badge.css
│   │   ├── EstadoCarga.tsx + EstadoCarga.css
│   │   └── Pagination.tsx  + Pagination.css
│   ├── portafolio/
│   │   ├── ProyectoCard.tsx + ProyectoCard.css
│   │   └── Habilidades.tsx  + Habilidades.css
│   ├── forms/
│   │   ├── Formulario.css                  ← compartido por los 3 formularios
│   │   ├── ProyectoForm.tsx
│   │   ├── TecnologiaForm.tsx
│   │   └── ContactoForm.tsx
│   └── tables/
│       ├── Tablas.css                      ← compartido por las 3 tablas
│       ├── ProyectosTable.tsx
│       ├── TecnologiasTable.tsx
│       └── MensajesTable.tsx
├── pages/
│   ├── InicioPage.tsx          + InicioPage.css
│   ├── ProyectosPage.tsx       + ProyectosPage.css
│   ├── ProyectoDetallePage.tsx + ProyectoDetallePage.css
│   ├── ContactoPage.tsx        + ContactoPage.css
│   ├── NotFoundPage.tsx        + NotFoundPage.css
│   └── admin/
│       ├── LoginPage.tsx + LoginPage.css
│       ├── AdminProyectosPage.tsx
│       ├── AdminTecnologiasPage.tsx
│       └── AdminMensajesPage.tsx
├── router/                  AppRouter.tsx · RequireAdmin.tsx
├── App.tsx
├── index.css                ← variables, reset y clases globales
└── main.tsx
```

---

## 4. Cómo se organiza el CSS

### 4.1 Importar CSS desde un componente

```tsx
import './Button.css';
```

Vite junta todos los `.css` importados en **un solo archivo** al compilar. El CSS se carga junto con el componente que lo usa.

> ⚠️ **Importar un CSS desde un componente no lo hace "privado".** Todas las clases son **globales**: un `.titulo` en `InicioPage.css` afecta a cualquier `.titulo` de la app. Por eso se usa **BEM**: cada clase lleva el nombre de su bloque (`.hero__titulo`, `.modal__titulo`) y no choca con las demás.

### 4.2 BEM (repaso de la sesión 2)

| Parte | Sintaxis | Ejemplo |
|---|---|---|
| **B**loque | `.bloque` | `.proyecto-card` |
| **E**lemento (parte del bloque) | `.bloque__elemento` | `.proyecto-card__titulo` |
| **M**odificador (variante) | `.bloque--modificador` | `.btn--danger`, `.badge--frontend` |

En React, el modificador se elige con una expresión:

```tsx
<button className={`btn btn--${variant}`}>              // btn btn--primary
<li className={m.leido ? 'mensaje' : 'mensaje mensaje--nuevo'}>
```

### 4.3 Estilos a partir de atributos

En lugar de agregar una clase "activa" desde React, varias reglas usan el **atributo que ya existe** por accesibilidad:

| Selector | Se activa cuando… |
|---|---|
| `.navbar__enlace.active` | `NavLink` agrega la clase `active` a la ruta actual |
| `.filtro[aria-pressed='true']` | El botón de filtro está seleccionado |
| `.paginacion__boton[aria-current='page']` | Es la página actual |
| `.opcion:has(input:checked)` | El checkbox de adentro está marcado |

Así el estilo y lo que anuncia el lector de pantalla **nunca se contradicen**.

### 4.4 ¿Y CSS Modules?

Vite también soporta **CSS Modules** (`Button.module.css` + `import styles from './Button.module.css'` + `className={styles.btn}`), que hacen las clases **locales** de verdad. Esta guía usa CSS normal con BEM para seguir lo visto en el curso; el ejercicio 1 propone pasar un componente a CSS Modules.

---

## 5. Estilos globales — `index.css`

Variables, reset y clases que se usan en varios componentes. Los colores son los de `ejemplos/assets/css/sesion3.css`.

```css
/* src/index.css — estilos globales: variables, reset y clases reutilizables */

/* ============================================================ */
/* 1. VARIABLES (las mismas del portafolio de la sesión 3)       */
/* ============================================================ */
:root {
  /* Colores */
  --bg-primary:     #f8fafc;
  --bg-secondary:   #ffffff;
  --bg-tertiary:    #eef2ff;
  --bg-hover:       #f1f5f9;
  --text-primary:   #1f2937;
  --text-secondary: #4b5563;
  --text-muted:     #9ca3af;
  --accent:         #6366f1;
  --accent-hover:   #4f46e5;
  --accent-light:   #e0e7ff;
  --accent-2:       #a855f7;
  --border:         #e5e7eb;
  --danger:         #dc2626;
  --danger-hover:   #b91c1c;
  --danger-light:   #fef2f2;
  --success:        #15803d;
  --success-light:  #f0fdf4;
  --star:           #fbbf24;

  /* Formas */
  --radius:      16px;
  --radius-sm:   8px;
  --card-shadow: 0 4px 24px -4px rgba(99, 102, 241, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04);
  --transition:  all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  /* Tipografía y tamaños */
  --font-body: system-ui, 'Segoe UI', Roboto, sans-serif;
  --container: 72rem;
}

/* ============================================================ */
/* 2. RESET                                                     */
/* ============================================================ */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-body);
  line-height: 1.6;
}

img, svg { display: block; max-width: 100%; }
ul { list-style: none; }
a { color: inherit; text-decoration: none; }

/* Los controles de formulario no heredan la fuente por defecto */
button, input, select, textarea { font: inherit; color: inherit; }

/* Anillo de foco visible al navegar con el teclado */
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

/* ============================================================ */
/* 3. CLASES REUTILIZABLES                                      */
/* ============================================================ */
.contenedor {
  width: 100%;
  max-width: var(--container);
  margin-inline: auto;
  padding-inline: 1rem;
}

/* Texto con degradado (logo y nombre del hero) */
.texto-gradiente {
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* Grilla de tarjetas: tantas columnas de mínimo 18rem como entren */
.grid-tarjetas {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 18rem), 1fr));
}

/* Caja blanca con borde y sombra */
.tarjeta {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--card-shadow);
}

.encabezado-pagina { display: grid; gap: 0.5rem; margin-bottom: 2rem; }
.encabezado-pagina h1 { font-size: 1.875rem; font-weight: 800; }
.encabezado-pagina p { color: var(--text-secondary); }

.seccion { display: grid; gap: 1.5rem; }
.seccion__titulo { font-size: 1.5rem; font-weight: 700; }

.texto-suave { color: var(--text-secondary); font-size: 0.875rem; }

.enlace { color: var(--accent); }
.enlace:hover { text-decoration: underline; }

.lista-etiquetas { display: flex; flex-wrap: wrap; gap: 0.375rem; }

/* Estrella de "destacado": fill pinta el interior del ícono SVG */
.icono-destacado { color: var(--star); fill: var(--star); flex-shrink: 0; }

/* Mensajes de error y de éxito */
.alerta {
  border-radius: 12px;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
}
.alerta--error { background: var(--danger-light); color: var(--danger); border: 1px solid #fecaca; }
.alerta--ok    { background: var(--success-light); color: var(--success); }

/* Checkbox y range con el color de la marca */
input[type='checkbox'], input[type='range'] { accent-color: var(--accent); }

/* Checkbox con su texto al lado */
.casilla { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; cursor: pointer; }
```

| Clase global | Dónde se usa |
|---|---|
| `.contenedor` | Navbar, contenido principal y footer: ancho máximo centrado |
| `.tarjeta` | Tarjetas de proyecto, habilidades, tablas, login, formulario de contacto |
| `.grid-tarjetas` | Grilla de proyectos (Inicio y Proyectos) |
| `.texto-gradiente` | Logo y nombre del hero |
| `.alerta--error` / `.alerta--ok` | Errores de la API y mensaje de envío exitoso |

`minmax(min(100%, 18rem), 1fr)`: cada columna mide **al menos 18rem**, salvo que la pantalla sea más angosta; ahí `min(100%, 18rem)` usa el 100% y se evita el scroll horizontal en celulares.

---

## 6. Interfaces TypeScript

Describen la forma exacta de lo que devuelve y recibe la API.

```typescript
// src/interfaces/Tecnologia.ts
export type AreaTecnologia = 'FRONTEND' | 'BACKEND' | 'BASE_DATOS' | 'HERRAMIENTA';

export interface Tecnologia {
  id: number;
  nombre: string;
  area: AreaTecnologia;
  _count?: { proyectos: number };   // solo viene en GET /tecnologias
}

export interface TecnologiaDTO {
  nombre: string;
  area: AreaTecnologia;
}
```

```typescript
// src/interfaces/Proyecto.ts
import type { Tecnologia } from './Tecnologia';

export type Categoria = 'FRONTEND' | 'BACKEND' | 'FULLSTACK';

export interface Proyecto {
  id: number;
  titulo: string;
  descripcion: string;
  emoji: string;
  categoria: Categoria;
  urlDemo: string | null;
  urlRepo: string | null;
  destacado: boolean;
  creadoEn: string;
  actualizadoEn: string;
  tecnologias: Omit<Tecnologia, '_count'>[];
}

// Lo que se envía en POST y PUT
export interface ProyectoDTO {
  titulo: string;
  descripcion: string;
  emoji?: string;
  categoria: Categoria;
  urlDemo?: string;
  urlRepo?: string;
  destacado?: boolean;
  tecnologiaIds?: number[];
}

// Query params de GET /proyectos
export interface FiltrosProyecto {
  categoria?: Categoria;
  tecnologia?: string;
  destacado?: boolean;
}
```

```typescript
// src/interfaces/Mensaje.ts
export interface Mensaje {
  id: number;
  nombre: string;
  email: string;
  servicio: string | null;
  presupuesto: number | null;
  fecha: string | null;
  mensaje: string;
  leido: boolean;
  creadoEn: string;
}

// Lo que envía el formulario de contacto
export interface MensajeDTO {
  nombre: string;
  email: string;
  servicio?: string;
  presupuesto?: number;
  fecha?: string;
  mensaje: string;
}

// Respuesta de POST /mensajes
export interface MensajeEnviado {
  id: number;
  mensaje: string;
}
```

| Concepto | Explicación |
|---|---|
| `type Categoria = 'FRONTEND' \| 'BACKEND' \| 'FULLSTACK'` | **Unión de literales**. Se usa en lugar de `enum` porque la plantilla activa `erasableSyntaxOnly`, que no permite `enum`. |
| `string \| null` | La API devuelve `null` en los campos opcionales vacíos. |
| `Omit<Tecnologia, '_count'>` | El mismo tipo **sin** `_count` (dentro de un proyecto no viene). |
| Interfaz `…DTO` | Lo que se **envía** a la API (sin `id` ni fechas, que los genera el servidor). |

---

## 7. Etiquetas y constantes

```typescript
// src/utils/etiquetas.ts
import type { Categoria } from '../interfaces/Proyecto';
import type { AreaTecnologia } from '../interfaces/Tecnologia';

// Texto que se muestra en pantalla para cada valor del enum de la API
export const CATEGORIAS: Record<Categoria, string> = {
  FRONTEND: 'Front-End',
  BACKEND: 'Back-End',
  FULLSTACK: 'Full Stack',
};

export const AREAS: Record<AreaTecnologia, string> = {
  FRONTEND: 'Front-End',
  BACKEND: 'Back-End',
  BASE_DATOS: 'Bases de Datos',
  HERRAMIENTA: 'Herramientas',
};

// Mismas opciones que el <datalist> del portafolio de la sesión 3
export const SERVICIOS = [
  'Desarrollo Web Full Stack',
  'API REST / Back-End',
  'Diseño UI / Front-End',
  'Base de Datos',
  'Consultoría Técnica',
];

// Object.keys devuelve string[]; el "as" le dice a TypeScript qué claves son
export const LISTA_CATEGORIAS = Object.keys(CATEGORIAS) as Categoria[];
export const LISTA_AREAS = Object.keys(AREAS) as AreaTecnologia[];
```

- `Record<Categoria, string>` obliga a escribir un texto para **cada** categoría.
- A diferencia de la versión Tailwind, aquí no hace falta un mapa de colores: el color sale del modificador `badge--frontend`, `badge--backend`… definido en `Badge.css`.

---

## 8. Configuración de Axios

```typescript
// src/api/axiosInstance.ts
import axios from 'axios';

// Nombre con el que se guarda la clave de administrador en sessionStorage
export const CLAVE_ADMIN = 'portafolio-admin-key';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api',
  timeout: 10000,
});

// Antes de cada petición: si hay clave de admin guardada, se envía en el header x-api-key
axiosInstance.interceptors.request.use((config) => {
  const clave = sessionStorage.getItem(CLAVE_ADMIN);
  if (clave) config.headers['x-api-key'] = clave;
  return config;
});

// Después de cada respuesta con error: se arma un mensaje legible para mostrar en pantalla
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;
    const mensaje =
      data?.detalles?.join(', ') ||   // 400 de validación: lista de errores
      data?.error ||                  // 401, 404, 409...
      'No se pudo conectar con la API';
    return Promise.reject(new Error(mensaje));
  },
);

export default axiosInstance;
```

| Parte | Qué hace |
|---|---|
| `import.meta.env.VITE_API_URL` | URL de la API desde el `.env` (sección 20). |
| `interceptors.request` | Antes de cada petición, si hay sesión de admin, agrega el header `x-api-key`. |
| `interceptors.response` | Convierte `{ error, detalles: [...] }` de la API en un `Error` con un mensaje listo para mostrar. |
| `sessionStorage` | Como `localStorage`, pero se borra al **cerrar la pestaña**. |

> ⚠️ Cualquier script de la página puede leer `sessionStorage`. Es suficiente para un portafolio personal; una app con muchos usuarios usaría JWT en una cookie `httpOnly`.

---

## 9. Services por entidad

Los componentes **nunca** usan Axios directamente; llaman a estos services.

```typescript
// src/services/proyectoService.ts
import axiosInstance from '../api/axiosInstance';
import type { FiltrosProyecto, Proyecto, ProyectoDTO } from '../interfaces/Proyecto';

export const proyectoService = {
  getAll: async (filtros?: FiltrosProyecto): Promise<Proyecto[]> => {
    // params → /proyectos?categoria=FRONTEND&destacado=true (axios omite los undefined)
    const { data } = await axiosInstance.get<Proyecto[]>('/proyectos', { params: filtros });
    return data;
  },

  getById: async (id: number): Promise<Proyecto> => {
    const { data } = await axiosInstance.get<Proyecto>(`/proyectos/${id}`);
    return data;
  },

  create: async (payload: ProyectoDTO): Promise<Proyecto> => {
    const { data } = await axiosInstance.post<Proyecto>('/proyectos', payload);
    return data;
  },

  update: async (id: number, payload: ProyectoDTO): Promise<Proyecto> => {
    const { data } = await axiosInstance.put<Proyecto>(`/proyectos/${id}`, payload);
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/proyectos/${id}`);
  },
};
```

```typescript
// src/services/tecnologiaService.ts
import axiosInstance from '../api/axiosInstance';
import type { AreaTecnologia, Tecnologia, TecnologiaDTO } from '../interfaces/Tecnologia';

export const tecnologiaService = {
  getAll: async (area?: AreaTecnologia): Promise<Tecnologia[]> => {
    const { data } = await axiosInstance.get<Tecnologia[]>('/tecnologias', { params: { area } });
    return data;
  },

  create: async (payload: TecnologiaDTO): Promise<Tecnologia> => {
    const { data } = await axiosInstance.post<Tecnologia>('/tecnologias', payload);
    return data;
  },

  update: async (id: number, payload: TecnologiaDTO): Promise<Tecnologia> => {
    const { data } = await axiosInstance.put<Tecnologia>(`/tecnologias/${id}`, payload);
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/tecnologias/${id}`);
  },
};
```

```typescript
// src/services/mensajeService.ts
import axiosInstance from '../api/axiosInstance';
import type { Mensaje, MensajeDTO, MensajeEnviado } from '../interfaces/Mensaje';

export const mensajeService = {
  // Público: formulario de contacto
  enviar: async (payload: MensajeDTO): Promise<MensajeEnviado> => {
    const { data } = await axiosInstance.post<MensajeEnviado>('/mensajes', payload);
    return data;
  },

  // Admin: bandeja de entrada (soloNuevos → ?leido=false)
  getAll: async (soloNuevos = false): Promise<Mensaje[]> => {
    const params = soloNuevos ? { leido: false } : undefined;
    const { data } = await axiosInstance.get<Mensaje[]>('/mensajes', { params });
    return data;
  },

  marcarLeido: async (id: number, leido: boolean): Promise<Mensaje> => {
    const { data } = await axiosInstance.patch<Mensaje>(`/mensajes/${id}`, { leido });
    return data;
  },

  remove: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/mensajes/${id}`);
  },
};
```

- `{ params: filtros }`: Axios arma el *query string* y **omite** las propiedades `undefined`.

---

## 10. Sesión de administrador (Context)

```typescript
// src/context/adminContext.ts
import { createContext } from 'react';

export interface AdminContextValue {
  esAdmin: boolean;
  ingresar: (clave: string) => Promise<void>;
  salir: () => void;
}

// null por defecto: si un componente usa el contexto fuera del Provider, useAdmin() avisa
export const AdminContext = createContext<AdminContextValue | null>(null);
```

```tsx
// src/context/AdminProvider.tsx
import { useState, type ReactNode } from 'react';
import { CLAVE_ADMIN } from '../api/axiosInstance';
import { mensajeService } from '../services/mensajeService';
import { AdminContext } from './adminContext';

export default function AdminProvider({ children }: { children: ReactNode }) {
  // Si la pestaña se recarga, la sesión sigue activa mientras la clave esté en sessionStorage
  const [esAdmin, setEsAdmin] = useState(() => sessionStorage.getItem(CLAVE_ADMIN) !== null);

  const ingresar = async (clave: string) => {
    sessionStorage.setItem(CLAVE_ADMIN, clave);
    try {
      // GET /mensajes es una ruta protegida: si responde bien, la clave es correcta
      await mensajeService.getAll();
      setEsAdmin(true);
    } catch (err) {
      sessionStorage.removeItem(CLAVE_ADMIN);
      throw err;
    }
  };

  const salir = () => {
    sessionStorage.removeItem(CLAVE_ADMIN);
    setEsAdmin(false);
  };

  return <AdminContext value={{ esAdmin, ingresar, salir }}>{children}</AdminContext>;
}
```

```typescript
// src/hooks/useAdmin.ts
import { useContext } from 'react';
import { AdminContext } from '../context/adminContext';

export const useAdmin = () => {
  const contexto = useContext(AdminContext);
  if (!contexto) throw new Error('useAdmin debe usarse dentro de <AdminProvider>');
  return contexto;
};
```

| Concepto | Explicación |
|---|---|
| `createContext` | Comparte datos con todos los componentes de adentro sin pasarlos por *props*. |
| `<AdminContext value={…}>` | En **React 19** el contexto se usa directamente como proveedor (antes `<AdminContext.Provider>`). |
| `ingresar` | No hay endpoint de login: se guarda la clave y se prueba con `GET /mensajes` (ruta protegida). Si responde 401, se borra. |
| Tres archivos | Para que la recarga en caliente de Vite (*Fast Refresh*) funcione bien, un `.tsx` debe exportar solo componentes. |

---

## 11. Custom Hooks de datos

```typescript
// src/hooks/useProyectos.ts
import { useEffect, useState } from 'react';
import { proyectoService } from '../services/proyectoService';
import type { FiltrosProyecto, Proyecto, ProyectoDTO } from '../interfaces/Proyecto';

export const useProyectos = (filtros: FiltrosProyecto = {}) => {
  const { categoria, tecnologia, destacado } = filtros;
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cargadoPara, setCargadoPara] = useState<string | null>(null);

  // Identifica la combinación de filtros actual
  const clave = `${categoria}|${tecnologia}|${destacado}`;

  useEffect(() => {
    let cancelado = false;   // si cambian los filtros antes de que llegue la respuesta, se ignora

    proyectoService
      .getAll({ categoria, tecnologia, destacado })
      .then((datos) => {
        if (cancelado) return;
        setProyectos(datos);
        setError(null);
      })
      .catch((err: Error) => { if (!cancelado) setError(err.message); })
      .finally(() => { if (!cancelado) setCargadoPara(clave); });

    return () => { cancelado = true; };
  }, [categoria, tecnologia, destacado, clave]);

  // Está cargando mientras los datos no corresponden a los filtros actuales
  const loading = cargadoPara !== clave;

  const crear = async (payload: ProyectoDTO) => {
    const nuevo = await proyectoService.create(payload);
    setProyectos((prev) => [nuevo, ...prev]);
  };

  const actualizar = async (id: number, payload: ProyectoDTO) => {
    const actualizado = await proyectoService.update(id, payload);
    setProyectos((prev) => prev.map((p) => (p.id === id ? actualizado : p)));
  };

  const eliminar = async (id: number) => {
    await proyectoService.remove(id);
    setProyectos((prev) => prev.filter((p) => p.id !== id));
  };

  return { proyectos, loading, error, crear, actualizar, eliminar };
};
```

**¿Por qué `cancelado` y `cargadoPara`?** Si se hace clic en "Front-End" y enseguida en "Back-End", salen dos peticiones. Si la primera llega **después**, mostraría proyectos Front-End con "Back-End" seleccionado. La función de limpieza del efecto (`cancelado = true`) hace que esa respuesta vieja se ignore, y `loading` se **calcula** comparando para qué filtros son los datos actuales.

| Función | Cómo cambia la lista sin volver a pedirla |
|---|---|
| `crear` | `[nuevo, ...prev]` |
| `actualizar` | `prev.map(…)`: reemplaza solo el que cambió |
| `eliminar` | `prev.filter(…)`: lo quita |

```typescript
// src/hooks/useTecnologias.ts
import { useEffect, useState } from 'react';
import { tecnologiaService } from '../services/tecnologiaService';
import type { Tecnologia, TecnologiaDTO } from '../interfaces/Tecnologia';

export const useTecnologias = () => {
  const [tecnologias, setTecnologias] = useState<Tecnologia[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelado = false;

    tecnologiaService
      .getAll()
      .then((datos) => { if (!cancelado) setTecnologias(datos); })
      .catch((err: Error) => { if (!cancelado) setError(err.message); })
      .finally(() => { if (!cancelado) setLoading(false); });

    return () => { cancelado = true; };
  }, []);

  const crear = async (payload: TecnologiaDTO) => {
    const nueva = await tecnologiaService.create(payload);
    setTecnologias((prev) => [...prev, { ...nueva, _count: { proyectos: 0 } }]);
  };

  const actualizar = async (id: number, payload: TecnologiaDTO) => {
    const actualizada = await tecnologiaService.update(id, payload);
    // Se conserva _count, porque PUT no lo devuelve
    setTecnologias((prev) => prev.map((t) => (t.id === id ? { ...t, ...actualizada } : t)));
  };

  const eliminar = async (id: number) => {
    await tecnologiaService.remove(id);
    setTecnologias((prev) => prev.filter((t) => t.id !== id));
  };

  return { tecnologias, loading, error, crear, actualizar, eliminar };
};
```

```typescript
// src/hooks/useMensajes.ts
import { useEffect, useState } from 'react';
import { mensajeService } from '../services/mensajeService';
import type { Mensaje } from '../interfaces/Mensaje';

export const useMensajes = (soloNuevos: boolean) => {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cargadoPara, setCargadoPara] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelado = false;

    mensajeService
      .getAll(soloNuevos)
      .then((datos) => {
        if (cancelado) return;
        setMensajes(datos);
        setError(null);
      })
      .catch((err: Error) => { if (!cancelado) setError(err.message); })
      .finally(() => { if (!cancelado) setCargadoPara(soloNuevos); });

    return () => { cancelado = true; };
  }, [soloNuevos]);

  const loading = cargadoPara !== soloNuevos;

  const cambiarLeido = async (id: number, leido: boolean) => {
    const actualizado = await mensajeService.marcarLeido(id, leido);
    setMensajes((prev) =>
      soloNuevos && leido
        ? prev.filter((m) => m.id !== id)                       // ya no es "nuevo": sale de la lista
        : prev.map((m) => (m.id === id ? actualizado : m)),
    );
  };

  const eliminar = async (id: number) => {
    await mensajeService.remove(id);
    setMensajes((prev) => prev.filter((m) => m.id !== id));
  };

  return { mensajes, loading, error, cambiarLeido, eliminar };
};
```

```typescript
// src/hooks/usePaginacion.ts
import { useMemo, useState } from 'react';

export function usePaginacion<T>(datos: T[], porPaginaInicial = 5) {
  const [porPagina, setPorPagina] = useState(porPaginaInicial);
  const [pagina, setPagina]       = useState(1);

  const totalPaginas = Math.max(1, Math.ceil(datos.length / porPagina));

  // Si se borran filas y la página actual queda vacía, se usa la última que existe
  const paginaActual = Math.min(pagina, totalPaginas);

  const datosPagina = useMemo(() => {
    const inicio = (paginaActual - 1) * porPagina;
    return datos.slice(inicio, inicio + porPagina);
  }, [datos, paginaActual, porPagina]);

  const irA = (p: number) => setPagina(Math.min(Math.max(1, p), totalPaginas));

  const cambiarPorPagina = (n: number) => {
    setPorPagina(n);
    setPagina(1);
  };

  return {
    datosPagina,
    paginaActual,
    totalPaginas,
    desde: datos.length === 0 ? 0 : (paginaActual - 1) * porPagina + 1,
    hasta: Math.min(paginaActual * porPagina, datos.length),
    total: datos.length,
    porPagina,
    irA,
    cambiarPorPagina,
  };
}
```

- Hook **genérico** (`<T>`): sirve para cualquier lista. La página actual se calcula con `Math.min` para que, si se borran filas, nunca quede en una página vacía.

---

## 12. Componentes de UI

### 12.1 Botón

```css
/* src/components/ui/Button.css — bloque "btn" con modificadores (BEM) */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid transparent;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.btn:disabled { opacity: 0.5; cursor: not-allowed; }

/* Variantes de color */
.btn--primary { background: var(--accent); color: #fff; }
.btn--primary:hover:not(:disabled) { background: var(--accent-hover); }

.btn--danger { background: var(--danger); color: #fff; }
.btn--danger:hover:not(:disabled) { background: var(--danger-hover); }

.btn--ghost { background: var(--bg-hover); color: var(--text-primary); }
.btn--ghost:hover:not(:disabled) { background: var(--border); }

.btn--contorno { background: transparent; border-color: var(--accent); color: var(--accent); }
.btn--contorno:hover { background: var(--bg-tertiary); }

.btn--oscuro { background: #1e293b; color: #fff; }
.btn--oscuro:hover { background: #0f172a; }

/* Variantes de tamaño */
.btn--grande { padding: 0.75rem 1.5rem; font-size: 1rem; }
.btn--bloque { width: 100%; }
```

```tsx
// src/components/ui/Button.tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import './Button.css';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'ghost';
  icon?: ReactNode;
}

export default function Button({ variant = 'primary', icon, children, className = '', ...props }: Props) {
  return (
    <button className={`btn btn--${variant} ${className}`} {...props}>
      {icon}
      {children}
    </button>
  );
}
```

- `` `btn btn--${variant}` ``: el modificador sale de la prop. `className` permite sumar otros modificadores desde afuera (`className="btn--bloque"`).
- `:hover:not(:disabled)`: el efecto hover no se aplica a un botón deshabilitado.
- `.btn--contorno`, `.btn--oscuro` y `.btn--grande` se usan en enlaces (`<Link className="btn btn--contorno">`), por eso la página que los usa también importa `Button.css`.

### 12.2 Modal

```css
/* src/components/ui/Modal.css */
.modal {
  position: fixed;
  inset: 0;                         /* top, right, bottom y left en 0: cubre toda la pantalla */
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.5);
}

.modal__caja {
  width: 100%;
  max-width: 32rem;
  max-height: 90vh;
  overflow-y: auto;                 /* si el formulario es largo, se desplaza dentro del modal */
  background: var(--bg-secondary);
  border-radius: var(--radius);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: modalEntrada 0.2s ease-out;
}

.modal__cabecera {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
}

.modal__titulo { font-size: 1.125rem; font-weight: 600; }

.modal__cerrar {
  border: none;
  background: none;
  color: var(--text-muted);
  cursor: pointer;
}
.modal__cerrar:hover { color: var(--text-primary); }

.modal__cuerpo { padding: 1.25rem 1.5rem; }

/* Separa el mensaje de error del formulario que viene debajo */
.modal__cuerpo > .alerta { margin-bottom: 1rem; }

@keyframes modalEntrada {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}
```

```tsx
// src/components/ui/Modal.tsx
import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import './Modal.css';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: Props) {
  // Cerrar con Escape (solo mientras el modal está abierto)
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="modal__caja"
        onClick={(e) => e.stopPropagation()}   // un clic dentro del modal no lo cierra
      >
        <div className="modal__cabecera">
          <h2 className="modal__titulo">{title}</h2>
          <button onClick={onClose} className="modal__cerrar" aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>
        <div className="modal__cuerpo">{children}</div>
      </div>
    </div>
  );
}
```

| Detalle | Para qué |
|---|---|
| `position: fixed; inset: 0` | El fondo oscuro cubre toda la pantalla, aunque se haya hecho scroll. |
| `max-height: 90vh; overflow-y: auto` | En celulares, el formulario largo se desplaza dentro del modal. |
| `@keyframes modalEntrada` | El modal aparece con un pequeño zoom (sesión 2). |
| `onClick={onClose}` + `e.stopPropagation()` | Clic **fuera** cierra; clic **dentro** no. |

### 12.3 Badge

```css
/* src/components/ui/Badge.css */
.badge {
  display: inline-block;
  padding: 0.125rem 0.625rem;
  border-radius: 999px;             /* número grande = forma de píldora */
  background: var(--bg-hover);
  color: #475569;
  font-size: 0.75rem;
  font-weight: 500;
}

/* Un modificador por categoría: badge--frontend, badge--backend, badge--fullstack */
.badge--frontend  { background: #e0f2fe; color: #0369a1; }
.badge--backend   { background: #fef3c7; color: #b45309; }
.badge--fullstack { background: #ede9fe; color: #6d28d9; }
```

```tsx
// src/components/ui/Badge.tsx
import type { ReactNode } from 'react';
import './Badge.css';

interface Props {
  children: ReactNode;
  variante?: string;   // por ejemplo "frontend" → clase badge--frontend
}

export default function Badge({ children, variante }: Props) {
  return <span className={variante ? `badge badge--${variante}` : 'badge'}>{children}</span>;
}
```

### 12.4 Estado de carga

```css
/* src/components/ui/EstadoCarga.css */
.estado-carga {
  display: grid;
  justify-items: center;
  gap: 0.75rem;
  padding: 3rem 0;
  color: var(--text-muted);
  text-align: center;
}

.estado-carga--cargando { animation: pulso 1.5s ease-in-out infinite; }

@keyframes pulso {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.4; }
}
```

```tsx
// src/components/ui/EstadoCarga.tsx
import type { LucideIcon } from 'lucide-react';
import './EstadoCarga.css';

interface Props {
  loading: boolean;
  error: string | null;
  vacio: boolean;
  icon: LucideIcon;
  textoVacio: string;
}

// Muestra "Cargando...", el error o el estado vacío. Si no aplica ninguno, no muestra nada.
export default function EstadoCarga({ loading, error, vacio, icon: Icon, textoVacio }: Props) {
  if (loading) {
    return <p className="estado-carga estado-carga--cargando">Cargando...</p>;
  }
  if (error) {
    return <p role="alert" className="alerta alerta--error">{error}</p>;
  }
  if (vacio) {
    return (
      <div className="estado-carga">
        <Icon size={32} />
        <p>{textoVacio}</p>
      </div>
    );
  }
  return null;
}
```

### 12.5 Paginación

```css
/* src/components/ui/Pagination.css */
.paginacion {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--border);
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.paginacion__info { display: flex; align-items: center; gap: 0.75rem; }

.paginacion__select {
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
}

.paginacion__botones { display: flex; gap: 0.25rem; }

.paginacion__boton {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  cursor: pointer;
}
.paginacion__boton:hover:not(:disabled) { background: var(--bg-hover); }
.paginacion__boton:disabled { opacity: 0.3; cursor: not-allowed; }

/* aria-current="page" marca la página actual: se usa el mismo atributo para el estilo */
.paginacion__boton[aria-current='page'] { background: var(--accent); color: #fff; }
```

```tsx
// src/components/ui/Pagination.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

interface Props {
  paginaActual: number;
  totalPaginas: number;
  desde: number;
  hasta: number;
  total: number;
  porPagina: number;
  irA: (pagina: number) => void;
  cambiarPorPagina: (n: number) => void;
}

const OPCIONES_POR_PAGINA = [5, 10, 20];

export default function Pagination({
  paginaActual, totalPaginas, desde, hasta, total, porPagina, irA, cambiarPorPagina,
}: Props) {
  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  return (
    <div className="paginacion">
      <div className="paginacion__info">
        <span>{total === 0 ? 'Sin resultados' : `${desde}–${hasta} de ${total}`}</span>
        <select
          value={porPagina}
          onChange={(e) => cambiarPorPagina(Number(e.target.value))}
          className="paginacion__select"
          aria-label="Filas por página"
        >
          {OPCIONES_POR_PAGINA.map((n) => <option key={n} value={n}>{n} por página</option>)}
        </select>
      </div>

      <div className="paginacion__botones">
        <button
          onClick={() => irA(paginaActual - 1)}
          disabled={paginaActual === 1}
          className="paginacion__boton"
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} />
        </button>
        {paginas.map((p) => (
          <button
            key={p}
            onClick={() => irA(p)}
            className="paginacion__boton"
            aria-current={p === paginaActual ? 'page' : undefined}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => irA(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
          className="paginacion__boton"
          aria-label="Página siguiente"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
```

---

## 13. Layout

```css
/* src/components/layout/Layout.css — estructura general, navbar y footer */

/* Columna de alto completo: el footer queda abajo aunque haya poco contenido */
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout__main {
  flex: 1;
  padding-block: 2.5rem;
}

/* ---------- Navbar ---------- */
.navbar {
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);       /* efecto "vidrio" de la sesión 2 */
  border-bottom: 1px solid var(--border);
}

.navbar__contenido {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding-block: 0.75rem;
}

.navbar__logo { font-size: 1.125rem; font-weight: 800; }

.navbar__menu { display: flex; flex-wrap: wrap; gap: 0.25rem; }

.navbar__enlace {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  transition: var(--transition);
}
.navbar__enlace:hover { background: var(--bg-hover); }

/* NavLink agrega la clase "active" al enlace de la página actual */
.navbar__enlace.active { background: var(--accent); color: #fff; }

/* ---------- Footer ---------- */
.footer {
  background: var(--bg-secondary);
  border-top: 1px solid var(--border);
}

.footer__contenido {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding-block: 1.5rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.footer__stack { font-size: 0.75rem; }
```

```tsx
// src/components/layout/Layout.tsx
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css';

export default function Layout() {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout__main contenedor">
        <Outlet />   {/* aquí se dibuja la página de la ruta actual */}
      </main>
      <Footer />
    </div>
  );
}
```

- `.layout` con `flex-direction: column` y `min-height: 100vh` + `.layout__main { flex: 1 }`: el footer siempre queda abajo, aunque la página tenga poco contenido.

```tsx
// src/components/layout/Navbar.tsx
import { Link, NavLink } from 'react-router-dom';
import { FolderKanban, House, Lock, Mail } from 'lucide-react';

const links = [
  { to: '/',          label: 'Inicio',    icon: House },
  { to: '/proyectos', label: 'Proyectos', icon: FolderKanban },
  { to: '/contacto',  label: 'Contacto',  icon: Mail },
  { to: '/admin',     label: 'Admin',     icon: Lock },
];

export default function Navbar() {
  return (
    <header className="navbar">
      <nav className="navbar__contenido contenedor">
        <Link to="/" className="navbar__logo texto-gradiente">Hebert Cussi</Link>
        <ul className="navbar__menu">
          {links.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              {/* NavLink agrega la clase "active" si su ruta es la actual; end: "/" solo en la portada */}
              <NavLink to={to} end={to === '/'} className="navbar__enlace">
                <Icon size={16} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
```

- `NavLink` agrega la clase **`active`** al enlace de la ruta actual. El CSS solo tiene que definir `.navbar__enlace.active`.
- `end` en `/`: sin él, "Inicio" quedaría activo en todas las rutas.

```tsx
// src/components/layout/Footer.tsx

// Fuera del componente: se calcula una sola vez y el render queda "puro"
const ANIO = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__contenido contenedor">
        <p>© {ANIO} Hebert Cussi Cuentas · La Paz, Bolivia</p>
        <p className="footer__stack">React · Node.js · Express · Prisma · PostgreSQL</p>
      </div>
    </footer>
  );
}
```

```css
/* src/components/layout/AdminLayout.css — panel de administración */
.admin { display: grid; gap: 1.5rem; }

.admin__cabecera {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.admin__titulo { font-size: 1.5rem; font-weight: 700; }

/* Pestañas: el borde inferior de la activa se superpone al de la barra */
.admin__pestanas {
  display: flex;
  gap: 0.25rem;
  overflow-x: auto;
  border-bottom: 1px solid var(--border);
}

.admin__pestana {
  margin-bottom: -1px;
  padding: 0.5rem 1rem;
  border-bottom: 2px solid transparent;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
}
.admin__pestana:hover { color: var(--text-primary); }
.admin__pestana.active { border-color: var(--accent); color: var(--accent); }

/* Contenido de cada pestaña: barra superior (contador + botón) y lista */
.panel { display: grid; gap: 1rem; }

.panel__barra {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}
```

```tsx
// src/components/layout/AdminLayout.tsx
import { startTransition } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import Button from '../ui/Button';
import './AdminLayout.css';

const pestanas = [
  { to: '/admin/proyectos',   label: 'Proyectos' },
  { to: '/admin/tecnologias', label: 'Tecnologías' },
  { to: '/admin/mensajes',    label: 'Mensajes' },
];

export default function AdminLayout() {
  const { salir } = useAdmin();
  const navigate = useNavigate();

  const handleSalir = () => {
    // Las dos actualizaciones se aplican juntas. Si salir() se aplicara antes que la
    // navegación, RequireAdmin vería "sin sesión" y mandaría al login en lugar de a "/"
    startTransition(() => {
      salir();
      navigate('/');
    });
  };

  return (
    <div className="admin">
      <div className="admin__cabecera">
        <h1 className="admin__titulo">Panel de administración</h1>
        <Button variant="ghost" onClick={handleSalir} icon={<LogOut size={16} />}>Salir</Button>
      </div>

      <nav className="admin__pestanas" aria-label="Secciones del panel">
        {pestanas.map(({ to, label }) => (
          <NavLink key={to} to={to} className="admin__pestana">{label}</NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  );
}
```

> **¿Por qué `startTransition` en "Salir"?** Sin él, React aplicaba primero `salir()` todavía en `/admin/…`; `RequireAdmin` veía "sin sesión" y mandaba al **login** en lugar de a la portada. Así las dos actualizaciones se aplican juntas.

---

## 14. Componentes del portafolio

```css
/* src/components/portafolio/ProyectoCard.css */
.proyecto-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;                 /* recorta la imagen con el borde redondeado */
  transition: var(--transition);
}
.proyecto-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px -8px rgba(99, 102, 241, 0.25);
}

.proyecto-card__imagen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 9rem;
  font-size: 3.75rem;
  background: linear-gradient(135deg, var(--bg-tertiary), #faf5ff);
}

.proyecto-card__cuerpo {
  display: flex;
  flex-direction: column;
  flex: 1;                          /* ocupa el alto sobrante: tarjetas de la misma fila iguales */
  gap: 0.75rem;
  padding: 1.25rem;
}

.proyecto-card__fila {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.proyecto-card__titulo { font-size: 1.125rem; font-weight: 700; }
.proyecto-card__titulo a:hover { color: var(--accent); }

.proyecto-card__descripcion {
  flex: 1;                          /* empuja las etiquetas al fondo de la tarjeta */
  color: var(--text-secondary);
  font-size: 0.875rem;
}
```

```tsx
// src/components/portafolio/ProyectoCard.tsx
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import type { Proyecto } from '../../interfaces/Proyecto';
import { CATEGORIAS } from '../../utils/etiquetas';
import Badge from '../ui/Badge';
import './ProyectoCard.css';

export default function ProyectoCard({ proyecto }: { proyecto: Proyecto }) {
  const { id, titulo, descripcion, emoji, categoria, destacado, tecnologias } = proyecto;

  return (
    <article className="proyecto-card tarjeta">
      <div className="proyecto-card__imagen" aria-hidden="true">{emoji}</div>
      <div className="proyecto-card__cuerpo">
        <div className="proyecto-card__fila">
          {/* 'FRONTEND' → 'frontend' → clase badge--frontend */}
          <Badge variante={categoria.toLowerCase()}>{CATEGORIAS[categoria]}</Badge>
          {destacado && <Star size={16} className="icono-destacado" aria-label="Destacado" />}
        </div>
        <h3 className="proyecto-card__titulo">
          <Link to={`/proyectos/${id}`}>{titulo}</Link>
        </h3>
        <p className="proyecto-card__descripcion">{descripcion}</p>
        <ul className="lista-etiquetas" aria-label="Tecnologías">
          {tecnologias.map((t) => (
            <li key={t.id}><Badge>{t.nombre}</Badge></li>
          ))}
        </ul>
      </div>
    </article>
  );
}
```

| CSS | Efecto |
|---|---|
| `overflow: hidden` en la tarjeta | La imagen respeta las esquinas redondeadas. |
| `flex: 1` en `__cuerpo` y en `__descripcion` | Todas las tarjetas de una fila tienen el mismo alto y las etiquetas quedan alineadas abajo (igual que en la sesión 2). |
| `transform: translateY(-4px)` en `:hover` | La tarjeta "se levanta" al pasar el mouse. |

```css
/* src/components/portafolio/Habilidades.css */
.habilidades {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 15rem), 1fr));
}

.habilidad {
  display: grid;
  align-content: start;
  gap: 0.75rem;
  padding: 1.25rem;
}

.habilidad__icono { color: var(--accent); }
.habilidad__titulo { font-size: 1rem; font-weight: 700; }

.habilidad__lista {
  display: grid;
  gap: 0.375rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.habilidad__item { display: flex; justify-content: space-between; gap: 0.5rem; }
.habilidad__usos { color: var(--text-muted); }
```

```tsx
// src/components/portafolio/Habilidades.tsx
import { Database, Monitor, Server, Wrench } from 'lucide-react';
import type { AreaTecnologia, Tecnologia } from '../../interfaces/Tecnologia';
import { AREAS, LISTA_AREAS } from '../../utils/etiquetas';
import './Habilidades.css';

const ICONOS = { FRONTEND: Monitor, BACKEND: Server, BASE_DATOS: Database, HERRAMIENTA: Wrench };

export default function Habilidades({ tecnologias }: { tecnologias: Tecnologia[] }) {
  // reduce: agrupa las tecnologías por área → { FRONTEND: [...], BACKEND: [...] }
  const porArea = tecnologias.reduce<Partial<Record<AreaTecnologia, Tecnologia[]>>>((acc, t) => {
    (acc[t.area] ??= []).push(t);
    return acc;
  }, {});

  return (
    <div className="habilidades">
      {LISTA_AREAS.filter((area) => porArea[area]).map((area) => {
        const Icon = ICONOS[area];
        return (
          <article key={area} className="habilidad tarjeta">
            <Icon className="habilidad__icono" aria-hidden="true" />
            <h3 className="habilidad__titulo">{AREAS[area]}</h3>
            <ul className="habilidad__lista">
              {porArea[area]!.map((t) => (
                <li key={t.id} className="habilidad__item">
                  <span>{t.nombre}</span>
                  <span className="habilidad__usos">{t._count?.proyectos ?? 0} proy.</span>
                </li>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}
```

- `reduce` agrupa las tecnologías por área, como `countByCategory` de la sesión 3. `(acc[t.area] ??= []).push(t)` crea el array solo si todavía no existe.

---

## 15. Formularios

```css
/* src/components/forms/Formulario.css — estilos compartidos por todos los formularios */
.formulario { display: grid; gap: 1rem; }

/* Dos columnas desde 640px; en celular, una debajo de la otra */
.formulario__fila { display: grid; gap: 1rem; }
@media (min-width: 640px) {
  .formulario__fila { grid-template-columns: 1fr 1fr; }
}

/* Título ancho + emoji angosto, en cualquier pantalla.
   Va DESPUÉS del @media: con la misma especificidad, gana la regla que está más abajo */
.formulario__fila--titulo { grid-template-columns: 1fr 5rem; gap: 0.75rem; }

.formulario__acciones { display: flex; flex-wrap: wrap; gap: 0.75rem; padding-top: 0.5rem; }

/* ---------- Campo: etiqueta + control + error ---------- */
.campo__etiqueta {
  display: block;
  margin-bottom: 0.25rem;
  color: #334155;
  font-size: 0.875rem;
  font-weight: 500;
}

.campo__control {
  display: block;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
  font-size: 0.875rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.campo__control:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-light);
}

textarea.campo__control { resize: vertical; }
.campo__control--centrado { text-align: center; }

/* Se agrega desde React cuando React Hook Form detecta un error */
.campo__control--error { border-color: #f87171; background: var(--danger-light); }

.campo__error { margin-top: 0.25rem; color: var(--danger); font-size: 0.75rem; }

.campo__rango { width: 100%; }
.campo__valor { color: var(--accent); }

/* ---------- Grupo de checkbox con forma de "chip" ---------- */
.opciones { border: none; }
.opciones__lista { display: flex; flex-wrap: wrap; gap: 0.5rem; }

.opcion {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--bg-primary);
  font-size: 0.875rem;
  cursor: pointer;
}

/* :has() — la etiqueta cambia de color si el checkbox de adentro está marcado */
.opcion:has(input:checked) { border-color: #a5b4fc; background: var(--bg-tertiary); }
```

| Regla | Para qué |
|---|---|
| `.formulario__fila` + `@media (min-width: 640px)` | Dos columnas en pantallas medianas; una en celular (*mobile first*). |
| `.campo__control:focus` | Reemplaza el borde de foco del navegador por un borde y sombra de color. |
| `.campo__control--error` | React la agrega cuando React Hook Form detecta un error. |
| `.opcion:has(input:checked)` | El "chip" de tecnología cambia de color al marcarlo, **sin JavaScript**. |

### 15.1 Proyecto (crear y editar con el mismo formulario)

```tsx
// src/components/forms/ProyectoForm.tsx
import { useForm } from 'react-hook-form';
import type { Categoria, Proyecto, ProyectoDTO } from '../../interfaces/Proyecto';
import type { Tecnologia } from '../../interfaces/Tecnologia';
import { CATEGORIAS, LISTA_CATEGORIAS } from '../../utils/etiquetas';
import Button from '../ui/Button';
import './Formulario.css';

// Valores tal como los maneja el formulario (los checkbox devuelven los ids como texto)
interface Valores {
  titulo: string;
  descripcion: string;
  emoji: string;
  categoria: Categoria | '';
  urlDemo: string;
  urlRepo: string;
  destacado: boolean;
  tecnologiaIds: string[];
}

interface Props {
  proyecto?: Proyecto;              // si viene, el formulario es de edición
  tecnologias: Tecnologia[];
  onSubmit: (data: ProyectoDTO) => Promise<void>;
  onCancel: () => void;
}

// Agrega el modificador de error a la clase del control
const control = (conError: boolean) => `campo__control${conError ? ' campo__control--error' : ''}`;

export default function ProyectoForm({ proyecto, tecnologias, onSubmit, onCancel }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm<Valores>({
    defaultValues: {
      titulo:        proyecto?.titulo ?? '',
      descripcion:   proyecto?.descripcion ?? '',
      emoji:         proyecto?.emoji ?? '💻',
      categoria:     proyecto?.categoria ?? '',
      urlDemo:       proyecto?.urlDemo ?? '',
      urlRepo:       proyecto?.urlRepo ?? '',
      destacado:     proyecto?.destacado ?? false,
      tecnologiaIds: proyecto?.tecnologias.map((t) => String(t.id)) ?? [],
    },
  });

  // Convierte los valores del formulario al formato que espera la API
  const enviar = (v: Valores) =>
    onSubmit({
      ...v,
      categoria: v.categoria as Categoria,     // "required" garantiza que no está vacío
      tecnologiaIds: v.tecnologiaIds.map(Number),
    });

  return (
    <form onSubmit={handleSubmit(enviar)} className="formulario" noValidate>
      <div className="formulario__fila formulario__fila--titulo">
        <div>
          <label htmlFor="titulo" className="campo__etiqueta">Título *</label>
          <input
            id="titulo"
            {...register('titulo', {
              required: 'El título es obligatorio',
              minLength: { value: 3, message: 'Mínimo 3 caracteres' },
            })}
            className={control(!!errors.titulo)}
          />
          {errors.titulo && <p className="campo__error">{errors.titulo.message}</p>}
        </div>
        <div>
          <label htmlFor="emoji" className="campo__etiqueta">Emoji</label>
          <input id="emoji" {...register('emoji')} className="campo__control campo__control--centrado" />
        </div>
      </div>

      <div>
        <label htmlFor="descripcion" className="campo__etiqueta">Descripción *</label>
        <textarea
          id="descripcion"
          rows={3}
          {...register('descripcion', {
            required: 'La descripción es obligatoria',
            minLength: { value: 10, message: 'Mínimo 10 caracteres' },
          })}
          className={control(!!errors.descripcion)}
        />
        {errors.descripcion && <p className="campo__error">{errors.descripcion.message}</p>}
      </div>

      <div>
        <label htmlFor="categoria" className="campo__etiqueta">Categoría *</label>
        <select
          id="categoria"
          {...register('categoria', { required: 'Elige una categoría' })}
          className={control(!!errors.categoria)}
        >
          <option value="">-- Seleccionar --</option>
          {LISTA_CATEGORIAS.map((c) => <option key={c} value={c}>{CATEGORIAS[c]}</option>)}
        </select>
        {errors.categoria && <p className="campo__error">{errors.categoria.message}</p>}
      </div>

      <fieldset className="opciones">
        <legend className="campo__etiqueta">Tecnologías</legend>
        <div className="opciones__lista">
          {tecnologias.map((t) => (
            <label key={t.id} className="opcion">
              {/* Varios checkbox con el mismo nombre → React Hook Form devuelve un array */}
              <input type="checkbox" value={t.id} {...register('tecnologiaIds')} />
              {t.nombre}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="formulario__fila">
        <div>
          <label htmlFor="urlDemo" className="campo__etiqueta">URL de la demo</label>
          <input id="urlDemo" type="url" placeholder="https://..." {...register('urlDemo')} className="campo__control" />
        </div>
        <div>
          <label htmlFor="urlRepo" className="campo__etiqueta">URL del repositorio</label>
          <input id="urlRepo" type="url" placeholder="https://github.com/..." {...register('urlRepo')} className="campo__control" />
        </div>
      </div>

      <label className="casilla">
        <input type="checkbox" {...register('destacado')} />
        Mostrar como proyecto destacado en la portada
      </label>

      <div className="formulario__acciones">
        {/* En edición, el botón se habilita solo si se cambió algún campo */}
        <Button type="submit" disabled={isSubmitting || (!!proyecto && !isDirty)}>
          {isSubmitting ? 'Guardando...' : proyecto ? 'Guardar cambios' : 'Crear proyecto'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
}
```

| Concepto | Explicación |
|---|---|
| `proyecto?: Proyecto` | Si llega, es formulario de **edición** (`defaultValues` con sus datos); si no, de **creación**. |
| `control(conError)` | Función pequeña que devuelve `'campo__control'` o `'campo__control campo__control--error'`. |
| Varios checkbox con `register('tecnologiaIds')` | React Hook Form devuelve un **array** con los `value` marcados: `['1', '6']` → `.map(Number)`. |
| `isDirty` | En edición, el botón se habilita solo si se cambió algún campo. |

### 15.2 Tecnología

```tsx
// src/components/forms/TecnologiaForm.tsx
import { useForm } from 'react-hook-form';
import type { Tecnologia, TecnologiaDTO } from '../../interfaces/Tecnologia';
import { AREAS, LISTA_AREAS } from '../../utils/etiquetas';
import Button from '../ui/Button';
import './Formulario.css';

interface Props {
  tecnologia?: Tecnologia;
  onSubmit: (data: TecnologiaDTO) => Promise<void>;
  onCancel: () => void;
}

export default function TecnologiaForm({ tecnologia, onSubmit, onCancel }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm<TecnologiaDTO>({
    defaultValues: { nombre: tecnologia?.nombre ?? '', area: tecnologia?.area ?? 'FRONTEND' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="formulario" noValidate>
      <div>
        <label htmlFor="nombre" className="campo__etiqueta">Nombre *</label>
        <input
          id="nombre"
          {...register('nombre', { required: 'El nombre es obligatorio' })}
          className={`campo__control${errors.nombre ? ' campo__control--error' : ''}`}
          placeholder="Vue, Docker, MongoDB..."
        />
        {errors.nombre && <p className="campo__error">{errors.nombre.message}</p>}
      </div>

      <div>
        <label htmlFor="area" className="campo__etiqueta">Área *</label>
        <select id="area" {...register('area')} className="campo__control">
          {LISTA_AREAS.map((a) => <option key={a} value={a}>{AREAS[a]}</option>)}
        </select>
      </div>

      <div className="formulario__acciones">
        <Button type="submit" disabled={isSubmitting || (!!tecnologia && !isDirty)}>
          {isSubmitting ? 'Guardando...' : tecnologia ? 'Guardar cambios' : 'Crear tecnología'}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
      </div>
    </form>
  );
}
```

### 15.3 Contacto

```tsx
// src/components/forms/ContactoForm.tsx
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Send } from 'lucide-react';
import type { MensajeDTO } from '../../interfaces/Mensaje';
import { mensajeService } from '../../services/mensajeService';
import { SERVICIOS } from '../../utils/etiquetas';
import Button from '../ui/Button';
import './Formulario.css';

const control = (conError: boolean) => `campo__control${conError ? ' campo__control--error' : ''}`;

export default function ContactoForm() {
  const [respuesta, setRespuesta] = useState<{ ok: boolean; texto: string } | null>(null);
  const {
    register, handleSubmit, reset, control: controlForm,
    formState: { errors, isSubmitting },
  } = useForm<MensajeDTO>({ defaultValues: { presupuesto: 500 } });

  // useWatch: el componente se vuelve a dibujar cada vez que se mueve el slider
  const presupuesto = useWatch({ control: controlForm, name: 'presupuesto' });

  const enviar = async (datos: MensajeDTO) => {
    setRespuesta(null);
    try {
      const { mensaje } = await mensajeService.enviar(datos);
      setRespuesta({ ok: true, texto: mensaje });
      reset();
    } catch (err) {
      setRespuesta({ ok: false, texto: (err as Error).message });
    }
  };

  return (
    <form onSubmit={handleSubmit(enviar)} className="formulario" noValidate>
      <div className="formulario__fila">
        <div>
          <label htmlFor="nombre" className="campo__etiqueta">Nombre completo *</label>
          <input
            id="nombre"
            autoComplete="name"
            {...register('nombre', {
              required: 'El nombre es obligatorio',
              minLength: { value: 3, message: 'Mínimo 3 caracteres' },
            })}
            className={control(!!errors.nombre)}
          />
          {errors.nombre && <p className="campo__error">{errors.nombre.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="campo__etiqueta">Correo electrónico *</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email', {
              required: 'El correo es obligatorio',
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo inválido' },
            })}
            className={control(!!errors.email)}
          />
          {errors.email && <p className="campo__error">{errors.email.message}</p>}
        </div>
      </div>

      <div className="formulario__fila">
        <div>
          <label htmlFor="servicio" className="campo__etiqueta">Tipo de servicio</label>
          <select id="servicio" {...register('servicio')} className="campo__control">
            <option value="">-- Opcional --</option>
            {SERVICIOS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="fecha" className="campo__etiqueta">Fecha preferida de contacto</label>
          <input id="fecha" type="date" {...register('fecha')} className="campo__control" />
        </div>
      </div>

      <div>
        <label htmlFor="presupuesto" className="campo__etiqueta">
          Presupuesto estimado: <strong className="campo__valor">${Number(presupuesto).toLocaleString('es-BO')}</strong>
        </label>
        <input
          id="presupuesto"
          type="range"
          min={100}
          max={5000}
          step={100}
          {...register('presupuesto', { valueAsNumber: true })}
          className="campo__rango"
        />
      </div>

      <div>
        <label htmlFor="mensaje" className="campo__etiqueta">Mensaje *</label>
        <textarea
          id="mensaje"
          rows={4}
          {...register('mensaje', {
            required: 'El mensaje es obligatorio',
            minLength: { value: 20, message: 'Mínimo 20 caracteres' },
          })}
          className={control(!!errors.mensaje)}
          placeholder="Cuéntame sobre tu proyecto..."
        />
        {errors.mensaje && <p className="campo__error">{errors.mensaje.message}</p>}
      </div>

      {respuesta && (
        <p role="status" className={`alerta ${respuesta.ok ? 'alerta--ok' : 'alerta--error'}`}>
          {respuesta.ok ? '✅ ' : '❌ '}{respuesta.texto}
        </p>
      )}

      <div>
        <Button type="submit" disabled={isSubmitting} icon={<Send size={16} />}>
          {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
        </Button>
      </div>
    </form>
  );
}
```

- Mismos campos que el formulario de la sesión 3 y mismas reglas que valida la API.
- `useWatch` redibuja el texto del presupuesto al mover el slider.
- `control: controlForm`: se renombra al desestructurar para no chocar con la función `control()` de las clases.

---

## 16. Tablas del panel

```css
/* src/components/tables/Tablas.css — tablas y lista de mensajes del panel */

/* overflow-x: en celular la tabla se desplaza dentro de su caja, no la página entera */
.tabla-contenedor { overflow-x: auto; }

.tabla {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.tabla th {
  padding: 0.75rem 1rem;
  background: var(--bg-primary);
  color: var(--text-secondary);
  font-weight: 600;
  text-align: left;
}

.tabla td {
  padding: 0.75rem 1rem;
  border-top: 1px solid var(--border);
  vertical-align: middle;
}

.tabla__proyecto { display: flex; align-items: center; gap: 0.5rem; font-weight: 500; }
.tabla__secundario { color: var(--text-secondary); }
.tabla__acciones { display: flex; gap: 0.5rem; }

/* ---------- Mensajes ---------- */
.mensajes { overflow: hidden; }

.mensaje {
  display: grid;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border);
}

/* Los no leídos se resaltan con fondo y nombre en negrita */
.mensaje--nuevo { background: rgba(238, 242, 255, 0.6); }
.mensaje--nuevo .mensaje__nombre { font-weight: 700; }

.mensaje__cabecera {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
}

.mensaje__nombre { font-weight: 500; }
.mensaje__email { color: var(--accent); font-size: 0.875rem; }
.mensaje__email:hover { text-decoration: underline; }
.mensaje__fecha { color: var(--text-muted); font-size: 0.75rem; }
.mensaje__texto { color: var(--text-secondary); font-size: 0.875rem; white-space: pre-line; }
.mensaje__meta { color: var(--text-muted); font-size: 0.75rem; }
```

- `.tabla-contenedor { overflow-x: auto }`: en celular la **tabla** se desplaza dentro de su caja y la página no tiene scroll horizontal.
- `border-collapse: collapse`: une los bordes de las celdas en una sola línea.
- `.mensaje--nuevo .mensaje__nombre`: selector descendiente; el nombre va en negrita solo en los mensajes no leídos.

```tsx
// src/components/tables/ProyectosTable.tsx
import { Pencil, Star, Trash2 } from 'lucide-react';
import type { Proyecto } from '../../interfaces/Proyecto';
import { usePaginacion } from '../../hooks/usePaginacion';
import { CATEGORIAS } from '../../utils/etiquetas';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Pagination from '../ui/Pagination';
import './Tablas.css';

interface Props {
  proyectos: Proyecto[];
  onEditar: (proyecto: Proyecto) => void;
  onEliminar: (proyecto: Proyecto) => void;
}

export default function ProyectosTable({ proyectos, onEditar, onEliminar }: Props) {
  const { datosPagina, ...paginacion } = usePaginacion(proyectos);

  return (
    <div className="tarjeta">
      <div className="tabla-contenedor">
        <table className="tabla">
          <thead>
            <tr>
              <th>Proyecto</th>
              <th>Categoría</th>
              <th>Tecnologías</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datosPagina.map((p) => (
              <tr key={p.id}>
                <td>
                  <span className="tabla__proyecto">
                    <span aria-hidden="true">{p.emoji}</span>
                    {p.titulo}
                    {p.destacado && <Star size={14} className="icono-destacado" aria-label="Destacado" />}
                  </span>
                </td>
                <td><Badge variante={p.categoria.toLowerCase()}>{CATEGORIAS[p.categoria]}</Badge></td>
                <td className="tabla__secundario">{p.tecnologias.map((t) => t.nombre).join(', ') || '—'}</td>
                <td>
                  <div className="tabla__acciones">
                    <Button variant="ghost" onClick={() => onEditar(p)} icon={<Pencil size={14} />}>Editar</Button>
                    <Button variant="danger" onClick={() => onEliminar(p)} icon={<Trash2 size={14} />}>Eliminar</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination {...paginacion} />
    </div>
  );
}
```

```tsx
// src/components/tables/TecnologiasTable.tsx
import { Pencil, Trash2 } from 'lucide-react';
import type { Tecnologia } from '../../interfaces/Tecnologia';
import { usePaginacion } from '../../hooks/usePaginacion';
import { AREAS } from '../../utils/etiquetas';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Pagination from '../ui/Pagination';
import './Tablas.css';

interface Props {
  tecnologias: Tecnologia[];
  onEditar: (tecnologia: Tecnologia) => void;
  onEliminar: (tecnologia: Tecnologia) => void;
}

export default function TecnologiasTable({ tecnologias, onEditar, onEliminar }: Props) {
  const { datosPagina, ...paginacion } = usePaginacion(tecnologias, 10);

  return (
    <div className="tarjeta">
      <div className="tabla-contenedor">
        <table className="tabla">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Área</th>
              <th>Usada en</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datosPagina.map((t) => (
              <tr key={t.id}>
                <td className="tabla__proyecto">{t.nombre}</td>
                <td><Badge>{AREAS[t.area]}</Badge></td>
                <td className="tabla__secundario">{t._count?.proyectos ?? 0} proyecto(s)</td>
                <td>
                  <div className="tabla__acciones">
                    <Button variant="ghost" onClick={() => onEditar(t)} icon={<Pencil size={14} />}>Editar</Button>
                    <Button variant="danger" onClick={() => onEliminar(t)} icon={<Trash2 size={14} />}>Eliminar</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination {...paginacion} />
    </div>
  );
}
```

```tsx
// src/components/tables/MensajesTable.tsx
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import type { Mensaje } from '../../interfaces/Mensaje';
import { usePaginacion } from '../../hooks/usePaginacion';
import Button from '../ui/Button';
import Pagination from '../ui/Pagination';
import './Tablas.css';

interface Props {
  mensajes: Mensaje[];
  onCambiarLeido: (mensaje: Mensaje) => void;
  onEliminar: (mensaje: Mensaje) => void;
}

// utc = true para campos de solo fecha: "2026-11-15T00:00:00Z" en Bolivia (UTC-4) sería el día 14
const fecha = (iso: string, utc = false) =>
  new Date(iso).toLocaleDateString('es-BO', utc ? { timeZone: 'UTC' } : undefined);

export default function MensajesTable({ mensajes, onCambiarLeido, onEliminar }: Props) {
  const { datosPagina, ...paginacion } = usePaginacion(mensajes);

  return (
    <div className="mensajes tarjeta">
      <ul>
        {datosPagina.map((m) => (
          <li key={m.id} className={m.leido ? 'mensaje' : 'mensaje mensaje--nuevo'}>
            <div className="mensaje__cabecera">
              <div>
                <p className="mensaje__nombre">{m.nombre}</p>
                <a href={`mailto:${m.email}`} className="mensaje__email">{m.email}</a>
              </div>
              <span className="mensaje__fecha">{fecha(m.creadoEn)}</span>
            </div>
            <p className="mensaje__texto">{m.mensaje}</p>
            <p className="mensaje__meta">
              {m.servicio ?? 'Sin servicio'} · {m.presupuesto ? `$${m.presupuesto.toLocaleString('es-BO')}` : 'Sin presupuesto'}
              {m.fecha && ` · Contactar el ${fecha(m.fecha, true)}`}
            </p>
            <div className="tabla__acciones">
              <Button
                variant="ghost"
                onClick={() => onCambiarLeido(m)}
                icon={m.leido ? <Mail size={14} /> : <MailOpen size={14} />}
              >
                {m.leido ? 'Marcar como no leído' : 'Marcar como leído'}
              </Button>
              <Button variant="danger" onClick={() => onEliminar(m)} icon={<Trash2 size={14} />}>Eliminar</Button>
            </div>
          </li>
        ))}
      </ul>
      <Pagination {...paginacion} />
    </div>
  );
}
```

> **La fecha que se corría un día:** la API devuelve `fecha` como `"2026-11-15T00:00:00.000Z"` (medianoche UTC). En Bolivia (UTC−4) eso es el 14 a las 20:00. Con `{ timeZone: 'UTC' }` se muestra el día que eligió el visitante.

---

## 17. Páginas públicas

### 17.1 Inicio

```css
/* src/pages/InicioPage.css */
.inicio { display: grid; gap: 5rem; }

.hero {
  display: grid;
  justify-items: center;
  gap: 1.5rem;
  padding-block: 2.5rem;
  text-align: center;
}

.hero__insignia {
  padding: 0.25rem 1rem;
  border-radius: 999px;
  background: var(--accent-light);
  color: #4338ca;
  font-size: 0.75rem;
  font-weight: 600;
}

/* clamp(mínimo, ideal, máximo): tamaño fluido sin media queries (sesión 2) */
.hero__titulo {
  font-size: clamp(2.25rem, 6vw, 3.75rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.hero__texto {
  max-width: 36rem;
  color: var(--text-secondary);
  font-size: 1.125rem;
}

.hero__acciones { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem; }
```

```tsx
// src/pages/InicioPage.tsx
import { Link } from 'react-router-dom';
import { ArrowRight, FolderKanban, Layers } from 'lucide-react';
import { useProyectos } from '../hooks/useProyectos';
import { useTecnologias } from '../hooks/useTecnologias';
import ProyectoCard from '../components/portafolio/ProyectoCard';
import Habilidades from '../components/portafolio/Habilidades';
import EstadoCarga from '../components/ui/EstadoCarga';
import '../components/ui/Button.css';   // los Link del hero usan las clases .btn
import './InicioPage.css';

export default function InicioPage() {
  const destacados = useProyectos({ destacado: true });
  const habilidades = useTecnologias();

  return (
    <div className="inicio">
      {/* Hero */}
      <section className="hero">
        <span className="hero__insignia">Disponible para proyectos</span>
        <h1 className="hero__titulo">
          Hola, soy <span className="texto-gradiente">Hebert Cussi</span>
        </h1>
        <p className="hero__texto">
          Desarrollador de Software y Analista Programador especializado en soluciones web modernas.
        </p>
        <div className="hero__acciones">
          <Link to="/proyectos" className="btn btn--primary btn--grande">
            Ver proyectos <ArrowRight size={18} />
          </Link>
          <Link to="/contacto" className="btn btn--contorno btn--grande">Contáctame</Link>
        </div>
      </section>

      {/* Proyectos destacados */}
      <section aria-labelledby="titulo-destacados" className="seccion">
        <h2 id="titulo-destacados" className="seccion__titulo">Proyectos destacados</h2>
        <EstadoCarga
          loading={destacados.loading}
          error={destacados.error}
          vacio={destacados.proyectos.length === 0}
          icon={FolderKanban}
          textoVacio="Todavía no hay proyectos destacados."
        />
        <div className="grid-tarjetas">
          {destacados.proyectos.map((p) => <ProyectoCard key={p.id} proyecto={p} />)}
        </div>
      </section>

      {/* Habilidades */}
      <section aria-labelledby="titulo-habilidades" className="seccion">
        <h2 id="titulo-habilidades" className="seccion__titulo">Habilidades</h2>
        <EstadoCarga
          loading={habilidades.loading}
          error={habilidades.error}
          vacio={habilidades.tecnologias.length === 0}
          icon={Layers}
          textoVacio="Todavía no hay tecnologías registradas."
        />
        <Habilidades tecnologias={habilidades.tecnologias} />
      </section>
    </div>
  );
}
```

- `clamp(2.25rem, 6vw, 3.75rem)`: el título crece con la pantalla entre un mínimo y un máximo, sin media queries (sesión 2).

### 17.2 Proyectos con filtros en la URL

```css
/* src/pages/ProyectosPage.css */
.proyectos { display: grid; gap: 1.5rem; }

.filtros { display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem; }

.filtro {
  padding: 0.375rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}
.filtro:hover { border-color: #818cf8; }

/* El botón activo se estiliza con su atributo aria-pressed (el mismo que usan los lectores de pantalla) */
.filtro[aria-pressed='true'] { border-color: var(--accent); background: var(--accent); color: #fff; }

.filtros__select {
  margin-left: auto;                /* empuja el select a la derecha */
  padding: 0.375rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 999px;
  background: var(--bg-secondary);
  font-size: 0.875rem;
}
```

```tsx
// src/pages/ProyectosPage.tsx
import { useSearchParams } from 'react-router-dom';
import { FolderKanban } from 'lucide-react';
import type { Categoria } from '../interfaces/Proyecto';
import { useProyectos } from '../hooks/useProyectos';
import { useTecnologias } from '../hooks/useTecnologias';
import { CATEGORIAS, LISTA_CATEGORIAS } from '../utils/etiquetas';
import ProyectoCard from '../components/portafolio/ProyectoCard';
import EstadoCarga from '../components/ui/EstadoCarga';
import './ProyectosPage.css';

export default function ProyectosPage() {
  // Los filtros viven en la URL: /proyectos?categoria=FRONTEND&tecnologia=React
  // Así se pueden compartir, y el botón "atrás" del navegador funciona
  const [params, setParams] = useSearchParams();
  const categoria = (params.get('categoria') as Categoria | null) ?? undefined;
  const tecnologia = params.get('tecnologia') ?? undefined;

  const { proyectos, loading, error } = useProyectos({ categoria, tecnologia });
  const { tecnologias } = useTecnologias();

  // Cambia un parámetro de la URL sin perder los demás
  const cambiarFiltro = (clave: 'categoria' | 'tecnologia', valor?: string) => {
    const nuevos = new URLSearchParams(params);
    if (valor) nuevos.set(clave, valor);
    else nuevos.delete(clave);
    setParams(nuevos);
  };

  return (
    <div className="proyectos">
      <header className="encabezado-pagina">
        <h1>Mis proyectos</h1>
        <p>Soluciones reales construidas con tecnologías modernas.</p>
      </header>

      <div className="filtros" role="group" aria-label="Filtrar por categoría">
        <button className="filtro" onClick={() => cambiarFiltro('categoria')} aria-pressed={!categoria}>
          Todos
        </button>
        {LISTA_CATEGORIAS.map((c) => (
          <button key={c} className="filtro" onClick={() => cambiarFiltro('categoria', c)} aria-pressed={categoria === c}>
            {CATEGORIAS[c]}
          </button>
        ))}

        <select
          value={tecnologia ?? ''}
          onChange={(e) => cambiarFiltro('tecnologia', e.target.value)}
          className="filtros__select"
          aria-label="Filtrar por tecnología"
        >
          <option value="">Todas las tecnologías</option>
          {tecnologias.map((t) => <option key={t.id} value={t.nombre}>{t.nombre}</option>)}
        </select>
      </div>

      {!loading && !error && (
        <p className="texto-suave" aria-live="polite">
          {proyectos.length} {proyectos.length === 1 ? 'proyecto' : 'proyectos'}
        </p>
      )}

      <EstadoCarga
        loading={loading}
        error={error}
        vacio={proyectos.length === 0}
        icon={FolderKanban}
        textoVacio="No hay proyectos con esos filtros."
      />

      <div className="grid-tarjetas">
        {proyectos.map((p) => <ProyectoCard key={p.id} proyecto={p} />)}
      </div>
    </div>
  );
}
```

| Concepto | Explicación |
|---|---|
| `useSearchParams` | Lee y cambia el *query string* (`?categoria=FRONTEND`). El filtro sobrevive a recargar y el botón **atrás** vuelve al anterior. |
| `.filtro[aria-pressed='true']` | El botón activo se pinta usando el mismo atributo que lee el lector de pantalla. |
| `margin-left: auto` en el select | En un contenedor flex, empuja el select al extremo derecho. |

### 17.3 Detalle de un proyecto

```css
/* src/pages/ProyectoDetallePage.css */
.detalle { display: grid; gap: 1.5rem; }

.detalle__volver {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  justify-self: start;              /* en un grid, evita que el enlace ocupe todo el ancho */
  color: var(--accent);
  font-size: 0.875rem;
}
.detalle__volver:hover { text-decoration: underline; }

.detalle__tarjeta { overflow: hidden; }

.detalle__imagen {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 12rem;
  font-size: 6rem;
  background: linear-gradient(135deg, var(--bg-tertiary), #faf5ff);
}

.detalle__cuerpo {
  display: grid;
  justify-items: start;
  gap: 1.25rem;
  padding: 2rem;
}

.detalle__titulo { font-size: 1.875rem; font-weight: 700; line-height: 1.2; }
.detalle__descripcion { color: var(--text-secondary); line-height: 1.7; }
.detalle__enlaces { display: flex; flex-wrap: wrap; gap: 0.75rem; }
```

```tsx
// src/pages/ProyectoDetallePage.tsx
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CodeXml, ExternalLink, FolderKanban } from 'lucide-react';
import type { Proyecto } from '../interfaces/Proyecto';
import { proyectoService } from '../services/proyectoService';
import { CATEGORIAS } from '../utils/etiquetas';
import Badge from '../components/ui/Badge';
import EstadoCarga from '../components/ui/EstadoCarga';
import '../components/ui/Button.css';   // los enlaces "Ver demo" y "Ver código" usan .btn
import './ProyectoDetallePage.css';

export default function ProyectoDetallePage() {
  const { id } = useParams();   // el :id de la ruta /proyectos/:id (siempre es texto)
  const [proyecto, setProyecto] = useState<Proyecto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;   // evita guardar la respuesta si el usuario ya cambió de proyecto

    proyectoService
      .getById(Number(id))
      .then((data) => { if (!cancelado) setProyecto(data); })
      .catch((err: Error) => { if (!cancelado) setError(err.message); });

    return () => { cancelado = true; };   // limpieza: se ejecuta al cambiar de id o salir de la página
  }, [id]);

  // Mientras no llega el proyecto de este id, se considera "cargando"
  const loading = !error && proyecto?.id !== Number(id);

  return (
    <div className="detalle">
      <Link to="/proyectos" className="detalle__volver">
        <ArrowLeft size={16} /> Volver a proyectos
      </Link>

      <EstadoCarga loading={loading} error={error} vacio={false} icon={FolderKanban} textoVacio="" />

      {!loading && proyecto && (
        <article className="detalle__tarjeta tarjeta">
          <div className="detalle__imagen" aria-hidden="true">{proyecto.emoji}</div>
          <div className="detalle__cuerpo">
            <Badge variante={proyecto.categoria.toLowerCase()}>{CATEGORIAS[proyecto.categoria]}</Badge>
            <h1 className="detalle__titulo">{proyecto.titulo}</h1>
            <p className="detalle__descripcion">{proyecto.descripcion}</p>

            <ul className="lista-etiquetas" aria-label="Tecnologías">
              {proyecto.tecnologias.map((t) => <li key={t.id}><Badge>{t.nombre}</Badge></li>)}
            </ul>

            <div className="detalle__enlaces">
              {proyecto.urlDemo && (
                <a href={proyecto.urlDemo} target="_blank" rel="noopener noreferrer" className="btn btn--primary">
                  <ExternalLink size={16} /> Ver demo
                </a>
              )}
              {proyecto.urlRepo && (
                <a href={proyecto.urlRepo} target="_blank" rel="noopener noreferrer" className="btn btn--oscuro">
                  <CodeXml size={16} /> Ver código
                </a>
              )}
            </div>
          </div>
        </article>
      )}
    </div>
  );
}
```

- `useParams()` lee el `:id` (siempre texto → `Number(id)`). Con `/proyectos/abc` la API responde 400 y se muestra su mensaje.
- `justify-self: start` en `.detalle__volver`: dentro de un grid, el enlace ocupa solo su ancho y no toda la fila.

### 17.4 Contacto

```css
/* src/pages/ContactoPage.css */

/* Una columna en celular; desde 768px, datos a la izquierda (1/3) y formulario (2/3) */
.contacto { display: grid; gap: 2rem; }
@media (min-width: 768px) {
  .contacto { grid-template-columns: 1fr 2fr; align-items: start; }
}

.contacto__datos { display: grid; gap: 0.75rem; }

.dato {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--bg-secondary);
}

.dato__icono { color: var(--accent); flex-shrink: 0; }
.dato__titulo { font-size: 0.875rem; font-weight: 600; }
.dato__texto { color: var(--text-secondary); font-size: 0.875rem; }

.contacto__formulario { padding: 1.5rem; }
```

```tsx
// src/pages/ContactoPage.tsx
import { Clock, Mail, MapPin } from 'lucide-react';
import ContactoForm from '../components/forms/ContactoForm';
import './ContactoPage.css';

const datos = [
  { icon: Mail,   titulo: 'Email',     texto: 'hebert@ejemplo.com' },
  { icon: MapPin, titulo: 'Ubicación', texto: 'La Paz, Bolivia' },
  { icon: Clock,  titulo: 'Respuesta', texto: 'Menos de 48 horas' },
];

export default function ContactoPage() {
  return (
    <div>
      <header className="encabezado-pagina">
        <h1>Contáctame</h1>
        <p>¿Tienes un proyecto en mente? Hablemos.</p>
      </header>

      <div className="contacto">
        <aside className="contacto__datos">
          {datos.map(({ icon: Icon, titulo, texto }) => (
            <div key={titulo} className="dato">
              <Icon className="dato__icono" aria-hidden="true" />
              <div>
                <p className="dato__titulo">{titulo}</p>
                <p className="dato__texto">{texto}</p>
              </div>
            </div>
          ))}
        </aside>

        <div className="contacto__formulario tarjeta">
          <ContactoForm />
        </div>
      </div>
    </div>
  );
}
```

### 17.5 Página 404

```css
/* src/pages/NotFoundPage.css */
.no-encontrado {
  display: grid;
  justify-items: center;
  gap: 1rem;
  padding-block: 5rem;
  text-align: center;
}

.no-encontrado__codigo { color: #c7d2fe; font-size: 3.75rem; font-weight: 800; line-height: 1; }
.no-encontrado__titulo { font-size: 1.25rem; font-weight: 600; }
```

```tsx
// src/pages/NotFoundPage.tsx
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <div className="no-encontrado">
      <p className="no-encontrado__codigo">404</p>
      <h1 className="no-encontrado__titulo">Página no encontrada</h1>
      <Link to="/" className="enlace">Volver al inicio</Link>
    </div>
  );
}
```

---

## 18. Panel de administración

### 18.1 Ruta protegida

```tsx
// src/router/RequireAdmin.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAdmin } from '../hooks/useAdmin';

// Ruta protegida: si no hay sesión de admin, redirige al login y recuerda a dónde quería ir
export default function RequireAdmin() {
  const { esAdmin } = useAdmin();
  const location = useLocation();

  if (!esAdmin) {
    return <Navigate to="/admin/login" replace state={{ desde: location.pathname }} />;
  }
  return <Outlet />;
}
```

- Si no hay sesión, redirige al login y recuerda en `state` a dónde se quería entrar.

> Esto **no** es la seguridad real: la pone la API, que responde 401 sin la clave. La ruta protegida solo evita mostrar pantallas que no van a funcionar.

### 18.2 Login

```css
/* src/pages/admin/LoginPage.css */
.login {
  display: grid;
  gap: 1.25rem;
  max-width: 24rem;
  margin-inline: auto;              /* centra la tarjeta horizontalmente */
  padding: 2rem;
}

.login__cabecera { display: grid; justify-items: center; gap: 0.5rem; text-align: center; }
.login__icono { color: var(--accent); }
.login__titulo { font-size: 1.25rem; font-weight: 700; }
.login__error { color: var(--danger); font-size: 0.875rem; }

.login code {
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  background: var(--bg-hover);
  font-size: 0.85em;
}
```

```tsx
// src/pages/admin/LoginPage.tsx
import { useState, type FormEvent } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { useAdmin } from '../../hooks/useAdmin';
import Button from '../../components/ui/Button';
import '../../components/forms/Formulario.css';
import './LoginPage.css';

export default function LoginPage() {
  const { esAdmin, ingresar } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  const [clave, setClave] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  // RequireAdmin guarda en state la ruta a la que se quería entrar
  const destino = (location.state as { desde?: string } | null)?.desde ?? '/admin/proyectos';

  if (esAdmin) return <Navigate to={destino} replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    try {
      await ingresar(clave);
      navigate(destino, { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login tarjeta">
      <div className="login__cabecera">
        <KeyRound className="login__icono" size={32} aria-hidden="true" />
        <h1 className="login__titulo">Acceso de administrador</h1>
        <p className="texto-suave">Escribe el valor de <code>ADMIN_API_KEY</code> del <code>.env</code> de la API.</p>
      </div>

      <div>
        <label htmlFor="clave" className="campo__etiqueta">Clave</label>
        <input
          id="clave"
          type="password"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
          className="campo__control"
          autoComplete="current-password"
          required
        />
      </div>

      {error && <p role="alert" className="login__error">{error}</p>}

      <Button type="submit" disabled={enviando || !clave} className="btn--bloque">
        {enviando ? 'Verificando...' : 'Ingresar'}
      </Button>
    </form>
  );
}
```

- `.login code`: el estilo se limita a los `<code>` **dentro** del login. Un selector suelto como `code { … }` cambiaría todos los `<code>` de la app.

### 18.3 Páginas del panel

Usan las clases `.panel` y `.panel__barra` de `AdminLayout.css`.

```tsx
// src/pages/admin/AdminProyectosPage.tsx
import { useState } from 'react';
import { FolderKanban, Plus } from 'lucide-react';
import type { Proyecto, ProyectoDTO } from '../../interfaces/Proyecto';
import { useProyectos } from '../../hooks/useProyectos';
import { useTecnologias } from '../../hooks/useTecnologias';
import ProyectoForm from '../../components/forms/ProyectoForm';
import ProyectosTable from '../../components/tables/ProyectosTable';
import Button from '../../components/ui/Button';
import EstadoCarga from '../../components/ui/EstadoCarga';
import Modal from '../../components/ui/Modal';

// undefined = modal cerrado · null = crear · Proyecto = editar ese proyecto
type Edicion = Proyecto | null | undefined;

export default function AdminProyectosPage() {
  const { proyectos, loading, error, crear, actualizar, eliminar } = useProyectos();
  const { tecnologias } = useTecnologias();
  const [edicion, setEdicion] = useState<Edicion>(undefined);
  const [formError, setFormError] = useState<string | null>(null);
  const [accionError, setAccionError] = useState<string | null>(null);

  const abrir = (proyecto: Proyecto | null) => {
    setFormError(null);
    setEdicion(proyecto);
  };
  const cerrar = () => setEdicion(undefined);

  const handleGuardar = async (data: ProyectoDTO) => {
    try {
      setFormError(null);
      if (edicion) await actualizar(edicion.id, data);
      else await crear(data);
      cerrar();
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  const handleEliminar = async (proyecto: Proyecto) => {
    if (!confirm(`¿Eliminar "${proyecto.titulo}"?`)) return;
    try {
      setAccionError(null);
      await eliminar(proyecto.id);
    } catch (err) {
      setAccionError((err as Error).message);
    }
  };

  return (
    <section className="panel">
      <div className="panel__barra">
        <p className="texto-suave">{proyectos.length} proyecto(s)</p>
        <Button onClick={() => abrir(null)} icon={<Plus size={16} />}>Nuevo proyecto</Button>
      </div>

      {accionError && <p role="alert" className="alerta alerta--error">{accionError}</p>}

      <EstadoCarga loading={loading} error={error} vacio={proyectos.length === 0} icon={FolderKanban} textoVacio="Crea el primer proyecto." />
      {!loading && proyectos.length > 0 && (
        <ProyectosTable proyectos={proyectos} onEditar={abrir} onEliminar={handleEliminar} />
      )}

      <Modal open={edicion !== undefined} onClose={cerrar} title={edicion ? 'Editar proyecto' : 'Nuevo proyecto'}>
        {formError && <p role="alert" className="alerta alerta--error">{formError}</p>}
        {/* key: al cambiar de proyecto, React crea un formulario nuevo con sus valores */}
        <ProyectoForm
          key={edicion?.id ?? 'nuevo'}
          proyecto={edicion ?? undefined}
          tecnologias={tecnologias}
          onSubmit={handleGuardar}
          onCancel={cerrar}
        />
      </Modal>
    </section>
  );
}
```

| Concepto | Explicación |
|---|---|
| `Edicion = Proyecto \| null \| undefined` | Un solo estado para el modal: `undefined` cerrado, `null` crear, un proyecto = editarlo. |
| `key={edicion?.id ?? 'nuevo'}` | Al cambiar de proyecto, React crea un formulario nuevo con los valores correctos. |

```tsx
// src/pages/admin/AdminTecnologiasPage.tsx
import { useState } from 'react';
import { Layers, Plus } from 'lucide-react';
import type { Tecnologia, TecnologiaDTO } from '../../interfaces/Tecnologia';
import { useTecnologias } from '../../hooks/useTecnologias';
import TecnologiaForm from '../../components/forms/TecnologiaForm';
import TecnologiasTable from '../../components/tables/TecnologiasTable';
import Button from '../../components/ui/Button';
import EstadoCarga from '../../components/ui/EstadoCarga';
import Modal from '../../components/ui/Modal';

type Edicion = Tecnologia | null | undefined;

export default function AdminTecnologiasPage() {
  const { tecnologias, loading, error, crear, actualizar, eliminar } = useTecnologias();
  const [edicion, setEdicion] = useState<Edicion>(undefined);
  const [formError, setFormError] = useState<string | null>(null);
  const [accionError, setAccionError] = useState<string | null>(null);

  const abrir = (tecnologia: Tecnologia | null) => {
    setFormError(null);
    setEdicion(tecnologia);
  };
  const cerrar = () => setEdicion(undefined);

  const handleGuardar = async (data: TecnologiaDTO) => {
    try {
      setFormError(null);
      if (edicion) await actualizar(edicion.id, data);
      else await crear(data);
      cerrar();
    } catch (err) {
      setFormError((err as Error).message);   // por ejemplo: 409 "Ya existe un registro..."
    }
  };

  const handleEliminar = async (tecnologia: Tecnologia) => {
    const usos = tecnologia._count?.proyectos ?? 0;
    const aviso = usos ? ` Se quitará de ${usos} proyecto(s).` : '';
    if (!confirm(`¿Eliminar "${tecnologia.nombre}"?${aviso}`)) return;
    try {
      setAccionError(null);
      await eliminar(tecnologia.id);
    } catch (err) {
      setAccionError((err as Error).message);
    }
  };

  return (
    <section className="panel">
      <div className="panel__barra">
        <p className="texto-suave">{tecnologias.length} tecnología(s)</p>
        <Button onClick={() => abrir(null)} icon={<Plus size={16} />}>Nueva tecnología</Button>
      </div>

      {accionError && <p role="alert" className="alerta alerta--error">{accionError}</p>}

      <EstadoCarga loading={loading} error={error} vacio={tecnologias.length === 0} icon={Layers} textoVacio="Crea la primera tecnología." />
      {!loading && tecnologias.length > 0 && (
        <TecnologiasTable tecnologias={tecnologias} onEditar={abrir} onEliminar={handleEliminar} />
      )}

      <Modal open={edicion !== undefined} onClose={cerrar} title={edicion ? 'Editar tecnología' : 'Nueva tecnología'}>
        {formError && <p role="alert" className="alerta alerta--error">{formError}</p>}
        <TecnologiaForm key={edicion?.id ?? 'nueva'} tecnologia={edicion ?? undefined} onSubmit={handleGuardar} onCancel={cerrar} />
      </Modal>
    </section>
  );
}
```

```tsx
// src/pages/admin/AdminMensajesPage.tsx
import { useState } from 'react';
import { Inbox } from 'lucide-react';
import type { Mensaje } from '../../interfaces/Mensaje';
import { useMensajes } from '../../hooks/useMensajes';
import MensajesTable from '../../components/tables/MensajesTable';
import EstadoCarga from '../../components/ui/EstadoCarga';

export default function AdminMensajesPage() {
  const [soloNuevos, setSoloNuevos] = useState(true);
  const { mensajes, loading, error, cambiarLeido, eliminar } = useMensajes(soloNuevos);
  const [accionError, setAccionError] = useState<string | null>(null);

  const ejecutar = async (accion: () => Promise<void>) => {
    try {
      setAccionError(null);
      await accion();
    } catch (err) {
      setAccionError((err as Error).message);
    }
  };

  const handleEliminar = (mensaje: Mensaje) => {
    if (!confirm(`¿Eliminar el mensaje de ${mensaje.nombre}?`)) return;
    ejecutar(() => eliminar(mensaje.id));
  };

  return (
    <section className="panel">
      <label className="casilla">
        <input type="checkbox" checked={soloNuevos} onChange={(e) => setSoloNuevos(e.target.checked)} />
        Mostrar solo los no leídos
      </label>

      {accionError && <p role="alert" className="alerta alerta--error">{accionError}</p>}

      <EstadoCarga
        loading={loading}
        error={error}
        vacio={mensajes.length === 0}
        icon={Inbox}
        textoVacio={soloNuevos ? 'No hay mensajes nuevos.' : 'Todavía no llegó ningún mensaje.'}
      />
      {!loading && mensajes.length > 0 && (
        <MensajesTable
          mensajes={mensajes}
          onCambiarLeido={(m) => ejecutar(() => cambiarLeido(m.id, !m.leido))}
          onEliminar={handleEliminar}
        />
      )}
    </section>
  );
}
```

---

## 19. Rutas y punto de entrada

```tsx
// src/router/AppRouter.tsx
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import AdminLayout from '../components/layout/AdminLayout';
import RequireAdmin from './RequireAdmin';
import InicioPage from '../pages/InicioPage';
import ProyectosPage from '../pages/ProyectosPage';
import ProyectoDetallePage from '../pages/ProyectoDetallePage';
import ContactoPage from '../pages/ContactoPage';
import NotFoundPage from '../pages/NotFoundPage';
import LoginPage from '../pages/admin/LoginPage';
import AdminProyectosPage from '../pages/admin/AdminProyectosPage';
import AdminTecnologiasPage from '../pages/admin/AdminTecnologiasPage';
import AdminMensajesPage from '../pages/admin/AdminMensajesPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Portafolio público */}
          <Route index element={<InicioPage />} />
          <Route path="proyectos" element={<ProyectosPage />} />
          <Route path="proyectos/:id" element={<ProyectoDetallePage />} />
          <Route path="contacto" element={<ContactoPage />} />

          {/* Administración */}
          <Route path="admin/login" element={<LoginPage />} />
          <Route path="admin" element={<RequireAdmin />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="proyectos" replace />} />
              <Route path="proyectos" element={<AdminProyectosPage />} />
              <Route path="tecnologias" element={<AdminTecnologiasPage />} />
              <Route path="mensajes" element={<AdminMensajesPage />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

| Concepto | Explicación |
|---|---|
| `<Route element={<Layout />}>` sin `path` | **Ruta de layout**: las rutas de adentro se dibujan en el `<Outlet />`. |
| `proyectos/:id` | **Parámetro de ruta**: `/proyectos/3` → `useParams().id === '3'`. |
| `RequireAdmin` → `AdminLayout` → páginas | Primero se revisa la sesión, luego se dibujan las pestañas y por último la página. |
| `path="*"` | Cualquier otra ruta: página 404. |

```tsx
// src/App.tsx
import AdminProvider from './context/AdminProvider';
import AppRouter from './router/AppRouter';

export default function App() {
  return (
    <AdminProvider>
      <AppRouter />
    </AdminProvider>
  );
}
```

```tsx
// src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- `main.tsx` importa `index.css` **antes** que cualquier componente: las variables de `:root` existen cuando se cargan los demás CSS.

---

## 20. Variables de entorno

Crea `.env` en la raíz del proyecto React:

```env
VITE_API_URL=http://localhost:3000/api
```

- Solo las variables que empiezan con `VITE_` llegan al navegador, y quedan **visibles** en el JavaScript publicado: nunca pongas aquí la clave de administrador.
- Si cambias el `.env`, reinicia `npm run dev`.

En el `.env` de la **API**:

```env
CORS_ORIGIN="http://127.0.0.1:5500,http://localhost:5173"
```

---

## 21. Ejecución y prueba

```bash
npm run dev       # http://localhost:5173
npm run lint      # oxlint
npm run build     # revisa los tipos y compila
npm run preview   # sirve el build
```

### Flujo de prueba sugerido

Con la API corriendo y el seed cargado:

1. **Inicio** → 2 proyectos destacados y 4 tarjetas de habilidades.
2. **Proyectos** → 5 proyectos. "Front-End" → 2 y la URL cambia a `?categoria=FRONTEND`. Elegir "React" → 1 proyecto. Botón **atrás** → vuelve el filtro anterior.
3. Clic en el título de un proyecto → detalle. Probar `/proyectos/abc` → mensaje de error de la API.
4. **Contacto** → enviar vacío (bordes rojos y mensajes) y después completo (mensaje verde).
5. `/admin/mensajes` → redirige al login. Clave incorrecta → "No autorizado". Clave correcta → vuelve a `/admin/mensajes`.
6. **Marcar como leído** → sale de "solo no leídos". Recargar → la sesión sigue.
7. **Proyectos** del panel → crear uno con 2 tecnologías (los "chips" cambian de color al marcarlos), editarlo y eliminarlo.
8. **Tecnologías** → crear "React" otra vez → el modal muestra el 409 de la API.
9. **Salir** → vuelve a la portada; `/admin` vuelve a pedir la clave.
10. Ancho de celular (F12 → modo dispositivo) → todo se apila; la tabla del panel se desplaza dentro de su caja.

> Esta guía se probó así con Chrome contra la API de `guia-nodejs-express-prisma-swagger.md`: `npm run build` y `npm run lint` sin errores ni avisos, y los 10 pasos funcionando.

---

## 22. Ejercicios propuestos

1. **CSS Modules:** pasa `Badge` a `Badge.module.css` (`import styles from './Badge.module.css'` y `className={styles.badge}`). Abre las herramientas del navegador y mira qué nombre de clase genera Vite.
2. **Modo oscuro:** agrega un botón en el `Navbar` que ponga la clase `oscuro` en `<body>` y guárdalo en `localStorage`. En `index.css`, redefine las variables dentro de `body.oscuro { --bg-primary: #0f172a; … }` (igual que la sesión 3): todo el sitio cambia sin tocar los demás CSS.
3. **Animación de entrada:** reutiliza el `@keyframes fadeUp` de la sesión 2 para que las tarjetas de proyecto aparezcan una tras otra (`animation-delay` con `:nth-child`).
4. **Menú hamburguesa:** en pantallas de menos de 640px, oculta `.navbar__menu` y muestra un botón que lo abra (estado con `useState` + modificador `.navbar__menu--abierto`).
5. **Búsqueda:** agrega en `/proyectos` un campo que filtre por título (`?q=`) sin pedir de nuevo a la API.
6. **Confirmación propia:** reemplaza `confirm()` por un componente `ConfirmDialog` que use el `Modal`.
7. **Variables de tema:** cambia `--accent` y `--accent-2` en `index.css` por otros colores y comprueba que botones, enlaces, pestañas y degradados cambian a la vez.
8. **Despliegue:** publica la app en Netlify o Vercel con `VITE_API_URL` apuntando a la API publicada y una regla para que todas las rutas sirvan `index.html`.

---

*Guía para React 19 + Vite 8 + TypeScript + React Router 7 + CSS puro — App del portafolio*
