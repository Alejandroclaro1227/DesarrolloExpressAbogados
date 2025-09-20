const { ValidationError } = require('../utils/errors');

const validate = (schema) => {
  return (req, res, next) => {
    const validationErrors = {};

    // Validar body
    if (schema.body) {
      const { error, value } = schema.body.validate(req.body);
      if (error) {
        validationErrors.body = error.details.map(detail => detail.message);
      } else {
        req.body = value;
      }
    }

    // Validar query parameters
    if (schema.query) {
      const { error, value } = schema.query.validate(req.query);
      if (error) {
        validationErrors.query = error.details.map(detail => detail.message);
      } else {
        req.query = value;
      }
    }

    // Validar params
    if (schema.params) {
      const { error, value } = schema.params.validate(req.params);
      if (error) {
        validationErrors.params = error.details.map(detail => detail.message);
      } else {
        req.params = value;
      }
    }

    // Si hay errores de validación, retornar error
    if (Object.keys(validationErrors).length > 0) {
      const errors = Object.entries(validationErrors).flatMap(([section, messages]) =>
        messages.map(message => ({
          field: section,
          message,
        }))
      );
      
      return next(new ValidationError('Validation failed', errors));
    }

    next();
  };
};

module.exports = validate;

