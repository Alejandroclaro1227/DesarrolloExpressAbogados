const { User } = require('../models');
const { generateToken } = require('../utils/jwt');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  // 1) Verificar si el usuario existe y la contraseña es correcta
  const user = await User.findOne({ where: { username } });

  if (!user || !(await user.validatePassword(password))) {
    return next(new AppError('Usuario o contraseña incorrectos', 401));
  }

  // 2) Generar token
  const token = generateToken({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  // 3) Enviar respuesta
  res.status(200).json({
    status: 'success',
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    },
  });
});

const getProfile = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});

module.exports = {
  login,
  getProfile,
};

