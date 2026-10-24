const prisma = require('../lib/prisma');
const { CATEGORIAS } = require('../middlewares/validar');

const conTecnologias = { tecnologias: { select: { id: true, nombre: true, area: true } } };

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

module.exports = {  obtenerPorId, obtenerTodos,crear,actualizar,eliminar}