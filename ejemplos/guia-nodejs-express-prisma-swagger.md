# Guía de Implementación: API REST del Portafolio con Node.js, Express, Prisma, Swagger y PostgreSQL

> **Modelo de datos:** Proyectos · Tecnologías · Mensajes de contacto
>
> **Objetivo:** que el portafolio de la sesión 3 deje de usar datos escritos a mano (`localProjects`) y JSONPlaceholder, y pase a usar **su propia API** con base de datos.

---

## Tabla de Contenidos

1. [Requisitos previos](#1-requisitos-previos)
2. [Inicialización del proyecto](#2-inicialización-del-proyecto)
3. [Variables de entorno](#3-variables-de-entorno)
4. [Prisma y PostgreSQL](#4-prisma-y-postgresql)
5. [Estructura de carpetas](#5-estructura-de-carpetas)
6. [Cliente Prisma compartido](#6-cliente-prisma-compartido)
7. [Configuración de Express](#7-configuración-de-express)
8. [Configuración de Swagger](#8-configuración-de-swagger)
9. [Middlewares](#9-middlewares)
10. [Controladores y rutas](#10-controladores-y-rutas)
11. [Datos iniciales (seed)](#11-datos-iniciales-seed)
12. [Scripts y ejecución](#12-scripts-y-ejecución)
13. [Pruebas con Swagger UI](#13-pruebas-con-swagger-ui)
14. [Conectar el portafolio con la API](#14-conectar-el-portafolio-con-la-api)
15. [Resumen de endpoints](#15-resumen-de-endpoints)
16. [Ejercicios propuestos](#16-ejercicios-propuestos)

---

## 1. Requisitos previos

| Herramienta | Versión | Verificar con |
|---|---|---|
| Node.js | **20.19 o superior** (recomendado 22 LTS) | `node -v` |
| npm | >= 10.x | `npm -v` |
| PostgreSQL | >= 14.x | `psql --version` |

**¿No tienes PostgreSQL instalado?** Puedes levantarlo con Docker:

```bash
docker run -d --name pg-portafolio -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=portafolio_db -p 5432:5432 postgres:16-alpine
```

---

## 2. Inicialización del proyecto

```bash
# Crear directorio del proyecto
mkdir api-portafolio && cd api-portafolio

# Inicializar proyecto Node.js
npm init -y

# Dependencias de producción (versiones fijas para que todos tengan lo mismo)
npm install express@5.3.0 @prisma/client@7.10.1 @prisma/adapter-pg@7.10.1 swagger-ui-express@5.0.1 swagger-jsdoc@6.3.0 dotenv@18.0.8 cors@2.8.6

# Dependencias de desarrollo
npm install -D prisma@7.10.1 nodemon@3.1.14
```

### Descripción de dependencias

| Paquete | Rol |
|---|---|
| `express` | Framework HTTP (versión 5) |
| `@prisma/client` | Cliente generado por Prisma para hacer consultas |
| `@prisma/adapter-pg` | *Driver adapter*: conecta Prisma 7 con PostgreSQL |
| `prisma` | CLI de Prisma: migraciones, `generate`, `studio`, `seed` (solo se usa en desarrollo) |
| `swagger-ui-express` | Sirve la interfaz de Swagger en Express |
| `swagger-jsdoc` | Genera la especificación OpenAPI desde los comentarios JSDoc |
| `dotenv` | Carga variables de entorno desde `.env` |
| `cors` | Permite que el portafolio (otro origen) llame a la API |
| `nodemon` | Reinicia el servidor al guardar cambios |

> **¿Por qué versiones fijas?** `prisma` y `@prisma/client` **deben tener la misma versión**. Sin versión, npm instala la última publicada, que puede ser una versión preliminar o tener cambios incompatibles con esta guía.

---

## 3. Variables de entorno

Crea el archivo `.env` en la raíz del proyecto:

```env
# .env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/portafolio_db"
PORT=3000
NODE_ENV=development

# Orígenes que pueden llamar a la API, separados por coma:
# portafolio HTML con Live Server + app React con Vite (guia-react-gestion-proyectos.md)
CORS_ORIGIN="http://127.0.0.1:5500,http://localhost:5173"

# Clave para crear, editar y borrar (cámbiala por una larga y difícil de adivinar)
ADMIN_API_KEY="cambia-esta-clave"
```

| Variable | Para qué sirve |
|---|---|
| `DATABASE_URL` | `postgresql://USUARIO:CONTRASEÑA@HOST:PUERTO/BASE_DE_DATOS` |
| `PORT` | Puerto del servidor |
| `NODE_ENV` | `development` muestra el detalle de los errores; `production` lo oculta |
| `CORS_ORIGIN` | Desde qué páginas se puede llamar a la API con `fetch` |
| `ADMIN_API_KEY` | Clave que se envía en el header `x-api-key` para las rutas de administración |

> **Importante:** el `.env` tiene contraseñas. Nunca lo subas a GitHub.

```bash
echo ".env" >> .gitignore
echo "node_modules/" >> .gitignore
```

---

## 4. Prisma y PostgreSQL

### 4.1 Inicializar Prisma

```bash
npx prisma init --datasource-provider postgresql --generator-provider prisma-client-js --no-skills
```

Esto crea la carpeta `prisma/` con `schema.prisma` y un archivo de configuración. `--no-skills` evita que se creen carpetas extra para asistentes de IA (`.agents/`, `.claude/`, `.windsurf/`).

### 4.2 Archivo de configuración — `prisma.config.ts`

En **Prisma 7**, la URL de la base de datos ya no va en `schema.prisma`, sino en este archivo. Crea (o reemplaza) `prisma.config.ts` en la **raíz** del proyecto:

```typescript
// prisma.config.ts
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'node prisma/seed.js',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
```

> `prisma init` (7.10) crea este archivo con el nombre `prisma7.config.ts`. Renómbralo a `prisma.config.ts` (el nombre estándar) y reemplaza su contenido por el de arriba. **No dejes los dos archivos.** Al ejecutar cualquier comando de Prisma debe aparecer `Loaded Prisma config from prisma.config.ts`.

| Línea | Qué hace |
|---|---|
| `import 'dotenv/config'` | Prisma 7 **ya no lee el `.env` automáticamente**; esta línea lo carga. |
| `env('DATABASE_URL')` | Lee la variable y muestra un error claro si no existe. |
| `seed: 'node prisma/seed.js'` | Comando que ejecuta `npx prisma db seed` (sección 11). |

### 4.3 Definir el esquema

Reemplaza el contenido de `prisma/schema.prisma`:

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model Proyecto {
  id            Int          @id @default(autoincrement())
  titulo        String
  descripcion   String
  emoji         String       @default("💻")
  categoria     Categoria
  urlDemo       String?
  urlRepo       String?
  destacado     Boolean      @default(false)
  creadoEn      DateTime     @default(now())
  actualizadoEn DateTime     @updatedAt
  tecnologias   Tecnologia[]

  @@map("proyectos")
}

model Tecnologia {
  id        Int            @id @default(autoincrement())
  nombre    String         @unique
  area      AreaTecnologia
  proyectos Proyecto[]

  @@map("tecnologias")
}

model Mensaje {
  id          Int       @id @default(autoincrement())
  nombre      String
  email       String
  servicio    String?
  presupuesto Int?
  fecha       DateTime? @db.Date
  mensaje     String
  leido       Boolean   @default(false)
  creadoEn    DateTime  @default(now())

  @@map("mensajes")
}

enum Categoria {
  FRONTEND
  BACKEND
  FULLSTACK
}

enum AreaTecnologia {
  FRONTEND
  BACKEND
  BASE_DATOS
  HERRAMIENTA
}
```

| Elemento | Qué hace |
|---|---|
| `generator client { provider = "prisma-client-js" }` | Genera el cliente dentro de `node_modules/@prisma/client`, así se importa con `require('@prisma/client')` desde JavaScript. |
| `datasource db` sin `url` | En Prisma 7 la URL está en `prisma.config.ts`. |
| `String?` | El `?` indica que el campo es **opcional** (puede ser `null`). |
| `@default(...)` | Valor por defecto si no se envía. |
| `@updatedAt` | Prisma guarda la fecha cada vez que el registro se actualiza. |
| `@unique` en `nombre` | No puede haber dos tecnologías con el mismo nombre (si se intenta, Prisma lanza el error `P2002`). |
| `tecnologias Tecnologia[]` + `proyectos Proyecto[]` | **Relación N:M implícita**: Prisma crea sola la tabla intermedia `_ProyectoToTecnologia`. |
| `@db.Date` | Guarda solo la fecha, sin hora (para "fecha preferida de contacto"). |
| `@@map("proyectos")` | Nombre de la tabla en PostgreSQL. |
| `enum` | Lista cerrada de valores permitidos. |

### 4.4 Crear la base de datos y ejecutar la migración

```bash
# Crear la base de datos (si no usaste Docker, que ya la crea)
psql -U postgres -c "CREATE DATABASE portafolio_db;"

# Crear las tablas a partir del esquema
npx prisma migrate dev --name init

# Generar el cliente Prisma
npx prisma generate
```

> En Prisma 7, `migrate dev` **ya no ejecuta `generate` automáticamente**. Ejecuta `npx prisma generate` cada vez que cambies el esquema.

### 4.5 Visualizar los datos (opcional)

```bash
npx prisma studio
```

---

## 5. Estructura de carpetas

```
api-portafolio/
├── prisma/
│   ├── migrations/              ← lo crea "prisma migrate dev"
│   ├── schema.prisma
│   └── seed.js
├── src/
│   ├── config/
│   │   └── swagger.js
│   ├── controllers/
│   │   ├── proyecto.controller.js
│   │   ├── tecnologia.controller.js
│   │   └── mensaje.controller.js
│   ├── lib/
│   │   └── prisma.js            ← única instancia de PrismaClient
│   ├── middlewares/
│   │   ├── auth.js              ← clave de administrador
│   │   ├── validar.js           ← validación de datos
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── proyecto.routes.js
│   │   ├── tecnologia.routes.js
│   │   └── mensaje.routes.js
│   └── app.js
├── .env
├── .gitignore
├── prisma.config.ts
└── package.json
```

---

## 6. Cliente Prisma compartido

### `src/lib/prisma.js`

```javascript
// src/lib/prisma.js
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

// Prisma 7 se conecta a PostgreSQL a través de un "driver adapter"
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

// Una sola instancia para toda la app (cada instancia abre su propio pool de conexiones)
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
```

- Todos los controladores hacen `require('../lib/prisma')`. Node guarda el módulo en caché, así que **todos reciben la misma instancia**.
- En Prisma 7 el `adapter` es **obligatorio**: sin él, `new PrismaClient()` lanza un error.

---

## 7. Configuración de Express

### `src/app.js`

```javascript
// src/app.js
require('dotenv').config({ quiet: true });
const express = require('express');
const cors = require('cors');
const { swaggerUi, swaggerSpec } = require('./config/swagger');

const proyectoRoutes = require('./routes/proyecto.routes');
const tecnologiaRoutes = require('./routes/tecnologia.routes');
const mensajeRoutes = require('./routes/mensaje.routes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
// CORS: solo el portafolio (Live Server) puede llamar a la API desde el navegador
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? '*' }));
app.use(express.json());

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use('/api/proyectos', proyectoRoutes);
app.use('/api/tecnologias', tecnologiaRoutes);
app.use('/api/mensajes', mensajeRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Ruta no encontrada
app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// Manejo de errores (siempre al final)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Swagger UI disponible en http://localhost:${PORT}/api-docs`);
});
```

| Parte | Qué hace |
|---|---|
| `require('dotenv').config({ quiet: true })` | Carga el `.env` **antes** que todo lo demás (`src/lib/prisma.js` necesita `DATABASE_URL`). `quiet` evita un mensaje informativo en la consola. |
| `cors({ origin: [...] })` | Solo los orígenes de `CORS_ORIGIN` pueden hacer `fetch` a la API. Si la variable no existe, se permite cualquiera (`'*'`). |
| `express.json()` | Convierte el body JSON en `req.body`. |
| Middleware de 404 | Se ejecuta solo si **ninguna** ruta anterior respondió. |
| `errorHandler` al final | Express reconoce que es de errores porque recibe **4 parámetros** `(err, req, res, next)`. |

---

## 8. Configuración de Swagger

### `src/config/swagger.js`

```javascript
// src/config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Portafolio',
      version: '1.0.0',
      description: 'API REST del portafolio: proyectos, tecnologías y mensajes de contacto',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Servidor de desarrollo',
      },
    ],
    tags: [
      { name: 'Proyectos', description: 'Tarjetas de la sección "Proyectos"' },
      { name: 'Tecnologías', description: 'Sección "Habilidades" y etiquetas de cada proyecto' },
      { name: 'Mensajes', description: 'Formulario de contacto' },
    ],
    components: {
      // Botón "Authorize" de Swagger: se escribe la clave una vez y se envía en cada petición
      securitySchemes: {
        ApiKeyAuth: { type: 'apiKey', in: 'header', name: 'x-api-key' },
      },
      parameters: {
        Id: {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'integer', minimum: 1 },
        },
      },
      schemas: {
        Tecnologia: {
          type: 'object',
          properties: {
            id:     { type: 'integer', example: 1 },
            nombre: { type: 'string',  example: 'React' },
            area:   { type: 'string',  enum: ['FRONTEND', 'BACKEND', 'BASE_DATOS', 'HERRAMIENTA'] },
          },
        },
        CrearTecnologia: {
          type: 'object',
          required: ['nombre', 'area'],
          properties: {
            nombre: { type: 'string', example: 'Vue' },
            area:   { type: 'string', enum: ['FRONTEND', 'BACKEND', 'BASE_DATOS', 'HERRAMIENTA'] },
          },
        },
        Proyecto: {
          type: 'object',
          properties: {
            id:            { type: 'integer', example: 1 },
            titulo:        { type: 'string',  example: 'App de Tareas' },
            descripcion:   { type: 'string',  example: 'Aplicación web con drag & drop y modo oscuro.' },
            emoji:         { type: 'string',  example: '📱' },
            categoria:     { type: 'string',  enum: ['FRONTEND', 'BACKEND', 'FULLSTACK'] },
            urlDemo:       { type: 'string',  nullable: true, example: 'https://demo.ejemplo.com' },
            urlRepo:       { type: 'string',  nullable: true, example: 'https://github.com/usuario/app-tareas' },
            destacado:     { type: 'boolean', example: true },
            creadoEn:      { type: 'string',  format: 'date-time' },
            actualizadoEn: { type: 'string',  format: 'date-time' },
            tecnologias:   { type: 'array', items: { $ref: '#/components/schemas/Tecnologia' } },
          },
        },
        CrearProyecto: {
          type: 'object',
          required: ['titulo', 'descripcion', 'categoria'],
          properties: {
            titulo:        { type: 'string',  example: 'App de Tareas' },
            descripcion:   { type: 'string',  example: 'Aplicación web con drag & drop y modo oscuro.' },
            emoji:         { type: 'string',  example: '📱' },
            categoria:     { type: 'string',  enum: ['FRONTEND', 'BACKEND', 'FULLSTACK'] },
            urlDemo:       { type: 'string',  example: 'https://demo.ejemplo.com' },
            urlRepo:       { type: 'string',  example: 'https://github.com/usuario/app-tareas' },
            destacado:     { type: 'boolean', example: false },
            tecnologiaIds: { type: 'array', items: { type: 'integer' }, example: [1, 2] },
          },
        },
        Mensaje: {
          type: 'object',
          properties: {
            id:          { type: 'integer', example: 1 },
            nombre:      { type: 'string',  example: 'Ana García' },
            email:       { type: 'string',  example: 'ana@email.com' },
            servicio:    { type: 'string',  nullable: true, example: 'Desarrollo Web Full Stack' },
            presupuesto: { type: 'integer', nullable: true, example: 1500 },
            fecha:       { type: 'string',  format: 'date', nullable: true },
            mensaje:     { type: 'string',  example: 'Hola, necesito una página web para mi negocio.' },
            leido:       { type: 'boolean', example: false },
            creadoEn:    { type: 'string',  format: 'date-time' },
          },
        },
        CrearMensaje: {
          type: 'object',
          required: ['nombre', 'email', 'mensaje'],
          properties: {
            nombre:      { type: 'string',  example: 'Ana García' },
            email:       { type: 'string',  example: 'ana@email.com' },
            servicio:    { type: 'string',  example: 'Desarrollo Web Full Stack' },
            presupuesto: { type: 'integer', example: 1500 },
            fecha:       { type: 'string',  format: 'date', example: '2026-11-15' },
            mensaje:     { type: 'string',  example: 'Hola, necesito una página web para mi negocio.' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error:    { type: 'string', example: 'Datos inválidos' },
            detalles: { type: 'array', items: { type: 'string' }, example: ['email no es válido'] },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
```

| Novedad | Para qué sirve |
|---|---|
| `securitySchemes.ApiKeyAuth` | Agrega el botón **Authorize** en Swagger UI para escribir la clave `x-api-key`. |
| `parameters.Id` | Define el parámetro `{id}` **una vez** y se reutiliza con `$ref: '#/components/parameters/Id'`. |
| `servers[0].url` con `PORT` | Si cambias el puerto en `.env`, Swagger lo usa automáticamente. |
| `tags` con descripción | Títulos y descripciones de cada grupo en la interfaz. |

---

## 9. Middlewares

### 9.1 Clave de administrador — `src/middlewares/auth.js`

```javascript
// src/middlewares/auth.js
// Protege las rutas de administración con una clave enviada en el header x-api-key
const requireAdmin = (req, res, next) => {
  if (req.get('x-api-key') !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
};

module.exports = requireAdmin;
```

- `req.get('x-api-key')` lee un header de la petición.
- Si la clave no coincide, responde **401** y **no** llama a `next()`: el controlador nunca se ejecuta.
- Es una protección simple para un portafolio de un solo dueño. Para una app con varios usuarios se usa login con JWT (ver ejercicios).

> ⚠️ **No pongas `ADMIN_API_KEY` en el JavaScript del portafolio.** Cualquiera puede ver el código del navegador. El portafolio solo usa las rutas **públicas**; la clave se usa en Swagger, Postman o un panel de administración propio.

### 9.2 Validación — `src/middlewares/validar.js`

```javascript
// src/middlewares/validar.js
const CATEGORIAS = ['FRONTEND', 'BACKEND', 'FULLSTACK'];
const AREAS = ['FRONTEND', 'BACKEND', 'BASE_DATOS', 'HERRAMIENTA'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const esTextoValido = (valor, min = 1) => typeof valor === 'string' && valor.trim().length >= min;

// Responde 400 con la lista de errores; si no hay errores, pasa al controlador
const responder = (errores, res, next) =>
  errores.length ? res.status(400).json({ error: 'Datos inválidos', detalles: errores }) : next();

// :id debe ser un entero positivo
const validarId = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'El id debe ser un número entero positivo' });
  }
  req.params.id = id;
  next();
};

// POST y PUT envían el proyecto completo
const validarProyecto = (req, res, next) => {
  const { titulo, descripcion, categoria, tecnologiaIds, destacado } = req.body ?? {};
  const errores = [];

  if (!esTextoValido(titulo, 3)) errores.push('titulo es obligatorio (mínimo 3 caracteres)');
  if (!esTextoValido(descripcion, 10)) errores.push('descripcion es obligatoria (mínimo 10 caracteres)');
  if (!CATEGORIAS.includes(categoria)) errores.push(`categoria debe ser: ${CATEGORIAS.join(', ')}`);
  if (tecnologiaIds !== undefined) {
    if (!Array.isArray(tecnologiaIds) || !tecnologiaIds.every(Number.isInteger)) {
      errores.push('tecnologiaIds debe ser un array de números enteros');
    }
  }
  if (destacado !== undefined && typeof destacado !== 'boolean') {
    errores.push('destacado debe ser true o false');
  }

  responder(errores, res, next);
};

const validarTecnologia = (req, res, next) => {
  const { nombre, area } = req.body ?? {};
  const errores = [];

  if (!esTextoValido(nombre)) errores.push('nombre es obligatorio');
  if (!AREAS.includes(area)) errores.push(`area debe ser: ${AREAS.join(', ')}`);

  responder(errores, res, next);
};

const validarMensaje = (req, res, next) => {
  const { nombre, email, mensaje, presupuesto, fecha } = req.body ?? {};
  const errores = [];

  if (!esTextoValido(nombre, 3)) errores.push('nombre es obligatorio (mínimo 3 caracteres)');
  if (typeof email !== 'string' || !EMAIL_REGEX.test(email)) errores.push('email no es válido');
  if (!esTextoValido(mensaje, 20)) errores.push('mensaje es obligatorio (mínimo 20 caracteres)');
  if (presupuesto !== undefined && presupuesto !== '' && Number.isNaN(Number(presupuesto))) {
    errores.push('presupuesto debe ser un número');
  }
  if (fecha && Number.isNaN(Date.parse(fecha))) errores.push('fecha no es válida (formato AAAA-MM-DD)');

  responder(errores, res, next);
};

module.exports = { CATEGORIAS, AREAS, validarId, validarProyecto, validarTecnologia, validarMensaje };
```

- Cada validador junta **todos** los errores en un array y responde una sola vez. Así el usuario ve todo lo que tiene que corregir.
- `validarId` convierte `req.params.id` a número. Los controladores ya lo reciben listo y no repiten `Number(id)`.
- `req.body ?? {}`: en Express 5, `req.body` es `undefined` si la petición no trae body. Así el *destructuring* no falla.
- Las reglas de `validarMensaje` (nombre ≥ 3, mensaje ≥ 20) coinciden con los atributos `minlength` del formulario del portafolio. **Validar en el navegador no alcanza**: cualquiera puede llamar a la API sin pasar por el formulario.

### 9.3 Manejo de errores — `src/middlewares/errorHandler.js`

```javascript
// src/middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err);

  // JSON mal formado en el body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El body no es un JSON válido' });
  }

  // Error de Prisma: registro no encontrado
  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Registro no encontrado' });
  }

  // Error de Prisma: violación de unicidad
  if (err.code === 'P2002') {
    return res.status(409).json({ error: 'Ya existe un registro con ese valor único' });
  }

  // Error de Prisma: clave foránea inválida
  if (err.code === 'P2003') {
    return res.status(400).json({ error: 'Referencia a registro inexistente' });
  }

  // En producción no se muestra el detalle interno del error
  const mensaje = process.env.NODE_ENV === 'production' ? undefined : err.message;
  res.status(500).json({ error: 'Error interno del servidor', mensaje });
};

module.exports = errorHandler;
```

| Código | Cuándo ocurre en esta API | Respuesta |
|---|---|---|
| `entity.parse.failed` | El body no es un JSON válido | 400 |
| `P2025` | `update`/`delete` de un id que no existe, o `tecnologiaIds` con un id inexistente | 404 |
| `P2002` | Crear una tecnología con un `nombre` repetido | 409 |
| `P2003` | Clave foránea inválida | 400 |

---

## 10. Controladores y rutas

> **Express 5 y `async`:** si una función `async` lanza un error (por ejemplo, Prisma no encuentra el registro), Express 5 lo envía solo al `errorHandler`. Por eso los controladores **no necesitan `try/catch`** ni `next(error)`, a diferencia de Express 4.

### 10.1 Proyectos

#### `src/controllers/proyecto.controller.js`

```javascript
// src/controllers/proyecto.controller.js
const prisma = require('../lib/prisma');
const { CATEGORIAS } = require('../middlewares/validar');

// Las tecnologías se devuelven siempre junto con el proyecto
const conTecnologias = { tecnologias: { select: { id: true, nombre: true, area: true } } };

// Arma el objeto data a partir del body (POST y PUT reemplazan el proyecto completo)
const datosProyecto = ({ titulo, descripcion, emoji, categoria, urlDemo, urlRepo, destacado }) => ({
  titulo: titulo.trim(),
  descripcion: descripcion.trim(),
  emoji: emoji || '💻',
  categoria,
  urlDemo: urlDemo || null,
  urlRepo: urlRepo || null,
  destacado: destacado ?? false,
});

const obtenerTodos = async (req, res) => {
  const categoria = req.query.categoria?.toUpperCase();
  const { tecnologia, destacado } = req.query;

  if (categoria && !CATEGORIAS.includes(categoria)) {
    return res.status(400).json({ error: `categoria debe ser: ${CATEGORIAS.join(', ')}` });
  }

  const proyectos = await prisma.proyecto.findMany({
    where: {
      ...(categoria && { categoria }),
      ...(destacado !== undefined && { destacado: destacado === 'true' }),
      ...(tecnologia && {
        tecnologias: { some: { nombre: { equals: tecnologia, mode: 'insensitive' } } },
      }),
    },
    include: conTecnologias,
    orderBy: [{ destacado: 'desc' }, { creadoEn: 'desc' }],
  });
  res.json(proyectos);
};

const obtenerPorId = async (req, res) => {
  const proyecto = await prisma.proyecto.findUnique({
    where: { id: req.params.id },
    include: conTecnologias,
  });
  if (!proyecto) return res.status(404).json({ error: 'Proyecto no encontrado' });
  res.json(proyecto);
};

const crear = async (req, res) => {
  const { tecnologiaIds = [] } = req.body;
  const proyecto = await prisma.proyecto.create({
    data: {
      ...datosProyecto(req.body),
      tecnologias: { connect: tecnologiaIds.map((id) => ({ id })) },
    },
    include: conTecnologias,
  });
  res.status(201).json(proyecto);
};

const actualizar = async (req, res) => {
  const { tecnologiaIds = [] } = req.body;
  const proyecto = await prisma.proyecto.update({
    where: { id: req.params.id },
    data: {
      ...datosProyecto(req.body),
      tecnologias: { set: tecnologiaIds.map((id) => ({ id })) },   // set: reemplaza la lista completa
    },
    include: conTecnologias,
  });
  res.json(proyecto);
};

const eliminar = async (req, res) => {
  await prisma.proyecto.delete({ where: { id: req.params.id } });
  res.status(204).send();
};

module.exports = { obtenerTodos, obtenerPorId, crear, actualizar, eliminar };
```

| Concepto | Explicación |
|---|---|
| `...(condición && { campo })` | **Spread condicional**: si la condición es falsa, no agrega nada al `where`. Así un mismo `findMany` sirve con o sin filtros. |
| `tecnologias: { some: { ... } }` | Filtra los proyectos que tengan **al menos una** tecnología que cumpla la condición. |
| `mode: 'insensitive'` | `?tecnologia=react` encuentra "React" (no distingue mayúsculas). |
| `connect: [{ id: 1 }, { id: 2 }]` | Relaciona el proyecto **nuevo** con tecnologías que **ya existen**. |
| `set: [...]` | En la actualización, **reemplaza** todas las tecnologías del proyecto por las nuevas. |
| `orderBy` con array | Primero los destacados y después los más recientes. |
| `include: conTecnologias` | Devuelve las tecnologías dentro de cada proyecto, así el portafolio hace **una sola petición**. |

#### `src/routes/proyecto.routes.js`

```javascript
// src/routes/proyecto.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/proyecto.controller');
const requireAdmin = require('../middlewares/auth');
const { validarId, validarProyecto } = require('../middlewares/validar');

/**
 * @swagger
 * /api/proyectos:
 *   get:
 *     summary: Listar proyectos del portafolio (con filtros opcionales)
 *     tags: [Proyectos]
 *     parameters:
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *           enum: [FRONTEND, BACKEND, FULLSTACK]
 *         description: Filtrar por categoría (acepta minúsculas)
 *       - in: query
 *         name: tecnologia
 *         schema:
 *           type: string
 *           example: React
 *         description: Filtrar por nombre de tecnología
 *       - in: query
 *         name: destacado
 *         schema:
 *           type: boolean
 *         description: Solo proyectos destacados
 *     responses:
 *       200:
 *         description: Lista de proyectos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Proyecto'
 *       400:
 *         description: Filtro inválido
 */
router.get('/', ctrl.obtenerTodos);

/**
 * @swagger
 * /api/proyectos/{id}:
 *   get:
 *     summary: Obtener un proyecto por ID
 *     tags: [Proyectos]
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proyecto'
 *       404:
 *         description: Proyecto no encontrado
 */
router.get('/:id', validarId, ctrl.obtenerPorId);

/**
 * @swagger
 * /api/proyectos:
 *   post:
 *     summary: Crear un proyecto
 *     tags: [Proyectos]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearProyecto'
 *     responses:
 *       201:
 *         description: Proyecto creado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proyecto'
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Falta la API key o es incorrecta
 */
router.post('/', requireAdmin, validarProyecto, ctrl.crear);

/**
 * @swagger
 * /api/proyectos/{id}:
 *   put:
 *     summary: Reemplazar un proyecto completo
 *     tags: [Proyectos]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearProyecto'
 *     responses:
 *       200:
 *         description: Proyecto actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Proyecto'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Falta la API key o es incorrecta
 *       404:
 *         description: Proyecto o tecnología no encontrada
 */
router.put('/:id', requireAdmin, validarId, validarProyecto, ctrl.actualizar);

/**
 * @swagger
 * /api/proyectos/{id}:
 *   delete:
 *     summary: Eliminar un proyecto
 *     tags: [Proyectos]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       204:
 *         description: Proyecto eliminado
 *       401:
 *         description: Falta la API key o es incorrecta
 *       404:
 *         description: Proyecto no encontrado
 */
router.delete('/:id', requireAdmin, validarId, ctrl.eliminar);

module.exports = router;
```

**Cadena de middlewares:** `router.post('/', requireAdmin, validarProyecto, ctrl.crear)` se ejecuta **en orden**. Si `requireAdmin` responde 401, no se llega a validar. Si `validarProyecto` responde 400, no se llega al controlador.

### 10.2 Tecnologías

#### `src/controllers/tecnologia.controller.js`

```javascript
// src/controllers/tecnologia.controller.js
const prisma = require('../lib/prisma');
const { AREAS } = require('../middlewares/validar');

const obtenerTodas = async (req, res) => {
  const area = req.query.area?.toUpperCase();

  if (area && !AREAS.includes(area)) {
    return res.status(400).json({ error: `area debe ser: ${AREAS.join(', ')}` });
  }

  const tecnologias = await prisma.tecnologia.findMany({
    where: area ? { area } : {},
    include: { _count: { select: { proyectos: true } } },   // cuántos proyectos la usan
    orderBy: { nombre: 'asc' },
  });
  res.json(tecnologias);
};

const obtenerPorId = async (req, res) => {
  const tecnologia = await prisma.tecnologia.findUnique({
    where: { id: req.params.id },
    include: { proyectos: { select: { id: true, titulo: true } } },
  });
  if (!tecnologia) return res.status(404).json({ error: 'Tecnología no encontrada' });
  res.json(tecnologia);
};

const crear = async (req, res) => {
  const { nombre, area } = req.body;
  const tecnologia = await prisma.tecnologia.create({ data: { nombre: nombre.trim(), area } });
  res.status(201).json(tecnologia);
};

const actualizar = async (req, res) => {
  const { nombre, area } = req.body;
  const tecnologia = await prisma.tecnologia.update({
    where: { id: req.params.id },
    data: { nombre: nombre.trim(), area },
  });
  res.json(tecnologia);
};

const eliminar = async (req, res) => {
  await prisma.tecnologia.delete({ where: { id: req.params.id } });
  res.status(204).send();
};

module.exports = { obtenerTodas, obtenerPorId, crear, actualizar, eliminar };
```

- `_count: { select: { proyectos: true } }` agrega `"_count": { "proyectos": 2 }` a cada tecnología. Sirve para mostrar "React · 2 proyectos" en la sección de habilidades.
- Al borrar una tecnología, Prisma borra también sus filas en la tabla intermedia. Los proyectos **no se borran**; solo pierden esa etiqueta.

#### `src/routes/tecnologia.routes.js`

```javascript
// src/routes/tecnologia.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/tecnologia.controller');
const requireAdmin = require('../middlewares/auth');
const { validarId, validarTecnologia } = require('../middlewares/validar');

/**
 * @swagger
 * /api/tecnologias:
 *   get:
 *     summary: Listar tecnologías (sección "Habilidades" del portafolio)
 *     tags: [Tecnologías]
 *     parameters:
 *       - in: query
 *         name: area
 *         schema:
 *           type: string
 *           enum: [FRONTEND, BACKEND, BASE_DATOS, HERRAMIENTA]
 *         description: Filtrar por área (acepta minúsculas)
 *     responses:
 *       200:
 *         description: Lista de tecnologías con la cantidad de proyectos que las usan
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Tecnologia'
 */
router.get('/', ctrl.obtenerTodas);

/**
 * @swagger
 * /api/tecnologias/{id}:
 *   get:
 *     summary: Obtener una tecnología y los proyectos que la usan
 *     tags: [Tecnologías]
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       200:
 *         description: Tecnología encontrada
 *       404:
 *         description: Tecnología no encontrada
 */
router.get('/:id', validarId, ctrl.obtenerPorId);

/**
 * @swagger
 * /api/tecnologias:
 *   post:
 *     summary: Crear una tecnología
 *     tags: [Tecnologías]
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearTecnologia'
 *     responses:
 *       201:
 *         description: Tecnología creada
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: Falta la API key o es incorrecta
 *       409:
 *         description: Ya existe una tecnología con ese nombre
 */
router.post('/', requireAdmin, validarTecnologia, ctrl.crear);

/**
 * @swagger
 * /api/tecnologias/{id}:
 *   put:
 *     summary: Actualizar una tecnología
 *     tags: [Tecnologías]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearTecnologia'
 *     responses:
 *       200:
 *         description: Tecnología actualizada
 *       401:
 *         description: Falta la API key o es incorrecta
 *       404:
 *         description: Tecnología no encontrada
 */
router.put('/:id', requireAdmin, validarId, validarTecnologia, ctrl.actualizar);

/**
 * @swagger
 * /api/tecnologias/{id}:
 *   delete:
 *     summary: Eliminar una tecnología (se quita de los proyectos que la usaban)
 *     tags: [Tecnologías]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       204:
 *         description: Tecnología eliminada
 *       401:
 *         description: Falta la API key o es incorrecta
 *       404:
 *         description: Tecnología no encontrada
 */
router.delete('/:id', requireAdmin, validarId, ctrl.eliminar);

module.exports = router;
```

### 10.3 Mensajes de contacto

#### `src/controllers/mensaje.controller.js`

```javascript
// src/controllers/mensaje.controller.js
const prisma = require('../lib/prisma');

// Público: lo usa el formulario de contacto del portafolio
const crear = async (req, res) => {
  const { nombre, email, servicio, presupuesto, fecha, mensaje } = req.body;
  const nuevo = await prisma.mensaje.create({
    data: {
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      servicio: servicio || null,
      presupuesto: presupuesto ? Number(presupuesto) : null,
      fecha: fecha ? new Date(fecha) : null,
      mensaje: mensaje.trim(),
    },
  });
  // Solo se devuelve el id: el visitante no necesita ver el registro completo
  res.status(201).json({ id: nuevo.id, mensaje: 'Mensaje recibido. ¡Gracias por escribir!' });
};

// Admin: bandeja de entrada (?leido=false para ver solo los nuevos)
const obtenerTodos = async (req, res) => {
  const { leido } = req.query;
  const mensajes = await prisma.mensaje.findMany({
    where: leido !== undefined ? { leido: leido === 'true' } : {},
    orderBy: { creadoEn: 'desc' },
  });
  res.json(mensajes);
};

// Admin: PATCH cambia solo el campo leido
const marcarLeido = async (req, res) => {
  const { leido = true } = req.body ?? {};
  if (typeof leido !== 'boolean') {
    return res.status(400).json({ error: 'leido debe ser true o false' });
  }
  const mensaje = await prisma.mensaje.update({
    where: { id: req.params.id },
    data: { leido },
  });
  res.json(mensaje);
};

const eliminar = async (req, res) => {
  await prisma.mensaje.delete({ where: { id: req.params.id } });
  res.status(204).send();
};

module.exports = { crear, obtenerTodos, marcarLeido, eliminar };
```

- El formulario envía todo como **texto** (`"presupuesto": "500"`, `"fecha": ""`). El controlador lo convierte: `Number(...)`, `new Date(...)`, y `null` cuando el campo viene vacío.
- **PUT vs PATCH**: `PUT` reemplaza el recurso **completo** (proyectos, tecnologías). `PATCH` cambia **solo algunos campos** (aquí, solo `leido`).

#### `src/routes/mensaje.routes.js`

```javascript
// src/routes/mensaje.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/mensaje.controller');
const requireAdmin = require('../middlewares/auth');
const { validarId, validarMensaje } = require('../middlewares/validar');

/**
 * @swagger
 * /api/mensajes:
 *   post:
 *     summary: Enviar un mensaje desde el formulario de contacto (público)
 *     tags: [Mensajes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CrearMensaje'
 *     responses:
 *       201:
 *         description: Mensaje recibido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:      { type: integer, example: 1 }
 *                 mensaje: { type: string, example: 'Mensaje recibido. ¡Gracias por escribir!' }
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', validarMensaje, ctrl.crear);

/**
 * @swagger
 * /api/mensajes:
 *   get:
 *     summary: Bandeja de entrada de mensajes (admin)
 *     tags: [Mensajes]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: query
 *         name: leido
 *         schema:
 *           type: boolean
 *         description: false = solo los mensajes nuevos
 *     responses:
 *       200:
 *         description: Lista de mensajes, del más reciente al más antiguo
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mensaje'
 *       401:
 *         description: Falta la API key o es incorrecta
 */
router.get('/', requireAdmin, ctrl.obtenerTodos);

/**
 * @swagger
 * /api/mensajes/{id}:
 *   patch:
 *     summary: Marcar un mensaje como leído o no leído (admin)
 *     tags: [Mensajes]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leido: { type: boolean, example: true }
 *     responses:
 *       200:
 *         description: Mensaje actualizado
 *       401:
 *         description: Falta la API key o es incorrecta
 *       404:
 *         description: Mensaje no encontrado
 */
router.patch('/:id', requireAdmin, validarId, ctrl.marcarLeido);

/**
 * @swagger
 * /api/mensajes/{id}:
 *   delete:
 *     summary: Eliminar un mensaje (admin)
 *     tags: [Mensajes]
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *     responses:
 *       204:
 *         description: Mensaje eliminado
 *       401:
 *         description: Falta la API key o es incorrecta
 *       404:
 *         description: Mensaje no encontrado
 */
router.delete('/:id', requireAdmin, validarId, ctrl.eliminar);

module.exports = router;
```

---

## 11. Datos iniciales (seed)

El seed carga en la base de datos los **mismos 5 proyectos** que hoy están escritos en `localProjects` (`sesion3/js/app.js`).

### `prisma/seed.js`

```javascript
// prisma/seed.js — carga los datos iniciales del portafolio
require('dotenv').config({ quiet: true });
const prisma = require('../src/lib/prisma');

const tecnologias = [
  { nombre: 'HTML5', area: 'FRONTEND' },
  { nombre: 'CSS Grid', area: 'FRONTEND' },
  { nombre: 'Flexbox', area: 'FRONTEND' },
  { nombre: 'CSS Modules', area: 'FRONTEND' },
  { nombre: 'JavaScript', area: 'FRONTEND' },
  { nombre: 'React', area: 'FRONTEND' },
  { nombre: 'Chart.js', area: 'FRONTEND' },
  { nombre: 'Fetch API', area: 'FRONTEND' },
  { nombre: 'Node.js', area: 'BACKEND' },
  { nombre: 'Express', area: 'BACKEND' },
  { nombre: 'JWT', area: 'BACKEND' },
  { nombre: 'OpenWeather', area: 'HERRAMIENTA' },
  { nombre: 'PostgreSQL', area: 'BASE_DATOS' },
  { nombre: 'MySQL', area: 'BASE_DATOS' },
];

// Los mismos 5 proyectos que localProjects en sesion3/js/app.js
const proyectos = [
  {
    titulo: 'App de Tareas', emoji: '📱', categoria: 'FRONTEND', destacado: true,
    descripcion: 'Aplicación web con drag & drop, almacenamiento local y modo oscuro.',
    tecnologias: ['React', 'CSS Modules', 'Flexbox'],
  },
  {
    titulo: 'EcoShop', emoji: '🌿', categoria: 'FRONTEND',
    descripcion: 'E-commerce sostenible con sistema de filtros y carrito de compras.',
    tecnologias: ['HTML5', 'CSS Grid', 'JavaScript'],
  },
  {
    titulo: 'Dashboard Analytics', emoji: '📊', categoria: 'FULLSTACK', destacado: true,
    descripcion: 'Panel con gráficas en tiempo real, filtros dinámicos y exportación.',
    tecnologias: ['Node.js', 'PostgreSQL', 'Chart.js'],
  },
  {
    titulo: 'REST API – Inventario', emoji: '🔧', categoria: 'BACKEND',
    descripcion: 'API REST completa con autenticación JWT y documentación Swagger.',
    tecnologias: ['Express', 'MySQL', 'JWT'],
  },
  {
    titulo: 'GeoWeather App', emoji: '🌍', categoria: 'FULLSTACK',
    descripcion: 'Consulta clima en tiempo real usando la API de OpenWeather y países.',
    tecnologias: ['React', 'Fetch API', 'OpenWeather'],
  },
];

async function main() {
  // Borrar en orden para poder ejecutar el seed varias veces
  await prisma.mensaje.deleteMany();
  await prisma.proyecto.deleteMany();
  await prisma.tecnologia.deleteMany();

  await prisma.tecnologia.createMany({ data: tecnologias });

  for (const { tecnologias: nombres, ...datos } of proyectos) {
    await prisma.proyecto.create({
      data: {
        ...datos,
        // connect por un campo @unique (nombre) en lugar del id
        tecnologias: { connect: nombres.map((nombre) => ({ nombre })) },
      },
    });
  }

  console.log(`Seed listo: ${tecnologias.length} tecnologías y ${proyectos.length} proyectos`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
```

- `createMany` inserta todas las tecnologías en **una sola consulta**.
- `connect: [{ nombre: 'React' }]` funciona porque `nombre` es `@unique`. Así el seed no necesita conocer los ids.
- `const { tecnologias: nombres, ...datos } of proyectos`: **destructuring con renombrado + rest** dentro del `for...of`. Separa el array de nombres del resto de los datos del proyecto.
- ⚠️ El seed **borra todo** antes de insertar. No lo ejecutes en una base de datos con datos reales.

---

## 12. Scripts y ejecución

Reemplaza la sección `scripts` de `package.json`:

```json
{
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio"
  }
}
```

> Dentro de los scripts de npm no hace falta escribir `npx`: npm ya busca los comandos en `node_modules/.bin`.

### Puesta en marcha (de cero)

```bash
npm run db:migrate -- --name init   # crea las tablas
npm run db:generate                 # genera el cliente Prisma
npm run db:seed                     # carga los 5 proyectos y 14 tecnologías
npm run dev                         # inicia el servidor con recarga automática
```

Deberías ver:

```
Servidor corriendo en http://localhost:3000
Swagger UI disponible en http://localhost:3000/api-docs
```

---

## 13. Pruebas con Swagger UI

Abre `http://localhost:3000/api-docs`.

1. Las rutas **sin candado** son públicas: pruébalas directamente con **Try it out**.
2. Para las rutas **con candado** 🔒, haz clic en **Authorize**, escribe el valor de `ADMIN_API_KEY` y confirma.

### Flujo de prueba sugerido

1. **GET** `/api/proyectos` → los 5 proyectos del seed, con sus tecnologías.
2. **GET** `/api/proyectos?categoria=frontend` → solo App de Tareas y EcoShop.
3. **GET** `/api/proyectos?tecnologia=react` → App de Tareas y GeoWeather App.
4. **GET** `/api/tecnologias?area=base_datos` → PostgreSQL y MySQL, cada una con `_count.proyectos`.
5. **POST** `/api/proyectos` **sin** Authorize → `401 No autorizado`.
6. **Authorize** y **POST** `/api/proyectos` con `{ "titulo": "a" }` → `400` con la lista `detalles`.
7. **POST** `/api/proyectos` con datos válidos y `tecnologiaIds` tomados del paso 4 → `201`.
8. **POST** `/api/tecnologias` con `{ "nombre": "React", "area": "FRONTEND" }` → `409` (nombre repetido).
9. **POST** `/api/mensajes` (público) → `201 Mensaje recibido`.
10. **GET** `/api/mensajes?leido=false` → aparece el mensaje del paso 9.
11. **PATCH** `/api/mensajes/{id}` con `{ "leido": true }` → el mensaje queda marcado como leído.
12. **GET** `/api/proyectos/abc` → `400 El id debe ser un número entero positivo`.

---

## 14. Conectar el portafolio con la API

Con la API corriendo (`npm run dev`) y el portafolio abierto con **Live Server** (`http://127.0.0.1:5500`), estos son los cambios en `sesion3/js/app.js`.

### 14.1 URL base

Junto a las demás constantes:

```js
const API_PORTAFOLIO = 'http://localhost:3000/api';
```

### 14.2 Proyectos desde la base de datos

Reemplaza `fetchProjects()`. La API responde en español (`titulo`, `categoria: 'FRONTEND'`…) y la clase `Project` espera los nombres del front (`title`, `category: 'frontend'`…). Por eso se hace un **mapeo**:

```js
async function fetchProjects() {
  const loader = document.getElementById('projects-loader');
  if (loader) loader.classList.remove('hidden');

  try {
    const proyectos = await fetchJSON(`${API_PORTAFOLIO}/proyectos`);

    // Mapeo: formato de la API → formato de la clase Project
    projectsData = proyectos.map(({ id, titulo, descripcion, emoji, categoria, tecnologias }) =>
      new Project({
        id,
        title: titulo,
        description: descripcion,
        emoji,
        category: categoria.toLowerCase(),        // 'FRONTEND' → 'frontend' (como data-filter)
        techs: tecnologias.map((t) => t.nombre),  // [{ nombre: 'React' }] → ['React']
      })
    );

    renderProjects(currentFilter);
  } catch (err) {
    // Si la API está apagada, el portafolio sigue mostrando localProjects
    console.error('Error al cargar proyectos:', err);
    showToast('No se pudo conectar con la API. Se muestran los proyectos locales.', 'error');
  } finally {
    if (loader) loader.classList.add('hidden');
  }
}
```

- Ahora `projectsData` trae **todos** los proyectos desde la base de datos; ya no se mezclan con los de JSONPlaceholder. Si tu HTML tiene el botón de filtro **API** (`data-filter="api"`), quítalo.
- Si la API no responde, `projectsData` queda vacío y `getAllProjects()` usa `localProjects` como **respaldo**.
- Llama a `fetchProjects()` dentro de `DOMContentLoaded` (o desde `loadDashboardData()`, como en `ejemplos/assets/js/app.js`).

### 14.3 Formulario de contacto

Dentro del `submit` de `initContactForm()`, reemplaza el `fetch` a JSONPlaceholder:

```js
// Todos los campos del formulario: nombre, email, fecha, presupuesto, servicio, mensaje
const datos = Object.fromEntries(new FormData(contactForm));

try {
  await validateEmail(datos.email);

  const res = await fetch(`${API_PORTAFOLIO}/mensajes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  const data = await res.json();

  // 400: la API devuelve la lista de errores en "detalles"
  if (!res.ok) throw new Error(data.detalles?.join(', ') ?? data.error);

  localStorage.removeItem('form-draft');
  contactForm.reset();
  showToast(`✅ ${data.mensaje}`);
} catch (err) {
  showToast(`❌ ${err.message}`, 'error');
} finally {
  btnSubmit.textContent = 'Enviar mensaje →';
  btnSubmit.disabled = false;
}
```

- Los nombres de los campos del formulario (`name="nombre"`, `name="email"`…) son **los mismos** que espera la API. Por eso `FormData` se envía tal cual, sin mapeo.
- Revisa el mensaje en Swagger (**GET** `/api/mensajes`) o en Prisma Studio.

### 14.4 Errores comunes

| Síntoma en la consola del navegador | Causa | Solución |
|---|---|---|
| `blocked by CORS policy` | El origen del portafolio no está en `CORS_ORIGIN` | Agrega la URL exacta que muestra Live Server (`http://127.0.0.1:5500` **no es lo mismo que** `http://localhost:5500`) y reinicia la API |
| `Failed to fetch` / `ERR_CONNECTION_REFUSED` | La API no está corriendo | `npm run dev` |
| `400 Datos inválidos` al enviar el formulario | Nombre de menos de 3 caracteres o mensaje de menos de 20 | Revisa el toast: muestra los `detalles` |
| `P1001: Can't reach database server` | PostgreSQL apagado o `DATABASE_URL` incorrecta | Inicia PostgreSQL o el contenedor de Docker |

---

## 15. Resumen de endpoints

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/health` | Público | Estado del servidor |
| GET | `/api/proyectos` | Público | Listar proyectos (filtros: `categoria`, `tecnologia`, `destacado`) |
| GET | `/api/proyectos/:id` | Público | Obtener un proyecto |
| POST | `/api/proyectos` | 🔒 Admin | Crear un proyecto |
| PUT | `/api/proyectos/:id` | 🔒 Admin | Reemplazar un proyecto |
| DELETE | `/api/proyectos/:id` | 🔒 Admin | Eliminar un proyecto |
| GET | `/api/tecnologias` | Público | Listar tecnologías (filtro: `area`) |
| GET | `/api/tecnologias/:id` | Público | Obtener una tecnología y sus proyectos |
| POST | `/api/tecnologias` | 🔒 Admin | Crear una tecnología |
| PUT | `/api/tecnologias/:id` | 🔒 Admin | Actualizar una tecnología |
| DELETE | `/api/tecnologias/:id` | 🔒 Admin | Eliminar una tecnología |
| POST | `/api/mensajes` | Público | Enviar el formulario de contacto |
| GET | `/api/mensajes` | 🔒 Admin | Bandeja de entrada (filtro: `leido`) |
| PATCH | `/api/mensajes/:id` | 🔒 Admin | Marcar como leído / no leído |
| DELETE | `/api/mensajes/:id` | 🔒 Admin | Eliminar un mensaje |

🔒 = requiere el header `x-api-key` con el valor de `ADMIN_API_KEY`.

---

## 16. Ejercicios propuestos

1. **Habilidades dinámicas:** en el portafolio, genera las tarjetas de "Acerca de" con `GET /api/tecnologias` agrupando por `area` (pista: `reduce`, como `countByCategory`).
2. **Modelo `Perfil`:** agrega un modelo con nombre, rol, ubicación, bio y `disponible`, y un endpoint `GET /api/perfil` para llenar el hero (reemplaza a `devProfile`).
3. **Paginación:** agrega `?pagina=1&limite=6` a `GET /api/proyectos` usando `skip` y `take` de Prisma.
4. **Límite de envíos:** instala `express-rate-limit` y limita `POST /api/mensajes` a 5 envíos por hora por IP, para evitar spam.
5. **Botones Demo y Código:** muestra `urlDemo` y `urlRepo` en cada tarjeta de proyecto (agrégalos a la clase `Project`).
6. **Login con JWT:** reemplaza `x-api-key` por un login (`POST /api/auth/login`) que devuelva un token JWT, guardando la contraseña con `bcrypt`.
7. **Despliegue:** publica la API en Render o Railway con una base de datos PostgreSQL en la nube, y cambia `API_PORTAFOLIO` y `CORS_ORIGIN` por las URLs de producción.

---

*Guía para Node.js 22 + Express 5 + Prisma 7 + Swagger + PostgreSQL — API del portafolio*
