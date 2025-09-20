const { Lawyer, Lawsuit } = require('../models');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const getLawyerLawsuits = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Verificar que el abogado existe
  const lawyer = await Lawyer.findByPk(id);
  if (!lawyer) {
    return next(new AppError('Abogado no encontrado', 404));
  }

  // Obtener las demandas del abogado
  const lawsuits = await Lawsuit.findAll({
    where: { lawyer_id: id },
    attributes: ['id', 'case_number', 'status', 'case_type', 'plaintiff', 'defendant', 'created_at'],
    order: [['created_at', 'DESC']],
  });

  // Estadísticas
  const stats = {
    total: lawsuits.length,
    pending: lawsuits.filter(l => l.status === 'pending').length,
    assigned: lawsuits.filter(l => l.status === 'assigned').length,
    resolved: lawsuits.filter(l => l.status === 'resolved').length,
    byType: {
      civil: lawsuits.filter(l => l.case_type === 'civil').length,
      criminal: lawsuits.filter(l => l.case_type === 'criminal').length,
      labor: lawsuits.filter(l => l.case_type === 'labor').length,
      commercial: lawsuits.filter(l => l.case_type === 'commercial').length,
    }
  };

  res.status(200).json({
    status: 'success',
    data: {
      lawyer: {
        id: lawyer.id,
        name: lawyer.name,
        email: lawyer.email,
        specialization: lawyer.specialization,
        status: lawyer.status,
      },
      lawsuits,
      stats,
    },
  });
});

module.exports = {
  getLawyerLawsuits,
};

