const ServiceRegistry = require('../container/serviceRegistry');
const ResponseFormatter = require('../utils/responseFormatter');
const catchAsync = require('../utils/catchAsync');

/**
 * Lawyer Controller
 */

const createLawyer = catchAsync(async (req, res, next) => {
  const lawyerService = ServiceRegistry.get('LawyerService');
  
  const lawyer = await lawyerService.create(req.body);

  return ResponseFormatter.created(res, { lawyer }, 'Abogado creado exitosamente');
});

const getLawyers = catchAsync(async (req, res, next) => {
  const lawyerService = ServiceRegistry.get('LawyerService');
  const { page, limit, status, specialization } = req.query;

  const options = { page, limit };
  
  // Apply filters
  if (status) options.where = { ...options.where, status };
  if (specialization) {
    return await getLawyersBySpecialization(req, res, next);
  }

  const result = await lawyerService.getAll(options);

  return ResponseFormatter.paginated(
    res, 
    result.data, 
    result.pagination, 
    'Abogados obtenidos exitosamente'
  );
});

const getLawyerById = catchAsync(async (req, res, next) => {
  const lawyerService = ServiceRegistry.get('LawyerService');
  const { id } = req.params;
  const { includeStats } = req.query;

  let result;
  
  if (includeStats === 'true') {
    result = await lawyerService.getLawyerWithStats(id);
  } else {
    result = await lawyerService.getById(id);
  }

  return ResponseFormatter.success(res, { lawyer: result }, 'Abogado obtenido exitosamente');
});

const getActiveLawyers = catchAsync(async (req, res, next) => {
  const lawyerService = ServiceRegistry.get('LawyerService');
  const { page, limit } = req.query;

  const result = await lawyerService.getActiveLawyers({ page, limit });

  return ResponseFormatter.paginated(
    res, 
    result.data, 
    result.pagination, 
    'Abogados activos obtenidos exitosamente'
  );
});

const getLawyersBySpecialization = catchAsync(async (req, res, next) => {
  const lawyerService = ServiceRegistry.get('LawyerService');
  const { specialization, page, limit } = req.query;

  const result = await lawyerService.getLawyersBySpecialization(specialization, { page, limit });

  return ResponseFormatter.paginated(
    res, 
    result.data, 
    result.pagination, 
    `Abogados de especialización ${specialization} obtenidos exitosamente`
  );
});

const getLawyerWorkload = catchAsync(async (req, res, next) => {
  const lawyerService = ServiceRegistry.get('LawyerService');

  const workload = await lawyerService.getLawyerWorkload();

  return ResponseFormatter.analytics(res, workload, 'Estadísticas de carga de trabajo generadas');
});

const updateLawyer = catchAsync(async (req, res, next) => {
  const lawyerService = ServiceRegistry.get('LawyerService');
  const { id } = req.params;

  const lawyer = await lawyerService.update(id, req.body);

  return ResponseFormatter.success(res, { lawyer }, 'Abogado actualizado exitosamente');
});

const deleteLawyer = catchAsync(async (req, res, next) => {
  const lawyerService = ServiceRegistry.get('LawyerService');
  const { id } = req.params;

  await lawyerService.delete(id);

  return ResponseFormatter.success(res, null, 'Abogado eliminado exitosamente');
});

module.exports = {
  createLawyer,
  getLawyers,
  getLawyerById,
  getActiveLawyers,
  getLawyersBySpecialization,
  getLawyerWorkload,
  updateLawyer,
  deleteLawyer,
};

