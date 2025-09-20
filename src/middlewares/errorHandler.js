const { AppError, ValidationError, BusinessRuleError } = require('../utils/errors');
const ResponseFormatter = require('../utils/responseFormatter');
const Logger = require('../utils/logger');

const handleCastErrorDB = (err) => {
  const message = `Valor inválido ${err.value} para el campo ${err.path}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errors[0].value;
  const message = `El valor '${value}' ya existe. Por favor usa otro valor.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = err.errors.map(el => el.message);
  const message = `Datos inválidos. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Token inválido. Por favor inicia sesión de nuevo.', 401);

const handleJWTExpiredError = () =>
  new AppError('Tu token ha expirado. Por favor inicia sesión de nuevo.', 401);

const sendErrorDev = (err, req, res) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  // Errores operacionales, confiables: enviar mensaje al cliente
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  
  // Error de programación: no filtrar detalles
  console.error('ERROR 💥', err);
  return res.status(500).json({
    status: 'error',
    message: 'Algo salió mal!',
  });
};

module.exports = (err, req, res, next) => {
  // Log error
  Logger.error('Application Error', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle different error types with professional responses
  if (err instanceof ValidationError) {
    return ResponseFormatter.validationError(res, err.validationErrors, err.message);
  }

  if (err instanceof BusinessRuleError) {
    return ResponseFormatter.error(res, err.message, err.statusCode, {
      rule: err.rule,
      context: err.context,
    });
  }

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.name === 'SequelizeUniqueConstraintError') error = handleDuplicateFieldsDB(error);
    if (error.name === 'SequelizeValidationError') error = ValidationError.fromSequelize(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};

