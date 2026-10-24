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