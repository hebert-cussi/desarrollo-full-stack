# Desarrollo Full Stack — Portafolio

Repositorio del curso de **Desarrollo Full Stack**. Se construye, sesión a sesión, un **portafolio personal**: primero el frontend (HTML5, CSS3 y JavaScript) y luego una **API REST** con Node.js, Express, Prisma y PostgreSQL que sirve los proyectos del portafolio.

---

## Estructura del repositorio

```
desarrollo-full-stack/
├── sesion1/                  ← Portafolio con HTML5 semántico y CSS3
├── sesion2/                  ← Portafolio con CSS Grid, responsive y animaciones
├── sesion3/                  ← Portafolio con JavaScript (DOM, eventos, fetch, storage)
├── api-portafolio/           ← API REST (Node.js + Express + Prisma + PostgreSQL + Swagger)
├── ejemplos/                 ← Versiones de referencia y guías paso a paso
├── git/                      ← Material de apoyo sobre Git (carrusel HTML)
├── JavaScript_Portafolio.html← Material de apoyo: JavaScript aplicado al portafolio
└── silabo_full_stack.docx    ← Sílabo del curso
```

| Carpeta | Contenido | Tecnologías |
|---|---|---|
| [`sesion1/`](sesion1/) | Página de portafolio estática: header, secciones (inicio, proyectos, habilidades, contacto) y footer. Ver [README](sesion1/README.md). | HTML5, CSS3 (variables, Flexbox, pseudo-elementos, transiciones) |
| [`sesion2/`](sesion2/) | El portafolio pasa a ser responsive y animado. | CSS Grid, media queries, animaciones |
| [`sesion3/`](sesion3/) | Se agrega interactividad: render de proyectos, formulario de contacto y consumo de APIs públicas (JSONPlaceholder, PokéAPI, REST Countries). Ver [README](sesion3/README.md). | JavaScript ES6+, DOM, eventos, `fetch`, `async/await`, Web Storage |
| [`api-portafolio/`](api-portafolio/) | Backend que expone el CRUD de proyectos del portafolio. | Node.js, Express 5, Prisma 7, PostgreSQL, Swagger |
| [`ejemplos/`](ejemplos/) | Soluciones de referencia de cada sesión y guías de implementación. | — |

---

## Frontend (sesiones 1 a 3)

Son páginas estáticas, sin build ni dependencias. Para verlas:

- Abre el `index.html` de la sesión directamente en el navegador, **o**
- Usa la extensión **Live Server** de VS Code (sirve en `http://127.0.0.1:5500`, origen ya permitido por el CORS de la API).

```
sesionN/
├── index.html
├── css/        ← estilos
└── js/         ← (sesión 3) lógica en JavaScript
```

---

## API REST (`api-portafolio/`)

API que gestiona los proyectos que se muestran en la sección "Proyectos" del portafolio.

### Requisitos

- Node.js 22 o superior
- PostgreSQL (local o en Docker)

### Instalación y puesta en marcha

```bash
cd api-portafolio
npm install

# 1. Variables de entorno
cp .env-example .env        # y edita los valores

# 2. Base de datos: aplicar migraciones y generar el cliente de Prisma
npx prisma migrate dev
npx prisma generate

# 3. Levantar el servidor
npm run dev                 # con nodemon (recarga al guardar)
# o
npm start                   # node src/app.js
```

> El punto de entrada es `src/app.js`. Si ejecutas `node app.js` desde la raíz de `api-portafolio` obtendrás `Cannot find module`; usa `npm start` o `node src/app.js`.

### Variables de entorno (`.env`)

| Variable | Ejemplo | Descripción |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres:password123@localhost:3254/portafolio_db` | Cadena de conexión a PostgreSQL |
| `PORT` | `3000` | Puerto del servidor |
| `NODE_ENV` | `development` | Entorno de ejecución |
| `CORS_ORIGIN` | `http://127.0.0.1:5500,http://localhost:5173` | Orígenes permitidos, separados por coma (Live Server y Vite) |
| `ADMIN_API_KEY` | `cambia-esta-clave` | Clave para las rutas de escritura (header `x-api-key`) |
| `DOCUMENTATION` | `/api-docs` | Ruta donde se publica Swagger UI (por defecto `/documentation`) |

### Estructura

