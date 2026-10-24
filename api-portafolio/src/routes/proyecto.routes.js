const router = require('express').Router();
const ctrl=require('../controllers/proyecto.controller');
const {validarId, validarProyecto} = require('../middlewares/validar');

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
router.get('/',ctrl.obtenerTodos);

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
router.post('/',  validarProyecto, ctrl.crear);

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
router.put('/:id',  validarId, validarProyecto, ctrl.actualizar);

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
router.delete('/:id', validarId, ctrl.eliminar);

module.exports = router;