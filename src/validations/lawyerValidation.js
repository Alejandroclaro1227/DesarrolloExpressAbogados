const Joi = require('joi');

const createLawyerValidation = {
  body: Joi.object({
    name: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'El nombre es requerido',
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede tener más de 100 caracteres',
      'any.required': 'El nombre es requerido'
    }),
    email: Joi.string().email().required().messages({
      'string.empty': 'El email es requerido',
      'string.email': 'Debe ser un email válido',
      'any.required': 'El email es requerido'
    }),
    phone: Joi.string().min(7).max(15).required().messages({
      'string.empty': 'El teléfono es requerido',
      'string.min': 'El teléfono debe tener al menos 7 caracteres',
      'string.max': 'El teléfono no puede tener más de 15 caracteres',
      'any.required': 'El teléfono es requerido'
    }),
    specialization: Joi.string().min(2).max(100).required().messages({
      'string.empty': 'La especialización es requerida',
      'string.min': 'La especialización debe tener al menos 2 caracteres',
      'string.max': 'La especialización no puede tener más de 100 caracteres',
      'any.required': 'La especialización es requerida'
    }),
    status: Joi.string().valid('active', 'inactive').default('active').messages({
      'any.only': 'El estado debe ser active o inactive'
    })
  })
};

const getLawyersValidation = {
  query: Joi.object({
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

const getLawyerByIdValidation = {
  params: Joi.object({
    id: Joi.string().uuid().required().messages({
      'string.empty': 'El ID es requerido',
      'string.guid': 'El ID debe ser un UUID válido',
      'any.required': 'El ID es requerido'
    })
  })
};

module.exports = {
  createLawyerValidation,
  getLawyersValidation,
  getLawyerByIdValidation,
};

