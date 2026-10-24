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
      //{ name: 'Tecnologías', description: 'Sección "Habilidades" y etiquetas de cada proyecto' },
      //{ name: 'Mensajes', description: 'Formulario de contacto' },
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
        // Mensaje: {
        //   type: 'object',
        //   properties: {
        //     id:          { type: 'integer', example: 1 },
        //     nombre:      { type: 'string',  example: 'Ana García' },
        //     email:       { type: 'string',  example: 'ana@email.com' },
        //     servicio:    { type: 'string',  nullable: true, example: 'Desarrollo Web Full Stack' },
        //     presupuesto: { type: 'integer', nullable: true, example: 1500 },
        //     fecha:       { type: 'string',  format: 'date', nullable: true },
        //     mensaje:     { type: 'string',  example: 'Hola, necesito una página web para mi negocio.' },
        //     leido:       { type: 'boolean', example: false },
        //     creadoEn:    { type: 'string',  format: 'date-time' },
        //   },
        // },
        // CrearMensaje: {
        //   type: 'object',
        //   required: ['nombre', 'email', 'mensaje'],
        //   properties: {
        //     nombre:      { type: 'string',  example: 'Ana García' },
        //     email:       { type: 'string',  example: 'ana@email.com' },
        //     servicio:    { type: 'string',  example: 'Desarrollo Web Full Stack' },
        //     presupuesto: { type: 'integer', example: 1500 },
        //     fecha:       { type: 'string',  format: 'date', example: '2026-11-15' },
        //     mensaje:     { type: 'string',  example: 'Hola, necesito una página web para mi negocio.' },
        //   },
        // },
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