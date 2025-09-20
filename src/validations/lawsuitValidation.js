const Joi = require('joi');

const createLawsuitValidation = {
  body: Joi.object({
    case_number: Joi.string().min(3).max(50).required().messages({
      'string.empty': 'El número de caso es requerido',
      'string.min': 'El número de caso debe tener al menos 3 caracteres',
      'string.max': 'El número de caso no puede tener más de 50 caracteres',
      'any.required': 'El número de caso es requerido'
    }),
    plaintiff: Joi.string().min(2).max(200).required().messages({
      'string.empty': 'El demandante es requerido',
      'string.min': 'El demandante debe tener al menos 2 caracteres',
      'string.max': 'El demandante no puede tener más de 200 caracteres',
      'any.required': 'El demandante es requerido'
    }),
    defendant: Joi.string().min(2).max(200).required().messages({
      'string.empty': 'El demandado es requerido',
      'string.min': 'El demandado debe tener al menos 2 caracteres',
      'string.max': 'El demandado no puede tener más de 200 caracteres',
      'any.required': 'El demandado es requerido'
    }),
    case_type: Joi.string().valid('civil', 'criminal', 'labor', 'commercial').required().messages({
      'any.only': 'El tipo de caso debe ser: civil, criminal, labor o commercial',
      'any.required': 'El tipo de caso es requerido'
    }),
    status: Joi.string().valid('pending', 'assigned', 'resolved').default('pending').messages({
      'any.only': 'El estado debe ser: pending, assigned o resolved'
    })
  })
};

const getLawsuitsValidation = {
  query: Joi.object({
    status: Joi.string().valid('pending', 'assigned', 'resolved').messages({
      'any.only': 'El estado debe ser: pending, assigned o resolved'
    }),
    lawyer_id: Joi.string().uuid().messages({
      'string.guid': 'El ID del abogado debe ser un UUID válido'
    }),
    page: Joi.number().integer().min(1).default(1).messages({
      'number.base': 'La página debe ser un número',
      'number.integer': 'La página debe ser un número entero',
      'number.min': 'La página debe ser mayor a 0'
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
      'number.base': 'El límite debe ser un número',
      'number.integer': 'El límite debe ser un número entero',
      'number.min': 'El límite debe ser mayor a 0',
      'number.max': 'El límite no puede ser mayor a 100'
    })
  })
};

const assignLawyerValidation = {
  params: Joi.object({
    id: Joi.string().uuid().required().messages({
      'string.empty': 'El ID de la demanda es requerido',
      'string.guid': 'El ID debe ser un UUID válido',
      'any.required': 'El ID de la demanda es requerido'
    })
  }),
  body: Joi.object({
    lawyer_id: Joi.string().uuid().required().messages({
      'string.empty': 'El ID del abogado es requerido',
      'string.guid': 'El ID del abogado debe ser un UUID válido',
      'any.required': 'El ID del abogado es requerido'
    })
  })
};

module.exports = {
  createLawsuitValidation,
  getLawsuitsValidation,
  assignLawyerValidation,
};

