const CATEGORIAS = ['FRONTEND', 'BACKEND', 'FULLSTACK'];
const AREAS = ['FRONTEND', 'BACKEND', 'BASE_DATOS', 'HERRAMIENTA'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const esTextoValido = (valor, min = 1) => typeof valor === 'string' && valor.trim().length >= min;

const responder = (errores, res, next) =>
  errores.length ? res.status(400).json({ error: 'Datos inválidos', detalles: errores }) : next();

const validarId = (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'El id debe ser un número entero positivo' });
  }
  req.params.id = id;
  next();
};

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

module.exports = { CATEGORIAS, AREAS, validarId, validarProyecto, validarMensaje, validarTecnologia}