```
api-portafolio/
├── prisma/
│   ├── schema.prisma         ← modelos y enums
│   └── migrations/           ← migraciones SQL
├── prisma.config.ts          ← configuración de Prisma (schema, migraciones, datasource)
└── src/
    ├── app.js                ← servidor Express (CORS, JSON, Swagger, rutas, 404, errores)
    ├── config/swagger.js     ← especificación OpenAPI 3.0
    ├── lib/prisma.js         ← cliente de Prisma con el adaptador de PostgreSQL
    ├── routes/               ← definición de rutas + anotaciones @swagger
    ├── controllers/          ← lógica de cada endpoint
    └── middlewares/          ← validaciones (validar.js) y manejo de errores (errorHandler.js)
```

### Modelo de datos

| Modelo | Campos principales |
|---|---|
| **Proyecto** (`proyectos`) | `titulo`, `descripcion`, `emoji`, `categoria` (`FRONTEND` / `BACKEND` / `FULLSTACK`), `urlDemo`, `urlRepo`, `destacado`, `tecnologias`, `creadoEn`, `actualizadoEn` |
| **Tecnologia** (`tecnologias`) | `nombre` (único), `area` (`FRONTEND` / `BACKEND` / `BASE_DATOS` / `HERRAMIENTA`) |
| **Mensaje** (`mensajes`) | `nombre`, `email`, `servicio`, `presupuesto`, `fecha`, `mensaje`, `leido` |

`Proyecto` y `Tecnologia` tienen una relación muchos a muchos.

### Endpoints

Base: `http://localhost:3000/api/proyectos`

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/proyectos` | Lista proyectos. Filtros opcionales: `?categoria=`, `?tecnologia=`, `?destacado=true` |
| `GET` | `/api/proyectos/:id` | Obtiene un proyecto por ID |
| `POST` | `/api/proyectos` | Crea un proyecto |
| `PUT` | `/api/proyectos/:id` | Reemplaza un proyecto completo |
| `DELETE` | `/api/proyectos/:id` | Elimina un proyecto |

Ejemplo de cuerpo para `POST` / `PUT`:

```json
{
  "titulo": "App de Tareas",
  "descripcion": "Aplicación web con drag & drop y modo oscuro.",
  "emoji": "📱",
  "categoria": "FRONTEND",
  "urlDemo": "https://demo.ejemplo.com",
  "urlRepo": "https://github.com/usuario/app-tareas",
  "destacado": false,
  "tecnologiaIds": [1, 2]
}
```

Las rutas inexistentes responden `404 { "error": "Ruta no encontrada" }`.

### Documentación interactiva (Swagger)

Con el servidor levantado, abre `http://localhost:3000/api-docs` (o la ruta definida en `DOCUMENTATION`). Desde ahí puedes probar cada endpoint; el botón **Authorize** permite enviar la clave en el header `x-api-key`.

### Pendiente

- Las rutas de escritura están documentadas con `x-api-key`, pero todavía no hay un middleware que valide `ADMIN_API_KEY`.
- Endpoints de **Tecnologías** y **Mensajes** (los modelos ya existen; en Swagger están comentados).
- `prisma.config.ts` hace referencia a `prisma/seed.js`, que aún no existe.

---

## Guías (`ejemplos/`)

| Guía | Tema |
|---|---|
| [`sesion1-guia.md`](ejemplos/sesion1-guia.md) | Portafolio completo con HTML5 + CSS3 + JS |
| [`sesion2-guia.md`](ejemplos/sesion2-guia.md) | CSS Grid, responsive y animaciones |
| [`sesion3-guia.md`](ejemplos/sesion3-guia.md) | JavaScript ES6+, DOM, eventos y storage |
| [`guia-nodejs-express-prisma-swagger.md`](ejemplos/guia-nodejs-express-prisma-swagger.md) | API REST con Node.js, Express, Prisma, Swagger y PostgreSQL |
| [`guia-react-gestion-proyectos.md`](ejemplos/guia-react-gestion-proyectos.md) | App React del portafolio (gestión de proyectos) |
| [`guia-react-portafolio-css.md`](ejemplos/guia-react-portafolio-css.md) | App React del portafolio con CSS puro |

Las páginas `ejemplos/sesion1.html`, `sesion2.html` y `sesion3.html` (con sus estilos y scripts en `ejemplos/assets/`) son las soluciones de referencia de cada sesión.

---

## Autor

**Hebert Cussi Cuentas** — Desarrollador Full Stack
