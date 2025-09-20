/**
 * Error Classes Export
 * Centralized export of all custom error classes
 */

const BaseError = require('./BaseError');
const ValidationError = require('./ValidationError');
const BusinessRuleError = require('./BusinessRuleError');

// Keep backward compatibility with existing AppError
const AppError = BaseError;

module.exports = {
  BaseError,
  ValidationError,
  BusinessRuleError,
  AppError, // Backward compatibility
};
