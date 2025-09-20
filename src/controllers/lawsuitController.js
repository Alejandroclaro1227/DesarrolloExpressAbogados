const { Lawsuit, Lawyer } = require('../models');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const createLawsuit = catchAsync(async (req, res, next) => {
  const lawsuit = await Lawsuit.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      lawsuit,
    },
  });
});

const getLawsuits = catchAsync(async (req, res, next) => {
  const { page, limit, status, lawyer_id } = req.query;
  const offset = (page - 1) * limit;

  // Construir filtros
  const where = {};
  if (status) where.status = status;
  if (lawyer_id) where.lawyer_id = lawyer_id;

  const { count, rows: lawsuits } = await Lawsuit.findAndCountAll({
    where,
    limit,
    offset,
    include: [
      {
        model: Lawyer,
        as: 'lawyer',
        attributes: ['id', 'name', 'specialization'],
      },
    ],
    order: [['created_at', 'DESC']],
  });

  const totalPages = Math.ceil(count / limit);

  res.status(200).json({
    status: 'success',
    data: {
      lawsuits,
      pagination: {
        page,
        limit,
        total: count,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      filters: {
        status,
        lawyer_id,
      },
    },
  });
});

const assignLawyer = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { lawyer_id } = req.body;

  // Verificar que la demanda existe
  const lawsuit = await Lawsuit.findByPk(id);
  if (!lawsuit) {
    return next(new AppError('Demanda no encontrada', 404));
  }

  // Verificar que el abogado existe y está activo
  const lawyer = await Lawyer.findByPk(lawyer_id);
  if (!lawyer) {
    return next(new AppError('Abogado no encontrado', 404));
  }

  if (lawyer.status !== 'active') {
    return next(new AppError('El abogado no está activo', 400));
  }

  // Asignar abogado y cambiar estado
  await lawsuit.update({
    lawyer_id,
    status: 'assigned',
  });

  // Obtener la demanda actualizada con el abogado
  const updatedLawsuit = await Lawsuit.findByPk(id, {
    include: [
      {
        model: Lawyer,
        as: 'lawyer',
        attributes: ['id', 'name', 'specialization'],
      },
    ],
  });

  res.status(200).json({
    status: 'success',
    data: {
      lawsuit: updatedLawsuit,
    },
  });
});

module.exports = {
  createLawsuit,
  getLawsuits,
  assignLawyer,
};

