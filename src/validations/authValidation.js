const Joi = require('joi');

const loginValidation = {
  body: Joi.object({
    username: Joi.string().min(3).max(50).required().messages({
      'string.empty': 'El nombre de usuario es requerido',
      'string.min': 'El nombre de usuario debe tener al menos 3 caracteres',
      'string.max': 'El nombre de usuario no puede tener más de 50 caracteres',
      'any.required': 'El nombre de usuario es requerido'
    }),
    password: Joi.string().min(6).required().messages({
      'string.empty': 'La contraseña es requerida',
      'string.min': 'La contraseña debe tener al menos 6 caracteres',
      'any.required': 'La contraseña es requerida'
    })
  })
};

module.exports = {
  loginValidation,
};

