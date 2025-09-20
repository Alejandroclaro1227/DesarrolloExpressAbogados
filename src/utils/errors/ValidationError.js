const BaseError = require('./BaseError');

/**
 * Validation Error Class
 * Used for input validation failures
 */
class ValidationError extends BaseError {
  constructor(message, validationErrors = []) {
    super(message, 400, 'VALIDATION_ERROR', true);
    this.validationErrors = validationErrors;
  }

  /**
   * Create from Joi validation error
   */
  static fromJoi(joiError) {
    const validationErrors = joiError.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context?.value,
    }));

    return new ValidationError('Validation failed', validationErrors);
  }

  /**
   * Create from Sequelize validation error
   */
  static fromSequelize(sequelizeError) {
    const validationErrors = sequelizeError.errors.map(error => ({
      field: error.path,
      message: error.message,
      value: error.value,
    }));

    return new ValidationError('Database validation failed', validationErrors);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      validationErrors: this.validationErrors,
    };
  }
}

module.exports = ValidationError;
