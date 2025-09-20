const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const authenticate = catchAsync(async (req, res, next) => {
  // 1) Obtener el token del header
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('No estás autenticado. Por favor inicia sesión.', 401));
  }

  // 2) Verificar el token
  const decoded = verifyToken(token);

  // 3) Verificar si el usuario aún existe
  const currentUser = await User.findByPk(decoded.id);
  if (!currentUser) {
    return next(new AppError('El usuario ya no existe.', 401));
  }

  // 4) Agregar el usuario a la request
  req.user = currentUser;
  next();
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('No tienes permisos para realizar esta acción.', 403));
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};

