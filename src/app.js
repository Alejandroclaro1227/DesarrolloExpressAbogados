const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const config = require('./config/config');
const { swaggerUi, specs } = require('./config/swagger');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { AppError } = require('./utils/errors');
const ServiceRegistry = require('./container/serviceRegistry');
const Logger = require('./utils/logger');

// Initialize services
ServiceRegistry.initialize();

const app = express();

// Configuración de seguridad
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tudominio.com'] 
    : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    status: 'error',
    message: 'Demasiadas peticiones desde esta IP, intenta de nuevo más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Logging
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Gestor Abogados API Documentation',
}));

// Rutas principales
app.use('/api', routes);

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Bienvenido a la API de Gestor de Abogados',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: '/api/auth',
      lawyers: '/api/lawyers',
      lawsuits: '/api/lawsuits',
      reports: '/api/reports',
    },
  });
});

// Manejo de rutas no encontradas
app.all('*', (req, res, next) => {
  next(new AppError(`No se pudo encontrar ${req.originalUrl} en este servidor!`, 404));
});

// Middleware global de manejo de errores
app.use(errorHandler);

// Manejo de errores no capturados
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Cerrando...');
  console.log(err.name, err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Cerrando...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Documentation available at: http://localhost:${PORT}/api-docs`);
  console.log(`Environment: ${config.nodeEnv}`);
});

module.exports = app;

